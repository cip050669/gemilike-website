# Shop Relaunch – Architektur- & Implementierungsplan

## 1. Hosting & Infrastruktur (Strato-fokussiert)
- **Server-Basis:** Virtueller oder dedizierter Strato-Server (Ubuntu 22.04 LTS) mit Docker + Docker Compose.
- **Runtime:** Node.js 20 LTS (Next.js App Router) + pnpm oder npm (gemäß Projektstandard).
- **Prozess-Layout:**
  - `app` Container (Next.js, Edge-/Server-Actions aktiviert, Hot reload in Dev).
  - `postgres` Container (PostgreSQL 15+) mit persistentem Volume (`/var/lib/postgresql/data` → Strato SSD-Volume).
  - `redis` (optional) für Rate-Limits, Queues, Session-Cache.
  - `minio` oder S3-kompatibler Storage (Strato HiDrive S3 Endpoint) für Medien.
- **Reverse Proxy:** Caddy oder NGINX mit Let's Encrypt, HTTP/2, HTTP/3 optional.
- **Monitoring:** Uptime Kuma/Prometheus + Grafana, zentralisierte Logs via Loki oder Strato Log-Streams.

## 2. Datenmodell (Prisma, Ziel-PostgreSQL)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Kern-Tabellen
| Tabelle | Zweck | Schlüssel-Felder |
| --- | --- | --- |
| `Gemstone` | Stammdaten je Stein | `id`, `slug`, `status (draft/review/published/archived)`, `category`, `name`, `shortDescription`, `longDescription`, `origin`, `isNew`, `isSold`, `featured`, `cut`, `cutForm`, `createdAt`, `updatedAt` |
| `GemstoneInventory` | Lager-/Gewichtsdaten | `gemstoneId (1:1)`, `condition (cut/rough)`, `caratWeight`, `gramWeight`, `quantity`, `sku`, `warehouseLocation`, `availableFrom`, `availableTo` |
| `GemstoneAttributes` | Technische Attribute | `gemstoneId (1:1)`, `lengthMm`, `widthMm`, `heightMm`, `color`, `colorSaturation`, `colorHue`, `clarity`, `cutGrade`, `treatment`, `certification`, `certificateId`, `certificateUrl` |
| `GemstoneMedia` | Mediengalerie | `id`, `gemstoneId`, `type (image/video)`, `url`, `thumbnailUrl`, `alt`, `position`, `isPrimary` |
| `GemstoneTag` / `Tag` | Filter-Tags | für flexible Taxonomie (Farbe, Thema, Kollektion) |
| `PriceBook` | Mehrwertsteuer/netto/brutto | `id`, `gemstoneId`, `currency`, `priceNet`, `priceGross`, `taxRate`, `discountType`, `discountValue`, `validFrom`, `validTo` |
| `Customer` | Kundenkonto | `id`, `userId`, `customerNumber`, `billingAddressId`, `shippingAddressId`, `preferredLanguage`, `kycStatus`, `marketingOptIn` |
| `Wishlist` & `WishlistItem` | Wishlist-Funktion | `customerId`, `gemstoneId`, `createdAt` |
| `Cart` & `CartItem` | Warenkorb | `customerId` (oder temporärer `sessionId`), `gemstoneId`, `quantity`, `priceSnapshot` |
| `Order` | Bestellungen | `id`, `orderNumber`, `customerId`, `status`, `subtotal`, `taxAmount`, `shippingAmount`, `total`, `currency`, `paymentStatus`, `paymentMethod`, `placedAt` |
| `OrderItem` | Positionen | `orderId`, `gemstoneId`, `quantity`, `unitPrice`, `unitNet`, `unitTax`, `weightSnapshot`, `attributesSnapshot` |
| `Invoice`, `InvoiceItem` | Rechnungsfluss wie bestehend, erweitert um `pdfStorageKey`, `sentBy` |
| `DownloadGrant` | Download-/Dokumentzugriff nach Kauf | `id`, `customerId`, `gemstoneId?`, `orderId?`, `resourceType`, `resourceKey`, `grantedAt`, `expiresAt`, `downloadCount`, `maxDownloads` |
| `AuditLog` | Admin-Änderungen | `id`, `actorId`, `action`, `entity`, `entityId`, `metadata`, `ipAddress`, `createdAt` |

### Erweiterbarkeit
- Strukturierte JSON-Spalten (`attributesJson`, `metadata`) für zusätzliche Spezialdaten.
- Versionierung via `GemstoneVersion` (optional) für Freigabeprozesse.
- Indizes für `isNew`, `isSold`, `status`, `category`, `priceGross`, `createdAt`.

