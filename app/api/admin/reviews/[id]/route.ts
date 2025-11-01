import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// PUT: Update review (verify/unverify)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { verified } = body;

    const review = await prisma.review.update({
      where: { id },
      data: {
        ...(verified !== undefined && { verified }),
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        gemstone: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        verified: review.verified,
        customerName: review.customer
          ? `${review.customer.firstName || ''} ${review.customer.lastName || ''}`.trim() || 'Anonym'
          : 'Anonym',
        customerEmail: review.customer?.email || null,
        gemstone: review.gemstone
          ? {
              id: review.gemstone.id,
              name: review.gemstone.name,
              slug: review.gemstone.slug,
            }
          : null,
        createdAt: review.createdAt.toISOString(),
        updatedAt: review.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

