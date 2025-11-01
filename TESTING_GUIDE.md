# Testing Guide für neue Features

**Datum:** 2025-01-15
**Getestete Features:**
1. Review-System
2. Rechnungen Frontend
3. Wishlist Admin

---

## 1. Review auf Produktseite erstellen

### Test-Schritte:
1. **Zur Produktseite navigieren:**
   - Öffne: `http://localhost:3000/de/shop/[gemId]`
   - Wähle einen beliebigen Edelstein aus dem Shop

2. **Review-Komponenten prüfen:**
   - **ReviewsDisplay**: Sollte am Ende der Produktseite alle vorhandenen Reviews anzeigen
   - **ReviewForm**: Sollte direkt unter ReviewsDisplay erscheinen
   - Beide Komponenten sollten im Scroll-Bereich sichtbar sein

3. **Review erstellen:**
   - Sterne-Bewertung auswählen (1-5)
   - Optional: Titel eingeben
   - Optional: Kommentar eingeben
   - "Bewertung absenden" klicken
   - ✅ Erfolgsmeldung sollte erscheinen
   - ✅ Review sollte sofort in der Liste erscheinen

4. **Verifizierte Reviews:**
   - Reviews mit `orderItemId` werden automatisch als "Verifizierter Kauf" markiert
   - Badge sollte angezeigt werden

### Erwartete Ergebnisse:
- ✅ Review-Formular ist sichtbar
- ✅ Reviews werden korrekt angezeigt
- ✅ Durchschnittsbewertung wird berechnet
- ✅ Verifizierungs-Badge wird angezeigt (wenn vorhanden)
- ✅ Kunde kann nur einmal pro Produkt reviewen

---

## 2. Admin-Review-Verwaltung testen

### Test-Schritte:
1. **Zur Admin-Reviews-Seite navigieren:**
   - Öffne: `http://localhost:3000/de/admin/reviews`
   - Müssen als Admin eingeloggt sein

2. **Reviews-Übersicht prüfen:**
   - Alle Reviews sollten in Karten angezeigt werden
   - Bewertung (Sterne) sichtbar
   - Produktname mit Link
   - Kundenname und E-Mail
   - Erstellungsdatum

3. **Filter testen:**
   - "Alle" Button → zeigt alle Reviews
   - "Verifiziert" Button → zeigt nur verifizierte
   - "Nicht verifiziert" Button → zeigt nur nicht-verifizierte
   - Anzahl sollte korrekt sein

4. **Review-Verifizierung:**
   - Klicke auf "Verifizieren" bei einem nicht-verifizierten Review
   - ✅ Review sollte Badge "Verifiziert" bekommen
   - ✅ E-Mail-Benachrichtigung sollte an Admin gesendet werden

5. **Review löschen:**
   - Klicke auf Löschen-Button (🗑️)
   - Bestätige die Aktion
   - ✅ Review sollte aus der Liste verschwinden

### Erwartete Ergebnisse:
- ✅ Alle Reviews werden angezeigt
- ✅ Filter funktionieren korrekt
- ✅ Verifizierung funktioniert
- ✅ Löschen funktioniert
- ✅ E-Mail-Benachrichtigung wird gesendet (Admin-E-Mail prüfen)

---

## 3. Rechnungen im Profil ansehen

### Test-Schritte:
1. **Als Kunde einloggen:**
   - Stelle sicher, dass Test-Kunde existiert und Rechnungen hat

2. **Zur Rechnungen-Seite navigieren:**
   - Öffne: `http://localhost:3000/de/profile/invoices`
   - Oder über Profil-Navigation

3. **Rechnungsübersicht prüfen:**
   - Alle Rechnungen sollten in Karten angezeigt werden
   - Rechnungsnummer sichtbar
   - Status-Badge (Ausgestellt, Bezahlt, etc.)
   - Zahlungsstatus-Badge
   - Gesamtbetrag prominent angezeigt
   - Rechnungsdatum und Fälligkeitsdatum

4. **Rechnungspositionen prüfen:**
   - Positionen sollten aufgelistet sein
   - Beschreibung, Menge, Einzelpreis, Gesamt
   - Zwischensumme, MwSt., Gesamtbetrag

5. **PDF-Download testen:**
   - Klicke auf "PDF herunterladen"
   - ✅ PDF sollte heruntergeladen werden
   - ✅ Dateiname sollte Rechnungsnummer enthalten
   - ✅ PDF sollte korrekte Inhalte haben

