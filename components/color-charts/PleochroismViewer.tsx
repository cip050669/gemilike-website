'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface PleochroismViewerProps {
  colors: string[];
  className?: string;
}

export function PleochroismViewer({ colors, className = '' }: PleochroismViewerProps) {
  if (!colors || colors.length === 0) {
    return (
      <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Pleochroismus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">Keine Pleochroismus-Daten verfügbar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Pleochroismus
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Pleochroismus zeigt die unterschiedlichen Farben, die ein Edelstein je nach Betrachtungswinkel zeigt.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-700 bg-gray-900/50"
              >
                <div
                  className="w-full h-24 rounded-md border-2 border-gray-600 shadow-lg"
                  style={{ backgroundColor: color }}
                  title={color}
                />
                <div className="text-xs text-gray-400 font-mono">{color}</div>
                <div className="text-xs text-gray-500">Richtung {index + 1}</div>
              </div>
            ))}
          </div>

          {/* Visual comparison */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400 mb-2">Vergleichsansicht:</div>
            <div className="flex gap-2 items-center justify-center">
              {colors.map((color, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div
                    className="w-16 h-16 rounded-full border-2 border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-gray-500">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

