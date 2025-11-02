# Admin Panel Funktionstests - Übersicht

Dieses Dokument beschreibt alle erstellten und geplanten Funktionstests für das Admin-Panel.

## ✅ Erstellte Tests

### 1. Dashboard (`__tests__/admin/dashboard.test.tsx`)
**Abdeckung:**
- ✅ Seiten-Rendering mit Titel und Beschreibung
- ✅ Statistiken-Karten (Edelsteine, Kunden, Bestellungen, Umsatz)
- ✅ Wachstums-Indikatoren
- ✅ Letzte Aktivitäten Feed
- ✅ Best-Seller Sektion
- ✅ Datenbank-Abfragen
- ✅ Leere Zustände
- ✅ Locale-Unterstützung
- ✅ Fehlerbehandlung

### 2. Reviews (`__tests__/admin/reviews.test.tsx`)
**Abdeckung:**
- ✅ Seiten-Rendering und Ladezustand
- ✅ Review-Anzeige mit Bewertungen (Sterne)
- ✅ Kundeninformationen
- ✅ Gemstone-Links
- ✅ Formatierte Datumsanzeigen
- ✅ Verifizierungs-Badges
- ✅ Filter (Alle, Verifiziert, Nicht verifiziert)
- ✅ Verifizierungs-Aktionen (Verifizieren/Verifizierung entfernen)
- ✅ Löschen-Aktionen mit Bestätigung
- ✅ Leere Zustände
- ✅ Fehlerbehandlung
- ✅ Reviews ohne Gemstone oder Titel

### 3. Wishlists (`__tests__/admin/wishlists.test.tsx`)
**Abdeckung:**
- ✅ Seiten-Rendering und Ladezustand
- ✅ Analytics-Anzeige (Gesamt Merklisten, Artikel, Kunden)
- ✅ Durchschnitt-Berechnung
- ✅ Beliebte Gemstones (Top 10)
- ✅ Wishlist-Anzeige mit Namen/Standardname
- ✅ Primär-Wishlist Badge
- ✅ Kundeninformationen
- ✅ Item-Count Badges
- ✅ Wishlist-Items mit Gemstone-Links
- ✅ Item-Notizen
- ✅ Gelöschte Gemstones Handling
- ✅ Datumsformatierung
- ✅ Leere Zustände
- ✅ Fehlerbehandlung

### 4. Gemstones (`__tests__/admin/gemstones.test.tsx`)
**Abdeckung:**
- ✅ Seiten-Rendering
- ✅ Layout und Styling

**Hinweis:** Vollständige CRUD-Tests erfordern Tests des `GemstoneManagementSection`-Components mit:
- Erstellen neuer Edelsteine
- Bearbeiten bestehender Edelsteine
- Löschen von Edelsteinen
- Suche und Filterung
- Bulk-Operationen
- Bild-Upload
- Inventar-Verwaltung

### 5. Customers (`__tests__/admin/customers.test.tsx`)
**Bereits vorhanden** - Siehe bestehende Test-Datei

### 6. Audit Logs (`__tests__/admin/audit.test.tsx`)
**Bereits vorhanden** - Siehe bestehende Test-Datei

### 7. Reports (`__tests__/admin/reports.test.tsx`)
**Bereits vorhanden** - Siehe bestehende Test-Datei

## 📋 Geplante Tests (zu erstellen)

### 8. Orders (`__tests__/admin/orders.test.tsx`)
**Zu testen:**
- Seiten-Rendering mit Statistiken
- Bestellungs-Liste Anzeige
- Status-Filter (Alle, PENDING, CONFIRMED, FULFILLED, CANCELLED)
- Such-Funktionalität (Bestellnummer, Kunde)
- Datums-Filter
- Bestellungs-Details-Seite
- Status-Update-Funktionalität
- Bestellung bearbeiten
- Neue Bestellung erstellen
- Export-Funktionalität

### 9. Newsletter (`__tests__/admin/newsletter.test.tsx`)
**Zu testen:**
- Seiten-Rendering mit Statistiken
- Newsletter-Liste
- Abonnenten-Verwaltung
- Newsletter erstellen
- Newsletter versenden
- Öffnungs-/Klickrate-Anzeige
- Newsletter bearbeiten
- Abonnenten-Filter

### 10. Stories (`__tests__/admin/stories.test.tsx`)
**Zu testen:**
- Stories-Liste anzeigen
- Neue Story erstellen
- Story bearbeiten
- Story löschen
- Story-Vorschau
- Veröffentlichungsstatus ändern

### 11. Blog (`__tests__/admin/blogs.test.tsx`)
**Zu testen:**
- Blog-Artikel-Liste
- Neuen Artikel erstellen
- Artikel bearbeiten
- Artikel löschen
- Kategorien-Verwaltung
- Veröffentlichungsstatus

### 12. Wissenswertes (`__tests__/admin/wissenswertes.test.tsx`)
**Zu testen:**
- Artikel-Liste
- Neuen Artikel erstellen
- Artikel bearbeiten
- Artikel löschen
- Kategorien und Tags

