# Rechtliche Dokumentation - Gemilike Website

**Datum:** 10. Oktober 2025  
**Version:** 1.0  
**Status:** ✅ Vollständig implementiert

---

## 📋 Übersicht

Diese Dokumentation beschreibt alle rechtlichen Seiten und deren Implementierung auf der Gemilike Website. Alle Seiten entsprechen den deutschen und EU-Rechtlichen Anforderungen für E-Commerce-Websites.

---

## 📄 Implementierte rechtliche Seiten

### 1. **Allgemeine Geschäftsbedingungen (AGB)**
- **URL:** `/terms`
- **Datei:** `app/[locale]/terms/page.tsx`
- **Status:** ✅ Implementiert

#### Inhalt:
- **§ 1 Geltungsbereich** - Anwendungsbereich der AGB
- **§ 2 Vertragspartner** - Vollständige Firmenangaben
- **§ 3 Vertragsschluss** - Angebot und Annahme
- **§ 4 Preise und Zahlungsbedingungen** - Alle Zahlungsoptionen
- **§ 5 Lieferung und Versand** - Versandkosten und -zeiten
- **§ 6 Widerrufsrecht** - 14-tägiges Rückgaberecht
- **§ 7 Gewährleistung und Haftung** - Haftungsbeschränkungen
- **§ 8 Datenschutz** - Verweis auf Datenschutzerklärung
- **§ 9 Schlussbestimmungen** - Gerichtsstand und anwendbares Recht

#### Rechtliche Konformität:
- ✅ BGB-konform (Bürgerliches Gesetzbuch)
- ✅ Fernabsatzgesetz-konform
- ✅ Verbraucherschutz-konform
- ✅ 14-tägiges Widerrufsrecht implementiert

---

### 2. **Datenschutzerklärung**
- **URL:** `/privacy`
- **Datei:** `app/[locale]/privacy/page.tsx`
- **Status:** ✅ Implementiert

#### Inhalt:
- **1. Verantwortlicher** - Vollständige Kontaktdaten
- **2. Allgemeines zur Datenverarbeitung** - Rechtsgrundlagen
- **3. Bereitstellung der Website** - Logfiles und Cookies
- **4. Verwendung von Cookies** - Cookie-Arten und -Zweck
- **5. Registrierung und Bestellung** - Datenverarbeitung bei Bestellungen
- **6. E-Mail-Kontakt** - Kontaktformular-Datenverarbeitung
- **7. Rechte der betroffenen Person** - DSGVO-Rechte
- **8. Datensicherheit** - Technische und organisatorische Maßnahmen
- **9. Aktualität und Änderung** - Änderungsvorbehalt

#### DSGVO-Konformität:
- ✅ Art. 6 DSGVO (Rechtsgrundlagen)
- ✅ Art. 13/14 DSGVO (Informationspflichten)
- ✅ Art. 15-22 DSGVO (Betroffenenrechte)
- ✅ Art. 25 DSGVO (Datenschutz durch Technikgestaltung)
- ✅ Art. 32 DSGVO (Sicherheit der Verarbeitung)

---

### 3. **Impressum**
- **URL:** `/imprint`
- **Datei:** `app/[locale]/imprint/page.tsx`
- **Status:** ✅ Implementiert

#### Inhalt:
- **Anbieter** - Firmenname und Adresse
- **Kontakt** - Telefon, Fax, E-Mail, Website
- **Registereintrag** - Handelsregister, HRB, USt-IdNr.
- **Geschäftsführung** - Namen der Geschäftsführer
- **Aufsichtsbehörde** - Gewerbeaufsichtsamt
- **Berufsbezeichnung** - Edelsteinhändler, IHK
- **Redaktionell verantwortlich** - Verantwortlicher für Inhalte
- **EU-Streitschlichtung** - Verbraucherschutz-Plattform
- **Haftung für Inhalte** - Haftungsausschluss
- **Haftung für Links** - Externe Links
- **Urheberrecht** - Bildnachweis und Lizenzen
- **Bildnachweis** - Quellen der verwendeten Bilder
- **Technische Umsetzung** - Hosting und Domain

