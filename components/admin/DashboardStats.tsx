'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Package, 
  Euro,
  Eye,
  Star,
  Calendar,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Gemstone } from '@/lib/types/gemstone';

interface DashboardStatsProps {
  gemstones: Gemstone[];
}

interface StatsData {
  // Verkaufsstatistiken
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
  
  // Produktstatistiken
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  
  // Kundenstatistiken
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  
  // Beliebte Produkte
  topSellingProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  
  // Kategorien-Statistiken
  categoryStats: Array<{
    category: string;
    count: number;
    totalValue: number;
    averagePrice: number;
  }>;
  
  // Herkunft-Statistiken
  originStats: Array<{
    origin: string;
    count: number;
    totalValue: number;
  }>;
  
  // Behandlungs-Statistiken
  treatmentStats: Array<{
    treatment: string;
    count: number;
    percentage: number;
  }>;
  
  // Zertifizierungs-Statistiken
  certificationStats: {
    certified: number;
    uncertified: number;
    certifiedPercentage: number;
  };
  
  // Preis-Statistiken
  priceStats: {
    minPrice: number;
    maxPrice: number;
    averagePrice: number;
    medianPrice: number;
  };
  
  // Gewichts-Statistiken
  weightStats: {
    totalCaratWeight: number;
    totalGramWeight: number;
    averageCaratWeight: number;
    averageGramWeight: number;
  };
}

