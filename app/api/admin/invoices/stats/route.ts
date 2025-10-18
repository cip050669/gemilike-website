import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const [
      totalInvoices,
      draftInvoices,
      sentInvoices,
      overdueInvoices,
      paidInvoices,
      totalRevenue,
      unpaidAmount,
      overdueAmount
    ] = await Promise.all([
      prisma.invoice.count(),
      prisma.invoice.count({ where: { status: 'DRAFT' } }),
      prisma.invoice.count({ where: { status: 'SENT' } }),
      prisma.invoice.count({ where: { status: 'OVERDUE' } }),
      prisma.invoice.count({ where: { paymentStatus: 'PAID' } }),
      prisma.invoice.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'PAID' }
      }),
      prisma.invoice.aggregate({
        _sum: { total: true },
        where: { paymentStatus: 'UNPAID' }
      }),
      prisma.invoice.aggregate({
        _sum: { total: true },
        where: { status: 'OVERDUE' }
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalInvoices,
        draftInvoices,
        sentInvoices,
        overdueInvoices,
        paidInvoices,
        totalRevenue: totalRevenue._sum.total || 0,
        unpaidAmount: unpaidAmount._sum.total || 0,
        overdueAmount: overdueAmount._sum.total || 0
      }
    });
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoice stats' },
      { status: 500 }
    );
  }
}