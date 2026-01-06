# 🔐 SSH-Key zu GitHub hinzufügen - Korrekte Anleitung

**Wichtig:** SSH Keys sind in den **persönlichen Account Settings**, nicht im Repository Settings!

---

## 🎯 Korrekte Anleitung

### Option 1: Direkter Link (Empfohlen)

👉 **https://github.com/settings/ssh/new**

Dieser Link führt Sie direkt zu den persönlichen SSH Key Settings.

---

### Option 2: Über persönliche Account Settings

1. **Klicken Sie auf Ihr Profilbild** (oben rechts auf GitHub - nicht im Repository!)
2. **Klicken Sie auf "Settings"** (persönliche Settings, nicht Repository Settings)
3. **Scrollen Sie nach unten** im linken Menü zu **"Access"**
4. **Klicken Sie auf "SSH and GPG keys"**
5. **Klicken Sie auf "New SSH key"**

---

## ⚠️ Wichtiger Unterschied

### Repository Settings (was Sie gerade sehen):
- **"Deploy keys"** unter Security
- Diese sind für CI/CD und automatisierte Deployments
- **NICHT für normale Git-Operationen!**

### Persönliche Account Settings (wo Sie hin müssen):
- **"SSH and GPG keys"** unter Access
- Diese sind für Ihre persönlichen Git-Operationen
- **Das ist, was Sie brauchen!**

---

## 📋 Ihr SSH Public Key

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO9uDzkAWXdc4rYugHk658EMVzkofPxKBTyLup7iYNdD christian@pies.com.de
```

**Kopieren Sie diesen kompletten Key** und fügen Sie ihn in das Formular ein.

---

## 🔍 So finden Sie es

1. **Verlassen Sie das Repository** (klicken Sie auf das GitHub-Logo oben links)
2. **Klicken Sie auf Ihr Profilbild** (oben rechts)
3. **Klicken Sie auf "Settings"**
4. **Im linken Menü:** Scrollen Sie zu "Access"
5. **Klicken Sie auf "SSH and GPG keys"**

**Oder verwenden Sie einfach den direkten Link:**
👉 https://github.com/settings/ssh/new

---

## ✅ Nach dem Hinzufügen

Testen Sie die Verbindung:

```bash
ssh -T git@github.com
```

**Erwartete Ausgabe:**
```
Hi cip050669! You've successfully authenticated, but GitHub does not provide shell access.
```

---

**Erstellt:** 6. Januar 2026

