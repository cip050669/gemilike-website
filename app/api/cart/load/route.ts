import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Load cart from database
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!cart) {
      return NextResponse.json({ items: [], coupon: null });
    }

    return NextResponse.json({
      items: JSON.parse(cart.items || '[]'),
      coupon: cart.coupon ? JSON.parse(cart.coupon) : null
    });
  } catch (error) {
    console.error('Error loading cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
