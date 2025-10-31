import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if address belongs to user
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

    const address = await prisma.address.findFirst({
      where: {
        id,
        customerId: customer.id,
      }
    });

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { type, firstName, lastName, company, address1, address2, city, state, postalCode, country, phone, isDefault } = body;

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        customerId: customer.id,
      }
    });

    if (!existingAddress) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    // If this is set as default, unset other defaults of the same type
    if (isDefault) {
      await prisma.address.updateMany({
        where: { customerId: customer.id, type, id: { not: id } },
        data: {
          isDefault: false
        }
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        type,
        firstName,
        lastName,
        company,
        street: address1,
        street2: address2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: Boolean(isDefault)
      }
    });

    return NextResponse.json({
      success: true,
      address: {
        ...address,
        address1: address.street ?? '',
        address2: address.street2 ?? '',
      }
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}
