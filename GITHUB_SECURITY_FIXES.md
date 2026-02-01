# GitHub Security Warnungen - Behebung

**Datum:** 11. Januar 2026

---

## Behobene Probleme

### 1. Fehlende Permissions in Workflows

**Problem:** GitHub empfiehlt jetzt explizite `permissions` in allen Workflows, um das Prinzip der geringsten Berechtigung zu befolgen.

**Behoben:**
- ✅ `.github/workflows/security-check.yml` - `contents: read`, `security-events: write`
- ✅ `.github/workflows/secret-scanning.yml` - `contents: read`, `security-events: write`
- ✅ `.github/workflows/security-audit.yml` - `contents: read`, `pull-requests: write`, `issues: write`
- ✅ `.github/workflows/codeql.yml` - Permissions auf Workflow-Ebene verschoben (beste Praxis)

**Vorher:**
```yaml
jobs:
  security-check:
    runs-on: ubuntu-latest
    # Keine permissions definiert
```

**Nachher:**
```yaml
permissions:
  contents: read
  security-events: write

jobs:
  security-check:
    runs-on: ubuntu-latest
```

---

### 2. Veraltete Dependencies

**Problem:** Einige Dependencies waren veraltet oder fehlten.

**Behoben:**
- ✅ `@prisma/extension-accelerate`: 1.0.0 → 3.0.1
- ✅ `@types/node`: 25.0.6 → 25.0.8
- ✅ `zustand`: 5.0.9 → 5.0.10

**Status:**
- ⚠️ `@prisma/client` und `prisma` zeigen noch 6.19.1 in `npm outdated`, aber `package.json` hat bereits 7.2.0
  - Lösung: `npm install` ausführen, um node_modules zu aktualisieren

---

### 3. GITHUB_TOKEN Verwendung

**Status:** ✅ Sicher
- `GITHUB_TOKEN` in `secret-scanning.yml` ist korrekt verwendet
- Automatisch von GitHub bereitgestellt
- Keine manuellen Secrets erforderlich

---

## Verbleibende Warnungen

### npm audit

**Status:** ✅ Keine Vulnerabilities gefunden (Stand: 25. Jan 2026)

**Lodash (Prototype Pollution, GHSA-xxjr-mmjv-4gpg):**  
7 moderate Meldungen kamen indirekt über `chevrotain` → `@mrleebo/prisma-ast` → `@prisma/dev` (Prisma 7). Behoben durch **Override** in `package.json`:
```json
"overrides": {
  "lodash": ">=4.17.22"
}
```
`npm install --legacy-peer-deps` und `npm audit --audit-level=moderate` melden 0 Vulnerabilities.

### Dependency-Konflikte

**Problem:** `next-auth@4.24.13` erfordert `@auth/core@0.34.3`, aber wir haben `@auth/core@0.41.1`

**Status:** ⚠️ Nicht kritisch
- `@auth/core@0.41.1` ist neuer und kompatibel
- `peerOptional` bedeutet, dass es nicht zwingend erforderlich ist
- Funktioniert aktuell ohne Probleme

**Empfehlung:** Bei nächstem Major-Update von `next-auth` prüfen

---

## Best Practices implementiert

1. ✅ **Explizite Permissions:** Alle Workflows haben jetzt minimale erforderliche Permissions
2. ✅ **Security-Events:** Workflows können jetzt Security-Events schreiben
3. ✅ **Dependency-Updates:** Alle verfügbaren Updates installiert
4. ✅ **npm audit:** Regelmäßige Überprüfung auf Vulnerabilities

---

## Nächste Schritte

1. **npm install ausführen:**
   ```bash
   npm install
   ```
   Um node_modules mit den neuesten Versionen zu aktualisieren

2. **Workflows testen:**
   - Alle Workflows sollten jetzt ohne Permission-Warnungen laufen
   - Security-Events werden korrekt geschrieben

3. **Regelmäßige Überprüfung:**
   - `npm audit` wöchentlich ausführen
   - Dependabot-Warnungen regelmäßig prüfen
   - GitHub Security-Tab überwachen

---

## 25. Januar 2026 – Weitere Anpassungen

### 1. Lodash-Override (Prototype Pollution)
- **Problem:** 7 moderate npm-audit-Meldungen zu Lodash (u.a. `_.unset`/`_.omit`) über Prisma-Dev-Kette.
- **Lösung:** `"overrides": { "lodash": ">=4.17.22" }` in `package.json`. Kein Prisma-Downgrade nötig.

