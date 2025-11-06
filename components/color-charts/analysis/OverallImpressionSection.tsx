'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OverallImpression } from '../utils/gemstoneAnalysis';

interface OverallImpressionSectionProps {
  analysis: OverallImpression;
}

export function OverallImpressionSection({ analysis }: OverallImpressionSectionProps) {
  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-2xl">6. Gesamteindruck mit Fazit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left p-3 font-semibold">Merkmale</th>
                <th className="text-left p-3 font-semibold">Bewertung</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Dominanter Farbton</td>
                <td className="p-3">{analysis.dominantColorTone}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Sättigung</td>
                <td className="p-3">{analysis.saturation}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Pleochroismus</td>
                <td className="p-3">{analysis.pleochroism}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Mögliche Ursache der Farbe</td>
                <td className="p-3">
                  <ul className="list-disc list-inside">
                    {analysis.possibleColorCause.map((cause, index) => (
                      <li key={index}>{cause}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Mögliche Varietät</td>
                <td className="p-3">
                  <ul className="list-disc list-inside">
                    {analysis.possibleVariety.map((variety, index) => (
                      <li key={index}>{variety}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Optische Qualität</td>
                <td className="p-3">{analysis.opticalQuality}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Gesamteindruck</td>
                <td className="p-3">{analysis.overallImpression}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-semibold text-blue-900 mb-2">Fazit</div>
          <div className="text-base text-blue-800">
            <p>{analysis.evaluation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

