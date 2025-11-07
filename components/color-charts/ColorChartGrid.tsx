'use client';

import { useState, useEffect } from 'react';
import { ColorChartCard } from './ColorChartCard';
import { GemColorCard, ColorChart } from './GemColorCard';
import { UploadPanel } from './UploadPanel';
import { ColorChartComparison } from './ColorChartComparison';
import { PrintLayout } from './PrintLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

interface ColorChartGridProps {
  locale?: string;
  initialCharts?: ColorChart[];
}

export function ColorChartGrid({ locale = 'de', initialCharts = [] }: ColorChartGridProps) {
  const [charts, setCharts] = useState<ColorChart[]>(initialCharts);
  const [selectedChart, setSelectedChart] = useState<ColorChart | null>(
    initialCharts.length > 0 ? initialCharts[0] : null
  );
  const [loading, setLoading] = useState(!initialCharts.length);
  const [importedCharts, setImportedCharts] = useState<ColorChart[]>([]);

  const handleImport = (newCharts: ColorChart[]) => {
    setImportedCharts(prev => [...prev, ...newCharts]);
    // Optionally select the first imported chart
    if (newCharts.length > 0 && !selectedChart) {
      setSelectedChart(newCharts[0]);
    }
  };

  // Combine server charts with imported charts
  const allCharts = [...charts, ...importedCharts];

  useEffect(() => {
    if (initialCharts.length === 0) {
      fetchCharts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const fetchCharts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/color-charts?locale=${locale}&published=true`);
      const data = await response.json();
      
      if (data.success && data.charts) {
        setCharts(data.charts);
        if (data.charts.length > 0) {
          setSelectedChart(data.charts[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching color charts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Lade Farbtafeln...</div>
      </div>
    );
  }

  if (allCharts.length === 0 && !loading) {
    return (
      <div className="space-y-8">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            Noch keine Farbtafeln verfügbar.
          </p>
        </Card>
        <UploadPanel onImport={handleImport} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* JSON Import Panel */}
      <UploadPanel onImport={handleImport} />

      {/* Tabs for different views */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grid">Grid-Ansicht</TabsTrigger>
          <TabsTrigger value="comparison">Vergleich</TabsTrigger>
          <TabsTrigger value="print">Drucklayout</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-8">
          {/* Grid of Color Charts */}
          {allCharts.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allCharts.map((chart) => (
                <ColorChartCard
                  key={chart.id}
                  chart={chart}
                  onClick={() => setSelectedChart(chart)}
                  className={selectedChart?.id === chart.id ? 'ring-2 ring-[#9A1A63]' : ''}
                />
              ))}
            </div>
          )}

          {/* Selected Chart Detail View */}
          {selectedChart && (
            <div className="mt-8">
              <GemColorCard 
                chart={selectedChart}
                showExport={true}
                showPleochroism={true}
                showDeltaE={true}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-8">
          <ColorChartComparison charts={allCharts} maxCharts={4} />
        </TabsContent>

        <TabsContent value="print" className="space-y-8">
          {selectedChart ? (
            <PrintLayout chart={selectedChart} format="A4" />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Wählen Sie eine Farbtafel aus, um das Drucklayout anzuzeigen.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

