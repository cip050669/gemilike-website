# Node.js Version Setup

## Problem

Das Projekt benötigt **Node.js >= 20.9.0** (empfohlen: **Node.js 22**), aber Ihr System verwendet aktuell **Node.js 18.19.1**.

## Lösung mit nvm (Empfohlen)

### 1. nvm aktivieren (falls noch nicht aktiviert)

```bash
# nvm in der aktuellen Shell aktivieren
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

### 2. Node.js 22 installieren und verwenden

```bash
# Node.js 22 installieren
nvm install 22

# Node.js 22 aktivieren
nvm use 22

# Als Standard setzen (optional)
nvm alias default 22

# Version prüfen
node --version  # Sollte v22.x.x zeigen
```

### 3. Automatische Aktivierung (für neue Shells)

Fügen Sie diese Zeilen zu Ihrer `~/.bashrc` oder `~/.zshrc` hinzu:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Dann in neuen Shells automatisch die richtige Version verwenden:

```bash
cd /path/to/gemilike-website
nvm use  # Verwendet automatisch die Version aus .nvmrc
```

## Alternative: Manuelle Installation

Falls nvm nicht verfügbar ist, können Sie Node.js 22 direkt von [nodejs.org](https://nodejs.org/) herunterladen und installieren.

## Verifizierung

Nach der Installation:

```bash
node --version  # Sollte >= 20.9.0 sein
npm --version
```

## Projekt starten

Nach der Node.js-Version-Aktualisierung:

```bash
# Dependencies installieren (falls noch nicht geschehen)
npm install

# Development Server starten
npm run dev
```

## Docker Alternative

Falls die lokale Node.js-Version nicht aktualisiert werden kann, können Sie Docker verwenden:

```bash
# Container starten
docker compose up -d

# In Container arbeiten
docker compose exec app bash
```

---

**Letzte Aktualisierung:** 11. Januar 2026

