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

// GET - Einzelnen Color Chart abrufen (öffentlich)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if user is admin
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as { role?: string }).role === 'ADMIN';

    const chart = await prisma.colorChart.findUnique({
      where: { id },
    });

    if (!chart) {
      return NextResponse.json(
        { error: 'Color chart not found' },
        { status: 404 }
      );
    }

    // Non-admin users can only see published charts
    if (!isAdmin && !chart.published) {
      return NextResponse.json(
        { error: 'Color chart not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, chart });

  } catch (error) {
    console.error('Error fetching color chart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch color chart' },
      { status: 500 }
    );
  }
}

// PUT - Color Chart aktualisieren (nur Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.colorChart.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Color chart not found' },
        { status: 404 }
      );
    }

    // Validate hex colors if gradient is provided
    if (body.gradient && Array.isArray(body.gradient)) {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      for (const color of body.gradient) {
        if (!hexColorRegex.test(color)) {
          return NextResponse.json(
            { error: `Invalid hex color in gradient: ${color}` },
            { status: 400 }
          );
        }
      }
    }

    if (body.pleochro && Array.isArray(body.pleochro)) {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      for (const color of body.pleochro) {
        if (!hexColorRegex.test(color)) {
          return NextResponse.json(
            { error: `Invalid hex color in pleochro: ${color}` },
            { status: 400 }
          );
        }
      }
    }

    // Update slug if name changed
    let slug = existing.slug;
    if (body.name && body.name !== existing.name) {
      slug = generateSlug(body.name);
      
      // Check if new slug already exists
      const slugCheck = await prisma.colorChart.findUnique({
        where: { slug },
      });
      
      if (slugCheck && slugCheck.id !== id) {
        // Append number if slug exists
        let counter = 1;
        let newSlug = `${generateSlug(body.name)}-${counter}`;
        while (true) {
          const check = await prisma.colorChart.findUnique({
            where: { slug: newSlug },
          });
          if (!check || check.id === id) {
            slug = newSlug;
            break;
          }
          counter++;
          newSlug = `${generateSlug(body.name)}-${counter}`;
        }
      }
    } else if (body.slug) {
      slug = body.slug;
    }

    const updatedChart = await prisma.colorChart.update({
      where: { id },
      data: {
        ...body,
        slug,
      },
    });

    return NextResponse.json({ success: true, chart: updatedChart });

  } catch (error) {
    console.error('Error updating color chart:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Color chart not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update color chart' },
      { status: 500 }
    );
  }
}

// DELETE - Color Chart löschen (nur Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    await prisma.colorChart.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Color chart deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting color chart:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Color chart not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete color chart' },
      { status: 500 }
    );
  }
}

