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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get customer data if exists
    const customer = await prisma.customer.findUnique({
      where: { userId },
      select: {
        firstName: true,
        lastName: true,
        company: true,
        phone: true,
        email: true,
        preferredLanguage: true,
        marketingOptIn: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        firstName: customer?.firstName || null,
        lastName: customer?.lastName || null,
        company: customer?.company || null,
        preferredLanguage: customer?.preferredLanguage || 'de',
        marketingOptIn: customer?.marketingOptIn || false,
      },
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, phone, firstName, lastName, company, preferredLanguage, marketingOptIn } = body;

    // Update User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        image: true,
      },
    });

    // Update or create Customer
    const customer = await prisma.customer.upsert({
      where: { userId },
      update: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(company !== undefined && { company }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(preferredLanguage !== undefined && { preferredLanguage }),
        ...(marketingOptIn !== undefined && { marketingOptIn }),
      },
      create: {
        userId,
        customerNumber: `CUST-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(company !== undefined && { company }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(preferredLanguage !== undefined && { preferredLanguage }),
        ...(marketingOptIn !== undefined && { marketingOptIn }),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        firstName: customer.firstName,
        lastName: customer.lastName,
        company: customer.company,
        preferredLanguage: customer.preferredLanguage,
        marketingOptIn: customer.marketingOptIn,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

