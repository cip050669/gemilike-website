# STRATO Server Setup – Gemilike Deployment Guide

Dieser Leitfaden beschreibt, wie du die Gemilike-Website auf einem STRATO vServer oder dedizierten Server betreibst. Er basiert auf Ubuntu 22.04 LTS, Docker und einer sicheren Umgebung für Next.js, PostgreSQL (anstelle von SQLite) sowie MinIO als S3-kompatiblen Object Storage für Medien.

---

## 1. Server vorbereiten

1. **Server buchen & Zugangsdaten erhalten** – STRATO Control Panel → Produkt → Zugangsdaten/SSH.
2. **Erstes Login per SSH**
   ```bash
   ssh root@DEINE_SERVER_IP
   ```
3. **System aktualisieren**
   ```bash
   apt update && apt upgrade -y
   ```
4. **Neuen Benutzer anlegen**
   ```bash
   adduser deploy
   usermod -aG sudo deploy
   ```
5. **SSH-Härtung**
   - `~/.ssh/authorized_keys` mit deinem Public Key füllen.
   - In `/etc/ssh/sshd_config`: `PasswordAuthentication no`, `PermitRootLogin no` setzen.
   - `systemctl restart ssh`.

6. **Firewall (UFW)**
   ```bash
   apt install ufw -y
   ufw default deny incoming
   ufw default allow outgoing
   ufw allow OpenSSH
   ufw allow http
   ufw allow https
   ufw enable
   ```

---

## 2. Docker & Docker Compose installieren

```bash
apt install ca-certificates curl gnupg -y
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
usermod -aG docker deploy
```

Abmelden/neu anmelden, damit `deploy` Docker nutzen kann.

---

## 3. Projektstruktur auf dem Server

Als Benutzer `deploy` (SSH-Login):

```bash
mkdir -p ~/apps/gemilike
cd ~/apps/gemilike
```

Empfohlene Struktur:
```
~/apps/gemilike
├─ .env                 # Production-Umgebungsvariablen
├─ docker-compose.yml
├─ docker/next/Dockerfile
├─ docker/nginx/nginx.conf
├─ docker/minio/minio.env
├─ docker/postgres/init.sql (optional)
└─ src/                 # Git-Klon der App
```

---

## 4. Docker Compose Setup

### 4.1 Dockerfile für Next.js (`docker/next/Dockerfile`)

```Dockerfile
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve Stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.prisma ./
CMD ["npm", "run", "start"]
```

### 4.2 Nginx Reverse Proxy (`docker/nginx/nginx.conf`)

```nginx
events {}
http {
  server {
    listen 80;
    server_name gemilike.de www.gemilike.de;

    location /.well-known/acme-challenge/ {
      root /var/www/certbot;
    }

    location / {
      proxy_pass http://next:3000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
}
```

### 4.3 Docker Compose (`docker-compose.yml`)

```yaml
version: '3.9'
services:
  next:
    build:
      context: ./src
      dockerfile: ../docker/next/Dockerfile
    env_file:
      - .env
    depends_on:
      - postgres
      - minio
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: gemilike
      POSTGRES_USER: gemilike
      POSTGRES_PASSWORD: supersecure
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    env_file:
      - docker/minio/minio.env
    volumes:
      - miniostorage:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    restart: unless-stopped

  nginx:
    image: nginx:stable-alpine
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - certbot-www:/var/www/certbot
      - certbot-etc:/etc/letsencrypt
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - next
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    entrypoint: /bin/sh
    volumes:
      - certbot-www:/var/www/certbot
      - certbot-etc:/etc/letsencrypt

volumes:
  pgdata:
  miniostorage:
  certbot-www:
  certbot-etc:
```

> Hinweise:
> - `src` ist dein Projektordner (Git-Klon). Passe `context`/`dockerfile` an die tatsächliche Struktur an.
> - Für Certbot später `docker-compose run --rm certbot certonly ...` ausführen.

---

## 5. MinIO konfigurieren

### 5.1 `.env` Datei für MinIO (`docker/minio/minio.env`)
```env
MINIO_ROOT_USER=gemilike
MINIO_ROOT_PASSWORD=very-secure-password
```

