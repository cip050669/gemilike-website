'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpectralCharacteristic } from '../utils/gemstoneAnalysis';

interface SpectralCharacteristicSectionProps {
  analysis: SpectralCharacteristic;
}

export function SpectralCharacteristicSection({ analysis }: SpectralCharacteristicSectionProps) {
  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-2xl">4. Spektrale Charakteristik (visuell angenähert)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-1">Hauptabsorption</div>
            <div className="text-base">{analysis.mainAbsorption}</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-600 mb-1">Sekundärabsorption</div>
            <div className="text-base">{analysis.secondaryAbsorption}</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-600 mb-1">Transmission</div>
            <div className="text-base">{analysis.transmission}</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-600 mb-1">Schwache Transmission</div>
            <div className="text-base">{analysis.weakTransmission}</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-semibold text-gray-700 mb-2">Interpretation des Ergebnisses</div>
          <div className="text-base text-gray-700">
            <p>{analysis.interpretation}</p>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Hinweis:</strong> Diese Analyse basiert auf visueller Farbapproximation.
              Für präzise spektroskopische Daten wird eine professionelle Spektroskopie empfohlen.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

