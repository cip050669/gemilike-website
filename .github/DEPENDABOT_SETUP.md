# Dependabot Setup-Anleitung

## Wichtiger Hinweis: Private Repositories und GitHub Advanced Security

**Für private Repositories** benötigen Dependabot Alerts **GitHub Advanced Security** (kostenpflichtig).

**Alternative**: Die erstellten Security Workflows funktionieren auch ohne Dependabot Alerts!

## Dependabot Alerts (nur mit GitHub Advanced Security)

### Für private Repositories:
1. Gehen Sie zu: **Settings** → **Security** → **Advanced Security**
2. **GitHub Advanced Security** ist kostenpflichtig für private Repositories
3. Ohne Advanced Security sind **Dependabot Alerts nicht verfügbar**

### Für öffentliche Repositories:
1. Gehen Sie zu: **Settings** → **Security** → **Code security and analysis**
2. Scrollen Sie zu **"Dependabot alerts"**
3. Klicken Sie auf **"Enable"**

### Schritt 2: Warten auf erste Alerts
- GitHub scannt das Repository automatisch nach der Aktivierung
- **Wichtig**: Alerts werden nur für **neue** Schwachstellen generiert, die nach der Aktivierung entdeckt werden
- Bestehende Schwachstellen werden beim ersten Aktivieren **nicht** als Alerts angezeigt

### Schritt 3: Manueller Scan auslösen
Falls keine Alerts erscheinen:
1. Gehen Sie zu: **Security** → **Dependabot** (in der Repository-Navigation)
2. Klicken Sie auf **"Dependabot alerts"**
3. GitHub sollte automatisch scannen

## Dependabot Updates aktivieren

Die `.github/dependabot.yml` Datei ist bereits konfiguriert und aktiviert automatisch Dependabot Updates.

### Überprüfung:
1. Gehen Sie zu: **Settings** → **Security** → **Code security and analysis**
2. Scrollen Sie zu **"Dependabot version updates"**
3. Sollte automatisch aktiviert sein, wenn `dependabot.yml` vorhanden ist

## Alternative: Security Workflows (funktioniert ohne Advanced Security!)

Die erstellten GitHub Actions Workflows funktionieren **auch ohne Dependabot Alerts**:

1. **Security Audit** (`.github/workflows/security-audit.yml`)
   - Führt `npm audit` aus
   - Zeigt Schwachstellen in PRs an
   - Läuft automatisch bei jedem Push/PR

2. **Security Check** (`.github/workflows/security-check.yml`)
   - OWASP Dependency Check
   - Umfassende Sicherheitsprüfung
   - Erstellt detaillierte Reports

3. **Dependency Review** (`.github/workflows/dependency-review.yml`)
   - Prüft Dependency-Änderungen in PRs
   - Blockiert unsichere Updates

**Diese Workflows sind bereits aktiv und funktionieren ohne zusätzliche Kosten!**

## Häufige Probleme

### Problem: "Dependabot alerts • Disabled" - Keine Security Settings

**Ursache**: Private Repositories benötigen GitHub Advanced Security für Dependabot Alerts

**Lösung 1: Security Workflows verwenden (empfohlen)**
- Die erstellten Security Workflows funktionieren ohne Advanced Security
- Gehen Sie zu: **Actions** → **Security Audit** oder **Security Check**
- Diese zeigen alle Schwachstellen an

**Lösung 2: Repository öffentlich machen (falls möglich)**
- Öffentliche Repositories haben kostenlosen Zugang zu Dependabot Alerts
- Gehen Sie zu: **Settings** → **General** → **Danger Zone** → **Change visibility**

**Lösung 3: GitHub Advanced Security aktivieren (kostenpflichtig)**
- Für private Repositories mit vollem Dependabot Support
- Gehen Sie zu: **Settings** → **Security** → **Advanced Security**

**Lösung 2: Manueller Scan**
1. Gehen Sie zu: **Security** → **Dependabot**
2. Klicken Sie auf **"Dependabot alerts"**
3. Warten Sie einige Minuten, bis der Scan abgeschlossen ist

**Lösung 3: GitHub Actions prüfen**
- Gehen Sie zu: **Actions** → **Security Audit**
- Prüfen Sie, ob der Workflow läuft und Ergebnisse liefert

**Lösung 4: Repository neu scannen**
1. Gehen Sie zu: **Settings** → **Security** → **Code security and analysis**
2. Deaktivieren Sie "Dependabot alerts"
3. Warten Sie 1 Minute
4. Aktivieren Sie "Dependabot alerts" erneut
5. Warten Sie 5-10 Minuten auf den ersten Scan

## Bekannte Schwachstellen im Projekt

Aktuell gibt es bekannte Schwachstellen in:
- `xlsx` (Version 0.18.5) - High Severity
  - Prototype Pollution (CVE)
  - ReDoS (Regular Expression Denial of Service)

**Empfehlung**: Update auf `xlsx@^0.20.2` oder höher

## Benachrichtigungen konfigurieren

1. Gehen Sie zu: **Settings** → **Notifications**
2. Aktivieren Sie: **"Security alerts"**
3. Wählen Sie Ihre bevorzugten Benachrichtigungskanäle (E-Mail, Web, etc.)

## Weitere Ressourcen

- [GitHub Dependabot Dokumentation](https://docs.github.com/en/code-security/dependabot)
- [Dependabot Alerts konfigurieren](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/configuring-dependabot-alerts)

