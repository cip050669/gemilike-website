# Gemilike Website

Eine moderne, mehrsprachige Edelsteinhandel-Website mit professionellem Admin-Panel, erweiterten Shop-Features, umfangreichen Funktionen und integrierter Rechnungsanwendung für Kleinunternehmer.

## Features

- ✅ **Mehrsprachig (DE/EN)** - Vollständige Internationalisierung mit next-intl
- ✅ **Blog-System** - Markdown-basiertes Blog mit Kategorien
- ✅ **E-Commerce Shop** - Professioneller Edelstein-Katalog mit Warenkorb
- ✅ **Admin-Panel** - Vollständige grafische Produktverwaltung mit Drag & Drop Upload
- ✅ **Hero Image Management** - Vollständiges Upload-System für Hero-Bilder mit persistenter Speicherung
- ✅ **Intuitive Shop-Filter** - Einfache, benutzerfreundliche Filter und Suche
- ✅ **WCAG 2.1 Barrierefreiheit** - Vollständige Accessibility-Implementierung
- ✅ **Behandlungsart-Piktogramme** - Icons für verschiedene Behandlungen
- ✅ **Mediengalerie** - Bis zu 10 Fotos und 2 Videos pro Edelstein
- ✅ **Interaktive Galerie** - Thumbnails, Zoom, Video-Player
- ✅ **Produktverwaltung** - Vollständiges CRUD-System für Edelsteine
- ✅ **API-Integration** - REST-API für Datenpersistierung
- ✅ **Mobile Optimierungen** - Responsive Design für alle Gerätegrößen
- ✅ **Kontaktformular** - Mit API-Route für E-Mail-Versand
- ✅ **Newsletter-System** - Vollständig integriert mit E-Mail-Bestätigungen
- ✅ **E-Mail-System** - Professionelle Templates für Kontakt, Newsletter und Bestellungen
- ✅ **Cookie-Banner** - DSGVO-konform
- ✅ **Responsive Design** - Optimiert für alle Geräte
- ✅ **Modern UI** - Mit shadcn/ui und Tailwind CSS
- ✅ **TypeScript** - Typsicher und wartbar
- ✅ **SEO-optimiert** - Meta-Tags und strukturierte Daten
- ✅ **Benutzer-Authentifizierung** - NextAuth.js mit Anmeldung/Registrierung
- ✅ **Benutzerprofile** - Adressen, Zahlungsmethoden, Bestellhistorie
- ✅ **Persistente Wunschliste** - Pro Benutzer mit Datenbank-Speicherung
- ✅ **Rechnungsanwendung** - Vollständiges Rechnungssystem für Kleinunternehmer
- ✅ **Erweiterte Shop-Features** - Produktvarianten, erweiterte Filter
- ✅ **Warenkorb-Persistenz** - Über Sessions hinweg gespeichert
- ✅ **Checkout-System** - Vollständiger Bestellprozess
- ✅ **Zahlungsoptionen** - PayPal, Kreditkarte, SEPA
- ✅ **Rechtliche Seiten** - AGBs, Datenschutz, Impressum, Cookie-Richtlinie
- ✅ **Kundenverwaltung** - Erweiterte Admin-Funktionen mit Kundennotizen
- ✅ **Audit-Log System** - Vollständige Nachverfolgung aller Admin-Aktionen
- ✅ **Warenkorb-Synchronisation** - Server-seitige Speicherung
- ✅ **Erweiterte Suchfunktion** - Umfassende Filteroptionen
- ✅ **Admin-Dashboard** - Statistiken und Kennzahlen
- ✅ **Admin-Panel Berichte** - Vollständige Berichte-Seite mit funktionalen Buttons
- ✅ **Admin-Panel Bestellungen** - Anzeige-Button mit Funktionalität versehen
- ✅ **Admin-Panel Audit-Logs** - Mock-Daten und funktionale Buttons implementiert
- ✅ **Admin-Panel Kundenverwaltung** - Mock-Daten und funktionale Buttons aktiviert
- ✅ **Modernes Design** - Glassmorphism, Animationen, aufgehellter Hintergrund
- ✅ **Umfassende Tests** - Jest und React Testing Library
- ✅ **Piktogramm-Erklärungssystem** - Tooltip-basierte Erklärungen für alle Edelstein-Symbole
- ✅ **Auswahllisten-Verwaltung** - Dynamische Verwaltung von Dropdown-Optionen (Schliff, Form, Reinheit)
- ✅ **Newsticker-System** - Rotierende Nachrichten auf der Homepage mit Admin-Verwaltung
- ✅ **Entstehung-Feld** - Natürlich/Synthetisch-Auswahl für alle Edelsteine
- ✅ **Farbsättigungsskala** - 10-stufige Bewertung mit visueller Darstellung
- ✅ **Erweiterte Admin-Funktionen** - Piktogramm- und Auswahllisten-Management
- ✅ **Interaktive Weltkarte** - Länder- und Lagerstätten-Verwaltung mit Admin-Panel
- ✅ **Weltkarten-Datenbank** - Vollständige Datenbankinstanzen für Länder, Lagerstätten und Edelstein-Typen

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI-Komponenten:** shadcn/ui
- **Internationalisierung:** next-intl
- **State Management:** Zustand (für Warenkorb und Wunschliste)
- **Authentifizierung:** NextAuth.js
- **Datenbank:** Prisma ORM
- **Icons:** Lucide React
- **Markdown:** gray-matter, remark
- **Testing:** Jest, React Testing Library

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die Website ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar (oder einem anderen Port, falls 3000 belegt ist).

