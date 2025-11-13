'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileJson, FileSpreadsheet, FileText, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import Papa from 'papaparse';
import * as ExcelJS from 'exceljs';
import * as yaml from 'yaml';
import { ColorChart } from './GemColorCard';

interface UploadPanelProps {
  onImport: (charts: ColorChart[]) => void;
  className?: string;
}

type FileFormat = 'json' | 'csv' | 'excel' | 'yaml' | 'text';

type SpreadsheetRow = Record<string, string | number | boolean | null | undefined>;

const toTrimmedString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const toOptionalString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return null;
};

const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false;
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const parseColorList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((entry): entry is string => typeof entry === 'string')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
};

const parseDate = (value: unknown): Date => {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
};

const normalizeChart = (chart: unknown, index: number): ColorChart | null => {
  if (!chart || typeof chart !== 'object') {
    return null;
  }

  const record = chart as Record<string, unknown>;
  if (typeof record.name !== 'string') {
    return null;
  }

  const gradient = parseColorList(record.gradient);
  if (gradient.length === 0) {
    return null;
  }

  const pleochro = parseColorList(record.pleochro);
  const giaSource = record.gia && typeof record.gia === 'object'
    ? (record.gia as Record<string, unknown>)
    : undefined;

  const now = new Date();

  return {
    id: typeof record.id === 'string' && record.id.trim()
      ? record.id
      : `imported-${Date.now()}-${index}`,
    name: record.name,
    origin: toOptionalString(record.origin) ?? null,
    locale: typeof record.locale === 'string' ? record.locale : 'de',
    gia: {
      hue: giaSource ? toTrimmedString(giaSource.hue) : '',
      tone: giaSource ? toTrimmedString(giaSource.tone) : '',
      sat: giaSource ? toTrimmedString(giaSource.sat) : '',
    },
    gradient,
    pleochro,
    light: toTrimmedString(record.light) || 'D55, CRI ≥95',
    note: toOptionalString(record.note),
    description: toOptionalString(record.description),
    published: toBoolean(record.published),
    featured: toBoolean(record.featured),
    order: toNumber(record.order),
    createdAt: record.createdAt ? parseDate(record.createdAt) : now,
    updatedAt: record.updatedAt ? parseDate(record.updatedAt) : now,
  };
};

const normalizeCharts = (data: unknown): unknown[] => {
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === 'object') {
    return [data];
  }
  throw new Error('Ungültiges Datenformat');
};

const mapSpreadsheetRowToChart = (row: SpreadsheetRow): Record<string, unknown> => ({
  name: row.name ?? '',
  origin: row.origin ?? null,
  gia: {
    hue: row.gia_hue ?? row.hue ?? '',
    tone: row.gia_tone ?? row.tone ?? '',
    sat: row.gia_sat ?? row.sat ?? '',
  },
  gradient: row.gradient ?? '',
  pleochro: row.pleochro ?? '',
  light: row.light ?? '',
  note: row.note ?? null,
  description: row.description ?? null,
  published: row.published,
  featured: row.featured,
  order: row.order ?? 0,
});

