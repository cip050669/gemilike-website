import { NextRequest, NextResponse } from 'next/server';
import { regenerateAndSendInvoice } from '@/lib/services/invoice';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import {
  deleteOrder,
  getOrderById,
  updateOrder,
  type ShopOrder,
} from '@/lib/services/shop/order.service';

const parseAmount = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const shouldTriggerInvoice = (previous: ShopOrder, current: ShopOrder) => {
  const previousPayment = previous.paymentStatus?.toUpperCase?.() ?? previous.paymentStatus;
  const previousStatus = previous.status?.toUpperCase?.() ?? previous.status;
  const currentPayment = current.paymentStatus?.toUpperCase?.() ?? current.paymentStatus;
  const currentStatus = current.status?.toUpperCase?.() ?? current.status;

  const paymentBecamePaid = previousPayment !== 'PAID' && currentPayment === 'PAID';
  const statusBecameFulfilled = previousStatus !== 'FULFILLED' && currentStatus === 'FULFILLED';

  return {
    shouldDispatch: (paymentBecamePaid || statusBecameFulfilled) && currentPayment === 'PAID',
    paymentBecamePaid,
    statusBecameFulfilled,
  };
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Bestellung nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate order status
    const validStatuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'FULFILLED', 'CANCELLED', 'REFUNDED'];
    const validPaymentStatuses: PaymentStatus[] = ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'];

    const requestedStatus = body.status ? String(body.status).toUpperCase() : undefined;
    const requestedPaymentStatus = body.paymentStatus ? String(body.paymentStatus).toUpperCase() : undefined;

    if (requestedStatus && !validStatuses.includes(requestedStatus as OrderStatus)) {
      return NextResponse.json({ success: false, error: 'Invalid order status' }, { status: 400 });
    }

    if (requestedPaymentStatus && !validPaymentStatuses.includes(requestedPaymentStatus as PaymentStatus)) {
      return NextResponse.json({ success: false, error: 'Invalid payment status' }, { status: 400 });
    }

    const previousOrder = await getOrderById(id);

    if (!previousOrder) {
      return NextResponse.json({ success: false, error: 'Bestellung nicht gefunden' }, { status: 404 });
    }

    const paymentMethodRaw = body.paymentMethod ? String(body.paymentMethod).toUpperCase() : undefined;
    const paymentMethod =
      paymentMethodRaw && Object.values(PaymentMethod).includes(paymentMethodRaw as PaymentMethod)
        ? (paymentMethodRaw as PaymentMethod)
        : undefined;

    const updatedOrder = await updateOrder(id, {
      orderNumber: body.orderNumber ?? undefined,
      status: requestedStatus as OrderStatus | undefined,
      total: body.total !== undefined ? parseAmount(body.total) : undefined,
      subtotal: body.subtotal !== undefined ? parseAmount(body.subtotal) : undefined,
      taxAmount: body.taxAmount !== undefined ? parseAmount(body.taxAmount) : undefined,
      shippingAmount:
        body.shippingAmount !== undefined ? parseAmount(body.shippingAmount) : undefined,
      paymentMethod,
      paymentStatus: requestedPaymentStatus as PaymentStatus | undefined,
      notes: body.notes ?? undefined,
      placedAt: body.placedAt ? new Date(body.placedAt) : undefined,
      paidAt: body.paidAt ? new Date(body.paidAt) : undefined,
      canceledAt: body.canceledAt ? new Date(body.canceledAt) : undefined,
      billingAddressId: body.billingAddressId ?? undefined,
      shippingAddressId: body.shippingAddressId ?? undefined,
    });

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: 'Bestellung nicht gefunden' }, { status: 404 });
    }

    const invoiceDecision = shouldTriggerInvoice(previousOrder, updatedOrder);
    let invoiceDispatched = false;
    let invoiceError: string | null = null;

    if (invoiceDecision.shouldDispatch) {
      try {
        await regenerateAndSendInvoice(updatedOrder.id);
        invoiceDispatched = true;
      } catch (error) {
        invoiceError = (error as Error).message;
        console.error('Rechnung konnte nicht generiert oder versendet werden:', error);
      }
    }

    const responseBody: Record<string, unknown> = {
      success: true,
      data: updatedOrder,
      message: 'Bestellung erfolgreich aktualisiert',
      invoiceTriggered: invoiceDecision.shouldDispatch,
      invoiceDispatched,
    };

    if (invoiceError) {
      responseBody.invoiceError = invoiceError;
      responseBody.message += ' (Rechnung konnte nicht versendet werden)';
    } else if (invoiceDispatched) {
      responseBody.message += ' und Rechnung versendet';
    }

    return NextResponse.json(responseBody);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await deleteOrder(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Bestellung nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Bestellung erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle POST requests with _method=DELETE or _method=PUT for form submissions
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const method = formData.get('_method') as string;

    if (method === 'DELETE') {
      await deleteOrder(id);

      return NextResponse.redirect(new URL('/de/admin/orders', request.url));
    }

    if (method === 'PUT') {
      const previousOrder = await getOrderById(id);

      if (!previousOrder) {
        return NextResponse.json({ success: false, error: 'Bestellung nicht gefunden' }, { status: 404 });
      }

      const requestedStatus = formData.get('status')
        ? String(formData.get('status')).toUpperCase()
        : undefined;
      const requestedPaymentStatus = formData.get('paymentStatus')
        ? String(formData.get('paymentStatus')).toUpperCase()
        : undefined;

      const paymentMethodRaw = formData.get('paymentMethod')
        ? String(formData.get('paymentMethod')).toUpperCase()
        : undefined;

      if (requestedStatus && !Object.values(OrderStatus).includes(requestedStatus as OrderStatus)) {
        return NextResponse.json({ success: false, error: 'Invalid order status' }, { status: 400 });
      }

      if (
        requestedPaymentStatus &&
        !Object.values(PaymentStatus).includes(requestedPaymentStatus as PaymentStatus)
      ) {
        return NextResponse.json({ success: false, error: 'Invalid payment status' }, { status: 400 });
      }

      const updatedOrder = await updateOrder(id, {
        orderNumber: (formData.get('orderNumber') as string) ?? undefined,
        status: requestedStatus as OrderStatus | undefined,
        total:
          formData.has('total') && formData.get('total') !== null
            ? parseAmount(formData.get('total'))
            : undefined,
        subtotal:
          formData.has('subtotal') && formData.get('subtotal') !== null
            ? parseAmount(formData.get('subtotal'))
            : undefined,
        taxAmount:
          formData.has('tax') && formData.get('tax') !== null
            ? parseAmount(formData.get('tax'))
            : undefined,
        shippingAmount:
          formData.has('shipping') && formData.get('shipping') !== null
            ? parseAmount(formData.get('shipping'))
            : undefined,
        paymentMethod:
          paymentMethodRaw && Object.values(PaymentMethod).includes(paymentMethodRaw as PaymentMethod)
            ? (paymentMethodRaw as PaymentMethod)
            : undefined,
        paymentStatus: requestedPaymentStatus as PaymentStatus | undefined,
        notes: (formData.get('notes') as string) ?? undefined,
      });

      if (!updatedOrder) {
        return NextResponse.json({ success: false, error: 'Bestellung nicht gefunden' }, { status: 404 });
      }

      const invoiceDecision = shouldTriggerInvoice(previousOrder, updatedOrder);

      if (invoiceDecision.shouldDispatch) {
        try {
          await regenerateAndSendInvoice(updatedOrder.id);
        } catch (error) {
          console.error(
            `Rechnung konnte nach Formular-Update nicht versendet werden: ${(error as Error).message}`
          );
        }
      }

      return NextResponse.redirect(new URL('/de/admin/orders', request.url));
    }

    return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
