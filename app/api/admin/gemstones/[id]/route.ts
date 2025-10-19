import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const body = await request.json();
    
    const gemstone = await prisma.gemstone.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        type: body.type,
        price: parseFloat(body.price) || 0,
        weight: body.weight ? parseFloat(body.weight) : null,
        dimensions: body.dimensions,
        color: body.color,
        colorIntensity: body.colorIntensity,
        colorBrightness: body.colorBrightness,
        clarity: body.clarity,
        cut: body.cut,
        cutForm: body.cutForm,
        treatment: body.treatment,
        certification: body.certification,
        rarity: body.rarity,
        origin: body.origin,
        description: body.description,
        images: body.images,
        inStock: body.inStock,
        stock: parseInt(body.stock) || 0,
        sku: body.sku,
        isNew: body.isNew
      }
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