## 3. API-/Server-Action-Konzept
- Alle Shop-Read-Flows als Server Components + Revalidate-Strategie (`revalidateTag('gemstones:list')`).
- Mutationen via Server Actions (Admin) mit Role Guard (RBAC) + Audit-Logging.
- Kundenaktionen (Wishlist, Cart, Checkout) via Server Actions, die Session/Token prüfen.
- REST-Endpunkte nur für Drittsysteme (z. B. ERP), abgesichert über API Keys + IP Allowlist.
- Webhook-Layer (z. B. Payment Provider) zu `/api/webhooks/payments` mit Signaturprüfung.
- Background Jobs (BullMQ + Redis) für PDF-Erstellung, Medien-Transcoding, Mailversand.

## 4. Shop-Frontend (Zielbild)
- **Startseite („Neuheiten“ Block):**
  - Grid 6 Zeilen × 5 Spalten (30 Kacheln) sichtbar, `grid-template-rows: repeat(6, minmax(0, 1fr))`, `grid-auto-rows` für virtuelles Nachladen.
  - Kachel 240×240 px Media (Square, `object-cover`), darunter Info-Stack.
  - Inhalte: Edelsteinart (`category`), Beschreibung (`name`), Preis (formatierter `priceGross`), Gewicht (carat oder gram), Herkunft, Badge „NEU“.
  - Buttons: Wishlist (Herz) + „In den Warenkorb“.
- **Shopseite (voller Katalog):**
  - Default-Sortierung `publishedAt desc`.
  - Infinite Scroll (IntersectionObserver) oder „Mehr laden“-Button nach den ersten 30 Items.
  - Server-Driven Filter (Kategorie, Preis, Gewicht, Zustand, Zertifizierung).
  - Responsive Breakpoints (Desktop 5, Tablet 3, Mobile 2 Spalten).
- **GemstoneCard (Detailanzeige / Modal oder dedizierte Seite):**
  - Medien-Karussell: horizontal scroll, Scroll-Snap, Thumbnails darunter; unterstützt Bilder & MP4.
  - Infos: Art, Beschreibung, Preis, Gewicht, Herkunft, Maße (L/B/H), Farbe, Farbsättigung, Behandlung, Zertifizierung, Badges „NEU“, „VERKAUFT“.
  - Tabs für weiterführende Daten (Story, Zertifikatsdownload, Bewertungen).
  - CTA-Zone: Wishlist, Warenkorb, Kontakt/Anfrage (bei „verkauft“ optional).

## 5. Admin-Panel
- **Listenansicht:**
  - Spalten: Vorschaubild, Name, Kategorie, Preis, Bestand, Status, Badges.
  - Filter: Status, Kategorie, Preisrange, Zertifizierung, `isNew`, `isSold`.
  - Bulk-Aktionen: Publish/Unpublish, Badges setzen, Preise aktualisieren, Export (CSV/XLSX).
- **Detail-/Edit-Formular (Tabs):**
  1. Stammdaten (Name, Kategorie, slug, Tags, Status)
  2. Attribute (Maße, Farbe, Behandlung, Zertifikate, Gewicht)
  3. Preise & Lager (Brutto/Netto, Rabatte, SKU, Bestand)
  4. Medien (Drag & Drop Upload, Reihenfolge per Drag, `isPrimary` Checkbox)
  5. SEO & Metadaten (Meta Title, Description, OpenGraph)
  6. Historie (Audit Log, Versionen, Kommentare)
- **Bulk-Upload Workflow:**
  - CSV/XLSX Template mit Pflichtspalten (Name, Kategorie, Preis, Zustand, Gewicht etc.) + optionaler ZIP mit Medien (`media/<rowNumber>/*`).
  - Import-Service (Server Action) validiert, erstellt Drafts, gibt Report (Fehler/Warnings).
  - Automatisch generierte Slugs & SKU; Bilder in Object Storage (HiDrive S3) hochgeladen, URLs gespeichert.
- **Freigabeprozess:**
  - Rollen: `admin`, `editor`, `viewer`.
  - Editor erstellt/ändert, sendet zur Freigabe (`status = review`).
  - Admin bestätigt (`status = published`) → Trigger `revalidateTag`.

## 6. Authentifizierung & Konto
- NextAuth (Credentials + WebAuthn Passkeys + optional TOTP).
- Strategetische Cookies (Secure, HTTPOnly, SameSite=Lax).
- Kundenkonto notwendig für Kauf, Downloadzugriff, Wunschliste (Gast-Wishlist via local storage synchronisiert bei Login).
- Admin-Zugang nur mit MFA; IP-Restriktion optional.
- Zugriff auf Downloads via signierte URLs + `DownloadGrant`.

