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

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber,
        subtotal,
        taxAmount: tax,
        shippingAmount: shipping,
        total,
        paymentMethod: paymentMethod ? (paymentMethod as string) as any : null,
        notes,
        billingAddressId,
        shippingAddressId: shippingAddressId || billingAddressId,
        items: {
          create: items.map((item: { gemstoneId: string; quantity: number; price: number; notes?: string }) => ({
            gemstoneId: item.gemstoneId,
            quantity: item.quantity,
            unitPrice: item.price,
            unitNet: item.price,
            unitTax: 0,
            total: item.price * item.quantity,
            description: item.notes
          }))
        }
      },
      include: {
        items: true,
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

    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        items: true,
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
