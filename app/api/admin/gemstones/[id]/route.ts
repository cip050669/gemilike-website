import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractPayload, normaliseGemstonePayload } from '../utils';
import { notifyWishlistCustomers } from '@/lib/services/wishlist-notifications';
import { Prisma } from '@prisma/client';

async function generateUniqueSlug(base: string, excludeId?: string) {
  const safeBase =
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'gemstone';

  let counter = 0;
  // First try plain, then with -1, -2, ...; stop after reasonable attempts
  while (counter < 2000) {
    const candidate = counter === 0 ? safeBase : `${safeBase}-${counter}`;
    const exists = await prisma.gemstone.findUnique({ where: { slug: candidate } });
    if (!exists || (excludeId && exists.id === excludeId)) {
      return candidate;
    }
    counter += 1;
  }

  // Extreme fallback: timestamped slug
  return `${safeBase}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

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

    // Generate unique slug if name changed or slug is provided
    const nameChanged = payload.name && payload.name !== existing.name;
    if (nameChanged || payload.slug) {
      const baseSlug = payload.slug 
        ? String(payload.slug).trim()
        : String(basePayload.name ?? existing.name).trim();
      basePayload.slug = await generateUniqueSlug(baseSlug, id);
    } else {
      // Keep existing slug if name didn't change
      basePayload.slug = existing.slug;
    }

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
    
    // Try to update with retry logic for slug conflicts
    let gemstone;
    let lastError: unknown;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        gemstone = await prisma.gemstone.update({
          where: { id },
          data
        });
        break;
      } catch (error) {
        lastError = error;
        // If slug unique constraint hit, regenerate and retry
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          const meta = error.meta as { target?: string[] };
          if (meta?.target?.includes('slug')) {
            const baseSlug = String(basePayload.name ?? existing.name).trim();
            const newSlug = await generateUniqueSlug(baseSlug, id);
            basePayload.slug = newSlug;
            data.slug = newSlug;
            continue;
          }
        }
        throw error;
      }
    }

    if (!gemstone) {
      throw lastError ?? new Error('Unknown error while updating gemstone');
    }

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
      const prismaError = error as { code?: string; meta?: unknown };
      console.error('Prisma error code:', prismaError.code);
      console.error('Prisma error meta:', prismaError.meta);
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
    console.log(`[DELETE] Attempting to delete gemstone with id: ${id}`);
    
    if (!id || id.trim() === '') {
      console.error('[DELETE] Invalid ID provided');
      return NextResponse.json(
        { success: false, error: 'Ungültige ID' },
        { status: 400 }
      );
    }

    const existing = await prisma.gemstone.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!existing) {
      console.warn(`[DELETE] Gemstone with id ${id} not found`);
      return NextResponse.json(
        { success: false, error: 'Edelstein nicht gefunden' },
        { status: 404 }
      );
    }

    console.log(`[DELETE] Found gemstone: ${existing.name} (${existing.id}), proceeding with deletion...`);

    await prisma.gemstone.delete({
      where: { id }
    });

    console.log(`[DELETE] Successfully deleted gemstone: ${id}`);

    return NextResponse.json({
      success: true,
      message: 'Edelstein erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('[DELETE] Error deleting gemstone:', error);
    
    // Handle Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code?: string; meta?: unknown };
      console.error('[DELETE] Prisma error code:', prismaError.code);
      console.error('[DELETE] Prisma error meta:', prismaError.meta);
      
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { success: false, error: 'Edelstein nicht gefunden' },
          { status: 404 }
        );
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return NextResponse.json(
      { success: false, error: `Fehler beim Löschen: ${errorMessage}` },
      { status: 500 }
    );
  }
}
export const runtime = 'nodejs';
