import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// GET - Alle Color Charts abrufen (öffentlich für published, admin für alle)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const origin = searchParams.get('origin');

    // Check if user is admin
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as { role?: string }).role === 'ADMIN';

    // Build where clause
    const where: any = {
      locale,
    };

    // Non-admin users can only see published charts
    if (!isAdmin) {
      where.published = true;
    } else if (published !== null) {
      where.published = published === 'true';
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (origin) {
      where.origin = {
        contains: origin,
        mode: 'insensitive',
      };
    }

    const charts = await prisma.colorChart.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ 
      success: true, 
      charts,
      total: charts.length 
    });

  } catch (error) {
    console.error('Error fetching color charts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch color charts' },
      { status: 500 }
    );
  }
}

// POST - Neuen Color Chart erstellen (nur Admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - No session. Please log in at /de/admin/login' },
        { status: 401 }
      );
    }
    if ((session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Not ADMIN' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      origin,
      locale = 'de',
      gia,
      gradient,
      pleochro,
      light = 'D55, CRI ≥95',
      note,
      description,
      published = false,
      featured = false,
      order = 0,
      slug,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!gradient || !Array.isArray(gradient) || gradient.length === 0) {
      return NextResponse.json(
        { error: 'Gradient must be a non-empty array of hex colors' },
        { status: 400 }
      );
    }

    // Validate hex colors
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    for (const color of gradient) {
      if (!hexColorRegex.test(color)) {
        return NextResponse.json(
          { error: `Invalid hex color in gradient: ${color}` },
          { status: 400 }
        );
      }
    }

    if (pleochro && Array.isArray(pleochro)) {
      for (const color of pleochro) {
        if (!hexColorRegex.test(color)) {
          return NextResponse.json(
            { error: `Invalid hex color in pleochro: ${color}` },
            { status: 400 }
          );
        }
      }
    }

    // Generate slug if not provided
    let finalSlug = slug || generateSlug(name);
    
    // Check if slug already exists
    const existing = await prisma.colorChart.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      // Append number if slug exists
      let counter = 1;
      while (existing) {
        finalSlug = `${generateSlug(name)}-${counter}`;
        const check = await prisma.colorChart.findUnique({
          where: { slug: finalSlug },
        });
        if (!check) break;
        counter++;
      }
    }

    // Validate GIA data structure
    const giaData = gia || {};
    if (typeof giaData !== 'object') {
      return NextResponse.json(
        { error: 'GIA data must be an object' },
        { status: 400 }
      );
    }

    const chart = await prisma.colorChart.create({
      data: {
        name,
        slug: finalSlug,
        origin,
        locale,
        gia: giaData,
        gradient,
        pleochro: pleochro || [],
        light,
        note,
        description,
        published,
        featured,
        order,
        createdById: session.user.id,
      },
    });

    return NextResponse.json({ success: true, chart }, { status: 201 });

  } catch (error) {
    console.error('Error creating color chart:', error);
    return NextResponse.json(
      { error: 'Failed to create color chart' },
      { status: 500 }
    );
  }
}

