import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId: requestUserId, items } = await request.json();

    // Validate that the user ID matches the session
    if (requestUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer for this user
    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get or create wishlist for this customer
    let wishlist = await prisma.wishlist.findFirst({
      where: { customerId: customer.id }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: {
          customerId: customer.id
        }
      });
    }

    // Clear existing wishlist items
    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id }
    });

    // Add new wishlist items
    if (items && (items as unknown[]).length > 0) {
      await prisma.wishlistItem.createMany({
        data: (items as Array<{ gemstoneId: string; notes?: string }>).map((item) => ({
          wishlistId: wishlist.id,
          gemstoneId: item.gemstoneId,
          notes: item.notes || null
        }))
      });
    }

    // Fetch updated wishlist
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { wishlistId: wishlist.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      success: true, 
      items: wishlistItems 
    });
  } catch (error) {
    console.error('Error syncing wishlist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