#### TMG-Konformität:
- ✅ § 5 TMG (Impressumspflicht)
- ✅ § 6 TMG (Haftung für Inhalte)
- ✅ § 7 TMG (Haftung für Links)
- ✅ § 8 TMG (Urheberrecht)

---

### 4. **Cookie-Richtlinie**
- **URL:** `/cookies`
- **Datei:** `app/[locale]/cookies/page.tsx`
- **Status:** ✅ Implementiert

#### Inhalt:
- **Was sind Cookies?** - Definition und Zweck
- **Arten von Cookies** - Technisch, funktional, analytisch, marketing
- **Cookie-Verwaltung** - Browser-Einstellungen ändern
- **Browser-spezifische Anleitungen** - Chrome, Firefox, Safari, Edge
- **Drittanbieter-Cookies** - Google Analytics, Social Media
- **Cookie-Lebensdauer** - Session und persistente Cookies
- **Rechte der Nutzer** - Kontrolle und Löschung
- **Kontakt** - Datenschutzbeauftragter
- **Änderungen** - Änderungsvorbehalt

#### ePrivacy-Konformität:
- ✅ ePrivacy-Richtlinie (Cookie-Gesetz)
- ✅ TTDSG-konform (Telekommunikation-Telemedien-Datenschutz-Gesetz)
- ✅ Opt-in/Opt-out-Mechanismen
- ✅ Transparente Information

---

## 🔗 Footer-Integration

Alle rechtlichen Seiten sind im Footer verlinkt:

```typescript
// components/layout/Footer.tsx
<ul className="space-y-2 text-sm">
  <li>
    <Link href={`/${locale}/privacy`}>
      {t('privacy')}
    </Link>
  </li>
  <li>
    <Link href={`/${locale}/terms`}>
      {t('terms')}
    </Link>
  </li>
  <li>
    <Link href={`/${locale}/imprint`}>
      {t('imprint')}
    </Link>
  </li>
  <li>
    <Link href={`/${locale}/cookies`}>
      {t('cookies')}
    </Link>
  </li>
</ul>
```

---

## 🌐 Mehrsprachigkeit

Alle rechtlichen Seiten sind mehrsprachig implementiert:

### Deutsche Versionen:
- `/de/terms` - AGBs
- `/de/privacy` - Datenschutzerklärung
- `/de/imprint` - Impressum
- `/de/cookies` - Cookie-Richtlinie

### Englische Versionen:
- `/en/terms` - Terms & Conditions
- `/en/privacy` - Privacy Policy
- `/en/imprint` - Imprint
- `/en/cookies` - Cookie Policy

---

## 📱 Responsive Design

Alle rechtlichen Seiten sind vollständig responsive:

- **Desktop:** Vollbreite mit optimaler Lesbarkeit
- **Tablet:** Angepasste Spalten und Abstände
- **Mobile:** Touch-freundliche Navigation und Lesbarkeit

---

## 🎨 Design & UX

### Design-Prinzipien:
- **Klarheit:** Übersichtliche Struktur mit klaren Überschriften
- **Lesbarkeit:** Optimale Schriftgrößen und Zeilenabstände
- **Navigation:** Einfache Navigation zwischen den Seiten
- **Konsistenz:** Einheitliches Design mit dem Rest der Website

### UI-Komponenten:
- **Card-Layout:** Alle Inhalte in übersichtlichen Karten
- **Typography:** Hierarchische Überschriftenstruktur
- **Spacing:** Konsistente Abstände und Ränder
- **Colors:** Markdown-Styling für bessere Lesbarkeit

---

## 🔒 Rechtliche Sicherheit

### Erfüllte Anforderungen:

