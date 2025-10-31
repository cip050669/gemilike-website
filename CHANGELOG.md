# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

---

## [2.3.1] - 2025-01-15

### 🎨 UI/UX Verbesserungen

#### ✨ Fixed
- **Sticky Header Implementierung** - Header bleibt jetzt auf allen Seiten fixiert
- **Root-Layout Integration** - Header direkt im Root-Layout platziert (nicht im Portal)
- **Position Sticky** - CSS `position: sticky` für konsistente Header-Funktionalität

#### 🔧 Technical
- **Header aus PublicLayout entfernt** - Header jetzt im `app/[locale]/layout.tsx` platziert
- **CSS-Regeln verstärkt** - `position: sticky !important` mit erweiterten Selektoren
- **Z-Index-Optimierung** - `z-index: 9999` für korrekte Überlagerung
- **Scroll-Padding** - `scroll-padding-top: 4rem` für besseres Scroll-Verhalten

#### 📚 Documentation
- **CHANGELOG.md** - Header-Fixierung dokumentiert
- **PROJECT_STATUS.md** - Neueste Änderungen aktualisiert

---

## [2.1.0] - 2025-10-10 12:00

### 🎨 UI/UX Verbesserungen

#### ✨ Added
- **Header-Logo-Optimierung** - "I" in "Gem I Like" um 6px nach rechts verschoben
- **Verbesserte Lesbarkeit** - Optimierte Schriftpositionierung im Text-Logo
- **Konsistentes Design** - Einheitliche Abstände im Header-Logo

#### 🔧 Technical
- **CSS-Anpassungen** - Margin-left von `ml-1.5` zu `ml-3` geändert
- **Responsive Design** - Optimierung für alle Bildschirmgrößen
- **Accessibility** - Verbesserte Benutzerfreundlichkeit

#### 📚 Documentation
- **README.md** - E-Mail-System Features hinzugefügt
- **PROJECT_STATUS.md** - Version auf 2.1.0 aktualisiert
- **Alle MD-Dateien** - Konsistente Aktualisierung aller Dokumentation

---

## [1.2.2] - 2025-10-07 18:00

### 🎉 Major Release - Admin-Panel Funktionalitäten

#### ✨ Added
- **Admin-Panel Berichte** - Vollständige Berichte-Seite mit funktionalen Buttons
- **Admin-Panel Bestellungen** - Anzeige-Button mit Funktionalität versehen
- **Admin-Panel Audit-Logs** - Mock-Daten und funktionale Buttons implementiert
- **Admin-Panel Kundenverwaltung** - Mock-Daten und funktionale Buttons aktiviert
- **CustomerDetailsModal** - Vollständige Modal-Komponente für Kunden-Details
- **CustomerNotesModal** - Modal-Komponente für Notizen-Bearbeitung
- **AuditLogDetailsModal** - Modal-Komponente für Audit-Log-Details

#### 🔧 Technical
- **Mock-Daten** - Realistische Test-Daten für alle Admin-Bereiche
- **Funktionale Buttons** - Alle Buttons mit Console-Logs und Alert-Bestätigungen
- **CSV-Export** - Export-Funktionalität für Kunden- und Audit-Daten
- **Modal-Dialoge** - Vollständige Modal-Komponenten für Details und Bearbeitung

#### 📚 Documentation
- **CHECKLIST.md** - Admin-Panel-Funktionalitäten dokumentiert
- **PROJECT_STATUS.md** - Aktuelle Version und Features aktualisiert
- **FEATURES.md** - Neue Admin-Panel-Features hinzugefügt
- **CHANGELOG.md** - Alle Änderungen dokumentiert

---

## [1.2.1] - 2025-10-05 23:45

### 🎨 UI/UX Improvements

#### ✨ Added
- **Hero Image Management System** - Vollständiges Upload-System für Hero-Bilder
- **Persistent Image Storage** - Bilder werden dauerhaft in `/public/uploads/hero/` gespeichert
- **Image Upload API** - `/api/admin/hero-image` für sichere Bild-Uploads
- **File Validation** - Automatische Validierung von Bildtyp und -größe (max. 5MB)

