import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionWithUser } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await getSessionWithUser();
    
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    console.log('API: Fetching customers...');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      OR?: Array<
        | { firstName: { contains: string; mode: 'insensitive' } }
        | { lastName: { contains: string; mode: 'insensitive' } }
        | { email: { contains: string; mode: 'insensitive' } }
        | { company: { contains: string; mode: 'insensitive' } }
      >;
      isActive?: boolean;
    } = {};
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.isActive = status === 'active';
    }

    console.log('API: Where clause:', where);

    // Get customers with pagination
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.customer.count({ where })
    ]);

    console.log('API: Found customers:', customers.length);

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId: sessionUserId } = await getSessionWithUser();
    
    if (!sessionUserId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    
    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required to create a customer' },
        { status: 400 }
      );
    }
    
    const newCustomer = await prisma.customer.create({
      data: {
        userId: body.userId,
        customerNumber: `C${Date.now()}`,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        company: body.company,
        marketingOptIn: body.marketingOptIn || false,
      },
    });

    return NextResponse.json({ success: true, data: newCustomer, message: 'Kunde erfolgreich erstellt' }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}