## Projektstruktur

```
gemilike-website/
├── app/
│   ├── [locale]/          # Locale-basiertes Routing
│   │   ├── admin/         # Admin-Panel
│   │   │   ├── audit/     # Audit-Log System
│   │   │   ├── customers/ # Kundenverwaltung
│   │   │   ├── orders/    # Bestellungen
│   │   │   ├── reports/   # Berichte
│   │   │   ├── pictogram-descriptions/ # Piktogramm-Erklärungen
│   │   │   ├── select-options/ # Auswahllisten-Verwaltung
│   │   │   └── worldmap/ # Weltkarten-Verwaltung
│   │   ├── about/         # Über uns Seite
│   │   ├── auth/          # Authentifizierung (Anmeldung/Registrierung)
│   │   ├── blog/          # Blog-Übersicht
│   │   ├── cart/          # Warenkorb
│   │   ├── checkout/      # Checkout-Prozess
│   │   ├── contact/       # Kontaktformular
│   │   ├── cookies/       # Cookie-Richtlinie
│   │   ├── imprint/       # Impressum
│   │   ├── orders/        # Bestellhistorie
│   │   ├── privacy/       # Datenschutzerklärung
│   │   ├── profile/       # Benutzerprofil
│   │   ├── services/      # Leistungen
│   │   ├── shop/          # Shop-Übersicht
│   │   ├── terms/         # AGBs
│   │   ├── wishlist/      # Wunschliste
│   │   └── worldmap/      # Interaktive Weltkarte
│   │   ├── layout.tsx     # Layout mit Header/Footer
│   │   └── page.tsx       # Homepage
│   ├── api/               # API Routes
│   │   ├── admin/         # Admin-Panel API
│   │   │   ├── audit-logs/ # Audit-Log API
│   │   │   ├── customers/  # Kundenverwaltung API
│   │   │   ├── dashboard/  # Dashboard-Statistiken
│   │   │   ├── gemstones/  # Produktverwaltung API
│   │   │   ├── hero-image/ # Hero Image Upload API
│   │   │   ├── orders/     # Bestellungen API
│   │   │   ├── reports/    # Berichte API
│   │   │   ├── pictogram-descriptions/ # Piktogramm-Erklärungen API
│   │   │   ├── select-options/ # Auswahllisten API
│   │   │   ├── newsticker/ # Newsticker API
│   │   │   └── worldmap/ # Weltkarten API
│   │   ├── auth/          # NextAuth.js API
│   │   ├── addresses/     # Adressverwaltung API
│   │   ├── cart/          # Warenkorb-API
│   │   │   ├── load/      # Warenkorb laden
│   │   │   └── save/      # Warenkorb speichern
│   │   ├── contact/       # Kontaktformular API
│   │   ├── coupons/       # Gutschein-API
│   │   ├── newsletter/    # Newsletter API
│   │   ├── orders/        # Bestell-API
│   │   ├── search/        # Such-API
│   │   │   ├── advanced/  # Erweiterte Suche
│   │   │   └── saved/     # Gespeicherte Suchen
│   │   └── wishlist/      # Wunschliste-API
│   └── globals.css        # Globale Styles
├── components/
│   ├── admin/             # Admin-Panel Komponenten
│   │   ├── AdminNavigation.tsx
│   │   ├── AuditLogDetailsModal.tsx
│   │   ├── CustomerDetailsModal.tsx
│   │   ├── CustomerNotesModal.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── GemstoneEditor.tsx
│   │   ├── HeroImageManager.tsx
│   │   ├── ImportDialog.tsx
│   │   ├── PictogramDescriptionManager.tsx
│   │   ├── SelectOptionsManager.tsx
│   │   └── WorldMapManagement.tsx
│   ├── cart/              # Warenkorb-Komponenten
│   │   └── CartSync.tsx
│   ├── layout/            # Layout-Komponenten
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── CookieBanner.tsx
│   ├── providers/         # React Context Provider
│   │   └── SessionProvider.tsx
│   ├── profile/           # Profil-Komponenten
│   │   ├── AddressManager.tsx
│   │   ├── OrderHistory.tsx
│   │   ├── ProfileEditor.tsx
│   │   └── WishlistManager.tsx
│   ├── shop/              # Shop-Komponenten
│   │   ├── AdvancedFilters.tsx
│   │   ├── AdvancedSearch.tsx
│   │   ├── GemstoneCard.tsx
│   │   ├── GemstoneCardModal.tsx
│   │   ├── GemstoneThumbnail.tsx
│   │   ├── MediaGallery.tsx
│   │   ├── ProductVariants.tsx
│   │   ├── QuickViewModal.tsx
│   │   ├── ShopFilters.tsx
│   │   ├── SortOptions.tsx
│   │   ├── TreatmentIcon.tsx
│   │   ├── WishlistButton.tsx
│   │   ├── PictogramExplanation.tsx
│   │   ├── PictogramWithTooltip.tsx
│   │   └── map/ # Weltkarten-Komponenten
│   │       └── WorldMap.tsx
│   └── ui/                # shadcn/ui Komponenten
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── navigation-menu.tsx
│       ├── select.tsx
│       ├── sheet.tsx
│       ├── slider.tsx
│       ├── tabs.tsx
│       └── textarea.tsx
├── lib/
│   ├── auth.ts            # NextAuth.js Konfiguration
│   ├── data/              # Datenmodelle und -quellen
│   │   └── gemstones.ts   # Edelstein-Daten
│   ├── hooks/             # Custom React Hooks
│   │   └── useAdvancedSearch.ts
│   ├── i18n/              # i18n Konfiguration
│   ├── prisma.ts          # Prisma Client
│   ├── store/             # Zustand Stores
│   │   ├── cart.ts        # Warenkorb Store
│   │   ├── persistentCart.ts # Persistenter Warenkorb
│   │   ├── persistentWishlist.ts # Persistente Wunschliste
│   │   └── wishlist.ts    # Wunschliste Store
│   ├── types/             # TypeScript-Typen
│   │   ├── gemstone.ts    # Edelstein-Interfaces
│   │   ├── pictogram-descriptions.ts # Piktogramm-Typen
│   │   └── select-options.ts # Auswahllisten-Typen
│   └── hooks/             # Custom React Hooks
│       └── usePictogramDescriptions.ts # Piktogramm-Hook
├── prisma/
│   └── schema.prisma      # Datenbankschema
├── types/
│   └── next-auth.d.ts     # NextAuth TypeScript Erweiterungen
├── messages/              # Übersetzungsdateien
│   ├── de.json
│   └── en.json
├── content/               # Content (Blog, Produkte)
│   ├── blog/
│   └── products/
├── data/                  # JSON-Daten
│   ├── pictogram-descriptions.json # Piktogramm-Erklärungen
│   ├── select-options.json # Auswahllisten
│   └── newsticker.json   # Newsticker-Nachrichten
├── __tests__/             # Test-Dateien
│   ├── admin/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   └── store/
└── public/                # Statische Assets
    ├── uploads/           # Upload-Verzeichnisse
    │   └── hero/          # Hero-Bilder
    └── products/          # Produktbilder
```

