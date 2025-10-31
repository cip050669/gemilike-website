# Jest Testplan für Gemilike Website

## Übersicht

Dieser Testplan deckt alle wichtigen Bereiche der Gemilike-Website ab und stellt sicher, dass die Anwendung zuverlässig und fehlerfrei funktioniert.

## Test-Strategie

### Test-Pyramide
- **Unit Tests** (70%): Komponenten, Utilities, Hooks, Stores
- **Integration Tests** (20%): API Routes, Komponenten-Interaktionen
- **E2E Tests** (10%): Kritische User-Flows (optional, mit Playwright)

### Coverage-Ziele
- **Aktuelles Ziel**: 70% Coverage (branches, functions, lines, statements)
- **Zukünftiges Ziel**: 80%+ Coverage

---

## 1. API Routes Tests

### 1.1 Authentifizierung (`/api/auth/**`)
- [ ] **Register** (`/api/auth/register`)
  - Erfolgreiche Registrierung
  - Validierung (E-Mail-Format, Passwort-Stärke)
  - Duplikat-E-Mail-Behandlung
  - Fehlerbehandlung bei Datenbankfehlern

- [ ] **NextAuth** (`/api/auth/[...nextauth]`)
  - Login-Flow
  - Logout-Flow
  - Session-Verwaltung
  - Token-Validierung

### 1.2 Admin API Routes (`/api/admin/**`)

#### Gemstones Management
- [ ] **GET /api/admin/gemstones**
  - Liste abrufen
  - Paginierung
  - Filterung

- [ ] **POST /api/admin/gemstones**
  - Neuen Edelstein erstellen
  - Validierung der Eingabedaten
  - Bild-Upload

- [ ] **GET/PUT/DELETE /api/admin/gemstones/[id]**
  - Edelstein-Details abrufen
  - Edelstein aktualisieren
  - Edelstein löschen
  - Fehlerbehandlung (nicht gefunden)

#### Customers Management
- [ ] **GET /api/admin/customers**
  - Kundenliste abrufen
  - Filterung und Suche

- [ ] **POST /api/admin/customers**
  - Neuen Kunden erstellen
  - Validierung

- [ ] **GET/PUT/DELETE /api/admin/customers/[id]**
  - Kunden-Details abrufen
  - Kunden aktualisieren
  - Kunden löschen

#### Orders Management
- [ ] **GET /api/admin/orders**
  - Bestellungen abrufen
  - Status-Filterung

- [ ] **GET/PUT /api/admin/orders/[id]**
  - Bestellung-Details abrufen
  - Bestellung aktualisieren
  - Status-Änderungen

#### Knowledge Management
- [ ] **GET/POST /api/admin/knowledge**
  - Artikel auflisten/erstellen

- [ ] **GET/PUT/DELETE /api/admin/knowledge/[id]**
  - Artikel-Details/Update/Delete

#### Stories/Blogs
- [ ] **GET/POST /api/admin/stories**
- [ ] **GET/PUT/DELETE /api/admin/stories/[id]**

#### Newsletter
- [ ] **GET/POST /api/admin/newsletter**
- [ ] **POST /api/admin/newsletter/[id]/send**
- [ ] **GET /api/admin/newsletter/export**

#### Settings
- [ ] **GET/PUT /api/admin/settings**
- [ ] **GET/PUT /api/admin/header**
- [ ] **GET/PUT /api/admin/footer**
- [ ] **GET/PUT /api/admin/hero-settings**
- [ ] **GET/PUT /api/admin/knowledge-settings**

#### Worldmap
- [ ] **GET/POST /api/admin/worldmap**
- [ ] **GET/PUT/DELETE /api/admin/worldmap/locations/[id]**
- [ ] **POST /api/admin/worldmap/bulk-import**

#### Invoices
- [ ] **GET/POST /api/admin/invoices**
- [ ] **GET/PUT /api/admin/invoices/[id]**
- [ ] **POST /api/admin/invoices/[id]/status**

### 1.3 Public API Routes (`/api/**`)

#### Cart
- [ ] **GET /api/cart/load**
  - Warenkorb laden
  - Leerer Warenkorb

- [ ] **POST /api/cart/save**
  - Warenkorb speichern
  - Validierung

- [ ] **GET/POST /api/cart**
  - Warenkorb-Operationen

#### Wishlist
- [ ] **GET/POST /api/wishlist**
  - Wunschliste abrufen/speichern

- [ ] **POST /api/wishlist/sync**
  - Synchronisierung

#### Orders
- [ ] **POST /api/orders**
  - Bestellung erstellen
  - Validierung
  - Zahlungsverarbeitung

- [ ] **POST /api/orders/confirmation**
  - Bestätigungs-E-Mail senden

