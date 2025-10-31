# Projekt To‑Do Übersicht

## Shop Relaunch – Sofortmaßnahmen

- [x] **Strato-Stack vorbereiten** _(Status: Erledigt)_  
  - [x] Docker Compose für Next.js, PostgreSQL, Redis/Queue, S3-kompatiblen Storage definieren _(Status: Erledigt – siehe `deploy/strato-compose.yml` + `Dockerfile`)_  
  - [x] Monitoring/Logging (Uptime, Metrics, zentralisierte Logs) festlegen _(Status: Erledigt – Loki/Promtail/Grafana in `deploy/strato-compose.yml` + `deploy/promtail-config.yml`)_  
- [x] **Prisma auf PostgreSQL umstellen** _(Status: Erledigt)_  
  - [x] Neues Datenmodell laut `SHOP_REBUILD_PLAN.md` modellieren _(Status: Erledigt – Schema auf PostgreSQL angepasst, `Gemstone.cut`/`cutForm` ergänzt)_  
  - [x] Migration & Seed-Skripte (Demo-Daten, Admin-User) implementieren _(Status: Erledigt – `pnpm prisma migrate dev` auf neuer DB ausgeführt; Seeding folgt separat)_  
- [ ] **Server Actions & Domain-Layer bauen** _(Status: Teilweise erledigt)_  
  - [x] Repository/Service-Schicht für Gemstones anlegen _(Status: Erledigt – `lib/services/shop/*` eingeführt)_  
  - [ ] Repository/Service-Schicht für Wishlist, Cart, Orders anlegen _(Status: Offen)_  
  - [ ] Audit-Logging & Role Guards integrieren _(Status: Offen)_  
- [ ] **Shop-Frontend erneuern** _(Status: Offen)_  
  - [x] Grid (6×5 Sichtbereich) + 240px Kacheln mit Badges/Wishlist/Cart umsetzen _(Status: Erledigt – umgesetzt in `components/shop/GemstoneGrid.tsx`)_
  - [x] GemstoneCard mit Scroll-Galerie, erweiterten Attributen & Badge-Handling erstellen _(Status: Erledigt – Fallback entfernt, Detail/Modal finalisiert in `components/shop/GemstoneGrid.tsx` + `app/[locale]/shop/[gemId]/page.tsx`)_  
- [ ] **Admin-Panel restrukturieren** _(Status: Offen)_  
  - [ ] Listenansicht mit Bulk-Aktionen & Filter (isNew, isSold, Status) bauen _(Status: Offen)_  
  - [ ] Detail-/Bulk-Upload-Form mit Medienverwaltung und Freigabeprozess entwickeln _(Status: Offen)_  
- [ ] **Checkout & Rechnungsflow koppeln** _(Status: Offen)_  
  - [ ] Order → Invoice Pipeline, DownloadGrants und Payment-Hooks implementieren _(Status: Offen)_  
  - [ ] MFA/Passkey für Kunden & Admins ausrollen _(Status: Offen)_  

## 1. Status & Lückenanalyse

- [ ] **Rechnungen & Downloads konsolidieren** _(Status: Offen)_  
  - [ ] API-Routen für `Invoice`, `InvoiceItem`, `Download*` erstellen (CRUD + Business-Logik) _(Status: Offen)_  
  - [ ] Admin-Oberflächen für Rechnungen/Downloads implementieren (Listen, Detail-Ansichten, Aktionen) _(Status: Offen)_  
  - [ ] Mock-Komponenten (z. B. DownloadArea) durch echte Datenquellen ersetzen _(Status: Offen)_  
- [ ] **Admin-Menü auf reale Funktionen trimmen** _(Status: Offen)_  
  - [ ] Ungenutzte oder Mock-Menüpunkte ausblenden _(Status: Offen)_  
  - [ ] Neue Menüpunkte erst nach Fertigstellung der jeweiligen Module freischalten _(Status: Offen)_  