## Konfiguration

### Logo hinzufügen

Platzieren Sie Ihr Logo in `/public/logo.png` und passen Sie die Referenzen in `components/layout/Header.tsx` an.

### Farbschema anpassen

Die Farben können in `app/globals.css` angepasst werden:

```css
@layer base {
  :root {
    --primary: 222.2 47.4% 11.2%;
    /* Weitere Farben... */
  }
}
```

### Übersetzungen

Bearbeiten Sie die Dateien in `/messages/`:
- `de.json` - Deutsche Übersetzungen
- `en.json` - Englische Übersetzungen

## Deployment auf Strato

### Option 1: Static Export (empfohlen für Strato)

1. **Build erstellen:**
```bash
npm run build
```

2. **Static Export generieren:**
Fügen Sie in `next.config.ts` hinzu:
```typescript
const nextConfig: NextConfig = {
  output: 'export',
  // ... rest of config
};
```

Dann:
```bash
npm run build
```

3. **Upload via FTP:**
- Verbinden Sie sich mit Ihrem Strato FTP-Account
- Laden Sie den Inhalt des `out/` Ordners in Ihr Web-Verzeichnis hoch
- Standard-Pfad bei Strato: `/` oder `/html/`

### Option 2: Node.js Hosting (falls verfügbar)

