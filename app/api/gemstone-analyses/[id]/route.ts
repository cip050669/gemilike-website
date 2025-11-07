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
        { 
          success: false,
          error: 'Analysis not found',
          message: 'The requested analysis does not exist'
        },
        { status: 404 }
      );
    }

    // Non-admin users can only see published analyses
    if (!isAdmin && !analysis.published) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Analysis not found',
          message: 'The requested analysis is not available'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, analysis });

  } catch (error) {
    console.error('Error fetching gemstone analysis:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
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
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          message: 'Please log in to perform this action'
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

    const existing = await prisma.gemstoneAnalysis.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Analysis not found',
          message: 'The analysis you are trying to update does not exist'
        },
        { status: 404 }
      );
    }

    // Check if user is admin or creator
    const isAdmin = (session.user as { role?: string }).role === 'ADMIN';
    const isCreator = existing.createdById === session.user.id;

    if (!isAdmin && !isCreator) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          message: 'You can only edit your own analyses'
        },
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
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; message?: string };
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Analysis not found',
            message: 'The analysis you are trying to update does not exist'
          },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
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
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          message: 'Please log in to perform this action'
        },
        { status: 401 }
      );
    }

    const existing = await prisma.gemstoneAnalysis.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Analysis not found',
          message: 'The analysis you are trying to delete does not exist'
        },
        { status: 404 }
      );
    }

    // Check if user is admin or creator
    const isAdmin = (session.user as { role?: string }).role === 'ADMIN';
    const isCreator = existing.createdById === session.user.id;

    if (!isAdmin && !isCreator) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          message: 'You can only delete your own analyses'
        },
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
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; message?: string };
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Analysis not found',
            message: 'The analysis you are trying to delete does not exist'
          },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete analysis',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

