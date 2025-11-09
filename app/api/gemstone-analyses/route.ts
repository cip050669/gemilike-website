import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// GET - Alle Analysen abrufen (öffentlich für published, admin für alle)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';
    const published = searchParams.get('published');

    // Check if user is admin
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';

    // Build where clause
    const where: Prisma.GemstoneAnalysisWhereInput = {
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
      { 
        success: false,
        error: 'Failed to fetch analyses',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
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
        { 
          success: false,
          error: 'Unauthorized',
          message: 'Please log in to create an analysis'
        },
        { status: 401 }
      );
    }

    // Handle potential JSON parsing errors
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid JSON in request body',
          message: parseError instanceof Error ? parseError.message : 'JSON parse error'
        },
        { status: 400 }
      );
    }
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
      whitepoint,
      kValue,
      maskingOptions,
      customPalette,
      paletteComparisons,
      locale = 'de',
      notes,
      tags = [],
      published = false,
      featured = false,
    } = body;

    // Ensure correctedVariety is preserved in overallImpression if present
    if (overallImpression && overallImpression.correctedVariety) {
      // correctedVariety is already in overallImpression, no need to modify
    }

    if (!primaryColor || !overallImpression) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation error',
          message: 'Primary color and overall impression are required'
        },
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
        whitepoint: whitepoint || 'D65',
        kValue: kValue !== undefined && kValue !== null ? Number(kValue) : null,
        maskingOptions: maskingOptions || null,
        customPalette: customPalette || null,
        paletteComparisons: paletteComparisons || null,
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
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; message?: string };
      if (prismaError.code === 'P2002') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Duplicate entry',
            message: 'An analysis with this data already exists'
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
