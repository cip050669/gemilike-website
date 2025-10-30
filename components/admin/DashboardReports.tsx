'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminButton } from './AdminButton';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Star,
  ShoppingCart,
  Award,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  FileText,
  Printer
} from 'lucide-react';
import { Gemstone } from '@/lib/types/gemstone';
import { allGemstones } from '@/lib/data/gemstones';

interface DashboardStats {
  totalRevenue: number;
  totalGemstones: number;
  availableGemstones: number;
  soldGemstones: number;
  averagePrice: number;
  mostPopularCategory: string;
  mostExpensiveGemstone: Gemstone | null;
  cheapestGemstone: Gemstone | null;
  categoryStats: { [key: string]: number };
  priceRangeStats: {
    under1000: number;
    under5000: number;
    under10000: number;
    over10000: number;
  };
  monthlyStats: {
    current: number;
    previous: number;
    growth: number;
  };
}

export function DashboardReports() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Hilfsfunktionen für Zeitraum-Berechnungen
  const getPeriodMultiplier = (period: 'week' | 'month' | 'quarter' | 'year') => {
    switch (period) {
      case 'week': return 0.25; // 1/4 eines Monats
      case 'month': return 1; // Basis
      case 'quarter': return 3; // 3 Monate
      case 'year': return 12; // 12 Monate
      default: return 1;
    }
  };

  const calculateGrowthRate = (period: 'week' | 'month' | 'quarter' | 'year') => {
    // Simulierte Wachstumsraten basierend auf Zeitraum
    switch (period) {
      case 'week': return 3.8; // 3.8% pro Woche
      case 'month': return 15.2; // 15.2% pro Monat
      case 'quarter': return 45.6; // 45.6% pro Quartal
      case 'year': return 182.4; // 182.4% pro Jahr
      default: return 15.2;
    }
  };

  const getPeriodLabel = (period: 'week' | 'month' | 'quarter' | 'year') => {
    switch (period) {
      case 'week': return 'Woche';
      case 'month': return 'Monat';
      case 'quarter': return 'Quartal';
      case 'year': return 'Jahr';
      default: return 'Monat';
    }
  };

  // Funktionale Button-Handler
  const handleRefresh = () => {
    setIsLoading(true);
    setStats(null);
    
    // Simuliere Ladezeit und zeige sichtbare Änderung
    setTimeout(() => {
      calculateStats();
      setIsLoading(false);
      alert('✅ Berichte wurden aktualisiert!');
    }, 1000);
  };

  const handleExportReport = () => {
    if (!stats) {
      alert('❌ Keine Daten zum Exportieren verfügbar!');
      return;
    }
    
    
    const reportData = {
      zeitraum: getPeriodLabel(selectedPeriod),
      datum: new Date().toLocaleDateString('de-DE'),
      zeitstempel: new Date().toISOString(),
      gesamtumsatz: stats.totalRevenue,
      edelsteineGesamt: stats.totalGemstones,
      verfuegbar: stats.availableGemstones,
      verkauft: stats.soldGemstones,
      durchschnittspreis: stats.averagePrice,
      beliebtesteKategorie: stats.mostPopularCategory,
      kategorieStats: stats.categoryStats,
      preisbereichStats: stats.priceRangeStats,
      wachstumsrate: stats.monthlyStats.growth
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `gemilike-bericht-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert(`✅ Bericht wurde als ${exportFileDefaultName} heruntergeladen!`);
  };

  const handlePrintReport = () => {
    window.print();
    alert('🖨️ Druckdialog wurde geöffnet!');
  };

  const handleGeneratePDF = () => {
    alert('📄 PDF-Generierung wird implementiert...');
  };

  const calculateStats = useCallback(() => {
    const gemstones = allGemstones;
    const periodMultiplier = getPeriodMultiplier(selectedPeriod);
    const totalGemstones = gemstones.length;
    const availableGemstones = gemstones.filter(g => g.inStock).length;
    const soldGemstones = totalGemstones - availableGemstones;
    const baseRevenue = gemstones.reduce((sum, g) => sum + g.price, 0);
    const totalRevenue = baseRevenue * periodMultiplier;
    const averagePrice = totalRevenue / totalGemstones;

    const categoryStats: { [key: string]: number } = {};
    gemstones.forEach(gemstone => {
      categoryStats[gemstone.category] = (categoryStats[gemstone.category] || 0) + 1;
    });

    const mostPopularCategory = Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Keine Daten';

    const mostExpensiveGemstone = gemstones.reduce((max, gem) => 
      gem.price > max.price ? gem : max, gemstones[0]);
    const cheapestGemstone = gemstones.reduce((min, gem) => 
      gem.price < min.price ? gem : min, gemstones[0]);

    const priceRangeStats = {
      under1000: gemstones.filter(g => g.price < 1000).length,
      under5000: gemstones.filter(g => g.price >= 1000 && g.price < 5000).length,
      under10000: gemstones.filter(g => g.price >= 5000 && g.price < 10000).length,
      over10000: gemstones.filter(g => g.price >= 10000).length,
    };

    const periodStats = {
      current: totalRevenue,
      previous: totalRevenue * 0.85,
      growth: calculateGrowthRate(selectedPeriod)
    };

    setStats({
      totalRevenue,
      totalGemstones,
      availableGemstones,
      soldGemstones,
      averagePrice,
      mostPopularCategory,
      mostExpensiveGemstone,
      cheapestGemstone,
      categoryStats,
      priceRangeStats,
      monthlyStats: periodStats
    });
    setLastUpdate(new Date().toLocaleTimeString('de-DE'));
  }, [selectedPeriod]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  

  if (!stats || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-muted-foreground mb-2">
            {isLoading ? '🔄 Lade Statistiken...' : 'Lade Statistiken...'}
          </div>
          {isLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard-Berichte</h2>
          {lastUpdate && (
            <p className="text-sm text-muted-foreground">
              Letzte Aktualisierung: {lastUpdate} | Zeitraum: {getPeriodLabel(selectedPeriod)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <AdminButton
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setSelectedPeriod(period);
                setIsLoading(true);
                setStats(null);
                
                // Zeige sichtbare Änderung
                setTimeout(() => {
                  calculateStats();
                  setIsLoading(false);
                  alert(`📊 Berichte für ${getPeriodLabel(period)} geladen!`);
                }, 800);
              }}
            >
              {getPeriodLabel(period)}
            </AdminButton>
          ))}
        </div>
      </div>

      {/* Aktions-Buttons */}
      <div className="flex gap-2 flex-wrap">
        <AdminButton
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2 hover:bg-gray-500/50"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Lädt...' : 'Aktualisieren'}
        </AdminButton>
        <AdminButton
          variant="outline"
          size="sm"
          onClick={handleExportReport}
          className="flex items-center gap-2 hover:bg-blue-50"
          disabled={!stats}
        >
          <Download className="h-4 w-4" />
          Exportieren
        </AdminButton>
        <AdminButton
          variant="outline"
          size="sm"
          onClick={handlePrintReport}
          className="flex items-center gap-2 hover:bg-purple-50"
        >
          <Printer className="h-4 w-4" />
          Drucken
        </AdminButton>
        <AdminButton
          variant="outline"
          size="sm"
          onClick={handleGeneratePDF}
          className="flex items-center gap-2 hover:bg-orange-50"
        >
          <FileText className="h-4 w-4" />
          PDF generieren
        </AdminButton>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamtumsatz</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{stats.totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{stats.monthlyStats.growth}% vs. Vor{getPeriodLabel(selectedPeriod).toLowerCase()}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Edelsteine gesamt</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGemstones}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableGemstones} verfügbar, {stats.soldGemstones} verkauft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschnittspreis</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{stats.averagePrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Pro Edelstein
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beliebteste Kategorie</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categoryStats[stats.mostPopularCategory] || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats.mostPopularCategory}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detaillierte Statistiken */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Kategorie-Verteilung */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Kategorie-Verteilung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.categoryStats)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)` 
                        }}
                      />
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Preisbereich-Verteilung */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Preisbereich-Verteilung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Unter €1.000</span>
                <Badge variant="outline">{stats.priceRangeStats.under1000}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">€1.000 - €5.000</span>
                <Badge variant="outline">{stats.priceRangeStats.under5000}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">€5.000 - €10.000</span>
                <Badge variant="outline">{stats.priceRangeStats.under10000}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Über €10.000</span>
                <Badge variant="outline">{stats.priceRangeStats.over10000}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Edelsteine */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Teuerster Edelstein
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.mostExpensiveGemstone && (
              <div className="space-y-2">
                <div className="font-semibold">{stats.mostExpensiveGemstone.name}</div>
                <div className="text-2xl font-bold text-green-600">
                  €{stats.mostExpensiveGemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stats.mostExpensiveGemstone.category} • {stats.mostExpensiveGemstone.origin}
                </div>
                <Badge variant={stats.mostExpensiveGemstone.inStock ? "default" : "secondary"}>
                  {stats.mostExpensiveGemstone.inStock ? "Verfügbar" : "Verkauft"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Günstigster Edelstein
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.cheapestGemstone && (
              <div className="space-y-2">
                <div className="font-semibold">{stats.cheapestGemstone.name}</div>
                <div className="text-2xl font-bold text-blue-600">
                  €{stats.cheapestGemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stats.cheapestGemstone.category} • {stats.cheapestGemstone.origin}
                </div>
                <Badge variant={stats.cheapestGemstone.inStock ? "default" : "secondary"}>
                  {stats.cheapestGemstone.inStock ? "Verfügbar" : "Verkauft"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Verfügbarkeits-Übersicht */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Verfügbarkeits-Übersicht
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{stats.availableGemstones}</div>
              <div className="text-sm text-green-700">Verfügbar</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{stats.soldGemstones}</div>
              <div className="text-sm text-red-700">Verkauft</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round((stats.availableGemstones / stats.totalGemstones) * 100)}%
              </div>
              <div className="text-sm text-blue-700">Verfügbarkeitsrate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
