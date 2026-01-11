# Major-Updates Analyse & Empfehlung

**Datum:** 11. Januar 2026  
**Status:** Analyse abgeschlossen

---

## Übersicht der Major-Updates

| Paket | Aktuell | Latest | Status | Empfehlung |
|-------|---------|--------|--------|------------|
| `@prisma/client` & `prisma` | 6.19.1 | 7.2.0 | ⚠️ Breaking Changes | **Aufschub empfohlen** |
| `next` | 15.5.9 | 16.1.1 | ⚠️ Breaking Changes | **Aufschub empfohlen** |
| `@types/node` | 20.19.28 | 25.0.6 | ⚠️ Großer Sprung | **Aufschub empfohlen** |
| `react-leaflet-cluster` | 3.1.1 | 4.0.0 | ⚠️ Breaking Changes | **Optional** |

---

## 1. Prisma 7.2.0 (6.19.1 → 7.2.0)

### Breaking Changes

1. **Mapped Enums**
   - Prisma 7 führt "Mapped Enums" ein
   - **Betroffen:** 13 Enums im Schema (`UserRole`, `GemstoneStatus`, `AddressType`, etc.)
   - **Auswirkung:** Code, der Enums verwendet, muss möglicherweise angepasst werden

2. **Generator Provider**
   - Aktuelles Schema verwendet `provider = "prisma-client-js"` ✅ (kompatibel)
   - Keine Änderung erforderlich

3. **Mindestanforderungen**
   - Node.js: >= 20.19 ✅ (Docker verwendet Node 22)
   - TypeScript: >= 5.4.0 ✅ (aktuell: 5.9.3)

### Code-Analyse

- ✅ Code verwendet bereits `await params` Pattern (Next.js 15 kompatibel)
- ✅ Prisma-Queries verwenden Standard-APIs
- ⚠️ 13 Enums im Schema könnten betroffen sein

### Empfehlung: **AUFSCHUB**

**Gründe:**
- Viele Enums im Schema (13 Stück) - hohes Risiko für Breaking Changes
- Prisma 6.19.1 ist stabil und wird weiterhin unterstützt
- Migration erfordert umfassende Tests aller Enum-Verwendungen
- TypeScript-Version muss zuerst geprüft werden

**Wenn Update durchgeführt wird:**
1. ✅ TypeScript 5.9.3 erfüllt Anforderung (>= 5.4.0)
2. Alle Enum-Verwendungen im Code prüfen
3. Prisma Client neu generieren: `npx prisma generate`
4. Umfassende Tests durchführen
5. Migration in separatem Branch testen

---

## 2. Next.js 16.1.1 (15.5.9 → 16.1.1)

### Breaking Changes

1. **`middleware.ts` → `proxy.ts`**
   - Datei muss umbenannt werden
   - **Betroffen:** `middleware.ts` und `middleware-admin.ts`
   - **Auswirkung:** Dateinamen und möglicherweise Exports müssen angepasst werden

2. **Asynchrone APIs**
   - `cookies()`, `headers()`, `draftMode()` sind jetzt asynchron
   - **Betroffen:** Code, der diese APIs verwendet
   - **Auswirkung:** `await` muss hinzugefügt werden

3. **`params` und `searchParams`**
   - ✅ **Bereits implementiert:** Code verwendet bereits `params: Promise<{ locale: string }>`
   - Keine Änderung erforderlich

4. **Mindestanforderungen**
   - Node.js: >= 20.9.0 ✅ (Docker verwendet Node 22)
   - TypeScript: >= 5.1.0 ✅ (aktuell: 5.9.3)

### Code-Analyse

- ✅ Code verwendet bereits `params: Promise<{ locale: string }>` Pattern
- ⚠️ `middleware.ts` muss zu `proxy.ts` umbenannt werden
- ⚠️ `middleware-admin.ts` muss möglicherweise angepasst werden
- ⚠️ `next-intl` Kompatibilität muss geprüft werden

### Empfehlung: **AUFSCHUB**

**Gründe:**
- Next.js 15.5.9 ist stabil und wird weiterhin unterstützt
- Middleware-Umbenennung erfordert Anpassungen
- `next-intl` Kompatibilität mit Next.js 16 muss geprüft werden
- Migration erfordert umfassende Tests

