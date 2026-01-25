import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { isPayPalConfigured, PAYPAL_API_BASE_URL } from '@/lib/paypal/config';

/**
 * Create PayPal Order
 * 
 * This endpoint creates a PayPal order and returns the order ID for client-side approval.
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await getSessionWithUser();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check PayPal configuration
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: 'PayPal is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { orderId, total, currency = 'EUR' } = body;

    if (!orderId || !total) {
      return NextResponse.json(
        { error: 'Order ID and total are required' },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: {
          select: { userId: true }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.customer?.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Create PayPal order via PayPal API
    const paypalResponse = await fetch(`${PAYPAL_API_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString('base64')}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: orderId,
            description: `Bestellung ${order.orderNumber}`,
            amount: {
              currency_code: currency,
              value: total.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: 'Gemilike',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/de/checkout/success?orderId=${orderId}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/de/checkout?canceled=true`,
        },
      }),
    });

    if (!paypalResponse.ok) {
      const errorData = await paypalResponse.json();
      console.error('PayPal API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create PayPal order', details: errorData },
        { status: paypalResponse.status }
      );
    }

    const paypalOrder = await paypalResponse.json();

    // Update order with PayPal order ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        notes: JSON.stringify({
          paypalOrderId: paypalOrder.id,
          paypalStatus: paypalOrder.status,
        }),
      },
    });

    return NextResponse.json({
      orderId: paypalOrder.id,
      status: paypalOrder.status,
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


