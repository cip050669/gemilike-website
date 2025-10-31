import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as string | null;

    const where: {
      OR?: Array<
        | { orderNumber: { contains: string; mode: 'insensitive' } }
        | { user: { name: { contains: string; mode: 'insensitive' } } }
        | { user: { email: { contains: string; mode: 'insensitive' } } }
      >;
      status?: OrderStatus;
    } = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status as OrderStatus;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation (can be extended)
    if (!body.userId || !body.orderNumber || !body.total) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const parseAmount = (value: unknown) => {
      if (value === null || value === undefined || value === '') {
        return 0;
      }
      const parsed = typeof value === 'number' ? value : parseFloat(String(value));
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const requestedStatus = body.status ? String(body.status).toUpperCase() : undefined;
    const validStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'FULFILLED', 'CANCELLED', 'REFUNDED'];
    const status = requestedStatus && validStatuses.includes(requestedStatus as OrderStatus)
      ? (requestedStatus as OrderStatus)
      : OrderStatus.PENDING;

    const requestedPaymentStatus = body.paymentStatus ? String(body.paymentStatus).toUpperCase() : undefined;
    const validPaymentStatuses: PaymentStatus[] = ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'];
    const paymentStatus = requestedPaymentStatus && validPaymentStatuses.includes(requestedPaymentStatus as PaymentStatus)
      ? (requestedPaymentStatus as PaymentStatus)
      : PaymentStatus.PENDING;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber: body.orderNumber,
        status,
        subtotal: parseAmount(body.subtotal),
        taxAmount: parseAmount(body.taxAmount),
        shippingAmount: parseAmount(body.shippingAmount),
        total: parseAmount(body.total),
        currency: body.currency || 'EUR',
        paymentMethod: body.paymentMethod || null,
        paymentStatus,
        shippingMethod: body.shippingMethod,
        trackingNumber: body.trackingNumber,
        notes: body.notes,
      },
    });

    return NextResponse.json({ success: true, data: newOrder, message: 'Bestellung erfolgreich erstellt' }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
