# Design-Vorschlag: Farbtafeln-System für Gemilike

## 📋 Zusammenfassung der Analyse

### ✅ 1. Kann der Code im Projekt umgesetzt werden?

**JA, mit folgenden Anpassungen:**

#### ✅ Bereits vorhanden:
- ✅ Next.js 15 + React 19 (kompatibel)
- ✅ Tailwind CSS (bereits konfiguriert)
- ✅ Prisma + PostgreSQL (Datenbank vorhanden)
- ✅ NextAuth (Authentifizierung vorhanden)
- ✅ Admin-Panel-Struktur (besteht)
- ✅ Download-Seite (existiert bereits)

#### ⚠️ Benötigte Abhängigkeiten:
- ❌ `html2canvas` (für Client-seitigen PNG-Export) → **muss installiert werden**
- ❌ `satori` + `@resvg/resvg-js` (für Server-seitigen PNG-Export) → **optional, für bessere Qualität**
- ❌ `@react-pdf/renderer` (für PDF-Export) → **optional, falls PDF gewünscht**

#### ✅ Umsetzbar als reine JavaScript-Funktionen:
- ✅ Farbkonvertierungen (Hex → RGB → XYZ → Lab)
- ✅ CIEDE2000 Delta-E Berechnung
- ✅ JSON Import/Export
- ✅ Gradient-Bars (Canvas API)

### ✅ 2. Funktionen in der Download-Seite möglich?

**JA, vollständig umsetzbar:**
- ✅ Download-Seite existiert bereits (`/app/[locale]/downloads/page.tsx`)
- ✅ DownloadArea-Komponente vorhanden
- ✅ API-Routen für Downloads vorhanden
- ✅ Admin-Authentifizierung vorhanden
- ✅ Prisma für Datenbankzugriff vorhanden

---

## 🎨 Design-Vorschlag: Farbtafeln-System

### 📐 Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Download-Seite)                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  GemILike Signature UI (Farbtafeln-Viewer)             │  │
│  │  - Interaktive Farbkarten                              │  │
│  │  - Pleochroismus-Viewer                                 │  │
│  │  - ΔE2000 Farbvergleich                                  │  │
│  │  - JSON Import/Export                                   │  │
│  │  - PNG/PDF Export                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    API Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ /api/color-  │  │ /api/color-  │  │ /api/color-  │    │
│  │  charts      │  │  charts/     │  │  charts/     │    │
│  │  [GET]       │  │  [id]        │  │  export      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Datenbank (Prisma)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ColorChart Model                                     │  │
│  │  - id, name, origin, slug                             │  │
│  │  - gia: { hue, tone, sat }                            │  │
│  │  - gradient: String[] (Hex-Farben)                    │  │
│  │  - pleochro: String[] (Hex-Farben)                    │  │
│  │  - light: String (z.B. "D55, CRI ≥95")               │  │
│  │  - published, featured, locale                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Admin-Panel                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ColorChart Editor                                    │  │
│  │  - CRUD-Operationen                                   │  │
│  │  - Farbpicker für Gradient & Pleochro                │  │
│  │  - GIA-Daten-Eingabe                                  │  │
│  │  - Vorschau                                            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 1. Datenbankintegration (Prisma Schema)

### Neues Prisma Model: `ColorChart`

```prisma
model ColorChart {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String   // z.B. "Mahenge Spinell"
  origin      String?  // z.B. "Mahenge, Tansania"
  locale      String   @default("de")
  
  // GIA-Daten (als JSON für Flexibilität)
  gia         Json     // { hue: "pkR–R", tone: "3–5", sat: "4–6" }
  
  // Farbdaten
  gradient    String[] // Array von Hex-Farben: ["#FBB7D0", "#F78AB8", ...]
  pleochro    String[] // Array von Pleochroismus-Farben: ["#F78AB8", "#E6579C", ...]
  
  // Lichtstandard
  light       String   @default("D55, CRI ≥95")
  
  // Zusätzliche Informationen
  note        String?  // z.B. "Primär Rosa–Magenta; fluoreszenz-empfänglich."
  description String?  // Längere Beschreibung
  
  // Status & Metadata
  published   Boolean  @default(false)
  featured    Boolean  @default(false)
  order       Int      @default(0) // Sortierreihenfolge
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations (optional)
  createdById String?
  createdBy   User?    @relation(fields: [createdById], references: [id])
  
  @@index([published, locale])
  @@index([featured])
  @@index([slug, locale])
}
```

