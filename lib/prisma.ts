import { Prisma, PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Create Prisma Client with Accelerate or direct connection adapter
// Prisma 7: Requires either "adapter" or "accelerateUrl" in constructor
function createPrismaClient() {
  const baseOptions = {
    log: (process.env.NODE_ENV === 'development' 
      ? ['error', 'warn']
      : ['error']) as ('error' | 'warn' | 'info' | 'query')[],
    errorFormat: 'pretty' as const,
  };

  // Prisma 7: Use accelerateUrl if PRISMA_ACCELERATE_URL is set
  if (process.env.PRISMA_ACCELERATE_URL) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma 7 accelerateUrl-Option
    return new PrismaClient({ ...baseOptions, accelerateUrl: process.env.PRISMA_ACCELERATE_URL } as any);
  } else {
    // Prisma 7: Use adapter for direct connection
    // Create pg Pool and wrap it in PrismaPg adapter
    if (process.env.DATABASE_URL) {
      // Configure connection pool for optimal performance
      // Allow multiple concurrent connections based on environment
      const maxConnections = process.env.DATABASE_POOL_MAX 
        ? parseInt(process.env.DATABASE_POOL_MAX, 10)
        : process.env.NODE_ENV === 'production' ? 20 : 10;
      
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: maxConnections, // Allow multiple concurrent connections
        min: 2, // Maintain minimum connections for better performance
        idleTimeoutMillis: 30000, // Close idle connections after 30s
        connectionTimeoutMillis: 2000, // Timeout after 2s if connection cannot be established
      });
      const adapter = new PrismaPg(pool);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma 7 adapter-Option
      return new PrismaClient({ ...baseOptions, adapter } as any);
    } else {
      throw new Error('Either PRISMA_ACCELERATE_URL or DATABASE_URL must be set');
    }
  }
}

// Create or reuse Prisma Client instance with proper configuration
// Cache globally in both development and production to prevent connection pool exhaustion
// In development, this allows hot reload to pick up new Prisma Client
// In production (especially serverless), this prevents creating new instances on each module reload
// Prisma 7: Uses Accelerate if PRISMA_ACCELERATE_URL is configured
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Always cache the client globally to prevent multiple instances
// This is critical in production/serverless environments where modules can reload
globalForPrisma.prisma = prisma;

type ConnectionErrorLike = {
  code?: string;
  message?: string;
};

function connectionErrorFromEntry(err: unknown): boolean {
  const e = err as ConnectionErrorLike | null | undefined;
  const errorCode = typeof e?.code === 'string' ? e.code : undefined;
  const errorMessage = typeof e?.message === 'string' ? e.message : undefined;

  return (
    errorCode === 'ECONNRESET' ||
    errorCode === 'ECONNREFUSED' ||
    errorCode === 'ETIMEDOUT' ||
    errorCode === 'P1001' ||
    errorCode === 'P1000' ||
    errorCode === 'P1017' ||
    errorMessage?.includes('connection') === true ||
    errorMessage?.includes('aborted') === true ||
    errorMessage?.includes('ECONNRESET') === true ||
    errorMessage?.includes("Can't reach database server") === true ||
    errorMessage?.includes('DatabaseNotReachable') === true
  );
}

/** True for P1001/P1017, TCP/pg pool errors, Prisma 7 driver adapter "not reachable". */
export function isPrismaConnectionError(error: unknown): boolean {
  let current: unknown = error;
  const seen = new Set<unknown>();
  for (let depth = 0; depth < 8 && current != null && !seen.has(current); depth++) {
    seen.add(current);
    if (connectionErrorFromEntry(current)) {
      return true;
    }
    if (typeof current === 'object' && current !== null && 'cause' in current) {
      current = (current as { cause?: unknown }).cause;
      continue;
    }
    break;
  }
  return false;
}

export function getPrismaConnectionErrorSummary(error: unknown): string {
  const err = error as ConnectionErrorLike | null | undefined;
  if (err?.code === 'P1001' || err?.message?.includes("Can't reach database server")) {
    return err.code ?? 'P1001';
  }
  if (error instanceof Error && error.message === 'PRISMA_CONNECT_TIMEOUT') {
    return 'connect timeout';
  }
  return err?.code ?? err?.message ?? 'Unknown database connection error';
}

/** DB-Query; bei Verbindungsfehler (P1001, …) wird `fallback` zurückgegeben (z. B. leere Liste). */
export async function runWithDbFallback<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    if (isPrismaConnectionError(error)) {
      return fallback;
    }
    throw error;
  }
}

type DbReachableCache = { value: boolean; at: number };
let dbReachableCache: DbReachableCache | null = null;
const DB_REACHABLE_TTL_MS = 8000;

/**
 * Einmalige TCP/Query-Prüfung (gecached), z. B. um echte „leere DB“ von „DB down“ zu unterscheiden.
 */
export async function probeDatabaseReachable(): Promise<boolean> {
  const now = Date.now();
  if (dbReachableCache !== null && now - dbReachableCache.at < DB_REACHABLE_TTL_MS) {
    return dbReachableCache.value;
  }
  try {
    await Promise.race([
      prisma.$queryRaw(Prisma.sql`SELECT 1`),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('PRISMA_PROBE_TIMEOUT')), 2000)
      ),
    ]);
    dbReachableCache = { value: true, at: Date.now() };
    return true;
  } catch {
    dbReachableCache = { value: false, at: Date.now() };
    return false;
  }
}

/** Nach erfolgreichem DB-Start Cache zurücksetzen (optional, z. B. Tests). */
export function resetDatabaseReachableCache(): void {
  dbReachableCache = null;
}

// Graceful shutdown handling
if (process.env.NODE_ENV === 'production') {
  // In production, ensure graceful disconnection on shutdown
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
  
  process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

/**
 * Retry a database operation with exponential backoff
 * Useful for handling connection errors like ECONNRESET
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 100
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;
      if (!isPrismaConnectionError(error) || attempt >= maxRetries) {
        throw error;
      }

      const err = error as ConnectionErrorLike | null | undefined;
      const errorCode = typeof err?.code === 'string' ? err.code : undefined;
      const errorMessage = typeof err?.message === 'string' ? err.message : undefined;

      // Exponential backoff: 100ms, 200ms, 400ms
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), 1000);
      console.warn(
        `[Prisma] Connection error (attempt ${attempt}/${maxRetries}): ${errorCode || errorMessage}. Retrying in ${delay}ms...`
      );
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
