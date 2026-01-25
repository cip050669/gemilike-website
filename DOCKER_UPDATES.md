# Dockerfile Updates - Zusammenfassung

**Datum:** November 2025  
**Status:** ✅ Aktualisiert

---

## ✅ Durchgeführte Updates

### 1. **Dockerfile (Production)**

#### Service Worker Support
- ✅ Service Worker Verifikation nach Build hinzugefügt
- ✅ Kommentare für Service Worker Support ergänzt
- ✅ Standalone Build Verifikation hinzugefügt

**Änderungen:**
```dockerfile
# Verify critical files exist after build
RUN test -f public/sw.js && echo "✓ Service Worker found" || echo "⚠ Warning: Service Worker not found" && \
    test -d .next/standalone && echo "✓ Standalone build found" || (echo "✗ Standalone build missing" && exit 1)
```

#### Service Worker Kommentare
- ✅ Dokumentation hinzugefügt, dass Service Worker in `public/sw.js` automatisch serviert wird
- ✅ Hinweis auf Client-Side Registration via `ServiceWorkerRegistration` Komponente

### 2. **Dockerfile.dev (Development)**

#### Updates
- ✅ Kommentar hinzugefügt, dass Service Worker in Development verfügbar ist
- ✅ Service Worker wird über Volume-Mount automatisch verfügbar

### 3. **docker-compose.yml (Production)**

#### Service Worker Verifikation
- ✅ Service Worker Verifikation im Start-Command hinzugefügt
- ✅ Prüft ob `public/sw.js` existiert beim Container-Start

**Änderungen:**
```yaml
echo 'Verifying Service Worker...' &&
test -f public/sw.js && echo 'Service Worker found' || echo 'Warning: Service Worker not found' &&
```

### 4. **.dockerignore**

#### Service Worker
- ✅ Service Worker (`public/sw.js`) wird NICHT ignoriert (sollte im Image sein)
- ✅ Bestätigt, dass Service Worker in Production verfügbar ist

---

## 📋 Build-Prozess

### Production Build
1. **Dependencies Stage**: Installiert Production-Dependencies
2. **Builder Stage**: 
   - Installiert alle Dependencies (inkl. devDependencies)
   - Generiert Prisma Client
   - Führt `npm run build` aus
   - Verifiziert Service Worker und Standalone Build
3. **Runner Stage**:
   - Kopiert `public/` (inkl. `sw.js`)
   - Kopiert `.next/standalone/`
   - Kopiert `.next/static/`
   - Kopiert Prisma, i18n, messages

### Development Build
- Alle Dependencies installiert
- Hot Reload aktiv
- Service Worker über Volume-Mount verfügbar

---

## 🔍 Verifikationen

### Build-Time
- ✅ Service Worker existiert (`public/sw.js`)
- ✅ Standalone Build erstellt (`.next/standalone/`)

### Runtime
- ✅ Service Worker Verifikation beim Container-Start
- ✅ Health Check für Application

---

## 🚀 Performance-Optimierungen

### Multi-Stage Build
- ✅ Separate Stages für Dependencies, Builder und Runner
- ✅ Minimale Production-Image Größe
- ✅ Cache Mounts für npm und Prisma

### Standalone Output
- ✅ Next.js Standalone Output aktiviert (`output: 'standalone'`)
- ✅ Optimierte Bundle-Größe
- ✅ Schnellere Container-Starts

---

## 📝 Wichtige Hinweise

1. **Service Worker**: 
   - Wird automatisch von Next.js serviert (liegt in `public/sw.js`)
   - Registrierung erfolgt client-side via `ServiceWorkerRegistration` Komponente
   - Nur in Production aktiv (`NODE_ENV=production`)

2. **Standalone Build**:
   - Erstellt selbstständigen Server in `.next/standalone/`
   - Enthält alle notwendigen Dependencies
   - Startet mit `node server.js`

3. **Volumes**:
   - User-Uploads werden als Volumes gemountet
   - Daten-Dateien für Color Charts als Volumes
   - Erlaubt Updates ohne Image-Rebuild

---

## ✅ Checkliste

- [x] Service Worker Support dokumentiert
- [x] Build-Verifikationen hinzugefügt
- [x] Standalone Build Verifikation
- [x] Runtime Service Worker Check
- [x] Kommentare und Dokumentation aktualisiert
- [x] .dockerignore überprüft (Service Worker nicht ignoriert)

---

---

## Januar 2026 – Build-Fix & Image-Updates

### Dockerfile
- **DATABASE_URL beim Build:** Dummy `postgresql://build:build@localhost:5432/build` als `ARG`/`ENV`, damit Prisma beim Next.js Page-Data-Collect (z.B. `/api/admin/audit-logs`) nicht mit „Either PRISMA_ACCELERATE_URL or DATABASE_URL must be set“ abbricht. Zur Laufzeit wird die echte `DATABASE_URL` aus docker-compose/Container-Env genutzt.
- **Build-Befehl:** `npm run build` durch `npx next build` ersetzt, um das prebuild-Skript (benötigt `bash`) im Alpine-Image zu vermeiden.

### docker-compose.yml
- **Build-Arg:** `DATABASE_URL=postgresql://build:build@localhost:5432/build` für den App-Build ergänzt (nur Build, nicht Laufzeit).

### deploy/strato-compose.yml
- **postgres:** `postgres:16` → `postgres:17-alpine`
- **redis:** `redis:7-alpine` → `redis:7.4-alpine`
- **minio:** `minio/minio:latest` → `minio/minio:RELEASE.2024-11-07`
- **caddy:** `caddy:2.8` → `caddy:2.10-alpine`
- **grafana:** `grafana/grafana:10.4.2` → `grafana/grafana:11.0.0`
- **App-Start:** `npm run start` → `node server.js` (Standalone-Output).

---

**Letzte Aktualisierung:** Januar 2026

