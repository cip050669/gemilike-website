import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Grundlegende Statistiken
    const [
      totalCarts,
      activeCarts,
      checkedOutCarts,
      abandonedCarts,
      totalCartItems,
      cartItemAggregate,
      ordersInPeriod,
      cartsCreatedInPeriod,
    ] = await Promise.all([
      prisma.cart.count(),
      prisma.cart.count({ where: { status: 'ACTIVE' } }),
      prisma.cart.count({ where: { status: 'CHECKED_OUT' } }),
      prisma.cart.count({ where: { status: 'ABANDONED' } }),
      prisma.cartItem.count(),
      prisma.cartItem.aggregate({
        _sum: { quantity: true },
      }),
      prisma.order.count({
        where: {
          placedAt: { gte: startDate },
        },
      }),
      prisma.cart.count({
        where: {
          createdAt: { gte: startDate },
        },
      }),
    ]);

    // Durchschnittlicher Warenkorbwert
    const cartsWithItems = await prisma.cart.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      include: {
        items: {
          include: {
            gemstone: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const cartValues = cartsWithItems.map((cart) => {
      const total = cart.items.reduce((sum, item) => {
        return sum + toNumber(item.priceSnapshot) * item.quantity;
      }, 0);
      return total;
    });

    const averageCartValue = cartValues.length > 0
      ? cartValues.reduce((sum, val) => sum + val, 0) / cartValues.length
      : 0;

    // Conversion Rate
    const conversionRate = cartsCreatedInPeriod > 0
      ? (checkedOutCarts / cartsCreatedInPeriod) * 100
      : 0;

    // Abandonment Rate
    const abandonmentRate = cartsCreatedInPeriod > 0
      ? (abandonedCarts / cartsCreatedInPeriod) * 100
      : 0;

    // Top Produkte in Warenkörben
    const topCarted = await prisma.cartItem.groupBy({
      by: ['gemstoneId'],
      _sum: { quantity: true },
      _count: { gemstoneId: true },
      where: {
        cart: {
          createdAt: { gte: startDate },
        },
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 10,
    });

    const gemstoneIds = topCarted.map((item) => item.gemstoneId);
    const gemstones = await prisma.gemstone.findMany({
      where: { id: { in: gemstoneIds } },
      select: {
        id: true,
        name: true,
        slug: true,
        priceGross: true,
      },
    });

    const gemstoneMap = new Map(gemstones.map((g) => [g.id, g]));

    const topProducts = topCarted.map((item) => ({
      gemstoneId: item.gemstoneId,
      name: gemstoneMap.get(item.gemstoneId)?.name || 'Unbekannt',
      slug: gemstoneMap.get(item.gemstoneId)?.slug || null,
      totalQuantity: toNumber(item._sum.quantity),
      cartCount: item._count.gemstoneId,
      averagePrice: gemstoneMap.get(item.gemstoneId)?.priceGross
        ? toNumber(gemstoneMap.get(item.gemstoneId)?.priceGross)
        : 0,
    }));

    // Zeitbasierte Analyse (letzte 30 Tage täglich)
    const dailyStats = await prisma.cart.groupBy({
      by: ['status', 'createdAt'],
      _count: { id: true },
      where: {
        createdAt: { gte: startDate },
      },
    });

    // Gruppiere nach Datum
    const dailyMap = new Map<string, { active: number; checkedOut: number; abandoned: number }>();
    
    dailyStats.forEach((stat) => {
      const date = stat.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(date) || { active: 0, checkedOut: 0, abandoned: 0 };
      
      if (stat.status === 'ACTIVE') existing.active = stat._count.id;
      else if (stat.status === 'CHECKED_OUT') existing.checkedOut = stat._count.id;
      else if (stat.status === 'ABANDONED') existing.abandoned = stat._count.id;
      
      dailyMap.set(date, existing);
    });

    const dailyChartData = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]) => ({
        date,
        active: stats.active,
        checkedOut: stats.checkedOut,
        abandoned: stats.abandoned,
      }));

    // Aktive Warenkörbe mit Details
    const activeCartsDetailed = await prisma.cart.findMany({
      where: {
        status: 'ACTIVE',
        createdAt: { gte: startDate },
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        items: {
          include: {
            gemstone: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 50,
    });

    const activeCartsWithTotal = activeCartsDetailed.map((cart) => {
      const total = cart.items.reduce((sum, item) => {
        return sum + toNumber(item.priceSnapshot) * item.quantity;
      }, 0);
      
      return {
        id: cart.id,
        customerId: cart.customerId,
        customer: cart.customer
          ? {
              name: `${cart.customer.firstName || ''} ${cart.customer.lastName || ''}`.trim() || 'Gast',
              email: cart.customer.email || null,
            }
          : null,
        itemCount: cart.items.length,
        totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        totalValue: total,
        currency: cart.currency,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        age: Math.floor((Date.now() - cart.createdAt.getTime()) / (1000 * 60 * 60)), // Stunden
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalCarts,
          activeCarts,
          checkedOutCarts,
          abandonedCarts,
          totalCartItems,
          totalQuantity: toNumber(cartItemAggregate._sum.quantity),
        },
        metrics: {
          averageCartValue,
          conversionRate: Math.round(conversionRate * 100) / 100,
          abandonmentRate: Math.round(abandonmentRate * 100) / 100,
          ordersInPeriod,
          cartsCreatedInPeriod,
        },
        topProducts,
        dailyChartData,
        activeCarts: activeCartsWithTotal,
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error loading cart analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