#### Newsletter
- [ ] **POST /api/newsletter**
  - Newsletter-Anmeldung
  - E-Mail-Validierung
  - Duplikat-Prüfung

- [ ] **GET /api/newsletter/subscribers**

#### Search
- [ ] **POST /api/search/advanced**
  - Erweiterte Suche
  - Filterung
  - Ergebnis-Validierung

#### Downloads
- [ ] **GET /api/downloads/files/[fileId]**
  - Datei-Download
  - Authentifizierung
  - Berechtigungen

#### Contact
- [ ] **POST /api/contact**
  - Kontaktformular senden
  - Validierung
  - E-Mail-Versand

---

## 2. Component Tests

### 2.1 Layout Components

- [ ] **Header** (`components/layout/Header.tsx`)
  - Navigation rendern
  - Mobile-Menü
  - Warenkorb-Icon
  - Benutzer-Menü
  - Aktive Route-Hervorhebung

- [ ] **Footer** (`components/layout/Footer.tsx`)
  - Links rendern
  - Newsletter-Formular
  - Social Media Links

- [ ] **PublicLayout** (`components/layout/PublicLayout.tsx`)
  - Layout-Struktur
  - SEO-Integration

### 2.2 Admin Components

- [ ] **AdminSidebar** (`components/admin/AdminSidebar.tsx`)
  - Navigation
  - Aktive Route

- [ ] **AdminHeader** (`components/admin/AdminHeader.tsx`)
  - Titel und Breadcrumbs

- [ ] **DashboardStats** (`components/admin/DashboardStats.tsx`)
  - Statistiken rendern
  - Daten-Formatierung

- [ ] **GemstoneEditor** (`components/admin/GemstoneEditor.tsx`)
  - Formular-Rendering
  - Eingabe-Validierung
  - Bild-Upload
  - Speichern-Funktion

- [ ] **CustomerDetailsModal** (`components/admin/CustomerDetailsModal.tsx`)
  - Modal öffnen/schließen
  - Kunden-Daten anzeigen

- [ ] **OrderEditForm** (`components/admin/orders/OrderEditForm.tsx`)
  - Formular-Rendering
  - Status-Änderung
  - Validierung

### 2.3 Shop Components

- [ ] **GemstoneGrid** (`components/shop/GemstoneGrid.tsx`)
  - Produktliste rendern
  - Paginierung
  - Loading-State
  - Empty-State

- [ ] **GemstoneCard** (`components/shop/GemstoneCard.tsx`)
  - Produkt-Details anzeigen
  - Preis-Formatierung
  - Bild-Rendering
  - Link-Funktionalität

- [ ] **ShopFilters** (`components/shop/ShopFilters.tsx`)
  - Filter-Rendering
  - Filter-Änderungen
  - Reset-Funktion

- [ ] **AddToCartButton** (`components/shop/AddToCartButton.tsx`)
  - Button-Klick
  - Warenkorb-Update
  - Loading-State
  - Erfolgs-Feedback

- [ ] **AdvancedSearch** (`components/shop/AdvancedSearch.tsx`)
  - Suchformular
  - Filter-Logik
  - Ergebnis-Anzeige

### 2.4 Cart Components

- [ ] **Cart** (`components/cart/Cart.tsx`)
  - Warenkorb öffnen/schließen
  - Artikel anzeigen
  - Menge ändern
  - Artikel entfernen
  - Gesamtsumme berechnen
  - Leerer Warenkorb

- [ ] **CartSync** (`components/cart/CartSync.tsx`)
  - Synchronisierung
  - Fehlerbehandlung

- [ ] **WishlistButton** (`components/cart/WishlistButton.tsx`)
  - Zu Wunschliste hinzufügen
  - Von Wunschliste entfernen
  - Icon-Status

### 2.5 Home Components

- [ ] **HeroSection** (`components/home/HeroSection.tsx`)
  - Hero-Bild rendern
  - CTA-Buttons
  - Responsive-Verhalten

- [ ] **Newsticker** (`components/home/Newsticker.tsx`)
  - Ticker-Inhalt
  - Animation
  - Empty-State

- [ ] **NewGemstonesCarousel** (`components/home/NewGemstonesCarousel.tsx`)
  - Carousel-Rendering
  - Navigation
  - Auto-Play

### 2.6 UI Components (shadcn/ui)

- [ ] **Button** (`components/ui/button.tsx`)
  - Varianten
  - Größen
  - Disabled-State
  - Loading-State

- [ ] **Card** (`components/ui/card.tsx`)
  - Struktur
  - Varianten

- [ ] **Input** (`components/ui/input.tsx`)
  - Eingabe-Validierung
  - Error-State
  - Disabled-State

