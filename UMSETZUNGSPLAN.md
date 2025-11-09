# Umsetzungsplan: Integration Gem Photo Color Analyzer Borderline v4

## Übersicht

Integration der verbesserten Farbanalyse-Funktionalität aus `gem-photo-color-analyzer-borderline-v4.zip` in die bestehende Gemilike-Website.

**Ziel**: Deutliche Verbesserung der Edelstein-Farbanalyse auf `/de/downloads/` ohne Breaking Changes.

---

## Phase 1: Vorbereitung & Dependencies

### 1.1 Dependencies installieren

```bash
npm install jspdf@^2.5.1 jszip@^3.10.1
# sharp ist bereits vorhanden
```

### 1.2 Projektstruktur prüfen

- ✅ `components/color-charts/` existiert bereits
- ✅ `components/color-charts/utils/` für Utility-Funktionen
- ✅ `app/api/` für API-Routen

**Dateien zu erstellen/erweitern:**

- `components/color-charts/utils/kmeansPlusPlus.ts` (neu)
- `components/color-charts/utils/gmmBIC.ts` (neu)
- `components/color-charts/utils/slicSuperpixels.ts` (neu)
- `components/color-charts/utils/guidedFilter.ts` (neu)
- `components/color-charts/utils/iccParser.ts` (neu)
- `components/color-charts/utils/circularStats.ts` (neu)
- `components/color-charts/utils/borderlineDetection.ts` (neu)
- `components/color-charts/utils/imageColorExtraction.ts` (erweitern)
- `components/color-charts/GemstoneColorAnalyzer.tsx` (erweitern)
- `app/api/gemstone-analyses/analyze/route.ts` (neu, optional für Server-Side)
- `app/api/gemstone-analyses/batch/route.ts` (neu, optional)

---

## Phase 2: Core-Algorithmen implementieren

### 2.1 K-Means++ Initialisierung

**Datei**: `components/color-charts/utils/kmeansPlusPlus.ts`

**Funktionen:**

- `kmeansPlusPlusInit(points: number[][], k: number): number[][]`
- `kmeansRGB(points: Uint8ClampedArray, k: number, maxIter?: number, usePP?: boolean): Cluster[]`

**Integration:**

- Ersetzt/erweitert bestehende K-Means-Logik in `imageColorExtraction.ts`
- Standard: `usePP = true` für bessere Ergebnisse

**Test**: Einfache K-Means-Tests mit/ohne PP-Initialisierung

---

### 2.2 GMM (diagonal) + BIC für Auto-K

**Datei**: `components/color-charts/utils/gmmBIC.ts`

**Funktionen:**

- `gmmDiagBIC(points: number[][], Kmin?: number, Kmax?: number, iters?: number): { k: number, bic: number, means, vars, weights }`

**Integration:**

- Wird aufgerufen wenn `kValue === null` (Auto-K)
- Testet K=3 bis K=8, wählt optimales K
- Dann: K-Means++ mit optimalem K

**Performance:**

- Bei großen Bildern (>100k Pixel) kann langsam sein
- **Optimierung**: Decimation auf max. 50k Pixel für GMM

**Test**: Verschiedene Bilder, prüfen ob Auto-K sinnvolle Werte liefert

---

### 2.3 SLIC Superpixels

**Datei**: `components/color-charts/utils/slicSuperpixels.ts`

**Funktionen:**

- `slicSuperpixels(img: ImageData, step?: number, m?: number): { labels: Int32Array, clusters, step, width, height }`

**Integration:**

- Wird nach initialer Maskierung aufgerufen
- Refiniert Maske via Majority Voting pro Superpixel
- Parameter: `slicStep` (8-40, default: 16), `slicM` (5-30, default: 10)

**Performance:**

- 5 Iterationen, O(n) pro Iteration
- Bei 512px Bild: ~1-2 Sekunden

**Test**: Vergleich Masken mit/ohne SLIC

---

### 2.4 Guided Filter

**Datei**: `components/color-charts/utils/guidedFilter.ts`

**Funktionen:**

