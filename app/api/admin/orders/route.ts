import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { createOrder, listOrders } from '@/lib/services/shop/order.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as string | null;

    const statusFilter =
      status && status !== 'all' && Object.values(OrderStatus).includes(status as OrderStatus)
        ? (status as OrderStatus)
        : ('all' as const);

    const orders = await listOrders({
      filters: {
        search: search || undefined,
        status: statusFilter,
      },
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
    if (!body.customerId || !body.orderNumber || !body.total) {
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

    const allowedPaymentMethods = Object.values(PaymentMethod);
    const normalizedPaymentMethod = body.paymentMethod
      ? String(body.paymentMethod).toUpperCase()
      : null;

    const paymentMethod = normalizedPaymentMethod &&
      allowedPaymentMethods.includes(normalizedPaymentMethod as PaymentMethod)
      ? (normalizedPaymentMethod as PaymentMethod)
      : null;

    const newOrder = await createOrder({
      customerId: body.customerId,
      orderNumber: body.orderNumber,
      status,
      subtotal: parseAmount(body.subtotal),
      taxAmount: parseAmount(body.taxAmount),
      shippingAmount: parseAmount(body.shippingAmount),
      total: parseAmount(body.total),
      currency: body.currency || 'EUR',
      paymentMethod,
      paymentStatus,
      notes: body.notes,
      items: Array.isArray(body.items)
        ? body.items.map(
            (item: { gemstoneId?: string | null; quantity?: number; unitPrice?: number }) => ({
              gemstoneId: item.gemstoneId ?? null,
              quantity: item.quantity ?? 1,
              unitPrice: item.unitPrice ?? 0,
            })
          )
        : undefined,
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
