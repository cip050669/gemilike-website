import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { PrimaryColorSection } from '@/components/color-charts/analysis/PrimaryColorSection';
import { SecondaryColorSection } from '@/components/color-charts/analysis/SecondaryColorSection';
import { LuminanceSaturationSection } from '@/components/color-charts/analysis/LuminanceSaturationSection';
import { SpectralCharacteristicSection } from '@/components/color-charts/analysis/SpectralCharacteristicSection';
import { GIAColorGradeSection } from '@/components/color-charts/analysis/GIAColorGradeSection';
import { OverallImpressionSection } from '@/components/color-charts/analysis/OverallImpressionSection';
import { PaletteComparisonSection } from '@/components/color-charts/analysis/PaletteComparisonSection';
import {
  PrimaryColorAnalysis,
  SecondaryColorAnalysis,
  LuminanceSaturationAnalysis,
  SpectralCharacteristic,
  GIAColorGrade,
  OverallImpression,
} from '@/components/color-charts/utils/gemstoneAnalysis';
import { PaletteComparison } from '@/components/color-charts/utils/paletteComparison';
import { MaskingOptions } from '@/components/color-charts/utils/imageColorExtraction';

export default async function GemstoneAnalysisDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const analysis = await prisma.gemstoneAnalysis.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-800/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Analyse nicht gefunden</h1>
            <Link href={`/${locale}/admin/gemstone-analyses`}>
              <Button>Zurück zur Übersicht</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Parse JSON data
  const primaryColor = analysis.primaryColor as unknown as PrimaryColorAnalysis;
  const secondaryColors = analysis.secondaryColors as unknown as SecondaryColorAnalysis[];
  const luminanceSaturation = analysis.luminanceSaturation as unknown as LuminanceSaturationAnalysis;
  const spectralCharacteristic = analysis.spectralCharacteristic as unknown as SpectralCharacteristic;
  const giaColorGrade = analysis.giaColorGrade as unknown as GIAColorGrade;
  const overallImpression = analysis.overallImpression as unknown as OverallImpression;
  const paletteComparisons = analysis.paletteComparisons as unknown as PaletteComparison[] | null;
  const maskingOptions = analysis.maskingOptions as unknown as MaskingOptions | null;
  const customPalette = analysis.customPalette as unknown as string[] | null;

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Farbanalyse Details</h1>
            <p className="text-gray-400">
              Erstellt am: {new Date(analysis.createdAt).toLocaleDateString('de-DE')}
              {analysis.createdBy && ` von ${analysis.createdBy.name || analysis.createdBy.email}`}
            </p>
          </div>
          <Link href={`/${locale}/admin/gemstone-analyses`}>
            <Button variant="outline">Zurück zur Übersicht</Button>
          </Link>
        </div>

        {/* Image Preview */}
        {analysis.imageUrl && (
          <div className="mb-8">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Analysiertes Bild</h2>
              <div className="relative w-full max-w-2xl mx-auto aspect-video">
                <Image
                  src={analysis.imageUrl}
                  alt={analysis.imageName || 'Gemstone'}
                  fill
                  className="object-contain rounded-lg shadow-lg"
                />
              </div>
              {analysis.imageName && (
                <p className="text-sm text-gray-400 mt-2 text-center">{analysis.imageName}</p>
              )}
            </div>
          </div>
        )}

        {/* Analysis Sections */}
        <div className="space-y-6 bg-white p-8 rounded-lg">
          <PrimaryColorSection analysis={primaryColor} />
          <SecondaryColorSection
            analysis={secondaryColors}
            pleochroism={analysis.pleochroism || ''}
          />
          <LuminanceSaturationSection analysis={luminanceSaturation} />
          <SpectralCharacteristicSection analysis={spectralCharacteristic} />
          <GIAColorGradeSection analysis={giaColorGrade} />
          <OverallImpressionSection analysis={overallImpression} />

          {/* Palette Comparisons */}
          {paletteComparisons && paletteComparisons.length > 0 && (
            <PaletteComparisonSection comparisons={paletteComparisons} />
          )}

          {/* Advanced Analysis Parameters */}
          {(analysis.whitepoint || analysis.kValue !== null || maskingOptions || customPalette) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm font-semibold text-gray-700 mb-3">Erweiterte Analyse-Parameter</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {analysis.whitepoint && (
                  <div>
                    <span className="font-medium text-gray-600">Whitepoint:</span>{' '}
                    <span className="text-gray-800">{analysis.whitepoint}</span>
                  </div>
                )}
                {analysis.kValue !== null && (
                  <div>
                    <span className="font-medium text-gray-600">K-Means Cluster:</span>{' '}
                    <span className="text-gray-800">{analysis.kValue}</span>
                  </div>
                )}
                {maskingOptions && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-600">Maskierungs-Optionen:</span>
                    <div className="mt-1 text-xs text-gray-600 space-y-1">
                      <div>Weiß: {maskingOptions.white ? '✓' : '✗'} (Schwelle: {maskingOptions.wThr})</div>
                      <div>Schwarz: {maskingOptions.black ? '✓' : '✗'} (Schwelle: {maskingOptions.bThr})</div>
                      <div>Niedrige Sättigung: {maskingOptions.lowSat ? '✓' : '✗'} (Schwelle: {maskingOptions.sThr})</div>
                      <div>Smart Mask: {maskingOptions.smart ? '✓' : '✗'}</div>
                    </div>
                  </div>
                )}
                {customPalette && customPalette.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-600">Benutzerdefinierte Palette:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {customPalette.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {analysis.notes && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-700 mb-2">Notizen</div>
              <div className="text-base text-gray-700">{analysis.notes}</div>
            </div>
          )}

          {/* Tags */}
          {analysis.tags && analysis.tags.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-semibold text-gray-700 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {analysis.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

