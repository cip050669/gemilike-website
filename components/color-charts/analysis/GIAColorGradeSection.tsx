'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GIAColorGrade } from '../utils/gemstoneAnalysis';

interface GIAColorGradeSectionProps {
  analysis: GIAColorGrade;
}

export function GIAColorGradeSection({ analysis }: GIAColorGradeSectionProps) {
  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-2xl">5. Gemmologische Farbbezeichnung (Nach GIA-Schema)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800">
                <th className="text-left p-3 font-semibold">Attribut</th>
                <th className="text-left p-3 font-semibold">Bewertung</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Hue</td>
                <td className="p-3">{analysis.hue}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Tone</td>
                <td className="p-3">{analysis.tone}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Saturation</td>
                <td className="p-3">{analysis.saturation}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-medium">Final Color Grade</td>
                <td className="p-3 font-semibold text-lg">{analysis.finalColorGrade}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-semibold text-gray-700 mb-2">Zusammenfassung der Erkenntnisse</div>
          <div className="text-base text-gray-700">
            <p>{analysis.evaluation}</p>
            <p className="mt-2 text-sm text-gray-600">
              Die GIA-Farbbewertung erfolgt nach dem standardisierten Schema mit den Parametern Hue (Farbton),
              Tone (Helligkeit) und Saturation (Sättigung). Diese Bewertung dient als Grundlage für die
              professionelle Edelstein-Bewertung.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

