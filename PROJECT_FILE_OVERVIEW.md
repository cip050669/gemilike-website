# 📁 Gemilike Website - Dateityp-Übersicht

## 🎯 **Projekt-Übersicht**
**Gemilike** - Edelstein-E-Commerce Website mit Next.js 15, TypeScript und modernem Admin-Panel

---

## 📋 **Dateityp-Kategorien**

### 🔧 **Konfigurationsdateien**

#### **package.json**
- **Funktion:** Projekt-Abhängigkeiten und Scripts verwalten
- **Inhalt:** Dependencies, devDependencies, Scripts (dev, build, lint)
- **Wichtige Pakete:** Next.js 15, TypeScript, Tailwind CSS, Prisma, NextAuth

#### **next.config.ts**
- **Funktion:** Next.js-Konfiguration
- **Features:** Turbopack, Image-Optimierung, Experimentelle Features
- **Wichtige Einstellungen:** 
  - `experimental.turbo` (deprecated → `turbopack`)
  - `optimizePackageImports` für bessere Performance

#### **tailwind.config.js**
- **Funktion:** Tailwind CSS-Konfiguration
- **Features:** Custom Colors, Animations, Responsive Design
- **Wichtige Einstellungen:**
  - Corporate Design Colors (Electric Blue, Purple, Neon Green)
  - Custom Animations (fade-in, float, gradient)
  - Content-Pfade für Komponenten

#### **postcss.config.js**
- **Funktion:** PostCSS-Konfiguration
- **Plugins:** Tailwind CSS, Autoprefixer
- **Zweck:** CSS-Processing und Browser-Kompatibilität

#### **tsconfig.json**
- **Funktion:** TypeScript-Konfiguration
- **Features:** Strict Mode, Path Mapping, Next.js Integration
- **Wichtige Einstellungen:**
  - `strict: true` für Type Safety
  - `baseUrl` und `paths` für Imports
  - Next.js-spezifische Einstellungen

#### **.env.local**
- **Funktion:** Umgebungsvariablen (lokal)
- **Inhalt:** Database URLs, API Keys, Secrets
- **Sicherheit:** Nicht in Git committed

---

### 🎨 **Styling & Design**

#### **globals.css**
- **Funktion:** Globale CSS-Styles
- **Features:**
  - Tailwind CSS Import
  - Custom CSS-Variablen für Corporate Design
  - Dark Mode Support
  - Custom Animations (fade-in)
- **Wichtige Bereiche:**
  - Corporate Color Scheme
  - Typography (Geist Sans/Mono)
  - Component Styling

#### **components/ui/*.tsx**
- **Funktion:** Wiederverwendbare UI-Komponenten
- **Beispiele:** Button, Input, Card, Modal
- **Features:** TypeScript, Tailwind CSS, Accessibility
- **Zweck:** Konsistentes Design-System

---

### 🏗️ **Next.js App Router Struktur**

#### **app/layout.tsx**
- **Funktion:** Root-Layout für alle Seiten
- **Features:**
  - HTML-Struktur
  - Font-Loading (Geist Sans/Mono)
  - Metadata
  - Global Providers

#### **`app/[locale]/layout.tsx`**
- **Funktion:** Internationalisierung-Layout
- **Features:**
  - Multi-Language Support (DE/EN)
  - Locale-basierte Routing
  - Translation Provider

#### **`app/[locale]/page.tsx`**
- **Funktion:** Homepage
- **Features:**
  - Hero Section
  - Featured Products
  - Call-to-Action
  - SEO-optimiert

#### **`app/[locale]/admin/layout.tsx`**
- **Funktion:** Admin-Panel Layout
- **Features:**
  - AdminSidebar Integration
  - Protected Routes
  - Admin-spezifische Styling

---

### 🛠️ **Admin-Panel Komponenten**

#### **components/admin/AdminSidebar.tsx**
- **Funktion:** Admin-Navigation
- **Features:**
  - Collapsible Sidebar
  - Navigation Items
  - Active State Management
  - Responsive Design

