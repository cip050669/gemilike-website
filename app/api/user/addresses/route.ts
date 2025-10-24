import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        isDefault: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      addresses
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, firstName, lastName, company, address1, address2, city, state, postalCode, country, phone, isDefault } = body;

    // If this is set as default, unset other defaults of the same type
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: session.user.id,
          type: type
        },
        data: {
          isDefault: false
        }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
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
    console.error('Error creating address:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create address' },
      { status: 500 }
    );
  }
}
