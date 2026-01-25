/* eslint-disable @typescript-eslint/no-explicit-any -- Prisma 7: WWS-Models können vor Migration im generierten Client fehlen */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Next.js Build-Zeit-Konfiguration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - WWS Statistiken abrufen
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parallel alle Statistiken abrufen
    // Prisma 7: Typ-Assertion für neue Modelle (können fehlen wenn Migration noch nicht durchgeführt)
    const [
      suppliersCount,
      activeSuppliersCount,
      warehousesCount,
      activeWarehousesCount,
      purchaseOrdersCount,
      pendingOrdersCount,
      receivedOrdersCount,
      totalPurchaseAmount,
      stockMovementsCount,
      recentMovements,
      lowStockItems,
    ] = await Promise.all([
      // Lieferanten
      (prisma as any).supplier?.count().catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).supplier?.count({ where: { isActive: true } }).catch(() => 0) ?? Promise.resolve(0),
      
      // Lagerorte
      (prisma as any).warehouse?.count().catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).warehouse?.count({ where: { isActive: true } }).catch(() => 0) ?? Promise.resolve(0),
      
      // Einkaufsbestellungen
      (prisma as any).purchaseOrder?.count().catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).purchaseOrder?.count({ 
        where: { 
          status: { in: ['PENDING', 'CONFIRMED', 'PARTIALLY_RECEIVED'] } 
        } 
      }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).purchaseOrder?.count({ 
        where: { status: 'RECEIVED' } 
      }).catch(() => 0) ?? Promise.resolve(0),
      
      // Gesamtbetrag aller Bestellungen
      (prisma as any).purchaseOrder?.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' } },
      }).catch(() => ({ _sum: { totalAmount: null } })) ?? Promise.resolve({ _sum: { totalAmount: null } }),
      
      // Lagerbewegungen
      (prisma as any).stockMovement?.count().catch(() => 0) ?? Promise.resolve(0),
      
      // Letzte 10 Lagerbewegungen
      (prisma as any).stockMovement?.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          gemstone: {
            select: { id: true, name: true },
          },
          warehouse: {
            select: { id: true, name: true, code: true },
          },
        },
      }).catch(() => []) ?? Promise.resolve([]),
      
      // Produkte mit niedrigem Bestand (nur wenn Inventory-Modell existiert)
      prisma.gemstone.findMany({
        where: {
          inventory: {
            quantity: { lte: 10 },
          },
        },
        include: {
          inventory: {
            select: { quantity: true },
          },
        },
        take: 10,
      }).catch(() => []), // Fallback falls Inventory nicht existiert
    ]);

    // Status-Verteilung der Bestellungen
    const orderStatusDistribution = await Promise.all([
      (prisma as any).purchaseOrder?.count({ where: { status: 'DRAFT' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).purchaseOrder?.count({ where: { status: 'PENDING' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).purchaseOrder?.count({ where: { status: 'CONFIRMED' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).purchaseOrder?.count({ where: { status: 'PARTIALLY_RECEIVED' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).purchaseOrder?.count({ where: { status: 'RECEIVED' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).purchaseOrder?.count({ where: { status: 'CANCELLED' } }).catch(() => 0) ?? Promise.resolve(0),
    ]);

    // Lagerbewegungen nach Typ
    const movementTypeStats = await Promise.all([
      (prisma as any).stockMovement?.count({ where: { movementType: 'IN' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).stockMovement?.count({ where: { movementType: 'OUT' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).stockMovement?.count({ where: { movementType: 'TRANSFER' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).stockMovement?.count({ where: { movementType: 'ADJUSTMENT' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).stockMovement?.count({ where: { movementType: 'RETURN' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).stockMovement?.count({ where: { movementType: 'DAMAGE' } }).catch(() => 0) ?? Promise.resolve(0),
      (prisma as any).stockMovement?.count({ where: { movementType: 'LOSS' } }).catch(() => 0) ?? Promise.resolve(0),
    ]);

    // Top Lieferanten nach Anzahl Bestellungen
    const topSuppliers = await ((prisma as any).supplier?.findMany({
      take: 5,
      orderBy: {
        purchaseOrders: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: { purchaseOrders: true },
        },
      },
    }).catch(() => []) ?? Promise.resolve([]));

    // Letzte 30 Tage - Bestellungen pro Tag
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyOrders = await ((prisma as any).purchaseOrder?.groupBy({
      by: ['orderDate'],
      where: {
        orderDate: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
      _sum: { totalAmount: true },
    }).catch(() => []) ?? Promise.resolve([]));

    return NextResponse.json({
      suppliers: {
        total: suppliersCount,
        active: activeSuppliersCount,
        inactive: suppliersCount - activeSuppliersCount,
      },
      warehouses: {
        total: warehousesCount,
        active: activeWarehousesCount,
        inactive: warehousesCount - activeWarehousesCount,
      },
      purchaseOrders: {
        total: purchaseOrdersCount,
        pending: pendingOrdersCount,
        received: receivedOrdersCount,
        totalAmount: totalPurchaseAmount._sum.totalAmount 
          ? Number(totalPurchaseAmount._sum.totalAmount) 
          : 0,
        statusDistribution: {
          draft: orderStatusDistribution[0],
          pending: orderStatusDistribution[1],
          confirmed: orderStatusDistribution[2],
          partiallyReceived: orderStatusDistribution[3],
          received: orderStatusDistribution[4],
          cancelled: orderStatusDistribution[5],
        },
      },
      stockMovements: {
        total: stockMovementsCount,
        byType: {
          in: movementTypeStats[0],
          out: movementTypeStats[1],
          transfer: movementTypeStats[2],
          adjustment: movementTypeStats[3],
          return: movementTypeStats[4],
          damage: movementTypeStats[5],
          loss: movementTypeStats[6],
        },
        recent: recentMovements.map(m => ({
          id: m.id,
          type: m.movementType,
          quantity: m.quantity,
          gemstone: m.gemstone.name,
          warehouse: m.warehouse?.name || 'N/A',
          createdAt: m.createdAt,
        })),
      },
      lowStockItems: Array.isArray(lowStockItems) ? lowStockItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: (item.inventory as { quantity: number } | null)?.quantity || 0,
      })) : [],
      topSuppliers: topSuppliers.map(s => ({
        id: s.id,
        name: s.name,
        companyName: s.companyName,
        orderCount: s._count.purchaseOrders,
      })),
      dailyOrders: dailyOrders.map(d => ({
        date: d.orderDate,
        count: d._count.id,
        totalAmount: d._sum.totalAmount ? Number(d._sum.totalAmount) : 0,
      })),
    });
  } catch (error) {
    console.error('Error fetching warehouse stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warehouse statistics' },
      { status: 500 }
    );
  }
}

