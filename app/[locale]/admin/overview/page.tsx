import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Gem, 
  Users, 
  FileText, 
  BarChart3, 
  ShoppingCart, 
  TrendingUp, 
  Settings,
  ArrowRight
} from 'lucide-react';

export default async function AdminOverviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const adminSections = [
    {
      title: 'Edelsteine',
      description: 'Verwalten Sie Ihr Edelstein-Inventar',
      href: `/${locale}/admin`,
      icon: Gem,
      stats: '156 Edelsteine',
      color: 'bg-blue-500'
    },
    {
      title: 'Kunden',
      description: 'Kundenverwaltung und -betreuung',
      href: `/${locale}/admin/customers`,
      icon: Users,
      stats: '89 Kunden',
      color: 'bg-green-500'
    },
    {
      title: 'Audit-Log',
      description: 'System-Audit und Aktivitätsprotokoll',
      href: `/${locale}/admin/audit`,
      icon: FileText,
      stats: '1,234 Einträge',
      color: 'bg-purple-500'
    },
    {
      title: 'Dashboard',
      description: 'Übersicht und Statistiken',
      href: `/${locale}/admin/dashboard`,
      icon: BarChart3,
      stats: 'Live-Daten',
      color: 'bg-orange-500'
    },
    {
      title: 'Bestellungen',
      description: 'Bestellverwaltung und -abwicklung',
      href: `/${locale}/admin/orders`,
      icon: ShoppingCart,
      stats: '234 Bestellungen',
      color: 'bg-red-500'
    },
    {
      title: 'Berichte',
      description: 'Analysen und Geschäftsberichte',
      href: `/${locale}/admin/reports`,
      icon: TrendingUp,
      stats: '12 Berichte',
      color: 'bg-indigo-500'
    },
    {
      title: 'Einstellungen',
      description: 'System-Konfiguration',
      href: `/${locale}/admin/settings`,
      icon: Settings,
      stats: 'Konfiguration',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel Übersicht</h1>
        <p className="text-muted-foreground">
          Verwalten Sie alle Aspekte Ihres Edelstein-Geschäfts
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Edelsteine</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +2 neue diese Woche
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Kunden</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
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
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              +12 diese Woche
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umsatz</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€125,000</div>
            <p className="text-xs text-muted-foreground">
              +12.5% diesen Monat
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Sections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.href} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${section.color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${section.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="text-sm font-medium">{section.stats}</span>
                  </div>
                  <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    <Link href={section.href}>
                      Öffnen
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Aktivitäten</CardTitle>
          <CardDescription>
            Übersicht der letzten System-Aktivitäten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Neuer Edelstein hinzugefügt
                </p>
                <p className="text-sm text-muted-foreground">
                  Admin • vor 2 Minuten
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Bestellung #1234 bearbeitet
                </p>
                <p className="text-sm text-muted-foreground">
                  Admin • vor 15 Minuten
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Kunde registriert
                </p>
                <p className="text-sm text-muted-foreground">
                  System • vor 1 Stunde
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Edelstein aktualisiert
                </p>
                <p className="text-sm text-muted-foreground">
                  Admin • vor 2 Stunden
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
