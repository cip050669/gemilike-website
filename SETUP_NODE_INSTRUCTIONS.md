# Node.js 22 Setup - Manuelle Anleitung

Da nvm eine Shell-Funktion ist, die in der aktuellen Shell-Umgebung geladen werden muss, können die Befehle nicht automatisch ausgeführt werden.

## Schritt-für-Schritt Anleitung

### 1. Öffnen Sie ein neues Terminal-Fenster

### 2. Führen Sie diese Befehle nacheinander aus:

```bash
# nvm aktivieren
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Prüfen ob nvm funktioniert
nvm --version

# Node.js 22 installieren
nvm install 22

# Node.js 22 aktivieren
nvm use 22

# Als Standard setzen
nvm alias default 22

# Versionen prüfen
node --version  # Sollte v22.x.x zeigen
npm --version

# Dann können Sie starten
npm run dev
```

### 3. Für dauerhafte Aktivierung

Fügen Sie diese Zeilen zu Ihrer `~/.bashrc` hinzu:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Dann in einem neuen Terminal:

```bash
cd /home/cip050669/CascadeProjects/gemilike-website
nvm use  # Verwendet automatisch .nvmrc
npm run dev
```

## Alternative: Setup-Script manuell ausführen

Sie können auch das erstellte Script manuell ausführen:

```bash
bash setup-node-22.sh
```

## Verifizierung

Nach der Installation sollten Sie sehen:

```
Node.js: v22.x.x
npm:     v10.x.x
```

---

**Wichtig:** Diese Befehle müssen in Ihrer interaktiven Shell ausgeführt werden, nicht über automatische Scripts.

