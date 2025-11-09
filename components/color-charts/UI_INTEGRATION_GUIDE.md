# UI-Integration Guide: Borderline v4 Features

## Übersicht

Dieses Dokument beschreibt die notwendigen UI-Änderungen zur Integration der Borderline v4 Features in die bestehende `GemstoneColorAnalyzer` Komponente.

## 1. Neue State-Variablen hinzufügen

Füge folgende State-Variablen zur Komponente hinzu (nach Zeile 66):

```typescript
// Borderline v4: Neue Parameter
const [autoK, setAutoK] = useState(true); // Auto-K via GMM+BIC
const [slicStep, setSlicStep] = useState(16); // SLIC Superpixel-Größe
const [slicM, setSlicM] = useState(10); // SLIC Kompaktheit
const [guidedR, setGuidedR] = useState(4); // Guided Filter Radius
const [guidedEps, setGuidedEps] = useState(1e-3); // Guided Filter Regularisierung
const [iccInfo, setIccInfo] = useState<{ wtpt?: [number,number,number], rXYZ?, gXYZ?, bXYZ? } | null>(null);
const [iccWP, setIccWP] = useState<[number,number,number] | undefined>();
```

## 2. ICC-Upload Handler hinzufügen

Füge nach `handleLoadOpenCV` (ca. Zeile 111) hinzu:

```typescript
// ICC Profile Upload Handler
const handleICCUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  try {
    const { parseICCFromFile } = await import('./utils/iccParser');
    const profile = await parseICCFromFile(file);
    setIccInfo(profile);
    
    if (profile.wtpt) {
      setIccWP([profile.wtpt[0], profile.wtpt[1], profile.wtpt[2]]);
      console.log('ICC Weißpunkt geladen:', profile.wtpt);
    }
  } catch (error) {
    console.error('Fehler beim Parsen des ICC-Profils:', error);
    alert('Fehler beim Laden des ICC-Profils. Bitte überprüfen Sie die Datei.');
  }
}, []);
```

## 3. Export-Handler hinzufügen

Füge nach `handleSaveAnalysis` (ca. Zeile 800) hinzu:

```typescript
// Export Handlers
const handleExportJSON = useCallback(() => {
  if (!overallImpression) return;
  
  // Konvertiere zu AnalysisData Format
  const analysisData = {
    width: imagePreview ? 512 : 0, // TODO: Aus Analyse extrahieren
    height: imagePreview ? 512 : 0,
    totalPixels: 0,
    usedPixels: 0,
    maskRatio: 0,
    k: kValue || 5,
    clusters: primaryColor ? [{
      hex: primaryColor.hex,
      rgb: [primaryColor.rgb.r, primaryColor.rgb.g, primaryColor.rgb.b] as [number, number, number],
      hsv: [0, 0, 0] as [number, number, number], // TODO: Aus Analyse extrahieren
      share: 1.0,
    }] : [],
    hsvStats: {
      hueMean: 0,
      satMean: 0,
      valMean: 0,
      hueMedian: 0,
      satMedian: 0,
      valMedian: 0,
    },
    labStats: primaryColorLab ? {
      Lmean: primaryColorLab.L,
      aMean: primaryColorLab.a,
      bMean: primaryColorLab.b,
      Lmedian: primaryColorLab.L,
      aMedian: primaryColorLab.a,
      bMedian: primaryColorLab.b,
    } : {
      Lmean: 0,
      aMean: 0,
      bMean: 0,
      Lmedian: 0,
      aMedian: 0,
      bMedian: 0,
    },
    refDeltaE: {
      hex: '#000000',
      dE76: 0,
      dE2000: 0,
    },
    hue: {
      mean: 0,
      R: 0,
      circVar: 0,
      sepDeg: 0,
      category: {
        primary: { name: 'Unbekannt', score: 0 },
        secondary: null,
        conf: 0,
        borderline: false,
      },
    },
    params: {
      autoK,
      slicStep,
      slicM,
      guidedR,
      guidedEps,
      white: iccWP || (whitepoint === 'D50' ? [0.96422, 1.0, 0.82521] : [0.95047, 1.0, 1.08883]),
    },
  };
  
  const { exportJSON } = await import('./utils/exportAnalysis');
  exportJSON(analysisData);
}, [overallImpression, primaryColor, primaryColorLab, kValue, autoK, slicStep, slicM, guidedR, guidedEps, iccWP, whitepoint]);

const handleExportCSV = useCallback(async () => {
  // Ähnlich wie handleExportJSON, aber mit exportCSV
  // TODO: Implementieren
}, []);

const handleExportPDF = useCallback(async () => {
  // Ähnlich wie handleExportJSON, aber mit exportPDF und canvasRef
  // TODO: Implementieren
}, []);
```