#### 🎨 Changed
- **Treatment Badge Color** - Orange Badge (`bg-amber-600/90`) zu neutralem Hellgrau (`bg-gray-400/90`) geändert
- **Mobile Optimizations** - Header-Größen, Icon-Größen und Badge-Größen für mobile Geräte optimiert
- **Design Height Reduction** - Design-Höhe um 25px reduziert für bessere Proportionen
- **Shop Layout** - GemstoneCard durch kompakte Thumbnails ersetzt mit Modal-Ansicht

#### 🔧 Technical
- **HeroImageManager Component** - Erweitert um API-Integration und Validierung
- **Upload Directory Structure** - Automatische Erstellung von Upload-Verzeichnissen
- **Error Handling** - Robuste Fehlerbehandlung für Bild-Uploads
- **Loading States** - UI-Feedback während Upload-Prozessen

#### 📚 Documentation
- **CHANGELOG.md** - Aktualisiert mit neuesten Änderungen
- **CHECKLIST.md** - Mobile Optimierungen und UI-Verbesserungen dokumentiert
- **README.md** - Hero Image Management Features hinzugefügt

---

## [1.2.0] - 2025-10-03 15:30

### 🎉 Major Release - Admin Panel

#### ✨ Added
- **Vollständiges Admin-Panel** (`/admin`) - Grafische Benutzeroberfläche für Produktverwaltung
- **CRUD-Operationen** - Erstellen, Bearbeiten, Löschen von Edelsteinen
- **Drag & Drop Upload** - Bilder per Drag & Drop hochladen
- **API-Integration** (`/api/admin/gemstones`) - REST-API für Datenpersistierung
- **Automatische Datei-Generierung** - TypeScript-Dateien werden automatisch aktualisiert
- **Tab-basierte Navigation** - Intuitive Formular-Struktur im Admin-Panel
- **Vollständige Formular-Validierung** - Alle Felder mit Validierung
- **Sofortige Vorschau** - Änderungen werden direkt angezeigt

#### 🔧 Technical
- **GemstoneEditor-Komponente** - Vollständiges Admin-Formular
- **API-Route für Admin** - Backend für Produktverwaltung
- **Datei-Persistierung** - Automatische Speicherung in `gemstones.ts`
- **TypeScript-Integration** - Vollständig typisierte Admin-Funktionen

#### 📚 Documentation
- **README.md** - Vollständig aktualisiert mit Admin-Panel-Features
- **PROJECT_STATUS.md** - Aktuelle Version und Features dokumentiert
- **FEATURES.md** - Erweiterte Feature-Dokumentation
- **Admin-Panel-Anleitung** - Vollständige Bedienungsanleitung

---

## [1.0.4] - 2025-10-01 19:30

### 🎨 Changed
- **Logo vergrößert** - 33% größer für bessere Lesbarkeit
  - Höhe: 48px → 64px
  - Breite: 120px → 160px
  - Header-Höhe: 64px → 80px
  
### 🎨 Added
- **Gemilike-Schriftart** CSS-Klassen erstellt
  - `.gemilike-text` - Mit Cyan-Outline wie im Logo
  - `.gemilike-text-gradient` - Mit Feuer-zu-Eis Gradient
  - Impact/Arial Black Font, 900 weight, uppercase
  
### 🎨 Changed
- **Homepage Hero-Titel** verwendet jetzt Logo-Schriftart
- **Header Brand** verwendet jetzt Logo-Schriftart
- **Tagline** geändert zu "Heroes in Gems"

### 📚 Added
- **LOGO_STYLING.md** - Dokumentation der Logo-Styling Änderungen

---

## [1.0.3] - 2025-10-01 19:25

### 🌍 Fixed
- **Homepage-Übersetzung implementiert**
  - Alle Texte verwenden jetzt Übersetzungsfunktion
  - `getTranslations` statt `useTranslations` für async Server Components
  - DE/EN Sprachumschaltung funktioniert vollständig auf Homepage
  
### 📚 Added
- Erweiterte Übersetzungen in `messages/de.json` und `messages/en.json`
- `home.*` Keys für alle Homepage-Texte
- **TRANSLATION_FIX.md** - Dokumentation der Übersetzungs-Implementierung

---

## [1.0.2] - 2025-10-01 19:15

