import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { isPayPalConfigured, PAYPAL_API_BASE_URL } from '@/lib/paypal/config';

/**
 * Capture PayPal Order
 * 
 * This endpoint captures a PayPal order after customer approval.
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
    const { paypalOrderId, orderId } = body;

    if (!paypalOrderId || !orderId) {
      return NextResponse.json(
        { error: 'PayPal Order ID and Order ID are required' },
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

    // Capture PayPal order via PayPal API
    const captureResponse = await fetch(
      `${PAYPAL_API_BASE_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
          ).toString('base64')}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      console.error('PayPal Capture Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to capture PayPal order', details: errorData },
        { status: captureResponse.status }
      );
    }

    const captureData = await captureResponse.json();

    // Check if capture was successful
    if (captureData.status === 'COMPLETED') {
      // Update order with payment status
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          paymentMethod: 'PAYPAL',
          paidAt: new Date(),
          notes: JSON.stringify({
            paypalOrderId: paypalOrderId,
            paypalCaptureId: captureData.purchase_units[0]?.payments?.captures[0]?.id,
            paypalStatus: captureData.status,
            paypalDetails: captureData,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        status: captureData.status,
        orderId: orderId,
        paymentStatus: 'PAID',
      });
    } else {
      // Payment not completed
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PENDING',
          notes: JSON.stringify({
            paypalOrderId: paypalOrderId,
            paypalStatus: captureData.status,
            paypalDetails: captureData,
          }),
        },
      });

      return NextResponse.json({
        success: false,
        status: captureData.status,
        message: 'Payment not completed',
      });
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


