# Admin-Login Problem beheben

**Datum:** 11. Januar 2026

---

## Problem

Die Anmeldung im Admin-Bereich (`http://192.168.1.105:3003/de/admin/gemstones/`) funktioniert nicht.

## Ursache

Die `NEXTAUTH_URL` in der `.env` Datei ist auf `http://localhost:3000` gesetzt, aber der Server läuft auf Port 3003 (`http://192.168.1.105:3003`).

NextAuth benötigt die korrekte URL, um Sessions korrekt zu verarbeiten.

## Lösung

### Schritt 1: .env Datei aktualisieren

Öffnen Sie die `.env` Datei und ändern Sie:

```env
# Vorher
NEXTAUTH_URL="http://localhost:3000"

# Nachher
NEXTAUTH_URL="http://192.168.1.105:3003"
```

### Schritt 2: Server neu starten

Nach der Änderung müssen Sie den Development-Server neu starten:

```bash
# Server stoppen (Ctrl+C)
# Dann neu starten:
npm run dev
```

### Schritt 3: Login testen

1. Öffnen Sie `http://192.168.1.105:3003/de/admin/login`
2. Verwenden Sie die Demo-Zugangsdaten:
   - **E-Mail:** `admin@gemilike.com`
   - **Passwort:** `admin123`

## Alternative: Dynamische URL

Falls Sie die URL flexibel halten möchten, können Sie auch `NEXT_PUBLIC_APP_URL` verwenden:

```env
NEXTAUTH_URL="${NEXT_PUBLIC_APP_URL:-http://192.168.1.105:3003}"
NEXT_PUBLIC_APP_URL="http://192.168.1.105:3003"
```

## Weitere mögliche Probleme

### 1. SessionProvider nicht korrekt konfiguriert

Der `SessionProvider` ist bereits in `app/[locale]/layout.tsx` konfiguriert. Falls das Problem weiterhin besteht, prüfen Sie:

- Browser-Konsole auf Fehler
- Network-Tab auf fehlgeschlagene Requests zu `/api/auth/*`

### 2. CORS-Probleme

Falls Sie CORS-Fehler sehen, stellen Sie sicher, dass die `NEXTAUTH_URL` mit der tatsächlichen URL übereinstimmt.

### 3. Cookies werden nicht gesetzt

- Prüfen Sie, ob Cookies im Browser gesetzt werden
- Stellen Sie sicher, dass keine Ad-Blocker oder Privacy-Extensions die Cookies blockieren

## Debugging

Aktivieren Sie Debug-Modus in `lib/auth.ts`:

```typescript
debug: process.env.NODE_ENV === 'development',
```

Dies ist bereits aktiviert. Prüfen Sie die Server-Logs für detaillierte Fehlermeldungen.

---

**Letzte Aktualisierung:** 11. Januar 2026

