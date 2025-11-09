# Circular Statistics and Borderline Detection

## Übersicht

Diese Datei enthält Funktionen zur Analyse von Hue-Verteilungen und zur Erkennung von Grenzfarben (Borderline Colors), die zwischen Kategorien liegen (z.B. Gelbgrün/Grün).

## Hauptfunktionen

### `circularStatsDeg(hues)`

Berechnet zirkuläre Statistiken für Hue-Werte.

**Parameter:**
- `hues: number[]` - Array von Hue-Werten in Grad (0-360)

**Rückgabe:** `CircularStats` mit:
- `mean: number` - Zirkulärer Mittelwert (0-360°)
- `R: number` - Resultant Length (0-1), höher = kompakter
- `circVar: number` - Zirkuläre Varianz (1-R), höher = mehr Streuung

**Algorithmus:**
- Konvertiert Hue-Werte zu Einheitsvektoren
- Summiert Vektoren
- Berechnet Mittelwert und Kompaktheit

### `softCategory(hueMean)`

Klassifiziert einen Hue-Mittelwert in Farbkategorien mit Wahrscheinlichkeits-Scores.

**Parameter:**
- `hueMean: number` - Mittelwert-Hue in Grad (0-360)

**Rückgabe:** `SoftCategory` mit:
- `primary: CategoryScore` - Primärkategorie
- `secondary: CategoryScore | null` - Sekundärkategorie (falls Borderline)
- `conf: number` - Konfidenz-Differenz (primary - secondary)
- `borderline: boolean` - True wenn conf < 0.15
- `scores: CategoryScore[]` - Alle Kategorie-Scores

**Kategorien:**
- Gelb (90°), Gelbgrün (75°), Grün (140°), Blaugrün (190°)
- Blau (240°), Blauviolett (280°), Violett (300°)
- Rotviolett (330°), Rot (0°), Rotorange (20°), Orange (40°)

### `hueBorderlineFromHist(hist, smooth)`

Analysiert Hue-Histogramm auf Peak-Separation.

**Parameter:**
- `hist: number[]` - Hue-Histogramm (typischerweise 360 Bins für 0-360°)
- `smooth: number` - Glättungs-Radius (default: 3)

**Rückgabe:** `HueHistogramAnalysis` mit:
- `sepDeg: number` - Abstand zwischen Peaks in Grad (0 wenn keine klare Separation)
- `sm: number[]` - Geglättetes Histogramm

**Verwendung:**
- Erkennt Mehrfach-Peaks (z.B. bei Pleochroismus)
- Berechnet Abstand zwischen Peaks
- Gültige Separation: 6° - 40°

### `circDist(a, b)`

Berechnet zirkuläre Distanz zwischen zwei Winkeln.

**Parameter:**
- `a, b: number` - Winkel in Grad (0-360)

**Rückgabe:** Zirkuläre Distanz in Grad (0-180)

## Mathematische Grundlage

### Zirkuläre Statistik

Hue ist zirkulär (0° = 360°), daher funktioniert der Standard-Mittelwert nicht.

**Lösung:**
1. Konvertiere Hue zu Einheitsvektoren: `(cos(h), sin(h))`
2. Summiere Vektoren: `(Σcos(h), Σsin(h))`
3. Berechne Mittelwert: `atan2(Σsin, Σcos)`
4. Resultant Length: `R = sqrt((Σcos/n)² + (Σsin/n)²)`
   - R = 1: Alle Werte identisch
   - R = 0: Gleichmäßige Verteilung

### Soft Category Classification

Verwendet Gaußsche Wahrscheinlichkeit:

```
score = exp(-0.5 * (dist/width)²)
```

wobei:
- `dist`: Zirkuläre Distanz zum Kategorie-Zentrum
- `width`: Standard-Abweichung der Kategorie

**Borderline-Erkennung:**
- `conf = primary.score - secondary.score`
- `borderline = conf < 0.15`

## Verwendung

```typescript
import {
  circularStatsDeg,
  softCategory,
  hueBorderlineFromHist,
  circDist
} from './circularStats';

// Zirkuläre Statistik
const hues = [120, 125, 130, 135, 140]; // Grün-Bereich
const stats = circularStatsDeg(hues);
console.log(`Mean: ${stats.mean}°, R: ${stats.R}, Var: ${stats.circVar}`);

// Soft Category Classification
const category = softCategory(stats.mean);
console.log(`Primary: ${category.primary.name}`);
console.log(`Borderline: ${category.borderline}`);

// Hue Histogramm-Analyse
const hist = new Array(360).fill(0);
// ... fülle Histogramm ...
const analysis = hueBorderlineFromHist(hist, 3);
console.log(`Peak separation: ${analysis.sepDeg}°`);
```

## Integration in Analyse-Pipeline

1. **Hue-Extraktion**: Sammle Hue-Werte aus Bild
2. **Zirkuläre Statistik**: `circularStatsDeg()` berechnet Mittelwert
3. **Soft Category**: `softCategory()` klassifiziert in Kategorien
4. **Borderline-Detection**: `conf < 0.15` → Borderline
5. **Histogramm-Analyse**: `hueBorderlineFromHist()` erkennt Mehrfach-Peaks

## Vorteile

1. **Zirkuläre Statistik**: Korrekte Behandlung von Hue (0° = 360°)
2. **Soft Classification**: Wahrscheinlichkeits-basierte Klassifikation
3. **Borderline-Erkennung**: Identifiziert Grenzfarben automatisch
4. **Peak-Detection**: Erkennt Pleochroismus (Mehrfach-Peaks)

## Anwendungsfälle

### Grenzfarben
- **Gelbgrün/Grün**: Borderline wenn Hue zwischen 75° und 140°
- **Blaugrün/Blau**: Borderline wenn Hue zwischen 190° und 240°

### Pleochroismus
- **Anisotrope Edelsteine**: Mehrere Peaks im Histogramm
- **Peak-Separation**: Abstand zwischen Peaks (z.B. 30°)

## Nächste Schritte

Diese Implementierung wird in Phase 7 in die Analyse-Pipeline integriert, um:
- Borderline-Farben zu identifizieren
- Pleochroismus zu analysieren
- Farbkategorien mit Konfidenz anzuzeigen

