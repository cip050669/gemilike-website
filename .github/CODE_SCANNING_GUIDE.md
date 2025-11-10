# Code Scanning Fehler - Interpretations- und Behebungsanleitung

## Übersicht

GitHub CodeQL scannt Ihren Code auf Sicherheitslücken. Diese Anleitung erklärt die häufigsten Fehlertypen und wie Sie sie beheben.

## Häufige CodeQL-Fehlertypen

### 1. Hardcoded Credentials (Kritisch)

**Fehlertyp**: `js/hardcoded-credentials`

**Was es bedeutet**: Passwörter oder API-Keys sind direkt im Code hardcodiert.

**Gefundene Probleme**:
- `app/[locale]/admin/login-simple/page.tsx`: Hardcoded Credentials (`admin@gemilike.com` / `admin123`)
- `app/[locale]/admin/standalone-login/page.tsx`: Hardcoded Credentials
- `app/[locale]/admin/bypass/page.tsx`: Hardcoded Credentials

**Lösung**:
```typescript
// ❌ SCHLECHT:
if (email === 'admin@gemilike.com' && password === 'admin123') {
  // ...
}

// ✅ GUT:
// Verwenden Sie Environment Variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
  // ...
}

// ✅ BESSER: Verwenden Sie NextAuth.js (bereits implementiert)
// Diese Login-Seiten sollten entfernt oder durch NextAuth ersetzt werden
```

**Priorität**: 🔴 **KRITISCH** - Sofort beheben!

---

### 2. SQL Injection (Hoch)

**Fehlertyp**: `js/sql-injection`

**Was es bedeutet**: User-Input wird direkt in SQL-Queries verwendet ohne Sanitization.

**Status in diesem Projekt**: 
- ✅ **Geschützt durch Prisma ORM**
- Prisma verwendet parametrisierte Queries automatisch
- Direkte SQL-Queries sollten vermieden werden

**Beispiel (wenn direkt SQL verwendet würde)**:
```typescript
// ❌ GEFÄHRLICH (wird in diesem Projekt NICHT verwendet):
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ SICHER (Prisma macht das automatisch):
const user = await prisma.user.findUnique({
  where: { email: email }
});
```

**Aktion**: Prisma-Queries prüfen, ob User-Input korrekt verwendet wird.

---

### 3. Cross-Site Scripting (XSS) (Hoch)

**Fehlertyp**: `js/xss`, `js/reflected-xss`, `js/stored-xss`

**Was es bedeutet**: Nicht-sanitized User-Input wird in HTML gerendert.

**Gefundene Probleme**:
- `components/blog/MarkdownRenderer.tsx`: Verwendet `dangerouslySetInnerHTML`

**Lösung**:
```typescript
// ❌ RISIKO:
<div dangerouslySetInnerHTML={{ __html: markdownContent }} />

// ✅ SICHER:
// Verwenden Sie eine Markdown-Bibliothek mit XSS-Schutz
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import DOMPurify from 'isomorphic-dompurify';

const processedContent = await remark()
  .use(remarkGfm)
  .use(remarkHtml)
  .process(markdownContent);
  
const sanitized = DOMPurify.sanitize(String(processedContent));
<div dangerouslySetInnerHTML={{ __html: sanitized }} />
```

**Priorität**: 🟠 **HOCH** - Sollte behoben werden

---

### 4. Unsichere Zufallszahlen (Mittel)

**Fehlertyp**: `js/insecure-randomness`

**Was es bedeutet**: `Math.random()` wird für kryptografische Zwecke verwendet.

**Lösung**:
```typescript
// ❌ UNSICHER:
const token = Math.random().toString(36);

// ✅ SICHER:
import crypto from 'crypto';
const token = crypto.randomBytes(32).toString('hex');
```

---

### 5. Unsichere URL-Konstruktion (Mittel)

**Fehlertyp**: `js/insecure-url-construction`

**Was es bedeutet**: URLs werden aus User-Input ohne Validierung konstruiert.

**Lösung**:
```typescript
// ❌ RISIKO:
const url = `https://example.com/api/${userInput}`;

// ✅ SICHER:
import { URL } from 'url';
const baseUrl = new URL('https://example.com/api/');
const safePath = encodeURIComponent(userInput);
const url = new URL(safePath, baseUrl).toString();
```

---

### 6. Unsichere Datei-Uploads (Hoch)

**Fehlertyp**: `js/unsafe-file-upload`

**Was es bedeutet**: Dateien werden ohne Validierung hochgeladen.

**Lösung**:
```typescript
// ✅ SICHER:
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxSize = 5 * 1024 * 1024; // 5MB