#### **components/admin/HeaderManagement.tsx**
- **Funktion:** Header-Verwaltung
- **Features:**
  - Navigation verwalten
  - Logo & Branding
  - Kontakt-Informationen
  - Social Media Links
  - Header-Features (Search, Cart, User)


#### **components/admin/GemstoneEditor.tsx**
- **Funktion:** Edelstein-Verwaltung
- **Features:**
  - CRUD-Operationen
  - Bild-Upload
  - Kategorisierung
  - SEO-Metadaten

#### **components/admin/BlogEditor.tsx**
- **Funktion:** Blog-Verwaltung
- **Features:**
  - Rich Text Editor
  - Kategorien & Tags
  - Status-Management
  - Featured Images

---

### 🗄️ **Datenbank & API**

#### **lib/prisma.ts**
- **Funktion:** Prisma Client Konfiguration
- **Features:**
  - Database Connection
  - Connection Pooling
  - Development/Production Configs

#### **app/api/admin/*/route.ts**
- **Funktion:** Admin API Routes
- **Features:**
  - CRUD-Operationen
  - Authentication
  - Data Validation
  - Error Handling

#### **`app/api/auth/[...nextauth]/route.ts`**
- **Funktion:** NextAuth.js Konfiguration
- **Features:**
  - Authentication Providers
  - Session Management
  - JWT Configuration

---

### 🌐 **Internationalisierung**

#### **messages/de.json**
- **Funktion:** Deutsche Übersetzungen
- **Inhalt:** Alle UI-Texte auf Deutsch
- **Struktur:** Nested Objects für Organisation

#### **messages/en.json**
- **Funktion:** Englische Übersetzungen
- **Inhalt:** Alle UI-Texte auf Englisch
- **Struktur:** Parallele Struktur zu DE

#### **i18n.ts**
- **Funktion:** i18n-Konfiguration
- **Features:**
  - Locale Detection
  - Default Locale
  - Path Mapping

---

### 🧪 **Testing**

#### **__tests__/admin/*.test.tsx**
- **Funktion:** Admin-Komponenten Tests
- **Features:**
  - Unit Tests
  - Integration Tests
  - Mocking
  - Jest + React Testing Library

#### **jest.config.js**
- **Funktion:** Jest-Konfiguration
- **Features:**
  - Test Environment
  - Module Mapping
  - Coverage Settings

---

### 📱 **PWA & Performance**

#### **public/manifest.json**
- **Funktion:** PWA Manifest
- **Features:**
  - App Metadata
  - Icons
  - Theme Colors
  - Display Settings

#### **public/sw.js**
- **Funktion:** Service Worker
- **Features:**
  - Caching Strategy
  - Offline Support
  - Background Sync

---

### 🔒 **Sicherheit & Auth**

#### **middleware.ts**
- **Funktion:** Next.js Middleware
- **Features:**
  - Route Protection
  - Authentication Checks
  - Locale Redirects
  - Security Headers

#### **lib/auth.ts**
- **Funktion:** Authentication Utilities
- **Features:**
  - Session Helpers
  - Permission Checks
  - User Management

---

### 📊 **Analytics & Monitoring**

#### **lib/analytics.ts**
- **Funktion:** Analytics Integration
- **Features:**
  - Google Analytics
  - Custom Events
  - Performance Tracking

#### **lib/structured-data.ts**
- **Funktion:** SEO Structured Data
- **Features:**
  - Schema.org Markup
  - Rich Snippets
  - Search Engine Optimization

---

### 🎨 **Design System**

#### **components/ui/button.tsx**
- **Funktion:** Button-Komponente
- **Features:**
  - Multiple Variants
  - Size Options
  - Loading States
  - Accessibility

#### **components/ui/input.tsx**
- **Funktion:** Input-Komponente
- **Features:**
  - Form Validation
  - Error States
  - Label Integration
  - Type Safety

---

### 📦 **Build & Deployment**

