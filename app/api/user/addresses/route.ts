import { NextRequest, NextResponse } from 'next/server';
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

    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!customer) {
      return NextResponse.json({ success: true, addresses: [] });
    }

    const addresses = await prisma.address.findMany({
      where: {
        customerId: customer.id,
      },
      orderBy: {
        isDefault: 'desc'
      }
    });

    const transformed = addresses.map(({ street, street2, ...rest }) => ({
      ...rest,
      address1: street ?? '',
      address2: street2 ?? '',
    }));

    return NextResponse.json({
      success: true,
      addresses: transformed,
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // If this is set as default, unset other defaults of the same type
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          customerId: customer.id,
          type: type
        },
        data: {
          isDefault: false
        }
      });
    }

    const address = await prisma.address.create({
      data: {
        customerId: customer.id,
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
    console.error('Error creating address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create address' },
      { status: 500 }
    );
  }
}
