# 🚀 Strato E-Mail-Setup - Finale Anleitung

**E-Mail:** info@gemilike.com  
**Status:** ✅ Konfiguration vorbereitet  
**Nächster Schritt:** Passwort eintragen und testen

---

## 📋 **Was wurde bereits konfiguriert:**

✅ **E-Mail-System** - Vollständig implementiert  
✅ **Strato-Konfiguration** - .env.local erstellt  
✅ **Test-Script** - test-email.js bereit  
✅ **API-Endpunkte** - Kontakt, Newsletter, Bestellungen  
✅ **E-Mail-Templates** - Professionelle HTML-Templates  

---

## 🔧 **Nächste Schritte:**

### **1. Strato-E-Mail-Passwort eintragen**

**Öffnen Sie die Datei `.env.local` und ersetzen Sie:**
```env
SMTP_PASSWORD=your-strato-password
```

**Durch Ihr tatsächliches Strato-E-Mail-Passwort:**
```env
SMTP_PASSWORD=ihr-echtes-strato-email-passwort
```

### **2. E-Mail-System testen**

**Führen Sie den Test aus:**
```bash
node test-email.js
```

**Erwartete Ausgabe:**
```
🧪 Teste Strato E-Mail-Konfiguration...

📧 Konfiguration:
Host: smtp.strato.de
Port: 587
User: info@gemilike.com
From: info@gemilike.com
Secure: false

🔗 Teste SMTP-Verbindung...
✅ SMTP-Verbindung erfolgreich!

📤 Sende Test-E-Mail...
✅ Test-E-Mail erfolgreich gesendet!
Message ID: <message-id>

🎉 E-Mail-System ist vollständig funktionsfähig!
```

### **3. Website testen**

**Starten Sie den Development Server:**
```bash
npm run dev
```

**Testen Sie das Kontaktformular:**
1. Gehen Sie zu: `http://localhost:3000/de/contact`
2. Füllen Sie das Formular aus
3. Senden Sie eine Test-Nachricht
4. Prüfen Sie Ihr E-Mail-Postfach (info@gemilike.com)

---

## 📧 **E-Mail-Features im Detail:**

### **Kontaktformular:**
- **URL:** `/de/contact` oder `/en/contact`
- **Empfänger:** info@gemilike.com
- **Betreff:** "Neue Kontaktanfrage - Gemilike"
- **Inhalt:** Vollständige Formulardaten in strukturierter Form

### **Newsletter:**
- **URL:** Newsletter oder `/de/newsletter`
- **Empfänger:** Kunde (Bestätigungs-E-Mail)
- **Betreff:** "Newsletter-Anmeldung bestätigen - Gemilike"
- **Inhalt:** Willkommensnachricht und Newsletter-Informationen

### **Bestellbestätigungen:**
- **API:** `POST /api/orders/confirmation`
- **Empfänger:** Kunde + info@gemilike.com
- **Betreff:** "Bestellbestätigung #ORD-XXX - Gemilike"
- **Inhalt:** Bestelldetails und Admin-Benachrichtigung

---

## 🧪 **Test-Szenarien:**

### **1. Kontaktformular testen:**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Max Mustermann",
    "email": "test@example.com",
    "subject": "Test von Strato-Konfiguration",
    "message": "Diese E-Mail wurde über die Strato-Konfiguration gesendet.",
    "locale": "de"
  }'
```

### **2. Newsletter testen:**
```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "locale": "de"
  }'
```

### **3. Bestellbestätigung testen:**
```bash
curl -X POST http://localhost:3000/api/orders/confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "TEST-001",
    "customerEmail": "test@example.com",
    "customerName": "Test Kunde",
    "orderDate": "2025-01-10",
    "totalAmount": 99.99,
    "currency": "EUR",
    "items": [
      {
        "name": "Test Edelstein",
        "quantity": 1,
        "price": 99.99
      }
    ],
    "locale": "de"
  }'
```

---

## 🔒 **Sicherheitshinweise:**

### **Passwort-Sicherheit:**
- ✅ Verwenden Sie das **E-Mail-Passwort** (nicht das Strato-Kundencenter-Passwort)
- ✅ Das Passwort wird in der `.env.local` Datei gespeichert (nicht in Git)
- ✅ Für die Produktion: Starkes, eindeutiges Passwort verwenden

### **Strato-spezifische Sicherheit:**
- ✅ **STARTTLS-Verschlüsselung** wird automatisch verwendet
- ✅ **Authentifizierung** über Benutzername/Passwort
- ✅ **Rate Limiting** durch Strato (E-Mails pro Stunde begrenzt)

---

## 🚀 **Produktions-Deployment:**

### **Für die Live-Website:**

1. **Umgebungsvariablen anpassen:**
```env
NEXTAUTH_URL=https://gemilike.com
SMTP_HOST=smtp.strato.de
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@gemilike.com
SMTP_PASSWORD=production-strato-password
SMTP_FROM=info@gemilike.com
```

2. **DNS-Konfiguration (optional):**
```
# SPF-Record hinzufügen
TXT-Record: "v=spf1 include:strato.de ~all"
```

3. **Monitoring:**
- E-Mail-Versand überwachen
- Fehler-Logs prüfen
- Strato-E-Mail-Logs überwachen

---

## 🛠️ **Troubleshooting:**

### **Häufige Probleme:**

#### **"Authentication failed"**
- **Lösung:** E-Mail-Passwort überprüfen
- **Check:** Strato-Kundencenter → E-Mail-Einstellungen

#### **"Connection timeout"**
- **Lösung:** Firewall-Einstellungen prüfen
- **Check:** Port 587 ist freigegeben

#### **E-Mails kommen nicht an:**
- **Lösung:** Strato-Spam-Ordner prüfen
- **Check:** E-Mail-Limits überprüfen

### **Strato-Support:**
- **Telefon:** 030 300 199 199
- **E-Mail:** support@strato.de
- **Kundencenter:** https://www.strato.de/kundencenter/

---

## ✅ **Checkliste:**

- [ ] `.env.local` Datei geöffnet
- [ ] Strato-E-Mail-Passwort eingetragen
- [ ] `node test-email.js` ausgeführt
- [ ] Test-E-Mail empfangen
- [ ] `npm run dev` gestartet
- [ ] Kontaktformular getestet
- [ ] Newsletter getestet
- [ ] E-Mails in info@gemilike.com empfangen

---

## 🎉 **Nach erfolgreichem Test:**

Das E-Mail-System ist dann vollständig funktionsfähig und bereit für:

✅ **Kontaktformular-E-Mails** - Automatische Benachrichtigungen  
✅ **Newsletter-Bestätigungen** - Professionelle E-Mails  
✅ **Bestellbestätigungen** - Kunden- und Admin-Benachrichtigungen  
✅ **Produktive Nutzung** - Live-Website bereit  

---

**Letzte Aktualisierung:** 10. Oktober 2025  
**Status:** ✅ Bereit für Passwort-Eingabe und Test  
**E-Mail:** info@gemilike.com

---

*Nach dem Test ist das E-Mail-System vollständig einsatzbereit!*