#### **Dockerfile**
- **Funktion:** Container-Konfiguration
- **Features:**
  - Multi-stage Build
  - Node.js Runtime
  - Production Optimizations

#### **docker-compose.yml**
- **Funktion:** Development Environment
- **Features:**
  - Database Services
  - Volume Mounting
  - Port Mapping

#### **.github/workflows/deploy.yml**
- **Funktion:** CI/CD Pipeline
- **Features:**
  - Automated Testing
  - Build Process
  - Deployment to Production

---

### 📚 **Dokumentation**

#### **README.md**
- **Funktion:** Projekt-Dokumentation
- **Inhalt:**
  - Installation Guide
  - Development Setup
  - API Documentation
  - Contributing Guidelines

#### **PROJECT_STATUS.md**
- **Funktion:** Projekt-Status Tracking
- **Inhalt:**
  - Feature Progress
  - Bug Reports
  - Development Roadmap

---

## 🎯 **Dateityp-Zusammenfassung**

### **Frontend-Dateien:**
- **.tsx** - React-Komponenten (TypeScript) - *TypeScript React eXtension*
- **.ts** - TypeScript Utilities - *TypeScript Source Files*
- **.css** - Styling (Tailwind + Custom) - *Cascading Style Sheets*
- **.json** - Konfiguration & Daten - *JavaScript Object Notation*

### **Backend-Dateien:**
- **route.ts** - API Routes - *TypeScript Route Handlers*
- **prisma.ts** - Database Client - *Prisma ORM Configuration*
- **auth.ts** - Authentication - *Authentication Utilities*

### **Konfiguration:**
- **.config.js/ts** - Build & Development Configs - *Configuration Files*
- **.env** - Environment Variables - *Environment Configuration*
- **package.json** - Dependencies - *Node.js Package Configuration*

### **Testing:**
- **.test.tsx** - Unit & Integration Tests - *Test Files for React Components*
- **jest.config.js** - Test Configuration - *Jest Testing Framework Config*

### **Dokumentation:**
- **.md** - Markdown Documentation - *Markdown Documentation Files*
- **README.md** - Project Overview - *Project Readme File*

---

## 📝 **Detaillierte Dateiendungen-Übersicht**

### **🔧 Konfigurationsdateien:**
- **.json** - JSON (JavaScript Object Notation) - Strukturierte Daten
- **.js** - JavaScript - Skriptsprache für Web-Entwicklung
- **.ts** - TypeScript - Typisierte JavaScript-Erweiterung
- **.config.js** - JavaScript-Konfiguration - Build/Development Settings
- **.config.ts** - TypeScript-Konfiguration - Typisierte Konfiguration
- **.env** - Environment Variables - Umgebungsvariablen
- **.env.local** - Lokale Umgebungsvariablen - Development-spezifisch
- **.gitignore** - Git Ignore - Dateien die Git ignorieren soll
- **.dockerignore** - Docker Ignore - Dateien die Docker ignorieren soll

### **🎨 Frontend-Dateien:**
- **.tsx** - TypeScript React - React-Komponenten mit TypeScript
- **.jsx** - JavaScript React - React-Komponenten mit JavaScript
- **.css** - Cascading Style Sheets - Styling und Design
- **.scss** - Sassy CSS - CSS mit erweiterten Features
- **.sass** - Syntactically Awesome Style Sheets - CSS-Präprozessor
- **.less** - Leaner Style Sheets - CSS-Präprozessor
- **.html** - HyperText Markup Language - Web-Seiten Struktur
- **.svg** - Scalable Vector Graphics - Vektorgrafiken
- **.png** - Portable Network Graphics - Rastergrafiken
- **.jpg/.jpeg** - Joint Photographic Experts Group - Komprimierte Bilder
- **.gif** - Graphics Interchange Format - Animierte Bilder
- **.webp** - Web Picture Format - Moderne Bildkompression
- **.ico** - Icon File - Website-Favicons