## 4. Erweiterte Einstellungen UI erweitern

Erweitere den `showAdvancedSettings` Block (ab Zeile 952) mit:

```typescript
{showAdvancedSettings && (
  <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-4">
    {/* Bestehende Einstellungen... */}
    
    {/* Borderline v4: Neue Einstellungen */}
    <div className="border-t border-gray-700 pt-4 mt-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-3">Borderline v4 - Erweiterte Parameter</h4>
      
      {/* Auto-K */}
      <div className="space-y-2 mb-4">
        <label className="text-sm text-gray-300 flex items-center justify-between">
          <span>Auto-K (GMM+BIC):</span>
          <input
            type="checkbox"
            checked={autoK}
            onChange={(e) => setAutoK(e.target.checked)}
            className="ml-4"
            disabled={isAnalyzing}
          />
        </label>
        <p className="text-xs text-gray-500">
          Automatische Clusterzahl-Bestimmung via Gaussian Mixture Model und Bayesian Information Criterion.
        </p>
      </div>
      
      {/* SLIC Parameter */}
      <div className="space-y-2 mb-4">
        <label className="text-sm text-gray-300 flex items-center justify-between">
          <span>SLIC Step: {slicStep}</span>
        </label>
        <input
          type="range"
          min={8}
          max={40}
          value={slicStep}
          onChange={(e) => setSlicStep(parseInt(e.target.value))}
          className="w-full"
          disabled={isAnalyzing}
        />
        <p className="text-xs text-gray-500">
          Superpixel-Größe (8-40). Größer = größere Superpixels.
        </p>
        
        <label className="text-sm text-gray-300 flex items-center justify-between mt-3">
          <span>SLIC m: {slicM}</span>
        </label>
        <input
          type="range"
          min={5}
          max={30}
          value={slicM}
          onChange={(e) => setSlicM(parseInt(e.target.value))}
          className="w-full"
          disabled={isAnalyzing}
        />
        <p className="text-xs text-gray-500">
          Kompaktheit (5-30). Höher = kompakter, folgt Kanten besser.
        </p>
      </div>
      
      {/* Guided Filter Parameter */}
      <div className="space-y-2 mb-4">
        <label className="text-sm text-gray-300 flex items-center justify-between">
          <span>Guided Filter r: {guidedR}</span>
        </label>
        <input
          type="range"
          min={2}
          max={16}
          value={guidedR}
          onChange={(e) => setGuidedR(parseInt(e.target.value))}
          className="w-full"
          disabled={isAnalyzing}
        />
        <p className="text-xs text-gray-500">
          Filter-Radius (2-16). Größer = glatter, langsamer.
        </p>
        
        <label className="text-sm text-gray-300 flex items-center justify-between mt-3">
          <span>Guided Filter eps: {guidedEps.toExponential(1)}</span>
        </label>
        <input
          type="range"
          min={-6}
          max={-2}
          value={Math.log10(guidedEps)}
          onChange={(e) => setGuidedEps(10 ** parseInt(e.target.value))}
          className="w-full"
          disabled={isAnalyzing}
        />
        <p className="text-xs text-gray-500">
          Regularisierung (10^-6 bis 10^-2). Höher = mehr Glättung.
        </p>
      </div>
      
      {/* ICC Profile Upload */}
      <div className="space-y-2 mb-4">
        <label className="text-sm text-gray-300">
          ICC-Profil (optional):
        </label>
        <input
          type="file"
          accept=".icc,.icm"
          onChange={handleICCUpload}
          className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#9A1A63] file:text-white hover:file:bg-[#7A1550]"
          disabled={isAnalyzing}
        />
        {iccInfo && (
          <div className="mt-2 text-xs text-gray-500">
            {iccInfo.wtpt ? (
              <div>
                <strong>Weißpunkt:</strong> X={iccInfo.wtpt[0].toFixed(5)}, Y={iccInfo.wtpt[1].toFixed(5)}, Z={iccInfo.wtpt[2].toFixed(5)}
              </div>
            ) : (
              <div>Kein Weißpunkt im ICC-Profil gefunden.</div>
            )}
          </div>
        )}
        <p className="text-xs text-gray-500">
          Lädt Weißpunkt aus ICC-Profil für präzisere Farbkorrektur.
        </p>
      </div>
    </div>
  </div>
)}
```