- `guidedFilterGray(I: Float32Array, p: Float32Array, w: number, h: number, r?: number, eps?: number): Float32Array`

**Integration:**

- Wird nach SLIC aufgerufen
- Glättet Superpixel-Maske basierend auf Bildintensität
- Parameter: `guidedR` (2-16, default: 4), `guidedEps` (10^-6 bis 10^-2, default: 10^-3)

**Performance:**

- Integral-Image-basiert, sehr effizient
- Bei 512px Bild: <100ms

**Test**: Vergleich Masken mit/ohne Guided Filter

---

## Phase 3: Farbkorrektur & ICC-Support

### 3.1 ICC-Parser

**Datei**: `components/color-charts/utils/iccParser.ts`

**Funktionen:**

- `parseICC(buf: Uint8Array): { wtpt?: [number,number,number], rXYZ?, gXYZ?, bXYZ? }`

**Integration:**

- Neuer Upload-Button für ICC-Dateien
- Extrahiert `wtpt` (Weißpunkt) aus ICC-Profil
- Setzt `iccWP` State, wird in `rgbToLab` verwendet

**UI:**

```tsx
<div>
  ICC-Profil (optional): 
  <input type="file" accept=".icc,.icm" onChange={onICC} />
  {iccInfo && <div>wtpt: {iccInfo.wtpt?.map(x=>x.toFixed(5)).join(", ")}</div>}
</div>
```

**Test**: Verschiedene ICC-Profile testen (sRGB, Adobe RGB, etc.)

---

### 3.2 Bradford-Adaptation

**Datei**: `components/color-charts/utils/colorConversions.ts` (erweitern)

**Funktionen:**

- `bradfordAdaptXYZ(X: number, Y: number, Z: number, toD50: boolean): [number,number,number]`

**Integration:**

- Wird in `xyzToLab` verwendet wenn Whitepoint gewechselt wird
- D65 ↔ D50 Umschaltung

**Test**: Vergleich Lab-Werte mit/ohne Bradford

---

## Phase 4: Borderline-Erkennung

### 4.1 Circular Statistics

**Datei**: `components/color-charts/utils/circularStats.ts`

**Funktionen:**

- `circularStatsDeg(hues: number[]): { mean: number, R: number, circVar: number }`
- `circDist(a: number, b: number): number`

**Integration:**

- Wird in `analyzePleochroism` verwendet
- Berechnet zirkulären Hue-Mittelwert (0° = 360°)

**Test**: Verschiedene Hue-Verteilungen testen

---

### 4.2 Soft Category Classification

**Datei**: `components/color-charts/utils/circularStats.ts` (erweitern)

**Funktionen:**

- `softCategory(hueMean: number): { primary, secondary, conf, borderline }`

**Kategorien:**

```typescript
const CATS = [
  { name:"Gelb", center:90, width:25 },
  { name:"Gelbgrün", center:75, width:20 },
  { name:"Grün", center:140, width:25 },
  // ... 11 Kategorien
];
```

**Integration:**

- Wird in `getOverallImpressionAsync` verwendet
- Zeigt Primär- und Sekundärkategorie
- Borderline-Badge wenn `conf < 0.15`

**Test**: Grenzfarben testen (z.B. Gelbgrün/Grün)

---

### 4.3 Hue Histogramm & Peak-Detection

**Datei**: `components/color-charts/utils/circularStats.ts` (erweitern)

**Funktionen:**

- `hueBorderlineFromHist(hist: number[], smooth?: number): { sepDeg: number, sm: number[] }`

**Integration:**

- Analysiert 360° Hue-Histogramm
- Erkennt Mehrfach-Peaks (z.B. bei Pleochroismus)
- `sepDeg`: Abstand zwischen Peaks (6-40°)

**UI:**

- Hue-Histogramm-Visualisierung (360°)
- Peak-Markierungen

**Test**: Anisotrope Edelsteine (z.B. Turmalin)

---

## Phase 5: Export-Funktionalität

### 5.1 JSON Export

**Datei**: `components/color-charts/GemstoneColorAnalyzer.tsx` (erweitern)

