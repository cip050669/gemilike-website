# Admin-E-Mail Konfiguration

**Datum:** 2025-01-15

Diese Anleitung erklärt, wie die Admin-E-Mail für Benachrichtigungen konfiguriert wird.

---

## 🎯 Übersicht

Die Admin-E-Mail wird für folgende Benachrichtigungen verwendet:
- ✅ **Review-Benachrichtigungen** - Neue Produktbewertungen
- 🔄 Weitere Admin-Benachrichtigungen (künftig)

---

## ⚙️ Konfiguration (Priorität)

Die Admin-E-Mail wird in folgender Reihenfolge gesucht:

### 1. **Umgebungsvariable `ADMIN_EMAIL`** (Höchste Priorität) ✅
```bash
# In .env.local oder .env.production
ADMIN_EMAIL=admin@gemilike.com
```

**Vorteile:**
- ✅ Einfache Konfiguration
- ✅ Unterschiedliche E-Mails für verschiedene Umgebungen (Development, Production)
- ✅ Keine Datenbankänderungen nötig
- ✅ Sicherheit: Kann in ENV-Variablen des Hosting-Providers gesetzt werden

### 2. **CompanySettings.email** (Fallback) ✅
Die E-Mail aus den Firmeneinstellungen wird verwendet, wenn `ADMIN_EMAIL` nicht gesetzt ist.

**Über Admin-Panel konfigurieren:**
1. Navigiere zu: `/admin/settings`
2. Bearbeite Firmeneinstellungen
3. Setze das `email` Feld
4. Speichern

**Über API konfigurieren:**
```bash
PUT /api/admin/company-settings
{
  "email": "admin@gemilike.com",
  ...
}
```

### 3. **Default: `admin@gemilike.com`** (Letzter Fallback) ⚠️
Wenn weder ENV-Variable noch CompanySettings vorhanden sind, wird `admin@gemilike.com` verwendet.

**Hinweis:** Eine Warnung wird in der Console ausgegeben:
```
Admin email not configured. Using default. Please set ADMIN_EMAIL in environment variables or companySettings.email in database.
```

---

## 🚀 Schnellstart

### Option 1: ENV-Variable (Empfohlen)

1. **Erstelle oder bearbeite `.env.local`:**
```bash
# Im Projekt-Root
echo "ADMIN_EMAIL=admin@gemilike.com" >> .env.local
```

2. **Oder setze beim Deployment:**
   - **Vercel:** Environment Variables → `ADMIN_EMAIL`
   - **Strato:** Environment Variables → `ADMIN_EMAIL`
   - **Andere:** Entsprechendes ENV-Management-Tool

3. **Server neu starten** (wenn bereits läuft)

### Option 2: Über Datenbank (CompanySettings)

1. **Via Admin-Panel:**
   - `/admin/settings` → E-Mail-Feld setzen → Speichern

2. **Via API:**
```bash
curl -X PUT http://localhost:3000/api/admin/company-settings \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gemilike.com",
    "companyName": "Gemilike",
    ...
  }'
```

---

## ✅ Testen der Konfiguration

### 1. Test: Review erstellen
1. Erstelle eine Review auf einer Produktseite
2. Prüfe Server-Logs:
   ```
   E-Mail wurde gesendet an: admin@gemilike.com
   ```
3. Prüfe Admin-E-Mail-Postfach für Benachrichtigung

### 2. Test: Konfiguration prüfen
```bash
# Prüfe ENV-Variable (in Server-Logs)
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

# Prüfe CompanySettings
curl http://localhost:3000/api/admin/company-settings | jq '.settings.email'
```

---

## 🔍 Troubleshooting

### Problem: Keine E-Mails erhalten

**Lösung 1: Prüfe ENV-Variable**
```bash
# Im Terminal
echo $ADMIN_EMAIL

# In Next.js (Server-Side)
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
```

**Lösung 2: Prüfe CompanySettings**
- Admin-Panel: `/admin/settings`
- Oder API: `GET /api/admin/company-settings`

**Lösung 3: Prüfe SMTP-Konfiguration**
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` müssen gesetzt sein
- Siehe `ENV_VARIABLES.md` für Details

**Lösung 4: Prüfe Console-Logs**
- Warnung: "Admin email not configured" → Konfiguration fehlt
- Fehler bei E-Mail-Versand → SMTP-Konfiguration prüfen

### Problem: Falsche E-Mail-Adresse

**Lösung:** Priorität prüfen:
1. `ADMIN_EMAIL` ENV-Variable hat Vorrang
2. Falls nicht gesetzt → `companySettings.email`
3. Falls nicht gesetzt → Default `admin@gemilike.com`

**Empfehlung:** ENV-Variable setzen für klare Kontrolle

---

## 📝 Code-Implementierung

Die Implementierung befindet sich in:
- **Datei:** `lib/services/review-notifications.ts`
- **Funktion:** `sendReviewNotificationEmail()`

```typescript
// Get admin email: Priority: ENV > CompanySettings > Default
let adminEmail = process.env.ADMIN_EMAIL;

// If not in ENV, check company settings
if (!adminEmail) {
  const companySettings = await prisma.companySettings.findFirst();
  adminEmail = companySettings?.email;
}

// Fallback to default if neither is set
if (!adminEmail) {
  adminEmail = 'admin@gemilike.com';
  console.warn('Admin email not configured...');
}
```

---

## 🔒 Sicherheit

- ✅ **ENV-Variablen** sind sicher und nicht im Code sichtbar
- ✅ **CompanySettings** sind nur über Admin-Auth zugänglich
- ⚠️ **Default-E-Mail** ist öffentlich im Code → Bitte konfigurieren!

---

## 📚 Weitere Informationen

- **ENV_VARIABLES.md** - Vollständige Liste aller Umgebungsvariablen
- **TESTING_GUIDE.md** - Test-Anleitung für neue Features
- **EMAIL_CONFIG_SETUP.md** - SMTP-Konfiguration

