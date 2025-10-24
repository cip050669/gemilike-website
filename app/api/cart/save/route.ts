import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
export const memoryCartStore = new Map<string, { items: unknown[]; coupon: unknown | null }>();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, coupon } = await request.json();

    memoryCartStore.set(userId, {
      items: Array.isArray(items) ? items : [],
      coupon: coupon ?? null,
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
