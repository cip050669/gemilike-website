'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LuminanceSaturationAnalysis } from '../utils/gemstoneAnalysis';

interface LuminanceSaturationSectionProps {
  analysis: LuminanceSaturationAnalysis;
}

export function LuminanceSaturationSection({ analysis }: LuminanceSaturationSectionProps) {
  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-2xl">3. Helligkeits- und Sättigungsanalyse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left p-3 font-semibold">Parameter</th>
                <th className="text-left p-3 font-semibold">Einschätzung</th>
                <th className="text-left p-3 font-semibold">Bemerkung</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Luminanz</td>
                <td className="p-3">{analysis.luminance.assessment}</td>
                <td className="p-3 text-sm text-gray-600">{analysis.luminance.remark}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Sättigung</td>
                <td className="p-3">{analysis.saturation.assessment}</td>
                <td className="p-3 text-sm text-gray-600">{analysis.saturation.remark}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Farbreinheit</td>
                <td className="p-3">{analysis.colorPurity.assessment}</td>
                <td className="p-3 text-sm text-gray-600">{analysis.colorPurity.remark}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-semibold text-gray-700 mb-2">Schlussfolgerung</div>
          <div className="text-base text-gray-700">
            <p>
              Die Helligkeitsanalyse zeigt eine {analysis.luminance.assessment.toLowerCase()} Luminanz
              ({analysis.luminance.value.toFixed(1)}), was auf eine{' '}
              {analysis.luminance.value > 60 ? 'helle' : analysis.luminance.value > 40 ? 'mittlere' : 'dunkle'}{' '}
              Erscheinung des Steins hindeutet. Die Sättigung ist{' '}
              {analysis.saturation.assessment.toLowerCase()} ({analysis.saturation.value.toFixed(1)}),
              und die Farbreinheit wird als {analysis.colorPurity.assessment.toLowerCase()} bewertet
              ({analysis.colorPurity.value.toFixed(1)}%).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