6. **Bestellung-Link:**
   - Falls Rechnung mit Bestellung verknüpft ist
   - ✅ Link sollte zur Bestellungsseite führen

### Erwartete Ergebnisse:
- ✅ Alle Rechnungen werden angezeigt
- ✅ Status-Badges sind korrekt
- ✅ PDF-Download funktioniert
- ✅ DownloadGrant wird validiert
- ✅ Keine Fehler in der Konsole

---

## 4. Wishlist-Admin mit Analytics prüfen

### Test-Schritte:
1. **Zur Admin-Wishlists-Seite navigieren:**
   - Öffne: `http://localhost:3000/de/admin/wishlists`
   - Müssen als Admin eingeloggt sein

2. **Analytics-Dashboard prüfen:**
   - **Gesamt Merklisten**: Anzahl aller Wishlists
   - **Gesamt Artikel**: Anzahl aller Wishlist-Items
   - **Kunden mit Merkliste**: Anzahl eindeutiger Kunden
   - **Durchschnitt pro Merkliste**: Berechneter Wert
   - ✅ Alle Statistiken sollten korrekt sein

3. **Beliebte Artikel prüfen:**
   - Top 10 Artikel sollten angezeigt werden
   - Sortiert nach Häufigkeit in Wishlists
   - Jeder Artikel zeigt:
     - Rang (#1, #2, etc.)
     - Produktname mit Link
     - Kategorie-Badge
     - Anzahl (wie oft in Wishlists)
     - Herz-Icon

4. **Wishlist-Details prüfen:**
   - Jede Wishlist sollte angezeigt werden:
     - Wishlist-Name (oder "Standard-Merkliste")
     - Kunde-Informationen (Name, Kundennummer, E-Mail)
     - Anzahl Artikel
     - Primär-Badge (wenn zutreffend)
     - Alle Artikel in der Wishlist:
       - Produktname mit Link
       - Notizen (falls vorhanden)
       - Erstellungsdatum

5. **E-Mail-Benachrichtigung testen:**
   - In Admin: Edelstein bearbeiten
   - `isSold` von `true` auf `false` ändern
   - Speichern
   - ✅ E-Mails sollten an alle Kunden mit diesem Artikel in der Wishlist gesendet werden
   - ✅ Nur an Kunden mit `marketingOptIn: true`

### Erwartete Ergebnisse:
- ✅ Analytics werden korrekt angezeigt
- ✅ Beliebte Artikel sind sortiert
- ✅ Wishlist-Details sind vollständig
- ✅ Links funktionieren
- ✅ E-Mail-Benachrichtigungen werden gesendet

---

## Fehlerprüfung

### Konsole prüfen:
- Browser-Konsole: Keine JavaScript-Fehler
- Server-Logs: Keine API-Fehler

### API-Endpunkte testen:
```bash
# Reviews abrufen
curl http://localhost:3000/api/reviews?gemstoneId=TEST_ID

# Reviews erstellen (benötigt Auth)
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"gemstoneId":"TEST_ID","rating":5,"title":"Test","comment":"Sehr gut"}'

# Rechnungen abrufen (benötigt Auth)
curl http://localhost:3000/api/user/invoices

# Wishlists abrufen (benötigt Admin Auth)
curl http://localhost:3000/api/admin/wishlists
```

---

## Bekannte Probleme / TODOs

- ✅ **Review-E-Mail**: Admin-E-Mail wird automatisch aus ENV (`ADMIN_EMAIL`) oder `companySettings.email` geladen
- ⚠️ **Wishlist-E-Mail**: Funktioniert nur bei `marketingOptIn: true`
- ⚠️ **PDF-Download**: Erfordert, dass PDF bereits generiert wurde (passiert automatisch bei Rechnungserstellung)
- ⚠️ **Review-Verifizierung**: Automatisch bei Reviews mit `orderItemId`

---

## Test-Zusammenfassung

Nach dem Testen bitte folgende Checkliste ausfüllen:

- [ ] Review-Formular funktioniert
- [ ] Reviews werden angezeigt
- [ ] Admin-Review-Verwaltung funktioniert
- [ ] Rechnungen werden angezeigt
- [ ] PDF-Download funktioniert
- [ ] Wishlist-Admin zeigt Analytics
- [ ] Beliebte Artikel werden korrekt angezeigt
- [ ] E-Mail-Benachrichtigungen werden gesendet (optional prüfen)

