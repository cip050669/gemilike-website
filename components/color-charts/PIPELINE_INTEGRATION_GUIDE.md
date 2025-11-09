# Pipeline Integration Guide: Borderline v4 Features

## Übersicht

Dieses Dokument beschreibt die schrittweise Integration der Borderline v4 Features in die bestehende Analyse-Pipeline.

## Architektur-Überlegungen

Die bestehende Pipeline (`imageColorExtraction.ts`) funktioniert bereits gut. Die neuen Features werden **optional** integriert, um:
- **Abwärtskompatibilität** zu gewährleisten
- **Schrittweise Migration** zu ermöglichen
- **A/B-Testing** zwischen alter und neuer Pipeline zu ermöglichen

## Integrationsstrategie

### Option 1: Erweiterte Funktion (Empfohlen)

Erstelle eine neue Funktion `extractColorsEnhanced()` die die neuen Features nutzt, während `extractColorsFromImage()` unverändert bleibt.

**Vorteile:**
- Keine Breaking Changes
- Beide Pipelines können parallel existieren
- Einfaches Testing

**Nachteile:**
- Code-Duplikation
- Zwei separate Code-Pfade

### Option 2: Parameter-basierte Erweiterung

Erweitere `extractColorsFromImage()` mit optionalen Parametern für die neuen Features.

**Vorteile:**
- Ein Code-Pfad
- Weniger Duplikation

**Nachteile:**
- Komplexere Funktion
- Potenzielle Breaking Changes

## Schritt-für-Schritt Integration

### Schritt 1: Helper-Funktionen exportieren

In `imageColorExtraction.ts`, exportiere die benötigten Helper-Funktionen:

```typescript
// Am Ende der Datei hinzufügen:
export { detectGemstoneMask, calculateColorPurity, rgbToHex, rgbToHsv };
```

### Schritt 2: Erweiterte Maskierung

Erstelle eine neue Funktion `extractColorsWithEnhancedMasking()`:

```typescript
import { slicSuperpixels, majorityVoteMask } from './slicSuperpixels';
import { guidedFilterMaskWithImage } from './guidedFilter';
import { detectGemstoneMask, DEFAULT_MASKING_OPTIONS } from './imageColorExtraction';

export async function extractColorsWithEnhancedMasking(
  imageFile: File,
  sampleSize: number = 10000,
  cropRegion?: { x: number; y: number; width: number; height: number },
  whitepoint: Whitepoint = 'D65',
  kValue?: number | null,
  maskingOptions?: EnhancedMaskingOptions,
  externalAlpha?: Uint8ClampedArray
): Promise<ImageAnalysis> {
  // ... ähnlich wie extractColorsFromImage, aber mit:
  
  // 1. Initial mask (wie bisher)
  let mask: boolean[][];
  if (externalAlpha) {
    // Use external alpha
  } else if (maskingOptions?.useSLIC || maskingOptions?.useGuidedFilter) {
    // Enhanced masking
    const imageData = ctx.getImageData(0, 0, width, height);
    const initialMask = createInitialMask(ctx, width, height, maskingOptions);
    
    if (maskingOptions.useSLIC) {
      const slicResult = slicSuperpixels(imageData, maskingOptions.slicStep || 16, maskingOptions.slicM || 10);
      const refinedMask = majorityVoteMask(slicResult, initialMask);
      
      if (maskingOptions.useGuidedFilter) {
        const finalMask = guidedFilterMaskWithImage(
          refinedMask,
          imageData.data,
          width,
          height,
          maskingOptions.guidedR || 4,
          maskingOptions.guidedEps || 1e-3
        );
        mask = convertMaskToBoolean(finalMask, width, height);
      } else {
        mask = convertMaskToBoolean(refinedMask, width, height);
      }
    } else {
      // Only Guided Filter
      const finalMask = guidedFilterMaskWithImage(...);
      mask = convertMaskToBoolean(finalMask, width, height);
    }
  } else {
    // Standard masking
    mask = detectGemstoneMask(ctx, width, height, maskingOptions || DEFAULT_MASKING_OPTIONS);
  }
  
  // 2. Rest wie bisher...
}
```

### Schritt 3: Erweiterte Clustering

Erweitere `clusterColors()` oder erstelle `clusterColorsEnhanced()`:

