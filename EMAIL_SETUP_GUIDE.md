# 📧 E-Mail-System Setup Guide

**Datum:** 10. Oktober 2025  
**Status:** ✅ Implementiert  
**Version:** 1.0

---

## 🎯 Übersicht

Das E-Mail-System für die Gemilike Website ist vollständig implementiert und umfasst:

- ✅ **Kontaktformular-E-Mails** - Automatische Benachrichtigungen
- ✅ **Newsletter-Bestätigungen** - Double-Opt-In System
- ✅ **Bestellbestätigungen** - Kunden- und Admin-Benachrichtigungen
- ✅ **Professionelle E-Mail-Templates** - Responsive HTML-Templates
- ✅ **Mehrsprachigkeit** - Deutsche und englische E-Mails

---

## 🔧 Konfiguration

### 1. **Umgebungsvariablen einrichten**

Erstellen Sie eine `.env.local` Datei im Projektverzeichnis:

```env
# E-Mail Konfiguration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gemilike.de
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@gemilike.de
```

### 2. **Gmail-Konfiguration (Empfohlen)**

#### **Schritt 1: Google-Konto vorbereiten**
1. Gehen Sie zu [Google-Kontoeinstellungen](https://myaccount.google.com/)
2. Aktivieren Sie die **2-Faktor-Authentifizierung**
3. Gehen Sie zu **Sicherheit** → **App-Passwörter**
4. Erstellen Sie ein App-Passwort für "Mail"

#### **Schritt 2: E-Mail-Konfiguration**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ihre-email@gmail.com
SMTP_PASSWORD=ihr-16-stelliges-app-passwort
SMTP_FROM=noreply@gemilike.de
```

### 3. **Alternative E-Mail-Provider**

#### **Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ihre-email@outlook.com
SMTP_PASSWORD=ihr-passwort
```

#### **Strato (Deutschland):**
```env
SMTP_HOST=smtp.strato.de
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ihre-email@strato.de
SMTP_PASSWORD=ihr-passwort
```

#### **SendGrid (Professionell):**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=ihr-sendgrid-api-key
```

---

## 📧 E-Mail-Features

### **1. Kontaktformular-E-Mails**

**Funktionalität:**
- Automatische Benachrichtigung bei neuen Kontaktanfragen
- Professionelle HTML-Templates
- Mehrsprachige E-Mails (DE/EN)
- Vollständige Formulardaten in strukturierter Form

**API-Endpunkt:** `POST /api/contact`

**Beispiel-Request:**
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "subject": "Frage zu Edelsteinen",
  "message": "Hallo, ich interessiere mich für...",
  "locale": "de"
}
```

### **2. Newsletter-Bestätigungen**

**Funktionalität:**
- Automatische Bestätigungs-E-Mails
- Professionelle Newsletter-Templates
- Informationen über Newsletter-Inhalte
- Abmelde-Hinweise

**API-Endpunkt:** `POST /api/newsletter`

**Beispiel-Request:**
```json
{
  "email": "subscriber@example.com",
  "locale": "de"
}
```

### **3. Bestellbestätigungen**

**Funktionalität:**
- Automatische Bestellbestätigungen an Kunden
- Admin-Benachrichtigungen über neue Bestellungen
- Vollständige Bestelldetails
- Professionelle Rechnungs-Templates

**API-Endpunkt:** `POST /api/orders/confirmation`

**Beispiel-Request:**
```json
{
  "orderNumber": "ORD-2025-001",
  "customerEmail": "customer@example.com",
  "customerName": "Max Mustermann",
  "orderDate": "2025-01-10",
  "totalAmount": 299.99,
  "currency": "EUR",
  "items": [
    {
      "name": "Kolumbianischer Smaragd",
      "quantity": 1,
      "price": 299.99
    }
  ],
  "locale": "de"
}
```

---

## 🎨 E-Mail-Templates

### **Template-Features:**
- ✅ **Responsive Design** - Funktioniert auf allen Geräten
- ✅ **Professionelle Optik** - Corporate Design
- ✅ **Mehrsprachigkeit** - Deutsche und englische Versionen
- ✅ **Strukturierte Daten** - Übersichtliche Darstellung
- ✅ **Branding** - Gemilike-Logo und -Farben

### **Verfügbare Templates:**
1. **Kontaktformular** - Admin-Benachrichtigungen
2. **Newsletter** - Bestätigungs-E-Mails
3. **Bestellbestätigung** - Kunden- und Admin-E-Mails

---

## 🧪 Testing

### **1. Lokales Testing**

**Ohne SMTP-Konfiguration:**
- E-Mails werden in der Konsole geloggt
- API gibt Erfolgsmeldung zurück
- Keine tatsächlichen E-Mails werden versendet

**Mit SMTP-Konfiguration:**
- E-Mails werden tatsächlich versendet
- Vollständige Funktionalität verfügbar

### **2. Test-E-Mails senden**

**Kontaktformular testen:**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Message",
    "message": "This is a test message",
    "locale": "de"
  }'
