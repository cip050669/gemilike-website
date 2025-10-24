import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as string | null;

    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status as any;
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

    const newOrder = await prisma.order.create({
      data: {
        orderNumber: body.orderNumber,
        status: body.status || OrderStatus.PENDING,
        subtotal: parseFloat(body.subtotal) || 0,
        tax: parseFloat(body.tax) || 0,
        shipping: parseFloat(body.shipping) || 0,
        total: parseFloat(body.total),
        currency: body.currency || 'EUR',
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentStatus || PaymentStatus.PENDING,
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