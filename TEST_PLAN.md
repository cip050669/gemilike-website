# Jest Testplan für Gemilike Website

## Status (Stand: 2026-11-13)

| Metrik | Wert |
|--------|------|
| Unit-/Integration-Suites | **39 passed** |
| Tests | **411 passed**, 4 skipped |
| Production Build | **grün** (`npm run build`) |
| Coverage (global, 2026-11-13) | **Stmts 9.72% / Branch 7.77% / Funcs 11.26% / Lines 9.75%** |
| Coverage-Strategie | Risikobasiert (Kernpfade hoch); **kein** globales 70%-Ziel kurzfristig |
| CI-Floor (`jest.config.js`) | Stmts ≥9 / Branch ≥7 / Funcs ≥10 / Lines ≥9 |
| CI: Jest + Build | `.github/workflows/test.yml` |

### Zuletzt verifiziert

```bash
npm test            # 39 Suites, 411 Tests OK (inkl. Header)
npm run test:coverage
npm run build       # Next.js 16.2.10 webpack Build OK
```

### Sofortmaßnahmen (angepasst, priorisiert)

1. [x] **Header-Regression absichern** → `__tests__/components/layout/Header.test.tsx`
2. [ ] Offene Lücken in Phase 1 schließen (Auth NextAuth-Flow, Payment nur high-level)
3. [x] Coverage-Lauf dokumentieren (`npm run test:coverage`)
4. [x] Jest in CI ergänzen (`.github/workflows/test.yml`)

---

## Übersicht

Dieser Plan spiegelt den **Ist-Stand der Repo-Tests** und die **nächsten sinnvollen Schritte** wider. Checkboxen:

- `[x]` = durch vorhandene Tests abgedeckt (ggf. teilweise)
- `[ ]` = noch offen / Lücke
- `(teilweise)` = Suite existiert, aber nicht alle genannten Unterpunkte

## Test-Strategie

### Test-Pyramide

- **Unit Tests** (70%): Komponenten, Utilities, Hooks, Stores
- **Integration Tests** (20%): API Routes, Komponenten-Interaktionen
- **E2E Tests** (10%): Kritische User-Flows (optional, Playwright – noch nicht eingeführt)

### Coverage-Ziele (realistisch)

Globale ~10 % sind bei der großen Next-/Admin-/API-Fläche normal. **70 % global wäre aktuell dauerhaft rot** und ist kein sinnvolles CI-Gate.

| Horizont | Ziel (Lines, global) | Zweck |
|----------|----------------------|--------|
| **Jetzt** | Floor **~9 %** Lines / **~7 %** Branches | nur Regression verhindern (`coverageThreshold`) |
| **1–2 Monate** | **20–30 %** Lines | Kernpfade: Cart, Checkout, Auth, Shop, Header |
| **Mittelfristig** | **40–50 %** Lines auf `lib/` + `app/api/` | nicht zwingend alle Admin-Pages |
| **Später optional** | **~70 %** global | erst wenn Admin-UI und Services mitgezogen sind |

**Priorität vor Prozentzahl:** hohe Coverage dort, wo Risiko liegt:

| Bereich | Ist (ca.) | Zielrichtung |
|---------|-----------|--------------|
| `lib/store` (Cart/Wishlist) | ~80–95 % | halten |
| Public APIs Cart/Orders/Wishlist/Auth-Register | hoch | halten + Lücken schließen |
| `components/layout/Header` | ~76 % | halten |
| `lib/search`, Hooks | mittel–hoch | halten |
| `lib/services`, `lib/shop`, Footer, viele Admin-APIs | niedrig / 0 % | schrittweise |

Nicht priorisieren: flächendeckende shadcn-UI-Tests, reine Admin-Listen-Pages ohne Logik, Performance-/A11y-Messungen als Coverage-Ersatz.

---

## 1. API Routes Tests

### 1.1 Authentifizierung (`/api/auth/**`)

- [x] **Register** (`/api/auth/register`) — `__tests__/api/auth/register.test.ts`
  - Erfolgreiche Registrierung, Validierung, Fehlerpfade (teilweise)
- [ ] **NextAuth** (`/api/auth/[...nextauth]`)
  - Login-/Logout-/Session-Flow (kein dedizierter Jest-Test)

### 1.2 Admin API Routes (`/api/admin/**`)

#### Gemstones Management

- [x] **GET/POST /api/admin/gemstones** — `__tests__/api/admin/gemstones.test.ts` (teilweise)
- [ ] **GET/PUT/DELETE /api/admin/gemstones/[id]** (Detail/Update/Delete API)

#### Customers Management

- [x] **GET/POST /api/admin/customers** — `__tests__/api/admin/customers.test.ts` (teilweise)
- [ ] **GET/PUT/DELETE /api/admin/customers/[id]**

