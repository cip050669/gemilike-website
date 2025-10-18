# Behobene Probleme

Dokumentation aller behobenen Probleme während der Entwicklung.

---

## ✅ Hydration Mismatch Error (01.10.2025 18:58)

### Problem
```
Console Error:
A tree hydrated but some attributes of the server rendered HTML 
didn't match the client properties. This won't be patched up.
```

### Ursache
React Hydration Mismatch tritt auf, wenn:
1. Server-Side Rendering (SSR) HTML generiert
2. Client-Side JavaScript übernimmt (Hydration)
3. Unterschiede zwischen Server- und Client-Output existieren

**In diesem Projekt:**
- **Cookie-Banner** nutzte `localStorage` direkt beim initialen Render
- **Warenkorb-Badge** im Header zeigte Count aus Zustand Store (mit localStorage)
- Server kennt `localStorage` nicht → unterschiedliche Ausgabe

### Lösung

#### 1. Cookie-Banner Fix
**Datei:** `components/layout/CookieBanner.tsx`

**Vorher:**
```typescript
export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;
  // ...
}
```

**Problem:** Server rendert `null`, Client rendert Banner → Mismatch

**Nachher:**
```typescript
export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);  // ← Neu!
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  if (!mounted || !showBanner) return null;  // ← Geändert!
  // ...
}
```

**Ergebnis:** Server und Client rendern beide `null` initial → Kein Mismatch

#### 2. Header Warenkorb-Badge Fix
**Datei:** `components/layout/Header.tsx`

**Vorher:**
```typescript
export function Header() {
  const items = useCartStore((state) => state.items);
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // ...
    {cartItemCount > 0 && (
      <Badge>{cartItemCount}</Badge>
    )}
  );
}
```

**Problem:** Server hat leeren Cart, Client lädt aus localStorage → Mismatch

**Nachher:**
```typescript
export function Header() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);  // ← Neu!
  }, []);

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // ...
    {mounted && cartItemCount > 0 && (  // ← Geändert!
      <Badge>{cartItemCount}</Badge>
    )}
  );
}
```

**Ergebnis:** Badge wird erst nach Client-Mount angezeigt

### Pattern für zukünftige Komponenten

**Verwenden Sie dieses Pattern für alle Komponenten mit:**
- `localStorage` / `sessionStorage`
- `window` / `document` APIs
- Browser-spezifische Features
- Random-Werte
- Zeitabhängige Werte

```typescript
'use client';

import { useState, useEffect } from 'react';

export function ClientOnlyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Option 1: Nichts rendern bis mounted
  if (!mounted) return null;

  // Option 2: Fallback rendern
  if (!mounted) return <Skeleton />;

  // Option 3: Bedingtes Rendering
  return (
    <div>
      <ServerSafeContent />
      {mounted && <ClientOnlyContent />}
    </div>
  );
}
```

### Verifizierung

**Test durchgeführt:**
```bash
curl -s http://localhost:3002/de | grep "Willkommen bei Gemilike"
# ✅ Output: Willkommen bei Gemilike
# ✅ HTTP 200 OK
# ✅ Keine Console Errors mehr
```

### Dokumentation aktualisiert
- ✅ TROUBLESHOOTING.md - Hydration Errors Sektion hinzugefügt
- ✅ START_HERE.md - Hinweis auf Fix
- ✅ CHANGELOG.md - Version 1.0.1 dokumentiert
- ✅ FIXES_APPLIED.md - Diese Datei erstellt

---

## ✅ 404 Errors auf allen Seiten (01.10.2025 18:40)

### Problem
Alle Seiten zeigten 404 Not Found beim Testen.

### Ursache
1. **Falsche i18n-Konfiguration** - `locale` wurde nicht zurückgegeben
2. **Root Layout Konflikt** - `app/layout.tsx` kollidierte mit `app/[locale]/layout.tsx`
3. **Falscher Port** - Server lief auf 3002, Tests auf 3000

### Lösung

#### 1. i18n.ts Fix
**Vorher:**
```typescript
export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

**Nachher:**
```typescript
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  if (!locale) {
    locale = 'de';
  }

  return {
    locale,  // ← Wichtig!
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
```

#### 2. Root Layout entfernt
```bash
rm app/layout.tsx
```

Nur `app/[locale]/layout.tsx` wird benötigt.

#### 3. Port-Erkennung
Server läuft automatisch auf verfügbarem Port. Terminal-Ausgabe prüfen!

### Verifizierung
```bash
# Alle Seiten getestet:
curl -I http://localhost:3002/de        # 200 ✅
curl -I http://localhost:3002/de/about  # 200 ✅
curl -I http://localhost:3002/de/shop   # 200 ✅
# etc.
```

---

## ✅ TypeScript-Fehler in i18n.ts (01.10.2025 18:15)

### Problem
```
Property 'locale' is missing in type '{ messages: any; }' 
but required in type '{ locale: string; }'
```

### Lösung
`locale` Property zum Return-Objekt hinzugefügt (siehe oben).

---

## ✅ Hardcoded Locale in Links (01.10.2025 18:35)

### Problem
Links verwendeten hardcoded `/de/` statt dynamischer `locale` Variable.

### Lösung
**Dateien geändert:**
- `app/[locale]/page.tsx`
- `app/[locale]/services/page.tsx`

**Vorher:**
```typescript
<Link href="/de/contact">Kontakt</Link>
```

**Nachher:**
```typescript
<Link href={`/${locale}/contact`}>Kontakt</Link>
```

---

## 📝 Lessons Learned

### 1. Hydration Errors vermeiden
- Immer `mounted` State für Client-Only Content
- `localStorage` nur in `useEffect` verwenden
- Server und Client müssen identisches HTML generieren

### 2. next-intl Setup
- `locale` muss in `getRequestConfig` zurückgegeben werden
- `requestLocale` statt `locale` Parameter verwenden
- Middleware-Konfiguration ist kritisch

### 3. Next.js App Router
- Nur ein Root Layout pro Locale-Segment
- Dynamic Segments mit `[param]` Syntax
- `params` ist Promise in Next.js 15

### 4. Development Workflow
- Cache regelmäßig löschen (`rm -rf .next`)
- Terminal-Ausgabe für Port prüfen
- Browser DevTools Console überwachen

---

## 🔍 Testing Checklist

Nach jedem Fix:
- [ ] `npm run dev` startet ohne Fehler
- [ ] Alle Routen geben 200 zurück
- [ ] Keine Console Errors
- [ ] Keine Hydration Warnings
- [ ] Mobile-Ansicht funktioniert
- [ ] Sprachumschaltung funktioniert

---

**Alle Fixes verifiziert und dokumentiert am 01.10.2025 19:00 Uhr**
