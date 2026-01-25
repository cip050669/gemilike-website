# npm_config_prefix Problem beheben

## Problem

Beim Versuch, Node.js 22 mit nvm zu installieren, erscheint diese Fehlermeldung:

```
nvm is not compatible with the "npm_config_prefix" environment variable: currently set to "/usr/local"
Run `unset npm_config_prefix` to unset it.
```

## Lösung

### Schritt 1: npm_config_prefix zurücksetzen

Führen Sie diesen Befehl in Ihrer Shell aus:

```bash
unset npm_config_prefix
```

### Schritt 2: Node.js 22 installieren und aktivieren

```bash
# nvm aktivieren (falls noch nicht aktiv)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# npm_config_prefix zurücksetzen
unset npm_config_prefix

# Node.js 22 installieren
nvm install 22

# Node.js 22 aktivieren
nvm use 22

# Als Standard setzen
nvm alias default 22
```

### Schritt 3: Verifizierung

```bash
node --version  # Sollte v22.x.x zeigen
npm --version
```

### Schritt 4: Projekt starten

```bash
cd /home/cip050669/CascadeProjects/gemilike-website
npm run dev
```

## Dauerhafte Lösung

Fügen Sie diese Zeilen zu Ihrer `~/.bashrc` hinzu, um `npm_config_prefix` automatisch zurückzusetzen:

```bash
# nvm aktivieren
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# npm_config_prefix zurücksetzen (für nvm Kompatibilität)
unset npm_config_prefix
```

Dann in einem neuen Terminal:

```bash
cd /home/cip050669/CascadeProjects/gemilike-website
nvm use  # Verwendet automatisch .nvmrc
npm run dev
```

## Alternative: Script verwenden

Falls Sie das Script verwenden möchten:

```bash
source fix-node-22.sh
```

**Wichtig:** Verwenden Sie `source`, nicht `./`!

---

**Letzte Aktualisierung:** 11. Januar 2026

