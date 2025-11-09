# K-Means++ Implementation

## Übersicht

Diese Datei enthält eine optimierte K-Means++ Implementierung für RGB-Farbclustering, basierend auf der Borderline v4 Version.

## Hauptfunktionen

### `kmeansPlusPlusInit(points, k)`
Initialisiert K-Means++ Zentroide für bessere Cluster-Qualität.

**Parameter:**
- `points: number[][]` - Array von RGB-Punkten [r, g, b] (0-255)
- `k: number` - Anzahl der Cluster

**Rückgabe:** Array von initialen Zentroid-Positionen

**Algorithmus:**
1. Erster Zentroid: Zufällige Auswahl
2. Weitere Zentroide: Auswahl basierend auf größter Distanz zu bestehenden Zentroiden
3. Wahrscheinlichkeitsbasierte Auswahl (proportional zu Distanz²)

### `kmeansRGB(points, k, maxIter, usePP)`
Führt K-Means Clustering im RGB-Raum durch.

**Parameter:**
- `points: Uint8ClampedArray | number[][]` - Bilddaten (RGBA) oder RGB-Punkte
- `k: number` - Anzahl der Cluster
- `maxIter: number` - Maximale Iterationen (default: 25)
- `usePP: boolean` - K-Means++ Initialisierung verwenden (default: true)

**Rückgabe:** Array von Clustern, sortiert nach Anteil (absteigend)

**Cluster-Format:**
```typescript
{
  hex: string;           // Hex-Farbe (z.B. "#ff0000")
  rgb: [number, number, number];  // RGB-Werte (0-255)
  hsv: [number, number, number];  // HSV-Werte (h: 0-360, s: 0-100, v: 0-100)
  share: number;         // Anteil (0-1)
}
```

## Vorteile gegenüber Standard K-Means

1. **Bessere Initialisierung**: K-Means++ vermeidet schlechte lokale Minima
2. **Schneller**: Direkt im RGB-Raum (keine Lab-Konvertierung nötig)
3. **Stabiler**: Konsistentere Ergebnisse bei wiederholten Läufen

## Performance

- **Komplexität**: O(n * k * iter) wobei n = Anzahl Punkte, k = Cluster, iter = Iterationen
- **Typische Laufzeit**: < 100ms für 10.000 Punkte, k=5, 25 Iterationen

## Integration

Die Funktion kann direkt mit Bilddaten (Uint8ClampedArray) oder mit vorverarbeiteten RGB-Punkten verwendet werden:

```typescript
import { kmeansRGB } from './kmeansPlusPlus';

// Mit Bilddaten (RGBA)
const imageData = ctx.getImageData(0, 0, width, height);
const clusters = kmeansRGB(imageData.data, 5, 25, true);

// Mit RGB-Punkten
const points = [[255, 0, 0], [0, 255, 0], [0, 0, 255], ...];
const clusters = kmeansRGB(points, 3, 25, true);
```

## Nächste Schritte

Diese Implementierung wird in Phase 7 in die bestehende Analyse-Pipeline integriert, um die aktuelle Lab-basierte K-Means-Implementierung zu erweitern oder zu ersetzen.

