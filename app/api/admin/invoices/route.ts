import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      invoices: invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customer: {
          company: invoice.customer.company,
          firstName: invoice.customer.firstName,
          lastName: invoice.customer.lastName
        },
        invoiceDate: invoice.invoiceDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        status: invoice.status,
        paymentStatus: invoice.paymentStatus,
        total: invoice.total,
        currency: invoice.currency
      }))
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, items, dueDate, notes } = body;

    // Get company settings for invoice number
    const companySettings = await prisma.companySettings.findFirst();
    if (!companySettings) {
      return NextResponse.json(
        { success: false, error: 'Company settings not found' },
        { status: 400 }
      );
    }

    // Generate invoice number
    const invoiceNumber = `${companySettings.invoicePrefix}-${companySettings.nextInvoiceNumber.toString().padStart(4, '0')}`;

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: { quantity: number; unitPrice: number }) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = 0; // No VAT for small business
    const total = subtotal + taxAmount;

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        invoiceDate: new Date(),
        dueDate: new Date(dueDate),
        subtotal: subtotal,
        taxAmount: taxAmount,
        total: total,
        notes: notes || undefined,
        items: {
          create: items.map((item: { description: string; quantity: number; unitPrice: number }, index: number) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: 0,
            total: item.quantity * item.unitPrice,
            position: index
          }))
        }
      },
      include: {
        customer: true,
        items: true
      }
    });

    // Update next invoice number
    await prisma.companySettings.update({
      where: { id: companySettings.id },
      data: {
        nextInvoiceNumber: companySettings.nextInvoiceNumber + 1
      }
    });

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        customer: invoice.customer,
        invoiceDate: invoice.invoiceDate.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        status: invoice.status,
        paymentStatus: invoice.paymentStatus,
        total: invoice.total,
        currency: invoice.currency,
        items: invoice.items
      }
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}