### Migration

```bash
# Migration erstellen
npx prisma migrate dev --name add_color_charts

# Optional: Seed-Daten aus farbtafeln.txt importieren
```

---

## 🎨 2. Frontend: Download-Seite Design

### Layout-Struktur

```
┌─────────────────────────────────────────────────────────────┐
│  Header (gemilike-website Header)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Hero-Section                                         │   │
│  │  "GemILike Farbtafeln"                                │   │
│  │  "Interaktive Farbkarten mit GIA-konformer            │   │
│  │   Benennung für Edelsteinhandel"                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Filter-Bar (optional)                               │   │
│  │  [Alle] [Featured] [Nach Herkunft] [Suche...]        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Farbtafel-Grid (3-4 Spalten)                       │   │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                   │   │
│  │  │Card │ │Card │ │Card │ │Card │                   │   │
│  │  └─────┘ └─────┘ └─────┘ └─────┘                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Aktive Farbtafel-Detailansicht                      │   │
│  │  ┌───────────────────────────────────────────────┐   │   │
│  │  │  GemColorCard (groß)                           │   │   │
│  │  │  - Name, Herkunft                              │   │   │
│  │  │  - Gradient-Bar                                │   │   │
│  │  │  - GIA-Daten (Hue, Tone, Sat)                  │   │   │
│  │  │  - Pleochroismus-Viewer                        │   │   │
│  │  │  - ΔE2000-Vergleich                            │   │   │
│  │  │  - Export-Buttons (JSON, PNG, PDF)             │   │   │
│  │  └───────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  JSON Import-Bereich                                 │   │
│  │  "Eigene Daten importieren"                          │   │
│  │  [JSON-Datei auswählen] [Demo laden]                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Komponenten-Struktur

```
components/
  color-charts/
    ├── ColorChartGrid.tsx          # Grid-Ansicht aller Farbtafeln
    ├── ColorChartCard.tsx           # Einzelne Farbtafel-Karte (kompakt)
    ├── GemColorCard.tsx             # Detail-Ansicht einer Farbtafel
    ├── PleochroismViewer.tsx        # Pleochroismus-Viewer
    ├── DeltaEPanel.tsx              # ΔE2000-Vergleich
    ├── GradientBar.tsx               # Gradient-Bar (Canvas)
    ├── ColorStandardizationBadge.tsx # Badge für Lichtstandard
    ├── LightCalibrationHint.tsx     # Hinweis für Lichtkalibrierung
    ├── UploadPanel.tsx              # JSON Import-Panel
    └── utils/
        ├── colorConversions.ts      # Hex→RGB→XYZ→Lab
        └── deltaE2000.ts            # CIEDE2000-Berechnung
```

### Design-System (Tailwind)

```typescript
// Farbpalette (aus farbtafeln.txt)
const theme = {
  gemi: {
    ink: "#0f1021",      // Dunkles Blau/Schwarz
    night: "#17162e",    // Dunkles Violett
    violet: "#6F73D4",   // Violett
    blue: "#2E4EA6",     // Blau
    magenta: "#9A1A63",  // Magenta
  }
};

