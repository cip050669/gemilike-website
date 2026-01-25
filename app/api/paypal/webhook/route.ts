import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isPayPalConfigured } from '@/lib/paypal/config';

/** Webhook-Resource von PayPal (Auszug) */
interface PayPalWebhookResource {
  id?: string;
  supplementary_data?: { related_ids?: { order_id?: string } };
}

/**
 * PayPal Webhook Handler
 * 
 * This endpoint handles PayPal webhook events for payment notifications.
 * 
 * Configure webhook URL in PayPal Dashboard:
 * https://developer.paypal.com/dashboard/applications/sandbox (Sandbox)
 * https://developer.paypal.com/dashboard/applications (Live)
 */
export async function POST(request: NextRequest) {
  try {
    // Check PayPal configuration
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: 'PayPal is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const eventType = body.event_type;
    const resource = body.resource;

    console.log('PayPal Webhook Event:', eventType, resource?.id);

    // Handle different event types
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        // Payment was successfully captured
        await handlePaymentCaptureCompleted(resource);
        break;

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.REFUNDED':
        // Payment was denied or refunded
        await handlePaymentCaptureDenied(resource);
        break;

      case 'CHECKOUT.ORDER.APPROVED':
        // Order was approved by customer
        await handleOrderApproved(resource);
        break;

      default:
        console.log('Unhandled PayPal webhook event:', eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing PayPal webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptureCompleted(resource: PayPalWebhookResource) {
  try {
    const captureId = resource.id;
    const orderId = resource.supplementary_data?.related_ids?.order_id;

    // Find order by PayPal order ID in notes
    const orders = await prisma.order.findMany({
      where: {
        notes: {
          contains: orderId || '',
        },
      },
    });

    for (const order of orders) {
      const notes = order.notes ? JSON.parse(order.notes) : {};
      if (notes.paypalOrderId === orderId) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            paymentMethod: 'PAYPAL',
            paidAt: new Date(),
            notes: JSON.stringify({
              ...notes,
              paypalCaptureId: captureId,
              paypalStatus: 'COMPLETED',
              webhookReceived: new Date().toISOString(),
            }),
          },
        });
        console.log(`Order ${order.id} marked as PAID via PayPal webhook`);
      }
    }
  } catch (error) {
    console.error('Error handling payment capture completed:', error);
  }
}

async function handlePaymentCaptureDenied(resource: PayPalWebhookResource) {
  try {
    const captureId = resource.id;
    const orderId = resource.supplementary_data?.related_ids?.order_id;

    // Find order and update status
    const orders = await prisma.order.findMany({
      where: {
        notes: {
          contains: orderId || '',
        },
      },
    });

    for (const order of orders) {
      const notes = order.notes ? JSON.parse(order.notes) : {};
      if (notes.paypalOrderId === orderId) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'FAILED',
            notes: JSON.stringify({
              ...notes,
              paypalCaptureId: captureId,
              paypalStatus: 'DENIED',
              webhookReceived: new Date().toISOString(),
            }),
          },
        });
        console.log(`Order ${order.id} marked as FAILED via PayPal webhook`);
      }
    }
  } catch (error) {
    console.error('Error handling payment capture denied:', error);
  }
}

async function handleOrderApproved(resource: PayPalWebhookResource) {
  try {
    const orderId = resource.id;
    console.log(`PayPal order ${orderId} approved by customer`);
    // Order approval is handled client-side, webhook is just for logging
  } catch (error) {
    console.error('Error handling order approved:', error);
  }
}

// Allow webhook to be called without authentication (PayPal verifies via signature)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


