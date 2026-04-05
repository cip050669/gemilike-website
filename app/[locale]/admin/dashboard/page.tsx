import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gem, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { AiReindexPanel } from '@/components/admin/ai-reindex-panel';
import { Prisma } from '@prisma/client';

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  // Get real data from database
  const [
    totalGemstones,
    totalCustomers,
    totalOrders,
    totalRevenue,
    recentGemstones,
    recentOrders,
    checkoutStats,
    staleGemstoneEmbeddings,
    staleKnowledgeEmbeddings,
    initialRecentJobs,
  ] = await Promise.all([
    prisma.gemstone.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true }
    }),
    prisma.gemstone.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { customer: true }
    }),
    // Checkout-Analytics (letzten 30 Tage)
    Promise.all([
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
    ]).then(([starts, successes, abandons]) => ({
      totalCheckouts: starts,
      completedCheckouts: successes,
      abandonedCheckouts: abandons,
      conversionRate: starts > 0 ? (successes / starts) * 100 : 0,
      abandonmentRate: starts > 0 ? (abandons / starts) * 100 : 0,
    })),
    prisma.gemstone.count({
      where: {
        OR: [
          { searchEmbedding: { equals: Prisma.AnyNull } },
          { searchEmbeddingUpdatedAt: null },
        ],
      },
    }),
    prisma.knowledgeBase.count({
      where: {
        OR: [
          { searchEmbedding: { equals: Prisma.AnyNull } },
          { searchEmbeddingUpdatedAt: null },
        ],
      },
    }),
    prisma.aiJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        type: true,
        status: true,
        locale: true,
        createdAt: true,
        completedAt: true,
        error: true,
      },
    }),
  ]);

  const recentJobsForPanel = initialRecentJobs.map((job) => ({
    id: job.id,
    type: String(job.type),
    status: String(job.status),
    locale: job.locale,
    createdAt: job.createdAt.toISOString(),
    completedAt: job.completedAt ? job.completedAt.toISOString() : null,
    error: job.error,
  }));

  const stats = {
    totalGemstones,
    totalCustomers,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    monthlyGrowth: 12.5, // TODO: Calculate from actual data
    topSellingGemstone: 'Smaragd' // TODO: Calculate from actual data
  };

  // Create recent activity from real data
  const recentActivity = [
    ...recentGemstones.slice(0, 2).map((gem, index) => ({
      id: `gem-${index}`,
      action: `Neuer Edelstein: ${gem.name}`,
      user: 'Admin',
      time: new Date(gem.createdAt).toLocaleString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    })),
    ...recentOrders.slice(0, 2).map((order, index) => ({
      id: `order-${index}`,
      action: `Neue Bestellung #${order.orderNumber}`,
      user: order.customer ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || 'Kunde' : 'Kunde',
      time: new Date(order.createdAt).toLocaleString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }))
  ].slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Übersicht über Ihr Edelstein-Geschäft
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Edelsteine</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGemstones}</div>
            <p className="text-xs text-muted-foreground">
              +2 neue diese Woche
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kunden</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              +5 neue diesen Monat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bestellungen</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              +12 diese Woche
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umsatz</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.monthlyGrowth}% diesen Monat
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Checkout Analytics Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Checkout-Analytics (30 Tage)</CardTitle>
              <CardDescription>
                Überwachung des Checkout-Funnels und Conversion-Rate
              </CardDescription>
            </div>
            <Link href={`/${locale}/admin/checkout-analytics`}>
              <button className="text-sm text-primary hover:underline">
                Details anzeigen →
              </button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Checkouts gestartet</p>
              <p className="text-2xl font-bold">{checkoutStats.totalCheckouts}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-400" />
                Erfolgreich abgeschlossen
              </p>
              <p className="text-2xl font-bold text-green-400">{checkoutStats.completedCheckouts}</p>
              <p className="text-xs text-muted-foreground">
                {checkoutStats.conversionRate.toFixed(1)}% Conversion-Rate
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-red-400" />
                Abgebrochen
              </p>
              <p className="text-2xl font-bold text-red-400">{checkoutStats.abandonedCheckouts}</p>
              <p className="text-xs text-muted-foreground">
                {checkoutStats.abandonmentRate.toFixed(1)}% Abandonment-Rate
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Potenzial</p>
              <p className="text-2xl font-bold text-yellow-400">
                {checkoutStats.abandonedCheckouts > 0 
                  ? `+${Math.round(checkoutStats.abandonedCheckouts * (checkoutStats.conversionRate / 100))}`
                  : '0'}
              </p>
              <p className="text-xs text-muted-foreground">
                Zusätzliche Bestellungen möglich
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AiReindexPanel
        locale={locale}
        staleGemstoneEmbeddings={staleGemstoneEmbeddings}
        staleKnowledgeEmbeddings={staleKnowledgeEmbeddings}
        initialRecentJobs={recentJobsForPanel}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Letzte Aktivitäten</CardTitle>
            <CardDescription>
              Übersicht der letzten System-Aktivitäten
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Bestseller</CardTitle>
            <CardDescription>
              Beliebteste Edelsteine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Smaragd</p>
                  <p className="text-xs text-muted-foreground">Kolumbien</p>
                </div>
                <div className="text-sm font-medium">45 Verkäufe</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Rubin</p>
                  <p className="text-xs text-muted-foreground">Burma</p>
                </div>
                <div className="text-sm font-medium">32 Verkäufe</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Saphir</p>
                  <p className="text-xs text-muted-foreground">Ceylon</p>
                </div>
                <div className="text-sm font-medium">28 Verkäufe</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
