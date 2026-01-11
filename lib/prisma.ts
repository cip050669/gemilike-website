import { PrismaClient } from '@prisma/client';

// Optional import for Accelerate extension (only used if PRISMA_ACCELERATE_URL is set)
let withAccelerate: ((options?: any) => any) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const accelerateModule = require('@prisma/extension-accelerate');
  withAccelerate = accelerateModule.withAccelerate;
} catch {
  // Accelerate extension not available - will use direct connection
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Create Prisma Client with Accelerate extension or direct connection
// Prisma 7: Connection is configured via prisma.config.ts or Accelerate extension
function createPrismaClient() {
  // Prisma 7: Standard client options
  const baseClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn'] 
      : ['error'],
    errorFormat: 'pretty',
  });

  // Extend with Accelerate extension if Accelerate URL is set and extension is available
  // Accelerate extension will use PRISMA_ACCELERATE_URL from environment
  if (process.env.PRISMA_ACCELERATE_URL && withAccelerate) {
    return baseClient.$extends(withAccelerate());
  }

  // Direct connection (uses DATABASE_URL from prisma.config.ts)
  return baseClient;
}

// Create or reuse Prisma Client instance with proper configuration
// In development, this allows hot reload to pick up new Prisma Client
// Prisma 7: Uses Accelerate if PRISMA_ACCELERATE_URL is configured
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Graceful shutdown handling
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} else {
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
