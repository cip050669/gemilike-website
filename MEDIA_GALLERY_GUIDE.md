# Mediengalerie für Edelsteine - Vollständiger Leitfaden

**Version:** 1.1.0  
**Datum:** 02. Oktober 2025  
**Status:** ✅ Vollständig implementiert

---

## 🎯 Übersicht

Die Mediengalerie ist eine vollständig integrierte Lösung für die Darstellung von Edelsteinen im Shop. Sie unterstützt bis zu **10 Fotos** und **2 Videos** pro Edelstein mit einer interaktiven, responsiven Benutzeroberfläche.

### ✨ Hauptfunktionen

- **📸 Multi-Bild-Support:** Bis zu 10 hochauflösende Fotos pro Edelstein
- **🎥 Video-Integration:** Bis zu 2 MP4-Videos mit Player-Kontrollen
- **🖼️ Thumbnail-Navigation:** Kompakte Vorschaubilder für schnelle Navigation
- **🔍 Zoom-Funktion:** Vollbild-Ansicht für Detailbetrachtung
- **📱 Responsive Design:** Optimiert für Desktop, Tablet und Mobile
- **⚡ Performance:** Optimierte Ladezeiten mit Next.js Image
- **🎨 Moderne UI:** Smooth Animationen und Hover-Effekte

---

## 🏗️ Architektur

### Komponenten-Struktur

```
components/shop/
├── MediaGallery.tsx     # Hauptgalerie-Komponente
└── GemstoneCard.tsx     # Produktkarte mit integrierter Galerie
```

### Datenmodell

```
lib/
├── types/
│   └── gemstone.ts      # TypeScript-Interfaces
└── data/
    └── gemstones.ts     # Edelstein-Daten
```

---

## 🔧 Technische Implementierung

### MediaGallery Komponente

```typescript
interface MediaGalleryProps {
  images: string[];        // Array von Bildpfaden
  videos?: string[];       // Optional: Array von Video-URLs
  gemName: string;         // Name für Alt-Tags
  className?: string;      // CSS-Klassen
}
```

### Edelstein-Datenstruktur

```typescript
interface BaseGemstone {
  id: string;
  name: string;
  // ... andere Eigenschaften
  
  // Media-Eigenschaften
  images: string[];        // Bis zu 10 Bildpfade
  mainImage: string;       // Hauptbild (erstes Bild)
  videos?: string[];       // Bis zu 2 Video-URLs
}
```

---

## 📁 Medien-Verwaltung

### Dateistruktur

```
public/products/
├── emerald-001-1.jpg    # Hauptbild
├── emerald-001-2.jpg    # Zusatzbilder
├── emerald-001-3.jpg
├── emerald-001-4.jpg
├── emerald-001-5.jpg
├── emerald-001-video-1.mp4  # Erstes Video
├── emerald-001-video-2.mp4  # Zweites Video
├── ruby-002-1.jpg
├── ruby-002-2.jpg
└── ...
```

### Namenskonvention

**Bilder:**
- Format: `{gemstone-id}-{nummer}.jpg`
- Beispiel: `emerald-001-1.jpg`, `emerald-001-2.jpg`

**Videos:**
- Format: `{gemstone-id}-video-{nummer}.mp4`
- Beispiel: `emerald-001-video-1.mp4`, `emerald-001-video-2.mp4`

### Empfohlene Spezifikationen

**Bilder:**
- **Auflösung:** 800x800px (quadratisch)
- **Format:** JPG (komprimiert) oder PNG (verlustfrei)
- **Dateigröße:** < 500KB pro Bild
- **Qualität:** 85-90% JPEG-Qualität

**Videos:**
- **Format:** MP4 (H.264 Codec)
- **Auflösung:** 720p oder 1080p
- **Dateigröße:** < 10MB pro Video
- **Länge:** 30-60 Sekunden empfohlen

---

## 🎨 Benutzeroberfläche

### Hauptgalerie

- **Aspect Ratio:** 1:1 (quadratisch)
- **Hintergrund:** Weiß für optimale Edelstein-Darstellung
- **Hover-Effekt:** `object-cover` → `object-contain` Transition
- **Navigation:** Pfeil-Buttons links/rechts
- **Zähler:** "1 / 5" Anzeige unten links

### Thumbnail-Leiste

- **Größe:** 64x64px pro Thumbnail
- **Layout:** Horizontale Scrollbar bei vielen Bildern
- **Aktiv-Status:** Primärfarbe-Rahmen + Skalierung (110%)
- **Hover:** Leichte Skalierung (105%)
- **Video-Indikator:** Play-Button-Overlay