### 13. Settings (`__tests__/admin/settings.test.tsx`)
**Zu testen:**
- Einstellungen-Seite anzeigen
- Konfiguration speichern
- Validierung
- Company Settings
- Email Settings
- System Settings

### 14. About (`__tests__/admin/about.test.tsx`)
**Zu testen:**
- Über-uns-Seite bearbeiten
- Inhalte speichern
- Bilder hochladen

### 15. Header Management (`__tests__/admin/header.test.tsx`)
**Zu testen:**
- Header-Konfiguration anzeigen
- Navigation bearbeiten
- Logo-Upload
- Menü-Struktur verwalten

### 16. Hero Image (`__tests__/admin/hero-image.test.tsx`)
**Zu testen:**
- Hero-Bild-Upload
- Bild-Bearbeitung
- Mehrere Hero-Bilder verwalten
- Aktivierung/Deaktivierung

### 17. Newsticker (`__tests__/admin/newsticker.test.tsx`)
**Zu testen:**
- Newsticker-Einträge verwalten
- Neuen Eintrag erstellen
- Eintrag bearbeiten/löschen
- Aktivierung/Deaktivierung

### 18. Worldmap (`__tests__/admin/worldmap.test.tsx`)
**Zu testen:**
- Länder hinzufügen/bearbeiten
- Fundorte verwalten
- Gemstone-Typen zuordnen
- Karten-Integration

### 19. Pictogram Descriptions (`__tests__/admin/pictogram-descriptions.test.tsx`)
**Zu testen:**
- Piktogramme verwalten
- Beschreibungen bearbeiten
- Bild-Upload

### 20. Select Options (`__tests__/admin/select-options.test.tsx`)
**Zu testen:**
- Select-Optionen verwalten
- Neue Optionen hinzufügen
- Optionen bearbeiten/löschen

## 🧪 Test-Patterns und Best Practices

### Gemeinsame Test-Patterns

1. **Page Rendering Tests**
   ```typescript
   it('should render page with title and description', async () => {
     render(<Component />);
     expect(screen.getByText('Title')).toBeInTheDocument();
   });
   ```

2. **Loading States**
   ```typescript
   it('should show loading state initially', () => {
     render(<Component />);
     expect(screen.getByText('Loading...')).toBeInTheDocument();
   });
   ```

3. **API Calls**
   ```typescript
   it('should fetch data on mount', async () => {
     render(<Component />);
     await waitFor(() => {
       expect(global.fetch).toHaveBeenCalledWith('/api/endpoint');
     });
   });
   ```

4. **Filter Functionality**
   ```typescript
   it('should filter data correctly', async () => {
     render(<Component />);
     const filterButton = screen.getByText('Filter');
     fireEvent.click(filterButton);
     await waitFor(() => {
       expect(global.fetch).toHaveBeenCalledWith('/api/endpoint?filter=value');
     });
   });
   ```

5. **CRUD Operations**
   ```typescript
   it('should create new item', async () => {
     render(<Component />);
     const createButton = screen.getByText('Create');
     fireEvent.click(createButton);
     // ... fill form and submit
     await waitFor(() => {
       expect(global.fetch).toHaveBeenCalledWith('/api/endpoint', {
         method: 'POST',
         body: expect.any(String),
       });
     });
   });
   ```

6. **Error Handling**
   ```typescript
   it('should handle API errors gracefully', async () => {
     (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
     const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
     render(<Component />);
     await waitFor(() => {
       expect(consoleSpy).toHaveBeenCalled();
     });
     consoleSpy.mockRestore();
   });
   ```

7. **Empty States**
   ```typescript
   it('should display empty state when no data exists', async () => {
     (global.fetch as jest.Mock).mockResolvedValue({
       json: async () => ({ success: true, data: [] }),
     });
     render(<Component />);
     await waitFor(() => {
       expect(screen.getByText('No data found')).toBeInTheDocument();
     });
   });
   ```

## 📊 Test-Statistik

- **Erstellt:** 4 Test-Dateien (Dashboard, Reviews, Wishlists, Gemstones)
- **Bereits vorhanden:** 3 Test-Dateien (Customers, Audit, Reports)
- **Geplant:** 13 weitere Test-Dateien
- **Gesamt-Tests:** ~150+ einzelne Test-Cases

## 🚀 Nächste Schritte

1. Orders-Tests erstellen (Priorität: Hoch)
2. Newsletter-Tests erstellen (Priorität: Hoch)
3. Settings-Tests erstellen (Priorität: Mittel)
4. Content-Management-Tests (Stories, Blog, Wissenswertes) (Priorität: Mittel)
5. Konfigurations-Tests (Header, Hero-Image, Newsticker) (Priorität: Niedrig)

## 📝 Hinweise

- Alle Tests verwenden React Testing Library
- Mocking erfolgt für `fetch`, `next/navigation`, und `prisma`
- Tests sind für React 19 kompatibel
- Fehlerbehandlung wird in allen Tests abgedeckt
- Leere Zustände werden getestet
- Datumsformatierung wird auf Deutsch getestet