// Komponenten-Styling
- Hintergrund: `bg-gradient-to-b from-[#0f1021] via-[#17162e] to-[#0f1021]`
- Karten: `bg-white/5` oder `bg-white` (abhängig von Dark/Light Mode)
- Borders: `border-white/10` oder `border-slate-200`
- Buttons: `bg-[#2E2A47]` oder `bg-white/10`
```

### User Experience Flow

1. **Landing**: User öffnet `/de/downloads`
   - Sieht Grid mit allen veröffentlichten Farbtafeln
   - Erste Farbtafel ist automatisch ausgewählt

2. **Interaktion**: User klickt auf Farbtafel-Karte
   - Detailansicht öffnet sich
   - Farbtafel-Daten werden geladen

3. **Farbvergleich**: User klickt auf zwei Farbfelder
   - ΔE2000 wird berechnet
   - Vergleichspanel zeigt Ergebnis

4. **Export**: User klickt Export-Button
   - JSON: Sofortiger Download
   - PNG: Client-seitig mit html2canvas oder Server-seitig
   - PDF: Server-seitig mit @react-pdf/renderer

5. **Import**: User lädt JSON hoch
   - Validierung
   - Daten werden temporär zur Kollektion hinzugefügt
   - (Optional: Speicherung in localStorage)

---

## 🔧 3. Admin-Panel Design

### URL-Struktur

```
/de/admin/color-charts          # Übersicht aller Farbtafeln
/de/admin/color-charts/new      # Neue Farbtafel erstellen
/de/admin/color-charts/edit/[id] # Farbtafel bearbeiten
```

### Admin-Übersichtsseite (`/admin/color-charts`)

```
┌─────────────────────────────────────────────────────────────┐
│  Admin Header + Navigation                                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  [Neue Farbtafel]  [Filter]  [Suche...]             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Tabelle: Farbtafeln                                  │   │
│  │  ┌──────┬──────────────┬──────────┬──────────┬────┐  │   │
│  │  │ Name │ Herkunft     │ Status   │ Featured │ ...│  │   │
│  │  ├──────┼──────────────┼──────────┼──────────┼────┤  │   │
│  │  │ ...  │ ...          │ ...      │ ...      │ ...│  │   │
│  │  └──────┴──────────────┴──────────┴──────────┴────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Farbtafel-Editor (`/admin/color-charts/new` & `/edit/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│  [← Zurück]  Farbtafel bearbeiten                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Basis-Informationen                                  │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ Name: [Mahenge Spinell_____________]           │ │   │
│  │  │ Herkunft: [Mahenge, Tansania________]           │ │   │
│  │  │ Sprache: [Deutsch ▼]                            │ │   │
│  │  │ Slug: [mahenge-spinel_____________] (auto)      │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  GIA-Daten                                            │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ Hue: [pkR–R (pinkish Red → Red)________]      │ │   │
│  │  │ Tone: [3–5 (Medium-Light → Medium)____]       │ │   │
│  │  │ Sat: [4–6 (Strong → Vivid)____________]       │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Farbverlauf (Gradient)                              │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ [Vorschau: Gradient-Bar]                          │ │   │
│  │  │                                                   │ │   │
│  │  │ Farben:                                          │ │   │
│  │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐            │ │   │
│  │  │ │#FBB│ │#F78│ │#E65│ │#C63│ │#9A1│            │ │   │
│  │  │ └────┘ └────┘ └────┘ └────┘ └────┘            │ │   │
│  │  │                                                   │ │   │
│  │  │ [+ Farbe hinzufügen] [Farbpicker öffnen]        │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Pleochroismus-Farben                                │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ [Farbpicker] [Farbpicker] [Farbpicker]         │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Weitere Einstellungen                               │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ Lichtstandard: [D55, CRI ≥95]                  │ │   │
│  │  │ Notiz: [Primär Rosa–Magenta...]                 │ │   │
│  │  │ Beschreibung: [Textarea...]                     │ │   │
│  │  │                                                   │ │   │
│  │  │ ☑ Veröffentlicht  ☑ Featured                    │ │   │
│  │  │ Sortierung: [0]                                  │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Vorschau                                            │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ [Live-Vorschau der Farbtafel]                   │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
│  [Abbrechen]  [Speichern als Entwurf]  [Veröffentlichen]     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Komponenten-Struktur (Admin)

```
components/admin/color-charts/
  ├── ColorChartTable.tsx         # Übersichtstabelle
  ├── ColorChartEditor.tsx         # Haupteditor-Komponente
  ├── GIAFormFields.tsx            # GIA-Daten-Eingabe
  ├── GradientEditor.tsx           # Gradient-Editor mit Farbpicker
  ├── PleochroEditor.tsx            # Pleochroismus-Editor
  ├── ColorChartPreview.tsx        # Live-Vorschau
  └── ColorPicker.tsx              # Farbpicker-Komponente
```

### Features im Admin-Editor

1. **Farbpicker-Integration**
   - React Color Picker (z.B. `react-colorful`)
   - Hex-Farben direkt eingeben
   - Farbvorschau in Echtzeit

2. **Gradient-Editor**
   - Farben hinzufügen/entfernen
   - Reihenfolge per Drag & Drop
   - Live-Vorschau der Gradient-Bar

3. **GIA-Daten-Validierung**
   - Vordefinierte Optionen für Hue, Tone, Sat
   - Format-Validierung

4. **Live-Vorschau**
   - Echtzeit-Vorschau der Farbtafel
   - Verwendet dieselben Komponenten wie Frontend

5. **Bulk-Import**
   - JSON-Import mehrerer Farbtafeln
   - Validierung und Fehlerbehandlung

---

## 🔌 4. API-Routen

### API-Struktur

```
app/api/
  color-charts/
    ├── route.ts                    # GET: Liste, POST: Erstellen
    ├── [id]/
    │   ├── route.ts                # GET, PUT, DELETE einzelne Farbtafel
    │   └── export/
    │       ├── json/
    │       │   └── route.ts        # GET: JSON-Export
    │       ├── png/
    │       │   └── route.ts        # GET: PNG-Export (Server-seitig)
    │       └── pdf/
    │           └── route.ts        # GET: PDF-Export
    └── import/
        └── route.ts                # POST: JSON-Import (Admin)
```

### API-Endpunkte

#### GET `/api/color-charts`
```typescript
// Query-Parameter:
// - locale?: string (default: "de")
// - published?: boolean (default: true für öffentlich)
// - featured?: boolean
// - origin?: string

// Response:
{
  charts: ColorChart[],
  total: number
}
```

#### GET `/api/color-charts/[id]`
```typescript
// Response:
ColorChart
```

#### POST `/api/color-charts` (Admin)
```typescript
// Request Body:
{
  name: string,
  origin?: string,
  gia: { hue: string, tone: string, sat: string },
  gradient: string[],
  pleochro: string[],
  light?: string,
  note?: string,
  description?: string,
  published?: boolean,
  featured?: boolean,
  locale?: string
}

// Response:
ColorChart
```

#### PUT `/api/color-charts/[id]` (Admin)
```typescript
// Request Body: Partial<ColorChartInput>
// Response: ColorChart
```

#### DELETE `/api/color-charts/[id]` (Admin)
```typescript
// Response: { success: boolean }
```

#### GET `/api/color-charts/[id]/export/json`
```typescript
// Response: JSON-Datei (Download)
```

#### GET `/api/color-charts/[id]/export/png`
```typescript
// Response: PNG-Bild (Download)
// Optional: Query-Parameter für Auflösung
```

#### GET `/api/color-charts/[id]/export/pdf`
```typescript
// Response: PDF-Datei (Download)
```

---

## 📦 5. Abhängigkeiten & Installation

### Benötigte npm-Pakete

```bash
# Für PNG-Export (Client-seitig)
npm install html2canvas

# Für PNG-Export (Server-seitig, optional, besser)
npm install satori @resvg/resvg-js

# Für PDF-Export (optional)
npm install @react-pdf/renderer

# Für Farbpicker im Admin (optional)
npm install react-colorful

# TypeScript-Typen
npm install --save-dev @types/html2canvas
```

### Prisma Migration

```bash
# 1. Schema erweitern (siehe oben)
# 2. Migration erstellen
npx prisma migrate dev --name add_color_charts

# 3. Prisma Client neu generieren
npx prisma generate
```

---

## 🎯 6. Implementierungs-Prioritäten

### Phase 1: Grundfunktionen (MVP)
1. ✅ Prisma Schema erweitern
2. ✅ API-Routen erstellen (CRUD)
3. ✅ Admin-Panel: Übersicht + Editor
4. ✅ Frontend: Farbtafel-Grid + Detailansicht
5. ✅ Basis-Komponenten (GemColorCard, GradientBar)

### Phase 2: Erweiterte Features
6. ✅ Pleochroismus-Viewer
7. ✅ ΔE2000-Vergleich
8. ✅ JSON Import/Export
9. ✅ PNG-Export (Client-seitig)

### Phase 3: Premium-Features
10. ✅ PDF-Export
11. ✅ Server-seitiger PNG-Export (bessere Qualität)
12. ✅ Bulk-Import
13. ✅ Farbtafel-Vergleich (2-4 nebeneinander)
14. ✅ Drucklayout (A4/A5)

---

## 🎨 7. Design-Details

### Farbpalette (aus farbtafeln.txt)

```typescript
const gemiColors = {
  ink: "#0f1021",      // Dunkles Blau/Schwarz
  night: "#17162e",    // Dunkles Violett
  violet: "#6F73D4",   // Violett
  blue: "#2E4EA6",     // Blau
  magenta: "#9A1A63",  // Magenta
};
```

### Typografie

```css
/* Headings */
h1: text-4xl md:text-6xl lg:text-7xl font-bold
h2: text-2xl sm:text-3xl font-semibold
h3: text-lg font-semibold

/* Body */
body: text-sm text-slate-600/80
```

### Responsive Design

- **Mobile**: 1 Spalte (Grid), kompakte Karten
- **Tablet**: 2 Spalten
- **Desktop**: 3-4 Spalten

---

## 🔒 8. Sicherheit & Berechtigungen

### Authentifizierung

- **Öffentliche Seiten** (`/downloads`): Keine Authentifizierung erforderlich
- **Admin-Panel** (`/admin/color-charts`): NextAuth + Admin-Rolle erforderlich
- **API-Routen**:
  - GET: Öffentlich (nur published)
  - POST/PUT/DELETE: Admin-Authentifizierung erforderlich

### Validierung

- **Farben**: Hex-Format validieren (`#RRGGBB`)
- **GIA-Daten**: Format-Validierung
- **Slug**: Automatische Generierung aus Name (URL-safe)

---

## 📝 9. Beispieldaten (aus farbtafeln.txt)

```typescript
const seedData = [
  {
    name: "Mahenge Spinell",
    origin: "Mahenge, Tansania",
    gia: { hue: "pkR–R (pinkish Red → Red)", tone: "3–5 (Medium-Light → Medium)", sat: "4–6 (Strong → Vivid)" },
    gradient: ["#FBB7D0", "#F78AB8", "#E6579C", "#C63480", "#9A1A63"],
    pleochro: ["#F78AB8", "#E6579C", "#9A1A63"],
    light: "D55, CRI ≥95",
    note: "Primär Rosa–Magenta; fluoreszenz-empfänglich.",
    published: true,
    featured: true,
  },
  // ... weitere Einträge
];
```

---

## ✅ 10. Zusammenfassung

### ✅ Umsetzbar:
- ✅ Alle Kernfunktionen können im Projekt umgesetzt werden
- ✅ Download-Seite kann erweitert werden
- ✅ Admin-Panel kann integriert werden
- ✅ Datenbankintegration ist möglich

### ⚠️ Benötigte Schritte:
1. npm-Pakete installieren (html2canvas, optional: satori, @react-pdf/renderer)
2. Prisma Schema erweitern
3. API-Routen erstellen
4. Frontend-Komponenten entwickeln
5. Admin-Panel entwickeln

### 🎯 Nächste Schritte (nach Freigabe):
1. Prisma Schema erweitern
2. Migration erstellen
3. API-Routen implementieren
4. Frontend-Komponenten erstellen
5. Admin-Panel entwickeln
6. Testing & Optimierung

---

**Status**: ✅ Design-Vorschlag abgeschlossen, bereit für Implementierung

