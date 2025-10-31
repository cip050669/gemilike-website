import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { PaymentMethod } from '@prisma/client';
import { createOrder, listOrders } from '@/lib/services/shop/order.service';

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
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      notes,
      couponCode
    } = await request.json();

    // Get customer for this user
    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Generate order number
    const orderNumber = `GM-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const normalizedPaymentMethod = paymentMethod
      ? String(paymentMethod).toUpperCase()
      : null;

    const order = await createOrder({
      customerId: customer.id,
      orderNumber,
      subtotal,
      taxAmount: tax,
      shippingAmount: shipping,
      total,
      paymentMethod:
        normalizedPaymentMethod && Object.values(PaymentMethod).includes(normalizedPaymentMethod as PaymentMethod)
          ? (normalizedPaymentMethod as PaymentMethod)
          : null,
      notes,
      billingAddressId,
      shippingAddressId: shippingAddressId || billingAddressId,
      items: items?.map(
        (item: { gemstoneId: string; quantity: number; price: number; notes?: string }) => ({
          gemstoneId: item.gemstoneId,
          quantity: item.quantity,
          unitPrice: item.price,
          unitNet: item.price,
          unitTax: 0,
          description: item.notes ?? null,
        })
      ),
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

export async function GET() {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer for this user
    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const orders = await listOrders({
      filters: {
        customerId: customer.id,
      },
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
