import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    const method = formData.get('_method') as string;

    if (method === 'PUT') {
      // Handle PUT request via POST with _method override
      const body = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalCode: formData.get('postalCode'),
        country: formData.get('country'),
        taxId: formData.get('taxId'),
        notes: formData.get('notes'),
        isActive: formData.get('isActive') === 'on'
      };

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
          taxId: body.taxId,
          notes: body.notes,
          isActive: body.isActive,
        },
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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
