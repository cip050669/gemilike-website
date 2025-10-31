import { NextRequest, NextResponse } from 'next/server';
import {
  addCartItem,
  clearActiveCart,
  getCartSummary,
} from '@/lib/actions/cart';

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'items must be an array' }, { status: 400 });
    }

    await clearActiveCart();

    for (const entry of items) {
      if (!entry || typeof entry !== 'object') continue;
      const gemstoneId = typeof entry.gemstoneId === 'string' ? entry.gemstoneId : entry.id;
      const quantity =
        typeof entry.quantity === 'number' && entry.quantity > 0 ? entry.quantity : 1;

      if (typeof gemstoneId === 'string' && gemstoneId.trim()) {
        await addCartItem(gemstoneId.trim(), quantity);
      }
    }

    const summary = await getCartSummary();
    return NextResponse.json({ success: true, summary });
  } catch (error) {
    console.error('Error saving cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