**Funktion:**

```typescript
const exportJSON = useCallback(() => {
  if(!analysis) return;
  const blob = new Blob([JSON.stringify(analysis, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "gemstone-analysis.json";
  a.click();
  URL.revokeObjectURL(url);
}, [analysis]);
```

**Inhalt**: Vollständige Analyse-Daten, Parameter, Statistiken

---

### 5.2 CSV Export

**Datei**: `components/color-charts/GemstoneColorAnalyzer.tsx` (erweitern)

**Funktion:**

```typescript
const exportCSV = useCallback(() => {
  // Kompakte Zusammenfassung:
  // k, hueMean, satMean, valMean, L*, a*, b*, dE76, dE2000,
  // primary, secondary, conf, borderline,
  // top1, share1, top2, share2, top3, share3
}, [analysis]);
```

**Inhalt**: Eine Zeile pro Analyse, kompatibel mit Excel/LibreOffice

---

### 5.3 PDF Export

**Datei**: `components/color-charts/GemstoneColorAnalyzer.tsx` (erweitern)

**Dependencies**: `jspdf@^2.5.1`

**Funktion:**

```typescript
const exportPDF = useCallback(async () => {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  // ... Report-Generierung
  doc.save("gemstone-analysis.pdf");
}, [analysis]);
```

**Inhalt:**

- Titel, Parameter
- Cluster-Farben mit Anteilen
- HSV/Lab-Statistiken
- ΔE-Werte
- Borderline-Status
- Vorschau-Bild
- Parameter-Block

**Test**: PDF-Generierung mit verschiedenen Analysen

---

## Phase 6: UI-Integration

### 6.1 Erweiterte Einstellungen

**Datei**: `components/color-charts/GemstoneColorAnalyzer.tsx`

**Neue State-Variablen:**

```typescript
const [autoK, setAutoK] = useState(true); // statt kValue === null
const [slicStep, setSlicStep] = useState(16);
const [slicM, setSlicM] = useState(10);
const [guidedR, setGuidedR] = useState(4);
const [guidedEps, setGuidedEps] = useState(1e-3);
const [iccInfo, setIccInfo] = useState<any>();
const [iccWP, setIccWP] = useState<[number,number,number]>();
```

**UI-Elemente:**

- Checkbox: "Auto-K (GMM+BIC)"
- Slider: "SLIC Step" (8-40)
- Slider: "SLIC m" (5-30)
- Slider: "Guided r" (2-16)
- Slider: "Guided eps" (logarithmisch, 10^-6 bis 10^-2)
- File-Input: ICC-Profil-Upload

---

### 6.2 Borderline-Visualisierung

**Datei**: `components/color-charts/analysis/OverallImpressionSection.tsx` (erweitern)

**Neue UI-Elemente:**

- Borderline-Badge (Amber = Borderline, Emerald = Klar)
- Hue-Histogramm (360° Visualisierung)
- a*/b* Scatter Plot (Lab-Farbraum)
- KonfidenzΔ-Anzeige

**Code:**

```tsx
{analysis.hue.category.borderline ? (
  <span className="inline-flex items-center px-2 py-1 rounded bg-amber-100 text-amber-800">
    Borderline: {primary} / {secondary}
  </span>
) : (
  <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-100 text-emerald-800">
    Klar: {primary}
  </span>
)}
```

---

### 6.3 Export-Buttons

**Datei**: `components/color-charts/GemstoneColorAnalyzer.tsx`

**UI:**

```tsx
<div className="flex gap-3">
  <Button onClick={exportPDF} disabled={!analysis}>
    <FileText className="mr-2" /> PDF
  </Button>
  <Button onClick={exportJSON} disabled={!analysis}>
    <Download className="mr-2" /> JSON
  </Button>
  <Button onClick={exportCSV} disabled={!analysis}>
    <Download className="mr-2" /> CSV
  </Button>
</div>
```

---

## Phase 7: Analyse-Pipeline erweitern

### 7.1 Maskierung erweitern

**Datei**: `components/color-charts/utils/imageColorExtraction.ts`