- [x] **Wishlist & Cart serverseitig persistieren** _(Status: Erledigt)_  
  - [x] API-Routen mit Prisma für `WishlistItem`/`CartItem` implementieren _(Status: Erledigt – `app/api/wishlist` + `app/api/cart`)_  
  - [x] Frontend-Stores (`useWishlistStore`, `useCartStore`) auf API/Server Actions umstellen _(Status: Erledigt – Server Actions + optimistische Updates in `lib/store/cart.ts`, `lib/store/wishlist.ts`)_  
  - [x] Admin-Auswertungen für Wunschlisten/Bestellungen konfigurieren _(Status: Erledigt – Kennzahlen via `app/api/admin/shop/metrics` & Anzeige in `GemstoneManagementSection`)_  
- [ ] **Shop-Datenbank befüllen und absichern** _(Status: Teilweise erledigt)_  
  - [x] Seed-Skript für Kernobjekte (HeroSettings, SelectOptions, Beispiel-Gemstones) erstellt _(Status: Erledigt – siehe `prisma/seed.ts` / `prisma/seed.sql`)_  
  - [x] Seed-Ausführung & Datenvalidierung durchführen _(Status: Erledigt – `prisma/seed.sql` via `psql` eingespielt)_  
  - [ ] Fallback-Libraries entfernen oder mit Prisma-Daten verknüpfen _(Status: Teilweise erledigt – statische Gemstone-Fallbacks im Shop/Wishlist/Admin entfernt)_  
- [ ] **Rechtstexte entsperren** _(Status: Offen)_  
  - [ ] Datenmodell für Rechtstexte inkl. Versionierung (z. B. `LegalDocument`) anlegen _(Status: Offen)_  
  - [ ] Admin-Editor (Markdown/HTML) & Veröffentlichungsworkflow bauen _(Status: Offen)_  
  - [ ] Frontend-Seiten dynamisch aus der DB befüllen _(Status: Offen)_  
- [ ] **Hero / Header / Navigation vereinheitlichen** _(Status: Teilweise erledigt)_  
  - [x] HeroSettings an Prisma angebunden _(Status: Erledigt)_  
  - [x] CTA-Buttons im Hero entfernt _(Status: Erledigt)_  
  - [ ] Header/Footer/Navigations-Datenhaltung vereinheitlichen (JSON → Prisma) _(Status: Offen)_  
- [ ] **Newsticker, Stories, Blogs migrieren** _(Status: Offen)_  
  - [ ] Prisma-Modelle für Blog/Story/Ticker erstellen _(Status: Offen)_  
  - [ ] JSON-Daten importieren & Admin-UI auf Prisma-CRUD umstellen _(Status: Offen)_  
- [ ] **Prisma-Migrationen bereinigen** _(Status: Offen)_  
  - [ ] Drift zwischen `dev.db` und Migrationen durch vollständige Migrationen auflösen _(Status: Offen)_  
  - [ ] `HeroSettings`-Singleton sauber per Migration/Seed anlegen _(Status: Offen)_  
  - [ ] Einheitliche Seed-Strategie definieren _(Status: Offen)_  

## 2. Ausführungsplan Schritt 1 – Fehlende Funktionen ausbauen

- [ ] **Anforderungs-Workshop & Spezifikation durchführen** _(Status: Offen)_  
  - [ ] Rechnungen (Felder, Workflows, PDF/Statuswechsel) definieren _(Status: Offen)_  
  - [ ] Downloadbereich (Projekte, Rechte, Logging) spezifizieren _(Status: Offen)_  
  - [ ] Wishlist/Cart Persistenz & Benutzerintegration festlegen _(Status: Offen)_  
  - [ ] Rechtstext-Pflege/Versionierung klären _(Status: Offen)_  
  - [ ] Cookie-/Consent-Lösung wählen _(Status: Offen)_  
- [ ] **Architektur-Entscheidungen fixieren** _(Status: Offen)_  
  - [ ] Alle Admin-relevanten Daten nach Prisma überführen _(Status: Offen)_  
  - [ ] API-Routen auf Prisma-CRUD umstellen _(Status: Offen)_  
  - [ ] Strategie für Uploads/Dateispeicher (lokal vs. extern) definieren _(Status: Offen)_  
