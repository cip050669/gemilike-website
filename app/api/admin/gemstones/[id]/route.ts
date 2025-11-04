import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractPayload, normaliseGemstonePayload } from '../utils';
import { notifyWishlistCustomers } from '@/lib/services/wishlist-notifications';

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
      include: {
        media: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Edelstein nicht gefunden' },
        { status: 404 }
      );
    }

    // Extract image URLs from media relation
    const fallbackImages = existing.media
      ?.filter((m) => m.type === 'IMAGE')
      .map((m) => m.url) || [];
    const { payload, uploadedImage } = await extractPayload(request);

    if (!payload.name && !existing.name) {
      return NextResponse.json(
        { success: false, error: 'Name ist erforderlich' },
        { status: 400 }
      );
    }

    const basePayload = {
      ...payload,
      id: id, // Add id for upsert operations
      name: payload.name ?? existing.name,
      category: payload.category ?? existing.category,
      condition: payload.condition ?? existing.condition,
      status: payload.status ?? existing.status, // Preserve status if not explicitly changed
    };

    const data = normaliseGemstonePayload(basePayload, uploadedImage, fallbackImages, true);
    
    // Check if gemstone is becoming available (was sold, now not sold, or inventory updated)
    const wasSold = existing.isSold;
    const isBecomingAvailable = wasSold && (payload.isSold === false || data.isSold === false);
    
    // Also check if inventory quantity changed from 0 to > 0
    let inventoryAvailable = false;
    if (payload.inStock !== undefined || payload.quantity !== undefined) {
      const currentInventory = await prisma.gemstoneInventory.findUnique({
        where: { gemstoneId: id },
        select: { quantity: true },
      });
      const newQuantity = payload.quantity ?? payload.inStock ? 1 : currentInventory?.quantity ?? 0;
      inventoryAvailable = (currentInventory?.quantity ?? 0) === 0 && newQuantity > 0;
    }
    
    const gemstone = await prisma.gemstone.update({
      where: { id },
      data
    });

    // Send wishlist notifications if gemstone became available
    if (isBecomingAvailable || inventoryAvailable) {
      notifyWishlistCustomers(id).catch((error) => {
        console.error('Error sending wishlist notifications:', error);
      });
    }

    return NextResponse.json({
      success: true,
      data: gemstone,
      message: 'Edelstein erfolgreich aktualisiert'
    });
  } catch (error) {
    console.error('Error updating gemstone:', error);
    let errorMessage = 'Failed to update gemstone';
    if (error instanceof Error) {
      errorMessage = error.message;
      // Log stack trace for debugging
      console.error('Error stack:', error.stack);
    }
    // Check for Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('Prisma error code:', (error as any).code);
      console.error('Prisma error meta:', (error as any).meta);
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
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