```typescript
import { kmeansRGB } from './kmeansPlusPlus';
import { gmmDiagBIC, getOptimalK } from './gmmBIC';

function clusterColorsEnhanced(
  colors: ColorSample[],
  whitepoint: Whitepoint = 'D65',
  options?: EnhancedClusteringOptions
): ColorSample[] {
  if (colors.length === 0) return [];
  if (colors.length === 1) {
    colors[0].percentage = 100;
    return colors;
  }

  const opts: EnhancedClusteringOptions = {
    useAutoK: true,
    autoKMin: 3,
    autoKMax: 8,
    useKMeansPP: true,
    ...options,
  };

  let k: number;
  let usedAutoK = false;

  if (opts.useAutoK && colors.length > 100) {
    // Auto-K via GMM+BIC
    const points = colors.map(c => [c.rgb.r * 255, c.rgb.g * 255, c.rgb.b * 255]);
    const gmmResult = gmmDiagBIC(points, opts.autoKMin || 3, opts.autoKMax || 8);
    k = getOptimalK(gmmResult);
    usedAutoK = true;
  } else {
    k = opts.kValue || Math.min(Math.max(3, Math.floor(colors.length / 100)), 20);
  }

  // Use K-Means++ in RGB space
  const rgbPoints = colors.map(c => [c.rgb.r * 255, c.rgb.g * 255, c.rgb.b * 255]);
  const clusters = kmeansRGB(rgbPoints, k, 25, opts.useKMeansPP !== false);

  // Convert back to ColorSample format
  // (Map clusters to closest ColorSample for Lab values)
  const result: ColorSample[] = clusters.map((c, idx) => {
    // Find closest pixel
    let closest = colors[0];
    let minDist = Infinity;
    for (const color of colors) {
      const dist = Math.sqrt(
        (color.rgb.r * 255 - c.rgb[0]) ** 2 +
        (color.rgb.g * 255 - c.rgb[1]) ** 2 +
        (color.rgb.b * 255 - c.rgb[2]) ** 2
      );
      if (dist < minDist) {
        minDist = dist;
        closest = color;
      }
    }

    return {
      hex: c.hex,
      rgb: { r: c.rgb[0], g: c.rgb[1], b: c.rgb[2] },
      lab: closest.lab, // Use Lab from closest pixel
      xyz: closest.xyz,
      percentage: c.share * 100,
      x: 0,
      y: 0,
      weight: c.share,
    };
  });

  // Normalize percentages
  const total = result.reduce((sum, c) => sum + c.percentage, 0);
  if (total > 0) {
    result.forEach(c => {
      c.percentage = (c.percentage / total) * 100;
    });
  }

  return result.sort((a, b) => b.percentage - a.percentage);
}
```

### Schritt 4: Borderline-Analyse integrieren

Erweitere `getOverallImpressionAsync()` in `gemstoneAnalysis.ts`:

```typescript
import { circularStatsDeg, softCategory, hueBorderlineFromHist } from './circularStats';

// In getOverallImpressionAsync(), nach der Pleochroismus-Analyse:

// Collect hues from all colors
const hues: number[] = [];
const hueHist = new Array(360).fill(0);

for (const color of allColors) {
  const [h, s, v] = rgbToHsv(color.rgb.r * 255, color.rgb.g * 255, color.rgb.b * 255);
  hues.push(h);
  hueHist[Math.floor(h) % 360]++;
}

// Circular statistics
const circStats = circularStatsDeg(hues);
const category = softCategory(circStats.mean);
const histAnalysis = hueBorderlineFromHist(hueHist, 3);

// Add to overall impression
overallImpression.borderline = category.borderline;
overallImpression.primaryCategory = category.primary.name;
overallImpression.secondaryCategory = category.secondary?.name;
overallImpression.confidence = category.conf;
overallImpression.hueMean = circStats.mean;
overallImpression.hueR = circStats.R;
overallImpression.peakSeparation = histAnalysis.sepDeg;
```

### Schritt 5: ICC-Unterstützung

Erweitere `xyzToLab()` in `colorConversions.ts`:

