'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export function SimpleDashboardReports() {
  const [currentPeriod, setCurrentPeriod] = useState('month');
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Einfache Berechnung der Statistiken
  const calculateStats = () => {
    const gemstones = allGemstones;
    
    // Multiplikator basierend auf Zeitraum
    let multiplier = 1;
    switch (currentPeriod) {
      case 'week': multiplier = 0.25; break;
      case 'month': multiplier = 1; break;
      case 'quarter': multiplier = 3; break;
      case 'year': multiplier = 12; break;
    }

    const totalGemstones = gemstones.length;
    const availableGemstones = gemstones.filter(g => g.inStock).length;
    const soldGemstones = totalGemstones - availableGemstones;
    const baseRevenue = gemstones.reduce((sum, g) => sum + g.price, 0);
    const totalRevenue = baseRevenue * multiplier;
    const averagePrice = totalRevenue / totalGemstones;

    // Kategorie-Statistiken
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

    return {
      totalRevenue,
      totalGemstones,
      availableGemstones,
      soldGemstones,
      averagePrice,
      mostPopularCategory,
      mostExpensiveGemstone,
      cheapestGemstone,
      categoryStats,
      multiplier
    };
  };

  // Initiale Berechnung
  useEffect(() => {
    const initialData = calculateStats();
    setReportData(initialData);
  }, []);

  // Neuberechnung bei Zeitraum-Änderung
  useEffect(() => {
    if (reportData) {
      const newData = calculateStats();
      setReportData(newData);
    }
  }, [currentPeriod]);

  // Button-Handler - Alle funktional
  const handlePeriodChange = (period: string) => {
    setCurrentPeriod(period);
    alert(`✅ Zeitraum geändert zu: ${period}`);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const newData = calculateStats();
      setReportData(newData);
      setIsLoading(false);
      alert('✅ Berichte wurden aktualisiert!');
    }, 1000);
  };

  const handleExport = () => {
    if (!reportData) {
      alert('❌ Keine Daten verfügbar!');
      return;
    }

    const exportData = {
      zeitraum: currentPeriod,
      datum: new Date().toLocaleDateString('de-DE'),
      zeitstempel: new Date().toISOString(),
      ...reportData
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const fileName = `gemilike-bericht-${currentPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = fileName;
    link.click();
    
    alert(`✅ Bericht ${fileName} wurde heruntergeladen!`);
  };

  const handlePrint = () => {
    window.print();
    alert('🖨️ Druckdialog wurde geöffnet!');
  };

  if (!reportData) {
    return <div className="p-8 text-center">Lade Berichte...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard-Berichte</h2>
          <p className="text-sm text-muted-foreground">
            Aktueller Zeitraum: {currentPeriod} | Letzte Aktualisierung: {new Date().toLocaleTimeString('de-DE')}
          </p>
        </div>
      </div>

      {/* Zeitraum-Buttons */}
      <div className="flex gap-2">
        {['week', 'month', 'quarter', 'year'].map((period) => (
          <Button
            key={period}
            variant={currentPeriod === period ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              handlePeriodChange(period);
            }}
            disabled={isLoading}
            className="hover:bg-blue-100"
          >
            {period === 'week' && '📅 Woche'}
            {period === 'month' && '📅 Monat'}
            {period === 'quarter' && '📅 Quartal'}
            {period === 'year' && '📅 Jahr'}
          </Button>
        ))}
      </div>

      {/* Aktions-Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handleRefresh();
          }}
          disabled={isLoading}
          className="hover:bg-gray-500/50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? '🔄 Lädt...' : '🔄 Aktualisieren'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handleExport();
          }}
          className="hover:bg-blue-100"
        >
          <Download className="h-4 w-4 mr-2" />
          💾 Exportieren
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            handlePrint();
          }}
          className="hover:bg-purple-100"
        >
          <Printer className="h-4 w-4 mr-2" />
          🖨️ Drucken
        </Button>
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
              €{reportData.totalRevenue.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Multiplikator: {reportData.multiplier}x
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Edelsteine gesamt</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalGemstones}</div>
            <p className="text-xs text-muted-foreground">
              {reportData.availableGemstones} verfügbar, {reportData.soldGemstones} verkauft
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
              €{reportData.averagePrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
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
            <div className="text-2xl font-bold">{reportData.categoryStats[reportData.mostPopularCategory] || 0}</div>
            <p className="text-xs text-muted-foreground">
              {reportData.mostPopularCategory}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detaillierte Statistiken */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Kategorie-Verteilung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(reportData.categoryStats)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category}</span>
                    <Badge variant="secondary">{count as number}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Edelsteine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-green-600">Teuerster</div>
                <div className="text-lg font-bold">
                  €{reportData.mostExpensiveGemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {reportData.mostExpensiveGemstone.name}
                </div>
              </div>
              <div>
                <div className="font-semibold text-blue-600">Günstigster</div>
                <div className="text-lg font-bold">
                  €{reportData.cheapestGemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {reportData.cheapestGemstone.name}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Lade Berichte...</p>
          </div>
        </div>
      )}
    </div>
  );
}
