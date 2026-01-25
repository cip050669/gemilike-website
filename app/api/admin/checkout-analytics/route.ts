import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionWithUser } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { session } = await getSessionWithUser();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Grundlegende Funnel-Statistiken
    const [
      totalCheckouts,
      completedCheckouts,
      abandonedCheckouts,
    ] = await Promise.all([
      prisma.checkoutEvent.count({
        where: {
          step: 'start',
          createdAt: { gte: startDate },
        },
      }),
      prisma.checkoutEvent.count({
        where: {
          step: 'success',
          createdAt: { gte: startDate },
        },
      }),
      prisma.checkoutEvent.count({
        where: {
          step: 'abandon',
          createdAt: { gte: startDate },
        },
      }),
    ]);

    // Funnel-Übersicht: Wie viele Nutzer erreichen jeden Schritt?
    const funnelSteps = [
      { step: 'start', label: 'Checkout gestartet' },
      { step: 'address', label: 'Adresse ausgefüllt' },
      { step: 'payment', label: 'Zahlungsmethode gewählt' },
      { step: 'shipping', label: 'Versand gewählt' },
      { step: 'review', label: 'Bestellung überprüft' },
      { step: 'submit', label: 'Bestellung abgeschickt' },
      { step: 'success', label: 'Bestellung erfolgreich' },
    ];

    const funnelData = await Promise.all(
      funnelSteps.map(async ({ step, label }) => {
        const count = await prisma.checkoutEvent.count({
          where: {
            step,
            createdAt: { gte: startDate },
          },
        });

        // Prisma 7: groupBy-Typ-Workaround
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uniqueUsers = await (prisma.checkoutEvent.groupBy as any)({
          by: ['customerId', 'sessionId'],
          where: {
            step,
            createdAt: { gte: startDate },
          },
        });

        const avgDuration = await prisma.checkoutEvent.aggregate({
          where: {
            step,
            duration: { not: null },
            createdAt: { gte: startDate },
          },
          _avg: { duration: true },
        });

        return {
          step,
          label,
          count,
          uniqueUsers: uniqueUsers.length,
          avgDuration: avgDuration._avg.duration || 0,
          conversionRate: totalCheckouts > 0 ? (count / totalCheckouts) * 100 : 0,
        };
      })
    );

    // Drop-off-Analyse: Wo brechen Nutzer ab? (Prisma 7: groupBy-Typ-Workaround)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dropOffs = await (prisma.checkoutEvent.groupBy as any)({
      by: ['step'],
      where: {
        step: { in: ['abandon'] },
        createdAt: { gte: startDate },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });

    // Durchschnittliche Checkout-Dauer (von Start bis Success)
    const completedCheckoutSessions = await prisma.$queryRaw<Array<{
      cartId: string;
      totalDuration: number;
    }>>`
      SELECT 
        "cartId",
        SUM("duration")::int as "totalDuration"
      FROM "CheckoutEvent"
      WHERE "createdAt" >= ${startDate}
        AND "cartId" IS NOT NULL
        AND "step" IN ('start', 'address', 'payment', 'shipping', 'review', 'submit', 'success')
      GROUP BY "cartId"
      HAVING MAX(CASE WHEN "step" = 'success' THEN 1 ELSE 0 END) = 1
    `;

    const avgCheckoutDuration = completedCheckoutSessions.length > 0
      ? completedCheckoutSessions.reduce((sum, s) => sum + (s.totalDuration || 0), 0) / completedCheckoutSessions.length
      : 0;

    // Fehler-Analyse (Prisma 7: groupBy-Typ-Workaround)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errors = await (prisma.checkoutEvent.groupBy as any)({
      by: ['step', 'error'],
      where: {
        error: { not: null },
        createdAt: { gte: startDate },
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    // Tägliche Trends
    const dailyTrends = await prisma.$queryRaw<Array<{
      date: Date;
      starts: number;
      completions: number;
      abandonments: number;
    }>>`
      SELECT 
        DATE("createdAt") as date,
        COUNT(CASE WHEN "step" = 'start' THEN 1 END)::int as starts,
        COUNT(CASE WHEN "step" = 'success' THEN 1 END)::int as completions,
        COUNT(CASE WHEN "step" = 'abandon' THEN 1 END)::int as abandonments
      FROM "CheckoutEvent"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Conversion-Rate berechnen
    const conversionRate = totalCheckouts > 0 
      ? (completedCheckouts / totalCheckouts) * 100 
      : 0;

    // Abandonment-Rate berechnen
    const abandonmentRate = totalCheckouts > 0
      ? (abandonedCheckouts / totalCheckouts) * 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalCheckouts,
          completedCheckouts,
          abandonedCheckouts,
          conversionRate: Math.round(conversionRate * 100) / 100,
          abandonmentRate: Math.round(abandonmentRate * 100) / 100,
          avgCheckoutDuration: Math.round(avgCheckoutDuration),
        },
        funnel: funnelData,
        dropOffs: dropOffs.map(d => ({
          step: d.step,
          count: d._count.id,
        })),
        errors: errors.map(e => ({
          step: e.step,
          error: e.error,
          count: e._count.id,
        })),
        dailyTrends: dailyTrends.map(t => ({
          date: t.date,
          starts: t.starts,
          completions: t.completions,
          abandonments: t.abandonments,
        })),
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching checkout analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
