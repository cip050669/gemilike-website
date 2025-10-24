import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type ParamsPromise = Promise<{ id: string }>;

export async function GET(request: NextRequest, { params }: { params: ParamsPromise }) {
  try {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: 'Kunde nicht gefunden' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: customer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: ParamsPromise }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        company: body.company,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country,
        notes: body.notes,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, data: updatedCustomer, message: 'Kunde erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: ParamsPromise }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const method = formData.get('_method') as string;

    const getValue = (key: string) => {
      const value = formData.get(key);
      return typeof value === 'string' ? value : undefined;
    };

    if (method === 'PUT') {
      // Handle PUT request via POST with _method override
      const updateData: Prisma.CustomerUpdateInput = {
        firstName: getValue('firstName'),
        lastName: getValue('lastName'),
        email: getValue('email'),
        phone: getValue('phone'),
        company: getValue('company'),
        address: getValue('address'),
        city: getValue('city'),
        postalCode: getValue('postalCode'),
        country: getValue('country'),
        taxId: getValue('taxId'),
        notes: getValue('notes'),
        isActive: formData.get('isActive') === 'on',
      };

      const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({ success: true, data: updatedCustomer, message: 'Kunde erfolgreich aktualisiert' });
    } else if (method === 'DELETE') {
      // Handle DELETE request via POST with _method override
      await prisma.customer.delete({
        where: { id },
      });

      return NextResponse.json({ success: true, message: 'Kunde erfolgreich gelöscht' });
    } else {
      return NextResponse.json({ success: false, error: 'Unsupported method' }, { status: 405 });
    }
  } catch (error) {
    console.error('Error processing customer request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: ParamsPromise }) {
  try {
    const { id } = await params;
    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Kunde erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
