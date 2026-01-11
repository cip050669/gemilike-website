# Major-Updates Status

**Datum:** 11. Januar 2026  
**Status:** ✅ Updates in package.json, ⚠️ Lokale Installation blockiert durch Node.js-Version

---

## ✅ Erfolgreich aktualisiert

### 1. react-leaflet-cluster: 3.1.1 → 4.0.0
- ✅ Installiert
- ✅ Keine Breaking Changes (wird nicht direkt verwendet)
- ✅ Kompatibel

### 2. @types/node: 20.19.28 → 25.0.6
- ✅ Installiert
- ✅ In package.json aktualisiert
- ⚠️ TypeScript-Fehler müssen geprüft werden

### 3. Prisma: 6.19.1 → 7.2.0
- ✅ In package.json aktualisiert
- ⚠️ **Lokale Installation blockiert:** Node.js 18.19.1 < erforderlich 20.19+
- ✅ **Wird in Docker funktionieren:** Node.js 22 erfüllt Anforderung
- ⚠️ Prisma Client muss in Docker neu generiert werden: `npx prisma generate`

### 4. Next.js: 15.5.9 → 16.1.1
- ✅ Installiert
- ✅ In package.json aktualisiert
- ✅ `middleware.ts` → `proxy.ts` bereits umbenannt
- ✅ `cookies()` Aufrufe verwenden bereits `await` (Next.js 16 kompatibel)
- ⚠️ **Lokale Ausführung blockiert:** Node.js 18.19.1 < erforderlich 20.9+
- ✅ **Wird in Docker funktionieren:** Node.js 22 erfüllt Anforderung

---

## ⚠️ Wichtige Hinweise

### Node.js-Version Anforderungen

**Aktuelle lokale Umgebung:**
- Node.js: 18.19.1
- ❌ Erfüllt nicht die Anforderungen für Prisma 7 (>= 20.19) und Next.js 16 (>= 20.9)

**Docker-Umgebung:**
- Node.js: 22 (siehe Dockerfile)
- ✅ Erfüllt alle Anforderungen

### Nächste Schritte

1. **Für lokale Entwicklung:**
   - Node.js auf Version 20.19+ oder 22 aktualisieren
   - Oder: Nur in Docker entwickeln/testen

2. **Für Docker/Produktion:**
   - ✅ Alle Updates sind in package.json
   - Beim nächsten Docker-Build werden die neuen Versionen installiert
   - Prisma Client muss neu generiert werden: `npx prisma generate`

3. **Code-Anpassungen für Next.js 16:**
   - ✅ `middleware.ts` → `proxy.ts` bereits umbenannt
   - ✅ `cookies()` Aufrufe verwenden bereits `await`
   - ⚠️ `next-intl` Kompatibilität mit Next.js 16 prüfen

4. **Prisma 7 Anpassungen:**
   - ⚠️ 13 Enums im Schema prüfen (mögliche Breaking Changes)
   - Prisma Client in Docker neu generieren
   - Alle Enum-Verwendungen im Code testen

---

## 📋 Checkliste für Docker-Build

- [ ] Docker-Container neu bauen: `docker compose build --no-cache`
- [ ] Prisma Client generieren: `docker compose exec app npx prisma generate`
- [ ] Migrationen prüfen: `docker compose exec app npx prisma migrate deploy`
- [ ] Build testen: `docker compose exec app npm run build`
- [ ] Anwendung starten und testen

---

## 🔍 Zu prüfende Breaking Changes

### Next.js 16
- [x] `middleware.ts` → `proxy.ts` umbenannt
- [x] `cookies()` verwendet `await`
- [ ] `next-intl` Kompatibilität prüfen
- [ ] Alle API-Routes auf asynchrone APIs prüfen

### Prisma 7
- [ ] 13 Enums im Schema prüfen
- [ ] Prisma Client neu generieren
- [ ] Alle Enum-Verwendungen im Code testen
- [ ] Generator-Provider prüfen (aktuell: `prisma-client-js`)

### @types/node 25
- [ ] TypeScript-Fehler prüfen
- [ ] Node.js-Typen im Code anpassen

---

**Letzte Aktualisierung:** 11. Januar 2026

