/**
 * PDF Export utilities for gemstone color analysis reports
 */

import { jsPDF } from 'jspdf';
import type {
  PrimaryColorAnalysis,
  SecondaryColorAnalysis,
  LuminanceSaturationAnalysis,
  SpectralCharacteristic,
  GIAColorGrade,
  OverallImpression,
} from './gemstoneAnalysis';
import type { PaletteComparison } from './paletteComparison';
import type { Whitepoint } from './colorConversions';

interface PDFExportData {
  imageUrl?: string | null;
  imageName?: string | null;
  timestamp: Date;
  whitepoint: Whitepoint;
  primaryColor: PrimaryColorAnalysis | null;
  secondaryColors: SecondaryColorAnalysis[];
  luminanceSaturation: LuminanceSaturationAnalysis | null;
  spectralCharacteristic: SpectralCharacteristic | null;
  giaColorGrade: GIAColorGrade | null;
  overallImpression: OverallImpression | null;
  paletteComparisons: PaletteComparison[];
}

/**
 * Convert hex color to RGB array for jsPDF
 */
function hexToRgbArray(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
}

/**
 * Draw a color swatch in the PDF
 */
function drawColorSwatch(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  hex: string
) {
  const [r, g, b] = hexToRgbArray(hex);
  doc.setFillColor(r, g, b);
  doc.rect(x, y, width, height, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(x, y, width, height, 'S');
}

/**
 * Export analysis report to PDF
 */
export async function exportAnalysisToPDF(data: PDFExportData): Promise<void> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // Helper to add new page if needed
  const checkNewPage = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Edelstein-Farbanalyse Bericht', margin, y);
  y += 25;

  // Date and metadata
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Erstellt am: ${data.timestamp.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}`,
    margin,
    y
  );
  y += 15;
  doc.text(`Referenz-Weißpunkt: ${data.whitepoint}`, margin, y);
  y += 20;

  // 1. Primary Color Analysis
  if (data.primaryColor) {
    checkNewPage(80);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Primärfarbe (Hauptfarbton)', margin, y);
    y += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Color swatch
    drawColorSwatch(doc, margin, y - 10, 30, 30, data.primaryColor.hex);
    
    doc.text(`Hex: ${data.primaryColor.hex}`, margin + 35, y);
    y += 12;
    doc.text(
      `RGB: ${data.primaryColor.rgb.r}, ${data.primaryColor.rgb.g}, ${data.primaryColor.rgb.b}`,
      margin + 35,
      y
    );
    y += 12;
    doc.text(`Ton: ${data.primaryColor.tone}`, margin + 35, y);
    y += 12;
    doc.text(`CIE-Hue: ${data.primaryColor.cieHue}`, margin + 35, y);
    y += 12;
    doc.text(`Beschreibung: ${data.primaryColor.description}`, margin + 35, y);
    y += 20;

    if (data.primaryColor.originSuggestion.length > 0) {
      doc.text(
        `Herkunftsvermutung: ${data.primaryColor.originSuggestion.join(', ')}`,
        margin,
        y
      );
      y += 15;
    }
    y += 10;
  }

  // 1.5. Palette Comparison
  if (data.paletteComparisons && data.paletteComparisons.length > 0) {
    checkNewPage(100);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('1.5. Palette-Vergleich (ΔE)', margin, y);
    y += 20;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Show top 3 best matches
    const topComparisons = data.paletteComparisons.slice(0, 3);
    
    for (const comparison of topComparisons) {
      checkNewPage(60);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(comparison.preset.name, margin, y);
      y += 15;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      // Table header
      const colWidths = [30, 80, 50, 50];
      let x = margin;
      doc.setFont('helvetica', 'bold');
      doc.text('Farbe', x, y);
      x += colWidths[0];
      doc.text('HEX', x, y);
      x += colWidths[1];
      doc.text('ΔE76', x, y);
      x += colWidths[2];
      doc.text('ΔE2000', x, y);
      y += 12;

      // Table rows (top 2 matches per palette)
      doc.setFont('helvetica', 'normal');
      for (let i = 0; i < Math.min(2, comparison.results.length); i++) {
        const result = comparison.results[i];
        x = margin;
        
        // Color swatch
        drawColorSwatch(doc, x, y - 8, 8, 8, result.hex);
        x += colWidths[0];
        
        doc.text(result.hex, x, y);
        x += colWidths[1];
        doc.text(result.dE76.toFixed(2), x, y);
        x += colWidths[2];
        doc.text(result.dE2000.toFixed(2), x, y);
        y += 15;
      }
      y += 10;
    }
    y += 10;
  }

  // 2. Secondary Colors
  if (data.secondaryColors && data.secondaryColors.length > 0) {
    checkNewPage(80);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Sekundärfarben (Nebenfarbtöne)', margin, y);
    y += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    for (const secondary of data.secondaryColors.slice(0, 4)) {
      checkNewPage(50);
      drawColorSwatch(doc, margin, y - 10, 20, 20, secondary.hex);
      doc.text(
        `${secondary.region}: ${secondary.hex} (${secondary.tone}, ${secondary.percentage.toFixed(1)}%)`,
        margin + 25,
        y
      );
      y += 25;
    }
    y += 10;
  }

  // 3. Luminance and Saturation
  if (data.luminanceSaturation) {
    checkNewPage(100);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Helligkeit und Sättigung', margin, y);
    y += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(
      `Helligkeit: ${data.luminanceSaturation.luminance.value.toFixed(1)} - ${data.luminanceSaturation.luminance.assessment}`,
      margin,
      y
    );
    y += 15;
    doc.text(
      `  ${data.luminanceSaturation.luminance.remark}`,
      margin + 10,
      y
    );
    y += 20;

    doc.text(
      `Sättigung: ${data.luminanceSaturation.saturation.value.toFixed(1)} - ${data.luminanceSaturation.saturation.assessment}`,
      margin,
      y
    );
    y += 15;
    doc.text(
      `  ${data.luminanceSaturation.saturation.remark}`,
      margin + 10,
      y
    );
    y += 20;

    doc.text(
      `Farbreinheit: ${data.luminanceSaturation.colorPurity.value.toFixed(1)}% - ${data.luminanceSaturation.colorPurity.assessment}`,
      margin,
      y
    );
    y += 15;
    doc.text(
      `  ${data.luminanceSaturation.colorPurity.remark}`,
      margin + 10,
      y
    );
    y += 20;
  }

  // 4. Spectral Characteristic
  if (data.spectralCharacteristic) {
    checkNewPage(120);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Spektrale Charakteristik', margin, y);
    y += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(
      `Hauptabsorption: ${data.spectralCharacteristic.mainAbsorption}`,
      margin,
      y
    );
    y += 15;
    doc.text(
      `Sekundärabsorption: ${data.spectralCharacteristic.secondaryAbsorption}`,
      margin,
      y
    );
    y += 15;
    doc.text(
      `Transmission: ${data.spectralCharacteristic.transmission}`,
      margin,
      y
    );
    y += 15;
    doc.text(
      `Schwache Transmission: ${data.spectralCharacteristic.weakTransmission}`,
      margin,
      y
    );
    y += 20;
    doc.text(
      `Interpretation: ${data.spectralCharacteristic.interpretation}`,
      margin,
      y
    );
    y += 25;
  }

  // 5. GIA Color Grade
  if (data.giaColorGrade) {
    checkNewPage(100);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('5. GIA-Farbbewertung', margin, y);
    y += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(`Farbton: ${data.giaColorGrade.hue}`, margin, y);
    y += 15;
    doc.text(`Ton: ${data.giaColorGrade.tone}`, margin, y);
    y += 15;
    doc.text(`Sättigung: ${data.giaColorGrade.saturation}`, margin, y);
    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.text(`Finale Farbbewertung: ${data.giaColorGrade.finalColorGrade}`, margin, y);
    y += 20;
    doc.setFont('helvetica', 'normal');
    doc.text(data.giaColorGrade.evaluation, margin, y, {
      maxWidth: contentWidth,
    });
    y += 30;
  }

  // 6. Overall Impression
  if (data.overallImpression) {
    checkNewPage(150);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('6. Gesamteindruck', margin, y);
    y += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    doc.text(
      `Dominanter Farbton: ${data.overallImpression.dominantColorTone}`,
      margin,
      y
    );
    y += 15;
    doc.text(`Sättigung: ${data.overallImpression.saturation}`, margin, y);
    y += 15;
    doc.text(
      `Pleochroismus: ${data.overallImpression.correctedPleochroism || data.overallImpression.pleochroism}`,
      margin,
      y
    );
    y += 15;

    if (data.overallImpression.possibleVariety.length > 0) {
      const variety = data.overallImpression.correctedVariety && data.overallImpression.correctedVariety.length > 0
        ? data.overallImpression.correctedVariety
        : data.overallImpression.possibleVariety;
      doc.text(`Mögliche Varietät: ${variety.join(', ')}`, margin, y);
      y += 15;
    }

    if (data.overallImpression.possibleColorCause.length > 0) {
      doc.text(
        `Mögliche Farbursache: ${data.overallImpression.possibleColorCause.join(', ')}`,
        margin,
        y
      );
      y += 15;
    }

    doc.text(
      `Optische Qualität: ${data.overallImpression.opticalQuality}`,
      margin,
      y
    );
    y += 20;

    doc.setFont('helvetica', 'bold');
    doc.text('Gesamteindruck:', margin, y);
    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.text(data.overallImpression.overallImpression, margin, y, {
      maxWidth: contentWidth,
    });
    y += 25;

    doc.setFont('helvetica', 'bold');
    doc.text('Bewertung:', margin, y);
    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.text(data.overallImpression.evaluation, margin, y, {
      maxWidth: contentWidth,
    });
    y += 20;
  }

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Seite ${i} von ${pageCount}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );
    if (data.imageName) {
      doc.text(
        `Bild: ${data.imageName}`,
        margin,
        pageHeight - 20
      );
    }
  }

  // Save PDF
  doc.save(`gemstone-color-analysis-${Date.now()}.pdf`);
}