## 7. Rechnungsflow & Payments
- Bestellung → Payment Provider (Stripe/Mollie) → Webhook → `Order` Update → `Invoice` Generation (PDF via serverless Puppeteer oder PDFKit).
- `Invoice` verlinkt zu `Order`; `InvoiceItem` Snapshot der Positionsdaten.
- Nach erfolgreicher Zahlung: `DownloadGrant` erstellen (z. B. Zertifikate, Gutachten).
- Admin-Reports: Umsatz, offene Rechnungen, Lagerbewertung (SQL Views + Admin-UI Karten).

## 8. Migration & Rollout
1. **Schema-Erstellung:** Neue Prisma-Migration auf PostgreSQL, Tests mit `prisma migrate dev`.
2. **Seed-Daten:** `prisma/seed.ts` (Demo-Gemstones, Admin-User, Preis-/Inventar-Defaults).
3. **Datenübernahme (optional):** SQLite Export → Script zur Transformation → Import nach PostgreSQL.
4. **Feature Flags:** Neuer Shop/Admin hinter Flags deployen, A/B Tests möglich.
5. **Tests:** Unit (Zod Validatoren), Integration (Prisma, Server Actions), E2E (Playwright) für Kauf/Wishlist/Admin CRUD.
6. **Deployment:** CI/CD (GitHub Actions) → Build → Docker push → Compose up auf Strato.

## 9. Nächste operative Schritte
1. **ERD & Contracts finalisieren:** Tabellen, Relationen, Server-Action-Signaturen.
2. **Prisma-Schema refactor:** SQLite → PostgreSQL, neue Models umsetzen, Migration erzeugen.
3. **Service Layer:** Repositorys/Server Actions für Gemstones, Wishlist, Cart, Orders.
4. **Admin UI Redesign:** Komponentenstruktur, Bulk-Upload, Status-Workflow implementieren.
5. **Shop-Frontend Neuentwicklung:** Grid, Detail-Gallery, CTA-Integration, Scroll-Verhalten.
6. **Auth-Aufrüstung:** Passkey/TOTP, Rollen, Schutz der Actions.
7. **Rechnungsflow koppeln:** Order → Invoice Pipeline, DownloadGrants.
8. **Infra Setup:** Docker Compose Skripte, Strato-spezifische Hardening, Observability.

> Reset ist akzeptabel – bestehende SQLite-Daten können bei Bedarf migriert oder verworfen werden, sobald PostgreSQL produktiv bereitsteht.

## 10. Aktueller Fortschritt (UI-Anpassungen Shop)
- Intro-Story-Card „Unsere Auswahl an Edelsteinen“ auf der Shop-Seite implementiert (`components/shop/ShopShowcase.tsx`), Design und Typografie spiegeln die Startseiten-Sektion „Neue Edelsteine“.
- Navigations-Button „Zurück zur Startseite“ rechtsbündig in die Shop-Intro-Card integriert, gleiche Nav-Styles wie Header/Footer (Locale-aware Link).
- Shop-Kachelraster mit 5 Spalten × 240 px Breite, homogener Glow-Hover und Badges analog Startseite aktualisiert (`components/shop/GemstoneGrid.tsx`); Sichtfenster auf 6 Reihen mit vertikaler Scrollleiste begrenzt.
- Weitere Arbeiten offen: Gemstone-Detailansicht (Modal/Seite) finalisieren, Infinite-Scroll/Load-More und Filter-Interaktionen verifizieren, serverseitige Checkout-Logs & Tests ergänzen.
- Cart- & Wishlist-Flows auf Server Actions umgestellt (`lib/actions/cart.ts`, `lib/actions/wishlist.ts`) inklusive Zustands- und UI-Stores mit optimistischen Updates (`lib/store/cart.ts`, `lib/store/wishlist.ts`), Buttons/Seiten auf neue Stores gehoben.
- Schliff- und Schliffform-Auswahllisten im Admin-Editor integriert; neue Prisma-Felder `Gemstone.cut`/`Gemstone.cutForm` werden über Editor, Management-Ansicht und Shop-Frontend konsistent gepflegt (`components/admin/GemstoneEditor.tsx`, `components/admin/GemstoneManagementSection.tsx`, `lib/shop/shopData.ts`).
- Migration auf PostgreSQL abgeschlossen (`pnpm prisma migrate dev --name init_postgres`); bestehende SQLite-Historie bereinigt, neue Migration `20251031010241_add_cut_fields` aktiv.
- Seed-Skript (`prisma/seed.ts`) + SQL-Fallback (`prisma/seed.sql`) legen HeroSettings, SelectOptions (Schliff/Schliffform) und drei Demo-Gemstones inkl. Inventar/Medien an; Daten wurden via `psql` erfolgreich eingespielt.
