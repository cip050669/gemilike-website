import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { customerId, notes } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // Update customer notes
    const updatedCustomer = await prisma.user.update({
      where: { id: customerId },
      data: { notes }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_CUSTOMER_NOTES',
        entityType: 'USER',
        entityId: customerId,
        details: {
          customerId,
          notes: notes.substring(0, 100) + (notes.length > 100 ? '...' : '')
        }
      }
    });

    return NextResponse.json({ success: true, customer: updatedCustomer });
  } catch (error) {
    console.error('Error updating customer notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
