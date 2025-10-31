import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { regenerateAndSendInvoice } from '@/lib/services/invoice';
import type { Order, OrderStatus, PaymentStatus } from '@prisma/client';

type OrderUpdateData = Parameters<typeof prisma.order.update>[0]['data'];

const parseAmount = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  const parsed = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const updateOrderAndDispatchInvoice = async (id: string, data: OrderUpdateData) => {
  const previousOrder = await prisma.order.findUnique({
    where: { id },
    select: {
      status: true,
      paymentStatus: true,
    },
  });

  if (!previousOrder) {
    return {
      notFound: true,
    } as const;
  }

  const updatedOrder = await prisma.order.update({
    where: { id },
    data,
  });

  const previousPayment = previousOrder.paymentStatus?.toUpperCase?.() ?? previousOrder.paymentStatus;
  const previousStatus = previousOrder.status?.toUpperCase?.() ?? previousOrder.status;
  const currentPayment = updatedOrder.paymentStatus?.toUpperCase?.() ?? updatedOrder.paymentStatus;
  const currentStatus = updatedOrder.status?.toUpperCase?.() ?? updatedOrder.status;

  const paymentBecamePaid = previousPayment !== 'PAID' && currentPayment === 'PAID';
  const statusBecameFulfilled = previousStatus !== 'FULFILLED' && currentStatus === 'FULFILLED';

  const shouldSendInvoice =
    (paymentBecamePaid || statusBecameFulfilled) && currentPayment === 'PAID';

  let invoiceDispatched = false;
  let invoiceError: string | null = null;

  if (shouldSendInvoice) {
    try {
      await regenerateAndSendInvoice(updatedOrder.id);
      invoiceDispatched = true;
    } catch (error) {
      invoiceError = (error as Error).message;
      console.error('Rechnung konnte nicht generiert oder versendet werden:', error);
    }
  }

  return {
    notFound: false,
    updatedOrder,
    shouldSendInvoice,
    invoiceDispatched,
    invoiceError,
  } as const;
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          }
        },
        orderItems: {
          include: {
            gemstone: {
              select: {
                id: true,
                name: true,
                price: true,
              }
            }
          }
        },
        billingAddress: true,
        shippingAddress: true
      }
    });

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

    if (requestedStatus && !validStatuses.includes(requestedStatus)) {
      return NextResponse.json({ success: false, error: 'Invalid order status' }, { status: 400 });
    }

    if (requestedPaymentStatus && !validPaymentStatuses.includes(requestedPaymentStatus)) {
      return NextResponse.json({ success: false, error: 'Invalid payment status' }, { status: 400 });
    }

    const updateData: OrderUpdateData = {
      orderNumber: body.orderNumber,
      status: requestedStatus as Order['status'] | undefined,
      total: parseAmount(body.total),
      subtotal: parseAmount(body.subtotal),
      taxAmount: parseAmount(body.taxAmount),
      shippingAmount: parseAmount(body.shippingAmount),
      paymentMethod: body.paymentMethod,
      paymentStatus: requestedPaymentStatus as Order['paymentStatus'] | undefined,
      shippingMethod: body.shippingMethod,
      trackingNumber: body.trackingNumber,
      notes: body.notes,
    };

    const result = await updateOrderAndDispatchInvoice(id, updateData);

    if (result.notFound) {
      return NextResponse.json({ success: false, error: 'Bestellung nicht gefunden' }, { status: 404 });
    }

    const { updatedOrder, invoiceDispatched, invoiceError, shouldSendInvoice } = result;

    const responseBody: Record<string, unknown> = {
      success: true,
      data: updatedOrder,
      message: 'Bestellung erfolgreich aktualisiert',
      invoiceTriggered: shouldSendInvoice,
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
    await prisma.order.delete({
      where: { id },
    });

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
      await prisma.order.delete({
        where: { id },
      });

      return NextResponse.redirect(new URL('/de/admin/orders', request.url));
    }

    if (method === 'PUT') {
      const requestedStatus = formData.get('status')
        ? String(formData.get('status')).toUpperCase()
        : undefined;
      const requestedPaymentStatus = formData.get('paymentStatus')
        ? String(formData.get('paymentStatus')).toUpperCase()
        : undefined;

      const updateData: OrderUpdateData = {
        orderNumber: formData.get('orderNumber') as string,
        status: requestedStatus as Order['status'] | undefined,
        total: parseAmount(formData.get('total')),
        subtotal: parseAmount(formData.get('subtotal')),
        tax: parseAmount(formData.get('tax')),
        shipping: parseAmount(formData.get('shipping')),
        paymentMethod: formData.get('paymentMethod') as string,
        paymentStatus: requestedPaymentStatus as Order['paymentStatus'] | undefined,
        shippingMethod: formData.get('shippingMethod') as string,
        trackingNumber: formData.get('trackingNumber') as string,
        notes: formData.get('notes') as string,
      };

      const result = await updateOrderAndDispatchInvoice(id, updateData);

      if (result.notFound) {
        return NextResponse.json({ success: false, error: 'Bestellung nicht gefunden' }, { status: 404 });
      }

      if (result.invoiceError) {
        console.error(
          `Rechnung konnte nach Formular-Update nicht versendet werden: ${result.invoiceError}`
        );
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
