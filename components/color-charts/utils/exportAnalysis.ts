/**
 * Export utilities for gemstone color analysis
 * 
 * Provides functions to export analysis results in various formats:
 * - JSON: Complete analysis data
 * - CSV: Compact summary for spreadsheet applications
 * - PDF: Professional report with visualizations
 */

export interface AnalysisData {
  width: number;
  height: number;
  totalPixels: number;
  usedPixels: number;
  maskRatio: number;
  k: number;
  clusters: Array<{
    hex: string;
    rgb: [number, number, number];
    hsv: [number, number, number];
    share: number;
  }>;
  hsvStats: {
    hueMean: number;
    satMean: number;
    valMean: number;
    hueMedian: number;
    satMedian: number;
    valMedian: number;
  };
  labStats: {
    Lmean: number;
    aMean: number;
    bMean: number;
    Lmedian: number;
    aMedian: number;
    bMedian: number;
  };
  refDeltaE: {
    hex: string;
    dE76: number;
    dE2000: number;
  };
  hue: {
    mean: number;
    R: number;
    circVar: number;
    sepDeg: number;
    category: {
      primary: { name: string; score: number };
      secondary: { name: string; score: number } | null;
      conf: number;
      borderline: boolean;
    };
  };
  hueHist?: number[];
  abSamples?: [number, number][];
  borderline?: {
    isBorderline: boolean;
    primaryCategory: string;
    secondaryCategory?: string;
    confidence: number;
    peakSeparation: number;
  };
  params?: {
    autoK: boolean;
    slicStep?: number;
    slicM?: number;
    guidedR?: number;
    guidedEps?: number;
    white?: [number, number, number];
  };
}

/**
 * Export analysis data as JSON
 * 
 * @param analysis Analysis data to export
 * @param filename Optional filename (default: "gemstone-analysis.json")
 */
