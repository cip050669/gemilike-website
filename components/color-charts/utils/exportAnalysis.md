# Export Utilities for Gemstone Color Analysis

## Übersicht

Diese Datei enthält Export-Funktionen für Edelstein-Farbanalyse-Ergebnisse in verschiedenen Formaten:
- **JSON**: Vollständige Analyse-Daten
- **CSV**: Kompakte Zusammenfassung für Tabellenkalkulation
- **PDF**: Professioneller Report mit Visualisierungen

## Hauptfunktionen

### `exportJSON(analysis, filename)`

Exportiert Analyse-Daten als JSON.

**Parameter:**
- `analysis: AnalysisData` - Analyse-Daten
- `filename: string` - Dateiname (default: "gemstone-analysis.json")

**Rückgabe:** Keine (triggert Download)

**Inhalt:**
- Vollständige Analyse-Daten
- Alle Statistiken
- Parameter
- Histogramme und Samples

### `exportCSV(analysis, filename)`

Exportiert Analyse-Daten als CSV.

**Parameter:**
- `analysis: AnalysisData` - Analyse-Daten
- `filename: string` - Dateiname (default: "gemstone-analysis.csv")

**Rückgabe:** Keine (triggert Download)

**Inhalt:**
- Eine Zeile mit kompakten Metriken:
  - k, hueMean, satMean, valMean
  - Lmean, aMean, bMean
  - dE76, dE2000
  - primary, secondary, conf, borderline
  - top1, share1, top2, share2, top3, share3

**Format:** Kompatibel mit Excel, LibreOffice, Google Sheets

### `exportPDF(analysis, previewImage, filename)`

Exportiert Analyse-Daten als PDF.

**Parameter:**
- `analysis: AnalysisData` - Analyse-Daten
- `previewImage?: HTMLCanvasElement | string | null` - Vorschau-Bild (optional)
- `filename: string` - Dateiname (default: "gemstone-analysis.pdf")

**Rückgabe:** Promise (triggert Download nach Generierung)

**Inhalt:**
- Titel und Metadaten
- Cluster-Farben mit Anteilen
- HSV- und Lab-Statistiken
- Delta E-Werte
- Borderline-Analyse
- Vorschau-Bild (falls vorhanden)
- Parameter-Block

**Abhängigkeit:** `jspdf` (dynamischer Import)

### `exportAll(analysis, previewImage, baseFilename)`

Exportiert alle Formate auf einmal.

**Parameter:**
- `analysis: AnalysisData` - Analyse-Daten
- `previewImage?: HTMLCanvasElement | string | null` - Vorschau-Bild (optional)
- `baseFilename: string` - Basis-Dateiname (ohne Extension)

**Rückgabe:** Promise

**Erstellt:**
- `${baseFilename}.json`
- `${baseFilename}.csv`
- `${baseFilename}.pdf`

## AnalysisData Interface

```typescript
{
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
  hsvStats: { ... };
  labStats: { ... };
  refDeltaE: { ... };
  hue: { ... };
  hueHist?: number[];
  abSamples?: [number, number][];
  params?: { ... };
}
```

## Verwendung

```typescript
import {
  exportJSON,
  exportCSV,
  exportPDF,
  exportAll
} from './exportAnalysis';

// JSON Export
exportJSON(analysis, 'my-analysis.json');

// CSV Export
exportCSV(analysis, 'my-analysis.csv');

// PDF Export (mit Vorschau-Bild)
const canvas = document.getElementById('preview') as HTMLCanvasElement;
await exportPDF(analysis, canvas, 'my-analysis.pdf');

// Alle Formate
await exportAll(analysis, canvas, 'my-analysis');
```

## Integration in Komponente

```typescript
import { exportJSON, exportCSV, exportPDF } from '@/components/color-charts/utils/exportAnalysis';

// In Komponente
const handleExportJSON = () => {
  if (!analysis) return;
  exportJSON(analysis);
};

const handleExportCSV = () => {
  if (!analysis) return;
  exportCSV(analysis);
};

const handleExportPDF = async () => {
  if (!analysis) return;
  await exportPDF(analysis, canvasRef.current);
};

// UI
<Button onClick={handleExportJSON}>JSON</Button>
<Button onClick={handleExportCSV}>CSV</Button>
<Button onClick={handleExportPDF}>PDF</Button>
```

## PDF-Format Details

### Layout
- **Format**: A4 (210 × 297 mm)
- **Einheit**: Points (pt)
- **Schriftart**: Helvetica

### Inhalt (von oben nach unten)
1. Titel: "Gem Photo Color Analysis – Borderline Pro"
2. Metadaten: Größe, verwendete Pixel, Mask-Verhältnis
3. K-Wert: Cluster-Anzahl (auto/manuell)
4. Cluster: Farben mit Swatches, HSV, Anteilen
5. HSV-Statistiken: Mittelwerte
6. Lab-Statistiken: Mittelwerte
7. Delta E: dE76, dE2000 vs. Referenz
8. Vorschau-Bild: Rechts oben (falls vorhanden)
9. Borderline-Analyse: Status, Hue-Mittelwert, R, Peak-Separation, Konfidenz
10. Kategorie: Primär- und Sekundärkategorie
11. Parameter: Alle verwendeten Parameter
12. Whitepoint: XYZ-Werte

## CSV-Format Details

### Spalten
1. `k` - Cluster-Anzahl
2. `hueMean, satMean, valMean` - HSV-Mittelwerte
3. `Lmean, aMean, bMean` - Lab-Mittelwerte
4. `dE76, dE2000` - Delta E-Werte
5. `primary, secondary` - Farbkategorien
6. `conf` - Konfidenz
7. `borderline` - Borderline-Status (1/0)
8. `top1, share1, top2, share2, top3, share3` - Top-3-Cluster

### Verwendung
- **Excel/LibreOffice**: Öffnen als CSV
- **Google Sheets**: Importieren als CSV
- **Python/R**: Einfaches Parsing für weitere Analyse

## Performance

- **JSON**: < 10ms (synchron)
- **CSV**: < 10ms (synchron)
- **PDF**: ~100-500ms (asynchron, abhängig von Bildgröße)

## Abhängigkeiten

- **jspdf**: Für PDF-Generierung (dynamischer Import)
- **Keine weiteren Abhängigkeiten**: JSON und CSV sind native Browser-APIs

## Nächste Schritte

Diese Export-Funktionen werden in Phase 6 in die UI integriert, um Benutzern die Möglichkeit zu geben, Analyse-Ergebnisse zu exportieren.

