'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SecondaryColorAnalysis } from '../utils/gemstoneAnalysis';

interface SecondaryColorSectionProps {
  analysis: SecondaryColorAnalysis[];
  pleochroism: string;
}

function Swatch({ hex, label, rgb, share }: { hex: string; label: string; rgb: string; share?: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border bg-white/50 shadow-sm">
      <div className="h-10 w-10 rounded-xl border" style={{ backgroundColor: hex }} />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="text-xs text-gray-600">HEX {hex} • RGB {rgb}{share ? ` • Anteil ${share}` : ""}</div>
      </div>
    </div>
  );
}

export function SecondaryColorSection({ analysis, pleochroism }: SecondaryColorSectionProps) {
  return (
    <Card className="bg-white border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">2️⃣ Nebenfarbtöne (sekundär)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          {analysis.map((item, index) => {
            // Safely handle rgb - convert from 0-255 range if needed
            const rgbString = item.rgb 
              ? `(${Math.round(item.rgb.r)}, ${Math.round(item.rgb.g)}, ${Math.round(item.rgb.b)})`
              : '(0, 0, 0)'; // Fallback if rgb is missing
            return (
              <Swatch
                key={index}
                hex={item.hex}
                label={`${item.region} – ${item.tone}`}
                rgb={rgbString}
                share={`≈ ${item.percentage.toFixed(0)}%`}
              />
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border bg-indigo-50/60 p-4">
          <div className="text-sm font-semibold text-indigo-900 mb-2">
            Interpretation nach Pleochroismus-Tendenz
          </div>
          <div className="text-sm text-indigo-900">
            <p className="mb-2">
              <strong>Pleochroismus:</strong> {pleochroism}
            </p>
            <p className="text-xs text-indigo-700">
              {pleochroism.toLowerCase().includes('isotrop') && !pleochroism.toLowerCase().includes('anisotrop') ? (
                <>Der Edelstein zeigt keine Pleochroismus-Tendenz, was typisch für isotrope Edelsteine (kubisches Kristallsystem) ist.</>
              ) : pleochroism.toLowerCase().includes('anisotrop') || pleochroism.toLowerCase().includes('pleochroismus') ? (
                <>Die Analyse zeigt unterschiedliche Farbtöne in verschiedenen Bereichen des Steins. Dies deutet auf Pleochroismus hin, was typisch für anisotrope Edelsteine (nicht-kubisches Kristallsystem) wie Turmalin, Saphir, Rubin, Smaragd und andere ist.</>
              ) : (
                <>Die Analyse zeigt keine eindeutige Pleochroismus-Tendenz. Weitere gemmologische Tests werden zur Bestimmung empfohlen.</>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