### Video-Player

- **Poster:** Erstes Bild als Vorschau
- **Kontrollen:** Erscheinen beim Klick auf Play
- **Overlay:** Play-Button vor dem Start
- **Hintergrund:** Schwarz für Videos

---

## 💻 Code-Beispiele

### Edelstein mit Medien definieren

```typescript
// lib/data/gemstones.ts
export const cutGemstones: CutGemstone[] = [
  {
    id: 'cut-001',
    name: 'Kolumbianischer Smaragd',
    type: 'cut',
    description: 'Wunderschöner kolumbianischer Smaragd...',
    price: 4500.00,
    currency: 'EUR',
    
    // Bildergalerie (bis zu 10)
    images: [
      '/products/emerald-001-1.jpg',
      '/products/emerald-001-2.jpg',
      '/products/emerald-001-3.jpg',
      '/products/emerald-001-4.jpg',
      '/products/emerald-001-5.jpg',
    ],
    mainImage: '/products/emerald-001-1.jpg',
    
    // Videos (bis zu 2) - optional
    videos: [
      '/products/emerald-001-video-1.mp4',
      '/products/emerald-001-video-2.mp4',
    ],
    
    // ... weitere Eigenschaften
    origin: 'Kolumbien',
    caratWeight: 2.45,
    // ...
  }
];
```

### Galerie in Komponente verwenden

```tsx
// components/shop/GemstoneCard.tsx
import { MediaGallery } from './MediaGallery';

export function GemstoneCard({ gemstone }: { gemstone: Gemstone }) {
  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <div className="relative -mx-4 -mt-4 mb-4">
          <MediaGallery
            images={gemstone.images}
            videos={gemstone.videos}
            gemName={gemstone.name}
            className="rounded-t-lg"
          />
        </div>
      </CardHeader>
      {/* ... Rest der Karte */}
    </Card>
  );
}
```

---

## 🎯 Features im Detail

### 1. Bild-Navigation

**Thumbnail-Klick:**
```typescript
const selectMedia = (index: number) => {
  setSelectedIndex(index);
  setIsVideoPlaying(null); // Video stoppen beim Bildwechsel
};
```

**Pfeil-Navigation:**
```typescript
const nextMedia = () => {
  setSelectedIndex((prev) => (prev + 1) % allMedia.length);
  setIsVideoPlaying(null);
};
```

### 2. Zoom-Funktion

**Dialog-Integration:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button size="sm" variant="secondary">
      <ZoomIn className="h-4 w-4" />
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-4xl max-h-[90vh] p-0">
    <DialogTitle className="sr-only">
      Vergrößerte Ansicht von {gemName}
    </DialogTitle>
    <Image
      src={currentMedia.src}
      alt={`${gemName} - Vergrößert`}
      width={1200}
      height={1200}
      className="w-full h-auto max-h-[80vh] object-contain"
    />
  </DialogContent>
</Dialog>
```

### 3. Video-Handling

**Video-State-Management:**
```typescript
const [isVideoPlaying, setIsVideoPlaying] = useState<number | null>(null);

// Video-Player-Kontrollen
<video
  controls={isVideoPlaying === selectedIndex}
  onPlay={() => setIsVideoPlaying(selectedIndex)}
  onPause={() => setIsVideoPlaying(null)}
>
  <source src={currentMedia.src} type="video/mp4" />
</video>
```

### 4. Responsive Verhalten

**Breakpoint-Anpassungen:**
```css
/* Thumbnails */
.thumbnail-container {
  @apply flex gap-2 overflow-x-auto pb-2 px-1;
}

/* Mobile Optimierung */
@media (max-width: 768px) {
  .thumbnail {
    @apply w-12 h-12; /* Kleinere Thumbnails auf Mobile */
  }
}
```

---

## 🚀 Performance-Optimierungen

### Next.js Image Optimierung

```tsx
<Image
  src={media.src}
  alt={`${gemName} - Bild ${index + 1}`}
  fill
  className="object-cover hover:object-contain transition-all duration-300"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={selectedIndex === 0} // Erstes Bild priorisieren
