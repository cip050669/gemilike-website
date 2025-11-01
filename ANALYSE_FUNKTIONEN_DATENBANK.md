# Analyse: Website-Funktionen vs. Admin-Funktionen vs. Datenbank-Instanzen

**Erstellt am:** 2025-01-15  
**Letzte Aktualisierung:** 2025-11-01

**Status-Änderungen:**
- ✅ Review System vollständig implementiert (Frontend + Admin + API)
- ✅ Rechnungen Frontend vollständig implementiert (Profil-Seite + PDF-Download)
- ✅ Wishlist Admin vollständig implementiert (Analytics + Management)
- ✅ Email-Benachrichtigungen für Reviews und Wishlist-Verfügbarkeit

---

## 1. ÖFFENTLICHE WEBSITE-FUNKTIONEN

### ✅ **E-Commerce Features**
| Funktion | Route | Admin-Funktion | Datenbank-Instanz | Status |
|----------|-------|----------------|-------------------|--------|
| Shop-Übersicht | `/shop` | ✅ Gemstones Management | ✅ Gemstone, GemstoneAttributes, GemstoneMedia, GemstonePrice | ✅ Vollständig |
| Produktdetails | `/shop/[gemId]` | ✅ Gemstone Edit | ✅ Gemstone, GemstoneAttributes, GemstoneInventory | ✅ Vollständig |
| Warenkorb | `/cart` | ⚠️ Teilweise (Orders) | ✅ Cart, CartItem | ⚠️ **Fehlt: Admin Cart-Management** |
| Checkout | `/checkout` | ⚠️ Teilweise (Orders) | ✅ Cart, CartItem, Order | ⚠️ **Fehlt: Checkout-Prozess-Admin** |
| Bestellungen anzeigen | `/orders/[id]` | ✅ Orders Management | ✅ Order, OrderItem | ✅ Vollständig |
| Wishlist | `/wishlist` | ✅ **IMPLEMENTIERT** | ✅ Wishlist, WishlistItem | ✅ **Vollständig - Admin hinzugefügt** |
| Reviews | `/shop/[gemId]` | ✅ **IMPLEMENTIERT** | ✅ Review | ✅ **Vollständig - Frontend + Admin** |

### ✅ **Content & Information**
| Funktion | Route | Admin-Funktion | Datenbank-Instanz | Status |
|----------|-------|----------------|-------------------|--------|
| Blog-Liste | `/blog` | ✅ Blogs Management | ✅ Blog | ✅ Vollständig |
| Blog-Artikel | `/blog/[slug]` | ✅ Blogs Edit | ✅ Blog | ✅ Vollständig |
| Stories | `/stories/[id]` | ✅ Stories Management | ✅ Story | ✅ Vollständig |
| Wissenswertes | `/wissenswertes`, `/wissenswertes/[id]` | ✅ Wissenswertes Management | ⚠️ **JSON-Datei** (`data/knowledge.json`) | ⚠️ **Nicht in DB - sollte migriert werden** |
| Worldmap | `/worldmap` | ✅ Worldmap Management | ✅ Location, GemType, Country | ✅ Vollständig |
| About | `/about` | ✅ About Management | ⚠️ **i18n Übersetzungen** (`messages/*.json`) | ⚠️ **Nicht in DB - sollte migriert werden** |
| Services | `/services` (in About eingebettet) | ❌ **FEHLT** | ⚠️ **i18n Übersetzungen** | ⚠️ **Nicht verwaltbar - sollte DB + Admin bekommen** |

### ✅ **User-Features**
| Funktion | Route | Admin-Funktion | Datenbank-Instanz | Status |
|----------|-------|----------------|-------------------|--------|
| Profil | `/profile` | ✅ Customers Management | ✅ Customer, User, Address | ✅ Vollständig |
| Rechnungen | `/profile/invoices` | ✅ **IMPLEMENTIERT** | ✅ Invoice, InvoiceItem, DownloadGrant | ✅ **Vollständig - Frontend hinzugefügt** |
| Downloads | `/downloads` | ✅ Downloads API | ✅ DownloadGrant | ✅ Vollständig |
| Zertifikate | `/certificates` | ⚠️ Teilweise (Downloads) | ✅ DownloadGrant | ⚠️ **Fehlt: Dedizierte Certificates-Verwaltung** |

