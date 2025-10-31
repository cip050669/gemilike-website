import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const toNumber = (value: Prisma.Decimal | number | bigint | null | undefined): number => {
  if (value == null) return 0;
  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }
  if (typeof value === 'bigint') {
    return Number(value);
  }
  return Number(value);
};

export async function GET() {
  try {
    const [wishlistCount, cartItemAggregate, activeCartCount, topWishlistedRaw, topCartedRaw] =
      await Promise.all([
        prisma.wishlistItem.count(),
        prisma.cartItem.aggregate({
          _sum: { quantity: true },
        }),
        prisma.cart.count({
          where: { status: 'ACTIVE' },
        }),
        prisma.wishlistItem.groupBy({
          by: ['gemstoneId'],
          _count: { gemstoneId: true },
          orderBy: {
            _count: {
              gemstoneId: 'desc',
            },
          },
          take: 5,
        }),
        prisma.cartItem.groupBy({
          by: ['gemstoneId'],
          _sum: { quantity: true },
          orderBy: {
            _sum: {
              quantity: 'desc',
            },
          },
          take: 5,
        }),
      ]);

    const gemstoneIds = Array.from(
      new Set(
        [...topWishlistedRaw, ...topCartedRaw]
          .map((entry) => entry.gemstoneId)
          .filter((id): id is string => typeof id === 'string' && id.length > 0)
      )
    );

    const gemstoneMap = gemstoneIds.length
      ? new Map(
          (
            await prisma.gemstone.findMany({
              where: { id: { in: gemstoneIds } },
              select: {
                id: true,
                name: true,
                slug: true,
              },
            })
          ).map((gem) => [gem.id, gem])
        )
      : new Map<string, { id: string; name: string; slug: string | null }>();

    const topWishlisted = topWishlistedRaw.map((entry) => {
      const gemstone = entry.gemstoneId ? gemstoneMap.get(entry.gemstoneId) : null;
      return {
        gemstoneId: entry.gemstoneId,
        name: gemstone?.name ?? 'Unbekannter Edelstein',
        slug: gemstone?.slug ?? null,
        count: entry._count.gemstoneId ?? 0,
      };
    });

    const topCarted = topCartedRaw.map((entry) => {
      const gemstone = entry.gemstoneId ? gemstoneMap.get(entry.gemstoneId) : null;
      return {
        gemstoneId: entry.gemstoneId,
        name: gemstone?.name ?? 'Unbekannter Edelstein',
        slug: gemstone?.slug ?? null,
        quantity: toNumber(entry._sum.quantity),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totals: {
          wishlistItems: wishlistCount,
          cartItems: toNumber(cartItemAggregate._sum.quantity),
          activeCarts: activeCartCount,
        },
        topWishlisted,
        topCarted,
      },
    });
  } catch (error) {
    console.error('Error loading shop metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Interner Fehler beim Laden der Shop-Kennzahlen.' },
      { status: 500 }
    );
  }
}
