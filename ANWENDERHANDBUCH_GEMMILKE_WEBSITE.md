# 📘 Anwenderhandbuch: Gemilike Website

**Version:** 2.5.2  
**Stand:** Dezember 2025  
**Letzte Aktualisierung:** 20. Dezember 2025 - Vektorsuche erweitert, Internationalisierung für Shop-Seite  
**Zielgruppe:** Administratoren, Redakteure, Entwickler

---

## 📑 Inhaltsverzeichnis

1. [Einführung](#1-einführung)
2. [Technische Übersicht](#2-technische-übersicht)
3. [Öffentliche Website](#3-öffentliche-website)
4. [Admin-Bereich](#4-admin-bereich)
5. [Datenbank-Schema](#5-datenbank-schema)
6. [API-Dokumentation](#6-api-dokumentation)
7. [Funktionsbeschreibungen](#7-funktionsbeschreibungen)
8. [Mathematische und Physikalische Verfahren](#8-mathematische-und-physikalische-verfahren)
9. [Technische Details](#9-technische-details)
10. [Deployment & Wartung](#10-deployment--wartung)
11. [Detaillierte Dokumentationen](#11-detaillierte-dokumentationen)
12. [Support & Kontakt](#12-support--kontakt)
13. [Zusammenfassung](#13-zusammenfassung)
14. [Schnellreferenz](#14-schnellreferenz)

---

## 1. Einführung

### 1.1 Über dieses Handbuch

Dieses Anwenderhandbuch dokumentiert die vollständige Funktionalität der Gemilike-Website, einschließlich aller öffentlichen Seiten, Admin-Funktionen und der zugrundeliegenden Datenbankstruktur. Es dient sowohl als Benutzerhandbuch für Administratoren als auch als technische Dokumentation für Entwickler.

### 1.2 Website-Übersicht

Die Gemilike-Website ist eine moderne E-Commerce-Plattform für Edelsteine mit folgenden Hauptfunktionen:

- **E-Commerce-Shop** für Edelsteine
- **Content-Management** für Blogs, Stories und Wissenswertes
- **Download-Bereich** (`/downloads`) mit drei Hauptbereichen:
  - **Dokumente**: Kataloge, Zertifikat-Vorlagen, Guides zum Herunterladen
  - **Farbtafeln**: Interaktive GIA-konforme Farbtafeln mit Filterung, DeltaE2000-Vergleich und Export-Funktionen
  - **Farbanalyse**: Professionelles Tool zur automatischen Farbanalyse von Edelstein-Bildern mit erweiterten Algorithmen (Borderline v4)
- **Kundenverwaltung** mit Bestellungen und Rechnungen
- **Newsletter-Management**
- **Weltkarte** mit Fundorten
- **Moderne Web Design Features** (Version 2.4.0+):
  - Progressive Enhancement für alle Formulare
  - Dark Mode mit System-Präferenz-Erkennung
  - Neumorphismus Design-Elemente
  - Microinteractions und Scroll-Animationen
  - Service Worker für Offline-Support
  - Vollständige Accessibility (WCAG 2.1 AA)
  - 3D-Effekte und Parallax-Scrolling

### 1.3 Technologie-Stack

- **Framework:** Next.js 15.5.4 (React 19.2.0)
- **Datenbank:** PostgreSQL mit Prisma ORM
- **Authentifizierung:** NextAuth.js 4.24.11
- **Internationalisierung:** next-intl 4.3.9
- **Styling:** Tailwind CSS 4
- **UI-Komponenten:** Radix UI
- **State Management:** Zustand 5.0.8
- **PDF-Generierung:** @react-pdf/renderer 4.3.1
- **Karten:** Leaflet 1.9.4

---

## 2. Technische Übersicht

### 2.1 Architektur

Die Website folgt einer **Next.js App Router Architektur** mit:

- **Server Components** für serverseitiges Rendering
- **Client Components** für interaktive UI-Elemente
- **API Routes** für Backend-Funktionalität
- **Middleware** für Authentifizierung und Routing

### 2.2 Projektstruktur

```
gemilike-website/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Lokalisierte Routen
│   │   ├── page.tsx              # Startseite
│   │   ├── admin/                # Admin-Bereich
│   │   ├── shop/                 # Shop-Bereich
│   │   ├── blog/                 # Blog-Bereich
│   │   └── ...                   # Weitere öffentliche Seiten
│   └── api/                      # API-Routen
│       ├── admin/                # Admin-APIs
│       ├── color-charts/         # Farbtafeln-APIs
│       └── gemstone-analyses/    # Farbanalyse-APIs
├── components/                   # React-Komponenten
│   ├── admin/                    # Admin-Komponenten
│   ├── color-charts/             # Farbtafeln-Komponenten
│   ├── layout/                   # Layout-Komponenten
│   └── ui/                       # UI-Basis-Komponenten
├── lib/                          # Bibliotheken und Utilities
│   ├── services/                 # Business-Logic-Services
│   ├── store/                    # Zustand Stores
│   └── utils/                    # Utility-Funktionen
├── prisma/                       # Datenbank-Schema
│   └── schema.prisma             # Prisma Schema
└── public/                       # Statische Dateien
```

### 2.3 Datenbank

**PostgreSQL** mit **Prisma ORM**:

- **27 Haupt-Models** für verschiedene Entitäten
- **Relations** zwischen Models für Datenintegrität
- **Indexes** für Performance-Optimierung
- **Enums** für typsichere Werte

### 2.4 Design & Layout-System

#### 2.4.1 Design-Vorlage: Shop-Seite

Die **Shop-Seite** (`/shop`) dient als Design-Vorlage für alle anderen Seiten der Website. Alle Seiten übernehmen exakt dasselbe Layout, Background, Farbverlauf, Container und Thumbnail-Styles.

**Hintergrund:**
- Klasse: `public-page-bg`
- Gradient: `linear-gradient(135deg, rgba(31, 41, 55, 0.7), rgba(17, 24, 39, 0.8))`
- Backdrop-Filter: `blur(15px)`
- Zusätzliche Radial-Gradienten für subtile Farbakzente

**Container:**
- Klasse: `main-container`
- Gradient mit Orange, Lila und Cyan-Akzenten
- Border: `rgba(0, 229, 255, 0.6)` (Cyan)
- Box-Shadow mit Glow-Effekten
- Backdrop-Filter: `blur(12px)`
- Margin: `4rem 8rem` (Desktop)
- Padding: `3rem`
- Border-Radius: `0.9rem`

**Cards:**
- Klasse: `story-card`
- Gradient mit Orange, Cyan und Lila
- Hover-Effekt: `translateY(-8px) scale(1.02)`
- Border: `rgba(0, 229, 255, 0.6)`
- Backdrop-Filter: `blur(12px)`

**Thumbnails:**
- Background: `rgba(17, 24, 39, 0.7)` (gray-900/70)
- Border: `rgba(255, 255, 255, 0.2)` (white/20)
- Backdrop-Filter: `blur(12px)`
- Border-Radius: `1rem`

#### 2.4.2 Typografie & Überschriften

**Moderne Progressive Schriftart: Inter**

Die Website verwendet **Inter** als primäre Schriftart für alle Body-Texte. Inter ist eine moderne, progressive Schriftart, die speziell für digitale Interfaces entwickelt wurde.

**Vorteile:**
- Modern und progressiv
- Optimiert für Bildschirmlesbarkeit
- Sehr gute Lesbarkeit in allen Größen
- Professionell und zeitgemäß
- Von vielen modernen Websites verwendet

**Integration:**
- Next.js Font Optimization für optimale Performance
- Verfügbar in allen Gewichtungen (300-900)
- Automatisches Font-Swapping für bessere Ladezeiten

**Schriftart-Strategie:**
- **Display-Font (Impact):** Nur für H1 und H2 Überschriften
- **Body-Font (Inter):** Für alle anderen Texte (H3, Body, Buttons, etc.)

**Einheitliche Überschriften-Hierarchie:**

**H1 (Hauptüberschriften - Seiten-Titel):**
- Font: `Impact`, `Arial Black`, sans-serif (Display-Font)
- Größe: `2.5rem` (Desktop: `3.5rem`)
- Gewicht: `900`
- Letter-Spacing: `0.08em`
- Text-Transform: `uppercase`
- **IMMER mit `gemilike-text-gradient`** (animierter Gradient)
- Verwendung: Hero-Titel, Hauptüberschriften auf allen Seiten

**H2 (Sektions-Überschriften):**
- Font: `Impact`, `Arial Black`, sans-serif (Display-Font)
- Größe: `2rem` (Desktop: `2.5rem`)
- Gewicht: `800`
- Letter-Spacing: `0.05em`
- Farbe: Optional mit Gradient oder `text-gray-200`

**H3 (Unterüberschriften):**
- Font: `Inter`, sans-serif (Body-Font)
- Größe: `1.5rem` (Desktop: `1.75rem`)
- Gewicht: `700`
- Farbe: `text-gray-200`

**Body-Text (Haupttext):**
- Font: `Inter`, sans-serif (Body-Font)
- Größe: `1rem`
- Gewicht: `400`
- Line-Height: `1.6`
- Farbe: `text-gray-200`

**Regel:**
- **H1:** Immer mit `gemilike-text-gradient` (Gradient), nie mit statischer Farbe
- **H2:** Optional mit Gradient oder `text-gray-200`
- **H3:** Immer `text-gray-200` mit Inter
- **Body:** Immer `text-gray-200` mit Inter

#### 2.4.3 Textfarbe-Strategie (Helles Grau)

Statt reinem Weiß wird helles Grau verwendet für bessere Lesbarkeit und angenehmeres Erscheinungsbild.

**Primärer Text (Body):**
- Klasse: `text-gray-200`
- Farbe: `#E5E7EB`
- Verwendung: Haupttext, Beschreibungen

**Sekundärer Text (Metadaten, Labels):**
- Klasse: `text-gray-300`
- Farbe: `#D1D5DB`
- Verwendung: Kategorien, Metadaten, sekundäre Informationen

**Tertiärer Text (Hinweise, deaktivierte Elemente):**
- Klasse: `text-gray-400`
- Farbe: `#9CA3AF`
- Verwendung: Platzhalter, Hinweise, deaktivierte Buttons

**Kontrast-Mindestanforderungen (WCAG AA):**
- Primärer Text: ✅ 12.6:1 (ausreichend)
- Sekundärer Text: ✅ 9.5:1 (ausreichend)
- Tertiärer Text: ✅ 6.8:1 (ausreichend)

**Regel:**
- ❌ **NIEMALS** schwarze Schrift (`#000000` oder `text-black`) auf dunklem Hintergrund
- ✅ **IMMER** helles Grau statt reinem Weiß
- ✅ Primärer Text: `text-gray-200`
- ✅ Sekundärer Text: `text-gray-300`
- ✅ Tertiärer Text: `text-gray-400`

#### 2.4.4 Layout-Konsistenz

**Container-Struktur:**
- Alle Seiten verwenden `main-container` Klasse
- Einheitliche Margins und Paddings
- Konsistente Border-Radius und Shadows

**Spacing-System:**
- XS: `0.5rem` (8px)
- SM: `1rem` (16px)
- MD: `2rem` (32px)
- LG: `3rem` (48px)
- XL: `4rem` (64px)
- 2XL: `6rem` (96px)

**Responsive Breakpoints:**
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

#### 2.4.5 Moderne Progressive Schriftart: Inter

Die Website verwendet **Inter** als primäre Schriftart für alle Body-Texte. Inter ist eine moderne, progressive Schriftart, die speziell für digitale Interfaces entwickelt wurde.

**Vorteile:**
- Modern und progressiv
- Optimiert für Bildschirmlesbarkeit
- Sehr gute Lesbarkeit in allen Größen
- Professionell und zeitgemäß
- Von vielen modernen Websites verwendet (Vercel, GitHub, etc.)

**Integration über Next.js Font Optimization (Empfohlen):**
```typescript
// app/[locale]/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export default function LocaleLayout({ children }) {
  return (
    <html lang={locale} className={inter.variable}>
      <body className="font-inter">
        {children}
      </body>
    </html>
  );
}
```

**Tailwind CSS Konfiguration:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Impact', 'Arial Black', 'sans-serif'],
      },
    },
  },
}
```

**Schriftart-Verwendung:**
- **Display-Font (Impact):** Nur für H1 und H2 Überschriften
- **Body-Font (Inter):** Für alle anderen Texte (H3, Body, Buttons, etc.)

#### 2.4.6 Umsetzungsstatus

**Aktueller Stand (Version 2.5.0):**
- ✅ Shop-Seite als Vorlage definiert
- ✅ Design-System vollständig dokumentiert
- ✅ Inter-Schriftart integriert und aktiv
- ✅ **Alle Seiten vollständig angepasst**

**Vollständig umgesetzte Seiten:**
- ✅ Startseite (`/`) - Angepasst an Shop-Layout
- ✅ Shop-Seite (`/shop`) - Vorlage für alle anderen Seiten
- ✅ Wissenswertes (`/wissenswertes`) - Angepasst an Shop-Layout
- ✅ Blog (`/blog`) - Angepasst an Shop-Layout
- ✅ Kontakt (`/contact`) - Angepasst an Shop-Layout
- ✅ Services (`/services`) - Angepasst an Shop-Layout
- ✅ Downloads (`/downloads`) - Angepasst an Shop-Layout
- ✅ Weltkarte (`/worldmap`) - Angepasst an Shop-Layout
- ✅ Zertifikate (`/certificates`) - Angepasst an Shop-Layout
- ✅ AGB (`/terms`) - Angepasst an Shop-Layout
- ✅ Datenschutz (`/privacy`) - Angepasst an Shop-Layout
- ✅ Impressum (`/imprint`) - Angepasst an Shop-Layout
- ✅ Cookies (`/cookies`) - Angepasst an Shop-Layout
- ✅ Widerruf (`/returns`) - Angepasst an Shop-Layout
- ✅ Versand (`/shipping`) - Angepasst an Shop-Layout

**Einheitliche Implementierung:**
- ✅ Alle Seiten verwenden `public-page-bg` Hintergrund
- ✅ Alle Seiten verwenden `main-container` für Container
- ✅ Alle Seiten verwenden `story-card` für Content-Cards
- ✅ Alle H1-Überschriften verwenden `font-impact font-weight-impact` mit `gemilike-text-gradient`
- ✅ Alle H2/H3-Überschriften verwenden Inter mit `font-bold` oder `font-semibold`
- ✅ Alle Texte verwenden `text-gray-200` statt `text-white` oder `text-black`
- ✅ Inter-Schriftart ist global über `layout.tsx` aktiviert

---

## 3. Öffentliche Website

### 3.1 Startseite (`/` oder `/de`)

**Route:** `app/[locale]/page.tsx`

**Funktionalität:**

- Hero-Bereich mit konfigurierbaren Bildern und Texten
- Newsticker für aktuelle Nachrichten
- Neue Edelsteine Karussell
  - **Interaktion:** Klick auf Thumbnail oder Edelstein-Name öffnet die Detailansicht auf der Shop-Seite (`/shop?gem={id}`)
  - **Navigation:** Verlinkt zur Shop-Seite mit automatischer Öffnung der GemstoneCard
- Blog/Stories Sektion
- Newsletter-Anmeldung

**Datenquellen:**

- `HeroSettings` (Hero-Konfiguration)
- `HeroImage` (Hero-Bilder)
- `NewstickerItem` (Newsticker-Nachrichten)
- `Gemstone` (neue Edelsteine)
- `Blog` (Blog-Posts)

**Technische Details:**

- Server-Side Rendering (SSR)
- Dynamische Datenladung aus Datenbank
- Responsive Design mit Tailwind CSS

---

### 3.2 Shop (`/shop`)

**Route:** `app/[locale]/shop/page.tsx`

**Funktionalität:**

- Übersicht aller verfügbaren Edelsteine
- Semantische Vektorsuche mit natürlicher Sprache (ersetzt klassische Dropdown-Filter)
- Deep-Linking zu einzelnen Edelsteinen über `?gem={id}` inklusive Auto-Öffnung der Detailkarte
- Warenkorb- und Wishlist-Aktionen direkt aus Grid und Detailkarte
- Lazy Loading in 15er-Schritten inkl. Statusanzeige ("Zeigt X von Y Edelsteinen")

**Datenquellen:**

- `Gemstone` (Hauptdaten)
- `GemstoneAttributes` (Attribute wie Größe, Farbe)
- `GemstoneInventory` (Lagerbestand)
- `GemstonePrice` (Preise)
- `GemstoneMedia` (Bilder/Videos)

**Layout:**

- **Grid-Layout:** Responsive `auto-fit` Grid (min. 180px pro Karte, skaliert zwischen 3-5 Spalten)
- **Thumbnail-Größe:** 240×240px Fokusbereich (Image-Komponente mit Hover-Zoom)
- **Responsive:** Automatische Umstellung auf 2 Spalten bzw. 1 Spalte bei kleineren Breakpoints
- **Sektionen:** Hero/Intro-Card -> Semantische Suche -> Grid + Load-More -> leere-State-Card

#### Semantische Vektorsuche (seit 27.11.2025, erweitert 20.12.2025)

- **Eingabe:** Freitextfeld ("Beschreibe Farbe, Herkunft, Zertifikat ...") + `Vektor-Suche`-Button
- **Reset:** Separater Button blendet alle Edelsteine wieder ein und löscht die Suchphrase
- **Heuristische Vorfilterung (Client):**
  - **Preisangaben:** Zahlen aus dem Text werden erkannt (z. B. "zwischen 2000 und 5000") und als Mindest-/Höchstpreis interpretiert
  - **Zertifizierungs-Hinweise:** Schlüsselwörter wie "zertifiziert", "GIA", "ohne Zertifikat", "mit Zertifikat", "alle steine mit Zertifizierung" filtern sofort passende Einträge
  - **Behandlungs-Hinweise:** Schlüsselwörter wie "mit Behandlung", "ohne Behandlung", "behandelt", "unbehandelt" filtern sofort passende Einträge
  - **Keywords:** Tokenisierte Suche über alle Edelstein-Attribute:
    - **Basis-Attribute:** Name, Kategorie, Herkunft, Farbe, Typ
    - **Erweiterte Attribute:** Farbsättigung (mit Synonymen: vivid/lebhaft, intense/intensiv, etc.), Klarheit, Schliff, Schliffform, Behandlung, Seltenheit
    - **Zertifizierung:** Zertifikats-Lab (GIA, IGI, etc.) und Zertifikatsstatus
    - **Beschreibungen:** Volltext-Suche in Beschreibung und Kurzbeschreibung
    - **Gewicht & Abmessungen:** Gewicht mit Einheit (z. B. "2.5 ct") und Abmessungen (z. B. "10x8x6")
- **Synonym-Unterstützung:**
  - **Farbsättigung:** "vivid" = "lebhaft", "kräftig"; "intense" = "intensiv", "stark"; "pale" = "blass", "hell"; etc.
  - **Schliff:** "brillant" = "rund", "round"; "princess" = "quadratisch"; "emerald" = "rechteckig"; etc.
  - **Seltenheit:** "gewöhnlich" = "common"; "selten" = "rare"; "außergewöhnlich" = "exceptional"; etc.
- **Fallback:** Wenn keine heuristischen Treffer gefunden werden, erfolgt ein Request an `/api/shop/vector-search` (Semantische Vektorsuche auf dem Server)
- **Statusmeldungen:** Treffer-Anzahl, Ladezustand und Fehlertexte werden direkt unter dem Formular angezeigt (mehrsprachig)
- **Hinweis:** Alle bisherigen Dropdown-/Checkbox-Filter wurden entfernt; jede Filteranforderung läuft jetzt über die semantische Suche

#### Pagination & Sichtbarkeit

- `LOAD_STEP = 15`: Erst 15 Karten, anschließend "Weitere Edelsteine laden" (Button + Statusangabe)
- **Auto-Sichtbarkeit:** Falls eine Route mit `?gem={id}` aufgerufen wird, erhöht die Seite automatisch den sichtbaren Bereich, bis der Edelstein geladen ist
- **Statusbanderole:** Zeigt an, ob noch weitere Edelsteine existieren oder bereits alle angezeigt werden

#### Detailansicht & Interaktionen

- **Öffnung:** Klick auf Thumbnail oder Name öffnet eine schwebende Detailkarte
- **Desktop:** 450px breite, frei verschiebbare Karte (Drag & Drop via Header/Leere Bereiche)
- **Mobile:** Vollflächiges Bottom Sheet (85% Höhe), kein Dragging nötig
- **Deep-Linking:** Der geöffnete Edelstein schreibt `?gem={id}` in die URL; ein Reload oder geteilter Link öffnet dieselbe Karte erneut
- **Media Gallery:** Voll integrierte Bilder/Videos mit Verfügbarkeits-Badge und Zertifikatsstatus
- **Status-Badges:** Kategorie, Typ (geschliffen/roh), Neu, Verkauft/Nicht verfügbar, Seltenheit - mit Farbcodes identisch zur Grid-Darstellung
- **Detailzeilen:** Iconisierte Reihen (Preis, Gewicht, Herkunft, Abmessungen, Farbe, Behandlung, Zertifizierung, Seltenheit ...)
- **Aktionen:** `AddToCartButton` (deaktiviert bei `isSold`/`!inStock`) + `WishlistButton` direkt aus Grid und Detailkarte

**Features:**

- Semantische Suche mit Preis-, Zertifizierungs- und Keyword-Heuristiken + serverseitiger Vector-Fallback
- Deep-Linking über `?gem={id}` inklusive Auto-Scroll & Auto-Open
- Responsive Auto-Fit Grid mit Hover-Effekten, Status-Badges und CTA-Leiste
- Draggable Detailkarte (Desktop) bzw. Bottom Sheet (Mobile)
- Warenkorb- und Wishlist-Verknüpfung ohne Seitenwechsel
- Leerzustand inkl. CTA, falls keine Edelsteine gefunden wurden

---

### 3.3 Blog (`/blog`)

**Route:** `app/[locale]/blog/page.tsx`

**Funktionalität:**

- Übersicht aller Blog-Posts
- Kategorisierung und Tagging
- Einzelansicht (`/blog/[slug]`)
- Lesedauer-Anzeige
- Featured Posts

**Datenquellen:**

- `Blog` Model

**Features:**

- Markdown-Content-Rendering
- Bildergalerien
- SEO-optimiert mit Meta-Descriptions
- Mehrsprachigkeit (locale)

---

### 3.4 Wissenswertes (`/wissenswertes`)

**Route:** `app/[locale]/wissenswertes/page.tsx`

**Funktionalität:**

- Knowledge Base Artikel
- Kategorisierung
- Einzelansicht (`/wissenswertes/[slug]`)
- Schwierigkeitsgrad-Anzeige

**Datenquellen:**

- `KnowledgeBase` Model

**Features:**

- Strukturierte Artikel
- Suchfunktion
- Verwandte Artikel

---

### 3.5 Weltkarte (`/worldmap`)

**Route:** `app/[locale]/worldmap/page.tsx`

**Funktionalität:**

- Interaktive Karte mit Leaflet
- Fundorte von Edelsteinen weltweit
- Filterung nach Edelstein-Typ
- Detailansicht von Fundorten mit Popups
- Legende mit allen Edelstein-Typen
- Gleicher Hintergrund wie Wissenswertes-Seite (einheitliches Design)

**Datenquellen:**

- `Location` (Fundorte) - Über 80 Standorte weltweit
- `GemType` (Edelstein-Typen) - 20+ verschiedene Edelsteine
- `Country` (Länder) - 32+ Länder mit Fundorten

**Verfügbare Edelstein-Standorte:**

Die Weltkarte enthält umfangreiche Standort-Daten für folgende Edelsteine:

- **Granat (Garnet)**: 13 Standorte weltweit
  - Namibia (Erongo Region), Tansania (Tunduru), Sri Lanka (Ratnapura), Indien (Rajasthan), Brasilien (Minas Gerais), Madagaskar (Bekily), USA (Idaho), Russland (Ural), Tschechien (Böhmen), Südafrika (Mpumalanga) und weitere

- **Turmalin (Tourmaline)**: 12 Standorte weltweit
  - Brasilien (Minas Gerais Paraiba), Mosambik (Alto Ligonha), Afghanistan (Nuristan), Madagaskar (Anjanabonoina), USA (Pala), Nigeria (Oyo), Tansania (Umba-Tal), Sri Lanka (Ratnapura), Pakistan (Gilgit-Baltistan), Namibia (Erongo) und weitere

- **Saphir (Sapphire)**: 11 Standorte weltweit
  - Sri Lanka (Ratnapura), Myanmar (Mogok), Thailand (Chanthaburi), Australien (New South Wales), Madagaskar (Ilakaka), Tansania (Umba-Tal), USA (Montana), Kambodscha (Pailin), China (Shandong), Nigeria (Mambilla-Plateau) und weitere

- **Rubin (Ruby)**: 12 Standorte weltweit
  - Myanmar (Mogok Valley), Mosambik (Montepuez), Thailand (Chanthaburi), Sri Lanka (Ratnapura), Tansania (Songea), Afghanistan (Jegdalek), Pakistan (Hunza-Tal), Indien (Kashmir), Vietnam (Luc Yen), Grönland (Aappaluttoq) und weitere

- **Beryll (Beryl)**: 10 Standorte weltweit
  - Kolumbien (Muzo), Sambia (Kafubu), Brasilien (Minas Gerais), Madagaskar (Mananjary), Pakistan (Swat-Tal), Afghanistan (Panjshir-Tal), Russland (Ural), USA (North Carolina), Australien (New England), China (Yunnan)

- **Chrysoberyll/Alexandrit (Chrysoberyl/Alexandrite)**: 10 Standorte weltweit
  - Russland (Ural), Brasilien (Minas Gerais), Sri Lanka (Ratnapura), Tansania (Tunduru), Indien (Andhra Pradesh), Madagaskar (Ilakaka), USA (Montana), Zimbabwe (Masvingo), Myanmar (Mogok), Mosambik (Alto Ligonha)

- **Spinell (Spinel)**: 10 Standorte weltweit
  - Myanmar (Mogok), Sri Lanka (Ratnapura), Tansania (Mahenge), Vietnam (Luc Yen), Tadschikistan (Kukh-i-Lal), USA (Amity, Sterling Hill), Russland (Aldanhochland), Afghanistan (Ishkashim, Sorobi)

**Technische Details:**

- Leaflet.js für Karten-Rendering
- OpenStreetMap als Kartenbasis
- Farbcodierte Marker für verschiedene Edelstein-Typen
- Popups mit Detailinformationen (Name, Land, Edelstein-Typ, Minen-Typ, Status, Beschreibung)
- Filterung nach Edelstein-Typ über Legende
- Responsive Design für alle Bildschirmgrößen
- Einheitlicher Hintergrund-Stil mit `public-page-bg` Klasse (gleicher Stil wie Wissenswertes-Seite)

**Verwaltung:**

- Standorte können über `/admin/worldmap` verwaltet werden
- Bulk-Import über CSV möglich
- Automatische Länder- und Edelstein-Typ-Erstellung bei Bedarf

---

### 3.6 Downloads (`/downloads`)

**Route:** `app/[locale]/downloads/page.tsx`

**Funktionalität:**

- Farbtafeln-Download
- Farbanalyse-Tool (siehe detaillierte Beschreibung unten)
- Zertifikate-Download (nach Bestellung)

**Features:**

- Farbtafeln-Grid mit Filterung
- DeltaE2000 Farbvergleich
- PDF-Export von Farbtafeln
- JSON-Export von Analysen

#### Farbanalyse-Tool - Detaillierte Funktionen

**Zugriff:** Tab "Farbanalyse" auf der Download-Seite

**Hauptfunktionen:**

1. **Bild-Upload**
   - Drag & Drop oder Dateiauswahl
   - Unterstützung für mehrere Bilder gleichzeitig
   - Automatische Bildoptimierung (max. 1800×1200px)
   - Unterstützte Formate: JPG, PNG, WebP

2. **Erweiterte Einstellungen** (ausklappbar)

   **Whitepoint-Auswahl:**
   - **D65** (Standard): Standard für sRGB-Displays
   - **D50**: Standard für Druck/ICC-Profile
   - **ICC-Profil (Borderline v4)**: Automatische Weißpunkt-Extraktion aus ICC-Profilen
   - Bradford-Chromatic-Adaptation für präzise Farbkonvertierung

   **K-Means Cluster-Wert:**
   - **Automatisch (Standard)**: Adaptive Cluster-Anzahl (3-20) je nach Bildgröße
   - **Auto-K via GMM+BIC (Borderline v4)**: Automatische, datengetriebene Clusterzahl (3-8)
   - **Manuell**: Manuelle Festlegung der Cluster-Anzahl (3-20)
   - Beeinflusst die Farb-Extraktion und Genauigkeit

   **Maskierungs-Optionen:**
   - **Hell/Neutral filtern**: Filtert helle und neutrale Pixel (Schwelle: 180-250)
   - **Sehr dunkel filtern**: Filtert sehr dunkle Pixel (Schwelle: 0-60)
   - **Niedrige Sättigung filtern**: Filtert ungesättigte Pixel (Schwelle: 0-30)
   - **Smart Mask**: Intelligente Kanten-Erkennung für bessere Segmentierung
   - **SLIC Superpixels (Borderline v4)**: Segmentierung in homogene Regionen
     - Superpixel-Größe: 8-32 Pixel (default: 16)
     - Kompaktheit: 5-30 (default: 10)
   - **Guided Filter (Borderline v4)**: Edge-preserving Glättung
     - Radius: 2-8 Pixel (default: 4)
   - Anpassbare Schwellenwerte für alle Filter

   **Benutzerdefinierte Palette:**
   - Manuelles Hinzufügen von HEX-Farben
   - Vergleich der Primärfarbe mit benutzerdefinierten Paletten
   - Integration in Palette-Vergleich

   **Borderline v4: Erweiterte Features:**
   - **ICC-Profil-Upload**: Hochladen von ICC-Profilen (.icc, .icm) für präzise Farbanalyse
   - **Borderline-Erkennung**: Automatische Erkennung von Grenzfarben zwischen Kategorien
   - **Erweiterte Export-Formate**: CSV und PDF (v4) mit Borderline-Informationen

   **OpenCV GrabCut (Erweiterte Segmentierung):**
   - Präzise Hintergrund-Trennung mit OpenCV.js
   - **Rechteck-Modus**: Initialisierung durch Rechteck-Auswahl
   - **Vordergrund-Pinsel**: Markierung von Edelstein-Bereichen
   - **Hintergrund-Pinsel**: Markierung von Hintergrund-Bereichen
   - Anpassbare Pinselgröße (4-32px)
   - Automatisches Laden von OpenCV.js bei Aktivierung (~8MB)

3. **Mehrere Bilder gleichzeitig**
   - Upload mehrerer Bilder in einem Vorgang
   - Tab-Navigation zwischen Bildern
   - Separate Analyse für jedes Bild
   - Wechsel zwischen Bildern ohne Analyse-Verlust

4. **6-stufige Analyse** (erweitert)
   - **Primärfarbe (Hauptfarbton)**
     - Verbesserte Farbklassifizierung mit RGB-basierter Korrektur
     - Präzise Unterscheidung zwischen Violett und Rot
     - CIE-Hue-Berechnung mit RGB-Validierung
     - Ton-Bewertung (Dunkel bis Sehr hell)
     - Herkunftsvermutung basierend auf Farbton
   - **Sekundärfarben (Zentrum, Facetten, Schatten)**
     - CIE-Hue-Berechnung für alle sekundären Farben
     - Region-spezifische Analyse (Zentralbereich, Facettenreflexe, Schattenbereiche)
     - Prozentuale Anteile jeder Region
   - **Helligkeit und Sättigung**
   - **Spektrale Charakteristik**
   - **GIA-Farbbewertung**
   - **Gesamteindruck mit Varietät-Vorschlägen**

5. **Palette-Vergleich** (entfernt)
   - Diese Funktion wurde entfernt
   - Stattdessen: Fokus auf direkte Farbanalyse-Ergebnisse

6. **Export-Funktionen**
   - **PNG-Export**: Hochauflösendes Bild (2x Skalierung) mit allen Ergebnissen
   - **JSON-Export**: Vollständige Analyse-Daten im JSON-Format
   - **CSV-Export (Borderline v4)**: Tabellarische Zusammenfassung für weitere Analyse
   - **PDF-Export**: Professioneller PDF-Bericht mit:
     - Primärfarbe und Palette-Vergleich
     - Sekundärfarben
     - Helligkeit/Sättigung
     - Spektrale Charakteristik
     - GIA-Bewertung
     - Gesamteindruck
     - Erweiterte Parameter (Whitepoint, K-Value, etc.)
   - **PDF-Export (v4) (Borderline v4)**: Erweiterter PDF-Bericht mit Borderline-Informationen

7. **Speichern in Datenbank**
   - Authentifizierung erforderlich
   - Speichert alle Analyse-Ergebnisse
   - Speichert erweiterte Parameter (Whitepoint, K-Value, Maskierungs-Optionen, etc.)
   - Zugriff über Admin-Bereich

---

### 3.7 Über uns (`/about`)

**Route:** `app/[locale]/about/page.tsx`

**Funktionalität:**

- Über uns Sektionen
- Firmengeschichte
- Team-Informationen
- Bilder und Content

**Datenquellen:**

- `AboutContent` Model (sections)

**Verwaltung:**

- Admin: `/admin/about`
- Sektionen können verwaltet werden
- Reihenfolge steuerbar

---

### 3.8 Leistungen (`/services`)

**Route:** `app/[locale]/services/page.tsx`

**Funktionalität:**

- Übersicht der angebotenen Leistungen
- Icons und Beschreibungen
- Feature-Listen
- Call-to-Action Buttons

**Datenquellen:**

- `Service` Model

**Verwaltung:**

- Admin: API `/api/admin/services`
- Reihenfolge steuerbar
- Aktivierung pro Service

**Angezeigte Leistungen:**

- Edelstein-Beratung
- Zertifizierung
- Versand & Lieferung
- Kundenservice

---

### 3.9 Kontakt (`/contact`)

**Route:** `app/[locale]/contact/page.tsx`

**Funktionalität:**

- Kontaktformular
- Firmeninformationen
- Öffnungszeiten
- Social Media Links
- Karte (optional)

**Datenquellen:**

- `ContactData` Model

**Verwaltung:**

- Admin: `/admin/contact-data`

**API:**

- `POST /api/contact` - Kontaktformular senden

**Formular-Felder:**

- Name
- E-Mail
- Betreff
- Nachricht

---

### 3.10 Footer-Struktur

**Komponente:** `components/layout/Footer.tsx`

**Sektionen:**

1. **Kontakt & Social Media**
   - Firmeninformationen aus `ContactData`
   - Social Media Links aus `HeaderData`
   - Newsletter-Anmeldung

2. **Wer sind wir?**
   - Links zu: Über uns, Leistungen, Wissenswertes, Kontakt
   - Dynamisch aus API oder fest definiert

3. **Rechtliches**
   - Links zu allen aktiven Legal Pages
   - Dynamisch aus `LegalPage` Model

**Datenquellen:**

- `ContactData` - Kontaktinformationen
- `HeaderData` - Social Media Links
- `LegalPage` - Rechtliche Seiten
- `FooterLink` - Zusätzliche Footer-Links (optional)
- `FooterSection` - Footer-Sektionen (optional)

**API:**

- `GET /api/footer-data` - Footer-Daten abrufen

---

### 3.11 Rechtliche Seiten

#### Impressum (`/impressum` oder `/imprint`)

**Datenquelle:** `LegalPage` (slug: "impressum")

#### Datenschutz (`/datenschutz` oder `/privacy`)

**Datenquelle:** `LegalPage` (slug: "datenschutz")

#### AGB (`/agb` oder `/terms`)

**Datenquelle:** `LegalPage` (slug: "agb")

#### Widerruf (`/widerruf` oder `/returns`)

**Datenquelle:** `LegalPage` (slug: "widerruf")

#### Versand (`/versand` oder `/shipping`)

**Datenquelle:** `LegalPage` (slug: "versand")

#### Cookies (`/cookies`)

**Datenquelle:** `LegalPage` (slug: "cookies")

**Verwaltung:** Alle rechtlichen Seiten können im Admin-Bereich unter `/admin/legal-pages` verwaltet werden.

---

### 3.12 Benutzer-Bereiche

#### Profil (`/profile`)

- Kundeninformationen
- Bestellhistorie
- Rechnungen
- Wishlist-Verwaltung

#### Wunschliste (`/wishlist`)

- Synchronisiert sich beim Seitenaufruf automatisch über `useWishlistStore.fetchWishlist()` (Ladezustand, Fehlermeldungen und Retry-Button werden angezeigt)
- Leerzustand mit CTA-Buttons ("Zum Shop", "Zur Startseite") inklusive Icon und erklärendem Text
- Kartenlayout mit Produktbild (Square, Hover-Zoom), Kategorie-/Status-Badges und detaillierten Attributen (Preis, Gewicht, Herkunft, Farbe, Behandlung)
- Behandlung wird zusätzlich durch Emoji-Badges (z. B. 🔥 für heated, 💧 für oiled, 💎 für none) und farbcodierte Texte hervorgehoben
- Schnellaktionen pro Karte: Details ansehen (`/shop/{slug}`), "In den Warenkorb", Entfernen
- Seitenweite Aktionen: Teilen (Web Share API mit Clipboard-Fallback) und "Alle löschen"

#### Warenkorb (`/cart`)

- Artikel-Übersicht
- Mengenänderung
- Checkout-Vorbereitung

#### Checkout (`/checkout`)

- Adresseingabe
- Zahlungsmethode
- Bestellübersicht
- Bestellbestätigung

#### Bestellungen (`/orders/[id]`)

- Bestelldetails
- Status-Übersicht
- Download-Berechtigungen

---

## 4. Admin-Bereich

### 4.1 Zugang und Authentifizierung

**Login:** `/admin/login` oder `/admin/login-simple`

**Rollen:**

- **ADMIN:** Vollzugriff auf alle Funktionen
- **EDITOR:** Zugriff auf Content-Management
- **VIEWER:** Nur Lese-Zugriff
- **CUSTOMER:** Kein Admin-Zugriff

**Authentifizierung:**

- NextAuth.js mit Credentials-Provider
- Session-basiert
- Middleware-Schutz für Admin-Routen
- Fallback-Admin-Login möglich über ENV (`NEXT_PUBLIC_ADMIN_EMAIL`/`NEXT_PUBLIC_ADMIN_PASSWORD` oder `ADMIN_EMAIL`/`ADMIN_PASSWORD`); Default-Demo `admin@gemilike.com` / `admin123`, falls DB-User fehlt

---

### 4.2 Dashboard (`/admin/dashboard`)

**Funktionalität:**

- Übersicht über wichtige Kennzahlen
- Statistiken zu Edelsteinen, Bestellungen, Kunden
- Charts und Grafiken
- Schnellzugriff auf wichtige Funktionen

**Datenquellen:**

- Aggregierte Daten aus verschiedenen Models
- API: `GET /api/admin/dashboard`

**Angezeigte Statistiken:**

- Anzahl Edelsteine (gesamt, veröffentlicht, verkauft)
- Anzahl Bestellungen (gesamt, offen, erfüllt)
- Anzahl Kunden
- Umsatz-Statistiken
- Top-Kategorien

---

### 4.3 Edelstein-Verwaltung (`/admin/gemstones`)

#### Übersicht (`/admin/gemstones`)

- Tabelle aller Edelsteine
- Filterung nach Status, Kategorie
- Suche
- Bulk-Aktionen

#### Neuer Edelstein (`/admin/gemstones/new`)

- Formular für alle Edelstein-Daten
- Upload von Bildern/Videos
- Attribute (Größe, Gewicht, Farbe)
- Preisverwaltung
- Inventar-Verwaltung

#### Bearbeiten (`/admin/gemstones/edit/[id]`)

- Vollständige Bearbeitung aller Felder
- Media-Verwaltung
- Status-Änderung
- Veröffentlichung

**Datenbank-Models:**

- `Gemstone` (Hauptdaten)
- `GemstoneAttributes` (Attribute)
- `GemstoneInventory` (Lagerbestand)
- `GemstonePrice` (Preise)
- `GemstoneMedia` (Bilder/Videos)
- `GemstoneTag` (Tags)

**Status:**

- `DRAFT` - Entwurf
- `REVIEW` - Zur Prüfung
- `PUBLISHED` - Veröffentlicht
- `ARCHIVED` - Archiviert

---

### 4.4 Kunden-Verwaltung (`/admin/customers`)

#### Übersicht (`/admin/customers`)

- Liste aller Kunden
- Suche nach Name, Email, Kundennummer
- Filterung nach Status

#### Neuer Kunde (`/admin/customers/new`)

- Erstellung neuer Kunden
- Verknüpfung mit User-Account
- Adressverwaltung

#### Bearbeiten (`/admin/customers/edit/[id]`)

- Kundeninformationen bearbeiten
- Adressen verwalten
- Notizen hinzufügen

#### Kundenansicht (`/admin/customers/view/[id]`)

- Vollständige Kundenübersicht
- Bestellhistorie
- Rechnungen
- Download-Berechtigungen

**Datenbank-Models:**

- `Customer` (Kundendaten)
- `User` (User-Account)
- `Address` (Adressen)
- `Order` (Bestellungen)
- `Invoice` (Rechnungen)

---

### 4.5 Bestell-Verwaltung (`/admin/orders`)

#### Übersicht (`/admin/orders`)

- Liste aller Bestellungen
- Filterung nach Status, Zahlungsstatus
- Suche nach Bestellnummer, Kunde

#### Neue Bestellung (`/admin/orders/new`)

- Manuelle Bestellungserstellung
- Artikel hinzufügen
- Adressen zuweisen

#### Bearbeiten (`/admin/orders/edit/[id]`)

- Bestelldetails bearbeiten
- Status ändern
- Zahlungsstatus aktualisieren

#### Bestellansicht (`/admin/orders/view/[id]`)

- Vollständige Bestellübersicht
- Artikel-Liste
- Rechnungsverknüpfung
- Versandinformationen

**Datenbank-Models:**

- `Order` (Bestelldaten)
- `OrderItem` (Bestellpositionen)
- `Address` (Liefer-/Rechnungsadresse)
- `Customer` (Kunde)

**Status:**

- `PENDING` - Ausstehend
- `CONFIRMED` - Bestätigt
- `FULFILLED` - Erfüllt
- `CANCELLED` - Storniert
- `REFUNDED` - Rückerstattet

**Zahlungsstatus:**

- `UNPAID` - Nicht bezahlt
- `PENDING` - Ausstehend
- `PAID` - Bezahlt
- `FAILED` - Fehlgeschlagen
- `REFUNDED` - Rückerstattet

---

### 4.6 Rechnungs-Verwaltung (`/admin/rechnungen`)

#### Übersicht (`/admin/rechnungen`)

- Liste aller Rechnungen
- Filterung nach Status, Zahlungsstatus
- Suche nach Rechnungsnummer

#### Neue Rechnung (`/admin/rechnungen/neu`)

- Manuelle Rechnungserstellung
- Verknüpfung mit Bestellung
- Positionen hinzufügen

**Datenbank-Models:**

- `Invoice` (Rechnungsdaten)
- `InvoiceItem` (Rechnungspositionen)
- `BankAccount` (Bankverbindungen)
- `CompanySettings` (Firmendaten)

**Status:**

- `DRAFT` - Entwurf
- `ISSUED` - Ausgestellt
- `SENT` - Gesendet
- `OVERDUE` - Überfällig
- `PAID` - Bezahlt
- `CANCELLED` - Storniert

**Features:**

- Automatische Rechnungsnummern
- PDF-Generierung
- E-Mail-Versand
- Zahlungserinnerungen

---

### 4.7 Content-Management

#### Blog-Verwaltung (`/admin/blogs`)

- Erstellen, Bearbeiten, Löschen von Blog-Posts
- Kategorisierung und Tagging
- Veröffentlichung steuern
- Bilder hochladen

**Datenbank-Model:** `Blog`

#### Stories-Verwaltung (`/admin/stories`)

- Story-Erstellung und -Verwaltung
- Kategorisierung
- Veröffentlichung

**Datenbank-Model:** `Story`

#### Wissenswertes (`/admin/wissenswertes`)

- Knowledge Base Artikel verwalten
- Kategorisierung
- Schwierigkeitsgrad
- Veröffentlichung

**Datenbank-Model:** `KnowledgeBase`

#### Newsticker (`/admin/newsticker`)

- Newsticker-Nachrichten verwalten
- Zeitbasierte Anzeige
- Link-Funktionalität

**Datenbank-Model:** `NewstickerItem`

---

### 4.8 Newsletter-Verwaltung (`/admin/newsletter`)

**Funktionalität:**

- Abonnenten-Übersicht
- Status-Verwaltung (PENDING, CONFIRMED, UNSUBSCRIBED)
- Export-Funktion
- E-Mail-Versand

**Datenbank-Model:** `NewsletterSubscriber`

**Status:**

- `PENDING` - Ausstehend (Bestätigung)
- `CONFIRMED` - Bestätigt
- `UNSUBSCRIBED` - Abgemeldet

**API-Endpunkte:**

- `GET /api/admin/newsletter` - Abonnenten abrufen
- `POST /api/admin/newsletter/[id]/send` - Newsletter senden
- `GET /api/admin/newsletter/export` - Export als CSV

---

### 4.9 Farbtafeln-Verwaltung (`/admin/color-charts`)

**Funktionalität:**

- Übersicht aller Farbtafeln
- Erstellen neuer Farbtafeln
- Bearbeiten bestehender Farbtafeln
- Bulk-Import (JSON, CSV, Excel)
- GIA-Daten-Verwaltung

**Datenbank-Model:** `ColorChart`

**Felder:**

- `name` - Name der Farbtafel (z.B. "Mahenge Spinell")
- `slug` - URL-freundlicher Identifier
- `origin` - Herkunft
- `gia` - GIA-Daten (JSON: hue, tone, sat)
  - **Hue:** Farbton (z.B. "pkR", "R", "O", "Y", etc.)
  - **Tone:** Helligkeit (1-10)
  - **Sat:** Sättigung (1-9)
  - **Auto-Parsing:** Eingabe im Format "pkR,5,4" wird automatisch in hue="pkR", tone="5", sat="4" aufgeteilt
- `gradient` - Array von Hex-Farben
  - **Unabhängig von GIA:** Gradient kann unabhängig von GIA-Daten definiert werden
  - **GIA-Generierung:** Wenn kein manueller Gradient vorhanden, wird automatisch ein Gradient aus GIA-Daten generiert
  - **Priorität:** Manueller Gradient hat Vorrang vor GIA-Generierung
- `pleochro` - Array von Pleochroismus-Farben (Hex-Farben)
- `light` - Lichtstandard (Standard: "D55, CRI ≥95")
- `published` - Veröffentlichungsstatus
- `featured` - Featured-Status

**GIA-Daten und Gradient:**

- **Unabhängigkeit:** GIA-Daten und Gradient sind unabhängig voneinander
- **Entweder-Oder:** Es muss entweder GIA-Daten ODER Gradient vorhanden sein (mindestens eines)
- **Automatische Gradient-Generierung:** Wenn GIA-Daten vorhanden sind, aber kein manueller Gradient, wird automatisch ein Farbverlauf aus den GIA-Daten generiert
- **Manuelle Priorität:** Wenn ein manueller Gradient vorhanden ist, wird dieser verwendet (auch wenn GIA-Daten vorhanden sind)

**API-Endpunkte:**

- `GET /api/color-charts` - Farbtafeln abrufen
- `POST /api/color-charts` - Neue Farbtafel erstellen
- `GET /api/color-charts/[id]` - Einzelne Farbtafel abrufen
- `PUT /api/color-charts/[id]` - Farbtafel aktualisieren
- `DELETE /api/color-charts/[id]` - Farbtafel löschen
- `POST /api/color-charts/import` - Bulk-Import

---

### 4.10 Farbanalyse-Verwaltung (`/admin/gemstone-analyses`)

**Funktionalität:**

- Übersicht aller Farbanalysen
- Detailansicht einzelner Analysen
- Veröffentlichung steuern
- Korrekturen verwalten
- Anzeige erweiterter Analyse-Parameter

**Datenbank-Model:** `GemstoneAnalysis`

**Gespeicherte Daten (JSON):**

- `primaryColor` - Primärfarbe-Analyse
- `secondaryColors` - Sekundärfarben
- `luminanceSaturation` - Helligkeit und Sättigung
- `spectralCharacteristic` - Spektrale Charakteristik
- `giaColorGrade` - GIA-Farbbewertung
- `overallImpression` - Gesamteindruck (inkl. Varietät-Vorschläge)

**Erweiterte Analyse-Parameter:**

- `whitepoint` - Whitepoint (D50 oder D65, Standard: D65)
- `kValue` - Manueller K-Means Cluster-Wert (optional)
- `maskingOptions` - Maskierungs-Einstellungen (optional, nur wenn von Standard abweichend)
  - `white` - Filter für helle/neutrale Pixel
  - `black` - Filter für sehr dunkle Pixel
  - `lowSat` - Filter für niedrige Sättigung
  - `smart` - Smart Mask aktiviert
  - `wThr` - Weiß-Schwelle (180-250)
  - `bThr` - Schwarz-Schwelle (0-60)
  - `sThr` - Sättigungs-Schwelle (0-30)
- `customPalette` - Benutzerdefinierte Palette (Array von HEX-Farben, optional)
- `paletteComparisons` - Palette-Vergleiche (Array von Vergleichs-Ergebnissen, optional)

**Features:**

- Lernsystem für Varietät-Korrekturen
- Pleochroismus-Korrektur
- Export-Funktionen (JSON, PDF)
- Anzeige erweiterter Parameter in Detailansicht
- Palette-Vergleich-Anzeige
- Filterung und Suche nach verschiedenen Kriterien

**Detailansicht (`/admin/gemstone-analyses/[id]`):**

- Vollständige Analyse-Ergebnisse
- Bild-Vorschau
- Palette-Vergleiche (wenn vorhanden)
- Erweiterte Analyse-Parameter:
  - Whitepoint (D50/D65)
  - K-Means Cluster-Wert
  - Maskierungs-Optionen mit Details
  - Benutzerdefinierte Palette (Farbvorschau)
- Notizen und Tags
- Erstellungsdatum und Ersteller

**API-Endpunkte:**

- `GET /api/gemstone-analyses` - Analysen abrufen (mit Filterung nach published)
- `POST /api/gemstone-analyses` - Analyse speichern (inkl. erweiterte Parameter)
- `GET /api/gemstone-analyses/[id]` - Einzelne Analyse abrufen
- `PUT /api/gemstone-analyses/[id]` - Analyse aktualisieren
- `DELETE /api/gemstone-analyses/[id]` - Analyse löschen
- `POST /api/gemstone-analyses/corrections` - Korrektur speichern
- `GET /api/gemstone-analyses/corrections` - Ähnliche Korrekturen abrufen

---

### 4.11 System-Verwaltung

#### Einstellungen (`/admin/settings`)

- Firmendaten
- Rechnungseinstellungen
- Zahlungsbedingungen
- Steuer-ID, USt-ID

**Datenbank-Model:** `CompanySettings`

#### Header-Verwaltung (`/admin/header`)

- Logo-Konfiguration
- Navigation
- Social Media Links
- Suchfunktion ein/aus
- Fallback-Navigation enthält immer „Wissenswertes“ und „Download“, auch wenn DB-Navigation leer ist

**Datenbank-Model:** `HeaderData`

#### Hero-Bild (`/admin/hero-image`)

- Hero-Bilder verwalten
- Reihenfolge festlegen
- Aktivierung steuern

**Datenbank-Model:** `HeroImage`

#### Hero-Einstellungen (API)

- Titel, Untertitel
- Button-Texte und Links
- Bild-URL

**Datenbank-Model:** `HeroSettings`

#### Container-Texte Startseite (`/admin/container-content`)

- Bearbeitet die Texte zentraler Startseiten-Container
  - Blog-Sektion: Überschrift (`home.blog.heading`), Untertitel (`home.blog.subheading`)
  - Neue Edelsteine: Beschreibung (`home.newGemstones.description`)
- Lokalisierbar pro `locale`
- Fallback-Defaults, falls keine Daten vorhanden sind

**API:** `GET/PUT /api/admin/container-content`  
**Datenbank-Model:** `ContainerContent` (Schlüssel + Locale + Titel/Body)

#### Kontaktdaten (`/admin/contact-data`)

- Firmenname
- Telefon, E-Mail
- Adresse
- Öffnungszeiten
- Website

**Datenbank-Model:** `ContactData`

#### Weltkarte (`/admin/worldmap`)

- Fundorte verwalten
- Edelstein-Typen verwalten
- Länder verwalten
- Bulk-Import

**Datenbank-Models:**

- `Location`
- `GemType`
- `Country`

#### Select Options (`/admin/select-options`)

- Dropdown-Optionen verwalten
- Kategorisierung
- Reihenfolge

**Datenbank-Model:** `SelectOption`

#### Piktogramme (`/admin/pictogram-descriptions`)

- Piktogramm-Beschreibungen
- Icons
- Reihenfolge

**Datenbank-Model:** `PictogramDescription`

#### Rechtliche Seiten (`/admin/legal-pages`)

- Impressum, Datenschutz, AGB, etc.
- Mehrsprachigkeit
- Aktivierung

**Datenbank-Model:** `LegalPage`

---

### 4.12 Analytics & Reports

#### Checkout-Analytics (`/admin/checkout-analytics`)

- Analyse des Checkout-Prozesses
- Abbrüche identifizieren
- Conversion-Optimierung

**Datenbank-Model:** `CheckoutEvent`

#### Reports (`/admin/reports`)

- Umsatz-Reports
- Bestell-Reports
- Kunden-Reports
- Export-Funktionen

#### Audit-Log (`/admin/audit`)

- System-Aktivitäten protokollieren
- Benutzer-Aktionen nachverfolgen
- Sicherheits-Überwachung

**Datenbank-Model:** `AuditLog`

**Protokollierte Aktionen:**

- CREATE, UPDATE, DELETE
- LOGIN, LOGOUT
- Zugriff auf geschützte Ressourcen

---

### 4.13 Weitere Admin-Funktionen

#### Warenkörbe (`/admin/carts`)

- Übersicht aktiver Warenkörbe
- Abandoned Carts
- Warenkorb-Details

**Datenbank-Model:** `Cart`

#### Wishlists (`/admin/wishlists`)

- Übersicht aller Wishlists
- Kunden-Wishlists
- Session-Wishlists

**Datenbank-Model:** `Wishlist`

#### Reviews (`/admin/reviews`)

- Kundenbewertungen verwalten
- Verifizierung
- Moderation

**Datenbank-Model:** `Review`

#### Über uns (`/admin/about`)

- About-Content verwalten
- Sektionen mit Titel, Content, Bildern
- Reihenfolge steuern
- Mehrsprachigkeit

**Datenbank-Model:** `AboutContent`

**Felder:**

- `section` - Sektions-Identifier
- `title` - Titel der Sektion
- `content` - Markdown-Content
- `image` - Bild-URL
- `order` - Reihenfolge
- `locale` - Sprache
- `isActive` - Aktivierung

---

#### Footer-Verwaltung (API)

- Footer-Links verwalten
- Footer-Sektionen verwalten
- Reihenfolge steuern

**Datenbank-Models:**

- `FooterLink` - Footer-Links
- `FooterSection` - Footer-Sektionen

**API-Endpunkte:**

- `GET /api/admin/footer-links` - Links abrufen
- `POST /api/admin/footer-links` - Link erstellen
- `GET /api/admin/footer-links/[id]` - Einzelnen Link
- `PUT /api/admin/footer-links/[id]` - Link aktualisieren
- `DELETE /api/admin/footer-links/[id]` - Link löschen

Ähnliche APIs für Footer-Sektionen (`/api/admin/footer-sections`)

---

#### Services-Verwaltung (API)

- Leistungen verwalten
- Icons, Beschreibungen
- Features-Listen

**Datenbank-Model:** `Service`

**API-Endpunkte:**

- `GET /api/admin/services` - Services abrufen
- `POST /api/admin/services` - Service erstellen
- `GET /api/admin/services/[id]` - Einzelnen Service
- `PUT /api/admin/services/[id]` - Service aktualisieren
- `DELETE /api/admin/services/[id]` - Service löschen

---

## 5. Datenbank-Schema

### 5.1 Übersicht

Die Datenbank besteht aus **28 Haupt-Models** mit umfangreichen Relations:

#### Benutzer & Authentifizierung

- `User` - Benutzer-Accounts
- `Account` - OAuth-Accounts
- `Session` - Session-Tokens
- `VerificationToken` - E-Mail-Verifizierung

#### E-Commerce

- `Customer` - Kunden
- `Address` - Adressen
- `Cart` - Warenkörbe
- `CartItem` - Warenkorb-Artikel
- `Order` - Bestellungen
- `OrderItem` - Bestellpositionen
- `Wishlist` - Wunschlisten
- `WishlistItem` - Wunschlisten-Artikel

#### Edelsteine

- `Gemstone` - Edelsteine
- `GemstoneAttributes` - Attribute
- `GemstoneInventory` - Lagerbestand
- `GemstonePrice` - Preise
- `GemstoneMedia` - Bilder/Videos
- `GemstoneTag` - Tags
- `Tag` - Tag-Definitionen

#### Rechnungen

- `Invoice` - Rechnungen
- `InvoiceItem` - Rechnungspositionen
- `BankAccount` - Bankverbindungen
- `CompanySettings` - Firmendaten

#### Content

- `Blog` - Blog-Posts
- `Story` - Stories
- `KnowledgeBase` - Wissenswertes
- `LegalPage` - Rechtliche Seiten
- `ContainerContent` - Texte für Startseiten-Container (lokalisierbar)

#### System

- `HeaderData` - Header-Konfiguration
- `HeroImage` - Hero-Bilder
- `HeroSettings` - Hero-Einstellungen
- `ContactData` - Kontaktdaten
- `FooterLink` - Footer-Links
- `FooterSection` - Footer-Sektionen
- `NavigationItem` - Navigation
- `NewstickerItem` - Newsticker
- `NewsletterSubscriber` - Newsletter-Abonnenten
- `SelectOption` - Dropdown-Optionen
- `PictogramDescription` - Piktogramme
- `AboutContent` - Über uns
- `Service` - Leistungen
- `Location` - Fundorte
- `GemType` - Edelstein-Typen
- `Country` - Länder
- `Coupon` - Gutscheine
- `Review` - Bewertungen
- `CheckoutEvent` - Checkout-Analytics
- `AuditLog` - Audit-Log
- `DownloadGrant` - Download-Berechtigungen

#### Spezial-Features

- `ColorChart` - Farbtafeln
- `GemstoneAnalysis` - Farbanalysen (inkl. erweiterte Parameter)

---

### 5.2 Wichtige Relations

#### User → Customer

- Ein `User` kann einen `Customer` haben
- 1:1 Relation

#### Customer → Orders

- Ein `Customer` kann mehrere `Orders` haben
- 1:N Relation

#### Order → OrderItems

- Eine `Order` hat mehrere `OrderItems`
- 1:N Relation

#### Gemstone → GemstoneAttributes

- Ein `Gemstone` hat ein `GemstoneAttributes`
- 1:1 Relation

#### Gemstone → GemstoneInventory

- Ein `Gemstone` hat ein `GemstoneInventory`
- 1:1 Relation

#### Gemstone → GemstonePrice

- Ein `Gemstone` kann mehrere `GemstonePrice` haben (zeitbasierte Preise)
- 1:N Relation

#### Gemstone → GemstoneMedia

- Ein `Gemstone` kann mehrere `GemstoneMedia` haben
- 1:N Relation

#### Order → Invoice

- Eine `Order` kann eine `Invoice` haben
- 1:1 Relation

#### User → GemstoneAnalysis

- Ein `User` kann mehrere `GemstoneAnalysis` erstellen
- 1:N Relation
- `createdById` ist optional (kann NULL sein)

---

### 5.3 Detailliertes Schema: GemstoneAnalysis

**Vollständige Feldbeschreibung:**

#### Basis-Felder

- `id` (String, Primary Key) - Eindeutige ID (CUID)
- `imageUrl` (String?, optional) - URL zum analysierten Bild
- `imageName` (String?, optional) - Original-Dateiname

#### Analyse-Ergebnisse (JSON)

- `primaryColor` (Json, required) - Primärfarbe-Analyse
  - Struktur: `PrimaryColorAnalysis`
  - Enthält: hex, rgb, lab, xyz, description, originSuggestion
- `secondaryColors` (Json, required) - Sekundärfarben
  - Struktur: `SecondaryColorAnalysis[]`
  - Enthält: center, facets, shadows, percentage, pleochroismInterpretation
- `luminanceSaturation` (Json, required) - Helligkeit und Sättigung
  - Struktur: `LuminanceSaturationAnalysis`
  - Enthält: luminance, saturation, colorPurity, conclusion
- `spectralCharacteristic` (Json, required) - Spektrale Charakteristik
  - Struktur: `SpectralCharacteristic`
  - Enthält: mainAbsorption, secondaryAbsorption, transmission, weakTransmission, interpretation
- `giaColorGrade` (Json, required) - GIA-Farbbewertung
  - Struktur: `GIAColorGrade`
  - Enthält: hue, tone, saturation, finalColorGrade, summary
- `overallImpression` (Json, required) - Gesamteindruck
  - Struktur: `OverallImpression`
  - Enthält: dominantColorTone, saturation, pleochroism, possibleCause, possibleVariety, opticalQuality, overallImpression, evaluation, correctedVariety (optional)
- `pleochroism` (String?, optional) - Pleochroismus-Beschreibung

#### Erweiterte Analyse-Parameter

- `whitepoint` (String?, optional, Default: 'D65')
  - Mögliche Werte: 'D50' | 'D65'
  - Standard: 'D65' (sRGB-Display)
  - 'D50' für Druck/ICC-Profile
- `kValue` (Int?, optional)
  - Manueller K-Means Cluster-Wert
  - Bereich: 3-20
  - NULL = automatische Berechnung
- `maskingOptions` (Json?, optional)
  - Struktur: `MaskingOptions`
  - Nur gespeichert, wenn von Standard abweichend
  - Enthält:
    - `white` (boolean) - Filter für helle/neutrale Pixel
    - `black` (boolean) - Filter für sehr dunkle Pixel
    - `lowSat` (boolean) - Filter für niedrige Sättigung
    - `smart` (boolean) - Smart Mask aktiviert
    - `wThr` (number) - Weiß-Schwelle (180-250)
    - `bThr` (number) - Schwarz-Schwelle (0-60)
    - `sThr` (number) - Sättigungs-Schwelle (0-30)
- `customPalette` (Json?, optional)
  - Struktur: `string[]` (Array von HEX-Farben)
  - Beispiel: `["#FF0000", "#00FF00", "#0000FF"]`
  - Nur gespeichert, wenn nicht leer
- `paletteComparisons` (Json?, optional)
  - Struktur: `PaletteComparison[]`
  - Enthält Vergleichs-Ergebnisse mit vordefinierten und benutzerdefinierten Paletten
  - Jedes Element enthält:
    - `paletteName` (string)
    - `paletteType` ('preset' | 'custom')
    - `closestColor` (string) - HEX-Farbe
    - `deltaE76` (number) - ΔE76 Metrik
    - `deltaE2000` (number) - ΔE2000 Metrik
  - Nur gespeichert, wenn nicht leer

#### Metadaten

- `locale` (String, Default: 'de') - Sprache der Analyse
- `notes` (String?, optional) - Zusätzliche Notizen
- `tags` (String[]) - Tags für Kategorisierung (Array)

#### Status

- `published` (Boolean, Default: false) - Veröffentlichungsstatus
- `featured` (Boolean, Default: false) - Featured-Status

#### Timestamps

- `createdAt` (DateTime) - Erstellungsdatum (automatisch)
- `updatedAt` (DateTime) - Aktualisierungsdatum (automatisch)

#### Relations

- `createdById` (String?, optional) - ID des erstellenden Users
- `createdBy` (User?, optional) - Relation zum User

#### Indizes

- `createdAt` - Für Sortierung nach Datum
- `published` - Für Filterung nach Veröffentlichungsstatus
- `createdById` - Für Filterung nach Ersteller

---

### 5.4 Enums

#### UserRole

- `CUSTOMER` - Standard-Kunde
- `ADMIN` - Administrator
- `EDITOR` - Redakteur
- `VIEWER` - Nur Lese-Zugriff

#### GemstoneStatus

- `DRAFT` - Entwurf
- `REVIEW` - Zur Prüfung
- `PUBLISHED` - Veröffentlicht
- `ARCHIVED` - Archiviert

#### GemstoneCondition

- `CUT` - Geschliffen
- `ROUGH` - Roh

#### OrderStatus

- `PENDING` - Ausstehend
- `CONFIRMED` - Bestätigt
- `FULFILLED` - Erfüllt
- `CANCELLED` - Storniert
- `REFUNDED` - Rückerstattet

#### PaymentStatus

- `UNPAID` - Nicht bezahlt
- `PENDING` - Ausstehend
- `PAID` - Bezahlt
- `FAILED` - Fehlgeschlagen
- `REFUNDED` - Rückerstattet

#### InvoiceStatus

- `DRAFT` - Entwurf
- `ISSUED` - Ausgestellt
- `SENT` - Gesendet
- `OVERDUE` - Überfällig
- `PAID` - Bezahlt
- `CANCELLED` - Storniert

---

## 6. API-Dokumentation

### 6.1 Öffentliche APIs

#### Cart API

- `GET /api/cart` - Warenkorb abrufen
- `POST /api/cart` - Artikel hinzufügen
- `PUT /api/cart` - Warenkorb aktualisieren
- `DELETE /api/cart` - Artikel entfernen

#### Wishlist API

- `GET /api/wishlist` - Wishlist abrufen
- `POST /api/wishlist` - Artikel hinzufügen
- `POST /api/wishlist/sync` - Synchronisierung

#### Orders API

- `POST /api/orders` - Bestellung erstellen
- `POST /api/orders/confirmation` - Bestätigungs-E-Mail

#### Newsletter API

- `POST /api/newsletter` - Newsletter-Anmeldung
- `GET /api/newsletter/subscribers` - Abonnenten (nur Admin)

#### Contact API

- `POST /api/contact` - Kontaktformular senden

#### Search API

- `POST /api/search/advanced` - Erweiterte Suche

#### Downloads API

- `GET /api/downloads/files/[fileId]` - Datei-Download

#### Color Charts API

- `GET /api/color-charts` - Farbtafeln abrufen
- `GET /api/color-charts/[id]` - Einzelne Farbtafel
- `GET /api/color-charts/[id]/export/json` - JSON-Export

#### Gemstone Analyses API

- `GET /api/gemstone-analyses` - Analysen abrufen
  - Query-Parameter: `locale`, `published` (nur für Admin)
  - Rückgabe: Array von Analysen mit erweiterten Parametern
- `POST /api/gemstone-analyses` - Analyse speichern (authentifiziert)
  - Body-Parameter:
    - `imageUrl`, `imageName`
    - `primaryColor`, `secondaryColors`, `luminanceSaturation`, `spectralCharacteristic`, `giaColorGrade`, `overallImpression`
    - `pleochroism` (optional)
    - `whitepoint` (optional, Standard: 'D65')
    - `kValue` (optional, Int)
**Felder:**

- `section` - Sektions-Identifier
- `title` - Titel der Sektion
- `content` - Markdown-Content
- `image` - Bild-URL
- `order` - Reihenfolge
- `locale` - Sprache
- `isActive` - Aktivierung
    - `maskingOptions` (optional, JSON)
    - `customPalette` (optional, string[])
    - `paletteComparisons` (optional, JSON)
    - `locale`, `notes`, `tags`, `published`, `featured`
  - Rückgabe: Erstellte Analyse mit ID
- `GET /api/gemstone-analyses/[id]` - Einzelne Analyse abrufen
  - Öffentlich: Nur veröffentlichte Analysen
  - Admin: Alle Analysen
  - Rückgabe: Vollständige Analyse mit erweiterten Parametern
- `PUT /api/gemstone-analyses/[id]` - Analyse aktualisieren (nur Admin oder Ersteller)
  - Body: Alle Felder wie bei POST
  - Rückgabe: Aktualisierte Analyse
- `DELETE /api/gemstone-analyses/[id]` - Analyse löschen (nur Admin oder Ersteller)
  - Rückgabe: Success-Message
- `POST /api/gemstone-analyses/corrections` - Korrektur speichern
- `GET /api/gemstone-analyses/corrections` - Ähnliche Korrekturen abrufen

---

### 6.2 Admin APIs

Alle Admin-APIs erfordern Authentifizierung und ADMIN-Rolle.

#### Gemstones API

- `GET /api/admin/gemstones` - Edelsteine abrufen
- `POST /api/admin/gemstones` - Neuen Edelstein erstellen
- `GET /api/admin/gemstones/[id]` - Einzelnen Edelstein
- `PUT /api/admin/gemstones/[id]` - Edelstein aktualisieren
- `DELETE /api/admin/gemstones/[id]` - Edelstein löschen

#### Customers API

- `GET /api/admin/customers` - Kunden abrufen
- `POST /api/admin/customers` - Neuen Kunden erstellen
- `GET /api/admin/customers/[id]` - Einzelnen Kunden
- `PUT /api/admin/customers/[id]` - Kunden aktualisieren
- `DELETE /api/admin/customers/[id]` - Kunden löschen

#### Orders API

- `GET /api/admin/orders` - Bestellungen abrufen
- `POST /api/admin/orders` - Neue Bestellung erstellen
- `GET /api/admin/orders/[id]` - Einzelne Bestellung
- `PUT /api/admin/orders/[id]` - Bestellung aktualisieren

#### Invoices API

- `GET /api/admin/invoices` - Rechnungen abrufen
- `POST /api/admin/invoices` - Neue Rechnung erstellen
- `GET /api/admin/invoices/[id]` - Einzelne Rechnung
- `PUT /api/admin/invoices/[id]` - Rechnung aktualisieren
- `POST /api/admin/invoices/[id]/status` - Status ändern

#### Content APIs

- `GET /api/admin/blogs` - Blogs abrufen
- `POST /api/admin/blogs` - Neuen Blog erstellen
- `GET /api/admin/blogs/[id]` - Einzelnen Blog
- `PUT /api/admin/blogs/[id]` - Blog aktualisieren
- `DELETE /api/admin/blogs/[id]` - Blog löschen

Ähnliche APIs für:

- Stories (`/api/admin/stories`)
- Knowledge Base (`/api/admin/knowledge-base`)
- Legal Pages (`/api/admin/legal-pages`)
- Services (`/api/admin/services`)

#### System APIs

- `GET /api/admin/dashboard` - Dashboard-Statistiken
- `GET /api/admin/header` - Header-Daten
- `PUT /api/admin/header` - Header aktualisieren
- `GET /api/admin/container-content` - Container-Texte für Startseite abrufen (keys, locale)
- `PUT /api/admin/container-content` - Container-Texte für Startseite speichern
- `GET /api/admin/settings` - Einstellungen
- `PUT /api/admin/settings` - Einstellungen aktualisieren

---

## 7. Funktionsbeschreibungen

### 7.1 Farbanalyse-System

**Zweck:** Automatische Farbanalyse von Edelstein-Bildern mit erweiterten Optionen

**Funktionalität:**

1. **Bild-Upload** - Hochladen eines oder mehrerer Edelstein-Bilder
2. **Erweiterte Einstellungen** - Whitepoint, K-Value, Maskierungs-Optionen, Custom Palette, GrabCut
3. **Farb-Extraktion** - Automatische Extraktion der dominanten Farben
4. **Region-Analyse** - Analyse verschiedener Bereiche (Zentrum, Facetten, Schatten)
5. **GIA-Bewertung** - GIA-konforme Farbbewertung (Hue, Tone, Saturation)
6. **Varietät-Vorschlag** - Vorschlag möglicher Edelstein-Varietäten
7. **Pleochroismus-Analyse** - Automatische Erkennung von Pleochroismus
8. **Palette-Vergleich** - Vergleich mit vordefinierten und benutzerdefinierten Paletten
9. **Lernsystem** - Lernen aus manuellen Korrekturen
10. **Export-Funktionen** - PNG, JSON, PDF

**Verbesserungen (Version 2.2.0):**

#### Verbesserte Farbklassifizierung

**Violett-Erkennung:**
- Präzise Unterscheidung zwischen Violett und Rot-Violett
- RGB-basierte Validierung für alle Farbklassifizierungen
- CIE-Hue-Berechnung berücksichtigt RGB-Werte für bessere Genauigkeit
- Sekundäre Farben erhalten ebenfalls CIE-Hue-Berechnung
- Verhindert Fehlklassifizierung von violetten Steinen als Rot

**Fallback-Mechanismus für Pixelextraktion:**
- **3-stufiger Fallback** bei restriktiven Masken:
  1. **Stufe 1**: Normale Maskierung (wie bisher)
  2. **Stufe 2**: Zentrale Region (60% des Bildes) wenn Maske zu restriktiv
  3. **Stufe 3**: Gesamtes Bild ohne Ränder (10% Rand abgeschnitten) als letzter Fallback
- Lockere Alpha-Kanal-Prüfung (nur vollständig transparente Pixel werden gefiltert)
- Überspringt reines Schwarz für bessere Ergebnisse
- Gewichtung für Fallback-Pixel (0.8 bzw. 0.5 statt 1.0)
- Verbesserte Fehlermeldungen mit Hinweisen

**Erweiterte Features (Borderline v4):**

#### Borderline v4: Erweiterte Algorithmen

**K-Means++ mit Auto-K via GMM+BIC:**

- **K-Means++ Initialisierung:** Intelligente Startpunkte für bessere Cluster-Qualität
- **Auto-K Bestimmung:** Automatische Clusterzahl-Bestimmung (3-8) via Gaussian Mixture Model mit Bayesian Information Criterion
- **Stabile Clusterzahl:** Vermeidet Über- oder Unter-Clustering
- **Vorteil:** Datengetriebene, optimale Clusterzahl pro Bild

**SLIC Superpixels + Guided Filter:**

- **SLIC Superpixels:** Segmentierung in homogene Regionen für robustere Maskierung
- **Guided Filter:** Edge-preserving Glättung der Maske basierend auf Bildintensität
- **Majority Voting:** Entscheidung pro Superpixel basierend auf Mehrheit
- **Vorteil:** Glattere Masken, weniger Randkontamination, bessere Kantenerkennung

**ICC-Profil-Unterstützung:**

- **ICC-Parser:** Extrahiert Weißpunkt (wtpt) und RGB-Colorant-XYZ aus ICC-Profilen
- **Bradford-Adaptation:** Automatische Farbkonvertierung zum ICC-Weißpunkt
- **Priorität:** ICC-Weißpunkt hat Vorrang über D50/D65 Toggle
- **Vorteil:** Präzise Farbanalyse mit korrektem Farbprofil

**Borderline-Erkennung:**

- **Zirkuläre Statistik:** Korrekte Berechnung von Hue-Mittelwerten (0° = 360°)
- **Soft Category Classification:** Wahrscheinlichkeits-basierte Farbkategorisierung
- **Hue Histogram Peak Detection:** Erkennung mehrerer Farb-Peaks (z.B. bei Pleochroismus)
- **Vorteil:** Erkennung von Grenzfarben zwischen Kategorien (z.B. Gelbgrün/Grün)

**Erweiterte Export-Funktionen:**

- **JSON-Export:** Vollständige Analyse-Daten inkl. Borderline-Informationen
- **CSV-Export:** Tabellarische Zusammenfassung für weitere Analyse
- **PDF-Export (v4):** Detaillierter Bericht mit allen neuen Features

#### Whitepoint-Auswahl

- **D65** (Standard): Standard für sRGB-Displays, Tageslicht-ähnlich
- **D50**: Standard für Druck/ICC-Profile, neutraleres Weiß
- **Bradford-Chromatic-Adaptation**: Automatische Farbkonvertierung zwischen Whitepoints
- Beeinflusst alle Farbberechnungen (Lab, ΔE2000, etc.)

#### K-Means Clustering

- **Automatisch (Standard)**: Adaptive Cluster-Anzahl (3-20) basierend auf Bildgröße
- **Auto-K via GMM+BIC (Borderline v4)**: Automatische, datengetriebene Clusterzahl (3-8) via Gaussian Mixture Model
- **Manuell**: Benutzerdefinierte Cluster-Anzahl (3-20)
- **K-Means++ Initialisierung**: Optimierte Startwerte für bessere Ergebnisse
- **CIEDE2000-Distanz**: Wahrnehmungsgerechte Farbdistanz
- **Gewichtete Durchschnitte**: Berücksichtigt Pixel-Gewichte

#### Maskierungs-Optionen

- **Automatische Hintergrund-Erkennung**: Standard-Verfahren
  - Ecken- und Kanten-Sampling
  - Durchschnittliche Hintergrundfarbe
  - Kontrast-basierte Segmentierung
  - Flood-Fill vom Zentrum
- **Erweiterte Filter**:
  - **Weiß-Filter**: Filtert helle/neutrale Pixel (Schwelle: 180-250)
  - **Schwarz-Filter**: Filtert sehr dunkle Pixel (Schwelle: 0-60)
  - **Sättigungs-Filter**: Filtert ungesättigte Pixel (Schwelle: 0-30)
  - **Smart Mask**: Intelligente Kanten-Erkennung
- **SLIC Superpixels (Borderline v4)**:
  - Segmentierung in homogene Regionen
  - Superpixel-Größe einstellbar (8-32 Pixel, default: 16)
  - Kompaktheit einstellbar (5-30, default: 10)
  - Verbessert Masken-Qualität durch räumliche Zusammenhänge
- **Guided Filter (Borderline v4)**:
  - Edge-preserving Glättung der Maske
  - Radius einstellbar (2-8 Pixel, default: 4)
  - Regularisierung einstellbar (10⁻⁶ bis 10⁻², default: 10⁻³)
  - Glattere Masken ohne Verlust von Kanten
- **OpenCV GrabCut** (optional):
  - Präzise Hintergrund-Trennung
  - Rechteck-Initialisierung
  - Vordergrund/Hintergrund-Pinsel
  - Dynamisches Laden von OpenCV.js (~8MB)

#### Palette-Vergleich

- **Vordefinierte Paletten**: Vergleich mit Standard-Paletten (z.B. "Saphir-Blau (royal)")
- **Benutzerdefinierte Paletten**: Manuell hinzugefügte HEX-Farben
- **ΔE76 und ΔE2000 Metriken**: Zwei verschiedene Farbdistanz-Berechnungen
- **Beste Übereinstimmungen**: Sortierung nach geringster Farbdistanz

#### Mehrere Bilder

- **Multi-Upload**: Mehrere Bilder in einem Vorgang
- **Tab-Navigation**: Wechsel zwischen Bildern
- **Separate Analyse**: Jedes Bild wird unabhängig analysiert
- **State-Management**: Analyse-Ergebnisse bleiben erhalten beim Wechseln

**Technische Details:**

- **Algorithmus:** CIEDE2000 für Farbvergleiche
- **Farbraum:** Lab (CIE L*a*b*) mit Whitepoint-Unterstützung
- **Clustering:**
  - Standard: K-Means (adaptiv oder manuell)
  - Borderline v4: K-Means++ mit Auto-K via GMM+BIC
- **Segmentierung:**
  - Standard: Automatische Hintergrund-Erkennung
  - Borderline v4: SLIC Superpixels + Guided Filter
  - Optional: OpenCV GrabCut
- **Edge Detection:** Für Facetten-Erkennung
- **Adaptive Sampling:** Für wichtige Bildbereiche
- **Bradford-Adaptation:** Für Whitepoint-Konvertierung (D65 ↔ D50 ↔ ICC)
- **ICC-Profil-Unterstützung:** Automatische Weißpunkt-Extraktion und -Verwendung
- **Borderline-Erkennung:** Zirkuläre Statistik + Soft Category Classification
- **OpenCV.js:** Für GrabCut-Segmentierung (optional)

**Datenbank:**

- `GemstoneAnalysis` - Gespeicherte Analysen mit erweiterten Parametern:
  - `whitepoint` (String: 'D50' | 'D65')
  - `kValue` (Int, optional)
  - `maskingOptions` (JSON, optional)
  - `customPalette` (JSON: string[], optional)
  - `paletteComparisons` (JSON: PaletteComparison[], optional)
  - `borderline` (JSON, optional) - Borderline v4: Borderline-Analyse-Ergebnisse
- Korrekturen werden in `overallImpression.correctedVariety` gespeichert

---

### 7.2 Farbtafeln-System

**Zweck:** GIA-konforme Darstellung von Edelstein-Farben

**Funktionalität:**

1. **Farbtafel-Erstellung** - Erstellen von Farbtafeln mit GIA-Daten oder manuellen Gradienten
2. **Gradient-Anzeige** - Visualisierung von Farbverläufen
   - **Manuelle Gradienten:** Direkte Eingabe von Hex-Farben
   - **GIA-Generierung:** Automatische Generierung aus GIA-Daten (Hue, Tone, Saturation)
3. **Pleochroismus-Visualisierung** - Anzeige von Pleochroismus-Farben
4. **DeltaE2000-Vergleich** - Vergleich mit anderen Farbtafeln
5. **Export-Funktionen** - PNG, JSON (PDF-Export entfernt)

**GIA-Daten-Eingabe:**

- **Format:** Hue, Tone, Saturation (separate Felder)
- **Kombiniertes Format:** Eingabe im Format "pkR,5,4" wird automatisch geparst:
  - Hue: "pkR"
  - Tone: "5"
  - Sat: "4"
- **Auto-Parsing:** Komma-getrennte Werte werden automatisch aufgeteilt

**Gradient-Generierung aus GIA-Daten:**

- **Algorithmus:** Konvertierung von GIA-Daten (Hue, Tone, Saturation) in Lab-Farbraum
- **Schritte:**
  1. Basis-Hue-Mapping: Jeder GIA-Hue wird einem Lab-Farbpunkt zugeordnet
  2. Tone-Anpassung: Helligkeit (L*) wird basierend auf Tone (1-10) skaliert
  3. Saturation-Anpassung: Chroma (a*, b*) wird basierend auf Sat (1-9) skaliert
  4. Gradient-Generierung: 5 Farbstufen werden generiert mit leichten Variationen in Helligkeit und Sättigung
  5. Konvertierung: Lab → XYZ → RGB → Hex
- **Ergebnis:** Ein Farbverlauf mit 5 Farben, der die GIA-Daten visuell repräsentiert

**Technische Details:**

- **GIA-Format:** Hue, Tone, Saturation
- **Farbraum-Konvertierung:** Hex → RGB → XYZ → Lab (und umgekehrt)
- **DeltaE2000:** CIEDE2000-Algorithmus für Farbvergleiche
- **GIA-Gradient:** Automatische Generierung von Farbverläufen aus GIA-Daten

**Datenbank:**

- `ColorChart` - Farbtafeln
  - `gia` (JSON): Hue, Tone, Saturation
  - `gradient` (Array): Hex-Farben (manuell oder GIA-generiert)
  - `pleochro` (Array): Hex-Farben für Pleochroismus

---

### 7.3 E-Commerce-Funktionen

**Shop-Suche und Filterung (Stand: 20.12.2025):**

- **Semantische Vektorsuche:**
  - Vollständige Integration aller Edelstein-Attribute in die Suche
  - Synonym-Unterstützung für natürliche Sprache (z. B. "vivid" findet auch "lebhaft")
  - Explizite Suche nach Zertifikaten ("mit/ohne Zertifikat")
  - Explizite Suche nach Behandlung ("mit/ohne Behandlung")
  - Mehrsprachige Benutzeroberfläche (Deutsch/Englisch)

- **Internationalisierung:**
  - Shop-Seite vollständig übersetzt
  - Alle UI-Texte, Fehlermeldungen und Statusmeldungen mehrsprachig
  - Dynamische Locale-Erkennung über URL-Parameter (`/de/shop` oder `/en/shop`)

#### Warenkorb

- Session-basierter Warenkorb
- Persistierung für eingeloggte Benutzer
- Cookie-basierte Speicherung

#### Checkout-Prozess

1. Warenkorb-Übersicht
2. Adresseingabe (Lieferung, Rechnung)
3. Zahlungsmethode
4. Bestellübersicht
5. Bestellbestätigung

**Analytics:**

- Checkout-Events werden protokolliert
- Abbrüche werden erfasst
- Conversion-Tracking

#### Bestellverwaltung

- Automatische Bestellnummern
- Status-Verwaltung
- E-Mail-Benachrichtigungen
- Rechnungsgenerierung

---

### 7.4 Rechnungs-System

**Funktionalität:**

1. **Automatische Generierung** - Bei Bestellung
2. **Manuelle Erstellung** - Im Admin-Bereich
3. **PDF-Generierung** - Automatische PDF-Erstellung
4. **E-Mail-Versand** - Automatischer Versand
5. **Zahlungserinnerungen** - Automatische Erinnerungen

**Features:**

- Automatische Rechnungsnummern
- Firmendaten-Integration
- Bankverbindungen
- Steuerberechnung
- Zahlungsstatus-Tracking

**Datenbank:**

- `Invoice` - Rechnungen
- `InvoiceItem` - Rechnungspositionen
- `BankAccount` - Bankverbindungen
- `CompanySettings` - Firmendaten

---

### 7.5 Content-Management

#### Blog-System

- Markdown-Editor
- Bild-Upload
- Kategorisierung
- Tagging
- SEO-Optimierung
- Mehrsprachigkeit

#### Knowledge Base

- Strukturierte Artikel
- Kategorisierung
- Schwierigkeitsgrad
- Lesedauer-Berechnung
- Suchfunktion

#### Stories

- Story-Erstellung
- Kategorisierung
- Veröffentlichung
- Reihenfolge

---

### 7.6 Newsletter-System

**Funktionalität:**

1. **Anmeldung** - Öffentliche Anmeldung
2. **Bestätigung** - E-Mail-Bestätigung
3. **Verwaltung** - Admin-Verwaltung
4. **Versand** - Newsletter-Versand
5. **Export** - CSV-Export

**Status-Verwaltung:**

- PENDING - Wartet auf Bestätigung
- CONFIRMED - Bestätigt
- UNSUBSCRIBED - Abgemeldet

---

## 8. Mathematische und Physikalische Verfahren

Dieser Abschnitt erklärt alle mathematischen und physikalischen Algorithmen, die im Farbanalyse-System verwendet werden. Die Erklärungen sind so formuliert, dass sie auch für Nicht-Mathematiker verständlich sind.

---

### 8.1 Farbraum-Konvertierungen

#### 8.1.1 RGB → XYZ Konvertierung

**Zweck:** Umwandlung von Bildschirm-Farben (RGB) in einen geräteunabhängigen Farbraum (XYZ).

**Physikalischer Hintergrund:**

- RGB ist geräteabhängig (jeder Monitor zeigt Farben leicht anders)
- XYZ ist ein absoluter Farbraum, der auf menschlicher Farbwahrnehmung basiert
- XYZ beschreibt Farben durch drei Werte: X (Rot-Anteil), Y (Helligkeit), Z (Blau-Anteil)

**Mathematische Formel:**

```
1. Gamma-Korrektur (sRGB → Linear RGB):
   - Wenn R ≤ 0.04045: R_linear = R / 12.92
   - Sonst: R_linear = ((R + 0.055) / 1.055)^2.4
   (Gleiches für G und B)

2. Matrix-Multiplikation (sRGB → XYZ):
   [X]   [0.4124  0.3576  0.1805] [R_linear]
   [Y] = [0.2126  0.7152  0.0722] [G_linear]
   [Z]   [0.0193  0.1192  0.9505] [B_linear]
```

**Warum wichtig?**

- XYZ ist die Basis für alle weiteren Farbberechnungen
- Ermöglicht präzise Farbvergleiche unabhängig vom Ausgabegerät

---

#### 8.1.2 XYZ → Lab (CIE L*a*b*) Konvertierung

**Zweck:** Umwandlung in einen wahrnehmungsgerechten Farbraum, in dem Abstände der menschlichen Farbwahrnehmung entsprechen.

**Physikalischer Hintergrund:**

- Lab wurde entwickelt, damit gleiche Abstände im Lab-Raum auch gleichen wahrgenommenen Farbunterschieden entsprechen
- L* = Helligkeit (0 = schwarz, 100 = weiß)
- a* = Rot-Grün-Achse (positiv = rot, negativ = grün)
- b* = Gelb-Blau-Achse (positiv = gelb, negativ = blau)

**Mathematische Formel:**

```
1. Normalisierung mit Weißpunkt (Xn, Yn, Zn):
   fx = f(X/Xn)
   fy = f(Y/Yn)
   fz = f(Z/Zn)

2. f-Funktion (nichtlinear):
   f(t) = t^(1/3) wenn t > (6/29)^3
   f(t) = (1/3) * (29/6)^2 * t + 4/29 sonst

3. Lab-Berechnung:
   L* = 116 * fy - 16
   a* = 500 * (fx - fy)
   b* = 200 * (fy - fz)
```

**Warum wichtig?**

- Lab ist der Standard-Farbraum für Farbanalyse
- Ermöglicht präzise Farbvergleiche (Delta E)
- Wird von GIA (Gemological Institute of America) verwendet

---

#### 8.1.3 Bradford Chromatic Adaptation

**Zweck:** Anpassung von Farbwerten zwischen verschiedenen Beleuchtungsbedingungen (z.B. Tageslicht D65 → D50).

**Physikalischer Hintergrund:**

- Farben sehen unter verschiedenen Lichtquellen unterschiedlich aus
- D65 = Tageslicht (6500K Farbtemperatur) - Standard für Monitore
- D50 = Neutralweiß (5000K) - Standard für Druck/ICC-Profile
- Bradford-Transformation simuliert, wie das menschliche Auge Farben unter verschiedenen Lichtquellen wahrnimmt

**Mathematische Formel:**

```
1. Konvertierung in "Cone Response" Domain:
   [L]   [0.8951  0.2664  -0.1614] [X]
   [M] = [-0.7502 1.7135  0.0367]  [Y]
   [S]   [0.0389  -0.0685 1.0296]  [Z]

2. Skalierung mit Weißpunkt-Verhältnis:
   L' = L * (Yn_dest / Yn_source)
   M' = M * (Yn_dest / Yn_source)
   S' = S * (Zn_dest / Zn_source)

3. Rückkonvertierung:
   [X']   [0.9869929  -0.1470543  0.1599627] [L']
   [Y'] = [0.4323053  0.5183603  0.0492912]  [M']
   [Z']   [-0.0085287 0.0400428  0.9684867]  [S']
```

**Warum wichtig?**

- Ermöglicht präzise Farbanalyse unter verschiedenen Beleuchtungsbedingungen
- Notwendig für ICC-Profil-Unterstützung
- Wichtig für professionelle Farbanalyse

---

### 8.2 Clustering-Algorithmen

#### 8.2.1 K-Means Clustering

**Zweck:** Gruppierung ähnlicher Farben in Cluster, um die dominanten Farben eines Edelsteins zu identifizieren.

**Grundprinzip:**

1. **Initialisierung:** Wähle K zufällige Farben als Cluster-Zentren (Centroids)
2. **Zuordnung:** Weise jeden Pixel dem nächstgelegenen Cluster zu
3. **Aktualisierung:** Berechne neue Cluster-Zentren als Durchschnitt aller zugeordneten Pixel
4. **Wiederholung:** Wiederhole Schritt 2-3 bis Konvergenz (keine Änderungen mehr)

**Mathematische Formel:**

```
Distanz zwischen Pixel p und Cluster c:
d(p, c) = √[(R_p - R_c)² + (G_p - G_c)² + (B_p - B_c)²]

Neues Cluster-Zentrum:
c_new = (1/n) * Σ(p_i) für alle Pixel p_i im Cluster
```

**Parameter:**

- **K:** Anzahl der Cluster (3-20, typischerweise 5-8)
- **Max Iterationen:** Maximale Anzahl Wiederholungen (typischerweise 20-25)

**Warum wichtig?**

- Identifiziert die dominanten Farben eines Edelsteins
- Reduziert Millionen von Pixeln auf wenige repräsentative Farben
- Basis für alle weiteren Analysen

---

#### 8.2.2 K-Means++ Initialisierung

**Zweck:** Intelligente Auswahl der Startpunkte für K-Means, um bessere Ergebnisse zu erzielen.

**Problem mit Standard K-Means:**

- Zufällige Initialisierung kann zu schlechten Ergebnissen führen
- Cluster können zu nah beieinander starten
- Kann zu lokalen Minima führen

**K-Means++ Lösung:**

1. Wähle ersten Centroid zufällig
2. Für jeden weiteren Centroid:
   - Berechne Abstand jedes Pixels zum nächstgelegenen existierenden Centroid
   - Wähle Pixel mit größtem Abstand (höhere Wahrscheinlichkeit für weit entfernte Pixel)

**Mathematische Formel:**

```
Wahrscheinlichkeit für Pixel p als nächster Centroid:
P(p) = d(p, nearest_centroid)² / Σ(d(q, nearest_centroid)²)
```

**Vorteile:**

- Bessere Cluster-Verteilung
- Schnellere Konvergenz
- Weniger lokale Minima
- ~30% bessere Ergebnisse im Durchschnitt

---

#### 8.2.3 Gaussian Mixture Model (GMM) mit BIC

**Zweck:** Automatische Bestimmung der optimalen Anzahl von Farb-Clustern (K).

**Grundprinzip:**

- Statt manuell K zu wählen, testet GMM verschiedene K-Werte (3-8)
- Für jedes K wird ein Gaussian Mixture Model trainiert
- BIC (Bayesian Information Criterion) bewertet jedes Modell
- Modell mit niedrigstem BIC-Wert wird gewählt

**Gaussian Mixture Model:**

- Jeder Cluster wird als Gaußsche Verteilung (Normalverteilung) modelliert
- Jede Verteilung hat Mittelwert (μ) und Varianz (σ²)
- Wahrscheinlichkeit, dass ein Pixel zu einem Cluster gehört, wird berechnet

**Mathematische Formel:**

```
Wahrscheinlichkeit für Pixel x in Cluster k:
P(x|k) = (1/√(2πσ²)) * exp(-(x-μ)²/(2σ²))

BIC (Bayesian Information Criterion):
BIC = -2 * log(Likelihood) + k * log(n)
wobei:
- Likelihood = Wahrscheinlichkeit der Daten unter dem Modell
- k = Anzahl Parameter
- n = Anzahl Datenpunkte
```

**Vorteile:**

- Automatische, datengetriebene Clusterzahl
- Vermeidet Über-Clustering (zu viele Cluster)
- Vermeidet Unter-Clustering (zu wenige Cluster)
- Optimal für jedes Bild individuell

---

### 8.3 Bildsegmentierung

#### 8.3.1 SLIC Superpixels

**Zweck:** Segmentierung des Bildes in homogene Regionen (Superpixels), um präzisere Masken zu erstellen.

**Grundprinzip:**

- Statt pixelweise zu arbeiten, werden Pixel in Gruppen (Superpixels) zusammengefasst
- Superpixels sind homogene Regionen mit ähnlichen Farben und Positionen
- Verbessert Masken-Qualität durch Berücksichtigung von Nachbarschaften

**Algorithmus:**

1. **Initialisierung:** Platziere Cluster-Zentren in regelmäßigem Gitter (Abstand = step)
2. **Zuordnung:** Weise jeden Pixel dem nächstgelegenen Cluster zu (basierend auf Farbe + Position)
3. **Aktualisierung:** Berechne neues Cluster-Zentrum als Durchschnitt aller zugeordneten Pixel
4. **Wiederholung:** Wiederhole 2-3 für 10 Iterationen

**Mathematische Formel:**

```
Distanz zwischen Pixel p und Cluster c:
d = √[(dc/m)² + (ds/S)²]
wobei:
- dc = Farbdistanz (RGB): √[(R_p-R_c)² + (G_p-G_c)² + (B_p-B_c)²]
- ds = Raumdistanz (XY): √[(x_p-x_c)² + (y_p-y_c)²]
- m = Kompaktheits-Parameter (10-30, default: 10)
- S = Superpixel-Größe (step)
```

**Parameter:**

- **step:** Superpixel-Größe (8-32 Pixel, default: 16)
- **m:** Kompaktheit (5-30, default: 10) - höher = kompaktere Superpixels

**Vorteile:**

- Glattere Masken
- Weniger Randkontamination
- Bessere Kantenerkennung
- Berücksichtigt räumliche Zusammenhänge

---

#### 8.3.2 Guided Filter

**Zweck:** Glättung einer Maske unter Beibehaltung scharfer Kanten, basierend auf dem Originalbild.

**Grundprinzip:**

- Verwendet das Originalbild als "Führung" (Guide)
- Glättet die Maske, aber nur dort, wo das Originalbild auch glatt ist
- Erhält scharfe Kanten dort, wo das Originalbild Kanten hat

**Mathematische Formel:**

```
Für jeden Pixel i:
1. Berechne lokale Mittelwerte (Box-Filter):
   mean_I = Durchschnitt von I in Fenster um i
   mean_p = Durchschnitt von p (Maske) in Fenster um i

2. Berechne lokale Varianz:
   var_I = Varianz von I in Fenster um i

3. Berechne Koeffizienten:
   a = cov(I, p) / (var_I + ε)
   b = mean_p - a * mean_I

4. Glättung:
   q_i = a * I_i + b
```

**Parameter:**

- **r:** Radius des Glättungsfensters (2-8 Pixel, default: 4)
- **ε:** Regularisierung (10⁻⁶ bis 10⁻², default: 10⁻³) - verhindert Division durch Null

**Vorteile:**

- Glattere Masken ohne Verlust von Kanten
- Weniger Rauschen
- Bessere Qualität als einfache Glättung
- Edge-preserving (kantenerhaltend)

---

### 8.4 Farbdistanz-Metriken

#### 8.4.1 CIEDE2000 (Delta E 2000)

**Zweck:** Berechnung der wahrgenommenen Farbdistanz zwischen zwei Farben im Lab-Farbraum.

**Physikalischer Hintergrund:**

- Einfache euklidische Distanz in Lab entspricht nicht der menschlichen Wahrnehmung
- CIEDE2000 berücksichtigt:
  - Unterschiedliche Empfindlichkeit in verschiedenen Farbbereichen
  - Chroma (Sättigung) und Hue (Farbton) Interaktionen
  - Helligkeits-Kompensation

**Mathematische Formel (vereinfacht):**

```
1. Berechne Hilfsvariablen:
   C* = √(a*² + b*²)  (Chroma)
   h = atan2(b*, a*)  (Hue-Winkel)

2. Gewichtungen:
   SL = 1 + (0.015 * (L* - 50)²) / √(20 + (L* - 50)²)
   SC = 1 + 0.045 * C*
   SH = 1 + 0.015 * C* * T

3. Delta E 2000:
   ΔE00 = √[(ΔL'/SL)² + (ΔC'/SC)² + (ΔH'/SH)² + RT * (ΔC'/SC) * (ΔH'/SH)]
```

**Interpretation:**

- **ΔE00 < 1:** Unterschied ist für das menschliche Auge nicht wahrnehmbar
- **ΔE00 < 3:** Sehr ähnliche Farben (professionell akzeptabel)
- **ΔE00 < 6:** Ähnliche Farben (für Laien kaum unterscheidbar)
- **ΔE00 > 6:** Deutlich unterschiedliche Farben

**Warum wichtig?**

- Standard-Metrik für Farbvergleiche in der Industrie
- Wird von GIA verwendet
- Präziseste verfügbare Metrik für Farbdistanz

---

### 8.5 Zirkuläre Statistik

#### 8.5.1 Zirkuläre Statistik für Hue

**Zweck:** Berechnung von Mittelwert und Streuung für Hue-Werte, die zirkulär sind (0° = 360°).

**Problem:**

- Standard-Mittelwert funktioniert nicht für zirkuläre Daten
- Beispiel: Mittelwert von 350° und 10° sollte 0° sein, nicht 180°

**Lösung:**

- Konvertiere Hue-Werte in Einheitsvektoren auf einem Kreis
- Summiere Vektoren
- Berechne Mittelwert aus resultierendem Vektor

**Mathematische Formel:**

```
1. Konvertiere zu Einheitsvektoren:
   x = Σ cos(h_i)
   y = Σ sin(h_i)

2. Berechne Mittelwert:
   mean = atan2(y, x)  (in Grad)

3. Resultant Length (Kompaktheit):
   R = √((x/n)² + (y/n)²)
   - R = 1: Alle Werte identisch
   - R = 0: Gleichmäßige Verteilung

4. Zirkuläre Varianz:
   circVar = 1 - R
```

**Anwendung:**

- Erkennung von Borderline-Farben (Farben zwischen Kategorien)
- Analyse von Pleochroismus (mehrere Farbrichtungen)
- Bewertung der Farbkonsistenz

---

#### 8.5.2 Soft Category Classification

**Zweck:** Klassifizierung einer Farbe in Kategorien mit Wahrscheinlichkeits-Scores statt harter Zuordnung.

**Grundprinzip:**

- Statt "Diese Farbe IST Grün" → "Diese Farbe ist zu 70% Grün, 25% Gelbgrün, 5% Blaugrün"
- Verwendet Gaußsche Wahrscheinlichkeitsverteilung
- Ermöglicht Erkennung von Borderline-Farben

**Mathematische Formel:**

```
Wahrscheinlichkeit für Kategorie k:
P(k) = exp(-0.5 * (d/σ)²)
wobei:
- d = zirkuläre Distanz zum Kategorie-Zentrum
- σ = Standard-Abweichung (Breite) der Kategorie

Konfidenz:
conf = P(primary) - P(secondary)

Borderline-Erkennung:
borderline = conf < 0.15
```

**Kategorien:**

- Gelb (90°), Gelbgrün (75°), Grün (140°), Blaugrün (190°)
- Blau (240°), Blauviolett (280°), Violett (300°)
- Rotviolett (330°), Rot (0°), Rotorange (20°), Orange (40°)

**Vorteile:**

- Realistischere Farbklassifikation
- Erkennung von Grenzfarben
- Quantifizierung von Unsicherheit

---

#### 8.5.3 Hue Histogram Peak Detection

**Zweck:** Erkennung mehrerer Farb-Peaks im Hue-Histogramm (z.B. bei Pleochroismus).

**Grundprinzip:**

1. Erstelle Histogramm der Hue-Werte (360 Bins für 0-360°)
2. Glätte Histogramm (Moving Average)
3. Finde lokale Maxima (Peaks)
4. Berechne Abstand zwischen Peaks

**Mathematische Formel:**

```
1. Glättung (Moving Average):
   smoothed[i] = (1/(2s+1)) * Σ(hist[j]) für j = i-s bis i+s
   wobei s = Smoothing-Radius (default: 3)

2. Peak-Erkennung:
   Peak bei i wenn:
   smoothed[i] > smoothed[i-1] UND smoothed[i] > smoothed[i+1]

3. Peak-Abstand:
   d = min(|peak1 - peak2|, 360 - |peak1 - peak2|)
```

**Anwendung:**

- Erkennung von Pleochroismus (mehrere dominante Farbrichtungen)
- Analyse von Farbübergängen
- Bewertung der Farbkomplexität

---

#### 8.5.4 Verbesserte Farbklassifizierung mit RGB-Validierung (Version 2.2.0)

**Zweck:** Präzise Unterscheidung zwischen ähnlichen Farbtönen (z.B. Violett vs. Rot-Violett) durch Kombination von CIELAB Hue-Winkel und RGB-Komponenten-Analyse.

**Problem:**

- CIELAB Hue-Winkel allein kann bei ähnlichen Farbtönen zu Fehlklassifizierungen führen
- Beispiel: Violett (300°) und Rot-Violett (330°) haben ähnliche Hue-Winkel
- RGB-Komponenten liefern zusätzliche Information für präzise Unterscheidung

**Lösung:**

- Kombination von CIELAB Hue-Winkel und RGB-Komponenten-Analyse
- RGB-basierte Validierung für kritische Hue-Bereiche (285-345°)
- Strikte Bedingungen für Rot-Klassifizierung

**Mathematische Formel:**

```
Für Hue-Winkel im Bereich 285-345° (Pink/Red/Violet):

1. RGB-Komponenten extrahieren:
   r = R-Wert (0-255)
   g = G-Wert (0-255)
   b = B-Wert (0-255)

2. Berechne Verhältnisse:
   r_ratio = r / (r + g + b)
   b_ratio = b / (r + g + b)
   bl = b_ratio * 255  (normalisierter Blau-Wert)

3. Klassifizierung:
   Wenn b_ratio > 0.15 UND r < bl * 2.0:
     → Klassifiziere als "Violett"
   Sonst wenn r > bl * 2.0 UND b_ratio < 0.1:
     → Klassifiziere als "Rot" oder "Rosa"
   Sonst:
     → Verwende Standard Hue-Winkel-Klassifizierung
```

**Anwendung in Funktionen:**

- **`getColorDescription()`**: RGB-Validierung für Hauptfarbton
- **`getGIAHue()`**: RGB-Validierung für GIA-Hue-Klassifizierung
- **`getCIEHue()`**: RGB-Validierung für CIE-Hue-Berechnung (auch für sekundäre Farben)

**Vorteile:**

- Präzise Unterscheidung zwischen Violett und Rot-Violett
- Verhindert Fehlklassifizierung von violetten Steinen als Rot
- Verbesserte Genauigkeit für alle Farbklassifizierungen
- Anwendung auf Primär- und Sekundärfarben

**Beispiel:**

```
Eingabe: Violett Stein (RGB: 132, 19, 110)
- Hue-Winkel: 315° (könnte als Rot-Violett interpretiert werden)
- RGB-Analyse: b_ratio = 0.42, r = 132, bl = 108
- Bedingung: b_ratio > 0.15 UND r < bl * 2.0 → ERFÜLLT
- Ergebnis: Korrekt als "Violett" klassifiziert
```

---

### 8.6 ICC-Profil-Verarbeitung

#### 8.6.1 ICC-Profil-Parsing

**Zweck:** Extraktion von Farbraum-Informationen aus ICC-Profilen.

**ICC-Profil-Struktur:**

- **Header (128 Bytes):** Signatur, Version, Gerätetyp, Farbraum
- **Tag-Tabelle:** Liste aller Tags mit Offsets und Größen
- **Tag-Daten:** Tatsächliche Farbraum-Informationen

**Wichtige Tags:**

- **wtpt:** Weißpunkt (XYZ-Werte)
- **rXYZ, gXYZ, bXYZ:** RGB-Colorant XYZ-Werte

**Mathematische Formel:**

```
1. Tag-Offset lesen (32-bit big-endian):
   offset = (buf[i] << 24) | (buf[i+1] << 16) | (buf[i+2] << 8) | buf[i+3]

2. s15Fixed16 zu Float:
   value = (int >> 16) + ((int & 0xFFFF) / 65536)

3. XYZ-Werte extrahieren:
   X = s15Fixed16(buf[offset + 8])
   Y = s15Fixed16(buf[offset + 12])
   Z = s15Fixed16(buf[offset + 16])
```

**Anwendung:**

- Präzise Farbanalyse mit korrektem Weißpunkt
- Unterstützung für verschiedene Farbprofile
- Professionelle Farbverarbeitung

---

### 8.7 Fallback-Mechanismus für Pixelextraktion (Version 2.2.0)

#### 8.7.1 3-stufiger Fallback-Algorithmus

**Zweck:** Sicherstellung, dass auch bei sehr restriktiven Masken immer Pixel für die Analyse gefunden werden.

**Problem:**

- Maskierungs-Algorithmen können manchmal zu restriktiv sein
- Alpha-Kanal-Prüfung kann zu viele Pixel filtern
- Keine Pixel → Keine Analyse möglich

**Lösung:**

- 3-stufiger Fallback-Mechanismus
- Jede Stufe hat niedrigere Anforderungen
- Gewichtung für Fallback-Pixel (niedrigere Konfidenz)

**Algorithmus:**

```
Stufe 1: Normale Maskierung
- Verwende Standard-Maske (SLIC + Guided Filter oder Smart Mask)
- Filtere transparente Pixel (alpha < 10)
- Filtere reines Schwarz (r < 10 && g < 10 && b < 10)
- Wenn Pixel gefunden → STOP, verwende diese Pixel

Stufe 2: Zentrale Region (60% des Bildes)
- Wenn Stufe 1 keine Pixel findet:
- Berechne zentrale Region:
  x_start = width * 0.2
  y_start = height * 0.2
  x_end = width * 0.8
  y_end = height * 0.8
- Sample alle Pixel in dieser Region
- Filtere nur transparente Pixel (alpha < 10)
- Gewichtung: 0.8 (niedrigere Konfidenz)
- Wenn Pixel gefunden → STOP, verwende diese Pixel

Stufe 3: Gesamtes Bild ohne Ränder (10% Rand abgeschnitten)
- Wenn Stufe 2 keine Pixel findet:
- Berechne Rand-freie Region:
  x_start = width * 0.1
  y_start = height * 0.1
  x_end = width * 0.9
  y_end = height * 0.9
- Sample alle Pixel in dieser Region
- Filtere nur transparente Pixel (alpha < 10)
- Gewichtung: 0.5 (noch niedrigere Konfidenz)
- Wenn Pixel gefunden → STOP, verwende diese Pixel

Fehlerbehandlung:
- Wenn auch Stufe 3 keine Pixel findet:
  → Werfe Fehler mit hilfreicher Meldung
```

**Parameter:**

- **Alpha-Schwelle:** 10 (nur vollständig transparente Pixel werden gefiltert)
- **Schwarz-Schwelle:** 10 (nur reines Schwarz wird gefiltert)
- **Zentrale Region:** 60% des Bildes (20% Rand auf jeder Seite)
- **Rand-freie Region:** 80% des Bildes (10% Rand auf jeder Seite)
- **Gewichtung Stufe 2:** 0.8
- **Gewichtung Stufe 3:** 0.5

**Vorteile:**

- Robustheit: Funktioniert auch bei problematischen Bildern
- Flexibilität: Passt sich an verschiedene Bildqualitäten an
- Transparenz: Gewichtung zeigt Konfidenz an
- Benutzerfreundlichkeit: Weniger Fehler, mehr erfolgreiche Analysen

**Technische Implementierung:**

- Implementiert in `components/color-charts/utils/enhancedColorExtraction.ts`
- Funktion: `extractColorsEnhanced()`
- Wird automatisch verwendet, wenn normale Maskierung fehlschlägt

---

### 8.8 Zusammenfassung der Algorithmen

**Farbraum-Konvertierungen:**

- RGB → XYZ: Gamma-Korrektur + Matrix
- XYZ → Lab: Nichtlineare Transformation mit Weißpunkt
- Bradford-Adaptation: Weißpunkt-Konvertierung

**Clustering:**

- K-Means: Standard-Clustering
- K-Means++: Intelligente Initialisierung
- GMM+BIC: Automatische Clusterzahl

**Segmentierung:**

- SLIC: Superpixel-Generierung
- Guided Filter: Edge-preserving Glättung

**Farbdistanz:**

- CIEDE2000: Wahrnehmungsgerechte Metrik

**Statistik:**

- Zirkuläre Statistik: Hue-Analyse
- Soft Classification: Wahrscheinlichkeits-basierte Kategorisierung
- Peak Detection: Mehrfach-Peak-Erkennung

**Farbklassifizierung:**

- RGB-Validierung: Präzise Unterscheidung ähnlicher Farbtöne
- CIE-Hue-Berechnung: Für Primär- und Sekundärfarben

**Robustheit:**

- Fallback-Mechanismus: 3-stufiger Fallback für Pixelextraktion

**Alle diese Algorithmen arbeiten zusammen, um eine präzise, professionelle Farbanalyse von Edelsteinen zu ermöglichen.**

---

## 9. Technische Details

### 9.1 Authentifizierung & Autorisierung

**NextAuth.js Konfiguration:**

- Credentials-Provider für E-Mail/Passwort
- Session-basiert (JWT)
- Cookie-basiertes Session-Management
- Middleware-Schutz für Admin-Routen

**Rollen-System:**

- Rollen werden in `User.role` gespeichert
- Middleware prüft Rollen vor Zugriff
- API-Routen prüfen Rollen

---

### 9.2 Internationalisierung

**next-intl:**

- Mehrsprachigkeit (de, en)
- Locale-basierte Routen (`/[locale]/...`)
- Übersetzungen in `messages/` Verzeichnis
  - `messages/de.json` - Deutsche Übersetzungen
  - `messages/en.json` - Englische Übersetzungen
- Dynamische Locale-Erkennung

**Vollständig übersetzte Bereiche (Stand: 20.12.2025):**

- ✅ **Shop-Seite (`/shop`):**
  - Titel und Untertitel
  - Semantische Vektorsuche (Titel, Beschreibung, Platzhalter, Buttons, Statusmeldungen)
  - Fehlermeldungen (keine Treffer, Preisbereich, Zertifikat, Behandlung)
  - Lade-Status und Anzeige-Informationen
- ✅ **Homepage:**
  - Neue Edelsteine Karussell (Titel, Fehlermeldungen)
- ✅ **Gemeinsame Komponenten:**
  - Sortier-Optionen
  - Filter-Komponenten
  - GemstoneCard
  - Wunschliste

**Verwendung in Komponenten:**

- `useTranslations('shop')` - Shop-spezifische Übersetzungen
- `useTranslations('home')` - Homepage-spezifische Übersetzungen
- `useTranslations('common')` - Gemeinsame Übersetzungen

---

### 9.3 Bildverarbeitung

**Sharp:**

- Bildoptimierung
- Thumbnail-Generierung
- Format-Konvertierung

**Canvas (Browser):**

- Farb-Extraktion
- Bild-Analyse
- Region-Erkennung

---

### 9.4 PDF-Generierung

**@react-pdf/renderer:**

- Rechnungen als PDF
- Farbtafeln-Export
- Zertifikate

---

### 9.5 State Management

**Zustand:**

- Warenkorb-State
- Wishlist-State
- UI-State

**Server State:**

- React Server Components
- Server-Side Data Fetching
- Caching

---

### 9.6 Performance-Optimierungen

- **Next.js Standalone Output** - Für Docker
- **Image Optimization** - Next.js Image Component
- **Code Splitting** - Automatisch durch Next.js
- **Static Generation** - Wo möglich
- **Incremental Static Regeneration** - Für dynamische Inhalte

---

### 9.7 Sicherheit

- **CSRF-Schutz** - NextAuth.js
- **XSS-Schutz** - React automatisch
- **SQL-Injection-Schutz** - Prisma ORM
- **Authentifizierung** - NextAuth.js
- **Autorisierung** - Rollen-basiert
- **Audit-Logging** - Alle Admin-Aktionen

---

## 10. Deployment & Wartung

### 10.1 Docker-Setup

Diese Anleitung erklärt, wie Sie die Gemilike-Website mit Docker ausführen.

#### Voraussetzungen

- Docker (Version 20.10 oder höher)
- Docker Compose (Version 2.0 oder höher)
- `.env` Datei mit allen notwendigen Umgebungsvariablen

#### Aktualisierungen (2025)

Die Docker-Konfiguration wurde am 01.12.2025 aktualisiert mit:
- ✅ Dockerfile Syntax 1.8 (aktuelle docker/dockerfile Version)
- ✅ Durchgängige Node 22 Alpine Basis (deps, builder, runner)
- ✅ PostgreSQL 16 Images als Standard (`docker-compose.yml` und `.dev`) - Kompatibilität mit vorhandenen Datenbanken
- ✅ MailHog fest auf `mailhog/mailhog:v1.0.1` für reproduzierbare Dev-E-Mails
- ✅ Prisma CLI/Client Version 6.18.0 in Dockerfile, Compose und `package.json`
- ✅ Cache Mounts für schnellere Builds (npm & Prisma)
- ✅ Verbesserte Health Checks (wget + curl Fallback)
- ✅ Resource Limits für Production
- ✅ Optimiertes .dockerignore
- ✅ Docker Compose Version 2.0+ (neueste Syntax)
- ✅ Unterstützung für Farbanalyse (Image Processing Libraries: cairo, libpng, etc.)
- ✅ Unterstützung für Farbtafeln (Data Directory Mounting)
- ✅ Node.js 22 Alpine (neueste LTS)
- ✅ Multi-Stage Build für optimierte Image-Größe
- ✅ Standalone Output für bessere Performance
- ✅ **Service Worker Verifikation** (Version 2.4.0)
  - Build-Time Verifikation für `public/sw.js`
  - Standalone Build Verifikation
  - Runtime Service Worker Check beim Container-Start
- ✅ **Optimierte Build-Prozesse** (Version 2.4.0)
  - Automatische Verifikation kritischer Dateien
  - Verbesserte Logs und Fehlerbehandlung

#### Container-Update (November 2025)

**Durchgeführte Schritte:**
1. Container gestoppt (`docker compose down`)
2. Image neu gebaut mit `--no-cache` (`docker compose build --no-cache app`)
3. Container neu gestartet (`docker compose up -d`)
4. Migrationen automatisch angewendet
5. Health Checks erfolgreich

**Aktueller Status:**
- ✅ `gemilike-app`: Healthy, läuft auf Port 3002
- ✅ `gemilike-postgres`: Healthy, läuft auf Port 5433
- ✅ Alle Migrationen erfolgreich angewendet
- ✅ Next.js 15.5.4 läuft korrekt
- ✅ Prisma Client generiert (v6.18.0, identisch zu `package.json`)

#### Schnellstart

**1. Umgebungsvariablen konfigurieren**

Erstellen Sie eine `.env` Datei im Projektroot basierend auf `env.example`:

```bash
cp env.example .env
```

Wichtige Variablen, die Sie anpassen müssen:

```env
# Database
POSTGRES_USER=gemilike
POSTGRES_PASSWORD=ihr-sicheres-passwort
POSTGRES_DB=gemilike
POSTGRES_PORT=5433
# Hinweis: Port 5433 wird verwendet, wenn Port 5432 bereits belegt ist

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_PORT=3000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generieren-sie-ein-sicheres-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ihre-email@gemilike.de
SMTP_PASSWORD=ihr-app-passwort
SMTP_FROM=noreply@gemilike.de

# Admin
ADMIN_EMAIL=admin@gemilike.de
```

**2. Production Build starten**

```bash
# Build und Start aller Services
docker compose up -d

# Logs anzeigen
docker compose logs -f app

# Container-Status prüfen
docker compose ps

# Stoppen
docker compose down
```

**Container aktualisieren:**

```bash
# Container stoppen
docker compose down

# Image neu bauen (mit allen neuesten Änderungen)
docker compose build --no-cache app

# Container neu starten
docker compose up -d

# Logs prüfen
docker compose logs -f app
```

**3. Development Build starten**

```bash
# Build und Start mit Hot Reload
docker-compose -f docker-compose.dev.yml up -d

# Logs anzeigen
docker-compose -f docker-compose.dev.yml logs -f app

# Stoppen
docker-compose -f docker-compose.dev.yml down
```

**4. Lokale Entwicklung (ohne Docker für App)**

Wenn Sie die Next.js-Anwendung lokal entwickeln möchten, während PostgreSQL in Docker läuft:

1. **Stellen Sie sicher, dass PostgreSQL-Container läuft:**
   ```bash
   docker compose up -d postgres
   # Oder mit strato-compose.yml:
   docker compose -f deploy/strato-compose.yml up -d postgres
   ```

2. **Erstellen Sie eine `.env.local` Datei im Projektroot:**
   ```env
   # Datenbank-Verbindung (PostgreSQL in Docker, Port 5433)
   DATABASE_URL="postgresql://gemilike:change-me-in-production@localhost:5433/gemilike?schema=public"
   SHADOW_DATABASE_URL="postgresql://gemilike:change-me-in-production@localhost:5433/gemilike_shadow?schema=public"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

   # Weitere Umgebungsvariablen...
   ```

3. **Prüfen Sie die Datenbank-Verbindung:**
   ```bash
   # Testen Sie die Verbindung
   PGPASSWORD=change-me-in-production psql -h localhost -p 5433 -U gemilike -d gemilike -c "SELECT version();"
   ```

4. **Starten Sie die lokale Entwicklung:**
   ```bash
   npm install
   npx prisma generate
   npm run dev
   ```

**Wichtig:** Stellen Sie sicher, dass der PostgreSQL-Container einen Port nach außen gemappt hat (siehe Troubleshooting-Abschnitt).

#### Datenbank-Migrationen

Beim ersten Start führt Docker automatisch `prisma migrate deploy` aus. Für manuelle Migrationen:

```bash
# Production
docker-compose exec app npx prisma migrate deploy

# Development
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate deploy
```

#### Datenbank-Seeding

```bash
# Production
docker-compose exec app npm run seed

# Development
docker-compose -f docker-compose.dev.yml exec app npm run seed
```

#### Datenbank-Zugriff

Sie können direkt auf die PostgreSQL-Datenbank zugreifen:

```bash
# Production
docker-compose exec postgres psql -U gemilike -d gemilike

# Development
docker-compose -f docker-compose.dev.yml exec postgres psql -U gemilike -d gemilike_dev
```

#### Volumes und Persistenz

Docker speichert Daten in folgenden Volumes:

- **PostgreSQL Daten**: `postgres_data` (Production) / `postgres_dev_data` (Development)
- **Uploaded Files**: `./public/uploads` (gemountet als Volume)
- **Invoices**: `./public/invoices` (gemountet als Volume)
- **Gemstone Analysis Images**: `./public/gemstone-analyses` (gemountet als Volume)
- **Color Chart Data**: `./data` (gemountet als Volume, read-only in Production)

#### Wartung

**Container neu bauen:**

```bash
# Production
docker-compose build --no-cache
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

**Logs prüfen:**

```bash
# Alle Services
docker-compose logs -f

# Nur App
docker-compose logs -f app

# Nur Database
docker-compose logs -f postgres
```

**Container-Stats:**

```bash
docker-compose ps
docker stats
```

**Volumes bereinigen:**

⚠️ **Achtung**: Löscht alle Daten!

```bash
# Production
docker-compose down -v

# Development
docker-compose -f docker-compose.dev.yml down -v
```

#### Production Deployment

**Optimierungen für Production:**

1. **Umgebungsvariablen**: Verwenden Sie sichere Secrets (z.B. Docker Secrets, AWS Secrets Manager)
2. **Reverse Proxy**: Setzen Sie einen Nginx oder Traefik vor die App
3. **SSL/TLS**: Konfigurieren Sie HTTPS-Zertifikate
4. **Monitoring**: Richten Sie Logging und Monitoring ein
5. **Backups**: Planen Sie regelmäßige Datenbank-Backups

**Beispiel mit Nginx Reverse Proxy:**

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - gemilike-network
```

#### Troubleshooting

**Container startet nicht:**

```bash
# Prüfe Logs
docker-compose logs app

# Prüfe Container-Status
docker-compose ps

# Prüfe Netzwerk
docker network ls
```

**Datenbank-Verbindungsfehler:**

```bash
# Prüfe ob Postgres läuft
docker-compose ps postgres

# Prüfe Datenbank-Logs
docker-compose logs postgres

# Teste Verbindung
docker-compose exec app npx prisma db pull
```

**Port bereits belegt:**

```bash
# Ändere Ports in .env
POSTGRES_PORT=5433
APP_PORT=3001
```

**Lokale Anwendung kann Datenbank nicht erreichen:**

Wenn Ihre Next.js-Anwendung lokal (außerhalb von Docker) läuft und die PostgreSQL-Datenbank nicht erreichen kann:

1. **Prüfen Sie, ob der PostgreSQL-Container einen Port nach außen gemappt hat:**
   ```bash
   docker ps | grep postgres
   # Sollte zeigen: 0.0.0.0:5433->5432/tcp
   ```

2. **Stellen Sie sicher, dass Ihre `.env.local` die korrekte DATABASE_URL enthält:**
   ```env
   DATABASE_URL="postgresql://gemilike:change-me-in-production@localhost:5433/gemilike?schema=public"
   ```

3. **Testen Sie die Verbindung:**
   ```bash
   PGPASSWORD=change-me-in-production psql -h localhost -p 5433 -U gemilike -d gemilike -c "SELECT version();"
   ```

4. **Falls der Port nicht gemappt ist, fügen Sie Port-Mapping in `deploy/strato-compose.yml` hinzu:**
   ```yaml
   postgres:
     ports:
       - "${POSTGRES_PORT:-5433}:5432"
   ```
   Dann Container neu starten: `docker compose -f deploy/strato-compose.yml up -d postgres`

**Build-Fehler:**

```bash
# Lösche Cache und baue neu
docker-compose build --no-cache --pull
```

#### Email Testing (Development)

In der Development-Umgebung läuft MailHog, um E-Mails zu testen:

- **Version:** `mailhog/mailhog:v1.0.1` (fixiert seit 01.12.2025)
- **SMTP**: `localhost:1025`
- **Web UI**: `http://localhost:8025`

Alle E-Mails, die von der App gesendet werden, werden von MailHog abgefangen und können im Web-Interface betrachtet werden.

---

### 10.2 Datenbank-Migrationen

```bash
# Migrationen ausführen
npx prisma migrate deploy

# Prisma Client generieren
npx prisma generate

# Letzte Migration (Stand Dez 2025)
# 20251213190826_add_container_content – neues Model ContainerContent + Admin-API
```

---

### 10.3 Backup-Strategie

**Empfohlene Backups:**

- Tägliche Datenbank-Backups
- Wöchentliche Media-Backups
- Monatliche Voll-Backups

---

### 10.4 Security Scans & Audits

#### 10.4.1 GitHub Security Workflows

Das Projekt verwendet mehrere automatisierte Security-Scans:

**1. CodeQL Analysis**
- **Workflow:** `.github/workflows/codeql-analysis.yml`
- **Zweck:** Statische Code-Analyse zur Erkennung von Sicherheitslücken
- **Sprachen:** JavaScript, TypeScript
- **Zeitplan:** Wöchentlich (Sonntags um 2:00 UTC)
- **Trigger:** Push, Pull Request, manuell
- **Status:** ✅ Aktiv
- **Hinweis (12/2025):** Der zuvor doppelte CodeQL-Workflow wurde entfernt, sodass nur noch dieser Workflow aktiv ist

**2. Security Audit (npm audit)**
- **Workflow:** `.github/workflows/security-audit.yml`
- **Zweck:** Prüfung auf bekannte Schwachstellen in Dependencies
- **Zeitplan:** Wöchentlich (Montags um 6:00 UTC)
- **Trigger:** Push, Pull Request, manuell
- **Status:** ✅ Aktiv

**3. Dependabot**
- **Konfiguration:** `.github/dependabot.yml`
- **Zweck:** Automatische Updates für Dependencies
- **Zeitplan:**
  - npm: Wöchentlich (Montags um 9:00)
  - GitHub Actions: Monatlich
- **Status:** ✅ Aktiv

**4. Dependency Review**
- **Workflow:** `.github/workflows/dependency-review.yml`
- **Zweck:** Prüfung von Dependencies in Pull Requests
- **Status:** ✅ Aktiv

**5. Secret Scanning**
- **Workflow:** `.github/workflows/secret-scanning.yml`
- **Zweck:** Erkennung von exponierten Secrets
- **Status:** ✅ Aktiv
- **Hinweis (12/2025):** Der Workflow nutzt wieder das korrekte Gitleaks-Setup (fix des `config-path`)

#### 10.4.2 Aktuelle Security-Ergebnisse (Stand: Dezember 2025)

**npm audit Ergebnisse (nach Build & Docker-Update):**

```
found 0 vulnerabilities
```

**Zusammenfassung:**
- **Kritisch:** 0
- **Hoch:** 0
- **Mittel:** 0
- **Niedrig:** 0
- **Info:** 0
- **Gesamt:** 0 Schwachstellen ✅

**Letzte Prüfung:** 01. Dezember 2025 (npm audit fix nach Docker-/Dependency-Update)

**Aktuelle Maßnahmen (01. Dezember 2025):**
- `npm audit fix` hat die letzten `glob`- und `js-yaml`-Warnungen behoben (0 verbleibend)

**Durchgeführte Security-Fixes:**

✅ **xlsx durch exceljs ersetzt (November 2025)**
- **Problem:** xlsx hatte 2 High-Severity-Schwachstellen (Prototype Pollution, ReDoS)
- **Lösung:** xlsx wurde durch `exceljs` (Version 4.4.0) ersetzt
- **Betroffene Dateien:**
  - `components/color-charts/UploadPanel.tsx`
  - `components/admin/color-charts/BulkImportDialog.tsx`
- **Status:** ✅ Behoben - Keine Sicherheitslücken mehr
- **Vorteile von exceljs:**
  - Aktive Wartung und regelmäßige Updates
  - Keine bekannten Sicherheitslücken
  - Bessere TypeScript-Unterstützung
  - Umfangreichere API für Excel-Operationen

#### 10.4.3 Durchgeführte Security-Fixes

**Dokumentiert in:** `.github/SECURITY_FIXES.md`

**Behobene Probleme:**

1. ✅ **Hardcoded Credentials entfernt**
   - Betroffene Dateien: Login-Seiten
   - Lösung: Environment Variables verwendet
   - ⚠️ Hinweis: `NEXT_PUBLIC_*` Variablen sind im Client sichtbar

2. ✅ **Development-Mode Authentication Bypass entfernt**
   - Betroffene Datei: `app/api/admin/audit-logs/route.ts`
   - Lösung: Authentifizierung wird immer geprüft

3. ✅ **npm audit fix (glob/js-yaml)**
   - Ausgeführt am 01.12.2025 (`npm audit fix --omit=dev`)
   - Betroffene Pakete: `glob`, `js-yaml` (transitive Dependencies)
   - Ergebnis: 0 verbleibende Schwachstellen

#### 10.4.4 Security-Best-Practices

**Implementiert:**

- ✅ Automatische Security-Scans (CodeQL, npm audit)
- ✅ Dependabot für automatische Updates
- ✅ Secret Scanning
- ✅ Dependency Review in Pull Requests
- ✅ Environment Variables für Secrets
- ✅ Authentifizierung für Admin-Routen

**Empfohlen:**

- ✅ xlsx-Bibliothek durch exceljs ersetzt (erledigt)
- ⚠️ Regelmäßige manuelle Security-Reviews
- ⚠️ Penetration Testing in Produktion
- ⚠️ Rate Limiting für API-Endpunkte
- ⚠️ CSRF-Schutz für Formulare
- ⚠️ Content Security Policy (CSP) Header

#### 10.4.5 Security-Scan ausführen

**Lokal:**

```bash
# npm audit ausführen
npm audit

# Nur Production-Dependencies prüfen
npm audit --omit=dev

# JSON-Output für weitere Analyse
npm audit --json > npm-audit.json

# Automatische Fixes versuchen (Vorsicht!)
npm audit fix
```

**GitHub Actions:**

- Security-Scans laufen automatisch bei jedem Push/Pull Request
- Wöchentliche geplante Scans
- Ergebnisse in GitHub Security Tab verfügbar

**Manuell auslösen:**

1. Gehen Sie zu **Actions** → **Security Audit**
2. Klicken Sie auf **Run workflow**
3. Wählen Sie Branch und klicken Sie auf **Run workflow**

---

## 11. Detaillierte Dokumentationen

### 11.1 Farbtafeln & Farbanalyse - Vollständige Dokumentation

Siehe Abschnitt [7.1 Farbanalyse-System](#71-farbanalyse-system) und [7.2 Farbtafeln-System](#72-farbtafeln-system) für die vollständige Dokumentation.

**Version:** 2.2.0  
**Letzte Aktualisierung:** November 2025

### 11.2 API-Routen - Vollständige Übersicht

#### Verfügbare Routen

**Hinweis:** Der Development Server läuft standardmäßig auf Port 3000. Falls dieser belegt ist, wird automatisch ein anderer Port verwendet (z.B. 3002). Prüfen Sie die Terminal-Ausgabe für den korrekten Port.

#### Öffentliche Seiten (Deutsch)

- **Homepage:** http://localhost:3000 oder http://localhost:3000/de
- **Über uns:** http://localhost:3000/de/about
- **Leistungen:** http://localhost:3000/de/services
- **Blog:** http://localhost:3000/de/blog
- **Shop:** http://localhost:3000/de/shop
- **Warenkorb:** http://localhost:3000/de/cart
- **Kontakt:** http://localhost:3000/de/contact
- **Downloads:** http://localhost:3000/de/downloads
- **Wissenswertes:** http://localhost:3000/de/wissenswertes
- **Weltkarte:** http://localhost:3000/de/worldmap

#### Rechtliche Seiten

- **Impressum:** http://localhost:3000/de/imprint
- **Datenschutz:** http://localhost:3000/de/privacy
- **AGB:** http://localhost:3000/de/terms
- **Widerruf:** http://localhost:3000/de/returns
- **Versand:** http://localhost:3000/de/shipping
- **Cookies:** http://localhost:3000/de/cookies

#### Öffentliche Seiten (Englisch)

- **Homepage:** http://localhost:3000/en
- **About:** http://localhost:3000/en/about
- **Services:** http://localhost:3000/en/services
- **Blog:** http://localhost:3000/en/blog
- **Shop:** http://localhost:3000/en/shop
- **Cart:** http://localhost:3000/en/cart
- **Contact:** http://localhost:3000/en/contact

#### API-Endpunkte

**Kontaktformular:**

```
POST http://localhost:3000/api/contact
```

Request Body:
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "subject": "Frage zu Edelsteinen",
  "message": "Ihre Nachricht",
  "locale": "de"
}
```

**Newsletter:**

```
POST http://localhost:3000/api/newsletter
```

Request Body:
```json
{
  "email": "max@example.com",
  "locale": "de"
}
```

**Bestellbestätigung:**

```
POST http://localhost:3000/api/orders/confirmation
```

Request Body:
```json
{
  "orderNumber": "ORD-2025-001",
  "customerEmail": "customer@example.com",
  "customerName": "Max Mustermann",
  "orderDate": "2025-01-10",
  "totalAmount": 299.99,
  "currency": "EUR",
  "items": [
    {
      "name": "Kolumbianischer Smaragd",
      "quantity": 1,
      "price": 299.99
    }
  ],
  "locale": "de"
}
```

#### Sprachumschaltung

Die Middleware leitet automatisch um:
- `/` → `/de` (Standard-Sprache)
- Benutzer kann über Header zwischen DE/EN wechseln
- Sprache wird in Cookie gespeichert

#### Produktions-URLs (nach Deployment)

- https://gemilike.de
- https://gemilike.de/en
- https://gemilike.com (sollte auf gemilike.de weiterleiten)

**Version:** 2.2.0  
**Letzte Aktualisierung:** November 2025

### 11.3 Datenbank-Funktions-Analyse

Siehe Abschnitt [5. Datenbank-Schema](#5-datenbank-schema) für die vollständige Übersicht.

**Status-Änderungen (Stand November 2025):**
- ✅ Review System vollständig implementiert (Frontend + Admin + API)
- ✅ Rechnungen Frontend vollständig implementiert (Profil-Seite + PDF-Download)
- ✅ Wishlist Admin vollständig implementiert (Analytics + Management)
- ✅ Email-Benachrichtigungen für Reviews und Wishlist-Verfügbarkeit
- ✅ LegalPages Model & Admin implementiert
- ✅ Coupon Frontend UI implementiert
- ✅ KnowledgeBase DB-Migration implementiert
- ✅ AboutContent DB-Migration implementiert

**Statistik (Stand November 2025):**
- **Öffentliche Features:** ~27
- **Admin-Funktionen:** ~46
- **Datenbank-Modelle:** 46
- **Abdeckung Admin für Frontend:** ~94%
- **Abdeckung Datenbank für Features:** ~100%
- **Kritische Lücken behoben:** 8 von 8 (100%)

**Version:** 2.2.0  
**Letzte Aktualisierung:** November 2025

---

## 12. Support & Kontakt

### 12.1 Dokumentation

Alle Dokumentationen sind jetzt vollständig in diesem Handbuch integriert:
- ✅ **Farbtafeln & Farbanalyse:** Siehe Abschnitt [7.1](#71-farbanalyse-system) und [7.2](#72-farbtafeln-system)
- ✅ **Docker:** Siehe Abschnitt [10.1](#101-docker-setup)
- ✅ **API-Routen:** Siehe Abschnitt [11.2](#112-api-routen---vollständige-übersicht)
- ✅ **Datenbank-Analyse:** Siehe Abschnitt [5. Datenbank-Schema](#5-datenbank-schema) und [11.3](#113-datenbank-funktions-analyse)

### 12.2 Troubleshooting

**Häufige Probleme:**

1. **Session-Probleme:** Cookies löschen, neu einloggen
2. **Datenbank-Verbindung:** Prüfe DATABASE_URL
3. **Build-Fehler:** `npm run build` für Details
4. **Docker-Probleme:** Siehe Abschnitt [10.1 Docker-Setup](#101-docker-setup)

---

## 13. Zusammenfassung

### 13.1 Website-Übersicht

Die Gemilike-Website ist eine vollständige E-Commerce-Plattform mit:

- **46 Datenbank-Models** für verschiedene Entitäten
- **50+ öffentliche Seiten** für Benutzer
- **46+ Admin-Funktionen** für Verwaltung
- **100+ API-Endpunkte** für Backend-Funktionalität
- **12.182 Zeilen Code** für Farbtafeln und Farbanalyse
- **TypeScript/TSX:** 565+ Dateien für moderne, typsichere Entwicklung

### 13.2 Hauptfunktionen

#### Öffentliche Bereiche

1. **E-Commerce:** Shop, Warenkorb, Checkout, Bestellungen
2. **Content:** Blog, Stories, Wissenswertes
3. **Tools:** Farbanalyse, Farbtafeln, Weltkarte
4. **Information:** Über uns, Leistungen, Kontakt
5. **Rechtliches:** Impressum, Datenschutz, AGB, etc.

#### Admin-Bereiche

1. **Produktverwaltung:** Edelsteine, Attribute, Preise, Inventar, Tags
2. **Kundenverwaltung:** Kunden, Adressen, Bestellungen, Warenkörbe
3. **Rechnungsverwaltung:** Rechnungen, Bankverbindungen, PDF-Generierung
4. **Content-Management:** Blog, Stories, Knowledge Base, About Content
5. **System-Verwaltung:** Einstellungen, Header, Footer, Hero, Navigation
6. **Analytics:** Dashboard, Reports, Checkout-Analytics, Audit-Log, Cart-Analytics
7. **Spezial-Features:** Farbtafeln, Farbanalysen, Weltkarte, Reviews, Wishlists
8. **Rechtliches:** Legal Pages (Impressum, Datenschutz, AGB, etc.)

### 13.3 Technologie-Highlights

- **Next.js 15.5.6** - Modernes React-Framework mit App Router
- **PostgreSQL 16 + Prisma** - Type-safe Datenbankzugriff (Port 5433 für lokale Entwicklung)
- **NextAuth.js 4.24.11** - Sichere Authentifizierung
- **next-intl 4.3.9** - Mehrsprachigkeit (Deutsch/Englisch)
- **CIEDE2000** - Präzise Farbanalyse mit DeltaE2000-Metrik
- **Docker** - Containerisierung für Deployment (PostgreSQL 16, Node.js 22)
- **Tailwind CSS 4** - Utility-first CSS Framework
- **Radix UI** - Accessible UI-Komponenten

### 13.4 Datenbank-Statistik

**Stand: Dezember 2025**

- **46 Datenbank-Models** für verschiedene Entitäten:
  - E-Commerce: Gemstone, Cart, Order, Customer, Invoice (10 Models)
  - Content: Blog, Story, KnowledgeBase, AboutContent (4 Models)
  - System: User, Session, CompanySettings, HeaderData, FooterLink (8 Models)
  - Features: ColorChart, GemstoneAnalysis, Location, Review, Wishlist (10 Models)
  - Weitere: Newsletter, Tag, SelectOption, LegalPage, etc. (14 Models)
- **15 Enums** für typsichere Werte (UserRole, OrderStatus, PaymentStatus, etc.)
- **50+ Relations** zwischen Models für Datenintegrität
- **100+ Indexes** für Performance-Optimierung
- **PostgreSQL 16** als Datenbank-Engine (kompatibel mit vorhandenen Daten)
- **Port 5433** für lokale Entwicklung (wenn Port 5432 belegt ist)

### 13.5 Code-Statistik

**Stand: Dezember 2025**

#### 13.5.1 Gesamt-Übersicht nach Dateitypen

| Dateityp | Dateien | Zeilen Code | Anteil |
|----------|---------|-------------|--------|
| **TypeScript (.ts)** | 230 | 35.658 | 33,1% |
| **TypeScript React (.tsx)** | 283 | 59.962 | 55,7% |
| **JavaScript (.js)** | 48 | 7.976 | 7,4% |
| **HTML (.html)** | 8 | 907 | 0,8% |
| **CSS (.css)** | 4 | 870 | 0,8% |
| **SCSS/SASS (.sst)** | 0 | 0 | 0,0% |
| **GESAMT** | **573** | **105.373** | **100,0%** |

#### 13.5.2 Zusammenfassung

- **TypeScript/TSX:** 513 Dateien, 95.620 Zeilen (88,8%)
  - TypeScript React (TSX): 283 Dateien, 59.962 Zeilen (55,7%)
  - TypeScript (TS): 230 Dateien, 35.658 Zeilen (33,1%)
- **JavaScript:** 48 Dateien, 7.976 Zeilen (7,4%)
- **HTML/CSS:** 12 Dateien, 1.777 Zeilen (1,6%)
  - HTML: 8 Dateien, 907 Zeilen (0,8%)
  - CSS: 4 Dateien, 870 Zeilen (0,8%)
- **SCSS/SASS:** 0 Dateien, 0 Zeilen (0,0%)

#### 13.5.3 Hauptsprachen

1. **TypeScript React (TSX)** - 55,7% (59.962 Zeilen)
2. **TypeScript (TS)** - 33,1% (35.658 Zeilen)
3. **JavaScript (JS)** - 7,4% (7.976 Zeilen)

#### 13.5.4 Feature-spezifische Statistiken

- **Farbtafeln:** 2.958 Zeilen Code
- **Farbanalyse:** 8.704 Zeilen Code
- **Gesamt (color-charts):** 12.182 Zeilen Code (nur für diese Features)
- **Gesamt-Projekt:** 105.373 Zeilen Code (alle Dateitypen)

**Hinweis:** Die Statistiken schließen `node_modules`, `.next`, `.git`, `dist` und `build` aus.

### 13.6 Moderne Web Design Vorschläge

Ein umfassendes Dokument mit modernen Web Design-Trends, Progressive Enhancement-Strategien und Implementierungsvorschlägen für das Gemilike-Projekt finden Sie in:

**📄 `MODERNE_WEB_DESIGN_VORSCHLAEGE.md`**

Das Dokument enthält:
- Progressive Enhancement Strategien (HTML → CSS → JavaScript Schichten)
- Moderne Design-Trends 2025 (Neumorphismus, Dark Mode, Immersive Experiences)
- Performance-Optimierungen (Lazy Loading, Code Splitting, Service Workers)
- Accessibility & Inklusion (WCAG 2.1 AA, ARIA, Keyboard Navigation)
- Interaktive Elemente (Mikrointeraktionen, Scroll-Animationen, 3D-Effekte)
- Implementierungs-Roadmap (10-Wochen-Plan)

**Basierend auf:**
- [Progressive Enhancement Best Practices](https://medium.com/theymakedesign/progressive-enhancement-536a064edbff)
- [Modern Website Design Trends](https://www.spinxdigital.com/blog/best-website-design/)
- [Awwwards Best Practices](https://www.awwwards.com/)
- [Designmodo Web Design Trends](https://designmodo.com/web-design-trends/)

### 13.7 Implementierte Moderne Web Design Features (Version 2.4.0)

**Status:** ✅ Alle Phasen implementiert (November 2025)

#### Phase 1: Foundation (Progressive Enhancement & Accessibility)

**✅ Progressive Enhancement für Formulare:**
- Kontaktformular (`app/[locale]/contact/page.tsx`)
  - Server-Side Fallback mit `action="/api/contact"` und `method="POST"`
  - `<noscript>` Fallback für JavaScript-deaktivierte Browser
  - Semantisches HTML mit `<main>`, `<header>`, `<section>`, `<aside>`
  - Vollständige ARIA-Labels (`aria-label`, `aria-required`, `aria-describedby`)
  - Screen Reader Optimierung mit `sr-only` Klassen
- Newsletter-Formular (`components/newsletter/NewsletterForm.tsx`)
  - Server-Side Fallback mit `action="/api/newsletter"`
  - ARIA-Labels und Hidden Inputs für Locale
  - `<noscript>` Fallback
- Review-Formular (`components/shop/ReviewForm.tsx`)
  - Server-Side Fallback mit `action="/api/reviews"`
  - `role="radiogroup"` für Star-Rating
  - Vollständige ARIA-Unterstützung
- AddToCart Button (`components/shop/AddToCartButton.tsx`)
  - `<noscript>` Fallback-Formular für JavaScript-deaktivierte Browser
  - ARIA-Labels und Live-Regionen

**✅ Semantisches HTML:**
- Alle Formulare verwenden semantische HTML5-Elemente
- Korrekte Verwendung von `<main>`, `<header>`, `<section>`, `<article>`, `<aside>`
- Verbesserte SEO und Accessibility

**✅ ARIA-Labels:**
- Alle interaktiven Elemente haben `aria-label` oder `aria-labelledby`
- Formular-Felder mit `aria-required` und `aria-describedby`
- Live-Regionen für dynamische Updates (`aria-live="polite"`)
- Icons mit `aria-hidden="true"`

**✅ `<noscript>` Fallbacks:**
- Alle kritischen Formulare haben Fallbacks
- AddToCart Button mit Fallback-Formular
- Benutzerfreundliche Nachrichten für JavaScript-deaktivierte Browser

#### Phase 2: Design-Updates

**✅ Neumorphismus (Soft UI):**
- CSS-Klassen in `app/globals.css`:
  - `.neumorphic` für Light Mode
  - `.neumorphic-dark` für Dark Mode
  - Hover-Effekte mit inset shadows
  - Smooth Transitions
- Angewendet auf GemstoneCard Komponenten

**✅ Dark Mode:**
- `DarkModeToggle` Komponente (`components/ui/DarkModeToggle.tsx`)
  - System-Präferenz-Erkennung
  - localStorage Persistenz
  - Hydration-safe Implementation
  - Integration in Header (Desktop & Mobile)
- Tailwind Config: `darkMode: 'class'` aktiviert
- CSS Dark Mode Varianten für alle Komponenten

**✅ Immersive Hero-Section:**
- Verbesserte Gradient-Overlays für besseren Text-Kontrast
- Dark Mode Varianten
- Parallax-Effekt via `ParallaxHero` Komponente
- ARIA-Labels für Accessibility

#### Phase 3: Interaktivität

**✅ Microinteractions:**
- `RippleButton` Komponente (`components/ui/RippleButton.tsx`)
  - Ripple-Effekt auf Button-Klicks
  - Smooth Animationen
- `MicroInteraction` Komponente (`components/ui/MicroInteraction.tsx`)
  - Scale, Bounce, Pulse, Glow Effekte
  - Hover-Interaktionen
- CSS-Animationen in `app/globals.css`:
  - `@keyframes ripple`
  - `.hover-scale`, `.hover-bounce`, `.hover-pulse`, `.hover-glow`

**✅ Scroll-Animationen:**
- `ScrollAnimated` Komponente (`components/ui/ScrollAnimated.tsx`)
  - Intersection Observer API
  - Fade, Slide (up/down/left/right) Animationen
  - Delay und Direction Props
  - Angewendet auf:
    - Shop Showcase Sektionen
    - Homepage Blog-Sektion
    - New Gemstones Carousel

**✅ Swipe-Gesten:**
- `Swipeable` Komponente (`components/ui/Swipeable.tsx`)
  - Touch-basierte Swipe-Erkennung
  - Links/Rechts Swipe-Handler
  - Angewendet auf MediaGallery für mobile Navigation

**✅ Parallax-Effekte:**
- `ParallaxHero` Komponente (`components/ui/ParallaxHero.tsx`)
  - Scroll-basierter Parallax-Effekt
  - Angewendet auf Hero-Section Hintergrundbilder

#### Phase 4: Performance

**✅ Lazy Loading:**
- Dynamische Imports für schwere Komponenten:
  - `InteractiveWorldMap` (WorldMap Client Component)
  - `ColorChartGrid` (Download Area)
  - `GemstoneColorAnalyzer` (Download Area)
- Image Lazy Loading:
  - `loading="lazy"` für Thumbnails
  - `priority={index === 0}` für erste Bilder
  - `sizes` Attribute für responsive Images
  - `placeholder="blur"` mit `blurDataURL` für progressive Loading

**✅ Image-Optimierung:**
- Next.js Image-Komponente mit optimierten Attributen
- Responsive `sizes` Attribute
- Blur Placeholders für bessere UX
- Lazy Loading für nicht-kritische Bilder

**✅ Service Worker:**
- `public/sw.js` - Service Worker für PWA/Offline Support
  - Cache-First Strategie
  - Pre-caching für kritische Routen
  - Runtime Caching für dynamische Inhalte
  - Offline Fallbacks
- `ServiceWorkerRegistration` Komponente (`components/ServiceWorkerRegistration.tsx`)
  - Automatische Registrierung in Production
  - Update-Handling

**✅ Preloading:**
- Kritische Ressourcen in `app/[locale]/layout.tsx`:
  - Logo Preload: `<link rel="preload" href="/logo.png" as="image" type="image/png" />`

#### Phase 5: Accessibility & Inklusion

**✅ Skip-to-Content Link:**
- `SkipToContent` Komponente (`components/accessibility/SkipToContent.tsx`)
  - Sichtbar bei Keyboard-Focus
  - Springt zu `#main-content`
- Integration in `app/[locale]/layout.tsx`

**✅ Keyboard Navigation:**
- `useKeyboardNavigation` Hook (`components/accessibility/useKeyboardNavigation.ts`)
  - Escape, Enter, Arrow Keys Support
  - Flexible Event-Handler
- `useFocusTrap` Hook (`components/accessibility/useFocusTrap.ts`)
  - Focus-Trapping für Modals/Dialogs
  - Tab-Navigation innerhalb von Containern

**✅ Focus Management:**
- Verbesserte Focus-Styles in `app/globals.css`:
  - `*:focus-visible` Styles
  - Element-spezifische Focus-Styles
  - Dark Mode Focus-Varianten
  - High Contrast Mode Support

**✅ Screen Reader Optimierung:**
- `LiveRegion` Komponente (`components/accessibility/LiveRegion.tsx`)
  - `role="status"` und `aria-live="polite"`
  - Dynamische Updates für Screen Reader
- `sr-only` und `sr-only-focusable` Utility-Klassen
- ARIA-Labels auf allen interaktiven Elementen

**✅ WCAG 2.1 AA Compliance:**
- Reduced Motion Support: `@media (prefers-reduced-motion: reduce)`
- High Contrast Support: `@media (prefers-contrast: high)`
- Color Contrast Ratios überprüft
- Keyboard-Navigation für alle Features

#### Phase 6: Interaktive Elemente

**✅ 3D-Effekte:**
- `Card3D` Komponente (`components/ui/Card3D.tsx`)
  - 3D Tilt-Effekt basierend auf Mausposition
  - `rotateX` und `rotateY` Transformationen
  - Intensity und Disabled Props
- Angewendet auf GemstoneCard Komponenten
- CSS 3D-Transform Utilities in `app/globals.css`

**✅ Erweiterte Scroll-Animationen:**
- Verschiedene Animation-Directions (fade, up, down, left, right)
- Delay-Props für gestaffelte Animationen
- Intersection Observer für Performance

**✅ Microinteractions:**
- Button-Press Animationen
- Hover-Effekte (Scale, Bounce, Pulse, Glow)
- Ripple-Effekte auf Klicks

#### Docker-Updates (Version 2.4.0)

**✅ Production Dockerfile:**
- Service Worker Verifikation nach Build
- Standalone Build Verifikation
- Kommentare für Service Worker Support
- Multi-Stage Build optimiert

**✅ Development Dockerfile:**
- Service Worker über Volume-Mount verfügbar
- Hot Reload für Development

**✅ docker-compose.yml:**
- Service Worker Verifikation beim Container-Start
- Verbesserte Logs und Health Checks

**✅ Build-Prozess:**
- Standalone Output aktiviert (`output: 'standalone'`)
- Optimierte Bundle-Größe
- Schnellere Container-Starts
- Cache Mounts für npm und Prisma

**Detaillierte Docker-Dokumentation:** Siehe `DOCKER_UPDATES.md`

---

## 14. Schnellreferenz

### 14.1 Wichtige URLs

#### Öffentliche URLs

- Startseite: `/` oder `/de`
- Shop: `/shop`
- Blog: `/blog`
- Downloads: `/downloads`
- Kontakt: `/contact`

#### Admin URLs

- Login: `/admin/login`
- Dashboard: `/admin/dashboard`
- Edelsteine: `/admin/gemstones`
- Kunden: `/admin/customers`
- Bestellungen: `/admin/orders`
- Rechnungen: `/admin/rechnungen`
- Farbtafeln: `/admin/color-charts`
- Farbanalysen: `/admin/gemstone-analyses`

### 14.2 Wichtige API-Endpunkte

#### Öffentliche APIs

- `POST /api/contact` - Kontaktformular
- `POST /api/newsletter` - Newsletter-Anmeldung
- `POST /api/orders` - Bestellung erstellen
- `GET /api/color-charts` - Farbtafeln abrufen

#### Admin APIs

- `GET /api/admin/dashboard` - Dashboard-Statistiken
- `GET /api/admin/gemstones` - Edelsteine abrufen
- `GET /api/admin/customers` - Kunden abrufen
- `GET /api/admin/orders` - Bestellungen abrufen

### 14.3 Datenbank-Models (Kurzübersicht)

**E-Commerce:**

- Customer, Order, OrderItem, Cart, CartItem, Wishlist

**Edelsteine:**

- Gemstone, GemstoneAttributes, GemstoneInventory, GemstonePrice, GemstoneMedia

**Content:**

- Blog, Story, KnowledgeBase, LegalPage

**System:**

- User, Session, AuditLog, CompanySettings

**Spezial:**

- ColorChart, GemstoneAnalysis

---

**Ende des Anwenderhandbuchs**

*Letzte Aktualisierung: November 2025*  
*Version: 2.5.0*  
*Gesamt: 4.000+ Zeilen Dokumentation*

## Änderungsprotokoll

### Version 2.5.0 (November 2025)

- **Design & Layout-System - Vollständige Umsetzung:**
  - ✅ **Alle öffentlichen Seiten angepasst** - Einheitliches Layout basierend auf Shop-Seite
  - ✅ **Inter-Schriftart vollständig integriert** - Über Next.js Font Optimization
  - ✅ **Einheitliche Überschriften-Hierarchie** - H1 mit Impact + Gradient, H2/H3 mit Inter
  - ✅ **Textfarbe-Strategie umgesetzt** - Alle Texte verwenden `text-gray-200` statt `text-white`
  - ✅ **Layout-Konsistenz hergestellt** - Alle Seiten verwenden identisches Background, Container und Card-Styling

- **Angepasste Seiten:**
  - ✅ Startseite (`/`) - Layout, Hintergrund, Container, Typografie
  - ✅ Shop-Seite (`/shop`) - Vorlage für alle anderen Seiten
  - ✅ Wissenswertes (`/wissenswertes`) - Vollständig angepasst
  - ✅ Blog (`/blog`) - Vollständig angepasst
  - ✅ Kontakt (`/contact`) - Vollständig angepasst, Textfarben korrigiert
  - ✅ Services (`/services`) - Vollständig angepasst, Textfarben korrigiert
  - ✅ Downloads (`/downloads`) - Vollständig angepasst
  - ✅ Weltkarte (`/worldmap`) - Vollständig angepasst
  - ✅ Zertifikate (`/certificates`) - Komplett neu gestaltet (vorher heller Hintergrund)
  - ✅ AGB (`/terms`) - Vollständig angepasst, Container und Textfarben
  - ✅ Datenschutz (`/privacy`) - Vollständig angepasst, Container und Textfarben
  - ✅ Impressum (`/imprint`) - Vollständig angepasst, Container und Textfarben
  - ✅ Cookies (`/cookies`) - Vollständig angepasst, Container und Textfarben
  - ✅ Widerruf (`/returns`) - Vollständig angepasst, Container und Textfarben
  - ✅ Versand (`/shipping`) - Vollständig angepasst, Container und Textfarben

- **Technische Verbesserungen:**
  - ✅ Inter-Schriftart über `layout.tsx` global aktiviert
  - ✅ Alle `text-gray-300` zu `text-gray-200` geändert für bessere Konsistenz
  - ✅ Alle Legal Pages verwenden jetzt `story-card` statt `bg-card`
  - ✅ Alle H1-Überschriften verwenden einheitlich `font-impact font-weight-impact` mit `gemilike-text-gradient`
  - ✅ Alle H2/H3-Überschriften verwenden Inter (automatisch über `font-inter` auf body)
  - ✅ Code-Qualität: Alle Linter-Fehler behoben

- **Code-Qualität:**
  - ✅ Linter läuft ohne Fehler oder Warnungen
  - ✅ Alle Parsing-Fehler behoben
  - ✅ Ungenutzte Parameter entfernt

**Detaillierte Dokumentation:** Siehe Abschnitt [2.4](#24-design--layout-system)

### Version 2.4.0 (November 2025)

- **Moderne Web Design Features - Vollständige Implementierung:**
  - ✅ **Phase 1: Foundation** - Progressive Enhancement, Semantisches HTML, ARIA-Labels, `<noscript>` Fallbacks
  - ✅ **Phase 2: Design-Updates** - Neumorphismus, Dark Mode, Immersive Hero-Section
  - ✅ **Phase 3: Interaktivität** - Microinteractions, Scroll-Animationen, Swipe-Gesten, Parallax-Effekte
  - ✅ **Phase 4: Performance** - Lazy Loading, Image-Optimierung, Service Worker, Preloading
  - ✅ **Phase 5: Accessibility & Inklusion** - Skip-to-Content, Keyboard Navigation, Focus Management, WCAG 2.1 AA, Screen Reader Optimierung
  - ✅ **Phase 6: Interaktive Elemente** - 3D-Effekte, Erweiterte Scroll-Animationen, Microinteractions

- **Neue Komponenten:**
  - `DarkModeToggle`, `RippleButton`, `ScrollAnimated`, `Swipeable`, `ParallaxHero`
  - `Card3D`, `MicroInteraction`, `SkipToContent`, `LiveRegion`
  - `ServiceWorkerRegistration`, `useKeyboardNavigation`, `useFocusTrap`

- **Docker-Updates:**
  - ✅ Service Worker Verifikation im Build-Prozess
  - ✅ Standalone Build Verifikation
  - ✅ Runtime Service Worker Check
  - ✅ Optimierte Multi-Stage Builds

- **Performance & Accessibility:**
  - ✅ Lazy Loading für schwere Komponenten
  - ✅ Image-Optimierung mit Next.js Image-Komponente
  - ✅ Service Worker für Offline-Support
  - ✅ Vollständige WCAG 2.1 AA Compliance

**Detaillierte Dokumentation:** Siehe Abschnitt [13.7](#137-implementierte-moderne-web-design-features-version-240)

### Version 2.3.0 (November 2025)

- **Build & Deployment:**
  - ✅ Erfolgreicher Production-Build (Next.js 15.5.6)
  - ✅ 87 Routen erfolgreich generiert (App + API)
  - ✅ Build-Zeit: ~25-50 Sekunden
  - ✅ Alle statischen Seiten erfolgreich generiert
  - ✅ Type-Checking und Linting ohne Fehler
  - ✅ Middleware: 45.3 kB

- **Docker-Update:**
  - ✅ Docker-Container erfolgreich aktualisiert
  - ✅ Image neu gebaut mit `--no-cache` (inkl. aller neuesten Änderungen)
  - ✅ Container-Status: Beide Container healthy
  - ✅ Datenbank-Migrationen erfolgreich angewendet (12 Migrationen)
  - ✅ Anwendung läuft auf Port 3002 (http://localhost:3002)
  - ✅ PostgreSQL läuft auf Port 5433
  - ✅ Health Checks funktionieren korrekt
  - ✅ Alle Dependencies aktualisiert (inkl. exceljs statt xlsx)

- **Sicherheit:**
  - ✅ npm audit: 0 vulnerabilities
  - ✅ xlsx → exceljs Migration abgeschlossen
  - ✅ Alle Security-Scans erfolgreich

- **Build-Statistiken:**
  - **Größte Route:** `/[locale]/downloads` (35.6 kB, First Load: 518 kB)
  - **Größte API-Route:** Standard 406 B (alle API-Routen)
  - **Shared JS:** 102 kB (First Load JS für alle Routen)
  - **Middleware:** 45.3 kB
  - **Gesamt-Routen:** 87 (inkl. API-Routen)

### Version 2.2.0 (November 2025)

- **Weltkarte - Umfangreiche Standort-Erweiterung:**
  - 10 Standorte für Granat (Garnet) hinzugefügt
  - 10 Standorte für Turmalin (Tourmaline) hinzugefügt
  - 10 Standorte für Saphir (Sapphire) hinzugefügt
  - 10 Standorte für Rubin (Ruby) hinzugefügt
  - 10 Standorte für Beryll (Beryl) hinzugefügt
  - 10 Standorte für Chrysoberyll/Alexandrit (Chrysoberyl/Alexandrite) hinzugefügt
  - 10 Standorte für Spinell (Spinel) hinzugefügt
  - Gesamt über 80 Standorte weltweit verfügbar
  - Hintergrund der Weltkarte angepasst (gleicher Stil wie Wissenswertes-Seite)
  - Einheitliches Design mit `public-page-bg` Klasse

- **Farbanalyse - Verbesserte Genauigkeit:**
  - **Verbesserte Violett-Erkennung:**
    - Präzise Unterscheidung zwischen Violett und Rot-Violett
    - RGB-basierte Validierung für alle Farbklassifizierungen
    - CIE-Hue-Berechnung berücksichtigt RGB-Werte
    - Verhindert Fehlklassifizierung von violetten Steinen als Rot
    - Strikte Bedingungen für Rot-Klassifizierung (Rot muss mindestens 2x Blau sein)
  - **CIE-Hue für sekundäre Farben:**
    - CIE-Hue-Berechnung für alle Nebenfarbtöne (Zentralbereich, Facettenreflexe, Schattenbereiche)
    - Anzeige in der Sekundärfarben-Sektion
    - RGB-basierte Korrektur auch für sekundäre Farben
  - **Fallback-Mechanismus für Pixelextraktion:**
    - 3-stufiger Fallback bei restriktiven Masken
    - Zentrale Region als Fallback (60% des Bildes)
    - Gesamtes Bild ohne Ränder als letzter Fallback
    - Lockere Alpha-Kanal-Prüfung (nur vollständig transparente Pixel)
    - Verbesserte Fehlermeldungen

- **Technische Verbesserungen:**
  - `getColorDescription()` Funktion erweitert mit RGB-Validierung
  - `getCIEHue()` Funktion erweitert mit RGB-Parameter
  - `getGIAHue()` Funktion verbessert für bessere Violett-Erkennung
  - `SecondaryColorAnalysis` Interface erweitert um `lab` und `cieHue`
  - `enhancedColorExtraction.ts` mit Fallback-Mechanismus erweitert

### Version 2.5.2 (20. Dezember 2025)

- **Vektorsuche erweitert:**
  - **Alle Edelstein-Attribute integriert:** Die Vektorsuche durchsucht jetzt alle Attribute aus der GemstoneCard:
    - Farbsättigung (colorSaturation) mit Synonym-Unterstützung
    - Klarheit (clarity)
    - Schliff (cut) und Schliffform (cutForm) mit Synonym-Unterstützung
    - Behandlung (treatment)
    - Seltenheit (rarity) mit Synonym-Unterstützung
    - Beschreibung (description) und Kurzbeschreibung (shortDescription)
    - Typ (type)
    - Gewicht mit Einheit (z. B. "2.5 ct")
    - Abmessungen (z. B. "10x8x6")
  - **Synonym-Unterstützung:**
    - Farbsättigung: "vivid" = "lebhaft", "kräftig"; "intense" = "intensiv", "stark"; etc.
    - Schliff: "brillant" = "rund", "round"; "princess" = "quadratisch"; etc.
    - Seltenheit: "gewöhnlich" = "common"; "selten" = "rare"; etc.
  - **Explizite Zertifikats-Suche:**
    - "mit Zertifikat" / "mit Zertifizierung" / "alle steine mit Zertifizierung"
    - "ohne Zertifikat" / "ohne Zertifizierung"
    - Erkennt sowohl String- als auch Objekt-basierte Zertifikatsdaten
  - **Explizite Behandlungs-Suche:**
    - "mit Behandlung" / "mit treatment" / "behandelt"
    - "ohne Behandlung" / "ohne treatment" / "unbehandelt" / "untreated"
    - Erkennt sowohl String- als auch Objekt-basierte Behandlungsdaten
- **Internationalisierung für Shop-Seite:**
  - Alle Texte auf der Shop-Seite sind jetzt vollständig übersetzt (Deutsch/Englisch)
  - Vektorsuche-UI komplett übersetzt (Titel, Beschreibung, Platzhalter, Buttons, Statusmeldungen)
  - Fehlermeldungen mehrsprachig
  - Neue Edelsteine Karussell auf der Homepage übersetzt
  - Übersetzungsdateien erweitert: `messages/de.json` und `messages/en.json`
- **Technische Verbesserungen:**
  - `ShopShowcase` Komponente verwendet jetzt `useTranslations('shop')`
  - `NewGemstonesCarousel` Komponente verwendet jetzt `useTranslations('home')`
  - Alle hardcodierten deutschen Texte durch Übersetzungsschlüssel ersetzt

### Version 2.1.0 (Dezember 2025)

- **Shop-Seite Verbesserungen:**
  - Grid-Layout: 5 Thumbnails pro Zeile, linksbündig ausgerichtet
  - Filter-Felder: Breite um 2/3 reduziert (max. 33,333% der Containerbreite)
  - Filter-Anordnung: "Herkunft" neben "Edelsteinart" platziert
  - Filter-Umbenennung: "Kategorie" zu "Edelsteinart" geändert
  - Neue Filter hinzugefügt: Farbe, Klarheit, Behandlung, Zertifizierung
  - Behandlung-Filter: "Keine Behandlung" steht am Anfang der Liste
  - Zertifizierung-Filter: "Keine Zertifizierungen" als separate Option am Anfang
  - Checkbox-Position: "Verkauft-Status ausblenden" 20px rechts vom "Filter zurücksetzen"-Button
  - GemstoneCard: Modale, verschiebbare Detailansicht (keine separate Seite)
  - Badges: Farbcodierung mit gleichen Farben wie Piktogramme
  - MediaGallery: Nummerierung der Bilder entfernt
- **Homepage Karussell:**
  - Links öffnen jetzt die GemstoneCard auf der Shop-Seite (`/shop?gem={id}`)
- **Farbtafeln-Verbesserungen:**
  - GIA-Daten unabhängig vom Gradient (entweder GIA oder Gradient erforderlich)
  - Automatische Gradient-Generierung aus GIA-Daten
  - Auto-Parsing für GIA-Eingabe im Format "pkR,5,4"
  - Manueller Gradient hat Priorität vor GIA-Generierung
- **Downloads-Seite:**
  - Palette-Vergleich (ΔE) Sektion entfernt

### Version 2.0.0 (Dezember 2025)

- **Borderline v4: Erweiterte Farbanalyse-Funktionen:**
  - K-Means++ Initialisierung für bessere Cluster-Qualität
  - Auto-K via GMM+BIC für automatische, datengetriebene Clusterzahl
  - SLIC Superpixels für verbesserte Maskierung
  - Guided Filter für edge-preserving Masken-Glättung
  - ICC-Profil-Unterstützung mit automatischer Weißpunkt-Extraktion
  - Borderline-Erkennung mit zirkulärer Statistik und Soft Category Classification
  - Hue Histogram Peak Detection für Pleochroismus-Analyse
  - Erweiterte Export-Funktionen (CSV, PDF v4)
- **Mathematische Dokumentation:**
  - Umfassende Erklärung aller verwendeten Algorithmen
  - Mathematische Formeln und physikalische Hintergründe
  - Verständliche Erklärungen für Nicht-Mathematiker

### Version 1.3.0 (7.11.2025)

- **Erweiterte Farbanalyse-Funktionen:**
  - D50/D65 Whitepoint-Auswahl mit Bradford-Chromatic-Adaptation
  - Manueller K-Means Cluster-Wert (3-20)
  - Erweiterte Maskierungs-Optionen (Weiß, Schwarz, Sättigung, Smart Mask)
  - Benutzerdefinierte Paletten
  - Palette-Vergleich mit ΔE76 und ΔE2000 Metriken
  - OpenCV GrabCut Integration für präzise Segmentierung
  - Mehrere Bilder gleichzeitig
  - PDF-Export mit allen Analyse-Ergebnissen
- **Datenbank-Erweiterungen:**
  - Neue Felder in `GemstoneAnalysis`: `whitepoint`, `kValue`, `maskingOptions`, `customPalette`, `paletteComparisons`
- **Admin-Funktionen:**
  - Anzeige erweiterter Parameter in Detailansicht
  - Palette-Vergleich-Anzeige
  - Erweiterte Filterung und Suche

### Version 1.2.0 (Januar 2025)

- Initiale Dokumentation
- Basis-Funktionalitäten dokumentiert
Was ich gemacht habe:
Port-Mapping hinzugefügt: In deploy/strato-compose.yml wurde Port 5433 nach außen gemappt.
PostgreSQL-Version angepasst: In docker-compose.yml von Version 17 auf 16 geändert (kompatibel mit vorhandenen Daten).
Datenbank neu initialisiert: Das Volume wurde neu erstellt, damit der Benutzer korrekt angelegt wird.
Aktueller Status:

PostgreSQL läuft auf Port 5433
Verbindung funktioniert: postgresql://gemilike:change-me-in-production@localhost:5433/gemilike
Container ist gesund und erreichbar
