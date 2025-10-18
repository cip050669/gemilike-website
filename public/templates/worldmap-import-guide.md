# Weltkarten-Daten Import Guide

## 📋 CSV-Format Spezifikation

### Erforderliche Spalten

| Spalte | Typ | Beschreibung | Beispiel | Validierung |
|--------|-----|--------------|----------|-------------|
| `name` | String | Name der Lagerstätte/Mine | `Cullinan Mine` | Erforderlich, max. 255 Zeichen |
| `country` | String | Land der Lagerstätte | `Südafrika` | Erforderlich, max. 100 Zeichen |
| `lat` | Number | Breitengrad (Latitude) | `-25.6703` | Erforderlich, -90 bis +90 |
| `lng` | Number | Längengrad (Longitude) | `28.5231` | Erforderlich, -180 bis +180 |
| `gem` | String | Edelstein-Typ | `Diamond` | Optional, Standard: "Unknown" |
| `description` | String | Beschreibung der Lagerstätte | `Heimat des größten Diamanten der Welt` | Optional, max. 1000 Zeichen |
| `mineType` | String | Art der Mine | `open-pit` | Optional, Standard: "primary" |
| `status` | String | Status der Lagerstätte | `active` | Optional, Standard: "active" |

### Unterstützte Werte

#### Edelstein-Typen (`gem`)
- `Diamond` - Diamant
- `Ruby` - Rubin
- `Sapphire` - Saphir
- `Emerald` - Smaragd
- `Tanzanite` - Tansanit
- `Opal` - Opal
- `Tourmaline` - Turmalin
- `Garnet` - Granat
- `Spinel` - Spinell
- `Alexandrite` - Alexandrit
- `Zircon` - Zirkon
- `Peridot` - Peridot
- `Aquamarine` - Aquamarin
- `Topaz` - Topas
- `Jade` - Jade
- `Demantoid` - Demantoid
- `Uvarovite` - Uwarowit
- `Pearl` - Perle

#### Minen-Typen (`mineType`)
- `open-pit` - Tagebau
- `underground` - Untertagebau
- `alluvial` - Seifenlagerstätte
- `primary` - Primärlagerstätte
- `secondary` - Sekundärlagerstätte

#### Status (`status`)
- `active` - Aktiv
- `inactive` - Inaktiv
- `depleted` - Erschöpft
- `protected` - Geschützt

## 📝 Beispiel-CSV

```csv
name,country,lat,lng,gem,description,mineType,status
Cullinan Mine,Südafrika,-25.6703,28.5231,Diamond,Heimat des größten Diamanten der Welt,open-pit,active
Mogok Valley,Myanmar,22.9167,96.5167,Ruby,Berühmt für die feinsten Rubine der Welt,primary,active
Muzo,Kolumbien,5.5,-74,Emerald,Berühmte Smaragd-Mine,underground,active
```

## 🔧 Import-Prozess

### 1. CSV-Datei vorbereiten
- Verwenden Sie die bereitgestellte Vorlage
- Stellen Sie sicher, dass alle erforderlichen Spalten vorhanden sind
- Überprüfen Sie die Koordinaten auf Richtigkeit
- Verwenden Sie UTF-8 Kodierung

### 2. Daten validieren
- **Koordinaten**: Lat zwischen -90 und +90, Lng zwischen -180 und +180
- **Namen**: Nicht leer, max. 255 Zeichen
- **Länder**: Nicht leer, max. 100 Zeichen
- **Beschreibungen**: Max. 1000 Zeichen

### 3. Import durchführen
- Laden Sie die CSV-Datei über das Admin-Panel hoch
- Überprüfen Sie die Vorschau der ersten 5 Zeilen
- Starten Sie den Import-Prozess
- Überwachen Sie den Fortschritt

### 4. Ergebnisse überprüfen
- Überprüfen Sie die Import-Statistiken
- Beheben Sie eventuelle Fehler
- Testen Sie die Daten in der Weltkarte

## ⚠️ Wichtige Hinweise

### Koordinaten
- **Breitengrad (lat)**: -90 (Südpol) bis +90 (Nordpol)
- **Längengrad (lng)**: -180 (West) bis +180 (Ost)
- Verwenden Sie Dezimalgrad-Format (nicht Grad/Minuten/Sekunden)
- Negative Werte für Süd und West

### Länder
- Verwenden Sie den vollständigen Ländernamen
- Konsistente Schreibweise (z.B. "Südafrika" nicht "South Africa")
- Länder werden automatisch erstellt falls nicht vorhanden

### Edelstein-Typen
- Verwenden Sie die englischen Namen
- Neue Edelstein-Typen werden automatisch erstellt
- Farben werden automatisch zugeordnet

### Batch-Import
- Import erfolgt in 10er-Batches
- Fehler in einem Batch stoppen nicht den gesamten Import
- Fortschritt wird in Echtzeit angezeigt

## 🚨 Häufige Fehler

### Koordinaten-Fehler
```
❌ Falsch: lat=90.5 (außerhalb des gültigen Bereichs)
✅ Richtig: lat=-25.6703
```

### Format-Fehler
```
❌ Falsch: "Cullinan Mine",Südafrika,-25.6703,28.5231
✅ Richtig: Cullinan Mine,Südafrika,-25.6703,28.5231
```

### Leere Felder
```
❌ Falsch: ,Südafrika,-25.6703,28.5231
✅ Richtig: Cullinan Mine,Südafrika,-25.6703,28.5231
```

## 📊 Performance-Tipps

### Große Datenmengen
- Teilen Sie sehr große CSV-Dateien (>1000 Zeilen) in kleinere Dateien auf
- Verwenden Sie Batch-Import für bessere Performance
- Überwachen Sie den Speicherverbrauch

### Datenqualität
- Bereinigen Sie die Daten vor dem Import
- Entfernen Sie Duplikate
- Standardisieren Sie die Schreibweise

### Backup
- Erstellen Sie ein Backup der Datenbank vor großen Imports
- Testen Sie den Import mit einer kleinen Testdatei
- Dokumentieren Sie Änderungen

## 🔗 Weitere Ressourcen

- **Admin-Panel**: `/de/admin/worldmap`
- **Weltkarte**: `/de/worldmap`
- **API-Dokumentation**: `/api/admin/worldmap`
- **Template-Download**: Verfügbar im Admin-Panel

## 📞 Support

Bei Fragen oder Problemen wenden Sie sich an den Administrator oder konsultieren Sie die technische Dokumentation.
