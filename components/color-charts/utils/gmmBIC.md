# GMM+BIC Implementation für Auto-K

## Übersicht

Diese Datei enthält eine Implementierung des Gaussian Mixture Model (GMM) mit diagonaler Kovarianzmatrix und Bayesian Information Criterion (BIC) für die automatische Bestimmung der optimalen Clusterzahl K.

## Hauptfunktion

### `gmmDiagBIC(points, Kmin, Kmax, iters, maxPoints)`

Bestimmt automatisch die optimale Anzahl von Clustern (K) für Farbclustering.

**Parameter:**
- `points: number[][]` - Array von RGB-Punkten [r, g, b] (0-255)
- `Kmin: number` - Minimale Clusterzahl (default: 3)
- `Kmax: number` - Maximale Clusterzahl (default: 8)
- `iters: number` - Anzahl EM-Iterationen pro K (default: 30)
- `maxPoints: number` - Maximale Anzahl Punkte für Performance (default: 50000)

**Rückgabe:** `GMMResult` mit optimalem K und Parametern

**Algorithmus:**
1. **Decimation**: Bei >50k Punkten wird eine Stichprobe genommen (Performance)
2. **Für jedes K (Kmin bis Kmax)**:
   - K-Means++ Initialisierung der Mittelwerte
   - Expectation-Maximization (EM) Algorithmus
   - Berechnung der Log-Likelihood
   - Berechnung des BIC
3. **Auswahl**: K mit niedrigstem BIC wird gewählt

## GMMResult Interface

```typescript
{
  k: number;              // Optimale Clusterzahl
  means: number[][];      // Cluster-Mittelwerte [k][3] (RGB)
  vars: number[][];      // Cluster-Varianzen [k][3] (diagonale Kovarianz)
  weights: number[];      // Cluster-Gewichte (summieren zu 1)
  bic: number;            // Bayesian Information Criterion (niedriger = besser)
  ll: number;             // Log-Likelihood
}
```

## Bayesian Information Criterion (BIC)

BIC = -2 × log-likelihood + params × log(n)

- **Log-likelihood**: Misst wie gut das Modell die Daten beschreibt
- **Params × log(n)**: Strafung für Modellkomplexität
- **Niedrigeres BIC = besseres Modell** (Balance zwischen Fit und Komplexität)

**Parameter-Anzahl:**
- k × 3 Mittelwerte (RGB)
- k × 3 Varianzen (diagonale Kovarianz)
- (k-1) Gewichte (k-te ist 1 - Summe der anderen)
- **Total**: k × 6 + (k-1) = 6k + k - 1 = 7k - 1

## Performance

- **Komplexität**: O(n × k × iter × (Kmax - Kmin + 1))
- **Typische Laufzeit**: 
  - 10k Punkte, K=3-8: ~500ms-2s
  - 50k Punkte (decimated): ~1-3s
  - 100k+ Punkte: Decimation aktiviert, ~2-5s

**Optimierungen:**
- Decimation bei >50k Punkten
- Diagonale Kovarianz (3× schneller als vollständige Kovarianz)
- K-Means++ Initialisierung (weniger EM-Iterationen nötig)

## Verwendung

```typescript
import { gmmDiagBIC, getOptimalK, gmmResultToCentroids } from './gmmBIC';
import { kmeansRGB } from './kmeansPlusPlus';

// RGB-Punkte aus Bild extrahieren
const points = [[255, 0, 0], [0, 255, 0], [0, 0, 255], ...];

// Optimales K bestimmen
const gmmResult = gmmDiagBIC(points, 3, 8, 30);
const optimalK = getOptimalK(gmmResult); // z.B. 5

// K-Means mit optimalem K durchführen
const clusters = kmeansRGB(points, optimalK, 25, true);
```

## Integration in Analyse-Pipeline

1. **Bild → RGB-Punkte**: Extrahiere RGB-Werte aus maskierten Pixeln
2. **Auto-K**: `gmmDiagBIC()` bestimmt optimales K
3. **Clustering**: `kmeansRGB()` mit optimalem K
4. **Analyse**: Cluster für weitere Farbanalyse verwenden

## Vorteile

1. **Automatisch**: Keine manuelle K-Wahl nötig
2. **Datengetrieben**: Optimales K basierend auf Datenstruktur
3. **Robust**: BIC verhindert Über- oder Unter-Clustering
4. **Schnell**: Diagonale Kovarianz + Decimation für große Bilder

## Limitationen

- **Diagonale Kovarianz**: Annahme, dass RGB-Komponenten unabhängig sind (nicht perfekt, aber praktisch)
- **Performance**: Bei sehr großen Bildern (>100k Pixel) wird decimated
- **K-Bereich**: Kmin=3, Kmax=8 ist für Edelsteine typisch, kann angepasst werden

## Nächste Schritte

Diese Implementierung wird in Phase 7 in die Analyse-Pipeline integriert, um automatisch die optimale Clusterzahl zu bestimmen, wenn `autoK = true` gesetzt ist.