Falls Ihr Strato-Paket Node.js unterstützt:

1. **Build erstellen:**
```bash
npm run build
```

2. **Dateien hochladen:**
- Alle Projektdateien via FTP/SFTP hochladen
- `node_modules/` NICHT hochladen

3. **Auf dem Server:**
```bash
npm install --production
npm start
```

### Wichtige Hinweise für Strato

- **Domain-Konfiguration:** Stellen Sie sicher, dass `gemilike.de` und `gemilike.com` auf das richtige Verzeichnis zeigen
- **SSL-Zertifikat:** Aktivieren Sie SSL in Ihrem Strato-Kundenbereich
- **.htaccess:** Für Static Export eventuell erforderlich für URL-Rewrites

Beispiel `.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]
```

## Umgebungsvariablen

Erstellen Sie eine `.env.local` Datei:

```env
# Datenbank
DATABASE_URL="postgresql://username:password@localhost:5432/gemilike"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# E-Mail Konfiguration (für Kontaktformular)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@gemilike.de
SMTP_PASSWORD=your-password

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Payment Provider (optional)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

## Weitere Anpassungen

### E-Mail-Versand einrichten

Bearbeiten Sie `app/api/contact/route.ts` und implementieren Sie einen E-Mail-Service wie:
- Nodemailer
- SendGrid
- Mailgun
- Strato Mail-API

### Blog-Artikel hinzufügen

Erstellen Sie Markdown-Dateien in `content/blog/`:

```markdown
---
title: "Ihr Artikel-Titel"
date: "2025-10-01"
author: "Ihr Name"
category: "Kategorie"
---

