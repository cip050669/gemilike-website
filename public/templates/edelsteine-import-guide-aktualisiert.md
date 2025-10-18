# Edelsteine-Import Guide (Aktualisiert)

## 📋 CSV-Format Spezifikation - Angepasst an GemstoneCard

### Erforderliche Spalten

| Spalte | Typ | Beschreibung | Beispiel | Validierung |
|--------|-----|--------------|----------|-------------|
| `id` | String | Eindeutige ID | `cut-001` | Erforderlich, eindeutig |
| `name` | String | Name des Edelsteins | `Santa Maria blauer Aquamarin` | Erforderlich, max. 255 Zeichen |
| `type` | String | Edelstein-Typ | `cut` oder `rough` | Erforderlich, nur "cut" oder "rough" |
| `description` | String | Beschreibung | `herausragendes blau, erhitzt` | Erforderlich, max. 1000 Zeichen |
| `price` | Number | Preis in EUR | `1600` | Erforderlich, positive Zahl |
| `currency` | String | Währung | `EUR` | Erforderlich, Standard: "EUR" |
| `category` | String | Edelstein-Kategorie | `Aquamarin` | Erforderlich, max. 100 Zeichen |
| `color` | String | Farbe | `blau` | Optional, max. 50 Zeichen |
| `origin` | String | Herkunftsland | `Brasilien` | Erforderlich, max. 100 Zeichen |
| `originType` | String | Herkunftstyp | `natürlich` oder `synthetisch` | Erforderlich |
| `mineLocation` | String | Spezifische Mine | `Santa Maria` | Optional, max. 100 Zeichen |

### Geschliffene Steine (type = "cut")

| Spalte | Typ | Beschreibung | Beispiel | Validierung |
|--------|-----|--------------|----------|-------------|
| `caratWeight` | Number | Gewicht in Karat | `6.96` | Erforderlich für geschliffene Steine |
| `cut` | String | Schliff-Art | `Kissen` | Erforderlich, max. 50 Zeichen |
| `cutForm` | String | Schliff-Form | `Kissen` | Optional, max. 50 Zeichen |
| `cutQuality` | String | Schliff-Qualität | `Excellent` | Optional: Excellent, Very Good, Good, Fair, Poor |
| `clarity` | String | Reinheit | `Augenrein` | Erforderlich, max. 50 Zeichen |
| `clarityGrade` | String | Reinheits-Grad | `keine Einschlüsse` | Optional, max. 200 Zeichen |
| `colorGrade` | String | Farb-Grad | `D` | Optional, max. 10 Zeichen |
| `colorIntensity` | String | Farb-Intensität | `Intense` | Optional: Vivid, Intense, Light |
| `colorSaturation` | Number | Farb-Sättigung | `8` | Optional, 1-10 Skala |
| `symmetry` | String | Symmetrie | `Excellent` | Optional: Excellent, Very Good, Good, Fair, Poor |
| `polish` | String | Politur | `Excellent` | Optional: Excellent, Very Good, Good, Fair, Poor |

### Rohsteine (type = "rough")

| Spalte | Typ | Beschreibung | Beispiel | Validierung |
|--------|-----|--------------|----------|-------------|
| `gramWeight` | Number | Gewicht in Gramm | `45.2` | Erforderlich für Rohsteine |
| `crystalQuality` | String | Kristall-Qualität | `Excellent` | Erforderlich: Excellent, Very Good, Good, Fair, Poor |
| `crystalForm` | String | Kristall-Form | `Hexagonal` | Optional, max. 50 Zeichen |
| `transparency` | String | Transparenz | `Translucent` | Erforderlich: Transparent, Translucent, Opaque |
| `estimatedCaratYield` | Number | Geschätzte Karat-Ausbeute | `12.5` | Optional, positive Zahl |
| `suitableFor` | String | Geeignet für | `Schmuck, Sammlung` | Optional, Komma-getrennt |

### Behandlung (Treatment)

