import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create or reuse Prisma Client instance with proper configuration
// In development, this allows hot reload to pick up new Prisma Client
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['error', 'warn'] 
    : ['error'],
  errorFormat: 'pretty',
});

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
