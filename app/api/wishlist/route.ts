import { NextRequest, NextResponse } from 'next/server';
import {
  getWishlistSummary,
  toggleWishlistItem,
  removeWishlistItem,
} from '@/lib/actions/wishlist';

export async function GET() {
  try {
    const summary = await getWishlistSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { gemstoneId } = await request.json();

    if (typeof gemstoneId !== 'string' || !gemstoneId.trim()) {
      return NextResponse.json({ error: 'gemstoneId is required' }, { status: 400 });
    }

    const summary = await toggleWishlistItem(gemstoneId.trim());
    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wishlistItemId = searchParams.get('wishlistItemId');
    const gemstoneId = searchParams.get('gemstoneId');

    if (wishlistItemId) {
      const summary = await removeWishlistItem(wishlistItemId);
      return NextResponse.json(summary);
    }

    if (gemstoneId) {
      const summary = await toggleWishlistItem(gemstoneId);
      return NextResponse.json(summary);
    }

    return NextResponse.json(
      { error: 'wishlistItemId or gemstoneId is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
