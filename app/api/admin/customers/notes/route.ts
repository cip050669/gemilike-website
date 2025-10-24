import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, session } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { customerId, notes } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // Ensure notes is properly formatted as JSON
    const notesData = typeof notes === 'string' ? JSON.parse(notes) : notes;

    // Update customer notes
    const updatedCustomer = await prisma.user.update({
      where: { id: customerId },
      data: { notes: notesData }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_CUSTOMER_NOTES',
        entityType: 'USER',
        entityId: customerId,
        details: JSON.stringify({
          customerId,
          notes: typeof notesData === 'string' ? notesData.substring(0, 100) + (notesData.length > 100 ? '...' : '') : JSON.stringify(notesData).substring(0, 100) + '...'
        })
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
