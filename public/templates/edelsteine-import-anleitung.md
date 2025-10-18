# Edelsteine Import-Vorlage - Anleitung

## Übersicht
Diese CSV-Vorlage ermöglicht es Ihnen, Edelsteine in großen Mengen in das System zu importieren.

## Datei-Download
- **Vorlage herunterladen**: [edelsteine-import-vorlage.csv](/templates/edelsteine-import-vorlage.csv)

## Spalten-Erklärung

### Grunddaten (Pflichtfelder)
- **name**: Name des Edelsteins (z.B. "Kolumbianischer Smaragd")
- **type**: Typ - `cut` (geschliffen) oder `rough` (roh)
- **description**: Detaillierte Beschreibung
- **price**: Preis in EUR (Zahl ohne Währungssymbol)
- **currency**: Währung (meist "EUR")
- **category**: Kategorie (z.B. "Smaragd", "Rubin", "Saphir")
- **color**: Farbe (z.B. "Grün", "Rot", "Blau")
- **origin**: Herkunftsland (z.B. "Kolumbien", "Myanmar")
- **inStock**: Verfügbarkeit - `true` oder `false`
- **quantity**: Anzahl verfügbarer Stücke

### Geschliffene Steine (nur bei type="cut")
- **caratWeight**: Gewicht in Karat (z.B. 2.5)
- **cut**: Schliff-Art (z.B. "Brillant", "Smaragdschliff", "Cabochon")
- **cutQuality**: Schliff-Qualität - `Excellent`, `Very Good`, `Good`, `Fair`, `Poor`
- **clarity**: Reinheit (z.B. "VVS1", "VS2", "SI1", "IF")
- **clarityGrade**: Zusätzliche Reinheits-Beschreibung
- **colorGrade**: Farb-Grad (z.B. "D", "E", "F" bei Diamanten)
- **colorIntensity**: Farbintensität - `Vivid`, `Intense`, `Medium`, `Light`
- **symmetry**: Symmetrie - `Excellent`, `Very Good`, `Good`, `Fair`, `Poor`
- **polish**: Politur - `Excellent`, `Very Good`, `Good`, `Fair`, `Poor`

### Rohsteine (nur bei type="rough")
- **gramWeight**: Gewicht in Gramm (z.B. 15.2)
- **crystalQuality**: Kristallqualität - `Excellent`, `Very Good`, `Good`, `Fair`, `Poor`
- **transparency**: Transparenz - `Transparent`, `Translucent`, `Opaque`
- **estimatedCaratYield**: Geschätzte Karat-Ausbeute nach dem Schleifen
- **suitableFor**: Verwendungszweck (kommagetrennt) - z.B. "Schmuck,Sammlung,Investment"

### Behandlung & Zertifizierung
- **treated**: Behandelt - `true` oder `false`
- **treatmentType**: Behandlungsart - `none`, `heated`, `oiled`, `irradiated`, `diffused`, `filled`, `coated`, `other`
- **treatmentDescription**: Beschreibung der Behandlung
- **certified**: Zertifiziert - `true` oder `false`
- **certLab**: Zertifizierungs-Labor - `GIA`, `IGI`, `AGS`, `HRD`, `SSEF`, `Gübelin`, `GRS`, `other`, `none`
- **certificateNumber**: Zertifikatsnummer
- **certificateUrl**: Link zum Zertifikat (PDF)

### Weitere Eigenschaften
- **mineLocation**: Spezifische Mine (optional)
- **rarity**: Seltenheit - `none`, `seltenes`, `außergewöhnliches`, `großes`, `besonders schön`
- **length**: Länge in mm
- **width**: Breite in mm
- **height**: Höhe in mm

### Bilder
- **mainImage**: Hauptbild-URL (z.B. "/images/emerald1.jpg")
- **images**: Alle Bild-URLs (kommagetrennt) - z.B. "/images/emerald1.jpg,/images/emerald2.jpg"

## Wichtige Hinweise

### Datenformat
- Verwenden Sie **Anführungszeichen** um Text mit Kommas
- **Dezimalzahlen** mit Punkt (z.B. 2.5, nicht 2,5)
- **Boolean-Werte**: `true` oder `false` (kleingeschrieben)
- **Leere Felder**: Lassen Sie Felder leer, die nicht zutreffen

### Pflichtfelder
Diese Felder müssen ausgefüllt werden:
- name, type, description, price, currency, category, origin, inStock, quantity

### Typ-spezifische Felder
- **Geschliffene Steine**: caratWeight, cut, clarity
- **Rohsteine**: gramWeight, crystalQuality

### Beispiel-Zeilen

#### Geschliffener Smaragd:
```csv
"Kolumbianischer Smaragd",cut,"Exquisiter Smaragd aus Kolumbien",2500,EUR,Smaragd,Grün,Kolumbien,Muzo,2.5,Brillant,Excellent,VVS1,Sehr kleine Einschlüsse,,,,,,,,,,false,none,,true,GIA,12345,https://example.com/cert.pdf,seltenes,true,1,8.5,6.2,4.1,/images/emerald1.jpg,"/images/emerald1.jpg,/images/emerald2.jpg"
```

#### Rohstein:
```csv
"Saphir Rohkristall",rough,"Transparenter Saphir-Kristall",1200,EUR,Saphir,Blau,Sri Lanka,Ratnapura,,15.2,,,,,,,,,Excellent,Transparent,8.5,"Schmuck,Sammlung",false,none,,false,none,,,großes,true,1,25.3,18.7,12.4,/images/sapphire-rough1.jpg,"/images/sapphire-rough1.jpg"
```

## Import-Prozess
1. Laden Sie die Vorlage herunter
2. Füllen Sie die Daten entsprechend der Anleitung aus
3. Speichern Sie als CSV-Datei
4. Verwenden Sie die Import-Funktion im Admin-Panel
5. Überprüfen Sie die importierten Daten

## Fehlerbehebung
- **Encoding**: Verwenden Sie UTF-8 Kodierung
- **Trennzeichen**: Nur Kommas als Trennzeichen verwenden
- **Anführungszeichen**: Text mit Kommas in Anführungszeichen setzen
- **Leere Zeilen**: Entfernen Sie leere Zeilen am Ende der Datei

## Support
Bei Fragen oder Problemen wenden Sie sich an den Administrator.


