# ICC Profile Parser Implementation

## Übersicht

Diese Datei enthält einen minimalen ICC-Profil-Parser, der essentielle Farbinformationen aus ICC-Farbprofilen extrahiert:
- **wtpt**: Weißpunkt (Illuminant)
- **rXYZ, gXYZ, bXYZ**: RGB-Colorant XYZ-Werte

Dies ist ein minimaler Parser, der nur die wichtigsten Tags für Farbkorrektur extrahiert. Vollständige ICC-Profil-Parsing (LUTs, VCGT, etc.) ist nicht implementiert.

## Hauptfunktionen

### `parseICC(buf)`

Parst ein ICC-Farbprofil und extrahiert Weißpunkt und RGB-Colorant XYZ-Werte.

**Parameter:**
- `buf: Uint8Array` - ICC-Profil-Daten

**Rückgabe:** `ICCProfile` mit:
- `wtpt: [X, Y, Z] | null` - Weißpunkt XYZ
- `rXYZ, gXYZ, bXYZ: [X, Y, Z] | null` - RGB-Colorant XYZ-Werte

**ICC-Profil-Struktur:**
- Header (128 Bytes)
- Tag-Count (4 Bytes)
- Tag-Tabelle (12 Bytes pro Tag)
  - Tag-Signatur (4 Bytes)
  - Tag-Offset (4 Bytes)
  - Tag-Größe (4 Bytes)
- Tag-Daten

### `parseICCFromFile(file)`

Parst ein ICC-Profil aus einer File-Instanz.

**Parameter:**
- `file: File` - File-Objekt mit ICC-Profil (.icc oder .icm)

**Rückgabe:** Promise, das zu geparstem ICC-Profil auflöst

### `isICCProfile(file)`

Prüft, ob eine Datei wahrscheinlich ein ICC-Profil ist.

**Parameter:**
- `file: File` - File-Objekt

**Rückgabe:** `true` wenn Datei .icc oder .icm Endung hat

## ICC-Profil-Format

### s15Fixed16 Format

ICC verwendet s15Fixed16 Format für XYZ-Werte:
- 16 Bit Integer-Teil
- 16 Bit Fraktional-Teil
- Konvertierung: `value = (n >> 16) + ((n & 0xFFFF) / 65536)`

### XYZ Tag Format

```
- Type signature: 4 bytes ('XYZ ')
- Reserved: 4 bytes
- XYZ values: 12 bytes each (s15Fixed16 format)
  - X: 4 bytes
  - Y: 4 bytes
  - Z: 4 bytes
```

## Verwendung

```typescript
import { parseICCFromFile, parseICC, isICCProfile } from './iccParser';
import { bradfordAdaptXYZ, getWhitepointXYZ } from './colorConversions';

// Aus File-Objekt
const file = event.target.files[0];
if (isICCProfile(file)) {
  const profile = await parseICCFromFile(file);
  
  if (profile.wtpt) {
    // Verwende ICC-Weißpunkt für Farbkonvertierung
    const [X, Y, Z] = profile.wtpt;
    // ... in Lab-Konvertierung verwenden
  }
}

// Aus Uint8Array
const arrayBuffer = await file.arrayBuffer();
const buf = new Uint8Array(arrayBuffer);
const profile = parseICC(buf);
```

## Integration in Analyse-Pipeline

1. **ICC-Upload**: Benutzer lädt ICC-Profil hoch
2. **Parsing**: `parseICC()` extrahiert Weißpunkt
3. **Farbkorrektur**: ICC-Weißpunkt wird in `xyzToLab()` verwendet
4. **Fallback**: Wenn kein ICC-Profil vorhanden, wird D65/D50 verwendet

## Unterstützte Tags

- **wtpt**: White point (Weißpunkt)
- **rXYZ**: Red colorant XYZ
- **gXYZ**: Green colorant XYZ
- **bXYZ**: Blue colorant XYZ

## Nicht unterstützt

- LUTs (Look-Up Tables)
- VCGT (Video Card Gamma Table)
- Andere komplexe Tag-Typen

## Limitationen

- **Minimaler Parser**: Nur XYZ-Tags werden unterstützt
- **Keine Validierung**: Keine vollständige ICC-Profil-Validierung
- **Keine LUTs**: Komplexe Farbtransformationen werden nicht unterstützt

## Nächste Schritte

Diese Implementierung wird in Phase 6 in die UI integriert, um ICC-Profile hochzuladen und für Farbkorrektur zu verwenden.

