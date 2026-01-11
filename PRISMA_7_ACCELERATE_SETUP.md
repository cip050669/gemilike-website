# Prisma 7 + Accelerate Setup Guide

**Datum:** 11. Januar 2026

---

## Installation

### 1. Pakete installieren

```bash
npm install @prisma/client@^7.2.0 @prisma/extension-accelerate@^1.0.0
```

### 2. Prisma Client generieren

```bash
npx prisma generate
```

---

## Konfiguration

### Option A: Mit Prisma Accelerate (Empfohlen für Production)

1. **Prisma Accelerate Account erstellen:**
   - Gehen Sie zu https://www.prisma.io/accelerate
   - Erstellen Sie ein kostenloses Konto
   - Erstellen Sie ein neues Projekt
   - Kopieren Sie die Accelerate Connection URL

2. **Umgebungsvariable setzen:**
   ```env
   PRISMA_ACCELERATE_URL=prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```

3. **Code verwendet automatisch Accelerate:**
   - Der Code in `lib/prisma.ts` erkennt automatisch `PRISMA_ACCELERATE_URL`
   - Wenn gesetzt, wird Accelerate verwendet
   - Wenn nicht gesetzt, wird direkte Verbindung verwendet

### Option B: Ohne Accelerate (Direkte Verbindung)

1. **Nur DATABASE_URL setzen:**
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```

2. **Code verwendet direkte Verbindung:**
   - Prisma Client verbindet sich direkt mit der Datenbank
   - Keine Accelerate-Features (Caching, Connection Pooling)

---

## Code-Struktur

### lib/prisma.ts

```typescript
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

function createPrismaClient() {
  const baseClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn'] 
      : ['error'],
    errorFormat: 'pretty',
  });

  // Extend with Accelerate if PRISMA_ACCELERATE_URL is set
  if (process.env.PRISMA_ACCELERATE_URL) {
    return baseClient.$extends(withAccelerate());
  }

  return baseClient;
}

export const prisma = createPrismaClient();
```

---

## Vorteile von Prisma Accelerate

1. **Connection Pooling:** Reduziert Verbindungs-Timeouts
2. **Globaler Cache:** Schnellere Antwortzeiten weltweit
3. **Skalierbarkeit:** Ideal für serverlose Umgebungen
4. **15+ globale Regionen:** Niedrige Latenz weltweit

---

## Kosten

- **Free Tier:** Verfügbar für Entwicklung und kleine Projekte
- **Paid Plans:** Für Production mit höherem Traffic

---

## Bekannte Probleme

⚠️ **Prisma 7 + Accelerate Kompatibilität:**
- Es gibt Berichte über mögliche Inkompatibilitäten
- Typverluste können auftreten
- Empfehlung: Testen Sie gründlich nach der Einrichtung

---

## Nächste Schritte

1. ✅ Pakete installieren
2. ✅ Code anpassen (bereits erledigt)
3. ⏳ Prisma Accelerate Account erstellen
4. ⏳ `PRISMA_ACCELERATE_URL` in `.env` setzen
5. ⏳ Build testen
6. ⏳ Anwendung testen

---

## Fallback-Strategie

Falls Accelerate Probleme verursacht:
- Entfernen Sie `PRISMA_ACCELERATE_URL` aus `.env`
- Code verwendet automatisch direkte Verbindung
- Oder: Zurück zu Prisma 6.19.1

---

**Letzte Aktualisierung:** 11. Januar 2026

