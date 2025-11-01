# Umgebungsvariablen (Environment Variables)

**Datum:** 2025-01-15

Diese Datei dokumentiert alle verwendeten Umgebungsvariablen im Projekt.

---

## E-Mail-Konfiguration

### SMTP-Einstellungen
```bash
# SMTP Server (Standard: smtp.strato.de)
SMTP_HOST=smtp.strato.de

# SMTP Port (Standard: 587)
SMTP_PORT=587

# SMTP Secure (Standard: false)
SMTP_SECURE=false

# SMTP Benutzer (Standard: info@gemilike.com)
SMTP_USER=info@gemilike.com

# SMTP Passwort
SMTP_PASSWORD=dein_passwort

# SMTP From-Adresse (Standard: SMTP_USER oder noreply@gemilike.com)
SMTP_FROM=info@gemilike.com

# SMTP Transport Mode (file = Mock für Entwicklung, smtp = Echter Versand)
SMTP_TRANSPORT=smtp

# SMTP Fallback to File (bei Fehlern in Datei schreiben)
SMTP_FALLBACK_TO_FILE=false

# SMTP Output Directory (für Mock-Modus)
SMTP_OUTPUT_DIR=tmp/emails
```

### Admin-E-Mail
```bash
# Admin-E-Mail für Benachrichtigungen (Review-Benachrichtigungen, etc.)
# Priorität: 1. ENV-Variable, 2. CompanySettings.email, 3. Default (admin@gemilike.com)
ADMIN_EMAIL=admin@gemilike.com
```

**Hinweis:** Die Admin-E-Mail wird in folgender Reihenfolge gesucht:
1. `ADMIN_EMAIL` Umgebungsvariable (höchste Priorität)
2. `companySettings.email` aus der Datenbank
3. Fallback: `admin@gemilike.com`

---

## Datenbank

```bash
# PostgreSQL Connection String
DATABASE_URL=postgresql://user:password@localhost:5432/gemilike
```

---

## Next.js & App-Konfiguration

```bash
# Public App URL (für Links in E-Mails)
NEXT_PUBLIC_APP_URL=https://gemilike.com

# Node Environment
NODE_ENV=production

# NextAuth Secret (für JWT-Tokens)
NEXTAUTH_SECRET=dein_secret_key

# NextAuth URL
NEXTAUTH_URL=https://gemilike.com
```

---

## Beispiel .env.local

```bash
# Datenbank
DATABASE_URL=postgresql://user:password@localhost:5432/gemilike

# E-Mail
SMTP_HOST=smtp.strato.de
SMTP_PORT=587
SMTP_USER=info@gemilike.com
SMTP_PASSWORD=dein_smtp_passwort
SMTP_FROM=info@gemilike.com
SMTP_TRANSPORT=smtp

# Admin-E-Mail für Benachrichtigungen
ADMIN_EMAIL=admin@gemilike.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=dein_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

---

## Wichtige Hinweise

1. **ADMIN_EMAIL**: Diese E-Mail-Adresse erhält:
   - Review-Benachrichtigungen (neue Produktbewertungen)
   - Weitere Admin-Benachrichtigungen (künftig)

2. **SMTP-Konfiguration**: 
   - Für Produktion: `SMTP_TRANSPORT=smtp` verwenden
   - Für Entwicklung: `SMTP_TRANSPORT=file` verwenden (E-Mails werden in Dateien gespeichert)

3. **Sicherheit**: 
   - `.env.local` niemals committen!
   - Sensible Daten nur in Umgebungsvariablen, nicht im Code

4. **Fallback**: 
   - Wenn `ADMIN_EMAIL` nicht gesetzt ist, wird automatisch `companySettings.email` verwendet
   - Falls auch das fehlt: `admin@gemilike.com` (mit Warnung in Console)

---

## Konfiguration in der Datenbank

Alternativ kann die Admin-E-Mail auch über die Datenbank konfiguriert werden:
- Tabelle: `CompanySettings`
- Feld: `email`
- Diese E-Mail wird verwendet, wenn `ADMIN_EMAIL` ENV-Variable nicht gesetzt ist

**Verwaltung über Admin-Panel:**
- `/admin/settings` → Firmeneinstellungen bearbeiten → E-Mail-Feld

