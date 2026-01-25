# Node.js Version Anforderungen

**Datum:** 11. Januar 2026

---

## Aktuelle Anforderungen

### Production (Docker)
- ✅ **Node.js 22** - Erfüllt alle Anforderungen
- ✅ Prisma 7.2.0: >= 20.19 ✅
- ✅ Next.js 16.1.1: >= 20.9 ✅

### Lokale Entwicklung
- ⚠️ **Node.js 18.19.1** - Erfüllt NICHT die Anforderungen
- ❌ Prisma 7.2.0: >= 20.19 (aktuell: 18.19.1)
- ❌ Next.js 16.1.1: >= 20.9 (aktuell: 18.19.1)

---

## Lösung für lokale Entwicklung

### Option 1: Node.js mit nvm aktualisieren (Empfohlen)

```bash
# nvm installieren (falls nicht vorhanden)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Node.js 22 installieren
nvm install 22

# Node.js 22 verwenden
nvm use 22

# Als Standard setzen
nvm alias default 22
```

### Option 2: Docker für lokale Entwicklung verwenden

```bash
# Container starten
docker compose up -d

# In Container arbeiten
docker compose exec app bash
```

### Option 3: Node.js manuell aktualisieren

```bash
# Node.js 22 von nodejs.org herunterladen und installieren
# Oder über Package Manager (apt, yum, etc.)
```

---

## .nvmrc Datei

Eine `.nvmrc` Datei wurde erstellt mit:
```
22
```

Verwendung:
```bash
nvm use
```

---

## Verifizierung

Nach der Aktualisierung:
```bash
node --version  # Sollte 20.19+ oder 22.x zeigen
npm --version
```

---

**Letzte Aktualisierung:** 11. Januar 2026

