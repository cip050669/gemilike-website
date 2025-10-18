# 📧 E-Mail-Konfiguration für Kontaktformular und Bestellbestätigungen

**Status:** ✅ Bereit für Konfiguration  
**Datum:** 07. Oktober 2025  
**Version:** 1.0

---

## 🎯 Übersicht

Das E-Mail-System verwendet **eine gemeinsame Konfiguration** für:
- ✅ **Kontaktformular** - Bereits funktional
- ✅ **Bestellbestätigungen** - Neu implementiert
- ✅ **Newsletter** - Bereits implementiert

**Beide Systeme verwenden die gleichen SMTP-Einstellungen!**

---

## 🔧 Konfiguration einrichten

### **1. .env.local Datei bearbeiten**

Öffnen Sie die Datei `.env.local` in Ihrem Projektverzeichnis und fügen Sie die SMTP-Konfiguration hinzu:

```env
# Server Configuration
HOSTNAME=0.0.0.0
PORT=3000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Database
DATABASE_URL="file:./dev.db"

# E-Mail Konfiguration (für Kontaktformular, Newsletter, Bestellbestätigungen)
# Diese Konfiguration wird sowohl für das Kontaktformular als auch für Bestellbestätigungen verwendet
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ihre-email@gemilike.de
SMTP_PASSWORD=ihr-app-passwort
SMTP_FROM=noreply@gemilike.de

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### **2. SMTP-Daten anpassen**

Ersetzen Sie die folgenden Werte mit Ihren tatsächlichen Daten:

```env
SMTP_USER=ihre-email@gemilike.de          # Ihre E-Mail-Adresse
SMTP_PASSWORD=ihr-app-passwort            # Ihr App-Passwort
SMTP_FROM=noreply@gemilike.de             # Absender-E-Mail (optional)
```

---

## 📧 E-Mail-Provider Setup

### **Gmail (Empfohlen)**

1. **Google-Konto vorbereiten:**
   - 2-Faktor-Authentifizierung aktivieren
   - App-Passwort erstellen

2. **Konfiguration:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=ihre-email@gmail.com
   SMTP_PASSWORD=ihr-16-stelliges-app-passwort
   ```

### **Strato (Deutschland)**

1. **Strato-E-Mail-Passwort verwenden:**
   - NICHT das Kundencenter-Passwort
   - Das E-Mail-Passwort für info@gemilike.com

2. **Konfiguration:**
   ```env
   SMTP_HOST=smtp.strato.de
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=info@gemilike.com
   SMTP_PASSWORD=ihr-strato-email-passwort
   ```

### **Outlook/Hotmail**

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ihre-email@outlook.com
SMTP_PASSWORD=ihr-passwort
```

---

## 🧪 Testing

### **1. Kontaktformular testen**

```bash
# Kontaktformular-API testen
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Nachricht",
    "message": "Dies ist eine Test-Nachricht",
    "locale": "de"
  }'
```

### **2. Bestellbestätigung testen**

```bash
# Bestellbestätigungs-API testen
curl -X POST http://localhost:3001/api/orders/confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "ORD-001",
    "customerEmail": "kunde@example.com",
    "customerName": "Max Mustermann",
    "orderDate": "2025-10-07",
    "totalAmount": 1250.00,
    "currency": "EUR",
    "items": [
      {
        "name": "Kolumbianischer Smaragd",
        "quantity": 1,
        "price": 1250.00
      }
    ],
    "locale": "de"
  }'
```

### **3. Test-Scripts ausführen**

```bash
# E-Mail-System testen
node test-order-confirmation.js