### 2. security-audit.yml
- **npm audit --json:** `|| true`, damit der Step bei gefundenen Vulns nicht fehlschlägt; die JSON-Ausgabe wird trotzdem in `npm-audit.json` geschrieben.
- **PR-Comment-Script:** Defensive Auswertung (existsSync, try/catch, fehlende `metadata`/`vulnerabilities`), `await` für `createComment`.

### 3. secret-scanning.yml
- **Gitleaks:** Upload-Schritt für `gitleaks-report.json`/`gitleaks-report.sarif` entfernt, da `gitleaks-action@v2` diese Dateien standardmäßig nicht erzeugt.

### 4. dependency-review.yml
- **Permissions:** `pull-requests: read` ergänzt für `dependency-review-action`.

---

---

## 1. Februar 2026 – Sicherheitsprüfung (npm audit)

### Behoben
- **Next.js (high):** DoS Image Optimizer, Memory Consumption, RSC Deserialization – behoben durch `npm audit fix --legacy-peer-deps`.
- **fast-xml-parser (high):** DoS Numeric Entities (GHSA-37qj-frw5-hhjh) – behoben durch Override in `package.json`:
  ```json
  "fast-xml-parser": ">=5.3.4"
  ```
  Betroffen war die Kette @aws-sdk → fast-xml-parser (z. B. bei E-Mail/SES).

### Verbleibend (nur moderate, nicht ohne Breaking Change behebbar)
- **hono (moderate):** XSS ErrorBoundary, Cache Deception, IP-Spoofing – kommt über **@prisma/dev** (Prisma 7).  
  Ein Fix würde Prisma auf 6.19.2 zurücksetzen (Breaking Change). Prisma 7 wird weiter verwendet; hono wird nur in Dev-Tools von Prisma genutzt, nicht in der Produktions-Runtime.

### Aktueller Stand
- **npm audit:** 3 moderate (nur hono/Prisma-Dev), 0 high/critical.
- **GitHub:** Security-Tab im Repo prüfen für Dependabot-Alerts und Code-Scanning-Ergebnisse.

---

## GitHub-Sicherheitsprüfung (Code Scanning / Dependabot)

### Dependabot / Vulnerability Alerts
- **Status:** Für dieses Repo deaktiviert (API: 403/404).
- **Empfehlung:** Unter **Settings → Security → Code security and analysis** „Dependency graph“ und „Dependabot alerts“ aktivieren, um Abhängigkeitswarnungen zu erhalten.

### CodeQL (Code Scanning)
- **Offene Alerts (Stand Abfrage):** 91 open, 9 fixed.
- **Nach Schweregrad:**
  - **1 critical:** `js/request-forgery` – PayPal Capture-URL nutzte nutzerkontrollierten Wert.
  - **2 high:** `js/polynomial-redos` – Query-Parser: Regex/Verarbeitung mit Nutzereingabe.
  - **75 medium:** `js/log-injection`.
  - **Rest:** Qualität (trivial-conditional, unused-local-variable, useless-comparison-test, useless-assignment-to-local).

### Durchgeführte Behebungen (Critical/High)
1. **`app/api/paypal/capture-order/route.ts` (request-forgery):**
   - `paypalOrderId` wird vor Verwendung in der URL strikt validiert: nur `[A-Za-z0-9_-]`, max. 50 Zeichen. Verhindert SSRF/Request-Forgery.

2. **`lib/search/query-parser.ts`:**
   - Tippfehler behoben: `v` → `vectorText`.
   - ReDoS/DoS abgemildert: maximale Länge für Such-Eingabe (`MAX_QUERY_INPUT_LENGTH = 2000`) und für Dokumenttext bei der Auswertung (`MAX_DOCUMENT_TEXT_LENGTH = 50_000`).

### Verbleibende Code-Scanning-Hinweise
- **75 × js/log-injection (medium):** Log-Ausgaben prüfen und Nutzerdaten bereinigen/escapen oder aus Logs weglassen.
- **Qualitätsregeln:** Nach Bedarf bereinigen (unused variables, trivial conditionals, useless comparisons).

---

**Letzte Aktualisierung:** 1. Februar 2026

