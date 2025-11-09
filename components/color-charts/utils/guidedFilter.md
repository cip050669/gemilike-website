# Guided Filter Implementation

## Übersicht

Diese Datei enthält eine Implementierung des Guided Filters für Edge-Preserving Smoothing. Der Filter glättet eine Maske (oder jedes Graustufenbild) während er Kanten basierend auf einem Guidance-Bild erhält.

## Hauptfunktionen

### `guidedFilterGray(I, p, w, h, r, eps)`

Filtert ein Eingabebild `p` unter Verwendung eines Guidance-Bildes `I`.

**Parameter:**
- `I: Float32Array` - Guidance-Bild (0-1 Bereich, typischerweise Bildintensität)
- `p: Float32Array` - Eingabebild zum Filtern (0-1 Bereich, typischerweise Maske)
- `w: number` - Bildbreite
- `h: number` - Bildhöhe
- `r: number` - Filter-Radius (default: 4). Größer = glatter, langsamer
- `eps: number` - Regularisierungsparameter (default: 1e-3). Höher = mehr Glättung

**Rückgabe:** Gefiltertes Bild (Float32Array, 0-1 Bereich)

**Algorithmus:**
1. **Lokale Statistiken**: Berechne Mittelwerte, Varianzen, Kovarianzen mit Box-Filter
2. **Lineare Koeffizienten**: `a = cov(I,P) / (var(I) + eps)`, `b = E[P] - a * E[I]`
3. **Box-Filter auf a und b**: Glättung der Koeffizienten
4. **Output**: `q = meanA * I + meanB`

### `guidedFilterMask(mask, guidance, w, h, r, eps, threshold)`

Wendet Guided Filter auf eine binäre Maske an.

**Parameter:**
- `mask: Uint8Array` - Binäre Maske (0 oder 255)
- `guidance: Float32Array` - Guidance-Bild (0-1 Bereich)
- `w, h, r, eps` - Wie oben
- `threshold: number` - Binarisierungs-Schwelle (default: 0.5)

**Rückgabe:** Gefilterte und binarisierte Maske (Uint8Array, 0 oder 255)

### `computeIntensity(data, w, h)`

Berechnet Bildintensität (Luminanz) aus RGB-Daten.

**Parameter:**
- `data: Uint8ClampedArray` - RGBA Bilddaten
- `w, h` - Bildabmessungen

**Rückgabe:** Intensitätsbild (Float32Array, 0-1 Bereich)

**Formel:** `Y = 0.2126*R + 0.7152*G + 0.0722*B`

### `guidedFilterMaskWithImage(mask, imageData, w, h, r, eps, threshold)`

Vollständige Pipeline: Guided Filter auf Maske mit Bildintensität als Guidance.

**Parameter:**
- `mask: Uint8Array` - Binäre Maske
- `imageData: Uint8ClampedArray` - RGBA Bilddaten
- `w, h, r, eps, threshold` - Wie oben

**Rückgabe:** Gefilterte und binarisierte Maske

## Box Filter (Integral Image)

Der Box Filter verwendet ein Integral Image für effiziente Mittelwert-Berechnung:

- **Integral Image**: `integral[y][x] = Summe aller Pixel von (0,0) bis (x-1,y-1)`
- **Mittelwert in Rechteck**: `(D - B - C + A) / area`
  - D = Summe von (0,0) bis (x1,y1)
  - B = Summe von (0,0) bis (x0-1,y1)
  - C = Summe von (0,0) bis (x1,y0-1)
  - A = Summe von (0,0) bis (x0-1,y0-1)

**Komplexität**: O(1) pro Pixel (nach Integral Image-Berechnung)

## Parameter-Erklärung

### `r` (Filter-Radius)
- **Klein (2-4)**: Weniger Glättung, erhält mehr Details, schneller
- **Mittel (4-8)**: Ausgewogen, Standard
- **Groß (8-16)**: Mehr Glättung, langsamer

**Typische Werte:**
- Standard: r = 4
- Mehr Glättung: r = 8-12
- Weniger Glättung: r = 2-3

### `eps` (Regularisierung)
- **Niedrig (1e-4 bis 1e-3)**: Weniger Glättung, erhält mehr Details
- **Mittel (1e-3 bis 1e-2)**: Ausgewogen, Standard
- **Hoch (1e-2 bis 1e-1)**: Mehr Glättung

**Typische Werte:**
- Standard: eps = 1e-3
- Mehr Glättung: eps = 1e-2
- Weniger Glättung: eps = 1e-4

### `threshold` (Binarisierung)
- **Niedrig (0.3-0.5)**: Mehr Foreground-Pixel
- **Mittel (0.5)**: Ausgewogen, Standard
- **Hoch (0.5-0.7)**: Weniger Foreground-Pixel

## Performance

- **Komplexität**: O(n) wobei n = Anzahl Pixel
- **Typische Laufzeit**: 
  - 512×512 Bild: ~50-100ms
  - 1024×1024 Bild: ~200-400ms

**Optimierungen:**
- Integral Image für O(1) Box-Filter
- Effiziente Float32Array-Operationen
- Keine verschachtelten Schleifen für Box-Filter

## Verwendung

```typescript
import { 
  guidedFilterMaskWithImage, 
  computeIntensity,
  guidedFilterGray 
} from './guidedFilter';

// Vollständige Pipeline: Maske mit Bildintensität filtern
const filteredMask = guidedFilterMaskWithImage(
  mask, 
  imageData, 
  width, 
  height, 
  4,      // r
  1e-3,   // eps
  0.5     // threshold
);

// Oder Schritt für Schritt:
const intensity = computeIntensity(imageData, width, height);
const maskFloat = new Float32Array(width * height);
for (let i = 0; i < width * height; i++) {
  maskFloat[i] = mask[i] / 255;
}
const filtered = guidedFilterGray(intensity, maskFloat, width, height, 4, 1e-3);
```

## Integration in Analyse-Pipeline

1. **Initiale Maskierung**: Pixelweise Maskierung (Weiß/Schwarz/Niedrige Sättigung)
2. **SLIC Segmentierung**: Superpixel-basierte Verfeinerung
3. **Guided Filter**: Glättet die Maske, erhält Kanten
4. **Binarisierung**: Konvertiert zu binärer Maske (0 oder 255)

## Vorteile

1. **Edge-Preserving**: Erhält Kanten während Glättung
2. **Schnell**: O(n) Komplexität durch Integral Image
3. **Effektiv**: Reduziert Rauschen ohne Details zu verlieren
4. **Konfigurierbar**: r und eps für verschiedene Anwendungen anpassbar

## Mathematische Grundlage

Der Guided Filter modelliert das Output als lineare Transformation des Guidance-Bildes:

```
q_i = a_i * I_i + b_i
```

wobei `a_i` und `b_i` lokal konstant sind (innerhalb eines Fensters). Die Koeffizienten werden durch Minimierung der quadratischen Fehler berechnet:

```
minimize: Σ_j (a_i * I_j + b_i - p_j)²
```

mit Regularisierung `eps`:

```
a_i = cov(I,P) / (var(I) + eps)
b_i = E[P] - a_i * E[I]
```

## Limitationen

- **Guidance-abhängig**: Qualität hängt von der Qualität des Guidance-Bildes ab
- **Parameter-abhängig**: r und eps müssen für verschiedene Bildtypen angepasst werden
- **Speicher**: Benötigt mehrere Float32Array-Kopien (I, p, meanI, meanP, etc.)

## Nächste Schritte

Diese Implementierung wird in Phase 7 in die Analyse-Pipeline integriert, um die Maskierung nach SLIC Superpixels weiter zu glätten.

