# Docker Setup für Gemilike Website

**Version:** 2.2.0  
**Letzte Aktualisierung:** November 2025

**Hinweis:** Diese Dokumentation ist vollständig in das Anwenderhandbuch integriert. Siehe `ANWENDERHANDBUCH_GEMMILKE_WEBSITE.md` Abschnitt 10.1 für die vollständige Dokumentation.

Diese Anleitung erklärt, wie Sie die Gemilike-Website mit Docker ausführen.

## Voraussetzungen

- Docker (Version 20.10 oder höher)
- Docker Compose (Version 2.0 oder höher)
- `.env` Datei mit allen notwendigen Umgebungsvariablen

## Aktualisierungen (2025)

Die Docker-Konfiguration wurde aktualisiert mit:
- ✅ Dockerfile Syntax 1.7 (neueste Version)
- ✅ Cache Mounts für schnellere Builds (npm & Prisma)
- ✅ Verbesserte Health Checks (wget + curl Fallback)
- ✅ Resource Limits für Production
- ✅ Optimiertes .dockerignore
- ✅ Docker Compose Version 3.9
- ✅ Unterstützung für Farbanalyse (Image Processing Libraries: cairo, libpng, etc.)
- ✅ Unterstützung für Farbtafeln (Data Directory Mounting)
- ✅ Node.js 20 Alpine (neueste LTS)

## Schnellstart

### 1. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env` Datei im Projektroot basierend auf `env.example`:

```bash
cp env.example .env
```

Wichtige Variablen, die Sie anpassen müssen:

```env
# Database
POSTGRES_USER=gemilike
POSTGRES_PASSWORD=ihr-sicheres-passwort
POSTGRES_DB=gemilike
POSTGRES_PORT=5432

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_PORT=3000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generieren-sie-ein-sicheres-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ihre-email@gemilike.de
SMTP_PASSWORD=ihr-app-passwort
SMTP_FROM=noreply@gemilike.de

# Admin
ADMIN_EMAIL=admin@gemilike.de
```

### 2. Production Build starten

```bash
# Build und Start aller Services
docker-compose up -d

# Logs anzeigen
docker-compose logs -f app

# Stoppen
docker-compose down
```

### 3. Development Build starten

```bash
# Build und Start mit Hot Reload
docker-compose -f docker-compose.dev.yml up -d

# Logs anzeigen
docker-compose -f docker-compose.dev.yml logs -f app

# Stoppen
docker-compose -f docker-compose.dev.yml down
```

## Datenbank-Migrationen

Beim ersten Start führt Docker automatisch `prisma migrate deploy` aus. Für manuelle Migrationen:

```bash
# Production
docker-compose exec app npx prisma migrate deploy

# Development
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate deploy
```

## Datenbank-Seeding

```bash
# Production
docker-compose exec app npm run seed

# Development
docker-compose -f docker-compose.dev.yml exec app npm run seed
```

## Datenbank-Zugriff

Sie können direkt auf die PostgreSQL-Datenbank zugreifen:

```bash
# Production
docker-compose exec postgres psql -U gemilike -d gemilike

# Development
docker-compose -f docker-compose.dev.yml exec postgres psql -U gemilike -d gemilike_dev
```

## Volumes und Persistenz

Docker speichert Daten in folgenden Volumes:

- **PostgreSQL Daten**: `postgres_data` (Production) / `postgres_dev_data` (Development)
- **Uploaded Files**: `./public/uploads` (gemountet als Volume)
- **Invoices**: `./public/invoices` (gemountet als Volume)
- **Gemstone Analysis Images**: `./public/gemstone-analyses` (gemountet als Volume)
- **Color Chart Data**: `./data` (gemountet als Volume, read-only in Production)

## Wartung

### Container neu bauen

```bash
# Production
docker-compose build --no-cache
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

### Logs prüfen

```bash
# Alle Services
docker-compose logs -f

# Nur App
docker-compose logs -f app

# Nur Database
docker-compose logs -f postgres
```

### Container-Stats

```bash
docker-compose ps
docker stats
```

### Volumes bereinigen

⚠️ **Achtung**: Löscht alle Daten!

```bash
# Production
docker-compose down -v

# Development
docker-compose -f docker-compose.dev.yml down -v
```

## Production Deployment

### Optimierungen für Production

1. **Umgebungsvariablen**: Verwenden Sie sichere Secrets (z.B. Docker Secrets, AWS Secrets Manager)
2. **Reverse Proxy**: Setzen Sie einen Nginx oder Traefik vor die App
3. **SSL/TLS**: Konfigurieren Sie HTTPS-Zertifikate
4. **Monitoring**: Richten Sie Logging und Monitoring ein
5. **Backups**: Planen Sie regelmäßige Datenbank-Backups

### Beispiel mit Nginx Reverse Proxy

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - gemilike-network
```

## Troubleshooting

### Container startet nicht

```bash
# Prüfe Logs
docker-compose logs app

# Prüfe Container-Status
docker-compose ps

# Prüfe Netzwerk
docker network ls`http://localhost:3000/de/admin/reviews`
```

### Datenbank-Verbindungsfehler

```bash
# Prüfe ob Postgres läuft
docker-compose ps postgres

# Prüfe Datenbank-Logs
docker-compose logs postgres

# Teste Verbindung
docker-compose exec app npx prisma db pull
```

### Port bereits belegt

```bash
# Ändere Ports in .env
POSTGRES_PORT=5433
APP_PORT=3001
```

### Build-Fehler

```bash
# Lösche Cache und baue neu
docker-compose build --no-cache --pull
```

## Email Testing (Development)

In der Development-Umgebung läuft MailHog, um E-Mails zu testen:

- **SMTP**: `localhost:1025`
- **Web UI**: `http://localhost:8025`

Alle E-Mails, die von der App gesendet werden, werden von MailHog abgefangen und können im Web-Interface betrachtet werden.

## Weitere Ressourcen

- [Docker Dokumentation](https://docs.docker.com/)
- [Docker Compose Dokumentation](https://docs.docker.com/compose/)
- [Next.js Docker Dokumentation](https://nextjs.org/docs/deployment#docker-image)
- [Prisma mit Docker](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)

