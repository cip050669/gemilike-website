# Analyse: Gem Photo Color Analyzer Borderline v4

## Zusammenfassung der Neuerungen

Die ZIP-Datei `gem-photo-color-analyzer-borderline-v4.zip` enthält eine deutlich verbesserte Version der Edelstein-Farbanalyse mit folgenden Hauptverbesserungen:

---

## 1. K-Means++ mit Auto-K via GMM (Gaussian Mixture Model) + BIC

### Was ist neu?
- **K-Means++ Initialisierung**: Intelligente Startpunkte für bessere Cluster-Qualität
- **Auto-K Bestimmung**: Automatische Clusterzahl-Bestimmung (3-8) via GMM mit BIC (Bayesian Information Criterion)
- **Stabile Clusterzahl**: Vermeidet Über- oder Unter-Clustering

### Vorteile gegenüber aktueller Implementierung:
- **Aktuell**: Manuelle K-Wahl oder einfache Heuristik
- **Neu**: Datengetriebene, optimale Clusterzahl pro Bild
- **Ergebnis**: Präzisere Farbidentifikation, besonders bei komplexen Edelsteinen

### Technische Details:
```typescript
// GMM (diagonal) + BIC für Auto-K
function gmmDiagBIC(points, Kmin=3, Kmax=8, iters=30)
// Testet K=3 bis K=8, wählt optimales K basierend auf BIC
// Dann: K-Means++ mit optimalem K
```

---

## 2. SLIC-Superpixel + Guided Filter für Maskenverfeinerung

### Was ist neu?
- **SLIC Superpixels**: Segmentierung in homogene Regionen
- **Guided Filter**: Glättung der Maske basierend auf Bildintensität
- **Majority Voting**: Entscheidung pro Superpixel basierend auf Mehrheit

### Vorteile gegenüber aktueller Implementierung:
- **Aktuell**: Pixelweise Maskierung, manchmal unsaubere Ränder
- **Neu**: Glattere Masken, weniger Randkontamination, bessere Kantenerkennung
- **Ergebnis**: Präzisere Farbanalyse, weniger Hintergrund-Artefakte

### Technische Details:
```typescript
// SLIC Parameter:
- step: Superpixel-Größe (8-40, default: 16)
- m: Farbe vs. Raum-Gewichtung (5-30, default: 10)

// Guided Filter Parameter:
- r: Radius (2-16, default: 4)
- eps: Regularisierung (10^-6 bis 10^-2, default: 10^-3)
```

---

## 3. ICC-Profil-Upload mit D50 (Bradford) Umschaltung

### Was ist neu?
- **ICC-Parser**: Extrahiert `wtpt` (Weißpunkt) und RGB-Colorant-XYZ aus ICC-Profilen
- **D50/D65 Umschaltung**: Bradford-Adaptation für korrekte Farbumrechnung
- **Automatische Whitepoint-Erkennung**: Nutzt ICC-Weißpunkt falls vorhanden

### Vorteile gegenüber aktueller Implementierung:
- **Aktuell**: Nur D65/D50 Toggle, kein ICC-Support
- **Neu**: Bildspezifische Farbkorrektur basierend auf Kamera/Display-Profil
- **Ergebnis**: Präzisere Lab-Werte, bessere Farbwiedergabe

### Technische Details:
```typescript
// ICC Parser (minimal):
- Extrahiert: wtpt, rXYZ, gXYZ, bXYZ
- Bradford-Adaptation für D65 ↔ D50

// Whitepoint-Priorität:
1. ICC wtpt (falls vorhanden)
2. D50 (falls aktiviert)
3. D65 (Standard)
```

---

## 4. Borderline-Erkennung (Grenzfarb-Analyse)

### Was ist neu?
- **Circular Statistics**: Hue-Statistik mit zirkulärer Mittelwert-Berechnung
- **Soft Category Classification**: Wahrscheinlichkeitsbasierte Farbkategorisierung
- **Borderline-Detection**: Erkennt Grenzfarben zwischen Kategorien (z.B. Gelbgrün/Grün)
- **Peak-Separation**: Analysiert Hue-Histogramm auf Mehrfach-Peaks

### Vorteile gegenüber aktueller Implementierung:
- **Aktuell**: Keine explizite Grenzfarb-Erkennung
- **Neu**: Identifiziert mehrdeutige Farben, zeigt Primär- und Sekundärkategorie
- **Ergebnis**: Präzisere Farbbeschreibung, besonders bei Übergangsfarben

### Technische Details:
```typescript
// Circular Statistics:
- Hue-Mittelwert (zirkulär)
- R (Kompaktheit): 0-1, höher = kompakter
- circVar: 1-R (Streuung)

// Soft Categories:
- 11 Kategorien: Gelb, Gelbgrün, Grün, Blaugrün, Blau, Blauviolett, Violett, Rotviolett, Rot, Rotorange, Orange
- KonfidenzΔ: Differenz zwischen Primär- und Sekundärkategorie
- Borderline: conf < 0.15

// Peak-Separation:
- Analysiert Hue-Histogramm auf Peaks
- sepDeg: Abstand zwischen Peaks (6-40°)
```

---

## 5. JSON / CSV / PDF Export des Borderline-Reports

### Was ist neu?
- **JSON Export**: Vollständige Analyse-Daten strukturiert
- **CSV Export**: Kompakte Zusammenfassung für Tabellenkalkulation
- **PDF Export**: Professioneller Report mit Visualisierungen (jsPDF)

### Vorteile gegenüber aktueller Implementierung:
- **Aktuell**: Kein strukturierter Export
- **Neu**: Mehrere Exportformate für verschiedene Anwendungsfälle
- **Ergebnis**: Bessere Dokumentation und Nachverfolgbarkeit