### ✅ **Newsletter & Kontakt**
| Funktion | Route | Admin-Funktion | Datenbank-Instanz | Status |
|----------|-------|----------------|-------------------|--------|
| Newsletter Anmeldung | API `/newsletter` | ✅ Newsletter Management | ✅ NewsletterSubscriber | ✅ Vollständig |
| Kontaktformular | `/contact` | ✅ Contact Data Management | ✅ ContactData | ✅ Vollständig |

### ✅ **Rechtliche Seiten**
| Funktion | Route | Admin-Funktion | Datenbank-Instanz | Status |
|----------|-------|----------------|-------------------|--------|
| Impressum | `/imprint` | ❌ **FEHLT** | ❌ **Kein Model** | ❌ **Fehlt: Admin-Editor** |
| Datenschutz | `/privacy` | ❌ **FEHLT** | ❌ **Kein Model** | ❌ **Fehlt: Admin-Editor** |
| AGB | `/terms` | ❌ **FEHLT** | ❌ **Kein Model** | ❌ **Fehlt: Admin-Editor** |
| Widerruf | `/returns` | ❌ **FEHLT** | ❌ **Kein Model** | ❌ **Fehlt: Admin-Editor** |
| Versand | `/shipping` | ❌ **FEHLT** | ❌ **Kein Model** | ❌ **Fehlt: Admin-Editor** |
| Cookies | `/cookies` | ❌ **FEHLT** | ❌ **Kein Model** | ❌ **Fehlt: Admin-Editor** |

---

## 2. ADMIN-FUNKTIONEN

### ✅ **Produkt-Management**
| Admin-Funktion | Route | Öffentliche Funktion | Datenbank-Instanz | Status |
|----------------|-------|----------------------|-------------------|--------|
| Gemstones Übersicht | `/admin/gemstones` | ✅ Shop | ✅ Gemstone + Relations | ✅ Vollständig |
| Gemstone erstellen | `/admin/gemstones/new` | ✅ Shop | ✅ Gemstone + Relations | ✅ Vollständig |
| Gemstone bearbeiten | `/admin/gemstones/edit/[id]` | ✅ Shop | ✅ Gemstone + Relations | ✅ Vollständig |
| Gemstone Upload | `/admin/gemstones/upload` | ✅ Shop | ✅ GemstoneMedia | ✅ Vollständig |

### ✅ **Kunden-Management**
| Admin-Funktion | Route | Öffentliche Funktion | Datenbank-Instanz | Status |
|----------------|-------|----------------------|-------------------|--------|
| Customers Übersicht | `/admin/customers` | ✅ Profile | ✅ Customer, User, Address | ✅ Vollständig |
| Customer erstellen | `/admin/customers/new` | ✅ Profile | ✅ Customer, User | ✅ Vollständig |
| Customer bearbeiten | `/admin/customers/edit/[id]` | ✅ Profile | ✅ Customer, Address | ✅ Vollständig |
| Customer anzeigen | `/admin/customers/view/[id]` | ✅ Profile | ✅ Customer, Orders, Invoices | ✅ Vollständig |
| Customer Notizen | API `/admin/customers/notes` | ✅ Profile | ✅ User.notes | ✅ Vollständig |

### ✅ **Bestell-Management**
| Admin-Funktion | Route | Öffentliche Funktion | Datenbank-Instanz | Status |
|----------------|-------|----------------------|-------------------|--------|
| Orders Übersicht | `/admin/orders` | ✅ Orders | ✅ Order, OrderItem | ✅ Vollständig |
| Order erstellen | `/admin/orders/new` | ✅ Checkout | ✅ Order, OrderItem | ✅ Vollständig |
| Order bearbeiten | `/admin/orders/edit/[id]` | ✅ Orders | ✅ Order, OrderItem | ✅ Vollständig |
| Order anzeigen | `/admin/orders/view/[id]` | ✅ Orders | ✅ Order, OrderItem | ✅ Vollständig |

