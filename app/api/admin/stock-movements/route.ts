import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Next.js Build-Zeit-Konfiguration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Alle Lagerbewegungen abrufen
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gemstoneId = searchParams.get('gemstoneId');
    const warehouseId = searchParams.get('warehouseId');
    const movementType = searchParams.get('movementType');
    const limit = parseInt(searchParams.get('limit') || '100');

    const where: Prisma.StockMovementWhereInput = {};
    if (gemstoneId) where.gemstoneId = gemstoneId;
    if (warehouseId) where.warehouseId = warehouseId;
    if (movementType) where.movementType = movementType as 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN' | 'DAMAGE' | 'LOSS';

    const movements = await prisma.stockMovement.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        gemstone: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        purchaseOrder: {
          select: {
            id: true,
            orderNumber: true,
          },
        },
      },
    });

    return NextResponse.json(movements);
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock movements' },
      { status: 500 }
    );
  }
}

// POST - Neue Lagerbewegung erstellen
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Lagerbewegung erstellen
    const movement = await prisma.stockMovement.create({
      data: {
        gemstoneId: data.gemstoneId,
        warehouseId: data.warehouseId,
        movementType: data.movementType,
        quantity: data.quantity,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        supplierId: data.supplierId,
        purchaseOrderId: data.purchaseOrderId,
        notes: data.notes,
        createdBy: session.user.id,
      },
      include: {
        gemstone: {
          select: {
            id: true,
            name: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Bestand aktualisieren (wenn Inventory existiert)
    if (data.updateInventory !== false) {
      const inventory = await prisma.gemstoneInventory.findUnique({
        where: { gemstoneId: data.gemstoneId },
      });

      if (inventory) {
        let newQuantity = inventory.quantity;
        if (data.movementType === 'IN' || data.movementType === 'RETURN') {
          newQuantity += data.quantity;
        } else if (data.movementType === 'OUT' || data.movementType === 'DAMAGE' || data.movementType === 'LOSS') {
          newQuantity = Math.max(0, newQuantity - data.quantity);
        }

        await prisma.gemstoneInventory.update({
          where: { gemstoneId: data.gemstoneId },
          data: { quantity: newQuantity },
        });
      }
    }

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    console.error('Error creating stock movement:', error);
    return NextResponse.json(
      { error: 'Failed to create stock movement' },
      { status: 500 }
    );
  }
}

