'use server';

import { cookies } from 'next/headers';
import { randomUUID } from 'node:crypto';
import type { Session } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { getSessionWithUser } from '@/lib/session';

const CART_SESSION_COOKIE = 'gemilike-cart-session';
const WISHLIST_SESSION_COOKIE = 'gemilike-wishlist-session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 Tage

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  maxAge: COOKIE_MAX_AGE,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

const generateCustomerNumber = () => `CUST-${Date.now()}-${Math.floor(Math.random() * 10_000)
  .toString()
  .padStart(4, '0')}`;

const splitName = (name?: string | null) => {
  if (!name) {
    return { firstName: null, lastName: null };
  }
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: null };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
};

const ensureCustomerForUser = async (userId: string, session: Session | null) => {
  // First, verify that the user exists in the database
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!userExists) {
    // In development the session can contain placeholder ids (e.g. env-admin).
    // Skip customer creation but keep session-based cart/wishlist working.
    // Only log in development mode and only once per session to avoid spam
    if (process.env.NODE_ENV === 'development' && userId === 'env-admin') {
      // This is expected in development - no need to log every time
      return null;
    }
    // For other cases, log as debug
    if (process.env.NODE_ENV === 'development') {
      console.debug(`User with id ${userId} does not exist in database. Skipping customer creation.`);
    }
    return null;
  }

  const existing = await prisma.customer.findUnique({
    where: { userId },
  });

  if (existing) {
    return existing;
  }

  const nameParts = splitName(session?.user?.name);

  try {
    return await prisma.customer.create({
      data: {
        userId,
        customerNumber: generateCustomerNumber(),
        firstName: nameParts.firstName,
        lastName: nameParts.lastName,
        email: session?.user?.email ?? null,
      },
    });
  } catch (error) {
    // If there's a foreign key constraint error, log it and re-throw with a clearer message
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      console.error(`Foreign key constraint error when creating customer for userId ${userId}:`, error);
      throw new Error(`Cannot create customer: User with id ${userId} does not exist. Please log in again.`);
    }
    throw error;
  }
};

export interface ShopIdentity {
  userId?: string;
  customerId?: string | null;
  cartSessionId: string;
  wishlistSessionId: string;
  session: Session | null;
}

export const resolveShopIdentity = async (): Promise<ShopIdentity> => {
  const { session, userId } = await getSessionWithUser();
  const cookieStore = await cookies();

  let cartSessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;
  let wishlistSessionId = cookieStore.get(WISHLIST_SESSION_COOKIE)?.value;

  if (!cartSessionId) {
    cartSessionId = randomUUID();
    cookieStore.set(CART_SESSION_COOKIE, cartSessionId, cookieOptions);
  }

  if (!wishlistSessionId) {
    wishlistSessionId = randomUUID();
    cookieStore.set(WISHLIST_SESSION_COOKIE, wishlistSessionId, cookieOptions);
  }

  let customerId: string | null = null;

  if (userId) {
    try {
      const customer = await ensureCustomerForUser(userId, session);
      customerId = customer?.id ?? null;
    } catch (error) {
      // Log the error but don't break the entire shop functionality
      // The user can still use the shop with session-based cart/wishlist
      console.error('Failed to ensure customer for user:', error);
      // customerId remains null, which is acceptable for session-based operations
    }
  }

  return {
    userId,
    customerId,
    cartSessionId,
    wishlistSessionId,
    session,
  };
};

export const clearShopSessions = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(CART_SESSION_COOKIE);
  cookieStore.delete(WISHLIST_SESSION_COOKIE);
};