#### Orders Management

- [x] Public Orders API — `__tests__/api/orders.test.ts`, `orders-id.test.ts`
- [ ] **Admin** `/api/admin/orders` dediziert (UI-Tests unter `__tests__/admin/orders.test.tsx` vorhanden)

#### Knowledge / Stories / Newsletter / Settings / Worldmap / Invoices

- [x] Admin-UI/Pages: blogs, stories, wissenswertes, newsletter (teilweise)
- [ ] Dedizierte API-Route-Tests für knowledge, header, footer, hero, worldmap, invoices

### 1.3 Public API Routes (`/api/**`)

#### Cart

- [x] **GET/POST /api/cart** — `__tests__/api/cart.test.ts`
- [ ] **GET /api/cart/load**, **POST /api/cart/save** explizit

#### Wishlist

- [x] **GET/POST /api/wishlist** — `__tests__/api/wishlist.test.ts`
- [ ] **POST /api/wishlist/sync**

#### Orders

- [x] **POST/GET /api/orders**, **GET/PUT /api/orders/[id]**
- [ ] **POST /api/orders/confirmation**

#### Newsletter / Search / Downloads / Contact

- [x] **POST /api/search/advanced** — `__tests__/api/search/advanced.test.ts`
- [ ] Newsletter public API, Downloads, Contact

---

## 2. Component Tests

### 2.1 Layout Components

- [x] **Header** (`components/layout/Header.tsx`) — `__tests__/components/layout/Header.test.tsx`
  - Navigation (Shop, Download, …)
  - Locale-Switch-Link (natives `<a>`, kein Router-Push)
  - Auth-/Wishlist-Links mit Locale-Prefix
  - Action-Icon-Styling-Klassen (kein Browser-Link-Blau)
- [ ] **Footer** (`components/layout/Footer.tsx`)
- [ ] **PublicLayout** (`components/layout/PublicLayout.tsx`)

### 2.2 Admin Components

- [x] **DashboardStats** — `__tests__/components/DashboardStats.test.tsx`
- [x] **AdminNavigation** — `__tests__/components/AdminNavigation.test.tsx`
- [x] Admin-Pages (dashboard, gemstones, customers, orders, newsletter, reviews, wishlists, stories, blogs, wissenswertes, audit, reports) — `__tests__/admin/*`
- [ ] **GemstoneEditor**, **CustomerDetailsModal**, **OrderEditForm** (dediziert)

### 2.3 Shop Components

- [x] **GemstoneGrid** — `__tests__/components/shop/GemstoneGrid.test.tsx`
- [x] **AddToCartButton** — `__tests__/components/shop/AddToCartButton.test.tsx`
- [x] **AdvancedSearch** — `__tests__/components/AdvancedSearch.test.tsx`
- [ ] **GemstoneCard**, **ShopFilters**

### 2.4 Cart Components

- [x] **Cart** — `__tests__/components/cart/Cart.test.tsx`
- [x] **CartSync** — `__tests__/components/CartSync.test.tsx`
- [x] **WishlistButton** — `__tests__/components/cart/WishlistButton.test.tsx`
- [x] **WishlistManager** — `__tests__/components/profile/WishlistManager.test.tsx`

### 2.5 Home / UI (shadcn)

- [ ] HeroSection, Newsticker, NewGemstonesCarousel
- [ ] Button/Card/Input/Select/Dialog dediziert (niedrige Prio – über Feature-Tests indirekt)

---

## 3. Store/Hooks Tests

### 3.1 Cart / Wishlist

- [x] **useCartStore** — `__tests__/store/cart.test.ts`
- [x] **persistentCart** — `__tests__/store/persistentCart.test.ts`
- [x] **useWishlistStore** — `__tests__/store/wishlist.test.ts`

### 3.2 Custom Hooks

- [x] **useAdvancedSearch** — `__tests__/hooks/useAdvancedSearch.test.ts`
- [ ] useHeroSettings, usePictogramDescriptions

---

## 4. Utility / Services / Lib

- [x] **query-parser** — `__tests__/lib/query-parser.test.ts`
- [x] **vector-search** — `__tests__/lib/vector-search.test.ts`
- [x] **order.service** serialize — `__tests__/services/order.service.test.ts`
- [ ] cn/utils, colorBadge, SEO, Invoice/Email Service (breit)

---

## 5. Integration Tests

- [x] **Checkout-Flow** (teilweise) — `__tests__/integration/checkout-flow.test.ts`
- [x] **Wishlist Actions** — `__tests__/integration/wishlist-actions.integration.test.ts`
- [ ] Admin End-to-End Flows, Payment Capture (PayPal) high-level