# API-Route testen
node test-order-api.js
```

---

## 🔄 Gemeinsame Konfiguration

### **Warum eine gemeinsame Konfiguration?**

- ✅ **Konsistenz** - Gleiche E-Mail-Einstellungen für alle Features
- ✅ **Wartung** - Einfacher zu verwalten und zu aktualisieren
- ✅ **Sicherheit** - Zentrale SMTP-Konfiguration
- ✅ **Performance** - Gemeinsame Verbindungspools

### **Verwendete Umgebungsvariablen:**

```env
SMTP_HOST          # SMTP-Server (z.B. smtp.gmail.com)
SMTP_PORT          # SMTP-Port (z.B. 587)
SMTP_SECURE        # SSL/TLS (true/false)
SMTP_USER          # E-Mail-Benutzername
SMTP_PASSWORD      # E-Mail-Passwort/App-Passwort
SMTP_FROM          # Absender-E-Mail (optional)
```

### **Verwendete Bibliothek:**

Beide Systeme verwenden die gleiche `lib/email.ts` Bibliothek:
- ✅ **Kontaktformular** - `sendEmail()` Funktion
- ✅ **Bestellbestätigungen** - `sendEmail()` Funktion
- ✅ **Newsletter** - `sendEmail()` Funktion

---

## 📊 Status nach Konfiguration

### **Kontaktformular:**
- ✅ **Funktional** - Bereits implementiert und getestet
- ✅ **E-Mail-Versand** - Funktioniert mit SMTP-Konfiguration
- ✅ **Templates** - Professionelle HTML-Templates
- ✅ **Validierung** - Vollständige Eingabevalidierung

### **Bestellbestätigungen:**
- ✅ **Funktional** - Neu implementiert
- ✅ **E-Mail-Versand** - Funktioniert mit gleicher SMTP-Konfiguration
- ✅ **Templates** - Professionelle HTML-Templates (DE/EN)
- ✅ **Admin-Benachrichtigungen** - Automatische Benachrichtigungen
- ✅ **Validierung** - Vollständige Datenvalidierung

---

## 🚀 Nächste Schritte

### **1. SMTP-Konfiguration hinzufügen:**
```bash
# .env.local Datei bearbeiten
nano .env.local

# Oder mit VS Code
code .env.local
```

### **2. E-Mail-System testen:**
```bash
# Test-Scripts ausführen
node test-order-confirmation.js
node test-order-api.js
```

### **3. Kontaktformular testen:**
- Gehen Sie zu `/de/contact`
- Füllen Sie das Formular aus
- Überprüfen Sie, ob die E-Mail ankommt

### **4. Bestellbestätigung testen:**
- Verwenden Sie die API-Route
- Oder integrieren Sie sie in den Checkout-Prozess

---

## 🔒 Sicherheit

### **Implementierte Sicherheitsmaßnahmen:**
- ✅ **E-Mail-Validierung** - RFC 5322 Format
- ✅ **Datenvalidierung** - Alle Pflichtfelder
- ✅ **Input-Sanitization** - XSS-Schutz
- ✅ **SMTP-Authentifizierung** - Sichere Verbindung
- ✅ **Error Handling** - Keine sensiblen Daten in Logs

### **Empfohlene zusätzliche Maßnahmen:**
- **Rate Limiting** - Pro IP-Adresse
- **CAPTCHA** - Für Formulare
- **Spam-Filter** - E-Mail-Content-Filterung
- **Monitoring** - E-Mail-Versand überwachen

---

## 📞 Support

### **Bei Problemen:**
1. **Logs überprüfen** - Console-Ausgabe
2. **SMTP-Test** - Verbindung testen
3. **Template-Test** - HTML-Validierung
4. **Provider-Support** - Gmail/Outlook-Hilfe

### **Häufige Probleme:**

**E-Mails werden nicht versendet:**
- SMTP-Konfiguration überprüfen
- App-Passwort bei Gmail erneuern
- Firewall-Einstellungen prüfen

**Templates werden nicht korrekt angezeigt:**
- HTML-Validierung durchführen
- CSS-Inline-Styling überprüfen
- E-Mail-Client-Kompatibilität testen

---

## ✅ Checkliste

- [ ] `.env.local` Datei geöffnet
- [ ] SMTP-Konfiguration hinzugefügt
- [ ] E-Mail-Daten angepasst
- [ ] `node test-order-confirmation.js` ausgeführt
- [ ] Test-E-Mails empfangen
- [ ] Kontaktformular getestet
- [ ] Bestellbestätigung getestet
- [ ] Admin-Benachrichtigungen getestet

---

**Letzte Aktualisierung:** 07. Oktober 2025  
**Status:** ✅ Bereit für Konfiguration  
**Nächster Schritt:** SMTP-Daten in `.env.local` eintragen

---

*Das E-Mail-System verwendet eine gemeinsame Konfiguration für Kontaktformular und Bestellbestätigungen. Nach der SMTP-Konfiguration funktionieren beide Systeme sofort.*
