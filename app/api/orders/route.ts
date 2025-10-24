import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      items,
      billingAddressId,
      shippingAddressId,
      shippingMethod,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      notes,
      couponCode
    } = await request.json();

    // Generate order number
    const orderNumber = `GM-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        orderNumber,
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod,
        shippingMethod,
        notes,
        billingAddressId,
        shippingAddressId: shippingAddressId || billingAddressId,
        orderItems: {
          create: items.map((item: any) => ({
            gemstoneId: item.gemstoneId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            notes: item.notes
          }))
        }
      },
      include: {
        orderItems: true,
        billingAddress: true,
        shippingAddress: true
      }
    });

    // Update coupon usage if applicable
    if (couponCode) {
      await prisma.coupon.update({
        where: { code: couponCode },
        data: { usedCount: { increment: 1 } }
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: true,
        billingAddress: true,
        shippingAddress: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