Ihr Artikel-Inhalt...
```

### Admin-Panel verwenden

Das Admin-Panel bietet eine grafische Benutzeroberfläche für die Produktverwaltung:

1. **Zugriff:** Gehen Sie zu `/admin`
2. **Produkt bearbeiten:** Klicken Sie auf "Bearbeiten" bei einem Produkt
3. **Neues Produkt:** Klicken Sie auf "Neuer Edelstein"
4. **Bilder hochladen:** Drag & Drop oder Datei-Auswahl
5. **Speichern:** Änderungen werden automatisch gespeichert

**Features:**
- 📝 Vollständiges Formular für alle Produktdaten
- 🖼️ Drag & Drop Bild-Upload
- 🌍 Dropdown für alle Länder (Herkunft)
- 🧪 Behandlungsart-Auswahl
- 🏆 Zertifizierungs-Verwaltung
- 💾 Automatische Speicherung

### Hero Image Management

Das Hero Image Management System ermöglicht die einfache Verwaltung des Startseiten-Bildes:

1. **Zugriff:** Gehen Sie zu `/admin/settings`
2. **Bild hochladen:** Wählen Sie eine Bilddatei aus (max. 5MB)
3. **Vorschau:** Nutzen Sie die Live-Vorschau-Funktion
4. **Speichern:** Klicken Sie auf "Einstellungen speichern"

**Features:**
- 🖼️ **Persistente Speicherung** - Bilder werden dauerhaft in `/public/uploads/hero/` gespeichert
- ✅ **Automatische Validierung** - Nur Bilddateien bis 5MB werden akzeptiert
- 🔄 **Live-Update** - Änderungen werden sofort auf der Website sichtbar
- 📱 **Responsive Vorschau** - Zeigt an, wie das Bild auf verschiedenen Geräten aussieht
- 🛡️ **Sichere Uploads** - API-Endpoint mit Validierung und Fehlerbehandlung

### Interaktive Weltkarte

Die Website bietet eine vollständige interaktive Weltkarte für Edelstein-Lagerstätten:

#### Weltkarten-Features
- **🗺️ Länder-Übersicht** - Alle Länder mit Edelstein-Vorkommen
- **📍 Lagerstätten-Details** - Einzelne Minen und Fundorte
- **💎 Edelstein-Typen** - 18+ verschiedene Edelstein-Kategorien
- **🔍 Suchfunktion** - Nach Land oder Edelstein-Typ filtern
- **📊 Statistiken** - Anzahl der Lagerstätten pro Land
- **🎨 Farbkodierung** - Verschiedene Farben für Edelstein-Typen

#### Admin-Weltkarten-Verwaltung
- **Länder verwalten** - Koordinaten, Kontinente, Status
- **Lagerstätten hinzufügen** - Name, Koordinaten, Beschreibung
- **Edelstein-Typen** - Farben und Beschreibungen verwalten
- **Minen-Typen** - open-pit, underground, alluvial, primary, secondary
- **Status-Verwaltung** - active, inactive, depleted, protected
- **Bulk-Import** - CSV-Upload für große Datenmengen
- **Template-Download** - CSV-Vorlagen für korrektes Format
- **Import-Dokumentation** - Detaillierte Anleitung für CSV-Import
- **Minimal-Template** - Einfache Vorlage für schnellen Start

#### Edelsteine-Import (Aktualisiert)
- **GemstoneCard-kompatibel** - Spalten angepasst an tatsächliche Datenstruktur
- **Typ-spezifische Felder** - Geschliffene Steine vs. Rohsteine
- **Erweiterte Validierung** - Umfassende Datenvalidierung
- **Medien-Integration** - Bilder und Videos unterstützt
- **Zertifizierung** - Vollständige Zertifikats-Verwaltung
- **Behandlung** - Detaillierte Treatment-Informationen
- **ODS-Import** - 45 Edelsteine aus "Übersicht Steine.ods" übertragen
- **Automatische Transformation** - ODS-Format zu CSV-Format konvertiert

#### Header-Design (Aktualisiert)
- **Gradient-Text-Effekte** - Menüpunkte mit gleichen Farbverläufen wie Überschriften
- **Konsistentes Design** - Einheitliche Gradient-Effekte im gesamten Header
- **Desktop & Mobile** - Gradient-Effekte für beide Navigationen
- **Hover-Animationen** - Smooth Transitions mit Gradient-Text
- **Hydration-Fix** - Server/Client-Konsistenz für Gradient-Effekte
- **Performance-Optimiert** - Stabilisierte Klassen-Logik
- **Hover-Effekte repariert** - Primary-Farbe beim Mouseover funktioniert
- **Unterstreichung aktiviert** - Hover-Linien werden korrekt angezeigt
- **Stabile Hover-States** - Konsistente Hover-Effekte für alle Menüpunkte
- **Gradient-Text wie Überschriften** - Gleiche Effekte wie "Wissenswertes über Edelsteine"
- **Einheitlicher Stil** - Konsistente Gradient-Text-Effekte im gesamten Header
- **Hover-Effekte mit Glow** - Gradient-Text + animate-glow beim Mouseover
- **Unterstreichung angepasst** - Orange-Purple-Cyan Gradient wie in Überschriften

#### Unabhängige Fotogalerie (Neu)
- **Produktunabhängige Galerie** - Separate Fotogalerie für allgemeine Edelstein-Fotos
- **Kategorien-System** - Rohsteine, Geschliffene Steine, Minen, Schmuck, Zertifikate
- **Admin-Verwaltung** - Vollständige Verwaltung über Admin-Panel
- **Filter & Suche** - Kategorie-Filter und Textsuche
- **Lightbox-Ansicht** - Vollbild-Ansicht mit Navigation
- **Responsive Design** - Optimiert für alle Geräte
- **Featured-Bilder** - Hervorhebung wichtiger Bilder
- **Tag-System** - Flexible Verschlagwortung

#### Datenbank-Integration
- **Country-Model** - Länder mit Koordinaten und Kontinenten
- **Location-Model** - Lagerstätten mit detaillierten Informationen
- **GemType-Model** - Edelstein-Typen mit Farben
- **Cascade-Löschung** - Automatische Bereinigung bei Land-Löschung

### Erweiterte Suchfunktion

Der Shop bietet umfangreiche Filteroptionen:

1. **Kategorie-Suche:** Tippen Sie in das Suchfeld und drücken Enter
2. **Erweiterte Filter:** Klicken Sie auf "Filter" für mehr Optionen
3. **Filter kombinieren:** Mehrere Kriterien gleichzeitig anwenden
4. **Zurücksetzen:** Alle Filter mit einem Klick löschen

**Filter-Optionen:**
- 📂 Kategorie (Dropdown)
- 🌍 Herkunft (alle Länder)
- 💎 Typ (Geschliffen/Roh)
- 💰 Preisbereich (Slider)
- ⚖️ Gewichtsbereich (Slider)
- 🧪 Behandlung (Unbehandelt + alle Typen)
- 🏆 Zertifizierung (GIA, IGI, etc.)
- 📦 Verfügbarkeit (nur verfügbare Artikel)

### E-Commerce Features

Die Website bietet ein vollständiges E-Commerce-System:

#### Benutzer-Authentifizierung
- **Anmeldung/Registrierung** mit NextAuth.js
- **Sichere Passwort-Hashung** mit bcryptjs
- **Session-Management** mit automatischer Verlängerung
- **Profil-Verwaltung** mit persönlichen Daten

#### Benutzerprofile
- **Adressverwaltung** - Rechnungs- und Lieferadressen
- **Zahlungsmethoden** - PayPal, Kreditkarte, SEPA
- **Bestellhistorie** - Übersicht aller Bestellungen
- **Wunschliste** - Persistente Speicherung pro Benutzer

#### Warenkorb & Checkout
- **Persistenter Warenkorb** - Über Sessions hinweg gespeichert
- **Produktvarianten** - Größe, Gewicht, Menge
- **Gutschein-System** - Rabatt-Codes einlösbar
- **Vollständiger Checkout** - Adresse, Zahlung, Versand
- **Bestellbestätigung** - E-Mail-Benachrichtigungen

#### Zahlungsoptionen
- **PayPal** - Express Checkout
- **Kreditkarte** - Visa, Mastercard
- **SEPA-Lastschrift** - Direktes Bankeinzug
- **Vorkasse** - Überweisung

### Rechtliche Seiten

Alle rechtlichen Anforderungen sind erfüllt:

#### AGBs (`/terms`)
- Vollständige Geschäftsbedingungen nach deutschem Recht
- Vertragsschluss, Preise, Lieferung
- 14-tägiges Widerrufsrecht
- Gewährleistung und Haftung

#### Datenschutzerklärung (`/privacy`)
- DSGVO-konforme Datenschutzerklärung
- Cookie-Nutzung, Analytics
- Benutzerrechte (Auskunft, Löschung, etc.)
- Kontaktdaten des Datenschutzbeauftragten

#### Impressum (`/imprint`)
- Vollständige Angaben gemäß § 5 TMG
- Firmenangaben, Handelsregister
- EU-Streitschlichtung
- Haftung für Inhalte und Links

#### Cookie-Richtlinie (`/cookies`)
- Detaillierte Cookie-Informationen
- Arten von Cookies (technisch, funktional, analytisch, marketing)
- Browser-Einstellungen und Opt-out
- Drittanbieter-Cookies (Google Analytics, Social Media)

### Produkte hinzufügen

Bearbeiten Sie die Edelstein-Daten in `lib/data/gemstones.ts`:

```typescript
export const cutGemstones: CutGemstone[] = [
  {
    id: 'cut-001',
    name: 'Kolumbianischer Smaragd',
    type: 'cut',
    description: 'Wunderschöner kolumbianischer Smaragd...',
    price: 4500.00,
    currency: 'EUR',
    
    // Bis zu 10 Bilder pro Edelstein
    images: [
      '/products/emerald-001-1.jpg',
      '/products/emerald-001-2.jpg',
      '/products/emerald-001-3.jpg',
      // ... weitere Bilder
    ],
    mainImage: '/products/emerald-001-1.jpg',
    
    // Optional: Bis zu 2 Videos
    videos: [
      '/products/emerald-001-video-1.mp4',
      '/products/emerald-001-video-2.mp4',
    ],
    
    // ... weitere Eigenschaften
  }
];
```

### Mediengalerie-Features

Die integrierte Mediengalerie bietet:

- **📸 Bis zu 10 Fotos** pro Edelstein
- **🎥 Bis zu 2 Videos** (MP4-Format)
- **🔍 Zoom-Funktion** für Detailansicht
- **📱 Responsive Thumbnails** mit Navigation
- **▶️ Video-Player** mit Kontrollen
- **⚡ Performance-optimiert** mit Next.js Image
- **🎨 Hover-Effekte** und Animationen

### Medien-Dateien verwalten

Platzieren Sie Ihre Medien in `/public/products/`:

```
public/products/
├── emerald-001-1.jpg
├── emerald-001-2.jpg
├── emerald-001-video-1.mp4
├── ruby-002-1.jpg
└── ...
```

**Empfohlene Bildgrößen:**
- **Hauptbilder:** 800x800px (quadratisch)
- **Format:** JPG oder PNG
- **Dateigröße:** < 500KB pro Bild
- **Videos:** MP4, max. 10MB pro Video

## Testing

Das Projekt enthält umfassende Tests:

```bash
# Alle Tests ausführen
npm test

# Tests im Watch-Modus
npm run test:watch

# Test-Coverage
npm run test:coverage
```

**Test-Abdeckung:**
- Admin-Panel Komponenten
- API-Routes
- Store-Funktionalität
- React Hooks
- UI-Komponenten

## Support & Kontakt

Bei Fragen oder Problemen:
- E-Mail: info@gemilike.de
- Website: https://gemilike.de

## Lizenz

Proprietary - Alle Rechte vorbehalten © 2025 Gemilike