- [ ] **Select** (`components/ui/select.tsx`)
  - Optionen rendern
  - Auswahl
  - Disabled-Optionen

- [ ] **Dialog** (`components/ui/dialog.tsx`)
  - Öffnen/Schließen
  - Overlay
  - Esc-Taste

---

## 3. Store/Hooks Tests

### 3.1 Cart Store

- [ ] **useCartStore** (`lib/store/cart.ts`)
  - Warenkorb hinzufügen
  - Menge ändern
  - Artikel entfernen
  - Gesamtsumme berechnen
  - Warenkorb löschen
  - Persistierung

### 3.2 Wishlist Store

- [ ] **useWishlistStore** (`lib/store/wishlist.ts`)
  - Artikel hinzufügen
  - Artikel entfernen
  - Liste abrufen
  - Persistierung

### 3.3 Custom Hooks

- [ ] **useAdvancedSearch** (`lib/hooks/useAdvancedSearch.ts`)
  - Suchparameter setzen
  - Filter-Logik
  - Ergebnis-Caching

- [ ] **useHeroSettings** (`lib/hooks/useHeroSettings.ts`)
  - Settings laden
  - Settings aktualisieren
  - Fallback zu localStorage

- [ ] **usePictogramDescriptions** (`lib/hooks/usePictogramDescriptions.ts`)
  - Descriptions laden
  - Caching

---

## 4. Utility Functions Tests

### 4.1 Utilities

- [ ] **cn** (`lib/utils.ts`)
  - Klassen-Verknüpfung
  - Conditional Classes

- [ ] **colorBadge** (`lib/utils/colorBadge.ts`)
  - Farb-Badge-Generierung

### 4.2 Data Loaders

- [ ] **loadGemstones** (`lib/data/gemstones.ts`)
  - Daten laden
  - Filterung
  - Fehlerbehandlung

- [ ] **loadKnowledgeArticles** (`lib/data/knowledge.ts`)
  - Artikel laden
  - Publikations-Filter

- [ ] **loadStories** (`lib/data/stories.ts`)
  - Stories laden
  - Sortierung

### 4.3 Services

- [ ] **Invoice Service** (`lib/services/invoice.ts`)
  - PDF-Generierung
  - E-Mail-Versand
  - Validierung

- [ ] **Email Service** (`lib/email.ts`)
  - E-Mail-Versand
  - Template-Rendering
  - Fehlerbehandlung

- [ ] **SEO Utils** (`lib/seo.ts`)
  - Meta-Tags generieren
  - Structured Data

---

## 5. Integration Tests

### 5.1 E-Commerce Flows

- [ ] **Bestellprozess**
  - Warenkorb → Checkout → Bestätigung
  - Zahlungsverarbeitung
  - E-Mail-Bestätigung

- [ ] **Wunschliste → Warenkorb**
  - Zu Wunschliste hinzufügen
  - In Warenkorb verschieben

- [ ] **Produktsuche**
  - Suche → Filter → Auswahl
  - Paginierung

### 5.2 Admin Flows

- [ ] **Edelstein-Verwaltung**
  - Erstellen → Bearbeiten → Löschen
  - Bild-Upload
  - Kategorisierung

- [ ] **Bestellverwaltung**
  - Bestellung ansehen
  - Status ändern
  - Rechnung generieren

- [ ] **Newsletter-Verwaltung**
  - Newsletter erstellen
  - Versenden
  - Export

---

## 6. Test-Helfer und Utilities

### 6.1 Test Utilities zu erstellen

- [ ] **test-utils.tsx**
  - Render-Helfer
  - Mock-Wrapper
  - Data-Factories

- [ ] **mock-data.ts**
  - Mock-Gemstones
  - Mock-Orders
  - Mock-Customers
  - Mock-Users

### 6.2 Mock-Setup

- [ ] **Prisma-Mock**
  - Datenbank-Mocks
  - Query-Mocks

- [ ] **Next.js Mocks** (bereits vorhanden in jest.setup.js)
  - Router
  - Image
  - next-intl

---

## 7. Performance Tests

- [ ] **Component Rendering**
  - Render-Zeit messen
  - Re-Render-Optimierung

- [ ] **API Response Times**
  - Request-Zeit messen
  - Caching-Verhalten

---

## 8. Accessibility Tests

- [ ] **Keyboard Navigation**
  - Tab-Order
  - Enter/Space-Events

- [ ] **Screen Reader**
  - ARIA-Labels
  - Semantic HTML

- [ ] **Color Contrast**
  - WCAG AA/AAA Compliance

---

## 9. Test-Dateien Struktur

