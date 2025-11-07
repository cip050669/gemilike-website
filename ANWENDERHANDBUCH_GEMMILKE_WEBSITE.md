# 📘 Anwenderhandbuch: Gemilike Website

**Version:** 1.3.0  
**Stand:** November 2025  
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
8. [Technische Details](#8-technische-details)

---

## 1. Einführung

### 1.1 Über dieses Handbuch

Dieses Anwenderhandbuch dokumentiert die vollständige Funktionalität der Gemilike-Website, einschließlich aller öffentlichen Seiten, Admin-Funktionen und der zugrundeliegenden Datenbankstruktur. Es dient sowohl als Benutzerhandbuch für Administratoren als auch als technische Dokumentation für Entwickler.

### 1.2 Website-Übersicht

Die Gemilike-Website ist eine moderne E-Commerce-Plattform für Edelsteine mit folgenden Hauptfunktionen:

- **E-Commerce-Shop** für Edelsteine
- **Content-Management** für Blogs, Stories und Wissenswertes
- **Farbanalyse-System** für Edelstein-Farbanalysen
- **Farbtafeln-System** für GIA-konforme Farbdarstellungen
- **Kundenverwaltung** mit Bestellungen und Rechnungen
- **Newsletter-Management**
- **Weltkarte** mit Fundorten

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

---

## 3. Öffentliche Website

### 3.1 Startseite (`/` oder `/de`)

**Route:** `app/[locale]/page.tsx`

**Funktionalität:**
- Hero-Bereich mit konfigurierbaren Bildern und Texten
- Newsticker für aktuelle Nachrichten
- Neue Edelsteine Karussell
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
- Filterung nach Kategorie, Preis, Herkunft
- Sortierung nach verschiedenen Kriterien
- Detailansicht einzelner Edelsteine (`/shop/[gemId]`)

**Datenquellen:**
- `Gemstone` (Hauptdaten)
- `GemstoneAttributes` (Attribute wie Größe, Farbe)
- `GemstoneInventory` (Lagerbestand)
- `GemstonePrice` (Preise)
- `GemstoneMedia` (Bilder/Videos)

**Features:**
- Erweiterte Suche mit Filtern
- Warenkorb-Integration
- Wishlist-Funktion
- Responsive Grid-Layout

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
- Fundorte von Edelsteinen
- Filterung nach Edelstein-Typ
- Detailansicht von Fundorten

**Datenquellen:**
- `Location` (Fundorte)
- `GemType` (Edelstein-Typen)
- `Country` (Länder)

**Technische Details:**
- Leaflet.js für Karten-Rendering
- Clustering für viele Marker
- Popups mit Detailinformationen

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
   - Bradford-Chromatic-Adaptation für präzise Farbkonvertierung
   
   **K-Means Cluster-Wert:**
   - **Automatisch**: Adaptive Cluster-Anzahl (3-20) je nach Bildgröße
   - **Manuell**: Manuelle Festlegung der Cluster-Anzahl (3-20)
   - Beeinflusst die Farb-Extraktion und Genauigkeit
   
   **Maskierungs-Optionen:**
   - **Hell/Neutral filtern**: Filtert helle und neutrale Pixel (Schwelle: 180-250)
   - **Sehr dunkel filtern**: Filtert sehr dunkle Pixel (Schwelle: 0-60)
   - **Niedrige Sättigung filtern**: Filtert ungesättigte Pixel (Schwelle: 0-30)
   - **Smart Mask**: Intelligente Kanten-Erkennung für bessere Segmentierung
   - Anpassbare Schwellenwerte für alle Filter
   
   **Benutzerdefinierte Palette:**
   - Manuelles Hinzufügen von HEX-Farben
   - Vergleich der Primärfarbe mit benutzerdefinierten Paletten
   - Integration in Palette-Vergleich
   
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

4. **6-stufige Analyse** (unverändert beibehalten)
   - Primärfarbe (Hauptfarbton)
   - Sekundärfarben (Zentrum, Facetten, Schatten)
   - Helligkeit und Sättigung
   - Spektrale Charakteristik
   - GIA-Farbbewertung
   - Gesamteindruck mit Varietät-Vorschlägen

5. **Palette-Vergleich**
   - Automatischer Vergleich mit vordefinierten Paletten
   - Vergleich mit benutzerdefinierter Palette
   - ΔE76 und ΔE2000 Metriken
   - Anzeige der besten Übereinstimmungen
   - Integration in Analyse-Ergebnisse

6. **Export-Funktionen**
   - **PNG-Export**: Hochauflösendes Bild (2x Skalierung) mit allen Ergebnissen
   - **JSON-Export**: Vollständige Analyse-Daten im JSON-Format
   - **PDF-Export**: Professioneller PDF-Bericht mit:
     - Primärfarbe und Palette-Vergleich
     - Sekundärfarben
     - Helligkeit/Sättigung
     - Spektrale Charakteristik
     - GIA-Bewertung
     - Gesamteindruck
     - Erweiterte Parameter (Whitepoint, K-Value, etc.)

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
- `gradient` - Array von Hex-Farben
- `pleochro` - Array von Pleochroismus-Farben
- `light` - Lichtstandard (Standard: "D55, CRI ≥95")
- `published` - Veröffentlichungsstatus
- `featured` - Featured-Status

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

Die Datenbank besteht aus **27 Haupt-Models** mit umfangreichen Relations:

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

**Erweiterte Features:**

#### Whitepoint-Auswahl
- **D65** (Standard): Standard für sRGB-Displays, Tageslicht-ähnlich
- **D50**: Standard für Druck/ICC-Profile, neutraleres Weiß
- **Bradford-Chromatic-Adaptation**: Automatische Farbkonvertierung zwischen Whitepoints
- Beeinflusst alle Farbberechnungen (Lab, ΔE2000, etc.)

#### K-Means Clustering
- **Automatisch**: Adaptive Cluster-Anzahl (3-20) basierend auf Bildgröße
- **Manuell**: Benutzerdefinierte Cluster-Anzahl (3-20)
- **k-means++ Initialisierung**: Optimierte Startwerte
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
- **Clustering:** K-Means für Farb-Clustering (adaptiv oder manuell)
- **Edge Detection:** Für Facetten-Erkennung
- **Adaptive Sampling:** Für wichtige Bildbereiche
- **Bradford-Adaptation:** Für Whitepoint-Konvertierung
- **OpenCV.js:** Für GrabCut-Segmentierung (optional)

**Datenbank:**
- `GemstoneAnalysis` - Gespeicherte Analysen mit erweiterten Parametern:
  - `whitepoint` (String: 'D50' | 'D65')
  - `kValue` (Int, optional)
  - `maskingOptions` (JSON, optional)
  - `customPalette` (JSON: string[], optional)
  - `paletteComparisons` (JSON: PaletteComparison[], optional)
- Korrekturen werden in `overallImpression.correctedVariety` gespeichert

---

### 7.2 Farbtafeln-System

**Zweck:** GIA-konforme Darstellung von Edelstein-Farben

**Funktionalität:**
1. **Farbtafel-Erstellung** - Erstellen von Farbtafeln mit GIA-Daten
2. **Gradient-Anzeige** - Visualisierung von Farbverläufen
3. **Pleochroismus-Visualisierung** - Anzeige von Pleochroismus-Farben
4. **DeltaE2000-Vergleich** - Vergleich mit anderen Farbtafeln
5. **Export-Funktionen** - PDF, JSON, Bild-Export

**Technische Details:**
- **GIA-Format:** Hue, Tone, Saturation
- **Farbraum-Konvertierung:** Hex → RGB → XYZ → Lab
- **DeltaE2000:** CIEDE2000-Algorithmus für Farbvergleiche

**Datenbank:**
- `ColorChart` - Farbtafeln

---

### 7.3 E-Commerce-Funktionen

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

## 8. Technische Details

### 8.1 Authentifizierung & Autorisierung

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

### 8.2 Internationalisierung

**next-intl:**
- Mehrsprachigkeit (de, en)
- Locale-basierte Routen (`/[locale]/...`)
- Übersetzungen in `messages/` Verzeichnis
- Dynamische Locale-Erkennung

---

### 8.3 Bildverarbeitung

**Sharp:**
- Bildoptimierung
- Thumbnail-Generierung
- Format-Konvertierung

**Canvas (Browser):**
- Farb-Extraktion
- Bild-Analyse
- Region-Erkennung

---

### 8.4 PDF-Generierung

**@react-pdf/renderer:**
- Rechnungen als PDF
- Farbtafeln-Export
- Zertifikate

---

### 8.5 State Management

**Zustand:**
- Warenkorb-State
- Wishlist-State
- UI-State

**Server State:**
- React Server Components
- Server-Side Data Fetching
- Caching

---

### 8.6 Performance-Optimierungen

- **Next.js Standalone Output** - Für Docker
- **Image Optimization** - Next.js Image Component
- **Code Splitting** - Automatisch durch Next.js
- **Static Generation** - Wo möglich
- **Incremental Static Regeneration** - Für dynamische Inhalte

---

### 8.7 Sicherheit

- **CSRF-Schutz** - NextAuth.js
- **XSS-Schutz** - React automatisch
- **SQL-Injection-Schutz** - Prisma ORM
- **Authentifizierung** - NextAuth.js
- **Autorisierung** - Rollen-basiert
- **Audit-Logging** - Alle Admin-Aktionen

---

## 9. Deployment & Wartung

### 9.1 Docker-Setup

**Production:**
```bash
docker-compose up -d
```

**Development:**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Details:** Siehe `DOCKER_SETUP.md`

---

### 9.2 Datenbank-Migrationen

```bash
# Migrationen ausführen
npx prisma migrate deploy

# Prisma Client generieren
npx prisma generate
```

---

### 9.3 Backup-Strategie

**Empfohlene Backups:**
- Tägliche Datenbank-Backups
- Wöchentliche Media-Backups
- Monatliche Voll-Backups

---

## 10. Support & Kontakt

### 10.1 Dokumentation

- **Farbtafeln & Farbanalyse:** `DOKUMENTATION_FARBTAFELN_UND_FARBANALYSE.md`
- **Docker:** `DOCKER_SETUP.md`
- **API-Routen:** `ROUTES.md`
- **Datenbank-Analyse:** `ANALYSE_FUNKTIONEN_DATENBANK.md`

### 10.2 Troubleshooting

**Häufige Probleme:**
1. **Session-Probleme:** Cookies löschen, neu einloggen
2. **Datenbank-Verbindung:** Prüfe DATABASE_URL
3. **Build-Fehler:** `npm run build` für Details
4. **Docker-Probleme:** Siehe `DOCKER_SETUP.md`

---

## 11. Zusammenfassung

### 11.1 Website-Übersicht

Die Gemilike-Website ist eine vollständige E-Commerce-Plattform mit:

- **27 Datenbank-Models** für verschiedene Entitäten
- **50+ öffentliche Seiten** für Benutzer
- **40+ Admin-Funktionen** für Verwaltung
- **100+ API-Endpunkte** für Backend-Funktionalität
- **13.000+ Zeilen Code** für Farbtafeln und Farbanalyse

### 11.2 Hauptfunktionen

#### Öffentliche Bereiche
1. **E-Commerce:** Shop, Warenkorb, Checkout, Bestellungen
2. **Content:** Blog, Stories, Wissenswertes
3. **Tools:** Farbanalyse, Farbtafeln, Weltkarte
4. **Information:** Über uns, Leistungen, Kontakt
5. **Rechtliches:** Impressum, Datenschutz, AGB, etc.

#### Admin-Bereiche
1. **Produktverwaltung:** Edelsteine, Attribute, Preise, Inventar
2. **Kundenverwaltung:** Kunden, Adressen, Bestellungen
3. **Rechnungsverwaltung:** Rechnungen, Bankverbindungen, PDF
4. **Content-Management:** Blog, Stories, Knowledge Base
5. **System-Verwaltung:** Einstellungen, Header, Footer, Hero
6. **Analytics:** Dashboard, Reports, Checkout-Analytics, Audit-Log
7. **Spezial-Features:** Farbtafeln, Farbanalysen

### 11.3 Technologie-Highlights

- **Next.js 15.5.4** - Modernes React-Framework
- **PostgreSQL + Prisma** - Type-safe Datenbankzugriff
- **NextAuth.js** - Sichere Authentifizierung
- **next-intl** - Mehrsprachigkeit
- **CIEDE2000** - Präzise Farbanalyse
- **Docker** - Containerisierung für Deployment

### 11.4 Datenbank-Statistik

- **27 Haupt-Models**
- **15 Enums** für typsichere Werte
- **50+ Relations** zwischen Models
- **100+ Indexes** für Performance

### 11.5 Code-Statistik

- **Farbtafeln:** 8.174 Zeilen Code
- **Farbanalyse:** 4.883 Zeilen Code
- **Gesamt:** 13.057 Zeilen Code (nur für diese Features)
- **Gesamt-Projekt:** ~50.000+ Zeilen Code (geschätzt)

---

## 12. Schnellreferenz

### 12.1 Wichtige URLs

#### Öffentlich
- Startseite: `/` oder `/de`
- Shop: `/shop`
- Blog: `/blog`
- Downloads: `/downloads`
- Kontakt: `/contact`

#### Admin
- Login: `/admin/login`
- Dashboard: `/admin/dashboard`
- Edelsteine: `/admin/gemstones`
- Kunden: `/admin/customers`
- Bestellungen: `/admin/orders`
- Rechnungen: `/admin/rechnungen`
- Farbtafeln: `/admin/color-charts`
- Farbanalysen: `/admin/gemstone-analyses`

### 12.2 Wichtige API-Endpunkte

#### Öffentlich
- `POST /api/contact` - Kontaktformular
- `POST /api/newsletter` - Newsletter-Anmeldung
- `POST /api/orders` - Bestellung erstellen
- `GET /api/color-charts` - Farbtafeln abrufen

#### Admin
- `GET /api/admin/dashboard` - Dashboard-Statistiken
- `GET /api/admin/gemstones` - Edelsteine abrufen
- `GET /api/admin/customers` - Kunden abrufen
- `GET /api/admin/orders` - Bestellungen abrufen

### 12.3 Datenbank-Models (Kurzübersicht)

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

*Letzte Aktualisierung: 7.11.2025*  
*Version: 1.3.0*  
*Gesamt: 1.650+ Zeilen Dokumentation*

## Änderungsprotokoll

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

