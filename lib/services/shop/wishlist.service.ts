import type { Prisma } from '@prisma/client';
import { Prisma as PrismaNamespace } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  gemstoneWithRelationsInclude,
  toShopGemstone,
  type GemstoneWithRelations,
} from './gemstone.service';
import type { ShopGemstone } from './types';

export const wishlistWithItemsInclude = {
  items: {
    include: {
      gemstone: {
        include: gemstoneWithRelationsInclude,
      },
    },
  },
} satisfies Prisma.WishlistInclude;

export type WishlistWithItems = Prisma.WishlistGetPayload<{
  include: typeof wishlistWithItemsInclude;
}>;

export interface WishlistIdentity {
  customerId?: string | null;
  wishlistSessionId?: string | null;
}

export interface WishlistItemDTO {
  id: string;
  gemstoneId: string;
  gemstone: ShopGemstone | null;
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

/** Sentinel when PostgreSQL is unreachable (reads return empty wishlist). */
export const DB_UNAVAILABLE_WISHLIST_ID = '__db_unavailable__';

function isDatabaseUnreachable(error: unknown): boolean {
  if (error instanceof PrismaNamespace.PrismaClientKnownRequestError) {
    return error.code === 'P1001' || error.code === 'P1017';
  }
  const message = error instanceof Error ? error.message : '';
  return message.includes("Can't reach database server");
}

function unavailableWishlistPlaceholder(): WishlistWithItems {
  const now = new Date();
  return {
    id: DB_UNAVAILABLE_WISHLIST_ID,
    customerId: null,
    sessionId: null,
    name: 'Favoriten',
    isPrimary: true,
    createdAt: now,
    updatedAt: now,
    items: [],
  } as WishlistWithItems;
}

function assertWishlistWritable(wishlist: WishlistWithItems): void {
  if (wishlist.id === DB_UNAVAILABLE_WISHLIST_ID) {
    throw new Error(
      'Die Wunschliste ist vorübergehend nicht verfügbar (keine Verbindung zur Datenbank). Bitte starten Sie PostgreSQL oder prüfen Sie DATABASE_URL.'
    );
  }
}

const serializeWishlistItems = (wishlist: WishlistWithItems): WishlistItemDTO[] => {
  return wishlist.items.map((item) => {
    const gemstoneEntity = item.gemstone
      ? toShopGemstone(item.gemstone as GemstoneWithRelations)
      : null;

    return {
      id: item.id,
      gemstoneId: item.gemstoneId,
      gemstone: gemstoneEntity,
      name: gemstoneEntity?.name ?? 'Edelstein',
      slug: gemstoneEntity?.slug ?? null,
      image: gemstoneEntity?.images[0] ?? null,
      isSold: gemstoneEntity?.isSold ?? false,
      createdAt: item.createdAt,
    };
  });
};

export const serializeWishlist = (wishlist: WishlistWithItems): WishlistSummary => {
  const items = serializeWishlistItems(wishlist);

  return {
    id: wishlist.id,
    items,
    totalItems: items.length,
  };
};

const findCustomerWishlist = async (customerId: string) => {
  return prisma.wishlist.findFirst({
    where: {
      customerId,
      isPrimary: true,
    },
    include: wishlistWithItemsInclude,
  });
};

const findSessionWishlist = async (sessionId: string) => {
  return prisma.wishlist.findFirst({
    where: {
      sessionId,
      isPrimary: true,
    },
    include: wishlistWithItemsInclude,
  });
};

export const loadOrCreatePrimaryWishlist = async (
  identity: WishlistIdentity
): Promise<WishlistWithItems> => {
  try {
    const { customerId, wishlistSessionId } = identity;

    if (customerId) {
      const customerWishlist = await findCustomerWishlist(customerId);
      if (customerWishlist) {
        return customerWishlist;
      }

      if (wishlistSessionId) {
        const sessionWishlist = await findSessionWishlist(wishlistSessionId);
        if (sessionWishlist) {
          return prisma.wishlist.update({
            where: { id: sessionWishlist.id },
            data: {
              customerId,
              sessionId: null,
              isPrimary: true,
            },
            include: wishlistWithItemsInclude,
          });
        }
      }
    } else if (wishlistSessionId) {
      const sessionWishlist = await findSessionWishlist(wishlistSessionId);
      if (sessionWishlist) {
        return sessionWishlist;
      }
    }

    return prisma.wishlist.create({
      data: {
        name: 'Favoriten',
        isPrimary: true,
        customerId: customerId ?? null,
        sessionId: customerId ? null : wishlistSessionId ?? null,
      },
      include: wishlistWithItemsInclude,
    });
  } catch (error) {
    if (isDatabaseUnreachable(error)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[wishlist] PostgreSQL nicht erreichbar — leere Wunschliste. Starten Sie die DB (z. B. docker compose up) oder passen Sie DATABASE_URL an.'
        );
      }
      return unavailableWishlistPlaceholder();
    }
    throw error;
  }
};

export const getWishlistSummary = async (identity: WishlistIdentity): Promise<WishlistSummary> => {
  const wishlist = await loadOrCreatePrimaryWishlist(identity);
  return serializeWishlist(wishlist);
};

export const toggleWishlistGemstone = async (
  identity: WishlistIdentity,
  gemstoneId: string
): Promise<WishlistSummary> => {
  const wishlist = await loadOrCreatePrimaryWishlist(identity);
  assertWishlistWritable(wishlist);
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

  const refreshed = await loadOrCreatePrimaryWishlist(identity);
  return serializeWishlist(refreshed);
};

export const removeWishlistItemById = async (
  identity: WishlistIdentity,
  wishlistItemId: string
): Promise<WishlistSummary> => {
  await prisma.wishlistItem.delete({
    where: { id: wishlistItemId },
  });

  const refreshed = await loadOrCreatePrimaryWishlist(identity);
  return serializeWishlist(refreshed);
};

export const clearWishlistItems = async (identity: WishlistIdentity): Promise<WishlistSummary> => {
  const wishlist = await loadOrCreatePrimaryWishlist(identity);
  assertWishlistWritable(wishlist);

  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id },
  });

  const refreshed = await loadOrCreatePrimaryWishlist(identity);
  return serializeWishlist(refreshed);
};
