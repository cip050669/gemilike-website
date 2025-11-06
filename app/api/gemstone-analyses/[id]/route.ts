import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Einzelne Analyse abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if user is admin
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as { role?: string }).role === 'ADMIN';

    const analysis = await prisma.gemstoneAnalysis.findUnique({
      where: { id },
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

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Non-admin users can only see published analyses
    if (!isAdmin && !analysis.published) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, analysis });

  } catch (error) {
    console.error('Error fetching gemstone analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}

// PUT - Analyse aktualisieren (nur Admin oder Ersteller)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.gemstoneAnalysis.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Check if user is admin or creator
    const isAdmin = (session.user as { role?: string }).role === 'ADMIN';
    const isCreator = existing.createdById === session.user.id;

    if (!isAdmin && !isCreator) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only edit your own analyses' },
        { status: 403 }
      );
    }

    const updatedAnalysis = await prisma.gemstoneAnalysis.update({
      where: { id },
      data: {
        ...body,
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

    return NextResponse.json({ success: true, analysis: updatedAnalysis });

  } catch (error) {
    console.error('Error updating gemstone analysis:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update analysis' },
      { status: 500 }
    );
  }
}

// DELETE - Analyse löschen (nur Admin oder Ersteller)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await prisma.gemstoneAnalysis.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }

    // Check if user is admin or creator
    const isAdmin = (session.user as { role?: string }).role === 'ADMIN';
    const isCreator = existing.createdById === session.user.id;

    if (!isAdmin && !isCreator) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only delete your own analyses' },
        { status: 403 }
      );
    }

    await prisma.gemstoneAnalysis.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Analysis deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting gemstone analysis:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete analysis' },
      { status: 500 }
    );
  }
}

