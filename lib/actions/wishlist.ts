'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { resolveShopIdentity } from '@/lib/server/shop-context';

const wishlistInclude = {
  items: {
    include: {
      gemstone: {
        include: {
          media: {
            orderBy: [
              { isPrimary: 'desc' },
              { position: 'asc' },
              { createdAt: 'asc' },
            ],
            take: 1,
          },
        },
      },
    },
  },
} satisfies Prisma.WishlistInclude;

type WishlistWithItems = Prisma.WishlistGetPayload<{ include: typeof wishlistInclude }>;

export interface WishlistItemDTO {
  id: string;
  gemstoneId: string;
  name: string;
  slug?: string | null;
  image?: string | null;
  isSold: boolean;
  createdAt: Date;
}

export interface WishlistSummary {
  id: string;
  items: WishlistItemDTO[];
  totalItems: number;
}

const serializeWishlist = (wishlist: WishlistWithItems): WishlistSummary => {
  const items = wishlist.items.map((item) => ({
    id: item.id,
    gemstoneId: item.gemstoneId,
    name: item.gemstone?.name ?? 'Edelstein',
    slug: item.gemstone?.slug ?? null,
    image: item.gemstone?.media?.[0]?.url ?? null,
    isSold: item.gemstone?.isSold ?? false,
    createdAt: item.createdAt,
  }));

  return {
    id: wishlist.id,
    items,
    totalItems: items.length,
  };
};

const loadWishlist = async (): Promise<WishlistWithItems> => {
  const identity = await resolveShopIdentity();

  if (identity.customerId) {
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        customerId: identity.customerId,
        isPrimary: true,
      },
      include: wishlistInclude,
    });

    if (wishlist) {
      return wishlist;
    }

    const sessionWishlist = await prisma.wishlist.findFirst({
      where: {
        sessionId: identity.wishlistSessionId,
        isPrimary: true,
      },
      include: wishlistInclude,
    });

    if (sessionWishlist) {
      const reassigned = await prisma.wishlist.update({
        where: { id: sessionWishlist.id },
        data: {
          customerId: identity.customerId,
          sessionId: null,
          isPrimary: true,
        },
        include: wishlistInclude,
      });
      return reassigned;
    }
  } else {
    const wishlist = await prisma.wishlist.findFirst({
      where: {
        sessionId: identity.wishlistSessionId,
        isPrimary: true,
      },
      include: wishlistInclude,
    });
    if (wishlist) {
      return wishlist;
    }
  }

  return prisma.wishlist.create({
    data: {
      name: 'Favoriten',
      isPrimary: true,
      customerId: identity.customerId ?? null,
      sessionId: identity.customerId ? null : identity.wishlistSessionId,
    },
    include: wishlistInclude,
  });
};

export const getWishlistSummary = async (): Promise<WishlistSummary> => {
  const wishlist = await loadWishlist();
  return serializeWishlist(wishlist);
};

export const toggleWishlistItem = async (gemstoneId: string): Promise<WishlistSummary> => {
  const wishlist = await loadWishlist();
  const existing = wishlist.items.find((item) => item.gemstoneId === gemstoneId);

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { id: existing.id },
    });
  } else {
    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        gemstoneId,
      },
    });
  }

  const refreshed = await loadWishlist();
  return serializeWishlist(refreshed);
};

export const removeWishlistItem = async (wishlistItemId: string): Promise<WishlistSummary> => {
  await prisma.wishlistItem.delete({
    where: { id: wishlistItemId },
  });
  const refreshed = await loadWishlist();
  return serializeWishlist(refreshed);
};

export const clearWishlist = async (): Promise<WishlistSummary> => {
  const wishlist = await loadWishlist();
  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id },
  });
  const refreshed = await loadWishlist();
  return serializeWishlist(refreshed);
};
