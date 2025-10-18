import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Alle Kunden abrufen
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { invoices: true }
        }
      }
    });
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST - Neuen Kunden erstellen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Kundennummer generieren
    const lastCustomer = await prisma.customer.findFirst({
      orderBy: { customerNumber: 'desc' }
    });
    const nextNumber = lastCustomer 
      ? parseInt(lastCustomer.customerNumber.replace('K', '')) + 1 
      : 1;
    const customerNumber = `K${nextNumber.toString().padStart(5, '0')}`;

    const customer = await prisma.customer.create({
      data: {
        customerNumber,
        ...body
      }
    });

    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

// PUT - Kunden aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const customer = await prisma.customer.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE - Kunden löschen
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Customer ID required' },
        { status: 400 }
      );
    }

    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}