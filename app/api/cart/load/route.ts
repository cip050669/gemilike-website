import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';

// Shared memory store for cart data
const memoryCartStore = new Map<string, { items: unknown[]; coupon: unknown | null }>();

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stored = memoryCartStore.get(userId);

    if (!stored) {
      return NextResponse.json({ items: [], coupon: null });
    }

    return NextResponse.json({
      items: stored.items,
      coupon: stored.coupon ?? null,
    });
  } catch (error) {
    console.error('Error loading cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
