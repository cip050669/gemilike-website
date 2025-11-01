import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { sendReviewNotificationEmail } from '@/lib/services/review-notifications';

// GET: Get reviews for a gemstone
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gemstoneId = searchParams.get('gemstoneId');
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';

    if (!gemstoneId) {
      return NextResponse.json(
        { success: false, error: 'gemstoneId is required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        gemstoneId,
        ...(verifiedOnly && { verified: true }),
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
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
        createdAt: review.createdAt.toISOString(),
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

// POST: Create a new review
export async function POST(request: NextRequest) {
  try {
    const { userId } = await getSessionWithUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { gemstoneId, orderItemId, rating, title, comment } = body;

    if (!gemstoneId || !rating) {
      return NextResponse.json(
        { success: false, error: 'gemstoneId and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get customer for this user
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

    // Check if user has already reviewed this gemstone
    const existingReview = await prisma.review.findFirst({
      where: {
        gemstoneId,
        customerId: customer.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this gemstone' },
        { status: 409 }
      );
    }

    // Verify review if orderItemId is provided (verified purchase)
    const verified = !!orderItemId;

    const review = await prisma.review.create({
      data: {
        customerId: customer.id,
        gemstoneId,
        orderItemId: orderItemId || undefined,
        rating,
        title: title || undefined,
        comment: comment || undefined,
        verified,
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

    // Send email notification to admin (async, don't wait)
    sendReviewNotificationEmail(review).catch((error) => {
      console.error('Error sending review notification email:', error);
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
        createdAt: review.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

