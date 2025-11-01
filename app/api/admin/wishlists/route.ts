import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// GET: Get all wishlists for admin
export async function GET(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const gemstoneId = searchParams.get('gemstoneId');

    const wishlists = await prisma.wishlist.findMany({
      where: {
        ...(customerId && { customerId }),
        ...(gemstoneId && {
          items: {
            some: {
              gemstoneId,
            },
          },
        }),
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            customerNumber: true,
          },
        },
        items: {
          include: {
            gemstone: {
              select: {
                id: true,
                name: true,
                slug: true,
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Analytics: Most popular gemstones in wishlists
    const allWishlistItems = await prisma.wishlistItem.findMany({
      include: {
        gemstone: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
          },
        },
      },
    });

    interface GemstoneCount {
      gemstone: {
        id: string;
        name: string;
        slug: string;
        category: string;
      };
      count: number;
    }
    const gemstoneCounts = new Map<string, GemstoneCount>();
    allWishlistItems.forEach((item) => {
      if (item.gemstone) {
        const gemstoneId = item.gemstone.id;
        const current = gemstoneCounts.get(gemstoneId) || {
          gemstone: item.gemstone,
          count: 0,
        };
        gemstoneCounts.set(gemstoneId, {
          ...current,
          count: current.count + 1,
        });
      }
    });

    const popularGemstones = Array.from(gemstoneCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      wishlists: wishlists.map((wishlist) => ({
        id: wishlist.id,
        name: wishlist.name || 'Standard-Merkliste',
        isPrimary: wishlist.isPrimary,
        customer: wishlist.customer
          ? {
              id: wishlist.customer.id,
              name: `${wishlist.customer.firstName || ''} ${wishlist.customer.lastName || ''}`.trim() || 'Unbekannt',
              email: wishlist.customer.email || null,
              customerNumber: wishlist.customer.customerNumber,
            }
          : null,
        itemCount: wishlist.items.length,
        items: wishlist.items.map((item) => ({
          id: item.id,
          gemstone: item.gemstone
            ? {
                id: item.gemstone.id,
                name: item.gemstone.name,
                slug: item.gemstone.slug,
                category: item.gemstone.category,
              }
            : null,
          notes: item.notes || null,
          createdAt: item.createdAt.toISOString(),
        })),
        createdAt: wishlist.createdAt.toISOString(),
        updatedAt: wishlist.updatedAt.toISOString(),
      })),
      analytics: {
        totalWishlists: wishlists.length,
        totalItems: allWishlistItems.length,
        totalCustomers: new Set(wishlists.map((w) => w.customerId).filter(Boolean)).size,
        popularGemstones,
      },
    });
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlists' },
      { status: 500 }
    );
  }
}

