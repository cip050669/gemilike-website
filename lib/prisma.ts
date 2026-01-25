import { PrismaClient } from '@prisma/client';
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

      const err = error as { code?: string; message?: string };
      const errorCode = typeof err?.code === 'string' ? err.code : undefined;
      const errorMessage = typeof err?.message === 'string' ? err.message : undefined;
      
      // Check if it's a connection-related error
      const isConnectionError = 
        errorCode === 'ECONNRESET' ||
        errorCode === 'ECONNREFUSED' ||
        errorCode === 'ETIMEDOUT' ||
        errorCode === 'P1001' || // Prisma connection error
        errorCode === 'P1000' || // Prisma authentication error
        errorCode === 'P1017' || // Prisma server closed connection
        errorMessage?.includes('connection') ||
        errorMessage?.includes('aborted') ||
        errorMessage?.includes('ECONNRESET');
      
      if (!isConnectionError || attempt >= maxRetries) {
        throw error;
      }
      
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
