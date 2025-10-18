# 💎 Edelstein-Daten Verwaltung

## Übersicht

Ihre Website verwendet ein umfassendes Datenmodell für Edelsteine mit allen wichtigen Informationen für den professionellen Handel.

---

## 📁 Dateistruktur

```
lib/
├── types/
│   └── gemstone.ts          # TypeScript Typen und Interfaces
└── data/
    └── gemstones.ts         # Ihre Edelstein-Daten

components/
└── shop/
    └── GemstoneCard.tsx     # Produkt-Karte Komponente

app/[locale]/shop/
└── page.tsx                 # Shop-Seite
```

---

## 🔧 Datenmodell

### Für GESCHLIFFENE Steine (`CutGemstone`):

```typescript
{
  id: 'cut-001',
  name: 'Kolumbianischer Smaragd',
  type: 'cut',                    // 'cut' für geschliffene Steine
  
  // Basis-Informationen
  description: '...',
  price: 4500.00,
  currency: 'EUR',
  
  // Bilder & Videos (NEU: Mediengalerie)
  images: ['/products/emerald-001-1.jpg', ...],  // Bis zu 10 Bilder
  mainImage: '/products/emerald-001-1.jpg',
  videos: ['/products/emerald-001-video-1.mp4'], // Bis zu 2 Videos (optional)
  
  // Herkunft
  origin: 'Kolumbien',
  mineLocation: 'Muzo',          // Optional
  
  // Abmessungen in mm
  dimensions: {
    length: 8.5,
    width: 6.2,
    height: 4.8,
  },
  
  // GESCHLIFFENE STEINE: Gewicht in Karat
  caratWeight: 2.45,
  
  // Schliff
  cut: 'Smaragdschliff',
  cutQuality: 'Excellent',       // Excellent | Very Good | Good | Fair | Poor
  
  // Reinheit
  clarity: 'VS1',
  clarityGrade: 'Sehr gute Reinheit...',
  
  // Farbe
  colorIntensity: 'Vivid',       // Vivid | Intense | Light
  
  // Symmetrie & Politur
  symmetry: 'Excellent',
  polish: 'Excellent',
  
  // Behandlung
  treatment: {
    treated: true,
    type: 'oiled',               // none | heated | oiled | irradiated | etc.
    description: 'Traditionelle Ölung',
  },
  
  // Zertifizierung
  certification: {
    certified: true,
    lab: 'GIA',                  // GIA | IGI | Gübelin | etc.
    certificateNumber: 'GIA-2024-12345',
    certificateUrl: '/certificates/gia-2024-12345.pdf',
  },
  
  // Verfügbarkeit
  inStock: true,
  quantity: 1,
  
  // Kategorisierung
  category: 'Smaragd',
  color: 'Grün',
}
```

### Für ROHSTEINE (`RoughGemstone`):

```typescript
{
  id: 'rough-001',
  name: 'Rohsmaragd Kristall',
  type: 'rough',                 // 'rough' für Rohsteine
  
  // Basis-Informationen (wie oben)
  description: '...',
  price: 1200.00,
  // ... (images, origin, dimensions wie oben)
  
  // ROHSTEINE: Gewicht in Gramm
  gramWeight: 24.5,
  
  // Rohstein-spezifische Eigenschaften
  crystalQuality: 'Very Good',
  transparency: 'Translucent',   // Transparent | Translucent | Opaque
  
  // Potenzial (optional)
  estimatedCaratYield: 8.5,
  suitableFor: ['Schmuck', 'Sammlung'],
  
  // treatment, certification, etc. wie oben
}
```

---

## ➕ Neue Edelsteine hinzufügen

### 1. Bilder vorbereiten

Legen Sie Ihre Produktbilder in `/public/products/` ab:

```bash
public/
└── products/
    ├── emerald-001-1.jpg
    ├── emerald-001-2.jpg
    ├── ruby-002-1.jpg
    └── ...
```

**Empfohlene Bildgröße:** 1200x1200px (quadratisch)

### 2. Daten in `lib/data/gemstones.ts` eintragen

#### Für einen geschliffenen Stein:

```typescript
export const cutGemstones: CutGemstone[] = [
  // ... bestehende Steine
  {
    id: 'cut-004',  // Eindeutige ID
    name: 'Ihr Edelstein Name',
    type: 'cut',
    description: 'Detaillierte Beschreibung...',
    price: 5000.00,
    currency: 'EUR',
    
    // Mediengalerie: Bis zu 10 Bilder + 2 Videos
    images: [
      '/products/ihr-stein-1.jpg',
      '/products/ihr-stein-2.jpg',
      '/products/ihr-stein-3.jpg',
      // ... weitere Bilder
    ],
    mainImage: '/products/ihr-stein-1.jpg',
    videos: [  // Optional
      '/products/ihr-stein-video-1.mp4',
    ],
    
    origin: 'Land',
    mineLocation: 'Mine (optional)',
    
    dimensions: {
      length: 10.0,
      width: 8.0,
      height: 5.0,
    },
    
    caratWeight: 3.50,
    cut: 'Brillantschliff',
    cutQuality: 'Excellent',
    
    clarity: 'VVS1',
    clarityGrade: 'Beschreibung',
    
    colorIntensity: 'Vivid',
    
    symmetry: 'Excellent',
    polish: 'Excellent',
    
    treatment: {
      treated: false,  // oder true mit type und description
    },
    
    certification: {
      certified: true,
      lab: 'GIA',
      certificateNumber: 'GIA-2024-XXXXX',
      certificateUrl: '/certificates/gia-2024-xxxxx.pdf',
    },
    
    inStock: true,
    quantity: 1,
    category: 'Smaragd',  // oder Rubin, Saphir, etc.
    color: 'Grün',
    
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
```

#### Für einen Rohstein:

```typescript
export const roughGemstones: RoughGemstone[] = [
  // ... bestehende Steine
  {
    id: 'rough-003',
    name: 'Ihr Rohstein Name',
    type: 'rough',
    description: 'Beschreibung...',
    price: 800.00,
    currency: 'EUR',
    
    // Mediengalerie: Bis zu 10 Bilder + 2 Videos
    images: [
      '/products/ihr-rohstein-1.jpg',
      '/products/ihr-rohstein-2.jpg',
      // ... weitere Bilder
    ],
    mainImage: '/products/ihr-rohstein-1.jpg',
    videos: [  // Optional
      '/products/ihr-rohstein-video-1.mp4',
    ],
    
    origin: 'Land',
    
    dimensions: {
      length: 25.0,
      width: 15.0,
      height: 10.0,
    },
    
    gramWeight: 45.0,  // Gewicht in Gramm!
    
    crystalQuality: 'Excellent',
    transparency: 'Transparent',
    
    estimatedCaratYield: 15.0,  // Optional
    suitableFor: ['Schmuck', 'Sammlung'],
    
    treatment: {
      treated: false,
    },
    
    certification: {
      certified: false,
    },
    
    inStock: true,
    quantity: 1,
    category: 'Aquamarin',
    color: 'Blau',
    
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
```

---

## 📋 Wichtige Felder erklärt

### Behandlung (Treatment)

**Häufige Behandlungstypen:**
- `'none'` - Unbehandelt (sehr wertvoll!)
- `'heated'` - Thermisch behandelt (Standard bei Saphiren, Rubinen)
- `'oiled'` - Geölt (Standard bei Smaragden)
- `'irradiated'` - Bestrahlt (bei manchen Farbsteinen)
- `'diffused'` - Diffusionsbehandlung
- `'filled'` - Gefüllt (z.B. Glasfüllung)

### Zertifizierungs-Labore

**Anerkannte Labore:**
- `'GIA'` - Gemological Institute of America (weltweit führend)
- `'IGI'` - International Gemological Institute
- `'Gübelin'` - Gübelin Gem Lab (Schweiz, sehr renommiert)
- `'GRS'` - Gem Research Swisslab
- `'SSEF'` - Swiss Gemmological Institute
- `'HRD'` - HRD Antwerp
- `'AGS'` - American Gem Society

### Reinheitsgrade (Clarity)

**Für Diamanten:**
- `IF` - Internally Flawless
- `VVS1, VVS2` - Very Very Slightly Included
- `VS1, VS2` - Very Slightly Included
- `SI1, SI2` - Slightly Included
- `I1, I2, I3` - Included

**Für Farbedelsteine:**
Oft weniger streng, beschreibend (z.B. "Eye Clean", "Minor Inclusions")

---

## 🖼️ Bilder hochladen

### Empfohlene Bildspezifikationen:

- **Format:** JPG oder PNG
- **Größe:** 1200x1200px (quadratisch)
- **Auflösung:** 72-150 DPI
- **Dateigröße:** < 500 KB (für schnelle Ladezeiten)
- **Hintergrund:** Weiß oder neutral

### Mehrere Bilder und Videos pro Stein (Mediengalerie):

```typescript
// Bis zu 10 Bilder pro Edelstein
images: [
  '/products/emerald-001-1.jpg',  // Hauptansicht
  '/products/emerald-001-2.jpg',  // Seitenansicht
  '/products/emerald-001-3.jpg',  // Detail/Einschlüsse
  '/products/emerald-001-4.jpg',  // Verschiedene Winkel
  '/products/emerald-001-5.jpg',  // Weitere Details
],
mainImage: '/products/emerald-001-1.jpg',

// Bis zu 2 Videos pro Edelstein (optional)
videos: [
  '/products/emerald-001-video-1.mp4',  // Rotation/Bewegung
  '/products/emerald-001-video-2.mp4',  // Lichtspiel/Brillanz
],
```

