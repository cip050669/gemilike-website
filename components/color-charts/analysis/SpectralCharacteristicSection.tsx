'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpectralCharacteristic } from '../utils/gemstoneAnalysis';

interface SpectralCharacteristicSectionProps {
  analysis: SpectralCharacteristic;
}

export function SpectralCharacteristicSection({ analysis }: SpectralCharacteristicSectionProps) {
  const spectralBullets = [
    analysis.mainAbsorption,
    analysis.secondaryAbsorption,
    analysis.transmission,
    analysis.weakTransmission,
  ];

  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">4️⃣ Spektrale Charakteristik (visuell angenähert)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
          {spectralBullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
        
        <div className="rounded-2xl border bg-indigo-50/60 p-4 text-sm text-indigo-900">
          <span className="font-medium">Interpretation:</span> {analysis.interpretation}
        </div>
      </CardContent>
    </Card>
  );
}