### 🎨 Added
- **Logo integriert** - fulllogo_transparent.png aus Logo-Ordner
  - Im Header mit Next.js Image-Komponente
  - Responsive und optimiert
  - Priority Loading für Performance
  
### 🎨 Changed
- **Farbschema angepasst** an Logo-Farben
  - Primary: Orange-Rot (#FF6B35) - Feuer-Theme
  - Secondary: Cyan (#00BCD4) - Eis-Theme
  - Accent: Gold/Gelb (#FFC107) - Highlights
  - Dark Mode Varianten hinzugefügt
  - Alle UI-Komponenten nutzen neue Farben

### 📚 Added
- **BRANDING_APPLIED.md** - Dokumentation der Branding-Integration

---

## [1.0.1] - 2025-10-01 18:58

### 🐛 Fixed
- **Hydration Mismatch Error behoben**
  - Cookie-Banner verwendet jetzt `mounted` State
  - Warenkorb-Badge im Header zeigt erst nach Client-Mount
  - Verhindert SSR/Client Rendering Unterschiede
  - Dateien: `components/layout/CookieBanner.tsx`, `components/layout/Header.tsx`

### 📚 Added
- **TROUBLESHOOTING.md** erstellt mit Lösungen für häufige Probleme
- Dokumentation für Hydration Errors
- Pattern für Client-Only Components

---

## [1.0.0] - 2025-10-01

### 🎉 Initial Release

#### ✨ Features
- Vollständige Next.js 15 Website mit TypeScript
- Mehrsprachigkeit (Deutsch/Englisch) mit next-intl
- Responsive Design mit Tailwind CSS v4
- shadcn/ui Komponenten-Bibliothek
- Blog-System (Übersicht)
- E-Commerce Shop mit Warenkorb
- Kontaktformular mit API-Route
- Newsletter-API
- Cookie-Banner (DSGVO-konform)

#### 📄 Seiten
- Homepage mit Hero-Section, Features, CTAs
- Über uns
- Leistungen (6 Service-Kategorien)
- Blog-Übersicht
- Shop mit Produktkatalog
- Warenkorb
- Kontaktformular

#### 🎨 Design
- Modernes, minimalistisches Design
- Gradient-Effekte
- Smooth Animations
- Mobile-First Approach
- Dark Mode vorbereitet

#### 🛠️ Technologie
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- next-intl
- Zustand (State Management)
- Lucide React (Icons)

#### 📚 Dokumentation
- README.md - Vollständige Projektdokumentation
- START_HERE.md - Einstiegspunkt
- QUICK_START.md - Schnelleinstieg
- NEXT_STEPS.md - Anpassungen & Erweiterungen
- DEPLOYMENT.md - Strato-Deployment Anleitung
- CHECKLIST.md - Go-Live Checkliste
- PROJECT_STATUS.md - Projektstatus
- ROUTES.md - Routen-Übersicht
- TROUBLESHOOTING.md - Problemlösungen

---

## Versionsformat

Dieses Projekt folgt [Semantic Versioning](https://semver.org/):
- **MAJOR**: Inkompatible API-Änderungen
- **MINOR**: Neue Features (rückwärtskompatibel)
- **PATCH**: Bugfixes (rückwärtskompatibel)

---

## Geplante Features

### Version 1.1.0 (geplant)
- [ ] Blog-Einzelartikel-Seiten
- [ ] Produktdetail-Seiten
- [ ] Checkout-Prozess
- [ ] Payment-Integration (Stripe/PayPal)
- [ ] Impressum, Datenschutz, AGB Seiten
- [ ] Sitemap-Generator
- [ ] SEO-Optimierungen

### Version 1.2.0 (geplant)
- [ ] Newsletter-Integration (Mailchimp/SendGrid)
- [ ] Blog-Kommentare
- [ ] Produktbewertungen
- [ ] Erweiterte Suche
- [ ] Wishlist-Funktionalität

### Version 2.0.0 (geplant)
- [ ] User-Authentifizierung
- [ ] User-Dashboard
- [ ] Bestellhistorie
- [ ] Admin-Panel
- [ ] CMS-Integration

---

**Letzte Aktualisierung:** 07.10.2025 18:00 Uhr