```
__tests__/
├── api/
│   ├── admin/
│   │   ├── gemstones.test.ts
│   │   ├── customers.test.ts
│   │   ├── orders.test.ts
│   │   ├── knowledge.test.ts
│   │   └── newsletter.test.ts
│   ├── cart.test.ts
│   ├── wishlist.test.ts
│   ├── orders.test.ts
│   └── newsletter.test.ts
├── components/
│   ├── admin/
│   │   ├── GemstoneEditor.test.tsx
│   │   ├── DashboardStats.test.tsx
│   │   └── ...
│   ├── shop/
│   │   ├── GemstoneGrid.test.tsx
│   │   ├── GemstoneCard.test.tsx
│   │   └── ...
│   ├── cart/
│   │   ├── Cart.test.tsx
│   │   └── ...
│   └── layout/
│       ├── Header.test.tsx
│       └── Footer.test.tsx
├── lib/
│   ├── store/
│   │   ├── cart.test.ts
│   │   └── wishlist.test.ts
│   ├── hooks/
│   │   ├── useAdvancedSearch.test.ts
│   │   └── ...
│   └── utils/
│       └── utils.test.ts
├── integration/
│   ├── checkout-flow.test.ts
│   └── admin-flow.test.ts
└── utils/
    ├── test-utils.tsx
    └── mock-data.ts
```

---

## 10. Priorisierung

### Phase 1 (Hoch) - Kritische Funktionen
1. **Cart Store** - Warenkorb-Funktionalität
2. **Orders API** - Bestellprozess
3. **Authentication** - Login/Register
4. **Admin Gemstones** - Produktverwaltung
5. **Payment Flow** - Zahlungsabwicklung

### Phase 2 (Mittel) - Wichtige Funktionen
1. **Search** - Produktsuche
2. **Wishlist** - Wunschliste
3. **Newsletter** - Newsletter-System
4. **User Profile** - Profil-Verwaltung

### Phase 3 (Niedrig) - Nice-to-Have
1. **SEO Utils** - Meta-Tags
2. **Analytics** - Tracking
3. **Performance** - Optimierungen

---

## 11. Test-Commands

```bash
# Alle Tests ausführen
npm test

# Watch-Modus
npm run test:watch

# Mit Coverage
npm run test:coverage

# Einzelnen Test ausführen
npm test -- GemstoneGrid

# Nur Tests in einem Verzeichnis
npm test -- __tests__/api

# Mit Verbose-Output
npm test -- --verbose
```

---

## 12. CI/CD Integration

- [ ] **Pre-commit Hooks**
  - Tests vor Commit ausführen
  - Linting

- [ ] **GitHub Actions / CI Pipeline**
  - Automatische Test-Ausführung
  - Coverage-Reporting
  - Test-Ergebnisse dokumentieren

---

## 13. Best Practices

1. **Test-Naming**: Klare, beschreibende Namen
   ```typescript
   // Gut
   describe('GemstoneCard', () => {
     it('should display product name and price', () => {})
   })

   // Schlecht
   describe('Card', () => {
     it('should work', () => {})
   })
   ```

2. **AAA-Pattern**: Arrange, Act, Assert
   ```typescript
   it('should add item to cart', () => {
     // Arrange
     const item = mockGemstone
     const cart = useCartStore.getState()
     
     // Act
     cart.addItem(item)
     
     // Assert
     expect(cart.items).toContain(item)
   })
   ```

3. **Isolation**: Jeder Test sollte unabhängig sein

4. **Mocking**: Externe Abhängigkeiten mocken

5. **Snapshots**: Vorsichtig verwenden, nur für stabile UI

---

## 14. Metriken und Reporting

### Coverage-Metriken
- **Branches**: Alle if/else, switch cases
- **Functions**: Alle Funktionen getestet
- **Lines**: Alle Code-Zeilen
- **Statements**: Alle Statements

### Test-Statistiken
- Anzahl der Tests
- Durchschnittliche Ausführungszeit
- Flaky Tests identifizieren
- Langsamste Tests

---

## 15. Nächste Schritte

1. **Test-Umgebung aufsetzen** ✅ (bereits vorhanden)
2. **Test-Utilities erstellen** (test-utils.tsx, mock-data.ts)
3. **Kritische Tests implementieren** (Phase 1)
4. **Coverage schrittweise erhöhen**
5. **CI/CD Integration**
6. **Regelmäßige Test-Reviews**

---

## 16. Wartung

- **Wöchentlich**: Test-Ausführung und Review
- **Vor jedem Release**: Vollständige Test-Suite
- **Bei Bug-Fixes**: Korrespondierende Tests schreiben
- **Bei neuen Features**: Tests parallel entwickeln

---

**Erstellt am**: $(date)
**Letzte Aktualisierung**: $(date)
**Version**: 1.0

