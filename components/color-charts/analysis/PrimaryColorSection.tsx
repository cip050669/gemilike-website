'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrimaryColorAnalysis } from '../utils/gemstoneAnalysis';

interface PrimaryColorSectionProps {
  analysis: PrimaryColorAnalysis;
}

function Swatch({ hex, label, rgb }: { hex: string; label: string; rgb: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border bg-white/50 shadow-sm">
      <div className="h-10 w-10 rounded-xl border" style={{ backgroundColor: hex }} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-600">HEX {hex} • RGB {rgb}</div>
      </div>
    </div>
  );
}

export function PrimaryColorSection({ analysis }: PrimaryColorSectionProps) {
  const rgbString = `(${Math.round(analysis.rgb.r)}, ${Math.round(analysis.rgb.g)}, ${Math.round(analysis.rgb.b)})`;
  
  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">1️⃣ Hauptfarbton (dominant)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Swatch 
          hex={analysis.hex}
          label={analysis.description}
          rgb={rgbString}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-1">Ton</div>
            <div className="text-base text-gray-900">{analysis.tone}</div>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-600 mb-1">CIE-Hue</div>
            <div className="text-base text-gray-900">{analysis.cieHue}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold text-gray-600 mb-2">Herkunftsvermutung</div>
          <ul className="list-disc pl-5 text-sm text-gray-800 space-y-1">
            {analysis.originSuggestion.map((origin, index) => (
              <li key={index}>{origin}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

