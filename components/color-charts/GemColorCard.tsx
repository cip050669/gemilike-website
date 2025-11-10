'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileJson, Image as ImageIcon, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { GradientBar } from './GradientBar';
import { PleochroismViewer } from './PleochroismViewer';
import { DeltaEPanel } from './DeltaEPanel';
import { generateGradientFromGIA } from './utils/giaToGradient';

export interface ColorChart {
  id: string;
  name: string;
  origin?: string | null;
  locale: string;
  gia: {
    hue?: string;
    tone?: string;
    sat?: string;
  };
  gradient: string[];
  pleochro: string[];
  light: string;
  note?: string | null;
  description?: string | null;
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface GemColorCardProps {
  chart: ColorChart;
  className?: string;
  showExport?: boolean;
  showPleochroism?: boolean;
  showDeltaE?: boolean;
}

export function GemColorCard({ 
  chart, 
  className = '',
  showExport = true,
  showPleochroism = true,
  showDeltaE = true,
}: GemColorCardProps) {
  const [isExportingPNG, setIsExportingPNG] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(chart, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chart.name.replace(/\s+/g, '-').toLowerCase()}-${chart.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPNG = async () => {
    if (!cardRef.current) return;

    setIsExportingPNG(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chart.name.replace(/\s+/g, '-').toLowerCase()}-${chart.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Fehler beim Exportieren der PNG-Datei');
    } finally {
      setIsExportingPNG(false);
    }
  };

  // Get all colors for delta E comparison
  const allColors = [...chart.gradient, ...chart.pleochro];

  return (
    <div ref={cardRef}>
      <Card className={`${className}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{chart.name}</CardTitle>
              {chart.origin && (
                <CardDescription className="text-base">
                  {chart.origin}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              {chart.featured && (
                <Badge variant="default" className="bg-[#9A1A63]">
                  Featured
                </Badge>
              )}
              {showExport && (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportJSON}
                    className="flex items-center gap-2"
                  >
                    <FileJson className="h-4 w-4" />
                    JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportPNG}
                    disabled={isExportingPNG}
                    className="flex items-center gap-2"
                  >
                    {isExportingPNG ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    PNG
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
        {/* Gradient Bar */}
        <div>
          <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
            Farbverlauf
          </h3>
          {(() => {
            // Check if we have a manual gradient
            const hasManualGradient = Array.isArray(chart.gradient) && chart.gradient.length > 0;
            
            // If no manual gradient, try to generate from GIA data
            if (!hasManualGradient && chart.gia?.hue) {
              const giaGradient = generateGradientFromGIA(chart.gia);
              if (giaGradient.length > 0) {
                return <GradientBar colors={giaGradient} height={80} />;
              }
            }
            
            // Show manual gradient if available
            if (hasManualGradient) {
              return <GradientBar colors={chart.gradient} height={80} />;
            }
            
            // No gradient available
            return (
              <div className="h-20 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-muted-foreground">
                Kein Farbverlauf verfügbar
              </div>
            );
          })()}
        </div>

        {/* GIA Data */}
        {chart.gia && (
          <div className="grid grid-cols-3 gap-4">
            {chart.gia.hue && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Hue</div>
                <div className="text-sm font-medium">{chart.gia.hue}</div>
              </div>
            )}
            {chart.gia.tone && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Tone</div>
                <div className="text-sm font-medium">{chart.gia.tone}</div>
              </div>
            )}
            {chart.gia.sat && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Saturation</div>
                <div className="text-sm font-medium">{chart.gia.sat}</div>
              </div>
            )}
          </div>
        )}

        {/* Pleochroism Viewer */}
        {showPleochroism && chart.pleochro && chart.pleochro.length > 0 && (
          <PleochroismViewer colors={chart.pleochro} />
        )}

        {/* Light Standard */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Lichtstandard</div>
          <div className="text-sm">{chart.light}</div>
        </div>

        {/* Note */}
        {chart.note && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Notiz</div>
            <div className="text-sm">{chart.note}</div>
          </div>
        )}

        {/* Description */}
        {chart.description && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Beschreibung</div>
            <div className="text-sm">{chart.description}</div>
          </div>
        )}

        {/* Delta E Panel */}
        {showDeltaE && allColors.length > 1 && (
          <DeltaEPanel colors={allColors} />
        )}
      </CardContent>
    </Card>
    </div>
  );
}

