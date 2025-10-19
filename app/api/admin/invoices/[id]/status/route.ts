import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
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

