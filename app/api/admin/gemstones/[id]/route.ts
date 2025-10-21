import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractPayload, normaliseGemstonePayload, parseListFromDB } from '../utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const gemstone = await prisma.gemstone.findUnique({
      where: { id }
    });

    if (!gemstone) {
      return NextResponse.json(
        { success: false, error: 'Edelstein nicht gefunden' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: gemstone
    });
  } catch (error) {
    console.error('Error fetching gemstone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gemstone' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.gemstone.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Edelstein nicht gefunden' },
        { status: 404 }
      );
    }

    const fallbackImages = parseListFromDB(existing.images);
    const { payload, uploadedImage } = await extractPayload(request);

    if (!payload.name && !existing.name) {
      return NextResponse.json(
        { success: false, error: 'Name ist erforderlich' },
        { status: 400 }
      );
    }

    const basePayload = {
      ...payload,
      name: payload.name ?? existing.name,
      category: payload.category ?? existing.category,
      type: payload.type ?? existing.type,
    };

    const data = normaliseGemstonePayload(basePayload, uploadedImage, fallbackImages);
    
    const gemstone = await prisma.gemstone.update({
      where: { id },
      data
    });

    return NextResponse.json({
      success: true,
      data: gemstone,
      message: 'Edelstein erfolgreich aktualisiert'
    });
  } catch (error) {
    console.error('Error updating gemstone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update gemstone' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await prisma.gemstone.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Edelstein nicht gefunden' },
        { status: 404 }
      );
    }

    await prisma.gemstone.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Edelstein erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Error deleting gemstone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete gemstone' },
      { status: 500 }
    );
  }
}
export const runtime = 'nodejs';
