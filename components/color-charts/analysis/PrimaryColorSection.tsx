'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrimaryColorAnalysis } from '../utils/gemstoneAnalysis';

interface PrimaryColorSectionProps {
  analysis: PrimaryColorAnalysis;
}

export function PrimaryColorSection({ analysis }: PrimaryColorSectionProps) {
  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-2xl">1. Primärfarbe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Color Display */}
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">Farbe</div>
              <div
                className="w-full h-32 rounded-lg border-2 border-gray-300 shadow-lg"
                style={{ backgroundColor: analysis.hex }}
              />
              <div className="mt-2 text-sm font-mono text-gray-700">{analysis.hex}</div>
            </div>
            
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-2">RGB</div>
              <div className="text-base">
                R: {Math.round(analysis.rgb.r)}, G: {Math.round(analysis.rgb.g)}, B: {Math.round(analysis.rgb.b)}
              </div>
            </div>
          </div>

          {/* Analysis Data */}
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">Ton</div>
              <div className="text-base">{analysis.tone}</div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">CIE-Hue</div>
              <div className="text-base">{analysis.cieHue}</div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">Beschreibung</div>
              <div className="text-base">{analysis.description}</div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">Herkunftsvermutung</div>
              <ul className="list-disc list-inside text-base">
                {analysis.originSuggestion.map((origin, index) => (
                  <li key={index}>{origin}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

