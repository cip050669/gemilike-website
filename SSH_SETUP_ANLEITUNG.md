# 🔐 SSH-Key Setup für GitHub

**Datum:** 6. Januar 2026  
**Status:** ✅ SSH-Key generiert, Remote auf SSH umgestellt

---

## ✅ Durchgeführte Schritte

1. **SSH-Key generiert:** `~/.ssh/id_ed25519`
2. **GitHub Host Key hinzugefügt:** `~/.ssh/known_hosts`
3. **Git Remote umgestellt:** Von HTTPS auf SSH

---

## 📋 Nächste Schritte

### 1. SSH Public Key zu GitHub hinzufügen

**Ihr Public Key:**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO9uDzkAWXdc4rYugHk658EMVzkofPxKBTyLup7iYNdD christian@pies.com.de
```

**Anleitung:**

1. Gehen Sie zu: https://github.com/settings/keys
2. Klicken Sie auf **"New SSH key"**
3. **Title:** z.B. "Gemilike Website - Server"
4. **Key type:** Authentication Key
5. **Key:** Kopieren Sie den obigen Public Key komplett
6. Klicken Sie auf **"Add SSH key"**

### 2. GitHub Personal Access Token widerrufen

**WICHTIG:** Der alte Token muss sofort widerrufen werden!

1. Gehen Sie zu: https://github.com/settings/tokens
2. Finden Sie den betroffenen Token (wurde bereits widerrufen)
3. Klicken Sie auf **"Revoke"** (Widerrufen)

### 3. SSH-Verbindung testen

Nachdem Sie den SSH-Key zu GitHub hinzugefügt haben, testen Sie die Verbindung:

```bash
ssh -T git@github.com
```

**Erwartete Ausgabe:**
```
Hi cip050669! You've successfully authenticated, but GitHub does not provide shell access.
```

### 4. Git-Operationen testen

```bash
# Test: Remote-URL prüfen
git remote -v

# Sollte zeigen:
# origin  git@github.com:cip050669/gemilike-website.git (fetch)
# origin  git@github.com:cip050669/gemilike-website.git (push)

# Test: Fetch testen
git fetch origin
```

---

## 🔒 Sicherheitshinweise

### ✅ Vorteile von SSH:

- **Keine Tokens im Remote:** SSH-Keys sind sicherer als Personal Access Tokens
- **Automatische Authentifizierung:** Keine Passwort-Eingabe nötig
- **Bessere Sicherheit:** SSH-Keys können mit Passphrase geschützt werden
- **Einfache Verwaltung:** Keys können einfach widerrufen werden

### ⚠️ Wichtige Hinweise:

- **Private Key schützen:** `~/.ssh/id_ed25519` darf NIEMALS geteilt werden
- **Public Key ist sicher:** Der Public Key kann öffentlich geteilt werden
- **Backup:** Erstellen Sie ein Backup des Private Keys (verschlüsselt!)

---

## 🛠️ Troubleshooting

### Problem: "Permission denied (publickey)"

**Lösung:**
1. Prüfen Sie, ob der SSH-Key zu GitHub hinzugefügt wurde
2. Testen Sie die Verbindung: `ssh -T git@github.com`
3. Prüfen Sie die SSH-Agent-Konfiguration: `ssh-add -l`

### Problem: "Host key verification failed"

**Lösung:**
```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

### Problem: Git-Operationen funktionieren nicht

**Lösung:**
```bash
# Remote-URL prüfen
git remote -v

# Falls noch HTTPS: Umstellen auf SSH
git remote set-url origin git@github.com:cip050669/gemilike-website.git
```

---

## 📝 Zusammenfassung

| Schritt | Status |
|---------|--------|
| SSH-Key generiert | ✅ |
| GitHub Host Key hinzugefügt | ✅ |
| Git Remote auf SSH umgestellt | ✅ |
| SSH-Key zu GitHub hinzufügen | ⏳ **Ihre Aktion erforderlich** |
| Alten Token widerrufen | ⏳ **Ihre Aktion erforderlich** |
| SSH-Verbindung testen | ⏳ **Nach SSH-Key-Hinzufügung** |

---

**Erstellt:** 6. Januar 2026  
**Nächste Prüfung:** Nach SSH-Key-Hinzufügung zu GitHub

