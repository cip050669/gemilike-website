import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        orderNumber: body.orderNumber,
        status: body.status,
        total: parseFloat(body.total) || 0,
        subtotal: parseFloat(body.subtotal) || 0,
        tax: parseFloat(body.tax) || 0,
        shipping: parseFloat(body.shipping) || 0,
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentStatus,
        shippingMethod: body.shippingMethod,
        trackingNumber: body.trackingNumber,
        notes: body.notes,
      },
    });

    return NextResponse.json({ success: true, data: updatedOrder, message: 'Bestellung erfolgreich aktualisiert' });
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
      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          orderNumber: formData.get('orderNumber') as string,
          status: formData.get('status') as string,
          total: parseFloat(formData.get('total') as string) || 0,
          subtotal: parseFloat(formData.get('subtotal') as string) || 0,
          tax: parseFloat(formData.get('tax') as string) || 0,
          shipping: parseFloat(formData.get('shipping') as string) || 0,
          paymentMethod: formData.get('paymentMethod') as string,
          paymentStatus: formData.get('paymentStatus') as string,
          shippingMethod: formData.get('shippingMethod') as string,
          trackingNumber: formData.get('trackingNumber') as string,
          notes: formData.get('notes') as string,
        },
      });

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