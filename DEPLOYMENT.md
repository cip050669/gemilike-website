# Deployment-Anleitung für Strato

**Version:** 1.2.0  
**Datum:** 03. Oktober 2025  
**Status:** ✅ Vollständig funktionsfähig mit Admin-Panel

## Voraussetzungen

- FTP-Zugang zu Ihrem Strato-Hosting
- Domain `gemilike.de` und/oder `gemilike.com` bei Strato registriert
- Node.js lokal installiert (für Build-Prozess)
- **Wichtig:** Admin-Panel funktioniert nur mit Node.js Hosting (nicht mit Static Export)

## Schritt-für-Schritt Anleitung

### 1. Projekt vorbereiten

```bash
# In das Projektverzeichnis wechseln
cd /home/cip050669/CascadeProjects/gemilike-website

# Dependencies installieren (falls noch nicht geschehen)
npm install
```

### 2. Deployment-Option wählen

#### Option A: Static Export (ohne Admin-Panel)
Für einfache Websites ohne Admin-Panel:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Wichtig für static export
  },
};
```

#### Option B: Node.js Hosting (mit Admin-Panel) - EMPFOHLEN
Für vollständige Funktionalität mit Admin-Panel:

```typescript
const nextConfig: NextConfig = {
  // Keine output: 'export' - Standard Next.js
  images: {
    domains: ['your-domain.com'],
  },
};
```

### 3. Build erstellen

#### Für Static Export:
```bash
npm run build
```
Dies erstellt einen `out/` Ordner mit allen statischen Dateien.

#### Für Node.js Hosting:
```bash
npm run build
```
Dies erstellt einen `.next/` Ordner für die Produktion.

### 4. Deployment zu Strato

#### Option A: Static Export (FTP-Upload)

**FTP-Upload für Static Export:**

1. FileZilla herunterladen und installieren
2. FTP-Verbindung einrichten:
   - Host: `ftp.strato.de` oder Ihre spezifische FTP-Adresse
   - Benutzername: Ihr Strato FTP-Benutzername
   - Passwort: Ihr FTP-Passwort
   - Port: 21

3. Verbinden und navigieren Sie zu Ihrem Web-Verzeichnis (meist `/` oder `/html/`)

4. Laden Sie den **gesamten Inhalt** des `out/` Ordners hoch (nicht den Ordner selbst!)

#### Option B: Node.js Hosting (mit Admin-Panel) - EMPFOHLEN

**Vollständige Projekt-Upload:**

1. **Alle Projektdateien** via FTP/SFTP hochladen (außer `node_modules/`)
2. **Auf dem Server:**
   ```bash
   npm install --production
   npm start
   ```

3. **PM2 für Prozess-Management** (empfohlen):
   ```bash
   npm install -g pm2
   pm2 start npm --name "gemilike" -- start
   pm2 save
   pm2 startup
   ```

**Wichtige Dateien für Node.js Hosting:**
- `package.json` ✅
- `next.config.ts` ✅
- `app/` Ordner ✅
- `components/` Ordner ✅
- `lib/` Ordner ✅
- `public/` Ordner ✅
- `messages/` Ordner ✅
- `.env.local` (Umgebungsvariablen) ✅

### 5. .htaccess für URL-Routing erstellen

Erstellen Sie eine `.htaccess` Datei im Root-Verzeichnis auf dem Server:

```apache
# Aktiviere Rewrite Engine
RewriteEngine On

# HTTPS erzwingen
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Entferne .html Endungen
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ $1.html [L,QSA]

# Fallback für SPA-Routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L,QSA]

# Kompression aktivieren
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

### 6. Domain-Konfiguration in Strato

1. Loggen Sie sich in Ihren Strato-Kundenbereich ein
2. Navigieren Sie zu "Domains" → "Domain-Verwaltung"
3. Stellen Sie sicher, dass beide Domains auf das richtige Verzeichnis zeigen
4. Aktivieren Sie SSL/HTTPS für beide Domains

### 7. SSL-Zertifikat aktivieren

1. Im Strato-Kundenbereich: "SSL-Verwaltung"
2. "Let's Encrypt" Zertifikat für beide Domains aktivieren
3. Warten Sie 5-10 Minuten bis das Zertifikat aktiv ist

### 8. Testen

Besuchen Sie:
- https://gemilike.de
- https://gemilike.com
- https://gemilike.de/en (englische Version)
- https://gemilike.de/shop
- https://gemilike.de/blog
- https://gemilike.de/contact
- **https://gemilike.de/admin** (Admin-Panel - nur bei Node.js Hosting)

## Wichtige Hinweise

### Mehrsprachigkeit

Die Website unterstützt automatisch DE und EN:
- `gemilike.de` → Deutsche Standardversion
- `gemilike.de/en` → Englische Version

### E-Mail-Funktionalität

Das Kontaktformular benötigt eine Server-seitige E-Mail-Lösung. Für Static Export:

**Option 1: Formspree** (einfach)
```typescript
// In contact/page.tsx
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  body: JSON.stringify(formData),
  headers: { 'Content-Type': 'application/json' }
});
```

**Option 2: EmailJS** (kostenlos)
1. Account bei emailjs.com erstellen
2. Template einrichten
3. JavaScript SDK einbinden

**Option 3: Strato Mail-API** (falls verfügbar)
Kontaktieren Sie Strato Support für API-Zugang

### Analytics einrichten

1. Google Analytics Account erstellen
2. Tracking-ID erhalten
3. In `app/[locale]/layout.tsx` einfügen:

```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

### Updates deployen

Bei Änderungen:
```bash
npm run build
# Upload des neuen out/ Ordners via FTP
```

## Troubleshooting

### Problem: 404 Fehler bei Unterseiten

**Lösung:** Überprüfen Sie die `.htaccess` Datei

### Problem: Bilder werden nicht angezeigt

**Lösung:** Stellen Sie sicher, dass `images.unoptimized: true` in `next.config.ts` gesetzt ist

### Problem: CSS wird nicht geladen

**Lösung:** Überprüfen Sie, dass alle Dateien aus `out/_next/` hochgeladen wurden

### Problem: Kontaktformular funktioniert nicht

**Lösung:** Static Export unterstützt keine API Routes. Nutzen Sie einen externen Service (siehe oben)

### Problem: Admin-Panel funktioniert nicht

**Lösung:** Admin-Panel benötigt Node.js Hosting. Wechseln Sie zu Option B (Node.js Hosting) oder nutzen Sie Static Export ohne Admin-Panel

## Performance-Optimierung

1. **Bilder komprimieren** vor dem Upload
2. **Lazy Loading** ist bereits implementiert
3. **CDN nutzen** (optional): Cloudflare vor Strato schalten

## Backup

Erstellen Sie regelmäßig Backups:
```bash
# Lokales Backup
tar -czf gemilike-backup-$(date +%Y%m%d).tar.gz out/

# Download vom Server via FTP
```

## Support

Bei Problemen:
- Strato Support: https://www.strato.de/faq/
- Next.js Docs: https://nextjs.org/docs
- Projekt-README: siehe README.md
