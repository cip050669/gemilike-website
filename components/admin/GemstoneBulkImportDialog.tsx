'use client';

import { useState, useRef } from 'react';
import { AdminButton } from './AdminButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Upload,
  CheckCircle,
  XCircle,
  Download,
  Trash2,
} from 'lucide-react';

interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  errors: string[];
  warnings: string[];
}

interface GemstoneBulkImportDialogProps {
  onImportComplete: () => void;
}

type RawCsvRow = Record<string, string>;

interface ValidatedGemstone {
  name: string;
  category: string;
  type: 'cut' | 'rough';
  condition: 'CUT' | 'ROUGH';
  origin?: string;
  color?: string;
  cut?: string;
  cutForm?: string;
  caratWeight?: number;
  gramWeight?: number;
  price: number;
  currency: string;
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  clarity?: string;
  colorIntensity?: string;
  colorBrightness?: number;
  treatment?: string;
  certification?: string;
  certificateId?: string;
  certificateUrl?: string;
  rarity?: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  images: string[];
  videos: string[];
  isNew: boolean;
  featured: boolean;
  inStock: boolean;
  sku?: string;
  quantity: number;
}

export function GemstoneBulkImportDialog({ onImportComplete }: GemstoneBulkImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [csvData, setCsvData] = useState<string>('');
  const [previewData, setPreviewData] = useState<RawCsvRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Bitte wählen Sie eine CSV-Datei aus.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvData(content);
      parseCSV(content);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const parseCSV = (content: string) => {
    const { headers, rows, lineCount } = parseCsvContent(content);
    console.log(`parseCSV: Found ${lineCount} rows (including header)`);

    if (headers.length === 0 || rows.length === 0) {
      alert('CSV-Datei muss mindestens eine Header-Zeile und eine Daten-Zeile enthalten.');
      return;
    }

    const data = rows.map<RawCsvRow>((values) => {
      const row: RawCsvRow = {};
      headers.forEach((header, index) => {
        row[header] = (values[index] || '').trim().replace(/^"|"$/g, '');
      });
      return row;
    });

    setPreviewData(data.slice(0, 5)); // Show first 5 rows
  };

  const handleManualCSV = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setCsvData(content);
    if (content.trim()) {
      parseCSV(content);
    }
  };

  const parseNumber = (value: string | undefined): number | null => {
    if (!value || value.trim() === '') return null;
    
    // Remove all whitespace
    let normalized = value.trim().replace(/\s/g, '');
    
    // Handle different number formats:
    // 1. German format: "1.234,56" (dot as thousand separator, comma as decimal)
    // 2. English format: "1,234.56" (comma as thousand separator, dot as decimal)
    // 3. Simple format: "1234,56" or "1234.56" (no thousand separator)
    
    // Count dots and commas
    const dotCount = (normalized.match(/\./g) || []).length;
    const commaCount = (normalized.match(/,/g) || []).length;
    
    if (dotCount > 0 && commaCount > 0) {
      // Both present - determine which is decimal separator
      const lastDot = normalized.lastIndexOf('.');
      const lastComma = normalized.lastIndexOf(',');
      
      if (lastComma > lastDot) {
        // Comma is decimal separator (German format: "1.234,56")
        normalized = normalized.replace(/\./g, '').replace(',', '.');
      } else {
        // Dot is decimal separator (English format: "1,234.56")
        normalized = normalized.replace(/,/g, '');
      }
    } else if (commaCount > 0) {
      // Only comma - could be decimal separator or thousand separator
      // If there's only one comma, treat it as decimal separator
      if (commaCount === 1) {
        normalized = normalized.replace(',', '.');
      } else {
        // Multiple commas - likely thousand separators (e.g., "1,234,567")
        normalized = normalized.replace(/,/g, '');
      }
    } else if (dotCount > 1) {
      // Multiple dots - likely thousand separators (e.g., "1.234.567")
      normalized = normalized.replace(/\./g, '');
    }
    // If only one dot, it's already in correct format
    
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? null : parsed;
  };

  const parseBoolean = (value: string | undefined): boolean => {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    return ['true', '1', 'yes', 'ja'].includes(normalized);
  };

  const normalizeMediaPath = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return '';
    const publicIndex = trimmed.lastIndexOf('/public/');
    if (publicIndex >= 0) {
      return trimmed.slice(publicIndex + '/public'.length);
    }
    const windowsPublicIndex = trimmed.toLowerCase().lastIndexOf('\\public\\');
    if (windowsPublicIndex >= 0) {
      return trimmed.slice(windowsPublicIndex + '\\public'.length).replace(/\\/g, '/');
    }
    return trimmed;
  };

  const parseStringArray = (value: string | undefined): string[] => {
    if (!value || value.trim() === '') return [];
    // Split by comma and filter empty values
    return value
      .split(',')
      .map(v => normalizeMediaPath(v))
      .filter(Boolean);
  };

  const parseCsvContent = (content: string): { headers: string[]; rows: string[][]; lineCount: number } => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentValue = '';
    let inQuotes = false;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const nextChar = content[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentValue += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (char === ',' && !inQuotes) {
        currentRow.push(currentValue.trim());
        currentValue = '';
        continue;
      }

      if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        currentRow.push(currentValue.trim());
        const isEmptyRow = currentRow.every(value => value === '');
        if (!isEmptyRow) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentValue = '';
        continue;
      }

      currentValue += char;
    }

    if (currentValue.length > 0 || currentRow.length > 0) {
      currentRow.push(currentValue.trim());
      const isEmptyRow = currentRow.every(value => value === '');
      if (!isEmptyRow) {
        rows.push(currentRow);
      }
    }

    if (rows.length === 0) {
      return { headers: [], rows: [], lineCount: 0 };
    }

    const headers = rows[0].map(h => h.trim().replace(/"/g, ''));
    const dataRows = rows.slice(1);
    return { headers, rows: dataRows, lineCount: rows.length };
  };

  const normalizeRow = (row: RawCsvRow): RawCsvRow => {
    const getFirst = (keys: string[]): string => {
      for (const key of keys) {
        const value = row[key];
        if (value && value.trim() !== '') {
          return value;
        }
      }
      return '';
    };

    const inStockRaw = getFirst(['inStock', 'InStock', 'in_stock']);
    const soldRaw = getFirst(['Verkauft', 'sold', 'isSold', 'verkauft']);
    const derivedSold = inStockRaw ? (parseBoolean(inStockRaw) ? 'false' : 'true') : '';

    return {
      Stein: getFirst(['Stein', 'Name', 'name', 'stone', 'gem', 'Gemstone']),
      Herkunft: getFirst(['Herkunft', 'origin', 'Origin']),
      Farbe: getFirst(['Farbe', 'color', 'Color']),
      'Cut/Rough': getFirst(['Cut/Rough', 'type', 'Type', 'cutRough', 'cut/rough']),
      Karat: getFirst([
        'Karat',
        'caratWeight',
        'Carat',
        'Karat (ct)',
        'Karat(ct)',
        'ct',
        'gramWeight',
        'Gramm',
        'Gewicht_g',
      ]),
      'Preis (Brutto)': getFirst(['Preis (Brutto)', 'Preis', 'price', 'Price']),
      Kategorie: getFirst(['Kategorie', 'category', 'Category']),
      Entstehung: getFirst(['Entstehung', 'originType', 'OriginType']),
      Schliffart: getFirst(['Schliffart', 'cut', 'Cut']),
      Schliffform: getFirst(['Schliffform', 'cutForm', 'CutForm']),
      Reinheitsgrad: getFirst(['Reinheitsgrad', 'clarity', 'Clarity']),
      Farbsättigung: getFirst(['Farbsättigung', 'colorIntensity', 'ColorIntensity']),
      Helligkeit: getFirst(['Helligkeit', 'colorBrightness', 'colorSaturation', 'ColorBrightness']),
      Behandlungsart: getFirst(['Behandlungsart', 'treatment', 'Treatment']),
      Zertifizierungs_Labor: getFirst(['Zertifizierungs_Labor', 'certification', 'Certification']),
      Zertifikatsnummer: getFirst(['Zertifikatsnummer', 'certificationNumber', 'CertificateId', 'certificateId']),
      Zertifikats_URL: getFirst(['Zertifikats_URL', 'certificationUrl', 'CertificateUrl', 'certificateUrl']),
      Rarität: getFirst(['Rarität', 'rarity', 'Rarity']),
      Anzahl: getFirst(['Anzahl', 'stock', 'quantity', 'Quantity']),
      SKU: getFirst(['SKU', 'sku']),
      Währung: getFirst(['Währung', 'currency', 'Currency']),
      Kurzbeschreibung: getFirst(['Kurzbeschreibung', 'description', 'shortDescription', 'ShortDescription']),
      Langbeschreibung: getFirst(['Langbeschreibung', 'longDescription', 'LongDescription']),
      Bilder: getFirst(['Bilder', 'images', 'Images']),
      Videos: getFirst(['Videos', 'videos', 'Videos']),
      Neu: getFirst(['Neu', 'isNew', 'new', 'IsNew']),
      Featured: getFirst(['Featured', 'featured', 'isFeatured', 'IsFeatured']),
      Verkauft: soldRaw || derivedSold,
      Länge_mm: getFirst(['Länge_mm', 'length', 'lengthMm', 'Length']),
      Breite_mm: getFirst(['Breite_mm', 'width', 'widthMm', 'Width']),
      Höhe_mm: getFirst(['Höhe_mm', 'height', 'heightMm', 'Height']),
    };
  };

  const validateData = (data: RawCsvRow[]): { valid: ValidatedGemstone[]; errors: string[] } => {
    const valid: ValidatedGemstone[] = [];
    const errors: string[] = [];

    // Filter out completely empty rows first
    const nonEmptyRows = data.filter((row) => {
      // Check if row has at least one non-empty value
      return Object.values(row).some(value => value && value.trim().length > 0);
    });

    console.log(`validateData: Processing ${nonEmptyRows.length} non-empty rows out of ${data.length} total rows`);

    nonEmptyRows.forEach((row, index) => {
      const normalizedRow = normalizeRow(row);
      const rowNum = index + 2; // +2 because index is 0-based and we skip header
      const errorsForRow: string[] = [];

      // Required fields
      if (!normalizedRow['Stein'] || normalizedRow['Stein'].trim() === '') {
        errorsForRow.push('Stein (Name) ist erforderlich');
      }
      if (!normalizedRow['Farbe'] || normalizedRow['Farbe'].trim() === '') {
        errorsForRow.push('Farbe ist erforderlich');
      }
      if (!normalizedRow['Cut/Rough'] || !['cut', 'rough'].includes(normalizedRow['Cut/Rough'].toLowerCase())) {
        errorsForRow.push('Cut/Rough muss "cut" oder "rough" sein');
      }
      if (!normalizedRow['Karat'] || parseNumber(normalizedRow['Karat']) === null) {
        errorsForRow.push('Karat ist erforderlich und muss eine Zahl sein');
      }
    const priceValue = normalizedRow['Preis (Brutto)'] ?? normalizedRow['Preis'];
    if (!priceValue || parseNumber(priceValue) === null) {
      errorsForRow.push('Preis ist erforderlich und muss eine Zahl sein');
    }
      if (!normalizedRow['Kategorie'] || normalizedRow['Kategorie'].trim() === '') {
        errorsForRow.push('Kategorie ist erforderlich');
      }
      if (!normalizedRow['Währung'] || normalizedRow['Währung'].trim() === '') {
        errorsForRow.push('Währung ist erforderlich');
      }

      if (errorsForRow.length > 0) {
        errors.push(`Zeile ${rowNum}: ${errorsForRow.join(', ')}`);
        return;
      }

      const cutRough = normalizedRow['Cut/Rough'].toLowerCase();
      const type = cutRough === 'cut' ? 'cut' : 'rough';
      const condition = cutRough === 'cut' ? 'CUT' : 'ROUGH';
      const caratWeight = parseNumber(normalizedRow['Karat']);
    const price = parseNumber(priceValue) || 0;

      // Parse dimensions
      const lengthMm = parseNumber(normalizedRow['Länge_mm']);
      const widthMm = parseNumber(normalizedRow['Breite_mm']);
      const heightMm = parseNumber(normalizedRow['Höhe_mm']);

      // Parse images and videos
      const images = parseStringArray(normalizedRow['Bilder']);
      const videos = parseStringArray(normalizedRow['Videos']);

      // Parse boolean fields
      const isNew = parseBoolean(normalizedRow['Neu']);
      const featured = parseBoolean(normalizedRow['Featured']);
      const verkauft = parseBoolean(normalizedRow['Verkauft']);
      const inStock = !verkauft;

      // Parse quantity
      const quantity = parseNumber(normalizedRow['Anzahl']) || 1;

      // Parse color brightness (1-10 scale)
      const colorBrightness = normalizedRow['Helligkeit'] ? parseNumber(normalizedRow['Helligkeit']) : null;
      const normalizedBrightness = colorBrightness !== null 
        ? Math.max(0, Math.min(10, Math.round(colorBrightness))) 
        : null;

      valid.push({
        name: normalizedRow['Stein'].trim(),
        category: normalizedRow['Kategorie'].trim(),
        type,
        condition,
        origin: normalizedRow['Herkunft']?.trim() || undefined,
        color: normalizedRow['Farbe']?.trim() || undefined,
        cut: normalizedRow['Schliffart']?.trim() || undefined,
        cutForm: normalizedRow['Schliffform']?.trim() || undefined,
        caratWeight: caratWeight || undefined,
        gramWeight: type === 'rough' ? caratWeight : undefined,
        price,
        currency: normalizedRow['Währung'].trim(),
        lengthMm: lengthMm || undefined,
        widthMm: widthMm || undefined,
        heightMm: heightMm || undefined,
        clarity: normalizedRow['Reinheitsgrad']?.trim() || undefined,
        colorIntensity: normalizedRow['Farbsättigung']?.trim() || undefined,
        colorBrightness: normalizedBrightness || undefined,
        treatment: normalizedRow['Behandlungsart']?.trim() || undefined,
        certification: normalizedRow['Zertifizierungs_Labor']?.trim() || undefined,
        certificateId: normalizedRow['Zertifikatsnummer']?.trim() || undefined,
        certificateUrl: normalizedRow['Zertifikats_URL']?.trim() || undefined,
        rarity: normalizedRow['Rarität']?.trim() || undefined,
        description: normalizedRow['Kurzbeschreibung']?.trim() || undefined,
        shortDescription: normalizedRow['Kurzbeschreibung']?.trim() || undefined,
        longDescription: normalizedRow['Langbeschreibung']?.trim() || undefined,
        images,
        videos,
        isNew,
        featured,
        inStock,
        sku: normalizedRow['SKU']?.trim() || undefined,
        quantity: Math.max(1, quantity),
      });
    });

    return { valid, errors };
  };

  const handleImport = async () => {
    if (!csvData.trim()) {
      alert('Bitte laden Sie eine CSV-Datei hoch oder geben Sie CSV-Daten ein.');
      return;
    }

    setIsImporting(true);
    setProgress(0);
    setImportResult(null);

    try {
      const { headers, rows, lineCount } = parseCsvContent(csvData);
      console.log(`CSV Import: Total rows after parsing: ${lineCount}`);

      if (headers.length === 0 || rows.length === 0) {
        setImportResult({
          success: false,
          message: 'CSV-Datei muss mindestens eine Header-Zeile und eine Daten-Zeile enthalten.',
          imported: 0,
          errors: ['Zu wenige Zeilen in CSV-Datei'],
          warnings: []
        });
        setIsImporting(false);
        return;
      }
      console.log(`CSV Import: Found ${rows.length} data rows (excluding header)`);

      const data = rows.map<RawCsvRow>((values) => {
        const row: RawCsvRow = {};
        headers.forEach((header, index) => {
          row[header] = (values[index] || '').trim().replace(/^"|"$/g, '');
        });
        return row;
      });

      console.log(`CSV Import: Parsed ${data.length} rows`);
      
      const { valid, errors } = validateData(data);
      
      console.log(`CSV Import: Validated ${valid.length} valid gemstones, ${errors.length} errors`);
      
      if (errors.length > 0) {
        setImportResult({
          success: false,
          message: `${errors.length} Validierungsfehler gefunden`,
          imported: 0,
          errors,
          warnings: []
        });
        setIsImporting(false);
        return;
      }

      // Import in batches
      const batchSize = 5;
      const batches: ValidatedGemstone[][] = [];
      for (let i = 0; i < valid.length; i += batchSize) {
        batches.push(valid.slice(i, i + batchSize));
      }

      let totalImported = 0;
      const importErrors: string[] = [];

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        setProgress(Math.round(((i + 1) / batches.length) * 100));

        for (const gemstone of batch) {
          try {
            // Convert to API payload format
            const payload: Record<string, unknown> = {
              name: gemstone.name,
              category: gemstone.category,
              type: gemstone.type,
              condition: gemstone.condition,
              origin: gemstone.origin,
              color: gemstone.color,
              cut: gemstone.cut,
              cutForm: gemstone.cutForm,
              caratWeight: gemstone.caratWeight,
              gramWeight: gemstone.gramWeight,
              price: gemstone.price,
              currency: gemstone.currency,
              lengthMm: gemstone.lengthMm,
              widthMm: gemstone.widthMm,
              heightMm: gemstone.heightMm,
              clarity: gemstone.clarity,
              colorIntensity: gemstone.colorIntensity,
              colorBrightness: gemstone.colorBrightness,
              treatment: gemstone.treatment,
              certification: gemstone.certification,
              certificateId: gemstone.certificateId,
              certificateUrl: gemstone.certificateUrl,
              rarity: gemstone.rarity,
              description: gemstone.description,
              shortDescription: gemstone.shortDescription,
              longDescription: gemstone.longDescription,
              images: gemstone.images,
              videos: gemstone.videos,
              isNew: gemstone.isNew,
              featured: gemstone.featured,
              inStock: gemstone.inStock,
              sku: gemstone.sku,
              quantity: gemstone.quantity,
            };

            const response = await fetch('/api/admin/gemstones', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
              throw new Error(result.error || 'Import fehlgeschlagen');
            }

            totalImported++;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unbekannter Fehler';
            importErrors.push(`${gemstone.name}: ${errorMsg}`);
          }
        }
      }

      setImportResult({
        success: importErrors.length === 0,
        message: `${totalImported} von ${valid.length} Edelsteinen erfolgreich importiert`,
        imported: totalImported,
        errors: importErrors,
        warnings: []
      });

      if (totalImported > 0) {
        onImportComplete();
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Fehler beim Importieren',
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Unbekannter Fehler'],
        warnings: []
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    window.open('/templates/edelsteine-upload-vorlage.csv', '_blank');
  };

  const resetImport = () => {
    setCsvData('');
    setPreviewData([]);
    setImportResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <AdminButton variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          CSV Import
        </AdminButton>
      </DialogTrigger>
      <DialogContent 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] w-[95vw] max-w-5xl max-h-[80vh] bg-[#1a1a1a] text-white border-gray-700 flex flex-col p-0 overflow-hidden overflow-y-auto rounded-xl shadow-2xl"
      >
        <div className="flex flex-col h-full overflow-hidden">
          <DialogHeader 
            className="flex-shrink-0 select-none p-6 pb-4 border-b border-gray-600"
          >
            <DialogTitle className="text-white text-2xl font-bold">CSV-Import für Edelsteine</DialogTitle>
            <p className="text-xs text-gray-400 mt-1">Dialog bleibt zentriert – scrolle im Inhalt, um alles zu erreichen.</p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
          {/* Template Download */}
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">CSV-Vorlage herunterladen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                Laden Sie die CSV-Vorlage herunter, um das richtige Format zu sehen.
              </p>
              <AdminButton onClick={downloadTemplate} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                CSV-Vorlage herunterladen
              </AdminButton>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="bg-[#2a2a2a] border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-white">CSV-Datei hochladen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file" className="text-white">CSV-Datei auswählen</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="mt-1 bg-[#1a1a1a] text-white border-gray-600"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Hinweis: Preis = Bruttopreis inkl. MwSt. (Spalte: &quot;Preis (Brutto)&quot;).
                </p>
                
                <div className="text-center text-gray-400">oder</div>
                
                <div>
                  <Label htmlFor="csv-content" className="text-white">CSV-Daten direkt eingeben</Label>
                  <Textarea
                    id="csv-content"
                    placeholder="Stein,Herkunft,Farbe,Cut/Rough,Karat,Preis (Brutto),Kategorie,Währung..."
                    value={csvData}
                    onChange={handleManualCSV}
                    rows={6}
                    className="mt-1 font-mono text-sm bg-[#1a1a1a] text-white border-gray-600"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Deutsche und englische Spaltennamen werden akzeptiert (z.B. Stein/Name, Kategorie/category, Cut/Rough/type).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {previewData.length > 0 && (
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Datenvorschau (erste 5 Zeilen)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-600">
                        {Object.keys(previewData[0] || {}).slice(0, 10).map((key) => (
                          <th key={key} className="text-left p-2 font-semibold text-white">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-700">
                          {Object.keys(row).slice(0, 10).map((key) => (
                            <td key={key} className="p-2 text-gray-300">
                              {row[key] || '–'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {previewData.length} Zeilen in Vorschau
                </p>
              </CardContent>
            </Card>
          )}

          {/* Progress */}
          {isImporting && (
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white">
                    <span>Import läuft...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {importResult && (
            <Card className="bg-[#2a2a2a] border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Import-Ergebnis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-white">{importResult.message}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                        Importiert: {importResult.imported}
                      </Badge>
                      {importResult.errors.length > 0 && (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                          Fehler: {importResult.errors.length}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {importResult.errors.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2 text-white">Fehler ({importResult.errors.length}):</p>
                      <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                        {importResult.errors.map((error, index) => (
                          <p key={index} className="text-xs text-red-400 break-words">
                            {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {importResult.warnings.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold mb-2 text-white">Warnungen ({importResult.warnings.length}):</p>
                      <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                        {importResult.warnings.map((warning, index) => (
                          <p key={index} className="text-xs text-yellow-400 break-words">
                            {warning}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          </div>

          {/* Actions - Fixed at bottom */}
          <div className="flex-shrink-0 flex gap-2 justify-end p-6 pt-4 border-t border-gray-700 bg-[#1a1a1a]">
            <AdminButton
              variant="outline"
              onClick={resetImport}
              disabled={isImporting}
              className="bg-[#2a2a2a] border-gray-600 text-white hover:bg-[#3a3a3a]"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Zurücksetzen
            </AdminButton>
            <AdminButton
              onClick={handleImport}
              disabled={isImporting || !csvData.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary-strong"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? 'Import läuft...' : 'Import starten'}
            </AdminButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