**Ablauf:**

1. **Initiale Maskierung** (bestehend)
   - Weiß/Schwarz/Niedrige Sättigung
   - Smart Mask (Hintergrund-Erkennung)

2. **SLIC Superpixels** (neu)
   - Segmentierung in homogene Regionen
   - Majority Voting pro Superpixel

3. **Guided Filter** (neu)
   - Glättung der Maske
   - Binarisierung (Schwelle: 0.5)

4. **Farb-Extraktion** (bestehend, mit verbesserter Maske)

---

### 7.2 Clustering erweitern

**Datei**: `components/color-charts/utils/imageColorExtraction.ts`

**Ablauf:**

1. **Auto-K Bestimmung** (neu, wenn `autoK === true`)
   - GMM+BIC für K=3 bis K=8
   - Wählt optimales K

2. **K-Means++** (neu)
   - Intelligente Initialisierung
   - Iteration bis Konvergenz

3. **Cluster-Sortierung** (bestehend)
   - Nach Anteil sortiert

---

### 7.3 Farbanalyse erweitern

**Datei**: `components/color-charts/utils/gemstoneAnalysis.ts`

**Erweiterungen:**

- **Circular Hue Statistics**: Zirkulärer Mittelwert
- **Soft Category Classification**: Wahrscheinlichkeitsbasierte Kategorisierung
- **Borderline-Detection**: Konfidenz-basierte Erkennung
- **Peak-Separation**: Hue-Histogramm-Analyse

**Integration in `getOverallImpressionAsync`:**

```typescript
// Hue-Analyse
const circ = circularStatsDeg(hues);
const hb = hueBorderlineFromHist(hueHist, 3);
const cat = softCategory(circ.mean);

// Borderline-Status
overallImpression.borderline = cat.borderline;
overallImpression.primaryCategory = cat.primary.name;
overallImpression.secondaryCategory = cat.secondary?.name;
overallImpression.confidence = cat.conf;
```

---

## Phase 8: API-Routen (optional, Server-Side)

### 8.1 Analyse-API

**Datei**: `app/api/gemstone-analyses/analyze/route.ts` (neu, optional)

**Zweck**: Server-seitige Analyse für große Bilder oder Batch-Verarbeitung

**Implementierung:**

- Wiederverwendung der Client-Logik
- Sharp für Bildverarbeitung
- Rückgabe: JSON mit `previewDataUrl`

**Hinweis**: Kann später implementiert werden, Client-Side ist zunächst ausreichend

---

### 8.2 Batch-API

**Datei**: `app/api/gemstone-analyses/batch/route.ts` (neu, optional)

**Zweck**: Verarbeitung mehrerer Bilder gleichzeitig

**Implementierung:**

- Wiederverwendung der Analyse-API
- JSZip für ZIP-Export
- Enthält: JSON pro Datei, PNG-Previews, summary.csv

**Hinweis**: Kann später implementiert werden

---

## Phase 9: Testing & Validierung

### 9.1 Unit-Tests

**Zu testen:**

- K-Means++ Initialisierung
- GMM+BIC Auto-K
- SLIC Superpixels
- Guided Filter
- ICC-Parser
- Circular Statistics
- Soft Category Classification

**Dateien**: `__tests__/utils/*.test.ts`

---

### 9.2 Integration-Tests

**Zu testen:**

- Vollständige Analyse-Pipeline
- Maskierung mit SLIC+Guided Filter
- Clustering mit Auto-K
- Borderline-Erkennung
- Export-Funktionen

**Dateien**: `__tests__/integration/colorAnalysis.test.ts`

---

### 9.3 E2E-Tests

**Zu testen:**

- UI-Interaktionen
- Bild-Upload
- Analyse-Durchlauf
- Export-Downloads

**Dateien**: `__tests__/e2e/colorAnalysis.spec.ts`

---

### 9.4 Validierung mit echten Bildern

**Testfälle:**

1. **Isotrope Edelsteine** (z.B. Granat)
   - Erwartung: Klare Kategorie, kein Borderline