### 🎥 Video-Spezifikationen:

- **Format:** MP4 (H.264 Codec)
- **Auflösung:** 720p oder 1080p
- **Dateigröße:** < 10MB pro Video
- **Länge:** 15-60 Sekunden empfohlen
- **Inhalt:** Rotation, Lichtspiel, Brillanz-Demonstration

---

## 📄 Zertifikate

Legen Sie PDF-Zertifikate in `/public/certificates/` ab:

```bash
public/
└── certificates/
    ├── gia-2024-12345.pdf
    ├── gub-2024-67890.pdf
    └── ...
```

Dann in den Daten referenzieren:

```typescript
certification: {
  certified: true,
  lab: 'GIA',
  certificateNumber: 'GIA-2024-12345',
  certificateUrl: '/certificates/gia-2024-12345.pdf',
}
```

---

## 🎨 Mediengalerie-Features (NEU!)

Ihre Website verfügt jetzt über eine vollständig interaktive Mediengalerie:

### ✨ Galerie-Funktionen:
- **📸 Bis zu 10 Fotos** pro Edelstein mit Thumbnail-Navigation
- **🎥 Bis zu 2 Videos** (MP4) mit integriertem Player
- **🔍 Zoom-Funktion** für Detailansicht der Bilder
- **📱 Responsive Design** für alle Geräte optimiert
- **⚡ Performance-optimiert** mit Next.js Image-Komponente
- **🎨 Smooth Animationen** und Hover-Effekte

### 🖱️ Bedienung:
- **Thumbnail-Klick:** Wechsel zwischen Bildern/Videos
- **Pfeiltasten:** Navigation durch die Galerie
- **Zoom-Button:** Vollbild-Ansicht für Bilder
- **Video-Player:** Automatische Kontrollen beim Abspielen

### 📁 Datei-Organisation:
```
public/products/
├── emerald-001-1.jpg        # Hauptbild
├── emerald-001-2.jpg        # Weitere Bilder
├── emerald-001-3.jpg
├── emerald-001-video-1.mp4  # Erstes Video
├── emerald-001-video-2.mp4  # Zweites Video
└── ...
```

---

## 🎨 Anzeige auf der Website

Die `GemstoneCard` Komponente zeigt automatisch:

✅ **Mediengalerie:**
- Interaktive Bildergalerie mit Thumbnails
- Video-Player für MP4-Dateien
- Zoom-Funktion für Detailansicht
- Responsive Navigation

✅ **Badges:**
- "Geschliffen" oder "Rohstein"
- Zertifizierungslabor (wenn vorhanden)
- "Unbehandelt" (wenn nicht behandelt)

✅ **Informationen:**
- Herkunft mit Icon
- Gewicht (ct oder g je nach Typ)
- Abmessungen in mm
- Schliff & Reinheit (bei geschliffenen Steinen)
- Kristallqualität (bei Rohsteinen)
- Behandlungshinweis (wenn behandelt)

✅ **Tabs im Shop:**
- "Alle" - Zeigt alle Edelsteine
- "Geschliffen" - Nur geschliffene Steine
- "Rohsteine" - Nur Rohsteine

---

## 🔄 Später: Datenbank-Integration

Aktuell sind die Daten in `lib/data/gemstones.ts` gespeichert.

**Für größere Bestände empfohlen:**
- **Datenbank:** PostgreSQL, MongoDB, oder Supabase
- **CMS:** Sanity, Contentful, oder Strapi
- **Admin-Panel:** Für einfache Verwaltung

Die TypeScript-Typen bleiben gleich - nur die Datenquelle ändert sich!

---

## 💡 Tipps

1. **Eindeutige IDs:** Verwenden Sie ein konsistentes Schema (z.B. `cut-001`, `rough-001`)
2. **Genaue Angaben:** Je detaillierter, desto vertrauenswürdiger
3. **Qualitätsfotos:** Investieren Sie in gute Produktfotografie
4. **Zertifikate:** Immer angeben, wenn vorhanden - erhöht Vertrauen
5. **Behandlung:** Seien Sie transparent - Ehrlichkeit zahlt sich aus
6. **Aktualisierung:** Halten Sie `inStock` und `quantity` aktuell

---

## 📞 Fragen?

Bei Fragen zur Datenstruktur oder Implementierung:
- Siehe `lib/types/gemstone.ts` für alle verfügbaren Felder
- Siehe `lib/data/gemstones.ts` für Beispiele
- Siehe `components/shop/GemstoneCard.tsx` für die Anzeige-Logik

---

**Viel Erfolg mit Ihrem Edelstein-Shop! 💎**