## 5. Export-Buttons hinzufügen

Füge nach den Analyse-Buttons (ca. Zeile 900) hinzu:

```typescript
{analysisComplete && (
  <div className="flex flex-wrap gap-2 mt-4">
    <Button
      variant="outline"
      size="sm"
      onClick={handleExportJSON}
      disabled={!overallImpression}
      className="text-gray-300 border-gray-600 hover:bg-gray-800"
    >
      <Download className="h-4 w-4 mr-2" />
      JSON
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={handleExportCSV}
      disabled={!overallImpression}
      className="text-gray-300 border-gray-600 hover:bg-gray-800"
    >
      <Download className="h-4 w-4 mr-2" />
      CSV
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={handleExportPDF}
      disabled={!overallImpression}
      className="text-gray-300 border-gray-600 hover:bg-gray-800"
    >
      <FileText className="h-4 w-4 mr-2" />
      PDF
    </Button>
  </div>
)}
```

## 6. Borderline-Visualisierung in OverallImpressionSection

Die Borderline-Visualisierung wird in Phase 7 in die Analyse-Pipeline integriert. Für die UI-Integration in `OverallImpressionSection.tsx`:

```typescript
// In OverallImpressionSection.tsx, nach der Pleochroismus-Anzeige:

{overallImpression.borderline && (
  <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
        ⚠️ Borderline-Farbe erkannt
      </span>
    </div>
    <div className="text-sm text-amber-700 dark:text-amber-300">
      <p>
        Primär: <strong>{overallImpression.primaryCategory}</strong>
        {overallImpression.secondaryCategory && (
          <> / Sekundär: <strong>{overallImpression.secondaryCategory}</strong></>
        )}
      </p>
      <p className="mt-1">
        Konfidenz: {overallImpression.confidence?.toFixed(2) || 'N/A'}
      </p>
    </div>
  </div>
)}
```

## 7. Imports hinzufügen

Füge am Anfang der Datei hinzu:

```typescript
import { exportJSON, exportCSV, exportPDF, AnalysisData } from './utils/exportAnalysis';
import { parseICCFromFile, isICCProfile } from './utils/iccParser';
import { softCategory, circularStatsDeg, hueBorderlineFromHist } from './utils/circularStats';
```

## 8. Integration in Analyse-Pipeline

Die eigentliche Integration der neuen Algorithmen (K-Means++, GMM+BIC, SLIC, Guided Filter) erfolgt in Phase 7, wenn die Analyse-Pipeline erweitert wird.

## Nächste Schritte

1. **State-Variablen hinzufügen** (Schritt 1)
2. **ICC-Upload Handler** (Schritt 2)
3. **Export-Handler** (Schritt 3)
4. **UI-Elemente** (Schritte 4-5)
5. **Borderline-Visualisierung** (Schritt 6)
6. **Imports** (Schritt 7)

Nach der UI-Integration folgt Phase 7: Analyse-Pipeline erweitern, wo die neuen Algorithmen tatsächlich in die Analyse integriert werden.

