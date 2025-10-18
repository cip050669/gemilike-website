# Quick Start Guide - Gemilike Website

## ✅ Status: Voll funktionsfähig!

Die Website ist fertig und läuft erfolgreich im Development Mode.

## 🚀 Server starten

```bash
cd /home/cip050669/CascadeProjects/gemilike-website
npm run dev
```

**Wichtig:** Prüfen Sie die Terminal-Ausgabe für den Port. Beispiel:
```
✓ Ready in 2.6s
- Local:        http://localhost:3002
```

## 🌐 Website testen

Öffnen Sie im Browser (ersetzen Sie 3002 mit Ihrem Port):

### Deutsche Version
- **Homepage:** http://localhost:3002/de
- **Über uns:** http://localhost:3002/de/about
- **Leistungen:** http://localhost:3002/de/services
- **Blog:** http://localhost:3002/de/blog
- **Shop:** http://localhost:3002/de/shop
- **Warenkorb:** http://localhost:3002/de/cart
- **Kontakt:** http://localhost:3002/de/contact

### English Version
- **Homepage:** http://localhost:3002/en
- **About:** http://localhost:3002/en/about
- **Services:** http://localhost:3002/en/services
- etc.

## ✨ Features die funktionieren

- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Sprachumschaltung (DE/EN) im Header
- ✅ Navigation mit allen Seiten
- ✅ Shop mit Warenkorb-Funktionalität
- ✅ Blog-Übersicht
- ✅ Kontaktformular
- ✅ Cookie-Banner
- ✅ Footer mit Social Links

## 📝 Wichtigste nächste Schritte

### 1. Logo hinzufügen (5 Minuten)

```bash
# Kopieren Sie Ihr Logo nach public/
cp /pfad/zu/ihrem/logo.png public/logo.png
```

Dann in `components/layout/Header.tsx` Zeile 31 ändern:
```typescript
// Vorher:
<span className="text-2xl font-bold...">Gemilike</span>

// Nachher:
<Image src="/logo.png" alt="Gemilike" width={150} height={40} />
```

### 2. Farben anpassen (10 Minuten)

Öffnen Sie `app/globals.css` und ändern Sie die Farben in Zeile 6-20:

```css
:root {
  --primary: 210 100% 50%;  /* Ihre Hauptfarbe in HSL */
  /* ... weitere Farben */
}
```

**Tipp:** Nutzen Sie https://uicolors.app/create um HSL-Werte aus Ihrem Logo zu extrahieren.

### 3. E-Mail-Versand einrichten (15 Minuten)

Das Kontaktformular funktioniert, sendet aber noch keine E-Mails. 

**Einfachste Lösung:** Formspree (kostenlos)
1. Account auf https://formspree.io erstellen
2. Formular erstellen und ID erhalten
3. In `app/[locale]/contact/page.tsx` Zeile 19 ändern:

```typescript
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  method: 'POST',
  body: JSON.stringify(formData),
  headers: { 'Content-Type': 'application/json' }
});
```

## 📚 Weitere Dokumentation

- **README.md** - Vollständige Projektdokumentation
- **NEXT_STEPS.md** - Detaillierte Anleitung für alle Anpassungen
- **DEPLOYMENT.md** - Strato-Deployment Schritt-für-Schritt
- **ROUTES.md** - Übersicht aller verfügbaren Routen

## 🐛 Troubleshooting

### Server startet nicht
```bash
# Port 3000 belegt? Prüfen Sie:
lsof -i :3000
# Oder lassen Sie Next.js automatisch einen anderen Port wählen
```

### Seiten zeigen 404
```bash
# Cache löschen und neu starten:
rm -rf .next
npm run dev
```

### TypeScript-Fehler
```bash
# Dependencies neu installieren:
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Design-Anpassungen

Alle Design-Elemente sind in folgenden Dateien:
- **Farben:** `app/globals.css`
- **Header:** `components/layout/Header.tsx`
- **Footer:** `components/layout/Footer.tsx`
- **Schriftarten:** `app/[locale]/layout.tsx`

## 📦 Build für Produktion

```bash
# Static Export für Strato:
npm run build

# Testen des Builds:
npx serve out
```

Der `out/` Ordner enthält dann alle statischen Dateien für den Upload.

## 💡 Tipps

1. **Änderungen werden automatisch übernommen** - Hot Reload ist aktiviert
2. **Browser-Cache leeren** wenn Änderungen nicht sichtbar sind (Strg+Shift+R)
3. **Mobile-Ansicht testen** mit Browser DevTools (F12 → Device Toolbar)
4. **Lighthouse-Audit** für Performance-Check (Chrome DevTools → Lighthouse)

## 🆘 Support

Bei Fragen oder Problemen:
- Prüfen Sie die Terminal-Ausgabe auf Fehler
- Lesen Sie die Dokumentation in den MD-Dateien
- Next.js Docs: https://nextjs.org/docs
- Tailwind Docs: https://tailwindcss.com/docs

---

## 🔄 Letzte Änderungen (10.10.2025)

### Header-Logo-Optimierung
Das Text-Logo im Header wurde für bessere Lesbarkeit optimiert:

**"Gem I Like" Logo:**
- ✅ "I" um 6px nach rechts verschoben (ml-1.5 → ml-3)
- ✅ Verbesserte Schriftpositionierung
- ✅ Konsistentes Design im Header

### E-Mail-System vollständig integriert
Das E-Mail-System ist jetzt vollständig funktional:

**E-Mail-Features:**
- ✅ Newsletter-Bestätigungen
- ✅ Kontaktformular-E-Mails
- ✅ Bestellbestätigungen
- ✅ Professionelle HTML-Templates
- ✅ Mehrsprachige E-Mails (DE/EN)

---

**Viel Erfolg mit Ihrer Website! 🚀**