- [ ] **Admin-Menü aufräumen** _(Status: Geplant)_  
  - [ ] Nur fertige Module anzeigen _(Status: Offen)_  
  - [ ] UX/Validierung vereinheitlichen _(Status: Offen)_  

## 3. Ausführungsplan Schritt 2 – Migration zu Prisma & Funktions-Sync

- [ ] **JSON → Prisma Migrationen umsetzen** _(Status: Offen)_  
  - [ ] Tabellen `BlogPost`, `Story`, `TickerItem` anlegen _(Status: Offen)_  
  - [ ] Import-Skripte für bestehende JSON-Inhalte schreiben _(Status: Offen)_  
  - [ ] Admin-UI-Komponenten (Listen/Formulare) auf neue APIs umstellen _(Status: Offen)_  
- [ ] **Wishlist/Cart Persistenz abschließen** _(Status: Offen)_  
  - [ ] API-Endpunkte finalisieren _(Status: Offen)_  
  - [ ] Optimistic Updates / Server Actions implementieren _(Status: Offen)_  
- [ ] **Rechnungen & Downloads fertigstellen** _(Status: Offen)_  
  - [ ] CRUD + Business-Logik (Erstellung, Statuswechsel, Logging) _(Status: Offen)_  
  - [ ] Admin-UI für Rechnungs- und Download-Management _(Status: Offen)_  
  - [ ] PDF-/Mail-Fluss testen und absichern _(Status: Offen)_  
- [ ] **Rechtstext-Management live schalten** _(Status: Offen)_  
  - [ ] Datenmodell & Versionierung finalisieren _(Status: Offen)_  
  - [ ] Admin-Editor & Preview bereitstellen _(Status: Offen)_  
  - [ ] Frontend-Seiten anbinden _(Status: Offen)_  
- [ ] **Cookie/Consent-Handling integrieren** _(Status: Offen)_  
  - [ ] Tool auswählen & einbinden _(Status: Offen)_  
  - [ ] Optional: Consent-Logging implementieren _(Status: Offen)_  

## 4. Ausführungsplan Schritt 3 – Technische Bereinigung & Deployment

- [ ] **Prisma-Migrationen finalisieren** _(Status: Offen)_  
  - [ ] `prisma migrate reset` in Dev durchführen _(Status: Offen)_  
  - [ ] Alle Tabellen via Migration erfassen _(Status: Offen)_  
  - [ ] Deployment-Pipeline mit `prisma migrate deploy` vorbereiten _(Status: Offen)_  
- [ ] **Seed-Skripte konsolidieren** _(Status: Offen)_  
  - [ ] Zentrales `prisma/seed.ts` (Hero, Navigation, Demo-Produkte etc.) _(Status: Offen)_  
  - [ ] Import-Routinen für JSON-Daten einmalig ausführen _(Status: Offen)_  
- [ ] **Tests & QA erweitern** _(Status: Offen)_  
  - [ ] API-Tests (HeroSettings, Rechnungen, Downloads) schreiben _(Status: Offen)_  
  - [ ] Smoke-/E2E-Tests für Admin→Frontend-Flows (Cypress/Playwright) _(Status: Offen)_  
- [ ] **Deployment-Vorbereitung abschließen** _(Status: Offen)_  
  - [ ] Upload-Verzeichnisse oder externes Storage absichern _(Status: Offen)_  
  - [ ] Logging/Monitoring (z. B. Sentry) aktivieren _(Status: Offen)_  

## 5. Vorschlag für konkrete nächste Schritte

- [ ] Kickoff-Workshop/Spezifikation terminieren _(Status: Offen)_  
- [ ] Prisma-Migrations-Reset + Seed-Plan erarbeiten _(Status: Offen)_  
- [ ] Pilotfunktion (z. B. Blog) komplett auf Prisma umstellen _(Status: Offen)_  
- [ ] Iterativer Rollout der übrigen Module (Blog → Shop/Wishlist → Downloads/Rechnungen → Rechtstexte) _(Status: Offen)_  
- [ ] Admin-Menü & UX nach jedem Modul aktualisieren _(Status: Offen)_  
- [ ] QA & Dokumentation (Tests, README, Admin-Anleitung) pflegen _(Status: Offen)_  