### **🗄️ Backend-Dateien:**
- **.ts** - TypeScript - Server-side TypeScript
- **.js** - JavaScript - Server-side JavaScript
- **.sql** - Structured Query Language - Datenbankabfragen
- **.prisma** - Prisma Schema - Datenbankschema
- **.graphql** - GraphQL - API-Abfragesprache
- **.gql** - GraphQL - Kurze GraphQL-Dateien

### **🧪 Testing-Dateien:**
- **.test.ts** - TypeScript Tests - Test-Dateien in TypeScript
- **.test.tsx** - React Component Tests - React-Komponenten Tests
- **.test.js** - JavaScript Tests - Test-Dateien in JavaScript
- **.spec.ts** - TypeScript Specs - Spezifikations-Tests
- **.spec.tsx** - React Specs - React-Spezifikations-Tests
- **.e2e.ts** - End-to-End Tests - Integrationstests
- **.cy.ts** - Cypress Tests - Cypress E2E Tests

### **📦 Build & Deployment:**
- **Dockerfile** - Docker Container - Container-Konfiguration
- **docker-compose.yml** - Docker Compose - Multi-Container Setup
- **.dockerignore** - Docker Ignore - Docker-spezifische Ignore-Datei
- **.gitignore** - Git Ignore - Git-spezifische Ignore-Datei
- **.npmignore** - NPM Ignore - NPM-spezifische Ignore-Datei
- **.yarnrc** - Yarn Configuration - Yarn Package Manager Config
- **.nvmrc** - Node Version Manager - Node.js Version Specification

### **🔒 Sicherheit & Auth:**
- **.pem** - Privacy Enhanced Mail - Zertifikate und Keys
- **.key** - Private Key - Private Schlüssel
- **.crt** - Certificate - Zertifikate
- **.p12** - PKCS#12 - Zertifikats-Container
- **.pfx** - Personal Information Exchange - Zertifikats-Format

### **📊 Daten & Analytics:**
- **.csv** - Comma Separated Values - Tabellendaten
- **.xml** - eXtensible Markup Language - Strukturierte Daten
- **.yaml/.yml** - YAML Ain't Markup Language - Konfigurationsdaten
- **.toml** - Tom's Obvious Minimal Language - Konfigurationsformat
- **.ini** - Initialization File - Konfigurationsdateien

### **📚 Dokumentation:**
- **.md** - Markdown - Dokumentationsformat
- **.rst** - reStructuredText - Python-Dokumentation
- **.txt** - Plain Text - Einfache Textdateien
- **.pdf** - Portable Document Format - Dokumente
- **.docx** - Microsoft Word - Word-Dokumente

### **🎵 Medien-Dateien:**
- **.mp3** - MPEG Audio Layer 3 - Audiodateien
- **.mp4** - MPEG-4 - Videodateien
- **.avi** - Audio Video Interleave - Video-Container
- **.mov** - QuickTime - Apple Video-Format
- **.wav** - Waveform Audio - Unkomprimierte Audio

### **📱 Mobile & PWA:**
- **.apk** - Android Package - Android Apps
- **.ipa** - iOS App Store Package - iOS Apps
- **.manifest** - Web App Manifest - PWA Manifest
- **.sw.js** - Service Worker - PWA Service Worker

### **🌐 Web-spezifische Dateien:**
- **.htaccess** - Apache Configuration - Apache Server Config
- **.robots.txt** - Robots Exclusion - Search Engine Instructions
- **.sitemap.xml** - XML Sitemap - Website-Struktur
- **.webmanifest** - Web App Manifest - PWA Manifest
- **.woff** - Web Open Font Format - Web-Schriftarten
- **.woff2** - Web Open Font Format 2 - Komprimierte Web-Schriftarten
- **.ttf** - TrueType Font - Schriftarten
- **.otf** - OpenType Font - Erweiterte Schriftarten

