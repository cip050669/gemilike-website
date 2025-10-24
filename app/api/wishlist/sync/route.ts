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

    // Clear existing wishlist items for this user
    await prisma.wishlistItem.deleteMany({
      where: { userId: userId }
    });

    // Add new wishlist items
    if (items && items.length > 0) {
      await prisma.wishlistItem.createMany({
        data: items.map((item: any) => ({
          userId: userId,
          gemstoneId: item.gemstoneId,
          notes: item.notes || null
        }))
      });
    }

    // Fetch updated wishlist
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: userId },
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
