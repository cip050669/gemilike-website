'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import { ColorChart } from './GemColorCard';
import { GradientBar } from './GradientBar';
import html2canvas from 'html2canvas';

interface PrintLayoutProps {
  chart: ColorChart;
  format?: 'A4' | 'A5';
  className?: string;
}

export function PrintLayout({ chart, format = 'A4', className = '' }: PrintLayoutProps) {
  const printRef = useRef<HTMLDivElement>(null);

  // A4: 210mm x 297mm (8.27" x 11.69") at 96 DPI = 794px x 1123px
  // A5: 148mm x 210mm (5.83" x 8.27") at 96 DPI = 559px x 794px
  const dimensions = format === 'A4' 
    ? { width: '794px', height: '1123px' }
    : { width: '559px', height: '794px' };

  const handlePrint = () => {
    if (!printRef.current) return;
    window.print();
  };

  const handleExportPDF = async () => {
    if (!printRef.current) return;

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
      });

      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${chart.name.replace(/\s+/g, '-').toLowerCase()}-${format}-${chart.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting print layout:', error);
      alert('Fehler beim Exportieren des Drucklayouts');
    }
  };

  return (
    <div className={className}>
      {/* Print Controls */}
      <div className="mb-4 flex gap-2 print:hidden">
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Drucken
        </Button>
        <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Als Bild exportieren
        </Button>
      </div>

      {/* Print Layout */}
      <div
        ref={printRef}
        className="bg-white text-black p-8 mx-auto shadow-lg"
        style={{
          width: dimensions.width,
          minHeight: dimensions.height,
        }}
      >
        {/* Header */}
        <div className="mb-6 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold mb-2">{chart.name}</h1>
          {chart.origin && (
            <p className="text-lg text-gray-700">{chart.origin}</p>
          )}
          {chart.featured && (
            <span className="inline-block mt-2 px-3 py-1 bg-[#9A1A63] text-white text-sm font-semibold rounded">
              Featured
            </span>
          )}
        </div>

        {/* Gradient */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Farbverlauf</h2>
          <GradientBar colors={chart.gradient} height={format === 'A4' ? 120 : 80} />
        </div>

        {/* GIA Data */}
        {chart.gia && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            {chart.gia.hue && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Hue</div>
                <div className="text-base">{chart.gia.hue}</div>
              </div>
            )}
            {chart.gia.tone && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Tone</div>
                <div className="text-base">{chart.gia.tone}</div>
              </div>
            )}
            {chart.gia.sat && (
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-1">Saturation</div>
                <div className="text-base">{chart.gia.sat}</div>
              </div>
            )}
          </div>
        )}

        {/* Pleochroism */}
        {chart.pleochro && chart.pleochro.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Pleochroismus</h2>
            <div className="flex gap-4">
              {chart.pleochro.map((color, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-24 h-24 rounded border-2 border-gray-800"
                    style={{ backgroundColor: color }}
                  />
                  <div className="mt-2 text-xs font-mono">{color}</div>
                  <div className="text-xs text-gray-600">Richtung {index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mb-6 space-y-3">
          <div>
            <div className="text-sm font-semibold text-gray-600 mb-1">Lichtstandard</div>
            <div className="text-base">{chart.light}</div>
          </div>
          {chart.note && (
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">Notiz</div>
              <div className="text-base">{chart.note}</div>
            </div>
          )}
          {chart.description && (
            <div>
              <div className="text-sm font-semibold text-gray-600 mb-1">Beschreibung</div>
              <div className="text-base">{chart.description}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-gray-300 text-xs text-gray-500">
          <p>GemILike Farbtafeln - GIA-konforme Benennung</p>
          <p>Erstellt: {new Date(chart.createdAt).toLocaleDateString('de-DE')}</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: ${format};
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          .print-layout, .print-layout * {
            visibility: visible;
          }
          .print-layout {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

