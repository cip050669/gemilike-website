import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Alle Analysen abrufen (öffentlich für published, admin für alle)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';
    const published = searchParams.get('published');

    // Check if user is admin
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as { role?: string }).role === 'ADMIN';

    // Build where clause
    const where: any = {
      locale,
    };

    // Non-admin users can only see published analyses
    if (!isAdmin) {
      where.published = true;
    } else if (published !== null) {
      where.published = published === 'true';
    }

    const analyses = await prisma.gemstoneAnalysis.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      analyses,
      total: analyses.length,
    });

  } catch (error) {
    console.error('Error fetching gemstone analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses' },
      { status: 500 }
    );
  }
}

// POST - Neue Analyse erstellen (authentifiziert)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      imageUrl,
      imageName,
      primaryColor,
      secondaryColors,
      luminanceSaturation,
      spectralCharacteristic,
      giaColorGrade,
      overallImpression,
      pleochroism,
      locale = 'de',
      notes,
      tags = [],
      published = false,
      featured = false,
    } = body;

    if (!primaryColor || !overallImpression) {
      return NextResponse.json(
        { error: 'Primary color and overall impression are required' },
        { status: 400 }
      );
    }

    const analysis = await prisma.gemstoneAnalysis.create({
      data: {
        imageUrl,
        imageName,
        primaryColor,
        secondaryColors: secondaryColors || [],
        luminanceSaturation,
        spectralCharacteristic,
        giaColorGrade,
        overallImpression,
        pleochroism: pleochroism || null,
        locale,
        notes: notes || null,
        tags: tags || [],
        published,
        featured,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, analysis }, { status: 201 });

  } catch (error) {
    console.error('Error creating gemstone analysis:', error);
    return NextResponse.json(
      { error: 'Failed to create analysis' },
      { status: 500 }
    );
  }
}