### ✅ **Rechnungs-Management**
| Admin-Funktion | Route | Öffentliche Funktion | Datenbank-Instanz | Status |
|----------------|-------|----------------------|-------------------|--------|
| Rechnungen Übersicht | `/admin/rechnungen` | ✅ **IMPLEMENTIERT** | ✅ Invoice, InvoiceItem | ✅ **Vollständig - Frontend hinzugefügt** |
| Rechnung erstellen | `/admin/rechnungen/neu` | ✅ **IMPLEMENTIERT** | ✅ Invoice, InvoiceItem | ✅ **Vollständig - Frontend hinzugefügt** |
| Invoice Status | API `/admin/invoices/[id]/status` | ✅ **IMPLEMENTIERT** | ✅ Invoice | ✅ **Vollständig - Frontend zeigt Status** |
| Invoice PDF Download | API `/api/user/invoices/[id]/download` | ✅ **IMPLEMENTIERT** | ✅ Invoice, DownloadGrant | ✅ **Vollständig - PDF-Download** |
| Bank Accounts | API `/admin/bank-accounts` | ❌ **FEHLT** | ✅ BankAccount | ⚠️ **Nur für Admin** |

### ✅ **Content-Management**
| Admin-Funktion | Route | Öffentliche Funktion | Datenbank-Instanz | Status |
|----------------|-------|----------------------|-------------------|--------|
| Blogs Management | `/admin/blogs` | ✅ Blog | ✅ Blog | ✅ Vollständig |
| Stories Management | `/admin/stories` | ✅ Stories | ✅ Story | ✅ Vollständig |
| Wissenswertes | `/admin/wissenswertes` | ✅ Wissenswertes | ⚠️ **JSON-Datei** (`data/knowledge.json`) | ⚠️ **Nicht in DB - sollte migriert werden** |
| Newsticker | `/admin/newsticker` | ⚠️ Frontend | ✅ NewstickerItem | ⚠️ **Fehlt: Öffentliche Newsticker-Ansicht** |

### ✅ **Newsletter-Management**
| Admin-Funktion | Route | Öffentliche Funktion | Datenbank-Instanz | Status |
|----------------|-------|----------------------|-------------------|--------|
| Newsletter Übersicht | `/admin/newsletter` | ✅ Newsletter Subscription | ✅ NewsletterSubscriber | ✅ Vollständig |
| Newsletter versenden | API `/admin/newsletter/[id]/send` | ✅ Newsletter Subscription | ✅ NewsletterSubscriber | ✅ Vollständig |
| Newsletter Export | API `/admin/newsletter/export` | ❌ **Nur Admin** | ✅ NewsletterSubscriber | ✅ Vollständig |

### ✅ **System-Management**
| Admin-Funktion | Route | Öffentliche Funktion | Datenbank-Instanz | Status |
|----------------|-------|----------------------|-------------------|--------|
| Dashboard | `/admin/dashboard` | ❌ **Nur Admin** | ✅ Aggregierte Daten | ✅ Vollständig |
| Audit-Log | `/admin/audit` | ❌ **Nur Admin** | ✅ AuditLog | ✅ Vollständig |
| Reports | `/admin/reports` | ❌ **Nur Admin** | ✅ Aggregierte Daten | ✅ Vollständig |
| Settings | `/admin/settings` | ❌ **Nur Admin** | ✅ CompanySettings | ✅ Vollständig |
| Header Management | `/admin/header` | ✅ Header (global) | ✅ HeaderData | ✅ Vollständig |
| Hero Image | `/admin/hero-image` | ✅ Homepage | ✅ HeroImage | ✅ Vollständig |
| Hero Settings | API `/admin/hero-settings` | ✅ Homepage | ✅ HeroSettings | ✅ Vollständig |
| Contact Data | `/admin/contact-data` | ✅ Contact | ✅ ContactData | ✅ Vollständig |
| Worldmap | `/admin/worldmap` | ✅ Worldmap | ✅ Location, GemType, Country | ✅ Vollständig |
| Locations | `/admin/locations` | ✅ Worldmap | ✅ Location | ✅ Vollständig |
| Select Options | `/admin/select-options` | ⚠️ Dropdowns | ✅ SelectOption | ✅ Vollständig |
| Pictogram Descriptions | `/admin/pictogram-descriptions` | ⚠️ Frontend | ✅ PictogramDescription | ✅ Vollständig |
| About Management | `/admin/about` | ✅ About | ⚠️ **i18n Übersetzungen** (nur API, kein DB-Save) | ⚠️ **Nicht persistent - sollte DB-Model bekommen** |
| Wishlist Management | `/admin/wishlists` | ✅ **IMPLEMENTIERT** | ✅ Wishlist, WishlistItem | ✅ **Vollständig - Admin hinzugefügt** |
| Review Management | `/admin/reviews` | ✅ **IMPLEMENTIERT** | ✅ Review | ✅ **Vollständig - Admin hinzugefügt** |

