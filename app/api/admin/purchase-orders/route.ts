import { NextRequest, NextResponse } from 'next/server';
import { Prisma, PurchaseOrderStatus } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Next.js Build-Zeit-Konfiguration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Alle Einkaufsbestellungen abrufen
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const supplierId = searchParams.get('supplierId');

    const where: Prisma.PurchaseOrderWhereInput = {};
    if (status) where.status = status as PurchaseOrderStatus;
    if (supplierId) where.supplierId = supplierId;

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      orderBy: { orderDate: 'desc' },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
        items: {
          include: {
            gemstone: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    return NextResponse.json(purchaseOrders);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchase orders' },
      { status: 500 }
    );
  }
}

// POST - Neue Einkaufsbestellung erstellen
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Bestellnummer generieren
    const orderCount = await prisma.purchaseOrder.count();
    const orderNumber = `PO-${String(orderCount + 1).padStart(6, '0')}`;

    // Gesamtbetrag berechnen
    type Item = { totalPrice?: number; unitPrice: number; quantity: number };
    const totalAmount = (data.items as Item[]).reduce(
      (sum, item) => sum + Number(item.totalPrice ?? item.unitPrice * item.quantity),
      0
    );

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        orderNumber,
        supplierId: data.supplierId,
        warehouseId: data.warehouseId,
        status: data.status || 'DRAFT',
        orderDate: data.orderDate ? new Date(data.orderDate) : new Date(),
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
        totalAmount,
        currency: data.currency || 'EUR',
        notes: data.notes,
        internalNotes: data.internalNotes,
        createdBy: session.user.id,
        items: {
          create: (data.items as Array<{ gemstoneId: string; quantity: number; unitPrice: number; totalPrice?: number; notes?: string }>).map((item) => ({
            gemstoneId: item.gemstoneId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice || item.unitPrice * item.quantity,
            notes: item.notes,
          })),
        },
      },
      include: {
        supplier: true,
        items: {
          include: {
            gemstone: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(purchaseOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase order' },
      { status: 500 }
    );
  }
}

