'use server';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionWithUser } from '@/lib/session';

const UNKNOWN_GEM_NAME = 'Unbekannter Edelstein';

export async function GET() {
  try {
    const { session } = await getSessionWithUser();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalWishlistItems, totalActiveCarts, cartItemAggregate, wishlistGroup, cartGroup] =
      await Promise.all([
        prisma.wishlistItem.count(),
        prisma.cart.count({ where: { status: 'ACTIVE' } }),
        prisma.cartItem.aggregate({
          _sum: { quantity: true },
        }),
        prisma.wishlistItem.groupBy({
          by: ['gemstoneId'],
          _count: { gemstoneId: true },
          orderBy: { _count: { gemstoneId: 'desc' } },
          take: 5,
        }),
        prisma.cartItem.groupBy({
          by: ['gemstoneId'],
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 5,
        }),
      ]);

    const wishlistGemIds = wishlistGroup.map((entry) => entry.gemstoneId);
    const cartGemIds = cartGroup.map((entry) => entry.gemstoneId);
    const uniqueGemstoneIds = Array.from(
      new Set([...wishlistGemIds, ...cartGemIds].filter((value): value is string => Boolean(value)))
    );

    const gemstones =
      uniqueGemstoneIds.length > 0
        ? await prisma.gemstone.findMany({
            where: { id: { in: uniqueGemstoneIds } },
            select: { id: true, name: true, slug: true },
          })
        : [];

    const gemstoneLookup = new Map(gemstones.map((gem) => [gem.id, gem]));

    const topWishlisted = wishlistGroup.map((entry) => {
      const gemstone = entry.gemstoneId ? gemstoneLookup.get(entry.gemstoneId) : undefined;
      return {
        gemstoneId: entry.gemstoneId,
        name: gemstone?.name ?? UNKNOWN_GEM_NAME,
        slug: gemstone?.slug ?? null,
        count: entry._count.gemstoneId,
      };
    });

    const topCarted = cartGroup.map((entry) => {
      const gemstone = entry.gemstoneId ? gemstoneLookup.get(entry.gemstoneId) : undefined;
      return {
        gemstoneId: entry.gemstoneId,
        name: gemstone?.name ?? UNKNOWN_GEM_NAME,
        slug: gemstone?.slug ?? null,
        quantity: entry._sum.quantity ?? 0,
      };
    });

    const data = {
      totals: {
        wishlistItems: totalWishlistItems,
        cartItems: cartItemAggregate._sum.quantity ?? 0,
        activeCarts: totalActiveCarts,
      },
      topWishlisted,
      topCarted,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching shop metrics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
