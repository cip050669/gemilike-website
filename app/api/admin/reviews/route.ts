import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

// GET: Get all reviews for admin
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const gemstoneId = searchParams.get('gemstoneId');
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const status = searchParams.get('status'); // 'verified', 'unverified', or null for all

    const reviews = await prisma.review.findMany({
      where: {
        ...(gemstoneId && { gemstoneId }),
        ...(verifiedOnly && { verified: true }),
        ...(status === 'verified' && { verified: true }),
        ...(status === 'unverified' && { verified: false }),
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      reviews: reviews.map((review) => ({
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
      })),
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a review
export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json(
        { success: false, error: 'Review ID is required' },
        { status: 400 }
      );
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}

