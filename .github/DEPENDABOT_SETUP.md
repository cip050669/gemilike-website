# Dependabot Setup-Anleitung

## Wichtiger Hinweis: Zwei separate Features

GitHub hat **zwei verschiedene Dependabot-Features**:

1. **Dependabot Alerts** - Zeigt Sicherheitswarnungen für bekannte Schwachstellen
2. **Dependabot Updates** - Erstellt automatisch PRs für Dependency-Updates

## Dependabot Alerts aktivieren

### Schritt 1: Repository Settings
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

## Häufige Probleme

### Problem: "Dependabot alerts • Disabled" trotz Aktivierung

**Lösung 1: Repository-Berechtigungen prüfen**
- Stellen Sie sicher, dass Sie Admin-Rechte für das Repository haben
- Private Repositories benötigen GitHub Advanced Security (kostenpflichtig)

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

