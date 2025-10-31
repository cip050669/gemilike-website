import { NextRequest, NextResponse } from 'next/server';
import {
  addCartItem,
  clearActiveCart,
  getCartSummary,
  removeCartItem,
  updateCartItemQuantity,
} from '@/lib/actions/cart';

export async function GET() {
  try {
    const summary = await getCartSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching cart summary:', error);
    return NextResponse.json({ error: 'Interner Fehler beim Laden des Warenkorbs.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { gemstoneId, quantity } = await request.json();
    if (typeof gemstoneId !== 'string' || !gemstoneId.trim()) {
      return NextResponse.json({ error: 'gemstoneId ist erforderlich.' }, { status: 400 });
    }

    if (quantity !== undefined && (typeof quantity !== 'number' || Number.isNaN(quantity))) {
      return NextResponse.json({ error: 'quantity muss eine Zahl sein.' }, { status: 400 });
    }

    const summary = await addCartItem(gemstoneId.trim(), quantity ?? 1);
    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error('Error adding cart item:', error);
    return NextResponse.json({ error: 'Interner Fehler beim Aktualisieren des Warenkorbs.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { cartItemId, quantity } = await request.json();

    if (typeof cartItemId !== 'string' || !cartItemId.trim()) {
      return NextResponse.json({ error: 'cartItemId ist erforderlich.' }, { status: 400 });
    }

    if (typeof quantity !== 'number' || Number.isNaN(quantity)) {
      return NextResponse.json({ error: 'quantity muss eine Zahl sein.' }, { status: 400 });
    }

    const summary = await updateCartItemQuantity(cartItemId.trim(), quantity);
    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return NextResponse.json({ error: 'Interner Fehler beim Aktualisieren des Warenkorbs.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clear = searchParams.get('clear');
    const cartItemId = searchParams.get('cartItemId');

    if (clear === 'true') {
      const summary = await clearActiveCart();
      return NextResponse.json(summary, { status: 200 });
    }

    if (cartItemId) {
      const summary = await removeCartItem(cartItemId);
      return NextResponse.json(summary, { status: 200 });
    }

    return NextResponse.json(
      { error: 'cartItemId oder clear=true ist erforderlich.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json({ error: 'Interner Fehler beim Aktualisieren des Warenkorbs.' }, { status: 500 });
  }
}
