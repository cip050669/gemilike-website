# Troubleshooting Guide

Häufige Probleme und deren Lösungen.

---

## ✅ Hydration Errors

### Problem
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```

### Ursache
Dieser Fehler tritt auf, wenn Server-Side Rendering (SSR) und Client-Side Rendering unterschiedliche Ausgaben produzieren. Häufige Ursachen:
- Verwendung von `localStorage` oder `sessionStorage` während des initialen Renders
- Zeitabhängige Werte (z.B. `new Date()`)
- Random-Werte
- Browser-spezifische APIs

### Lösung
**Bereits implementiert in diesem Projekt:**

1. **Cookie-Banner** (`components/layout/CookieBanner.tsx`):
   - Verwendet `mounted` State
   - Rendert erst nach Client-Mount

2. **Warenkorb-Badge** (`components/layout/Header.tsx`):
   - Zeigt Badge erst nach `mounted === true`
   - Verhindert SSR/Client Mismatch

**Pattern für eigene Komponenten:**
```typescript
'use client';

import { useState, useEffect } from 'react';

export function MyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Verhindere Rendering bis Client gemountet ist
  if (!mounted) return null;

  // Oder bedingtes Rendering:
  return (
    <div>
      {mounted && <ClientOnlyContent />}
    </div>
  );
}
```

---

## 🔌 Port bereits belegt

### Problem
```
Port 3000 is in use
```

### Lösung
Next.js wählt automatisch einen anderen Port (z.B. 3002). Prüfen Sie die Terminal-Ausgabe:
```
- Local:        http://localhost:3002
```

**Manuell Port freigeben:**
```bash
# Port-Nutzung prüfen
lsof -i :3000

# Prozess beenden
kill -9 <PID>
```

---

## 🗂️ 404 Not Found

### Problem
Alle Seiten zeigen 404-Fehler.

### Lösung

**1. Cache löschen:**
```bash
rm -rf .next
npm run dev
```

**2. Prüfen Sie die Ordnerstruktur:**
```bash
ls -la app/[locale]/
# Sollte zeigen: page.tsx, about/, blog/, etc.
```

**3. Middleware prüfen:**
Stellen Sie sicher, dass `middleware.ts` existiert und korrekt konfiguriert ist.

---

## 💥 Build-Fehler

### Problem
```
npm run build
# Fehler bei TypeScript oder ESLint
```

### Lösung

**TypeScript-Fehler:**
```bash
# Prüfen Sie die Fehlerausgabe
npm run build

# Häufige Fixes:
# 1. Dependencies aktualisieren
npm install

# 2. Type-Definitionen prüfen
# Öffnen Sie die angegebene Datei und beheben Sie Type-Errors
```

**ESLint-Fehler:**
```bash
# Lint-Check
npm run lint

# Auto-Fix (wo möglich)
npm run lint -- --fix
```

---

## 🎨 Styles werden nicht geladen

### Problem
CSS-Styles werden nicht angewendet.

### Lösung

**1. Tailwind-Konfiguration prüfen:**
```bash
# Stellen Sie sicher, dass globals.css importiert ist
# in app/[locale]/layout.tsx
```

**2. Cache löschen:**
```bash
rm -rf .next
npm run dev
```

**3. Browser-Cache leeren:**
- Chrome/Edge: `Strg + Shift + R`
- Firefox: `Strg + F5`
- Safari: `Cmd + Shift + R`

---

## 🌍 Übersetzungen fehlen

### Problem
Texte werden nicht übersetzt oder zeigen Platzhalter.

### Lösung

**1. Prüfen Sie messages-Dateien:**
```bash
# Dateien müssen existieren:
ls messages/
# de.json  en.json
```

**2. Prüfen Sie i18n.ts:**
```typescript
// Sollte locale zurückgeben:
return {
  locale,
  messages: (await import(`./messages/${locale}.json`)).default,
};
```

**3. Verwenden Sie useTranslations korrekt:**
```typescript
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('nav');
  return <div>{t('home')}</div>;
}
```

---

## 🛒 Warenkorb speichert nicht

### Problem
Artikel im Warenkorb gehen nach Reload verloren.

### Lösung

**1. LocalStorage prüfen:**
```javascript
// Browser Console (F12):
localStorage.getItem('cart-storage')
```

**2. Zustand Persist prüfen:**
Der Store in `lib/store/cart.ts` verwendet `persist` Middleware - sollte automatisch funktionieren.

**3. Private/Incognito Mode:**
LocalStorage funktioniert nicht im Private/Incognito Mode mancher Browser.

---

## 📧 Kontaktformular sendet nicht

### Problem
Formular wird abgeschickt, aber keine E-Mail kommt an.

### Lösung

**Aktueller Status:**
Das Formular loggt nur in die Console. E-Mail-Versand muss noch eingerichtet werden.

**Siehe NEXT_STEPS.md Schritt 3** für:
- Formspree-Integration
- Nodemailer-Setup
- SendGrid-Integration

---

## 🖼️ Bilder werden nicht angezeigt

### Problem
Bilder zeigen 404 oder werden nicht geladen.

### Lösung

**1. Pfad prüfen:**
```typescript
// Richtig:
<Image src="/logo.png" alt="Logo" width={150} height={40} />

