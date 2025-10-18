# 📧 Strato E-Mail-Konfiguration

**E-Mail-Adresse:** info@gemilike.com  
**Provider:** Strato  
**Status:** ✅ Konfiguriert

---

## 🔧 Konfiguration

### **1. .env.local Datei erstellen**

Erstellen Sie eine `.env.local` Datei im Projektverzeichnis mit folgendem Inhalt:

```env
# NextAuth.js Konfiguration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Database
DATABASE_URL="file:./dev.db"

# E-Mail Konfiguration für Strato
SMTP_HOST=smtp.strato.de
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=info@gemilike.com
SMTP_PASSWORD=ihr-strato-passwort
SMTP_FROM=info@gemilike.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Payment Provider (optional)
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### **2. Strato-spezifische Einstellungen**

**SMTP-Konfiguration:**
- **Host:** `smtp.strato.de`
- **Port:** `587` (STARTTLS)
- **Sicherheit:** `false` (STARTTLS wird automatisch verwendet)
- **Benutzername:** `info@gemilike.com`
- **Passwort:** Ihr Strato-E-Mail-Passwort

### **3. Strato-E-Mail-Passwort**

**Wichtige Hinweise:**
- Verwenden Sie das **E-Mail-Passwort** für `info@gemilike.com`
- **NICHT** das Strato-Kundencenter-Passwort
- Falls Sie das E-Mail-Passwort nicht kennen, können Sie es im Strato-Kundencenter zurücksetzen

---

## 🧪 Testing

### **1. Lokaler Test**

Nach der Konfiguration können Sie das E-Mail-System testen:

```bash
# Development Server starten
npm run dev

# Test-E-Mail über Kontaktformular senden
# Gehen Sie zu: http://localhost:3000/de/contact
```

### **2. API-Test**

```bash
# Kontaktformular testen
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message from Strato configuration",
    "locale": "de"
  }'
```

### **3. Newsletter testen**

```bash
# Newsletter testen
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "locale": "de"
  }'
```

---

## 📧 E-Mail-Features

### **Kontaktformular:**
- **Empfänger:** info@gemilike.com
- **Betreff:** "Neue Kontaktanfrage - Gemilike"
- **Inhalt:** Vollständige Formulardaten

### **Newsletter:**
- **Empfänger:** Kunde (Bestätigungs-E-Mail)
- **Betreff:** "Newsletter-Anmeldung bestätigen - Gemilike"
- **Inhalt:** Willkommensnachricht und Newsletter-Informationen

### **Bestellbestätigungen:**
- **Empfänger:** Kunde + info@gemilike.com
- **Betreff:** "Bestellbestätigung #ORD-XXX - Gemilike"
- **Inhalt:** Bestelldetails und Admin-Benachrichtigung

---

## 🔒 Sicherheit

### **Strato-spezifische Sicherheitsmaßnahmen:**
- ✅ **STARTTLS-Verschlüsselung** - Sichere Übertragung
- ✅ **Authentifizierung** - Benutzername/Passwort
- ✅ **Rate Limiting** - Schutz vor Missbrauch
- ✅ **Spam-Schutz** - Strato-interne Filter

### **Empfohlene zusätzliche Maßnahmen:**
- **SPF-Record** in DNS einrichten
- **DKIM-Signatur** aktivieren (falls verfügbar)
- **DMARC-Policy** konfigurieren

---

## 🚀 Produktions-Deployment

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

2. **DNS-Konfiguration:**
```
# SPF-Record hinzufügen
TXT-Record: "v=spf1 include:strato.de ~all"
```

3. **Monitoring einrichten:**
- E-Mail-Versand überwachen
- Fehler-Logs prüfen
- Strato-E-Mail-Logs überwachen

---

## 🛠️ Troubleshooting

### **Häufige Probleme:**

#### **"Authentication failed"**
- **Lösung:** E-Mail-Passwort überprüfen
- **Check:** Strato-Kundencenter → E-Mail-Einstellungen

#### **"Connection timeout"**
- **Lösung:** Firewall-Einstellungen prüfen
- **Check:** Port 587 ist freigegeben

#### **"SSL/TLS Error"**
- **Lösung:** `SMTP_SECURE=false` verwenden
- **Check:** STARTTLS wird automatisch verwendet

### **Strato-spezifische Probleme:**

#### **E-Mails kommen nicht an:**
1. Strato-Spam-Ordner prüfen
2. E-Mail-Limits überprüfen
3. Strato-Support kontaktieren

#### **Rate Limiting:**
- Strato hat E-Mail-Limits pro Stunde
- Bei vielen E-Mails: Pause zwischen Versand

---

## 📞 Support

### **Bei Problemen:**
1. **Strato-Kundencenter** - E-Mail-Einstellungen prüfen
2. **Strato-Support** - Technischer Support
3. **E-Mail-Logs** - Console-Ausgabe überprüfen

### **Strato-Kontakt:**
- **Telefon:** 030 300 199 199
- **E-Mail:** support@strato.de
- **Kundencenter:** https://www.strato.de/kundencenter/

---

## ✅ Checkliste

- [ ] `.env.local` Datei erstellt
- [ ] Strato-E-Mail-Passwort eingetragen
- [ ] Development Server gestartet
- [ ] Kontaktformular getestet
- [ ] Newsletter getestet
- [ ] E-Mails empfangen
- [ ] Produktions-Konfiguration vorbereitet

---

**Letzte Aktualisierung:** 10. Oktober 2025  
**Status:** ✅ Bereit für Konfiguration  
**E-Mail:** info@gemilike.com

---

*Nach der Konfiguration ist das E-Mail-System vollständig funktionsfähig und bereit für den produktiven Einsatz.*