### **🔧 Development Tools:**
- **.vscode/** - Visual Studio Code - IDE-Konfiguration
- **.idea/** - IntelliJ IDEA - IDE-Konfiguration
- **.eslintrc** - ESLint Configuration - Code Quality
- **.prettierrc** - Prettier Configuration - Code Formatting
- **.editorconfig** - Editor Configuration - Editor Settings
- **.babelrc** - Babel Configuration - JavaScript Transpiler
- **.postcssrc** - PostCSS Configuration - CSS Processing

### **📦 Package Manager:**
- **package.json** - NPM Package - Node.js Dependencies
- **package-lock.json** - NPM Lock File - Dependency Lock
- **yarn.lock** - Yarn Lock File - Yarn Dependency Lock
- **pnpm-lock.yaml** - PNPM Lock File - PNPM Dependency Lock
- **composer.json** - Composer Package - PHP Dependencies
- **requirements.txt** - Python Requirements - Python Dependencies
- **Gemfile** - Ruby Gems - Ruby Dependencies
- **Cargo.toml** - Rust Cargo - Rust Dependencies

### **🗄️ Datenbank-Dateien:**
- **.db** - Database File - SQLite Datenbank
- **.sqlite** - SQLite Database - SQLite Datenbank
- **.sqlite3** - SQLite3 Database - SQLite3 Datenbank
- **.mdb** - Microsoft Access Database - Access Datenbank
- **.accdb** - Microsoft Access Database - Access 2007+ Datenbank

### **📋 Log & Monitoring:**
- **.log** - Log File - Protokoll-Dateien
- **.err** - Error Log - Fehler-Protokolle
- **.out** - Output Log - Ausgabe-Protokolle
- **.pid** - Process ID - Prozess-Identifikation

---

## 🌍 **Internationale Bezeichnungen:**

### **Deutsch:**
- **Dateiendung** - File Extension
- **Konfigurationsdatei** - Configuration File
- **Strukturierte Daten** - Structured Data
- **Umgebungsvariablen** - Environment Variables
- **Datenbankschema** - Database Schema
- **Test-Dateien** - Test Files
- **Dokumentationsdateien** - Documentation Files

### **Englisch:**
- **File Extension** - Dateiendung
- **Configuration File** - Konfigurationsdatei
- **Structured Data** - Strukturierte Daten
- **Environment Variables** - Umgebungsvariablen
- **Database Schema** - Datenbankschema
- **Test Files** - Test-Dateien
- **Documentation Files** - Dokumentationsdateien

### **Französisch:**
- **Extension de fichier** - Dateiendung
- **Fichier de configuration** - Konfigurationsdatei
- **Données structurées** - Strukturierte Daten
- **Variables d'environnement** - Umgebungsvariablen
- **Schéma de base de données** - Datenbankschema
- **Fichiers de test** - Test-Dateien
- **Fichiers de documentation** - Dokumentationsdateien

### **Spanisch:**
- **Extensión de archivo** - Dateiendung
- **Archivo de configuración** - Konfigurationsdatei
- **Datos estructurados** - Strukturierte Daten
- **Variables de entorno** - Umgebungsvariablen
- **Esquema de base de datos** - Datenbankschema
- **Archivos de prueba** - Test-Dateien
- **Archivos de documentación** - Dokumentationsdateien

---

## 🚀 **Entwicklungsworkflow**

1. **Konfiguration** → `package.json`, `next.config.ts`
2. **Styling** → `globals.css`, `tailwind.config.js`
3. **Komponenten** → `components/**/*.tsx`
4. **Seiten** → `app/**/*.tsx`
5. **API** → `app/api/**/*.ts`
6. **Testing** → `__tests__/**/*.test.tsx`
7. **Build** → `npm run build`
8. **Deployment** → Docker/CI/CD

---

## 📈 **Performance-Optimierungen**

- **Turbopack** für schnelle Development Builds
- **Image Optimization** mit Next.js Image
- **Code Splitting** automatisch durch Next.js
- **Tree Shaking** für kleinere Bundles
- **CSS Purging** durch Tailwind CSS
- **Lazy Loading** für Komponenten

---

*Diese Übersicht wird kontinuierlich aktualisiert und erweitert.*
