# Gemilike - Heroes in Gems

Eine vollständige E-Commerce-Website für Edelsteinhandel mit modernen Web-Technologien.

## 🚀 Features

### ✅ E-Commerce-System
- **Warenkorb** mit Zustandsmanagement (Zustand)
- **Checkout-Prozess** mit Adressverwaltung
- **Shop-Seite** mit Produktkatalog und Filtern
- **Wunschliste** pro Benutzer

### ✅ Admin-Panel
- **Dashboard** mit echten Daten aus der Datenbank
- **Produktverwaltung** (Edelsteine)
- **Kundenverwaltung** mit Notizen und Tags
- **Bestellverwaltung** mit Status-Tracking
- **Rechnungsanwendung** für Kleinunternehmer

### ✅ Benutzer-Authentifizierung
- **NextAuth.js** Integration
- **Benutzerprofile** mit Adressverwaltung
- **Session-Management**

### ✅ Newsletter-System
- **Newsletter-API** mit Abonnenten-Verwaltung
- **E-Mail-Versand** mit SMTP-Integration
- **Kontaktformular** mit E-Mail-Benachrichtigungen

### ✅ Rechtliche Seiten
- **Impressum**, **Datenschutz**, **AGB**
- **Cookie-Banner** mit DSGVO-Konformität

### ✅ Design & UX
- **Responsive Design** mit Tailwind CSS
- **Ursprüngliches Farbschema** (Orange-Rot, Cyan, Gold)
- **Hero-Section** mit Logo-Gradienten
- **Impact-Schriftart** für Branding

## 🛠️ Technologie-Stack

- **Next.js 15** mit App Router
- **TypeScript** für Typsicherheit
- **Prisma** als ORM mit SQLite
- **NextAuth.js** für Authentifizierung
- **Tailwind CSS** für Styling
- **Zustand** für State Management
- **Lucide React** für Icons

## 📦 Installation

```bash
# Repository klonen
git clone https://github.com/username/gemilike-website.git
cd gemilike-website

# Dependencies installieren
npm install

# Datenbank initialisieren
npx prisma generate
npx prisma db push

# Entwicklungsserver starten
npm run dev
```

## 🌐 Verfügbare Routen

- `/` → Weiterleitung zu `/de`
- `/de` → Homepage mit Hero-Section
- `/de/shop` → E-Commerce Shop
- `/de/admin` → Admin-Panel
- `/de/profile` → Benutzerprofile
- `/de/checkout` → Checkout-Prozess
- `/de/contact` → Kontaktformular

## 📊 Datenbank-Schema

Das Projekt verwendet Prisma mit einem umfangreichen Schema für:
- **Benutzer** und Authentifizierung
- **Edelsteine** und Produktvarianten
- **Bestellungen** und Warenkorb
- **Rechnungen** für Kleinunternehmer
- **Newsletter-Abonnenten**
- **Audit-Logs** für Admin-Aktivitäten

## 🔧 Konfiguration

### Umgebungsvariablen
Erstellen Sie eine `.env.local` Datei:

```env
# Datenbank
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# E-Mail (optional)
SMTP_HOST="your-smtp-host"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASS="your-password"
```

## 📈 Status

**Alle 7 geplanten TODOs erfolgreich implementiert:**

1. ✅ **Datenbank-Integration** (Prisma) konfiguriert
2. ✅ **Vollständiges Admin-Panel** implementiert
3. ✅ **Rechnungsanwendung** für Kleinunternehmer
4. ✅ **Benutzer-Authentifizierung** mit NextAuth.js
5. ✅ **Benutzerprofile** mit Adressverwaltung
6. ✅ **Alle Features** getestet und funktionsfähig
7. ✅ **GitHub-Tracking** eingerichtet

## 🚀 Deployment

Die Website ist bereit für Deployment auf:
- **Vercel** (empfohlen für Next.js)
- **Netlify**
- **Railway**
- **Heroku**

## 📝 Lizenz

Dieses Projekt ist für den kommerziellen Einsatz im Edelsteinhandel entwickelt.

## 🤝 Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im GitHub-Repository.

---

**Gemilike - Heroes in Gems** 🎯
*Ihr Spezialist für rohe und geschliffene Edelsteine*