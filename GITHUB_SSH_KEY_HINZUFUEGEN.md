# 🔐 SSH-Key zu GitHub hinzufügen - Schritt-für-Schritt

**Datum:** 6. Januar 2026

---

## 🎯 Direkter Link

**SSH Keys hinzufügen:**
👉 https://github.com/settings/ssh/new

**Oder über das Menü:**

### Methode 1: Über Profil → Settings

1. **Klicken Sie auf Ihr Profilbild** (oben rechts auf GitHub)
2. **Klicken Sie auf "Settings"**
3. **Scrollen Sie nach unten** im linken Menü zu **"Access"**
4. **Klicken Sie auf "SSH and GPG keys"**
5. **Klicken Sie auf "New SSH key"** (grüner Button)

### Methode 2: Direkter Link zu allen SSH Keys

👉 https://github.com/settings/keys

---

## 📋 SSH-Key hinzufügen

### Ihr Public Key (kopieren Sie diesen komplett):

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIO9uDzkAWXdc4rYugHk658EMVzkofPxKBTyLup7iYNdD christian@pies.com.de
```

### Formular ausfüllen:

1. **Title:** 
   - z.B. "Gemilike Website Server"
   - oder "Development Server"
   - oder einfach "Server"

2. **Key type:**
   - Wählen Sie **"Authentication Key"**

3. **Key:**
   - Fügen Sie den kompletten Public Key ein (siehe oben)
   - Beginnt mit `ssh-ed25519` und endet mit `christian@pies.com.de`

4. **Klicken Sie auf "Add SSH key"**

---

## ✅ Nach dem Hinzufügen

### Testen Sie die Verbindung:

```bash
ssh -T git@github.com
```

**Erwartete Ausgabe:**
```
Hi cip050669! You've successfully authenticated, but GitHub does not provide shell access.
```

Wenn Sie diese Nachricht sehen, funktioniert alles! ✅

---

## 🔍 Falls Sie den Menüpunkt nicht finden

### Alternative: Über die URL direkt

1. Gehen Sie zu: **https://github.com/settings/keys**
2. Oder: **https://github.com/settings/ssh/new**

### Screenshot-Hinweise:

- **Profilbild:** Oben rechts auf jeder GitHub-Seite
- **Settings:** Im Dropdown-Menü unter Ihrem Profilbild
- **Access:** Im linken Seitenmenü, ganz unten
- **SSH and GPG keys:** Unter "Access"

---

## 🆘 Troubleshooting

### Problem: "Permission denied (publickey)"

**Lösung:**
1. Prüfen Sie, ob der SSH-Key korrekt hinzugefügt wurde
2. Prüfen Sie, ob Sie den **kompletten** Key kopiert haben (von `ssh-ed25519` bis `christian@pies.com.de`)
3. Testen Sie erneut: `ssh -T git@github.com`

### Problem: "Host key verification failed"

**Lösung:**
```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

### Problem: Menüpunkt nicht sichtbar

**Mögliche Ursachen:**
- Sie sind nicht eingeloggt
- Sie verwenden eine Organisation statt Ihres persönlichen Accounts
- JavaScript ist deaktiviert

**Lösung:**
- Verwenden Sie den direkten Link: https://github.com/settings/ssh/new

---

## 📝 Checkliste

- [ ] SSH-Key zu GitHub hinzugefügt
- [ ] SSH-Verbindung getestet (`ssh -T git@github.com`)
- [ ] Alten Personal Access Token widerrufen
- [ ] Git-Operationen funktionieren (z.B. `git fetch`)

---

**Erstellt:** 6. Januar 2026