/>
```

### Lazy Loading

- **Thumbnails:** Automatisches Lazy Loading durch Next.js
- **Videos:** Laden erst beim Klick auf Play
- **Zoom-Bilder:** Laden erst beim Öffnen des Dialogs

### Bundle Size Optimierung

- **Icons:** Nur verwendete Lucide-Icons importiert
- **Komponenten:** Tree-shaking durch ES6 Modules
- **CSS:** Tailwind CSS purging ungenutzter Klassen

---

## 🔧 Anpassung & Erweiterung

### Styling anpassen

**Farben ändern:**
```css
/* globals.css oder Tailwind-Konfiguration */
:root {
  --primary: 222.2 47.4% 11.2%;  /* Thumbnail-Rahmen aktiv */
  --muted: 210 40% 96%;           /* Hintergrund */
}
```

**Größen anpassen:**
```tsx
// MediaGallery.tsx
const THUMBNAIL_SIZE = 64; // px
const GALLERY_ASPECT_RATIO = "aspect-square"; // oder aspect-video
```

### Mehr Medien unterstützen

**Erweiterte Limits:**
```typescript
// lib/types/gemstone.ts
interface BaseGemstone {
  images: string[];      // Limit auf 15 erhöhen
  videos?: string[];     // Limit auf 3 erhöhen
  audio?: string[];      // Neue Medienart hinzufügen
}
```

### Neue Features hinzufügen

**Beispiel: 360°-Ansicht:**
```typescript
interface MediaGalleryProps {
  images: string[];
  videos?: string[];
  panorama?: string;     // 360°-Bild
  gemName: string;
  className?: string;
}
```

---

## 🐛 Troubleshooting

### Häufige Probleme

**1. Bilder werden nicht geladen (404)**
```bash
# Prüfen ob Dateien existieren
ls -la public/products/

# Server neu starten
npm run dev
```

**2. Videos spielen nicht ab**
- Format prüfen: Nur MP4 unterstützt
- Codec prüfen: H.264 empfohlen
- Dateigröße prüfen: < 10MB

**3. Thumbnails zu klein/groß**
```tsx
// MediaGallery.tsx anpassen
className="w-16 h-16" // Standard: 64px
className="w-20 h-20" // Größer: 80px
className="w-12 h-12" // Kleiner: 48px
```

**4. Performance-Probleme**
- Bildgrößen reduzieren (< 500KB)
- WebP-Format verwenden
- Lazy Loading prüfen

### Debug-Modus

```tsx
// Temporär für Debugging
console.log('Current media:', currentMedia);
console.log('All media:', allMedia);
console.log('Selected index:', selectedIndex);
```

---

## 📊 Browser-Kompatibilität

### Unterstützte Browser

- ✅ **Chrome/Edge:** 88+ (Vollständig)
- ✅ **Firefox:** 85+ (Vollständig)
- ✅ **Safari:** 14+ (Vollständig)
- ✅ **Mobile Safari:** iOS 14+ (Vollständig)
- ✅ **Chrome Mobile:** Android 8+ (Vollständig)

### Fallbacks

- **Ältere Browser:** Grundfunktionalität ohne Animationen
- **JavaScript deaktiviert:** Erstes Bild wird angezeigt
- **Langsame Verbindung:** Progressive Bildladung

---

## 📈 Metriken & Analytics

### Performance-Ziele

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3.5s

### Monitoring

```javascript
// Performance-Tracking (optional)
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
    }
  });
});
observer.observe({ entryTypes: ['largest-contentful-paint'] });
```

---

## 🚀 Deployment-Hinweise

### Produktionsumgebung

**Bildoptimierung:**
```bash
# Bilder vor Upload komprimieren
imagemin public/products/*.jpg --out-dir=public/products/optimized/
```

**CDN-Integration:**
```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['cdn.gemilike.de'], // Externe Bild-CDN
  },
};
```

### SEO-Optimierung

**Alt-Tags:**
```tsx
<Image
  src={media.src}
  alt={`${gemName} - Detailansicht ${index + 1} von ${totalImages}`}
  // ...
/>
```

**Strukturierte Daten:**
```json
{
  "@type": "Product",
  "image": [
    "https://gemilike.de/products/emerald-001-1.jpg",
    "https://gemilike.de/products/emerald-001-2.jpg"
  ],
  "video": {
    "@type": "VideoObject",
    "contentUrl": "https://gemilike.de/products/emerald-001-video-1.mp4"
  }
}
```

---

## 📚 Weitere Ressourcen

### Dokumentation

- [Next.js Image Component](https://nextjs.org/docs/api-reference/next/image)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs)

### Tools

- **Bildoptimierung:** [ImageOptim](https://imageoptim.com/), [TinyPNG](https://tinypng.com/)
- **Video-Komprimierung:** [HandBrake](https://handbrake.fr/), [FFmpeg](https://ffmpeg.org/)
- **Performance-Testing:** [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Erstellt:** 02. Oktober 2025  
**Autor:** Cascade AI  
**Version:** 1.1.0  
**Letzte Aktualisierung:** 02.10.2025 20:10 Uhr