2. **Anisotrope Edelsteine** (z.B. Turmalin)
   - Erwartung: Borderline möglich, Mehrfach-Peaks
3. **Grenzfarben** (z.B. Gelbgrün)
   - Erwartung: Borderline-Erkennung, Primär+Sekundär
4. **Komplexe Bilder** (Hintergrund, Reflexionen)
   - Erwartung: Bessere Maskierung via SLIC+Guided Filter

---

## Phase 10: Dokumentation & Cleanup

### 10.1 Code-Dokumentation

- JSDoc-Kommentare für alle neuen Funktionen
- README-Updates für neue Features
- Parameter-Erklärungen in UI

---

### 10.2 Performance-Optimierungen

**Mögliche Optimierungen:**

- **GMM+BIC**: Decimation auf max. 50k Pixel
- **SLIC**: Web Worker für große Bilder
- **Guided Filter**: Bereits optimiert (Integral-Image)

---

### 10.3 Code-Review

- TypeScript-Typen prüfen
- Linter-Fehler beheben
- Unused Code entfernen
- Konsistenz mit bestehendem Code-Stil

---

## Implementierungsreihenfolge (Empfehlung)

### Sprint 1: Core-Algorithmen (Phase 2)

1. K-Means++ ✅
2. GMM+BIC ✅
3. SLIC Superpixels ✅
4. Guided Filter ✅

### Sprint 2: Farbkorrektur & ICC (Phase 3)

1. ICC-Parser ✅
2. Bradford-Adaptation ✅
3. UI-Integration ✅

### Sprint 3: Borderline-Erkennung (Phase 4)

1. Circular Statistics ✅
2. Soft Category Classification ✅
3. Peak-Detection ✅
4. UI-Visualisierung ✅

### Sprint 4: Export & UI (Phase 5-6)

1. JSON/CSV Export ✅
2. PDF Export ✅
3. Erweiterte Einstellungen ✅
4. Borderline-Visualisierung ✅

### Sprint 5: Integration & Testing (Phase 7-9)

1. Analyse-Pipeline erweitern ✅
2. Testing ✅
3. Validierung ✅

### Sprint 6: Finalisierung (Phase 10)

1. Dokumentation ✅
2. Performance-Optimierungen ✅
3. Code-Review ✅

---

## Risiken & Mitigation

### Risiko 1: Performance bei großen Bildern

**Mitigation:**

- Decimation für GMM+BIC
- Web Worker für SLIC (optional)
- Scale-Limit (512px Standard)

### Risiko 2: Kompatibilität mit bestehendem Code

**Mitigation:**

- Alle neuen Features optional
- Abwärtskompatibel
- Schrittweise Integration

### Risiko 3: ICC-Parser unvollständig

**Mitigation:**

- Minimaler Parser (nur wtpt, rXYZ/gXYZ/bXYZ)
- Fallback auf D65/D50
- Dokumentation der Limitationen

### Risiko 4: Borderline-Erkennung zu sensitiv

**Mitigation:**

- Konfidenz-Schwelle anpassbar (aktuell: 0.15)
- UI zeigt KonfidenzΔ
- Manuelle Korrektur möglich

---

## Erfolgs-Kriterien

✅ **Funktionalität:**

- Alle neuen Features funktionieren
- Keine Breaking Changes
- Abwärtskompatibel

✅ **Performance:**

- Analyse < 5 Sekunden für 512px Bild
- Export < 1 Sekunde

✅ **Qualität:**

- Bessere Maskierung (visuell)
- Präzisere Cluster (Auto-K)
- Borderline-Erkennung funktioniert

✅ **UX:**

- Intuitive UI
- Klare Parameter-Erklärungen
- Professionelle Exports

---

## Nächste Schritte

1. **Dependencies installieren** (Phase 1)
2. **K-Means++ implementieren** (Phase 2.1)
3. **GMM+BIC implementieren** (Phase 2.2)
4. **Schrittweise Integration** (Sprint 1-6)

**Geschätzter Aufwand**: 3-4 Wochen (abhängig von Team-Größe)