if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}
if (file.size > maxSize) {
  throw new Error('File too large');
}
```

---

### 7. Fehlende Authentifizierung (Kritisch)

**Fehlertyp**: `js/missing-authentication`

**Was es bedeutet**: API-Endpunkte sind ohne Authentifizierung zugänglich.

**Gefundene Probleme**:
- `app/api/admin/audit-logs/route.ts`: Development-Mode umgeht Authentifizierung

**Lösung**:
```typescript
// ❌ RISIKO:
if (process.env.NODE_ENV === 'development') {
  // Skip authentication
}

// ✅ SICHER:
// Authentifizierung IMMER prüfen, auch in Development
const { userId } = await getSessionWithUser();
if (!userId) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Priorität**: 🔴 **KRITISCH** - Sofort beheben!

---

## Schritt-für-Schritt: Fehler beheben

### Schritt 1: Fehler in GitHub anzeigen

1. Gehen Sie zu: **Security** → **Code scanning** → **CodeQL**
2. Klicken Sie auf einen Fehler, um Details zu sehen
3. Lesen Sie die Beschreibung und den betroffenen Code

### Schritt 2: Fehler kategorisieren

- 🔴 **Kritisch**: Hardcoded Credentials, Missing Authentication
- 🟠 **Hoch**: XSS, SQL Injection, Unsafe File Upload
- 🟡 **Mittel**: Insecure Randomness, Insecure URL Construction

### Schritt 3: Fix implementieren

Folgen Sie den Lösungen in dieser Anleitung.

### Schritt 4: Testen

- Lokal testen
- Build prüfen (`npm run build`)
- Linter prüfen (`npm run lint`)

### Schritt 5: Commit und Push

```bash
git add .
git commit -m "fix: [Fehlertyp] - [Beschreibung]"
git push origin main
```

### Schritt 6: CodeQL erneut ausführen

- CodeQL läuft automatisch bei Push
- Oder manuell: **Actions** → **CodeQL Analysis** → **Run workflow**

---

## Bekannte Probleme in diesem Projekt

### 1. Hardcoded Admin-Credentials

**Dateien**:
- `app/[locale]/admin/login-simple/page.tsx`
- `app/[locale]/admin/standalone-login/page.tsx`
- `app/[locale]/admin/bypass/page.tsx`

**Empfehlung**: 
- Diese Seiten entfernen oder durch NextAuth ersetzen
- Oder Environment Variables verwenden

### 2. Development-Mode Authentication Bypass

**Datei**: `app/api/admin/audit-logs/route.ts`

**Empfehlung**:
- Authentifizierung auch in Development prüfen
- Separate Test-Endpunkte für Development erstellen

### 3. XSS in Markdown-Rendering

**Datei**: `components/blog/MarkdownRenderer.tsx`

**Empfehlung**:
- DOMPurify für Sanitization hinzufügen
- Oder sicherere Markdown-Bibliothek verwenden

---

## CodeQL Query-Sets

Die aktuelle Konfiguration verwendet:
- `+security-and-quality`: Standard Security + Quality Queries

**Weitere verfügbare Query-Sets**:
- `security-extended`: Erweiterte Security-Queries
- `security-and-quality`: Standard (aktuell aktiv)
- `+security-and-quality`: Standard + zusätzliche Queries

---

## Fehler ignorieren (nur wenn gerechtfertigt)

Falls ein Fehler ein False-Positive ist:

1. Erstellen Sie eine `.github/codeql/codeql-config.yml`:
```yaml
paths-ignore:
  - '**/test/**'
  - '**/__tests__/**'
  - '**/*.test.ts'
  - '**/*.test.tsx'

queries:
  - exclude:
      id: js/hardcoded-credentials
      path: app/[locale]/admin/login-simple/page.tsx
      reason: "Development-only login page, will be removed"
```

2. Oder markieren Sie den Alert in GitHub als "False Positive"

---

## Weitere Ressourcen

- [CodeQL Dokumentation](https://codeql.github.com/docs/)
- [CodeQL Query Reference](https://codeql.github.com/codeql-query-help/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

---

## Checkliste für Security-Fixes

- [ ] Hardcoded Credentials entfernt
- [ ] Environment Variables verwendet
- [ ] Authentifizierung überall aktiviert
- [ ] XSS-Schutz implementiert (DOMPurify)
- [ ] File Uploads validiert
- [ ] User Inputs sanitized
- [ ] SQL Injection geschützt (Prisma)
- [ ] Unsichere Zufallszahlen ersetzt
- [ ] URLs sicher konstruiert
- [ ] CodeQL erneut ausgeführt
- [ ] Alle Fehler behoben oder dokumentiert