#### **Deutsches Recht:**
- ✅ BGB (Bürgerliches Gesetzbuch)
- ✅ TMG (Telemediengesetz)
- ✅ TTDSG (Telekommunikation-Telemedien-Datenschutz-Gesetz)
- ✅ Fernabsatzgesetz
- ✅ Verbraucherschutzgesetze

#### **EU-Recht:**
- ✅ DSGVO (Datenschutz-Grundverordnung)
- ✅ ePrivacy-Richtlinie
- ✅ Verbraucherrechte-Richtlinie
- ✅ E-Commerce-Richtlinie

#### **E-Commerce-spezifisch:**
- ✅ Widerrufsrecht (14 Tage)
- ✅ Preistransparenz
- ✅ Lieferbedingungen
- ✅ Zahlungsbedingungen
- ✅ Gewährleistung
- ✅ Haftungsbeschränkungen

---

## 📊 Compliance-Checkliste

### ✅ Vollständig erfüllt:
- [x] **Impressumspflicht** (§ 5 TMG)
- [x] **Datenschutzerklärung** (DSGVO Art. 13/14)
- [x] **Cookie-Information** (ePrivacy-Richtlinie)
- [x] **AGB für E-Commerce** (BGB, Fernabsatzgesetz)
- [x] **Widerrufsbelehrung** (14-tägiges Widerrufsrecht)
- [x] **Preistransparenz** (alle Kosten aufgeführt)
- [x] **Lieferbedingungen** (Versandkosten, -zeiten)
- [x] **Zahlungsbedingungen** (alle Zahlungsoptionen)
- [x] **Gewährleistung** (Haftung und Garantien)
- [x] **EU-Streitschlichtung** (Verbraucherschutz)
- [x] **Urheberrecht** (Bildnachweis, Lizenzen)
- [x] **Haftungsausschluss** (Inhalte und Links)

---

## 🔄 Wartung und Updates

### Regelmäßige Überprüfungen:
- **Rechtliche Änderungen** - Quartalsweise Prüfung
- **DSGVO-Updates** - Bei Änderungen der Datenschutzgesetze
- **Firmenangaben** - Bei Änderungen der Unternehmensdaten
- **Kontaktdaten** - Bei Änderungen der Kontaktinformationen

### Update-Prozess:
1. **Rechtliche Prüfung** - Anwaltliche Beratung bei Änderungen
2. **Content-Update** - Anpassung der Texte
3. **Versionierung** - Dokumentation der Änderungen
4. **Testing** - Überprüfung der Funktionalität
5. **Deployment** - Veröffentlichung der Änderungen

---

## 📞 Kontakt und Support

### Rechtliche Fragen:
- **Anwalt:** [Rechtsanwalt für IT-Recht]
- **Datenschutzbeauftragter:** datenschutz@gemilike.com
- **Firmenadresse:** Gemilike GmbH, Musterstraße 123, 12345 Musterstadt

### Technische Fragen:
- **Entwickler:** [Entwickler-Kontakt]
- **Support:** support@gemilike.com
- **Dokumentation:** Diese Datei und README.md

---

## 📚 Referenzen

### Rechtliche Grundlagen:
- **BGB:** Bürgerliches Gesetzbuch
- **TMG:** Telemediengesetz
- **TTDSG:** Telekommunikation-Telemedien-Datenschutz-Gesetz
- **DSGVO:** Datenschutz-Grundverordnung (EU) 2016/679
- **ePrivacy-Richtlinie:** Richtlinie 2002/58/EG

### Hilfreiche Ressourcen:
- **BfDI:** Bundesbeauftragter für den Datenschutz
- **BMJV:** Bundesministerium der Justiz
- **EU-Kommission:** Verbraucherschutz
- **IHK:** Industrie- und Handelskammer

---

**Letzte Aktualisierung:** 10. Oktober 2025  
**Nächste Überprüfung:** April 2025  
**Verantwortlich:** Gemilike GmbH

---

*Diese Dokumentation dient als Nachweis der rechtlichen Konformität der Gemilike Website. Bei rechtlichen Fragen konsultieren Sie bitte einen Fachanwalt.*