```

**Newsletter testen:**
```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "locale": "de"
  }'
```

### **3. E-Mail-Validierung**

Das System validiert automatisch:
- ✅ E-Mail-Format (RFC 5322)
- ✅ Pflichtfelder
- ✅ SMTP-Verbindung
- ✅ Template-Generierung

---

## 🔒 Sicherheit

### **Implementierte Sicherheitsmaßnahmen:**
- ✅ **E-Mail-Validierung** - Schutz vor Spam
- ✅ **Rate Limiting** - Schutz vor Missbrauch
- ✅ **Input-Sanitization** - XSS-Schutz
- ✅ **SMTP-Authentifizierung** - Sichere Verbindung
- ✅ **Error Handling** - Keine sensiblen Daten in Logs

### **Empfohlene zusätzliche Maßnahmen:**
- **CAPTCHA** - Für Kontaktformular
- **Rate Limiting** - Pro IP-Adresse
- **Spam-Filter** - E-Mail-Content-Filterung
- **Monitoring** - E-Mail-Versand überwachen

---

## 📊 Monitoring & Logging

### **Logs:**
- ✅ **Erfolgreiche E-Mails** - Message-ID wird geloggt
- ✅ **Fehler** - Detaillierte Fehlermeldungen
- ✅ **SMTP-Status** - Verbindungsstatus
- ✅ **Template-Generierung** - Template-Erstellung

### **Monitoring:**
```javascript
// Beispiel-Log-Ausgabe
console.log('E-Mail erfolgreich gesendet:', result.messageId);
console.log('Newsletter subscription successful:', email, 'MessageId:', emailResult.messageId);
console.log('Order confirmation emails sent successfully:', {
  customer: emailResult.messageId,
  admin: adminEmailResult.messageId
});
```

---

## 🚀 Deployment

### **Produktions-Deployment:**

1. **Umgebungsvariablen setzen:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=production@gemilike.de
SMTP_PASSWORD=production-app-password
SMTP_FROM=noreply@gemilike.de
```

2. **DNS-Konfiguration:**
- SPF-Record: `v=spf1 include:_spf.google.com ~all`
- DKIM-Signatur aktivieren
- DMARC-Policy einrichten

3. **Monitoring einrichten:**
- E-Mail-Versand überwachen
- Fehler-Alerts konfigurieren
- Performance-Metriken tracken

---

## 🛠️ Wartung

### **Regelmäßige Aufgaben:**
- **E-Mail-Logs überprüfen** - Wöchentlich
- **SMTP-Verbindung testen** - Täglich
- **Template-Updates** - Bei Design-Änderungen
- **Sicherheits-Updates** - Monatlich

### **Troubleshooting:**

**E-Mails werden nicht versendet:**
1. SMTP-Konfiguration überprüfen
2. App-Passwort bei Gmail erneuern
3. Firewall-Einstellungen prüfen
4. Logs auf Fehlermeldungen überprüfen

**Templates werden nicht korrekt angezeigt:**
1. HTML-Validierung durchführen
2. CSS-Inline-Styling überprüfen
3. E-Mail-Client-Kompatibilität testen

---

## 📞 Support

### **Bei Problemen:**
1. **Logs überprüfen** - Console-Ausgabe
2. **SMTP-Test** - Verbindung testen
3. **Template-Test** - HTML-Validierung
4. **Provider-Support** - Gmail/Outlook-Hilfe

### **Nützliche Ressourcen:**
- [Nodemailer Dokumentation](https://nodemailer.com/about/)
- [Gmail SMTP Setup](https://support.google.com/mail/answer/7126229)
- [E-Mail-Template Best Practices](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)

---

**Letzte Aktualisierung:** 10. Oktober 2025  
**Nächste Überprüfung:** Januar 2026  
**Status:** ✅ Produktionsbereit

---

*Das E-Mail-System ist vollständig implementiert und bereit für den produktiven Einsatz.*
