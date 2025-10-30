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
  const existing = await prisma.customer.findUnique({
    where: { userId },
  });

  if (existing) {
    return existing;
  }

  const nameParts = splitName(session?.user?.name);

  return prisma.customer.create({
    data: {
      userId,
      customerNumber: generateCustomerNumber(),
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      email: session?.user?.email ?? null,
    },
  });
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
    const customer = await ensureCustomerForUser(userId, session);
    customerId = customer.id;
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
