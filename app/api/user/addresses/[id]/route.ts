import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!address) {
      return NextResponse.json(
        { success: false, error: 'Address not found' },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: {
        id: params.id
      }
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, firstName, lastName, company, address1, address2, city, state, postalCode, country, phone, isDefault } = body;

    // Check if address belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
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
        where: {
          userId: session.user.id,
          type: type,
          id: { not: params.id }
        },
        data: {
          isDefault: false
        }
      });
    }

    const address = await prisma.address.update({
      where: {
        id: params.id
      },
      data: {
        type,
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        state,
        postalCode,
        country,
        phone,
        isDefault: isDefault || false
      }
    });

    return NextResponse.json({
      success: true,
      address
    });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update address' },
      { status: 500 }
    );
  }
}