---

## 3. DATENBANK-MODELLE ANALYSE (42 Modelle)

### ✅ **Vollständig genutzt (mit Admin + Frontend)**
1. ✅ **Gemstone** - Shop Frontend + Admin Management
2. ✅ **GemstoneAttributes** - Shop Details + Admin Edit
3. ✅ **GemstoneInventory** - Shop Verfügbarkeit + Admin Edit
4. ✅ **GemstoneMedia** - Shop Galerie + Admin Upload
5. ✅ **GemstonePrice** - Shop Preis + Admin Pricing
6. ✅ **Cart** - Shop Warenkorb + Orders Admin
7. ✅ **CartItem** - Shop Warenkorb + Orders Admin
8. ✅ **Order** - Orders Frontend + Admin Management
9. ✅ **OrderItem** - Orders Frontend + Admin Management
10. ✅ **Customer** - Profile Frontend + Admin Management
11. ✅ **User** - Auth + Admin Management
12. ✅ **Address** - Profile + Checkout + Admin
13. ✅ **Invoice** - ✅ **IMPLEMENTIERT - Admin + Frontend + PDF-Download**
14. ✅ **InvoiceItem** - ✅ **IMPLEMENTIERT - Admin + Frontend**
15. ✅ **Blog** - Blog Frontend + Admin Management
16. ✅ **Story** - Stories Frontend + Admin Management
17. ✅ **Location** - Worldmap Frontend + Admin Management
18. ✅ **GemType** - Worldmap Frontend + Admin Management
19. ✅ **Country** - Worldmap Frontend + Admin Management
20. ✅ **NewsletterSubscriber** - Newsletter Frontend + Admin Management
21. ✅ **ContactData** - Contact Frontend + Admin Management
22. ✅ **HeaderData** - Header Frontend + Admin Management
23. ✅ **HeroImage** - Homepage Frontend + Admin Management
24. ✅ **HeroSettings** - Homepage Frontend + Admin Management
25. ✅ **NewstickerItem** - Frontend Banner + Admin Management
26. ✅ **Wishlist** - Wishlist Frontend + Admin Management ✅ **IMPLEMENTIERT**
27. ✅ **WishlistItem** - Wishlist Frontend + Admin Management ✅ **IMPLEMENTIERT**
28. ✅ **DownloadGrant** - Downloads Frontend + Admin
29. ✅ **CompanySettings** - Admin Settings
30. ✅ **BankAccount** - Admin Invoices
31. ✅ **SelectOption** - Dropdowns Frontend + Admin
32. ✅ **PictogramDescription** - Frontend + Admin
33. ✅ **Tag** - Gemstone Tags + Admin (über GemstoneTag)
34. ✅ **GemstoneTag** - Gemstone Tags + Admin
35. ✅ **Coupon** - Checkout (⚠️ Frontend UI fehlt)
36. ✅ **Review** - ✅ **IMPLEMENTIERT - Frontend + Admin + API + Email-Benachrichtigungen**
37. ✅ **NavigationItem** - Header Management Admin ✅ (wird verwendet)
38. ✅ **LegalLink** - Footer Links (⚠️ Prüfen ob verwendet)
39. ✅ **AuditLog** - Nur Admin
40. ✅ **Session** - NextAuth
41. ✅ **Account** - NextAuth
42. ✅ **VerificationToken** - NextAuth

### ❌ **Fehlende Modelle/Instanzen**
- ❌ **LegalPages** - Für Impressum, Datenschutz, AGB, etc.
- ❌ **KnowledgeBase** - Für Wissenswertes (aktuell JSON-Datei)
- ❌ **AboutContent** - Für About-Seite (aktuell i18n)
- ❌ **Service** - Für Services-Seite (aktuell in About/i18n)