**Wenn Update durchgeführt wird:**
1. ✅ TypeScript 5.9.3 erfüllt Anforderung (>= 5.1.0)
2. `middleware.ts` → `proxy.ts` umbenennen
3. `middleware-admin.ts` prüfen und anpassen
4. Alle `cookies()`, `headers()`, `draftMode()` Aufrufe prüfen
5. `next-intl` auf Next.js 16 kompatible Version aktualisieren
6. Umfassende Tests durchführen

---

## 3. @types/node 25.0.6 (20.19.28 → 25.0.6)

### Breaking Changes

1. **Großer Versionssprung**
   - Sprung von Version 20 → 25 (5 Major-Versionen)
   - **Auswirkung:** Viele Typdefinitionen haben sich geändert

2. **Kompatibilität**
   - Muss mit anderen Abhängigkeiten kompatibel sein
   - **Auswirkung:** Mögliche Typinkompatibilitäten

### Empfehlung: **AUFSCHUB**

**Gründe:**
- Zu großer Versionssprung (20 → 25)
- Hohes Risiko für Typinkompatibilitäten
- `@types/node@20` ist für Node.js 22 ausreichend
- Kein dringender Bedarf für Update

**Wenn Update durchgeführt wird:**
1. Alle TypeScript-Fehler prüfen
2. Node.js-Typen im Code anpassen
3. Umfassende Tests durchführen

---

## 4. react-leaflet-cluster 4.0.0 (3.1.1 → 4.0.0)

### Breaking Changes

- **Unbekannt:** Release Notes müssen geprüft werden
- **Betroffen:** Nur `WorldMapClient` Komponente
- **Auswirkung:** Begrenzt auf Weltkarten-Funktionalität

### Code-Analyse

- ✅ Wird nur in einer Komponente verwendet (`WorldMapClient`)
- ✅ Isolierte Verwendung - geringes Risiko

### Empfehlung: **OPTIONAL**

**Gründe:**
- Begrenzte Verwendung (nur Weltkarte)
- Geringes Risiko
- Kann separat getestet werden

**Wenn Update durchgeführt wird:**
1. Release Notes von `react-leaflet-cluster@4.0.0` prüfen
2. `WorldMapClient` Komponente anpassen
3. Weltkarten-Funktionalität testen

---

## Zusammenfassung & Empfehlung

### ✅ **Empfohlen: AUFSCHUB für alle Major-Updates**

**Gründe:**
1. **Stabilität:** Aktuelle Versionen sind stabil und werden unterstützt
2. **Risiko:** Breaking Changes erfordern umfassende Tests
3. **Aufwand:** Migration erfordert Code-Anpassungen
4. **Zeitpunkt:** Kein dringender Bedarf für Updates

### 📋 **Aktionsplan für zukünftige Updates**

**Wenn Updates durchgeführt werden sollen:**

1. **Prisma 7 Update:**
   - [x] TypeScript 5.9.3 erfüllt Anforderung (>= 5.4.0)
   - [ ] Alle 13 Enums im Code prüfen
   - [ ] Prisma Client neu generieren
   - [ ] Umfassende Tests durchführen

2. **Next.js 16 Update:**
   - [x] TypeScript 5.9.3 erfüllt Anforderung (>= 5.1.0)
   - [ ] `middleware.ts` → `proxy.ts` umbenennen
   - [ ] `next-intl` Kompatibilität prüfen
   - [ ] Alle asynchronen APIs anpassen
   - [ ] Umfassende Tests durchführen

3. **@types/node 25 Update:**
   - [ ] TypeScript-Fehler prüfen
   - [ ] Node.js-Typen anpassen
   - [ ] Umfassende Tests durchführen

4. **react-leaflet-cluster 4 Update:**
   - [ ] Release Notes prüfen
   - [ ] `WorldMapClient` anpassen
   - [ ] Weltkarten-Funktionalität testen

### 🔄 **Alternative: Schrittweise Updates**

Wenn Updates gewünscht sind, empfohlen in dieser Reihenfolge:

1. **react-leaflet-cluster 4** (geringstes Risiko)
2. **@types/node 25** (nach Prisma/Next.js Updates)
3. **Prisma 7** (nach Next.js 16, da Next.js 16 Prisma 7 unterstützt)
4. **Next.js 16** (zuletzt, da es die meisten Änderungen erfordert)

---

## Aktuelle Sicherheitslage

✅ **Keine kritischen Sicherheitslücken:**
- `npm audit`: 0 Schwachstellen
- Alle aktuellen Versionen sind sicher
- Kein dringender Bedarf für Major-Updates aus Sicherheitsgründen

---

**Letzte Aktualisierung:** 11. Januar 2026