### Export-Inhalte:
- **JSON**: Alle Analyse-Daten, Parameter, Statistiken
- **CSV**: k, HSV/Lab-Mittelwerte, ΔE, Kategorien, Top-3-Cluster
- **PDF**: Visueller Report mit Farben, Statistiken, Histogrammen, Parametern

---

## 6. Batch-API für mehrere Bilder

### Was ist neu?
- **POST `/api/analyze/batch`**: Verarbeitet mehrere Bilder gleichzeitig
- **ZIP-Export**: Enthält JSON pro Datei, PNG-Previews, summary.csv
- **Effiziente Verarbeitung**: Wiederverwendung der Analyse-Logik

### Vorteile gegenüber aktueller Implementierung:
- **Aktuell**: Nur Einzelbild-Analyse
- **Neu**: Batch-Verarbeitung für Serienanalysen
- **Ergebnis**: Zeitersparnis bei mehreren Bildern

---

## Vergleich: Aktuell vs. Neu

| Feature | Aktuell | Neu (v4) |
|---------|---------|----------|
| **Clustering** | K-Means (manuell) | K-Means++ mit Auto-K (GMM+BIC) |
| **Maskierung** | Pixelweise | SLIC + Guided Filter |
| **ICC-Support** | ❌ | ✅ (wtpt, rXYZ/gXYZ/bXYZ) |
| **Whitepoint** | D65/D50 Toggle | D65/D50 + ICC-Auto |
| **Borderline-Erkennung** | ❌ | ✅ (Circular Stats + Soft Categories) |
| **Export** | ❌ | ✅ (JSON/CSV/PDF) |
| **Batch-API** | ❌ | ✅ (ZIP mit Previews) |
| **Hue-Analyse** | Basis | Circular Statistics + Peak-Detection |
| **Kategorisierung** | Fest | Soft Categories mit Konfidenz |

---

## Technische Verbesserungen im Detail

### 1. K-Means++ Initialisierung
```typescript
// Bessere Startpunkte = bessere Cluster
function kmeansPlusPlusInit(points, k) {
  // 1. Zufälliger Startpunkt
  // 2. Weitere Punkte basierend auf größter Distanz zu bestehenden Zentroiden
  // → Vermeidet schlechte lokale Minima
}
```

### 2. GMM + BIC für Auto-K
```typescript
// Testet K=3 bis K=8
// Berechnet BIC für jedes K
// Wählt K mit niedrigstem BIC (beste Balance Modellkomplexität vs. Fit)
```

### 3. SLIC Superpixels
```typescript
// Segmentiert Bild in homogene Regionen
// Kombiniert Farb- und Raum-Information
// → Bessere Kantenerkennung als pixelweise Maskierung
```

### 4. Guided Filter
```typescript
// Glättet Maske basierend auf Bildintensität
// Erhält Kanten, entfernt Rauschen
// → Glattere, präzisere Masken
```

### 5. Circular Hue Statistics
```typescript
// Hue ist zirkulär (0° = 360°)
// Standard-Mittelwert funktioniert nicht
// → Zirkulärer Mittelwert via Vektor-Summe
```

### 6. Soft Category Classification
```typescript
// Jede Kategorie hat Center + Width
// Berechnet Wahrscheinlichkeit für jede Kategorie
// → Konfidenz-basierte Klassifikation
```

---

## Abhängigkeiten

### Neue Dependencies:
- `jspdf`: ^2.5.1 (PDF-Export)
- `jszip`: ^3.10.1 (Batch-ZIP)
- `sharp`: ^0.33.4 (bereits vorhanden)

### Keine Breaking Changes:
- Alle neuen Features sind optional
- Bestehende Funktionalität bleibt erhalten
- Abwärtskompatibel

---

## Performance-Überlegungen

### Client-seitig:
- **GMM+BIC**: Kann bei großen Bildern langsam sein (testet K=3-8)
- **SLIC**: 5 Iterationen, O(n) pro Iteration
- **Guided Filter**: Integral-Image-basiert, effizient

### Server-seitig:
- **Sharp**: Effiziente Bildverarbeitung
- **Batch-API**: Sequenzielle Verarbeitung (kann parallelisiert werden)

### Optimierungen:
- **Decimation**: a*/b* Samples auf 2000 reduziert für Visualisierung
- **Scale-Limit**: Standard 512px (konfigurierbar)

---

## UI/UX Verbesserungen

### Neue UI-Elemente:
1. **SLIC/Guided Filter Parameter-Slider**
2. **ICC-Upload Button**
3. **Borderline-Badge** (visuelle Hervorhebung)
4. **Export-Buttons** (PDF/JSON/CSV)
5. **Hue-Histogramm** (360° Visualisierung)
6. **a*/b* Scatter Plot** (Lab-Farbraum)

### Verbesserte Darstellung:
- **Cluster-Anteile**: Balkendiagramm
- **Borderline-Status**: Farbcodiert (Amber = Borderline, Emerald = Klar)
- **Parameter-Block**: Vollständige Dokumentation aller Einstellungen

---

## Fazit

Die v4-Version bietet **deutliche Verbesserungen** in:
1. **Präzision**: Auto-K, SLIC, Guided Filter
2. **Farbkorrektur**: ICC-Support, Bradford-Adaptation
3. **Analyse-Tiefe**: Borderline-Erkennung, Circular Statistics
4. **Dokumentation**: Strukturierte Exports
5. **Effizienz**: Batch-Verarbeitung

**Empfehlung**: Integration in die bestehende Implementierung für professionellere Ergebnisse.