export function DashboardStats({ gemstones }: DashboardStatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data for demonstration - in production, this would come from your database
  const generateMockStats = (): StatsData => {
    const totalProducts = gemstones.length;
    const availableProducts = gemstones.filter(g => g.inStock).length;
    const outOfStockProducts = gemstones.filter(g => !g.inStock).length;
    const lowStockProducts = gemstones.filter(g => g.quantity <= 5).length;
    
    // Mock sales data
    const totalRevenue = gemstones.reduce((sum, g) => sum + (g.price * Math.floor(Math.random() * 10 + 1)), 0);
    const totalOrders = Math.floor(totalRevenue / 1500); // Average order value ~1500€
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const revenueGrowth = Math.random() * 20 - 5; // -5% to +15%
    
    // Mock customer data
    const totalCustomers = Math.floor(totalOrders * 0.8); // 80% of orders are from unique customers
    const newCustomers = Math.floor(totalCustomers * 0.3);
    const returningCustomers = totalCustomers - newCustomers;
    
    // Top selling products (mock)
    const topSellingProducts = gemstones
      .map(g => ({
        id: g.id,
        name: g.name,
        sales: Math.floor(Math.random() * 20 + 1),
        revenue: g.price * Math.floor(Math.random() * 20 + 1)
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    
    // Category statistics
    const categoryMap = new Map<string, { count: number; totalValue: number }>();
    gemstones.forEach(g => {
      const existing = categoryMap.get(g.category) || { count: 0, totalValue: 0 };
      categoryMap.set(g.category, {
        count: existing.count + 1,
        totalValue: existing.totalValue + g.price
      });
    });
    
    const categoryStats = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      totalValue: data.totalValue,
      averagePrice: data.totalValue / data.count
    })).sort((a, b) => b.totalValue - a.totalValue);
    
    // Origin statistics
    const originMap = new Map<string, { count: number; totalValue: number }>();
    gemstones.forEach(g => {
      const existing = originMap.get(g.origin) || { count: 0, totalValue: 0 };
      originMap.set(g.origin, {
        count: existing.count + 1,
        totalValue: existing.totalValue + g.price
      });
    });
    
    const originStats = Array.from(originMap.entries()).map(([origin, data]) => ({
      origin,
      count: data.count,
      totalValue: data.totalValue
    })).sort((a, b) => b.totalValue - a.totalValue);
    
    // Treatment statistics
    const treatmentMap = new Map<string, number>();
    gemstones.forEach(g => {
      const treatment = g.treatment.treated ? g.treatment.type || 'treated' : 'untreated';
      treatmentMap.set(treatment, (treatmentMap.get(treatment) || 0) + 1);
    });
    
    const treatmentStats = Array.from(treatmentMap.entries()).map(([treatment, count]) => ({
      treatment: treatment === 'untreated' ? 'Unbehandelt' : 
                treatment === 'heated' ? 'Erhitzt' :
                treatment === 'oiled' ? 'Geölt' :
                treatment === 'irradiated' ? 'Bestrahlt' :
                treatment === 'diffused' ? 'Diffundiert' :
                treatment === 'filled' ? 'Gefüllt' :
                treatment === 'coated' ? 'Beschichtet' :
                treatment,
      count,
      percentage: (count / totalProducts) * 100
    })).sort((a, b) => b.count - a.count);
    
    // Certification statistics
    const certified = gemstones.filter(g => g.certification.certified).length;
    const uncertified = totalProducts - certified;
    const certificationStats = {
      certified,
      uncertified,
      certifiedPercentage: (certified / totalProducts) * 100
    };
    
    // Price statistics
    const prices = gemstones.map(g => g.price).sort((a, b) => a - b);
    const priceStats = {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      averagePrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      medianPrice: prices[Math.floor(prices.length / 2)]
    };
    
    // Weight statistics
    const cutGemstones = gemstones.filter(g => g.type === 'cut');
    const roughGemstones = gemstones.filter(g => g.type === 'rough');
    
    const totalCaratWeight = cutGemstones.reduce((sum, g) => sum + (g as any).caratWeight, 0);
    const totalGramWeight = roughGemstones.reduce((sum, g) => sum + (g as any).gramWeight, 0);
    
    const weightStats = {
      totalCaratWeight,
      totalGramWeight,
      averageCaratWeight: cutGemstones.length > 0 ? totalCaratWeight / cutGemstones.length : 0,
      averageGramWeight: roughGemstones.length > 0 ? totalGramWeight / roughGemstones.length : 0
    };
    
    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      revenueGrowth,
      totalProducts,
      availableProducts,
      outOfStockProducts,
      lowStockProducts,
      totalCustomers,
      newCustomers,
      returningCustomers,
      topSellingProducts,
      categoryStats,
      originStats,
      treatmentStats,
      certificationStats,
      priceStats,
      weightStats
    };
  };

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(generateMockStats());
      setLastUpdated(new Date());
      setIsLoading(false);
    };

    loadStats();
  }, [gemstones]);

  const handleRefresh = () => {
    setStats(generateMockStats());
    setLastUpdated(new Date());
  };

  const handleExport = () => {
    if (!stats) return;
    
    const csvData = [
      ['Statistik', 'Wert'],
      ['Gesamtumsatz', `${stats.totalRevenue.toLocaleString('de-DE')} €`],
      ['Anzahl Bestellungen', stats.totalOrders.toString()],
      ['Durchschnittlicher Bestellwert', `${stats.averageOrderValue.toLocaleString('de-DE')} €`],
      ['Gesamtprodukte', stats.totalProducts.toString()],
      ['Verfügbare Produkte', stats.availableProducts.toString()],
      ['Ausverkaufte Produkte', stats.outOfStockProducts.toString()],
      ['Niedrige Lagerbestände', stats.lowStockProducts.toString()],
      ['Gesamtkunden', stats.totalCustomers.toString()],
      ['Neue Kunden', stats.newCustomers.toString()],
      ['Wiederkehrende Kunden', stats.returningCustomers.toString()],
      ['Zertifizierte Produkte', `${stats.certificationStats.certifiedPercentage.toFixed(1)}%`],
      ['Durchschnittspreis', `${stats.priceStats.averagePrice.toLocaleString('de-DE')} €`],
      ['Gesamtkaratgewicht', `${stats.weightStats.totalCaratWeight.toFixed(2)} ct`],
      ['Gesamtgrammgewicht', `${stats.weightStats.totalGramWeight.toFixed(2)} g`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dashboard-stats-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Dashboard Statistiken</h2>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Lade Statistiken...</span>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Statistiken</h2>
          <p className="text-sm text-muted-foreground">
            Letzte Aktualisierung: {lastUpdated.toLocaleString('de-DE')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Aktualisieren
          </Button>
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString('de-DE')} €</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.revenueGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {Math.abs(stats.revenueGrowth).toFixed(1)}% vs. letzter Monat
            </div>
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
              Ø {stats.averageOrderValue.toLocaleString('de-DE')} € pro Bestellung
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
              {stats.newCustomers} neue, {stats.returningCustomers} wiederkehrende
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produkte</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableProducts} verfügbar, {stats.outOfStockProducts} ausverkauft
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lagerbestand</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Verfügbar</span>
                </div>
                <span className="font-semibold">{stats.availableProducts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Ausverkauft</span>
                </div>
                <span className="font-semibold">{stats.outOfStockProducts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Niedrig</span>
                </div>
                <span className="font-semibold">{stats.lowStockProducts}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zertifizierung</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Zertifiziert</span>
                <span className="font-semibold">{stats.certificationStats.certified}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Nicht zertifiziert</span>
                <span className="font-semibold">{stats.certificationStats.uncertified}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Zertifizierungsrate</span>
                <span className="font-semibold">{stats.certificationStats.certifiedPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preis-Statistiken</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Durchschnitt</span>
                <span className="font-semibold">{stats.priceStats.averagePrice.toLocaleString('de-DE')} €</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Median</span>
                <span className="font-semibold">{stats.priceStats.medianPrice.toLocaleString('de-DE')} €</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Bereich</span>
                <span className="font-semibold">
                  {stats.priceStats.minPrice.toLocaleString('de-DE')} - {stats.priceStats.maxPrice.toLocaleString('de-DE')} €
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Beliebteste Produkte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topSellingProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-500/50 text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.sales} Verkäufe</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{product.revenue.toLocaleString('de-DE')} €</p>
                  <p className="text-sm text-muted-foreground">Umsatz</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category and Origin Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kategorien-Statistiken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.categoryStats.slice(0, 5).map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{category.category}</Badge>
                    <span className="text-sm text-muted-foreground">{category.count} Produkte</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{category.totalValue.toLocaleString('de-DE')} €</p>
                    <p className="text-xs text-muted-foreground">
                      Ø {category.averagePrice.toLocaleString('de-DE')} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Herkunft-Statistiken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.originStats.slice(0, 5).map((origin) => (
                <div key={origin.origin} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{origin.origin}</Badge>
                    <span className="text-sm text-muted-foreground">{origin.count} Produkte</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{origin.totalValue.toLocaleString('de-DE')} €</p>
                    <p className="text-xs text-muted-foreground">Gesamtwert</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Treatment Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Behandlungs-Statistiken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.treatmentStats.map((treatment) => (
              <div key={treatment.treatment} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{treatment.treatment}</p>
                  <p className="text-sm text-muted-foreground">{treatment.count} Produkte</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{treatment.percentage.toFixed(1)}%</p>
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-500/50 transition-all duration-300"
                      style={{ width: `${treatment.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weight Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Gewichts-Statistiken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Geschliffene Steine (Karat)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Gesamtgewicht:</span>
                  <span className="font-semibold">{stats.weightStats.totalCaratWeight.toFixed(2)} ct</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Durchschnittsgewicht:</span>
                  <span className="font-semibold">{stats.weightStats.averageCaratWeight.toFixed(2)} ct</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Rohsteine (Gramm)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Gesamtgewicht:</span>
                  <span className="font-semibold">{stats.weightStats.totalGramWeight.toFixed(2)} g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Durchschnittsgewicht:</span>
                  <span className="font-semibold">{stats.weightStats.averageGramWeight.toFixed(2)} g</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
