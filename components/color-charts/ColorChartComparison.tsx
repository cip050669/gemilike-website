'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { GemColorCard, ColorChart } from './GemColorCard';

interface ColorChartComparisonProps {
  charts: ColorChart[];
  maxCharts?: number;
  className?: string;
}

export function ColorChartComparison({ 
  charts, 
  maxCharts = 4,
  className = '' 
}: ColorChartComparisonProps) {
  const [selectedCharts, setSelectedCharts] = useState<ColorChart[]>([]);

  const handleAddChart = (chart: ColorChart) => {
    if (selectedCharts.length >= maxCharts) {
      alert(`Maximal ${maxCharts} Farbtafeln können verglichen werden.`);
      return;
    }
    if (selectedCharts.some(c => c.id === chart.id)) {
      return; // Already selected
    }
    setSelectedCharts([...selectedCharts, chart]);
  };

  const handleRemoveChart = (chartId: string) => {
    setSelectedCharts(selectedCharts.filter(c => c.id !== chartId));
  };

  const availableCharts = charts.filter(
    chart => !selectedCharts.some(c => c.id === chart.id)
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Chart Selection */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">
            Farbtafeln-Vergleich ({selectedCharts.length}/{maxCharts})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 mb-4">
            Wählen Sie bis zu {maxCharts} Farbtafeln aus, um sie nebeneinander zu vergleichen.
          </p>

          {/* Selected Charts Preview */}
          {selectedCharts.length > 0 && (
            <div className="mb-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Ausgewählte Farbtafeln:</div>
              <div className="flex flex-wrap gap-2">
                {selectedCharts.map((chart) => (
                  <div
                    key={chart.id}
                    className="flex items-center gap-2 px-3 py-1 bg-[#9A1A63]/20 border border-[#9A1A63] rounded-full"
                  >
                    <span className="text-sm text-white">{chart.name}</span>
                    <button
                      onClick={() => handleRemoveChart(chart.id)}
                      className="text-[#9A1A63] hover:text-[#7a1450]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Charts Dropdown */}
          {availableCharts.length > 0 && selectedCharts.length < maxCharts && (
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Farbtafel hinzufügen:</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableCharts.slice(0, 8).map((chart) => (
                  <Button
                    key={chart.id}
                    variant="outline"
                    onClick={() => handleAddChart(chart)}
                    className="justify-start text-left"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {chart.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {selectedCharts.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Wählen Sie Farbtafeln aus, um sie zu vergleichen
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comparison View */}
      {selectedCharts.length > 0 && (
        <div className={`grid gap-6 ${
          selectedCharts.length === 1 ? 'grid-cols-1' :
          selectedCharts.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
          selectedCharts.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}>
          {selectedCharts.map((chart) => (
            <div key={chart.id} className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveChart(chart.id)}
                className="absolute top-2 right-2 z-10 bg-gray-800/80 hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
              <GemColorCard
                chart={chart}
                showExport={false}
                showPleochroism={true}
                showDeltaE={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

