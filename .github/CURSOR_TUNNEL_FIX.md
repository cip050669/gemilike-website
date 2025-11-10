# Cursor Tunnel Fix - code-tunnel Problem beheben

## Problem

`/usr/share/cursor/bin/code-tunnel` funktioniert nicht mit der Fehlermeldung:
```
kann nicht ausführen: benötigte Datei nicht gefunden
```

**Ursache**: Die Datei wurde für Snap kompiliert und verwendet `/snap/core20/current/lib64/ld-linux-x86-64.so.2` als Interpreter, der nicht verfügbar ist.

## Lösung 1: Interpreter mit patchelf korrigieren (empfohlen)

### Voraussetzungen:
```bash
# patchelf installieren (falls nicht vorhanden)
sudo apt-get update
sudo apt-get install patchelf
```

### Fix anwenden:
```bash
# Backup erstellen
sudo cp /usr/share/cursor/bin/code-tunnel /usr/share/cursor/bin/code-tunnel.backup

# Interpreter korrigieren
sudo patchelf --set-interpreter /lib64/ld-linux-x86-64.so.2 /usr/share/cursor/bin/code-tunnel

# Testen
/usr/share/cursor/bin/code-tunnel --version
```

## Lösung 2: Snap installieren (Alternative)

Falls Sie Snap verwenden möchten:

```bash
# Snap installieren (Ubuntu)
sudo apt-get update
sudo apt-get install snapd

# Snap starten
sudo systemctl enable --now snapd.socket

# Testen
/usr/share/cursor/bin/code-tunnel --version
```

## Lösung 3: Cursor neu installieren (nicht als Snap)

1. Cursor deinstallieren
2. Cursor von der offiziellen Website herunterladen (DEB-Paket)
3. Neu installieren:
   ```bash
   sudo dpkg -i cursor_*.deb
   sudo apt-get install -f  # Dependencies installieren
   ```

## Lösung 4: Wrapper-Script erstellen (Temporär)

Erstellen Sie ein Wrapper-Script, das den richtigen Interpreter verwendet:

```bash
# Wrapper erstellen
sudo tee /usr/local/bin/code-tunnel-wrapper > /dev/null << 'EOF'
#!/bin/bash
exec /lib64/ld-linux-x86-64.so.2 /usr/share/cursor/bin/code-tunnel "$@"
EOF

sudo chmod +x /usr/local/bin/code-tunnel-wrapper

# Symlink erstellen (optional)
sudo ln -sf /usr/local/bin/code-tunnel-wrapper /usr/local/bin/code-tunnel
```

## Überprüfung

Nach der Fix-Anwendung:

```bash
# Version prüfen
/usr/share/cursor/bin/code-tunnel --version

# Oder mit Wrapper
code-tunnel-wrapper --version
```

## Weitere Informationen

- **patchelf**: Tool zum Ändern von ELF-Binaries
- **Snap**: Paket-Manager für Linux
- **Cursor Tunnel**: Remote-Verbindung für Cursor IDE

## System-Informationen

- **OS**: Ubuntu 24.04 LTS
- **Problem**: Snap-Interpreter nicht verfügbar
- **Lösung**: System-Interpreter verwenden (`/lib64/ld-linux-x86-64.so.2`)

