import { NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get customer for this user
    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        customerId: customer.id,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
        items: {
          orderBy: {
            position: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      invoices: invoices.map((invoice) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        orderNumber: invoice.order?.orderNumber || null,
        status: invoice.status,
        paymentStatus: invoice.paymentStatus,
        invoiceDate: invoice.invoiceDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        paymentDate: invoice.paymentDate?.toISOString() || null,
        subtotal: Number(invoice.subtotal),
        taxAmount: Number(invoice.taxAmount),
        total: Number(invoice.total),
        currency: invoice.currency,
        items: invoice.items.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          total: Number(item.total),
        })),
        pdfStorageKey: invoice.pdfStorageKey || null,
      })),
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