| Spalte | Typ | Beschreibung | Beispiel | Validierung |
|--------|-----|--------------|----------|-------------|
| `treated` | Boolean | Behandelt | `true` oder `false` | Erforderlich |
| `treatmentType` | String | Behandlungs-Art | `heated` | Optional: none, heated, oiled, irradiated, etc. |
| `treatmentDescription` | String | Behandlungs-Beschreibung | `traditionelle Erhitzung` | Optional, max. 200 Zeichen |

### Zertifizierung (Certification)

| Spalte | Typ | Beschreibung | Beispiel | Validierung |
|--------|-----|--------------|----------|-------------|
| `certified` | Boolean | Zertifiziert | `true` oder `false` | Erforderlich |
| `certLab` | String | Zertifizierungs-Labor | `GIA` | Optional: GIA, IGI, AGS, HRD, SSEF, Gübelin, etc. |
| `certificateNumber` | String | Zertifikats-Nummer | `GIA-2024-001` | Optional, max. 50 Zeichen |
| `certificateUrl` | String | Zertifikats-URL | `https://...` | Optional, gültige URL |

### Verfügbarkeit & Lager

| Spalte | Typ | Beschreibung | Beispiel | Validierung |
|--------|-----|--------------|----------|-------------|
| `rarity` | String | Seltenheit | `Außergewöhnlich` | Optional: Sehr häufig, Häufig, Mäßig selten, Selten, Sehr selten, Außergewöhnlich, Einzigartig |
| `inStock` | Boolean | Auf Lager | `true` oder `false` | Erforderlich |
| `quantity` | Number | Anzahl | `1` | Erforderlich, positive Zahl |

### Abmessungen (Dimensions)

| Spalte | Typ | Beschreibung | Beispiel | Validierung |
|--------|-----|--------------|----------|-------------|
| `length` | Number | Länge in mm | `12.12` | Erforderlich, positive Zahl |
| `width` | Number | Breite in mm | `10.38` | Erforderlich, positive Zahl |
| `height` | Number | Höhe in mm | `7.62` | Erforderlich, positive Zahl |

### Medien (Media)

| Spalte | Typ | Beschreibung | Beispiel | Validierung |
|--------|-----|--------------|----------|-------------|
| `mainImage` | String | Hauptbild | `/products/696_Aqua-1.jpg` | Erforderlich, gültiger Pfad |
| `images` | String | Alle Bilder | `/products/696_Aqua-1.jpg,/products/696_Aqua-2.jpg` | Optional, Komma-getrennt, max. 10 Bilder |
| `videos` | String | Videos | `/products/emerald-video.mp4` | Optional, Komma-getrennt, max. 2 Videos |

## 📝 Beispiel-CSV (Aktualisiert)

```csv
id,name,type,description,price,currency,category,color,origin,originType,mineLocation,caratWeight,gramWeight,cut,cutForm,cutQuality,clarity,clarityGrade,colorGrade,colorIntensity,colorSaturation,symmetry,polish,crystalQuality,crystalForm,transparency,estimatedCaratYield,suitableFor,treated,treatmentType,treatmentDescription,certified,certLab,certificateNumber,certificateUrl,rarity,inStock,quantity,length,width,height,mainImage,images,videos
cut-001,Santa Maria blauer Aquamarin,cut,"herausragendes blau, erhitzt, farbstabil",1600,EUR,Aquamarin,blau,Brasilien,natürlich,Santa Maria,6.96,,Kissen,Kissen,Excellent,Augenrein,,Intense,8,Excellent,Excellent,,,,,"Schmuck, Sammlerstück",true,heated,traditionelle Erhitzung,true,ICI,ICI-2024-001,,Außergewöhnlich,true,1,12.12,10.38,7.62,/products/696_Aqua-1.jpg,"/products/696_Aqua-1.jpg,/products/696_Aqua-2.jpg",
```

## 🔧 Wichtige Änderungen zur ursprünglichen Vorlage