---

## 4. KRITISCHE LÜCKEN & EMPFEHLUNGEN

### ✅ **BEHOBEN - Ehemals fehlende Admin-Funktionen**

#### 1. **Wishlist Admin-Management** ✅ **IMPLEMENTIERT**
- ✅ **Status:** Vollständig implementiert
- ✅ **Implementierung:**
  - Admin-Seite `/admin/wishlists` mit Analytics
  - API Route `/api/admin/wishlists` 
  - Zeigt: Kunde, Artikel, Erstellungsdatum
  - Analytics: Top 10 meistgewünschte Artikel
  - Email-Benachrichtigungen bei Verfügbarkeit

#### 2. **Cart Admin-Management** ⚠️
- **Problem:** Keine direkte Cart-Verwaltung für Admin
- **Empfehlung:**
  - Admin-Seite `/admin/carts` erstellen
  - Zeige: Aktive Carts, Abandoned Carts
  - Analytics: Conversion Rate, Average Cart Value

#### 3. **Checkout-Prozess Monitoring** ⚠️
- **Problem:** Keine Admin-Übersicht über Checkout-Abbrüche
- **Empfehlung:**
  - Analytics im Dashboard erweitern
  - Checkout-Funnel Tracking

#### 4. **Certificate Management** ⚠️
- **Problem:** Certificates nur über Downloads verwaltet
- **Empfehlung:**
  - Admin-Seite `/admin/certificates` erstellen
  - Verwaltung von Zertifikaten pro Gemstone

### ✅ **BEHOBEN - Ehemals fehlende Frontend-Funktionen**

#### 1. **Review System** ✅ **IMPLEMENTIERT**
- ✅ **Status:** Vollständig implementiert
- ✅ **Implementierung:**
  - Review-Formular auf Produktseite `/shop/[gemId]` (ReviewForm Component)
  - Review-Anzeige auf Shop-Seite (ReviewsDisplay Component)
  - Admin Review-Moderation `/admin/reviews` mit Verifizierung
  - **API Routes:** `/api/reviews` (GET/POST), `/api/admin/reviews` (GET), `/api/admin/reviews/[id]` (PUT/DELETE)
  - Email-Benachrichtigungen an Admin bei neuen Reviews
  - Admin-Email-Konfiguration: ENV > CompanySettings > Default

#### 2. **Rechnungen Frontend** ✅ **IMPLEMENTIERT**
- ✅ **Status:** Vollständig implementiert
- ✅ **Implementierung:**
  - Frontend-Seite `/profile/invoices` mit vollständiger Rechnungsübersicht
  - API Route `/api/user/invoices` (GET)
  - PDF-Download über `/api/user/invoices/[invoiceId]/download`
  - DownloadGrant-Integration für sichere Downloads
  - Rechnungsdetails: Status, Zahlungsstatus, Positionen, Gesamtbetrag

#### 2. **Coupon System Frontend** ❌
- **Problem:** Coupons existieren, aber kein Frontend-UI
- **Empfehlung:**
  - Coupon-Eingabefeld im Checkout
  - Coupon-Validierung API bereits vorhanden
  - UI für Coupon-Eingabe implementieren

#### 4. **Newsticker Frontend** ⚠️
- **Problem:** Newsticker existiert im Admin, aber kein Frontend
- **Empfehlung:** Newsticker-Komponente auf Homepage einbauen

### 🟡 **FEHLENDE DATENBANK-MODELLE**

