'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaletteComparison } from '../utils/paletteComparison';

interface PaletteComparisonSectionProps {
  comparisons: PaletteComparison[];
}

export function PaletteComparisonSection({ comparisons }: PaletteComparisonSectionProps) {
  if (!comparisons || comparisons.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-xl">Palette-Vergleich (ΔE)</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Vergleich der Primärfarbe mit Referenz-Paletten. Niedrigere ΔE-Werte bedeuten eine bessere Übereinstimmung.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {comparisons.map((comparison, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">{comparison.preset.name}</h3>
              {comparison.preset.description && (
                <span className="text-sm text-gray-500">({comparison.preset.description})</span>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Farbe</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">HEX</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">ΔE76</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">ΔE2000</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">Bewertung</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.results.map((result, resultIdx) => {
                    const isBestMatch = resultIdx === 0;
                    return (
                      <tr
                        key={resultIdx}
                        className={`border-b hover:bg-gray-50 ${
                          isBestMatch ? 'bg-green-50' : ''
                        }`}
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded border border-gray-300"
                              style={{ backgroundColor: result.hex }}
                            />
                            {isBestMatch && (
                              <span className="text-xs text-green-600 font-medium">Beste Übereinstimmung</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-900">{result.hex}</td>
                        <td className="px-3 py-2 text-gray-700">{result.dE76.toFixed(2)}</td>
                        <td className={`px-3 py-2 font-medium ${result.interpretation.color}`}>
                          {result.dE2000.toFixed(2)}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col">
                            <span className={`font-medium ${result.interpretation.color}`}>
                              {result.interpretation.level}
                            </span>
                            <span className="text-xs text-gray-500">
                              {result.interpretation.description}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Hinweis:</strong> ΔE2000 ist die präzisere Metrik für wahrnehmungsgerechte Farbdifferenzen.
            ΔE76 ist eine einfachere, schnellere Berechnung. Werte unter 2 sind praktisch nicht wahrnehmbar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