export function UploadPanel({ onImport, className = '' }: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FileFormat>('json');
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCharts = (charts: unknown[]): { valid: ColorChart[]; errors: string[] } => {
    const validCharts: ColorChart[] = [];
    const errors: string[] = [];

    charts.forEach((chart, index) => {
      const normalized = normalizeChart(chart, index);
      if (normalized) {
        validCharts.push(normalized);
        return;
      }
      errors.push(`Chart ${index + 1}: Ungültiges Format`);
    });

    return { valid: validCharts, errors };
  };

  const handleJSON = (text: string) => {
    try {
      const data = JSON.parse(text);
      return processCharts(normalizeCharts(data));
    } catch (err) {
      throw new Error(`JSON Parse Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleCSV = (text: string) => {
    try {
      const result = Papa.parse<SpreadsheetRow>(text, {
        header: true,
        skipEmptyLines: true,
      });

      const charts = result.data.map(mapSpreadsheetRowToChart);
      return processCharts(charts);
    } catch (err) {
      throw new Error(`CSV Parse Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleExcel = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      // Get first worksheet
      const worksheet = workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('Excel-Datei enthält keine Arbeitsblätter');
      }

      // Convert worksheet to JSON
      const jsonData: SpreadsheetRow[] = [];
      const headerRow = worksheet.getRow(1);
      const headers: string[] = [];
      
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value?.toString() || '';
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        
        const rowData: SpreadsheetRow = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const header = headers[colNumber - 1];
          if (header) {
            const value = cell.value;
            // Convert ExcelJS cell value to string/number/boolean
            if (value === null || value === undefined) {
              rowData[header] = null;
            } else if (typeof value === 'object' && 'text' in value) {
              rowData[header] = (value as { text: string }).text;
            } else {
              rowData[header] = value as string | number | boolean;
            }
          }
        });
        jsonData.push(rowData);
      });

      const charts = jsonData.map(mapSpreadsheetRowToChart);

      return processCharts(charts);
    } catch (err) {
      throw new Error(`Excel Parse Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleYAML = (text: string) => {
    try {
      const data = yaml.parse(text);
      return processCharts(normalizeCharts(data));
    } catch (err) {
      throw new Error(`YAML Parse Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(null);

    const extension = file.name.split('.').pop()?.toLowerCase();
    let result: { valid: ColorChart[]; errors: string[] };

    try {
      if (extension === 'json') {
        const text = await file.text();
        result = handleJSON(text);
      } else if (extension === 'csv') {
        const text = await file.text();
        result = handleCSV(text);
      } else if (extension === 'xlsx' || extension === 'xls') {
        result = await handleExcel(file);
      } else if (extension === 'yaml' || extension === 'yml') {
        const text = await file.text();
        result = handleYAML(text);
      } else {
        setError(`Unsupported file format: .${extension}. Supported: .json, .csv, .xlsx, .yaml`);
        return;
      }

      if (result.errors.length > 0 && result.valid.length === 0) {
        setError(`Fehler beim Importieren: ${result.errors.join(', ')}`);
        return;
      }

      if (result.valid.length > 0) {
        onImport(result.valid);
        setSuccess(`${result.valid.length} Farbtafel(n) erfolgreich importiert!`);
        setTimeout(() => setSuccess(null), 5000);
      }

      if (result.errors.length > 0) {
        setError(`Einige Farbtafeln konnten nicht importiert werden: ${result.errors.join(', ')}`);
      }
    } catch (err) {
      setError(`Fehler beim Lesen der Datei: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleTextInput = () => {
    setError(null);
    setSuccess(null);

    if (!textInput.trim()) {
      setError('Bitte geben Sie Daten ein.');
      return;
    }

    try {
      let result;
      switch (activeTab) {
        case 'json':
          result = handleJSON(textInput);
          break;
        case 'csv':
          result = handleCSV(textInput);
          break;
        case 'yaml':
          result = handleYAML(textInput);
          break;
        default:
          setError('Text-Eingabe nur für JSON, CSV und YAML verfügbar.');
          return;
      }

      if (result.errors.length > 0 && result.valid.length === 0) {
        setError(`Fehler beim Importieren: ${result.errors.join(', ')}`);
        return;
      }

      if (result.valid.length > 0) {
        onImport(result.valid);
        setSuccess(`${result.valid.length} Farbtafel(n) erfolgreich importiert!`);
        setTextInput('');
        setTimeout(() => setSuccess(null), 5000);
      }

      if (result.errors.length > 0) {
        setError(`Einige Farbtafeln konnten nicht importiert werden: ${result.errors.join(', ')}`);
      }
    } catch (err) {
      setError(`Fehler beim Parsen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const getAcceptString = () => {
    switch (activeTab) {
      case 'json':
        return '.json';
      case 'csv':
        return '.csv';
      case 'excel':
        return '.xlsx,.xls';
      case 'yaml':
        return '.yaml,.yml';
      default:
        return '.json,.csv,.xlsx,.xls,.yaml,.yml';
    }
  };

  const loadDemo = () => {
    const demoChart: ColorChart = {
      id: 'demo-1',
      name: 'Demo Farbtafel',
      origin: 'Demo Herkunft',
      locale: 'de',
      gia: {
        hue: 'R (Red)',
        tone: '5 (Medium)',
        sat: '6 (Vivid)',
      },
      gradient: ['#FF0000', '#FF6666', '#FF9999', '#FFCCCC'],
      pleochro: ['#FF0000', '#FF6666'],
      light: 'D55, CRI ≥95',
      note: 'Dies ist eine Demo-Farbtafel',
      description: null,
      published: false,
      featured: false,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onImport([demoChart]);
    setSuccess('Demo-Farbtafel geladen!');
    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <Card className={`bg-gray-800/50 border-gray-700 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import von Farbtafeln
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400">
          Importieren Sie Farbtafel-Daten in verschiedenen Formaten: JSON, CSV, Excel (XLSX) oder YAML.
        </p>

        {/* Error/Success messages */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-700 rounded-lg text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Format Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FileFormat)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="json">
              <FileJson className="h-4 w-4 mr-1" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="csv">
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              CSV
            </TabsTrigger>
            <TabsTrigger value="excel">
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Excel
            </TabsTrigger>
            <TabsTrigger value="yaml">
              <FileText className="h-4 w-4 mr-1" />
              YAML
            </TabsTrigger>
          </TabsList>

          {/* File Upload */}
          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${isDragging
                  ? 'border-[#9A1A63] bg-[#9A1A63]/10'
                  : 'border-gray-600 hover:border-gray-500'
                }
              `}
            >
              {activeTab === 'json' && <FileJson className="h-12 w-12 mx-auto mb-4 text-gray-400" />}
              {activeTab === 'csv' && <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />}
              {activeTab === 'excel' && <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />}
              {activeTab === 'yaml' && <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />}
              <p className="text-gray-400 mb-2">
                Ziehen Sie eine {activeTab.toUpperCase()}-Datei hierher oder klicken Sie zum Auswählen
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2"
              >
                Datei auswählen
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptString()}
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {/* Text Input (for JSON, CSV, YAML) */}
            {(activeTab === 'json' || activeTab === 'csv' || activeTab === 'yaml') && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-400">Oder direkt einfügen:</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.readText().then(setTextInput)}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Aus Zwischenablage
                  </Button>
                </div>
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={`Fügen Sie ${activeTab.toUpperCase()}-Daten hier ein...`}
                  className="bg-gray-900/50 text-white border-gray-600 min-h-[150px] font-mono text-xs"
                />
                <Button
                  onClick={handleTextInput}
                  disabled={!textInput.trim()}
                  className="w-full"
                >
                  Aus Text importieren
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Demo button */}
        <div className="pt-4 border-t border-gray-700">
          <Button
            variant="outline"
            onClick={loadDemo}
            className="w-full"
          >
            Demo-Daten laden
          </Button>
        </div>

        {/* Format examples */}
        <details className="mt-4">
          <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
            Format-Beispiele anzeigen
          </summary>
          <div className="mt-2 space-y-4">
            {activeTab === 'json' && (
              <pre className="p-4 bg-gray-900/50 rounded-lg text-xs text-gray-300 overflow-x-auto">
                {JSON.stringify(
                  {
                    name: 'Beispiel Farbtafel',
                    origin: 'Beispiel Herkunft',
                    gia: { hue: 'R', tone: '5', sat: '6' },
                    gradient: ['#FF0000', '#FF6666'],
                    pleochro: ['#FF0000'],
                    light: 'D55, CRI ≥95',
                  },
                  null,
                  2
                )}
              </pre>
            )}
            {activeTab === 'csv' && (
              <div className="p-4 bg-gray-900/50 rounded-lg text-xs text-gray-300">
                <p className="mb-2">CSV Header:</p>
                <code className="block mb-2">name,origin,gia_hue,gia_tone,gia_sat,gradient,pleochro,light</code>
                <p className="mb-2">Beispiel Zeile:</p>
                <code className="block">
                  &quot;Beispiel Farbtafel&quot;,&quot;Beispiel Herkunft&quot;,&quot;R&quot;,&quot;5&quot;,&quot;6&quot;,&quot;#FF0000,#FF6666&quot;,&quot;#FF0000&quot;,&quot;D55, CRI ≥95&quot;
                </code>
              </div>
            )}
            {activeTab === 'yaml' && (
              <pre className="p-4 bg-gray-900/50 rounded-lg text-xs text-gray-300 overflow-x-auto">
                {`name: Beispiel Farbtafel
origin: Beispiel Herkunft
gia:
  hue: R
  tone: 5
  sat: 6
gradient:
  - "#FF0000"
  - "#FF6666"
pleochro:
  - "#FF0000"
light: D55, CRI ≥95`}
              </pre>
            )}
            {activeTab === 'excel' && (
              <div className="p-4 bg-gray-900/50 rounded-lg text-xs text-gray-300">
                <p className="mb-2">Excel Spalten:</p>
                <code className="block">
                  name | origin | gia_hue | gia_tone | gia_sat | gradient | pleochro | light
                </code>
                <p className="mt-2 text-gray-400">
                  Gradient und Pleochro können als komma-separierte Werte eingegeben werden.
                </p>
              </div>
            )}
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
