# ICC-Profile und Whitepoint-Verwendung - Erklärung

## Was sind ICC-Profile?

ICC-Profile (International Color Consortium Profile) sind Dateien, die Farbraum-Informationen enthalten. Sie beschreiben:
- **Weißpunkt (wtpt)**: Die Farbe von "Weiß" unter bestimmten Beleuchtungsbedingungen
- **RGB-Colorants**: Die spektralen Eigenschaften der Rot-, Grün- und Blau-Primärfarben
- **Farbraum-Transformationen**: Wie Farben zwischen verschiedenen Geräten/Profilen konvertiert werden

## Warum sind ICC-Profile wichtig für die Farbanalyse?

### Problem ohne ICC-Profil:
- Bilder werden standardmäßig als **sRGB** (D65 Weißpunkt) interpretiert
- D65 = Tageslicht bei 6500K Farbtemperatur
- Wenn ein Bild aber unter anderem Licht aufgenommen wurde (z.B. D50 = 5000K), sind die Farben nicht korrekt

### Lösung mit ICC-Profil:
- Das ICC-Profil enthält den **tatsächlichen Weißpunkt** des Bildes
- Die Farbwerte werden von D65 zum ICC-Weißpunkt **adaptiert** (Bradford-Transformation)
- Resultat: **Präzisere Farbanalyse**, besonders bei professionellen Aufnahmen

## Wie funktioniert die Whitepoint-Adaptation?

### Bradford Chromatic Adaptation:
1. **Ausgangssituation**: RGB-Werte sind D65-basiert (sRGB Standard)
2. **Ziel**: Konvertierung zum ICC-Weißpunkt
3. **Prozess**:
   - RGB → XYZ (D65)
   - XYZ (D65) → XYZ (ICC-Weißpunkt) via Bradford-Transformation
   - XYZ (ICC) → Lab (mit ICC-Weißpunkt als Referenz)

### Beispiel:
```
Standard (ohne ICC):
RGB → XYZ (D65) → Lab (D65 Referenz)
Ergebnis: Farben können leicht verschoben sein

Mit ICC-Profil:
RGB → XYZ (D65) → XYZ (ICC wtpt) → Lab (ICC wtpt Referenz)
Ergebnis: Farben sind präzise an den tatsächlichen Weißpunkt angepasst
```

## Implementierung im Code

### 1. ICC-Profil Parsing (`iccParser.ts`):
- Liest `.icc` oder `.icm` Dateien
- Extrahiert `wtpt` (Weißpunkt XYZ-Werte)
- Extrahiert `rXYZ`, `gXYZ`, `bXYZ` (RGB-Colorants)

### 2. Whitepoint-Verwendung (`enhancedColorExtraction.ts`):
```typescript
// Priorität: ICC > D50/D65 Toggle
if (iccProfile?.wtpt) {
  effectiveWP = iccProfile.wtpt;  // Verwende ICC-Weißpunkt
} else {
  effectiveWP = getWhitepointXYZ(whitepoint);  // Verwende D65 oder D50
}
```

### 3. Farbkonvertierung (`colorConversions.ts`):
```typescript
xyzToLab(xyz, whitepoint, customWP)
// customWP = ICC-Weißpunkt, wenn vorhanden
// → Bradford-Adaptation von D65 zu customWP
// → Lab-Berechnung mit customWP als Referenz
```

## Praktische Anwendung

### Wann ICC-Profile verwenden?
- ✅ Professionelle Fotografie mit Farbraum-Profilen
- ✅ RAW-Bilder mit eingebetteten ICC-Profilen
- ✅ Druckvorstufe (oft D50)
- ✅ Spezielle Beleuchtungssituationen

### Wann Standard (D65/D50) verwenden?
- ✅ Standard-Web-Bilder (meist sRGB/D65)
- ✅ Smartphone-Fotos (meist sRGB/D65)
- ✅ Kein ICC-Profil verfügbar

## Test-Szenarien

1. **Ohne ICC-Profil**: Standard D65/D50 Verhalten
2. **Mit ICC-Profil (D50)**: Whitepoint sollte von D65 zu D50 adaptiert werden
3. **Mit ICC-Profil (Custom)**: Whitepoint sollte zum Custom-Wert adaptiert werden
4. **Fehlerhafte ICC-Datei**: Sollte graceful fehlschlagen