```typescript
export function xyzToLab(
  xyz: XYZ,
  whitepoint: Whitepoint = 'D65',
  customWP?: [number, number, number] // Optional custom whitepoint from ICC
): Lab {
  let [x, y, z] = [xyz.x, xyz.y, xyz.z];
  
  // Priority: customWP > whitepoint
  let Xn: number, Yn: number, Zn: number;
  
  if (customWP) {
    // Use custom whitepoint (from ICC)
    [x, y, z] = adaptBradford(
      [x, y, z],
      D65_WHITE as [number, number, number],
      customWP
    );
    Xn = customWP[0];
    Yn = customWP[1];
    Zn = customWP[2];
  } else if (whitepoint === 'D50') {
    // ... existing D50 logic
  } else {
    // ... existing D65 logic
  }
  
  // ... rest of function
}
```

### Schritt 6: Integration in GemstoneColorAnalyzer

In `GemstoneColorAnalyzer.tsx`, erweitere `handleAnalyze()`:

```typescript
const handleAnalyze = useCallback(async () => {
  if (!imageFile) return;
  
  setIsAnalyzing(true);
  setAnalysisComplete(false);
  
  try {
    // Parse ICC profile if available
    let iccProfile = null;
    if (iccInfo) {
      iccProfile = iccInfo;
    }
    
    // Enhanced masking options
    const enhancedMasking: EnhancedMaskingOptions = {
      ...maskingOptions,
      useSLIC: true, // Enable SLIC
      slicStep: slicStep,
      slicM: slicM,
      useGuidedFilter: true, // Enable Guided Filter
      guidedR: guidedR,
      guidedEps: guidedEps,
    };
    
    // Enhanced clustering options
    const enhancedClustering: EnhancedClusteringOptions = {
      useAutoK: autoK,
      autoKMin: 3,
      autoKMax: 8,
      useKMeansPP: true,
      kValue: autoK ? null : kValue,
    };
    
    // Use enhanced extraction
    const analysis = await extractColorsEnhanced(
      imageFile,
      10000,
      cropRegion,
      whitepoint,
      iccProfile,
      enhancedMasking,
      enhancedClustering
    );
    
    // ... rest of analysis pipeline
    
    // Borderline info is now in analysis.borderline
    if (analysis.borderline) {
      // Update overall impression with borderline info
    }
    
  } catch (error) {
    console.error('Analysis error:', error);
    alert('Fehler bei der Analyse: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
  } finally {
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  }
}, [imageFile, cropRegion, whitepoint, iccInfo, maskingOptions, autoK, kValue, slicStep, slicM, guidedR, guidedEps]);
```

## Testing-Strategie

### 1. Unit-Tests
- Teste jede neue Funktion isoliert
- Vergleiche Ergebnisse mit bestehender Implementierung

### 2. Integration-Tests
- Teste vollständige Pipeline mit neuen Features
- Vergleiche mit alter Pipeline

### 3. Performance-Tests
- Messen Laufzeit mit/ohne neue Features
- Optimieren bei Bedarf

## Migration-Plan

### Phase 1: Vorbereitung
- ✅ Helper-Funktionen exportieren
- ✅ Neue Funktionen erstellen
- ✅ Tests schreiben

### Phase 2: Integration
- Erweiterte Maskierung integrieren
- Erweiterte Clustering integrieren
- Borderline-Analyse integrieren

### Phase 3: UI-Integration
- Parameter-UI hinzufügen (Phase 6)
- Ergebnisse anzeigen

### Phase 4: Testing
- Unit-Tests
- Integration-Tests
- Performance-Tests

### Phase 5: Rollout
- Feature-Flag für neue Pipeline
- A/B-Testing
- Schrittweise Aktivierung

## Rollback-Plan

Falls Probleme auftreten:
1. Feature-Flag deaktivieren → alte Pipeline
2. Parameter auf Standard zurücksetzen
3. Code-Review und Fixes

## Nächste Schritte

1. **Helper-Funktionen exportieren** (Schritt 1)
2. **Erweiterte Maskierung** (Schritt 2)
3. **Erweiterte Clustering** (Schritt 3)
4. **Borderline-Analyse** (Schritt 4)
5. **ICC-Unterstützung** (Schritt 5)
6. **Komponente erweitern** (Schritt 6)

Nach erfolgreicher Integration können die neuen Features optional aktiviert werden.