---

## 6. Test-Helfer

- [x] **test-utils.helper.tsx**, **mock-data.helper.ts** — `__tests__/utils/`
- [x] Next.js / next-intl Mocks in `jest.setup.js`
- [ ] Prisma-Mock zentral vereinheitlichen (viele Suites mocken lokal)

---

## 7–8. Performance / Accessibility

- [ ] Performance-Messungen (nicht in Jest-Scope priorisieren)
- [ ] A11y: Header-ARIA-Labels sind vorhanden; automatisierte Axe-Suite noch offen

---

## 9. Ist-Struktur (`__tests__/`)

```
__tests__/
├── admin/            # Page-Level Admin UI
├── api/              # auth, cart, wishlist, orders, search, admin/*
├── components/       # cart, shop, layout/Header, AdvancedSearch, …
├── hooks/
├── integration/
├── lib/
├── services/
├── store/
└── utils/            # test-utils.helper.tsx, mock-data.helper.ts
```

Abweichung zum alten Soll-Baum: Helper heißen `*.helper.ts(x)`; Layout-Tests liegen unter `components/layout/`.

---

## 10. Priorisierung (angepasst)

### Phase 1 — kritisch / aktuell

1. [x] Cart Store + Cart API
2. [x] Orders API (public)
3. [x] Auth Register API
4. [x] Admin Gemstones API/UI (teilweise)
5. [x] **Header-Regression** (Locale, Nav, Actions)
6. [ ] Payment/PayPal Capture Validierung (Unit um Validierungslogik)

### Phase 2 — wichtig

1. [x] Search advanced
2. [x] Wishlist Store/API
3. [ ] Newsletter public API
4. [ ] Footer / Profile Flows

### Phase 3 — später

1. SEO Utils, Analytics, Performance, volle A11y-Suite
2. Dedizierte shadcn UI-Tests

---

## 11. Test-Commands

```bash
npm test
npm run test:watch
npm run test:coverage   # mit Coverage + Regression-Floor
npm run test:ci         # wie CI: coverage + --ci --forceExit
npm test -- Header
npm test -- __tests__/api
npm test -- --verbose
npm run build
```

---

## 12. CI/CD Integration

- [x] Security: CodeQL, npm audit, dependency-review, secret-scanning (`.github/workflows/`)
- [x] Jest + Coverage + Build: `.github/workflows/test.yml`
  - Job `unit`: `npm run test:ci` (Coverage-Artifact `coverage-report`)
  - Job `build`: `npm run build` (Dummy-`DATABASE_URL`)
- [ ] Pre-commit: Tests optional (nicht erzwingen ohne Team-Entscheidung)

---

## 13. Best Practices

1. Beschreibende `describe`/`it`-Namen
2. AAA-Pattern
3. Isolation + Mocks für Prisma/Next/Auth
4. Keine flaky Router-Tests: Header-Navigation über `href` assertieren (kein `router.push` vor Init)
5. Snapshots sparsam

---

## 14. Metriken

Nach jedem Release-Kandidaten:

```bash
npm test
npm run test:coverage
npm run build
```

Dokumentieren: Suites/Tests, **globale** Coverage %, Build OK/Fail.

Bewertung:

- CI-Floor halten (keine Regression unter ~9 % Lines)
- Fortschritt an **Kernpfad-Coverage** messen, nicht nur am globalen %-Wert
- Floor in `jest.config.js` nur anheben, wenn der Ist-Stand stabil darüber liegt

---

## 15. Nächste Schritte (konkret)

1. [x] Test-Umgebung
2. [x] Test-Utilities
3. [x] Phase-1-Kern (Cart/Orders/Register/Stores)
4. [x] Header-Suite nach UI-Fix
5. [x] Coverage-Report + realistische Ziele dokumentiert
6. [x] `test.yml` Workflow: Jest+Coverage + Build
7. [ ] Richtung **20–30 % Lines**: zuerst `lib/services`, `lib/shop`, Contact/Newsletter-APIs
8. [ ] Fehlende Public-APIs: contact, newsletter, cart load/save
9. [ ] CI-Floor anheben, sobald global stabil ≥15 % Lines

---

## 16. Wartung

- Vor Release: volle Suite + Build + Coverage-Report  
- Bei Bugfixes: Regressionstest (wie Header)  
- Bei Features: Tests parallel; Coverage-Floor nicht senken  
- Globales 70 %-Gate erst einführen, wenn mittelfristiges 40–50 %-Band auf `lib/`/`app/api/` erreicht ist

---

**Erstellt**: 2025  
**Letzte Aktualisierung**: 2026-11-13  
**Version**: 1.2 (realistische Coverage-Ziele)
