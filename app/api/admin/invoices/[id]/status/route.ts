import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, InvoiceStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Rechnungsstatus aktualisieren
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, paymentDate } = body;

    const updateData: {
      status?: InvoiceStatus;
      paymentStatus?: PaymentStatus;
      paymentDate?: Date;
    } = {};
    if (status && ['DRAFT', 'ISSUED', 'SENT', 'OVERDUE', 'PAID'].includes(status)) {
      updateData.status = status as InvoiceStatus;
    }
    if (paymentStatus && ['UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED'].includes(paymentStatus)) {
      updateData.paymentStatus = paymentStatus as PaymentStatus;
    }
    if (paymentDate) updateData.paymentDate = new Date(paymentDate);

    const invoice = await prisma.invoice.update({
      where: { id: id },
      data: updateData,
      include: {
        customer: true,
        items: true
      }
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice status' },
      { status: 500 }
    );
  }
}