### 5.2 Bucket anlegen
Nach dem Start (siehe Abschnitt 9) im Browser `http://SERVER_IP:9001` öffnen.
- Login: `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`
- Bucket z. B. `gemstones` erstellen
- Im Next.js `.env` die URLs hinterlegen:
  ```env
  MINIO_ENDPOINT=minio:9000
  MINIO_ACCESS_KEY=gemilike
  MINIO_SECRET_KEY=very-secure-password
  MINIO_BUCKET=gemstones
  MINIO_REGION=eu-central-1
  MINIO_USE_SSL=false
  ```

In `next.config.js`/Env sicherstellen, dass die Upload-API MinIO verwendet (z. B. per `@aws-sdk/client-s3`).

---

## 6. Prisma auf PostgreSQL umstellen

1. `.env` in `src` anpassen:
   ```env
   DATABASE_URL="postgresql://gemilike:supersecure@postgres:5432/gemilike?schema=public"
   ```

2. Prisma Schema aktualisieren (`prisma/schema.prisma` → `provider = "postgresql"`).
3. Migration erstellen und anwenden:
   ```bash
   npm run prisma:migrate-deploy
   ```
   oder im Container: `docker-compose run --rm next npx prisma migrate deploy`.

---

## 7. Upload-API auf MinIO umstellen

1. `app/api/admin/gemstones/utils.ts` um Funktionen erweitern, die `@aws-sdk/client-s3` nutzen:
   ```ts
   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

   const s3 = new S3Client({
     endpoint: process.env.MINIO_ENDPOINT,
     region: process.env.MINIO_REGION,
     credentials: {
       accessKeyId: process.env.MINIO_ACCESS_KEY!,
       secretAccessKey: process.env.MINIO_SECRET_KEY!,
     },
     forcePathStyle: true,
   });

   export async function uploadToObjectStore(file: File) {
     const Key = `gemstones/${Date.now()}-${file.name}`;
     await s3.send(new PutObjectCommand({
       Bucket: process.env.MINIO_BUCKET!,
       Key,
       Body: Buffer.from(await file.arrayBuffer()),
       ContentType: file.type,
     }));
     return `${process.env.MINIO_PUBLIC_URL}/${Key}`;
   }
   ```

2. In den API-Routen `saveUploadedImage` ersetzen durch `uploadToObjectStore`. Für öffentliche URLs eine `MINIO_PUBLIC_URL` (z. B. `https://media.gemilike.de`) definieren und via Nginx ausliefern.

---

## 8. SSL mit Let’s Encrypt (manuell oder via Certbot Container)

1. DNS A-Record für `gemilike.de`/`www.gemilike.de` → Server-IP.
2. Zertifikat holen:
   ```bash
   docker compose run --rm certbot certonly --webroot -w /var/www/certbot -d gemilike.de -d www.gemilike.de
   ```
3. Nginx-Config anpassen (HTTPS-Server-Block, Zertifikatspfad `/etc/letsencrypt/live/...`).
4. `docker compose restart nginx`.

---

## 9. Deploy & Betrieb

```bash
# Erstes Deployment
cd ~/apps/gemilike
# Git-Repository klonen
git clone https://github.com/deinuser/gemilike-website src

# Build & Starten
docker compose build
docker compose up -d
```

### Updates
```bash
cd ~/apps/gemilike/src
git pull
cd ..
docker compose build next
docker compose up -d next
```

### Logs & Status
```bash
docker compose logs -f next
```

---

## 10. Backups & Monitoring

- **PostgreSQL**: `docker exec -t <postgres-container> pg_dump ... > backup.sql`
- **MinIO**: Regelmäßig Bucket sichern (z. B. `mc` CLI oder Lifecycle Policies).
- **Monitoring**: UptimeRobot für HTTP(s), optional Prometheus/Grafana.

---

## 11. Sicherheit

- Regelmäßige Updates (`apt upgrade`, `docker image prune`, `docker compose pull`).
- Fail2ban für SSH/Nginx.
- Starke Passwörter, 2FA im STRATO-Panel verwenden.

---

## 12. Weiterentwicklung

- CI/CD (GitHub Actions → `docker compose build` & Deploy per SSH). 
- Skalierung: Load Balancer + mehrere Next.js-Container.
- CDN vor Nginx (Cloudflare/Akamai) für global schnellere Auslieferung.

---

Mit diesem Setup betreibst du die Gemilike-Anwendung auf einem STRATO vServer oder dedizierten Server inklusive Datenbank, Medien-Storage und SSL. Passe die Werte (Domains, Passwörter) an dein Setup an. Bei Fragen oder dem Wunsch nach einem automatisierten Skript (z. B. Ansible) melde dich jederzeit.