export function exportJSON(analysis: AnalysisData, filename: string = 'gemstone-analysis.json'): void {
  const json = JSON.stringify(analysis, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export analysis data as CSV
 * 
 * Creates a compact CSV summary with key metrics and top 3 clusters.
 * 
 * @param analysis Analysis data to export
 * @param filename Optional filename (default: "gemstone-analysis.csv")
 */
export function exportCSV(analysis: AnalysisData, filename: string = 'gemstone-analysis.csv'): void {
  const c = analysis.clusters;
  const c1 = c[0];
  const c2 = c[1];
  const c3 = c[2];

  const header = [
    'k',
    'hueMean',
    'satMean',
    'valMean',
    'Lmean',
    'aMean',
    'bMean',
    'dE76',
    'dE2000',
    'primary',
    'secondary',
    'conf',
    'borderline',
    'top1',
    'share1',
    'top2',
    'share2',
    'top3',
    'share3',
  ].join(',');

  const line = [
    analysis.k,
    analysis.hsvStats.hueMean.toFixed(2),
    analysis.hsvStats.satMean.toFixed(2),
    analysis.hsvStats.valMean.toFixed(2),
    analysis.labStats.Lmean.toFixed(2),
    analysis.labStats.aMean.toFixed(2),
    analysis.labStats.bMean.toFixed(2),
    analysis.refDeltaE.dE76.toFixed(2),
    analysis.refDeltaE.dE2000.toFixed(2),
    analysis.hue.category.primary?.name ?? '',
    analysis.hue.category.secondary?.name ?? '',
    analysis.hue.category.conf.toFixed(3),
    analysis.hue.category.borderline ? '1' : '0',
    c1?.hex || '',
    ((c1?.share || 0) * 100).toFixed(1) + '%',
    c2?.hex || '',
    ((c2?.share || 0) * 100).toFixed(1) + '%',
    c3?.hex || '',
    ((c3?.share || 0) * 100).toFixed(1) + '%',
  ].join(',');

  const csv = header + '\n' + line + '\n';
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export analysis data as PDF
 * 
 * Creates a professional PDF report with:
 * - Analysis metadata
 * - Cluster colors with percentages
 * - HSV and Lab statistics
 * - Delta E values
 * - Borderline analysis
 * - Preview image (if provided)
 * - Parameters
 * 
 * @param analysis Analysis data to export
 * @param previewImage Optional preview image (HTMLCanvasElement or data URL)
 * @param filename Optional filename (default: "gemstone-analysis.pdf")
 */
export async function exportPDF(
  analysis: AnalysisData,
  previewImage?: HTMLCanvasElement | string | null,
  filename: string = 'gemstone-analysis.pdf'
): Promise<void> {
  // Dynamic import of jsPDF
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Gem Photo Color Analysis – Borderline Pro', 40, 40);

  // Metadata
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(
    `Size ${analysis.width}×${analysis.height}  Used ${analysis.usedPixels}/${analysis.totalPixels}  Mask ${(analysis.maskRatio * 100).toFixed(1)}%`,
    40,
    66
  );

  let y = 92;

  // K value
  doc.text(
    `K = ${analysis.k} (auto=${analysis.params?.autoK ? 'on' : 'off'})`,
    40,
    y
  );
  y += 20;

  // Clusters
  analysis.clusters.forEach((c, i) => {
    // Color swatch
    doc.setFillColor(c.rgb[0], c.rgb[1], c.rgb[2]);
    doc.rect(40, y - 12, 18, 18, 'F');

    // Cluster info
    doc.text(
      `${i + 1}. ${c.hex}  H:${c.hsv[0].toFixed(1)} S:${c.hsv[1].toFixed(1)} V:${c.hsv[2].toFixed(1)}  ${(c.share * 100).toFixed(1)}%`,
      68,
      y
    );
    y += 24;
  });

  y += 6;

  // HSV statistics
  doc.text(
    `HSV ⌀  H ${analysis.hsvStats.hueMean.toFixed(1)}°  S ${analysis.hsvStats.satMean.toFixed(1)}%  V ${analysis.hsvStats.valMean.toFixed(1)}%`,
    40,
    y
  );
  y += 18;

  // Lab statistics
  doc.text(
    `Lab ⌀  L* ${analysis.labStats.Lmean.toFixed(1)}  a* ${analysis.labStats.aMean.toFixed(1)}  b* ${analysis.labStats.bMean.toFixed(1)}`,
    40,
    y
  );
  y += 18;

  // Delta E
  doc.text(
    `ΔE76 ${analysis.refDeltaE.dE76.toFixed(2)}  ΔE2000 ${analysis.refDeltaE.dE2000.toFixed(2)} vs ${analysis.refDeltaE.hex}`,
    40,
    y
  );
  y += 28;

  // Preview image (if provided)
  if (previewImage) {
    try {
      let dataUrl: string;
      if (previewImage instanceof HTMLCanvasElement) {
        dataUrl = previewImage.toDataURL('image/jpeg', 0.9);
      } else if (typeof previewImage === 'string') {
        dataUrl = previewImage;
      } else {
        throw new Error('Invalid preview image format');
      }

      const imgWidth = 250;
      const imgHeight = previewImage instanceof HTMLCanvasElement
        ? 250 * (previewImage.height / previewImage.width)
        : 250;

      doc.addImage(dataUrl, 'JPEG', 320, 40, imgWidth, imgHeight);
    } catch (error) {
      console.warn('Failed to add preview image to PDF:', error);
    }
  }

  // Borderline analysis
  doc.text(
    `Borderline: ${analysis.hue.category.borderline ? 'Ja' : 'Nein'}  | Hue ⌀ ${analysis.hue.mean.toFixed(1)}°  R ${analysis.hue.R.toFixed(2)}  Peak Δ ${analysis.hue.sepDeg.toFixed(1)}°  KonfΔ ${analysis.hue.category.conf.toFixed(2)}`,
    40,
    y
  );
  y += 18;

  // Category
  doc.text(
    `Kategorie: ${analysis.hue.category.primary.name}${analysis.hue.category.secondary ? ' / ' + analysis.hue.category.secondary.name : ''}`,
    40,
    y
  );
  y += 22;

  // Parameters
  if (analysis.params) {
    const params = analysis.params;
    doc.text(
      `Params: AutoK ${params.autoK}, SLIC step ${params.slicStep ?? 'N/A'}, m ${params.slicM ?? 'N/A'}, Guided r ${params.guidedR ?? 'N/A'}, eps ${params.guidedEps?.toExponential(1) ?? 'N/A'}`,
      40,
      y
    );
    y += 18;

    if (params.white) {
      doc.text(
        `White: Xr ${params.white[0].toFixed(5)} Yr ${params.white[1].toFixed(5)} Zr ${params.white[2].toFixed(5)}`,
        40,
        y
      );
    }
  }

  // Save PDF
  doc.save(filename);
}

/**
 * Export all formats at once (for convenience)
 * 
 * @param analysis Analysis data to export
 * @param previewImage Optional preview image
 * @param baseFilename Base filename (without extension)
 */
export async function exportAll(
  analysis: AnalysisData,
  previewImage?: HTMLCanvasElement | string | null,
  baseFilename: string = 'gemstone-analysis'
): Promise<void> {
  exportJSON(analysis, `${baseFilename}.json`);
  exportCSV(analysis, `${baseFilename}.csv`);
  await exportPDF(analysis, previewImage, `${baseFilename}.pdf`);
}

