import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gem, ShoppingCart, DollarSign } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  await params; // Await params even if not used

  // Get real data from database
  const [
    totalGemstones,
    totalCustomers,
    totalOrders,
    totalRevenue,
    recentGemstones,
    recentOrders
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
      include: { user: true }
    })
  ]);

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
      user: order.user.name || 'Kunde',
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
