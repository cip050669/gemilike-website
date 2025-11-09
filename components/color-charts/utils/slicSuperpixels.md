# SLIC Superpixels Implementation

## Übersicht

Diese Datei enthält eine Implementierung des SLIC (Simple Linear Iterative Clustering) Algorithmus zur Segmentierung von Bildern in homogene Regionen (Superpixels).

## Hauptfunktionen

### `slicSuperpixels(img, step, m)`

Segmentiert ein Bild in Superpixels durch iteratives Clustering basierend auf Farb- und Raum-Ähnlichkeit.

**Parameter:**
- `img: ImageData` - Bilddaten (RGBA)
- `step: number` - Superpixel-Größe (default: 16). Größer = größere Superpixels
- `m: number` - Kompaktheits-Parameter (default: 10). Höher = kompakter, folgt Kanten besser

**Rückgabe:** `SLICResult` mit Labels und Cluster-Zentren

**Algorithmus:**
1. **Initialisierung**: Cluster-Zentren auf regelmäßigem Gitter (Abstand = step)
2. **Iteration** (5 Iterationen):
   - **Assignment**: Jeder Pixel wird dem nächsten Cluster zugewiesen (2S × 2S Nachbarschaft)
   - **Update**: Cluster-Zentren werden basierend auf zugewiesenen Pixeln neu berechnet
3. **Distanz-Metrik**: `D = sqrt(dc² + (ds/S)² × m²)`
   - `dc`: Farb-Distanz (RGB)
   - `ds`: Raum-Distanz (x, y)
   - `m`: Gewichtung zwischen Farbe und Raum

### `majorityVoteMask(slicResult, mask)`

Wendet Majority Voting auf eine Maske an, um sie mit SLIC Superpixels zu verfeinern.

**Parameter:**
- `slicResult: SLICResult` - Ergebnis von `slicSuperpixels()`
- `mask: Uint8Array` - Binäre Maske (0 oder 255)

**Rückgabe:** Verfeinerte Maske mit Majority Voting pro Superpixel

**Algorithmus:**
- Für jeden Superpixel: Zähle Foreground- und Background-Pixel
- Entscheidung: Foreground wenn fg >= bg
- Alle Pixel im Superpixel erhalten die gleiche Entscheidung

## SLICResult Interface

```typescript
{
  labels: Int32Array;      // Label für jeden Pixel (Index in clusters)
  clusters: number[][];   // Cluster-Zentren [x, y, r, g, b]
  step: number;            // Superpixel-Schrittgröße
  width: number;           // Bildbreite
  height: number;          // Bildhöhe
}
```

## Parameter-Erklärung

### `step` (Superpixel-Größe)
- **Klein (8-12)**: Viele kleine Superpixels, detaillierter, langsamer
- **Mittel (16-20)**: Ausgewogen, Standard
- **Groß (24-40)**: Wenige große Superpixels, schneller, weniger detailliert

**Typische Werte:**
- 512×512 Bild: step = 16 → ~1000 Superpixels
- 1024×1024 Bild: step = 32 → ~1000 Superpixels

### `m` (Kompaktheit)
- **Niedrig (5-10)**: Weniger kompakt, folgt Farben besser
- **Mittel (10-15)**: Ausgewogen, Standard
- **Hoch (20-30)**: Sehr kompakt, folgt Kanten besser

**Typische Werte:**
- Standard: m = 10
- Kanten-betont: m = 20-30
- Farb-betont: m = 5-10

## Performance

- **Komplexität**: O(n × iter × nc) wobei n = Pixel, iter = 5, nc = Anzahl Superpixels
- **Typische Laufzeit**: 
  - 512×512 Bild: ~500ms-1s
  - 1024×1024 Bild: ~2-4s

**Optimierungen:**
- 2S × 2S Nachbarschaft (nicht gesamtes Bild)
- 5 Iterationen (ausreichend für Konvergenz)
- Effiziente Distanz-Berechnung

## Verwendung

```typescript
import { slicSuperpixels, majorityVoteMask } from './slicSuperpixels';

// Bild in Superpixels segmentieren
const ctx = canvas.getContext('2d');
const imageData = ctx.getImageData(0, 0, width, height);
const slicResult = slicSuperpixels(imageData, 16, 10);

// Maske mit Majority Voting verfeinern
const initialMask = new Uint8Array(width * height);
// ... initialMask füllen ...
const refinedMask = majorityVoteMask(slicResult, initialMask);
```

## Integration in Analyse-Pipeline

1. **Initiale Maskierung**: Pixelweise Maskierung (Weiß/Schwarz/Niedrige Sättigung)
2. **SLIC Segmentierung**: `slicSuperpixels()` segmentiert Bild
3. **Majority Voting**: `majorityVoteMask()` verfeinert Maske pro Superpixel
4. **Guided Filter**: Glättet die verfeinerte Maske (nächste Phase)

## Vorteile

1. **Glattere Masken**: Weniger Randkontamination durch Superpixel-basierte Entscheidungen
2. **Bessere Kantenerkennung**: Folgt natürlichen Bildgrenzen
3. **Effizient**: Nur 5 Iterationen nötig
4. **Konfigurierbar**: step und m für verschiedene Anwendungen anpassbar

## Limitationen

- **Regelmäßige Form**: Superpixels sind annähernd regelmäßig (nicht perfekt)
- **Performance**: Bei sehr großen Bildern (>2048×2048) kann langsam sein
- **Parameter-abhängig**: step und m müssen für verschiedene Bildtypen angepasst werden

## Nächste Schritte

Diese Implementierung wird in Phase 7 in die Analyse-Pipeline integriert, um die Maskierung zu verfeinern. Nach SLIC folgt der Guided Filter (Phase 2.4) zur weiteren Glättung.