// Falsch:
<Image src="logo.png" ... />  // Fehlt führendes /
```

**2. Datei existiert:**
```bash
ls public/logo.png
```

**3. Next.js Image-Optimierung:**
Für externe Bilder muss `next.config.ts` konfiguriert sein:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'example.com',
    },
  ],
}
```

---

## 🚀 Deployment-Probleme

### Problem
Website funktioniert lokal, aber nicht auf Strato.

### Lösung

**1. Static Export:**
```bash
# In next.config.ts:
output: 'export',
images: {
  unoptimized: true,
}

# Build:
npm run build

# Upload out/ Ordner
```

**2. .htaccess prüfen:**
Siehe DEPLOYMENT.md für korrekte .htaccess-Konfiguration.

**3. Pfade prüfen:**
Alle Pfade müssen relativ sein für Static Export.

---

## 🐌 Performance-Probleme

### Problem
Website lädt langsam.

### Lösung

**1. Lighthouse-Audit:**
```bash
# Chrome DevTools → Lighthouse → Generate Report
```

**2. Bilder optimieren:**
```bash
# Verwenden Sie WebP-Format
# Komprimieren Sie Bilder (TinyPNG, Squoosh)
# Nutzen Sie Next.js Image-Komponente
```

**3. Bundle-Größe prüfen:**
```bash
npm run build
# Prüfen Sie die Ausgabe für große Chunks
```

---

## 🔒 CORS-Fehler

### Problem
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

### Lösung

**Für API-Routes:**
```typescript
// app/api/your-route/route.ts
export async function POST(request: Request) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Oder spezifische Domain
    },
  });
}
```

---

## 📱 Mobile-Ansicht kaputt

### Problem
Layout sieht auf Mobile nicht gut aus.

### Lösung

**1. Viewport Meta-Tag:**
Bereits in Layout vorhanden:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

**2. Responsive Classes prüfen:**
```typescript
// Verwenden Sie Tailwind Breakpoints:
className="text-sm md:text-base lg:text-lg"
```

**3. Mobile testen:**
- Chrome DevTools → Device Toolbar (Strg+Shift+M)
- Echtes Gerät testen

---

## 🔍 SEO-Probleme

### Problem
Website wird nicht von Google gefunden.

### Lösung

**1. Sitemap:**
```bash
# Erstellen Sie app/sitemap.ts
# Siehe NEXT_STEPS.md Schritt 7
```

**2. robots.txt:**
```bash
# public/robots.txt erstellen:
User-agent: *
Allow: /
Sitemap: https://gemilike.de/sitemap.xml
```

**3. Meta-Tags:**
Prüfen Sie `app/[locale]/layout.tsx` für korrekte Meta-Tags.

---

## 🆘 Weitere Hilfe

Wenn Ihr Problem hier nicht aufgeführt ist:

1. **Prüfen Sie die Browser-Console** (F12)
2. **Prüfen Sie die Terminal-Ausgabe**
3. **Lesen Sie die Next.js Docs:** https://nextjs.org/docs
4. **Suchen Sie auf Stack Overflow**
5. **Prüfen Sie GitHub Issues** des verwendeten Packages

---

## 📝 Logs sammeln

Für Debugging:

```bash
# Development mit ausführlichen Logs:
npm run dev 2>&1 | tee debug.log

# Build mit Logs:
npm run build 2>&1 | tee build.log
```

---

**Letzte Aktualisierung:** 01.10.2025
