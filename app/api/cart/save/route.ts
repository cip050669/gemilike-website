import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, coupon } = await request.json();

    // Save cart to database
    await prisma.cart.upsert({
      where: { userId: session.user.id },
      update: {
        items: JSON.stringify(items),
        coupon: coupon ? JSON.stringify(coupon) : null,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        items: JSON.stringify(items),
        coupon: coupon ? JSON.stringify(coupon) : null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