### ✅ **Hinzugefügte Spalten:**
- `id` - Eindeutige Identifikation
- `originType` - Natürlich vs. Synthetisch
- `colorGrade` - Farb-Grad (z.B. D, E, F bei Diamanten)
- `colorSaturation` - Farb-Sättigung (1-10 Skala)
- `crystalQuality` - Kristall-Qualität für Rohsteine
- `crystalForm` - Kristall-Form
- `transparency` - Transparenz-Grad
- `estimatedCaratYield` - Geschätzte Karat-Ausbeute
- `suitableFor` - Verwendungszweck
- `certificateUrl` - Zertifikats-URL
- `videos` - Video-Dateien

### 🔄 **Angepasste Spalten:**
- `type` - Jetzt strikt "cut" oder "rough"
- `treatment` → `treated` + `treatmentType` + `treatmentDescription`
- `certification` → `certified` + `certLab` + `certificateNumber` + `certificateUrl`
- `dimensions` → `length` + `width` + `height`
- `images` - Jetzt Komma-getrennte Liste statt einzelne Spalten

### ❌ **Entfernte Spalten:**
- `caratWeight` und `gramWeight` - Jetzt getrennt je nach Typ
- `cutQuality` - Jetzt optional
- `clarityGrade` - Jetzt optional
- `colorIntensity` - Jetzt optional
- `symmetry` und `polish` - Jetzt optional
- `crystalQuality` - Jetzt nur für Rohsteine
- `crystalForm` - Jetzt nur für Rohsteine
- `transparency` - Jetzt nur für Rohsteine
- `estimatedCaratYield` - Jetzt nur für Rohsteine
- `suitableFor` - Jetzt nur für Rohsteine

## ⚠️ Wichtige Hinweise

### Typ-spezifische Felder
- **Geschliffene Steine (cut)**: `caratWeight`, `cut`, `cutForm`, `cutQuality`, `clarity`, `clarityGrade`, `colorGrade`, `colorIntensity`, `colorSaturation`, `symmetry`, `polish`
- **Rohsteine (rough)**: `gramWeight`, `crystalQuality`, `crystalForm`, `transparency`, `estimatedCaratYield`, `suitableFor`

### Validierung
- **Koordinaten**: Lat zwischen -90 und +90, Lng zwischen -180 und +180
- **Gewichte**: Positive Zahlen
- **Abmessungen**: Positive Zahlen in mm
- **Qualitäts-Bewertungen**: Nur vordefinierte Werte
- **URLs**: Gültige Pfade oder URLs

### Medien-Handling
- **Hauptbild**: Erforderlich, gültiger Pfad
- **Bilder**: Komma-getrennt, max. 10 Bilder
- **Videos**: Komma-getrennt, max. 2 Videos, MP4-Format

## 🚨 Häufige Fehler

### Typ-Fehler
```
❌ Falsch: type=gemstone
✅ Richtig: type=cut oder type=rough
```

### Gewichts-Fehler
```
❌ Falsch: caratWeight=0 (bei Rohsteinen)
✅ Richtig: gramWeight=45.2 (bei Rohsteinen)
```

### Medien-Fehler
```
❌ Falsch: mainImage=products/image.jpg
✅ Richtig: mainImage=/products/image.jpg
```

## 📊 Performance-Tipps

### Große Datenmengen
- Teilen Sie sehr große CSV-Dateien (>500 Zeilen) in kleinere Dateien auf
- Verwenden Sie Batch-Import für bessere Performance
- Überwachen Sie den Speicherverbrauch

### Datenqualität
- Bereinigen Sie die Daten vor dem Import
- Entfernen Sie Duplikate
- Standardisieren Sie die Schreibweise
- Überprüfen Sie alle Pfade und URLs

### Backup
- Erstellen Sie ein Backup der Datenbank vor großen Imports
- Testen Sie den Import mit einer kleinen Testdatei
- Dokumentieren Sie Änderungen

## 🔗 Weitere Ressourcen

- **Admin-Panel**: `/de/admin/gemstones`
- **Shop**: `/de/shop`
- **API-Dokumentation**: `/api/admin/gemstones`
- **Template-Download**: Verfügbar im Admin-Panel

## 📞 Support

Bei Fragen oder Problemen wenden Sie sich an den Administrator oder konsultieren Sie die technische Dokumentation.
