'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SecondaryColorAnalysis } from '../utils/gemstoneAnalysis';

interface SecondaryColorSectionProps {
  analysis: SecondaryColorAnalysis[];
  pleochroism: string;
}

export function SecondaryColorSection({ analysis, pleochroism }: SecondaryColorSectionProps) {
  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-2xl">2. Sekundärfarbe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left p-3 font-semibold">Bereich</th>
                <th className="text-left p-3 font-semibold">Farbcode (Hex)</th>
                <th className="text-left p-3 font-semibold">Tonbeschreibung</th>
                <th className="text-left p-3 font-semibold">Anteil (%)</th>
              </tr>
            </thead>
            <tbody>
              {analysis.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-3">{item.region}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: item.hex }}
                      />
                      <span className="font-mono text-sm">{item.hex}</span>
                    </div>
                  </td>
                  <td className="p-3">{item.tone}</td>
                  <td className="p-3">{item.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-semibold text-gray-700 mb-2">
            Interpretation nach Pleochroismus-Tendenz
          </div>
          <div className="text-base text-gray-700">
            <p className="mb-2">
              <strong>Pleochroismus:</strong> {pleochroism}
            </p>
            <p className="text-sm text-gray-600">
              Die Analyse zeigt unterschiedliche Farbtöne in verschiedenen Bereichen des Steins.
              Dies deutet auf {pleochroism.toLowerCase()} hin, was typisch für anisotrope Edelsteine ist.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

