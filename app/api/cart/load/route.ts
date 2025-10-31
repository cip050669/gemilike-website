import { NextResponse } from 'next/server';
import { getCartSummary } from '@/lib/actions/cart';

export async function GET() {
  try {
    const summary = await getCartSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error loading cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