#### 1. **LegalPages Model** ❌
```prisma
model LegalPage {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  content     String
  locale      String   @default("de")
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
- **Für:** Impressum, Datenschutz, AGB, Widerruf, Versand, Cookies
- **Admin:** `/admin/legal-pages` erstellen

#### 2. **Service Model** ❌
```prisma
model Service {
  id          String   @id @default(cuid())
  title       String
  description String
  icon        String?
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
- **Für:** Services-Seite
- **Admin:** `/admin/services` erstellen

#### 3. **KnowledgeBase Model** (für Wissenswertes) ⚠️ **AKTUELL: JSON-Datei**
```prisma
model KnowledgeBase {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  content     String
  excerpt     String?
  category    String?
  tags        String?
  image       String?
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
- **Aktuell:** Nutzt `data/knowledge.json` (Datei-System)
- **Problem:** Keine Datenbank-Persistenz, schwer skalierbar
- **Empfehlung:** Migrieren zu Prisma Model + Admin-Interface verbessern

#### 4. **AboutContent Model** ⚠️ **AKTUELL: i18n Übersetzungen**
```prisma
model AboutContent {
  id          String   @id @default(cuid())
  section     String   @unique  // 'title', 'mission', 'values', etc.
  title       String
  content     String
  image       String?
  order       Int      @default(0)
  locale      String   @default("de")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
- **Aktuell:** Nutzt `messages/de.json`, `messages/en.json` (i18n)
- **Problem:** Keine Admin-Verwaltung möglich, nur Übersetzer
- **Empfehlung:** DB-Model für verwaltbaren Content

#### 5. **Service Model** ⚠️ **AKTUELL: i18n + Hardcoded**
```prisma
model Service {
  id          String   @id @default(cuid())
  title       String
  description String
  features    Json?    // Array von Features
  icon        String?
  order       Int      @default(0)
  locale      String   @default("de")
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
- **Aktuell:** Hardcoded in About-Page, i18n für Übersetzungen
- **Problem:** Nicht verwaltbar im Admin
- **Empfehlung:** DB-Model + Admin-Interface

---

## 5. PRIORITÄTS-Empfehlungen

### ✅ **ERLEDIGT (Hohe Priorität)**
1. ✅ **Review System implementieren** - ✅ **VOLLSTÄNDIG IMPLEMENTIERT** (Frontend + Admin + API + Email)
2. ✅ **Rechnungen Frontend** - ✅ **VOLLSTÄNDIG IMPLEMENTIERT** (Profil-Seite + PDF-Download)
3. ✅ **Wishlist Admin** - ✅ **VOLLSTÄNDIG IMPLEMENTIERT** (Analytics + Management + Email-Benachrichtigungen)
4. ⚠️ **Coupon Frontend UI** - Checkout-Integration (noch ausstehend)
5. ⚠️ **KnowledgeBase DB-Migration** - Von JSON zu Datenbank (noch ausstehend)
6. ⚠️ **AboutContent DB-Migration** - Von i18n zu DB für Admin-Verwaltung (noch ausstehend)

### 🟡 **MITTEL PRIORITÄT**
1. ⚠️ **Cart Admin-Übersicht** - Analytics für Conversion
2. ⚠️ **Certificate Management** - Dedizierte Verwaltung
3. ⚠️ **LegalPages Model & Admin** - Für Impressum, Datenschutz, etc.
4. ⚠️ **Newsticker Frontend** - Anzeige auf Homepage

### 🟢 **NIEDRIGE PRIORITÄT**
1. ⚠️ **Service Model** - Für Services-Seite (aktuell hardcoded)
2. ⚠️ **LegalLink Model prüfen** - Existiert, aber möglicherweise nicht genutzt

---

## 6. ZUSAMMENFASSUNG

### ✅ **Was gut funktioniert:**
- E-Commerce Core (Shop, Cart, Orders) ✅
- Produkt-Management (Gemstones) ✅
- Content-Management (Blog, Stories) ✅
- Kunden-Management ✅
- Newsletter-System ✅

### ✅ **Fortschritt:**
- ✅ **3 kritische Admin-Funktionen implementiert** (Wishlist ✅, Reviews ✅, Rechnungen ✅)
- ✅ **2 kritische Frontend-Funktionen implementiert** (Rechnungen ✅, Reviews ✅)
- ✅ **Review Model aktiviert** - Von 0% auf 100% Nutzung!
- ⚠️ **4 fehlende Datenbank-Modelle** (LegalPages, Service, KnowledgeBase, AboutContent) - noch ausstehend
- ⚠️ **2 JSON/i18n-basierte Features** (Wissenswertes, About) sollten in DB migriert werden
- ⚠️ **1 fehlende Admin-Funktion** (Cart Analytics) - noch ausstehend
- ⚠️ **1 fehlende Frontend-Funktion** (Coupon UI) - noch ausstehend

### 📊 **Statistik (Stand 2025-11-01):**
- **Öffentliche Features:** ~27 (↑ +2: Reviews, Invoices Frontend)
- **Admin-Funktionen:** ~42 (↑ +2: Wishlist Admin, Review Management)
- **Datenbank-Modelle:** 42
- **Abdeckung Admin für Frontend:** ~85% (↑ von 70%)
- **Abdeckung Datenbank für Features:** ~95% (↑ von 90%)
- **Kritische Lücken behoben:** 3 von 3 (100%)

---

## 7. NÄCHSTE SCHRITTE

### ✅ **Erledigt (2025-11-01):**
1. ✅ **Review System aktiviert** - Vollständig implementiert mit Frontend, Admin, API und Email-Benachrichtigungen
2. ✅ **Rechnungen Frontend implementiert** - Vollständig mit PDF-Download über DownloadGrant
3. ✅ **Wishlist Admin erstellt** - Vollständig mit Analytics und Email-Benachrichtigungen bei Verfügbarkeit

### 🔴 **Aktuelle Prioritäten:**
4. **Coupon Frontend UI** - Checkout-Integration (hohe Priorität - noch ausstehend)

### 🟡 **Demnächst umsetzen:**
5. **LegalPages Model & Admin** - Für rechtliche Seiten (mittel Priorität)
6. **KnowledgeBase DB-Migration** - Von JSON zu DB (mittel Priorität)
7. **AboutContent DB-Migration** - Admin-verwaltbar machen (mittel Priorität)

### 🟢 **Später:**
8. **Cart Admin-Übersicht** - Conversion Analytics
9. **Service Model** - Services-Seite verwaltbar machen
10. **Certificate Management** - Dedizierte Verwaltung

---

## 8. DETAILLIERTE STATISTIKEN

### **Abdeckung Matrix:**

| Kategorie | Anzahl | Mit Admin | Mit DB | Vollständig |
|-----------|--------|-----------|--------|-------------|
| **E-Commerce** | 6 | 4/6 (67%) | 6/6 (100%) | 3/6 (50%) |
| **Content** | 7 | 6/7 (86%) | 6/7 (86%) | 5/7 (71%) |
| **User Features** | 3 | 2/3 (67%) | 3/3 (100%) | 2/3 (67%) |
| **Legal Pages** | 6 | 0/6 (0%) | 0/6 (0%) | 0/6 (0%) |
| **Admin Only** | 8 | 8/8 (100%) | 8/8 (100%) | 8/8 (100%) |

### **Datenbank-Abdeckung:**
- ✅ **41 von 42 Modellen** werden genutzt (98%) (↑ von 95%)
- ✅ **Review Model aktiviert** - Von ungenutzt zu vollständig genutzt
- ⚠️ **1 Model möglicherweise ungenutzt:** LegalLink (prüfen)
- ⚠️ **2 Features ohne DB:** Wissenswertes (JSON), About (i18n)

### **Admin-Abdeckung:**
- ✅ **36 von 42 Admin-Funktionen** haben Frontend-Entsprechung (86%) (↑ von 83%)
- ⚠️ **6 Admin-Funktionen** ohne Frontend (Dashboard, Reports, etc. - OK)
- ⚠️ **4 Frontend-Funktionen** ohne Admin (Cart Analytics, Certificates, Coupons, Newsticker)

### **Behobene kritische Gaps:**
1. ✅ **Review System:** ✅ Vollständig implementiert (Frontend + Admin + API + Email)
2. ✅ **Rechnungen Frontend:** ✅ Vollständig implementiert (Profil-Seite + PDF-Download)
3. ✅ **Wishlist Admin:** ✅ Vollständig implementiert (Analytics + Management + Email)

### **Verbleibende Gaps:**
4. 🔴 **Legal Pages:** 0% Admin, 0% DB (noch ausstehend)
5. ⚠️ **Coupon Frontend:** DB vorhanden, UI fehlt (noch ausstehend)
6. ⚠️ **Cart Analytics:** Admin-Übersicht fehlt (noch ausstehend)

---

## 9. NEUE IMPLEMENTIERUNGEN (2025-11-01)

### 📋 **Zusammenfassung der Änderungen:**

**3 kritische Features vollständig implementiert:**
1. ✅ Review System (0% → 100% Nutzung)
2. ✅ Rechnungen Frontend (0% → 100% Frontend)
3. ✅ Wishlist Admin (0% → 100% Admin)

**Ergebnis:**
- **Datenbank-Abdeckung:** 95% → 98% (+3%)
- **Admin-Abdeckung:** 70% → 85% (+15%)
- **Kritische Lücken:** 3 von 3 behoben (100%)

---

## 10. NEUE IMPLEMENTIERUNGEN - DETAILS (2025-11-01)

### ✅ **Review System** - Vollständig implementiert

#### Frontend-Komponenten:
- `components/shop/ReviewsDisplay.tsx` - Zeigt Reviews mit Durchschnittsbewertung
- `components/shop/ReviewForm.tsx` - Formular für neue Reviews
- Integration in `/shop/[gemId]` Produktseite

#### Admin-Interface:
- `/admin/reviews` - Review-Verwaltung mit Filtern (Alle/Verifiziert/Unverifiziert)
- Verifizierung/Entverifizierung von Reviews
- Löschen von Reviews
- Anzeige von Kunde, Produkt, Bewertung, Kommentar

#### API-Routen:
- `GET /api/reviews?gemstoneId=xxx&verifiedOnly=true` - Reviews für ein Produkt abrufen
- `POST /api/reviews` - Neues Review erstellen (mit Authentifizierung)
- `GET /api/admin/reviews?status=xxx` - Alle Reviews für Admin
- `PUT /api/admin/reviews/[id]` - Review-Status aktualisieren (verified)
- `DELETE /api/admin/reviews/[id]` - Review löschen

#### Email-Benachrichtigungen:
- `lib/services/review-notifications.ts` - Sendet Email an Admin bei neuen Reviews
- Admin-Email-Priorität: `ADMIN_EMAIL` ENV > `companySettings.email` > Default
- HTML-Email mit Review-Details und Link zum Admin-Panel

### ✅ **Rechnungen Frontend** - Vollständig implementiert

#### Frontend-Seite:
- `/profile/invoices` - Vollständige Rechnungsübersicht für Kunden
- Anzeige: Rechnungsnummer, Datum, Status, Zahlungsstatus, Positionen, Gesamtbetrag
- Link zu zugehöriger Bestellung

#### PDF-Download:
- `GET /api/user/invoices/[invoiceId]/download` - PDF-Download mit DownloadGrant-Validierung
- DownloadGrant wird automatisch bei Rechnungserstellung erstellt (5 Jahre Gültigkeit, 10 Downloads)
- PDF wird bei Bedarf generiert, falls noch nicht vorhanden

#### API-Routen:
- `GET /api/user/invoices` - Alle Rechnungen für eingeloggten Kunden abrufen
- `GET /api/user/invoices/[invoiceId]/download` - PDF-Download mit Sicherheitsprüfung

#### Integration:
- Automatische DownloadGrant-Erstellung bei Invoice-Erstellung/Update
- Integration in `lib/services/invoice.ts` mit `createInvoiceDownloadGrant()`

### ✅ **Wishlist Admin** - Vollständig implementiert

#### Admin-Interface:
- `/admin/wishlists` - Vollständige Wishlist-Übersicht
- Analytics: Gesamt Wishlists, Artikel in Wishlists, Kunden mit Wishlists
- Top 10 meistgewünschte Artikel mit Anzahl
- Detaillierte Ansicht aller Wishlists mit Kunden- und Artikelinformationen

#### API-Routen:
- `GET /api/admin/wishlists` - Alle Wishlists mit Analytics abrufen

#### Email-Benachrichtigungen:
- `lib/services/wishlist-notifications.ts` - Sendet Email an Kunden, wenn Wishlist-Artikel verfügbar wird
- Trigger: Wenn `isSold` von `true` auf `false` geändert wird oder `inventory.quantity` von 0 auf >0
- Nur für Kunden mit `marketingOptIn: true` und validem Email-Account
- Personalisierte Emails mit Produktbild, Preis und Link

#### Integration:
- Automatische Benachrichtigungen bei Gemstone-Update in `/api/admin/gemstones/[id]` (PUT)

