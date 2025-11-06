'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, X } from 'lucide-react';
import { deltaE2000Hex, getDeltaEInterpretation } from './utils/deltaE2000';

interface DeltaEPanelProps {
  colors: string[];
  className?: string;
}

export function DeltaEPanel({ colors, className = '' }: DeltaEPanelProps) {
  const [selectedColors, setSelectedColors] = useState<[string | null, string | null]>([null, null]);
  const [deltaE, setDeltaE] = useState<number | null>(null);

  const handleColorClick = (color: string) => {
    if (selectedColors[0] === null) {
      setSelectedColors([color, null]);
      setDeltaE(null);
    } else if (selectedColors[0] === color) {
      // Deselect if clicking the same color
      setSelectedColors([null, null]);
      setDeltaE(null);
    } else if (selectedColors[1] === null) {
      const newSelection: [string, string] = [selectedColors[0], color];
      setSelectedColors(newSelection);
      
      // Calculate delta E
      const result = deltaE2000Hex(newSelection[0], newSelection[1]);
      setDeltaE(result);
    } else {
      // Replace second selection
      const newSelection: [string, string] = [selectedColors[0], color];
      setSelectedColors(newSelection);
      
      const result = deltaE2000Hex(newSelection[0], newSelection[1]);
      setDeltaE(result);
    }
  };

  const clearSelection = () => {
    setSelectedColors([null, null]);
    setDeltaE(null);
  };

  const interpretation = deltaE !== null ? getDeltaEInterpretation(deltaE) : null;

  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            ΔE2000 Farbvergleich
          </CardTitle>
          {(selectedColors[0] || selectedColors[1]) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400">
          Klicken Sie auf zwei Farben, um den CIEDE2000-Farbunterschied zu berechnen.
        </p>

        {/* Color selection display */}
        {(selectedColors[0] || selectedColors[1]) && (
          <div className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">Farbe 1</div>
              {selectedColors[0] ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-12 h-12 rounded border-2 border-gray-600"
                    style={{ backgroundColor: selectedColors[0] }}
                  />
                  <span className="text-sm font-mono text-white">{selectedColors[0]}</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Wählen Sie eine Farbe...</div>
              )}
            </div>
            <div className="text-2xl text-gray-600">vs</div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">Farbe 2</div>
              {selectedColors[1] ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-12 h-12 rounded border-2 border-gray-600"
                    style={{ backgroundColor: selectedColors[1] }}
                  />
                  <span className="text-sm font-mono text-white">{selectedColors[1]}</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Wählen Sie eine Farbe...</div>
              )}
            </div>
          </div>
        )}

        {/* Delta E result */}
        {deltaE !== null && interpretation && (
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400">ΔE2000 Wert:</div>
              <div className="text-2xl font-bold text-white">{deltaE.toFixed(2)}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className={`text-lg font-semibold ${interpretation.color}`}>
                {interpretation.level}
              </div>
              <div className="text-sm text-gray-400 mt-1">{interpretation.description}</div>
            </div>
          </div>
        )}

        {/* Color grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {colors.map((color, index) => {
            const isSelected = selectedColors[0] === color || selectedColors[1] === color;
            return (
              <button
                key={index}
                onClick={() => handleColorClick(color)}
                className={`
                  relative w-full aspect-square rounded-lg border-2 transition-all
                  ${isSelected
                    ? 'border-[#9A1A63] ring-2 ring-[#9A1A63] ring-offset-2 ring-offset-gray-800 scale-105'
                    : 'border-gray-600 hover:border-gray-500'
                  }
                `}
                style={{ backgroundColor: color }}
                title={color}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#9A1A63] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {selectedColors[0] === color ? '1' : '2'}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

