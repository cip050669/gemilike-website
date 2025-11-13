'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileJson, FileSpreadsheet, FileText, AlertCircle, CheckCircle, Loader2, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import * as ExcelJS from 'exceljs';
import * as yaml from 'yaml';
import type { ColorChartImportPayload, ColorChartImportResponse } from '@/types/color-charts';

interface BulkImportDialogProps {
  locale: string;
}

type FileFormat = 'json' | 'csv' | 'excel' | 'yaml';

type SpreadsheetRow = Record<string, string | number | boolean | null | undefined>;

const toStringOrEmpty = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const toOptionalString = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return null;
};

const toBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return fallback;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
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

const normalizeCharts = (data: unknown): ColorChartImportPayload[] => {
  if (Array.isArray(data)) {
    return data as ColorChartImportPayload[];
  }
  if (typeof data === 'object' && data !== null) {
    return [data as ColorChartImportPayload];
  }
  throw new Error('Ungültiges Datenformat für Farbtafeln');
};

const mapSpreadsheetRowToChart = (row: SpreadsheetRow): ColorChartImportPayload => ({
  name: toStringOrEmpty(row.name),
  origin: toOptionalString(row.origin),
  gia: {
    hue: toStringOrEmpty(row.gia_hue ?? row.hue),
    tone: toStringOrEmpty(row.gia_tone ?? row.tone),
    sat: toStringOrEmpty(row.gia_sat ?? row.sat),
  },
  gradient: parseColorList(row.gradient),
  pleochro: parseColorList(row.pleochro),
  light: toStringOrEmpty(row.light) || 'D55, CRI ≥95',
  note: toOptionalString(row.note),
  description: toOptionalString(row.description),
  published: toBoolean(row.published),
  featured: toBoolean(row.featured),
  order: toNumber(row.order),
});

export function BulkImportDialog({ locale }: BulkImportDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FileFormat>('json');
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseFile = async (file: File): Promise<ColorChartImportPayload[]> => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'json') {
      const text = await file.text();
      const data = JSON.parse(text);
      return normalizeCharts(data);
    } else if (extension === 'csv') {
      const text = await file.text();
      const result = Papa.parse<SpreadsheetRow>(text, { header: true, skipEmptyLines: true });
      return result.data.map(mapSpreadsheetRowToChart);
    } else if (extension === 'xlsx' || extension === 'xls') {
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

      return jsonData.map(mapSpreadsheetRowToChart);
    } else if (extension === 'yaml' || extension === 'yml') {
      const text = await file.text();
      const data = yaml.parse(text);
      return normalizeCharts(data);
    } else {
      throw new Error(`Unsupported file format: .${extension}`);
    }
  };

  const parseText = (text: string): ColorChartImportPayload[] => {
    switch (activeTab) {
      case 'json':
        const data = JSON.parse(text);
        return normalizeCharts(data);
      case 'csv':
        const result = Papa.parse<SpreadsheetRow>(text, { header: true, skipEmptyLines: true });
        return result.data.map(mapSpreadsheetRowToChart);
      case 'yaml':
        const yamlData = yaml.parse(text);
        return normalizeCharts(yamlData);
      default:
        throw new Error('Text input only available for JSON, CSV, and YAML');
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(null);
    setIsUploading(true);

    try {
      const charts = await parseFile(file);

      await importCharts(charts);
    } catch (err) {
      setError(`Fehler beim Importieren: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
      setIsUploading(false);
    }
  };

  const handleTextInput = async () => {
    setError(null);
    setSuccess(null);
    setIsUploading(true);

    if (!textInput.trim()) {
      setError('Bitte geben Sie Daten ein.');
      setIsUploading(false);
      return;
    }

    try {
      const charts = parseText(textInput);
      await importCharts(charts);
      setTextInput('');
    } catch (err) {
      setError(`Fehler beim Parsen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
      setIsUploading(false);
    }
  };

  const importCharts = async (charts: ColorChartImportPayload[]) => {
    const response = await fetch('/api/color-charts/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        charts,
        locale,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Import fehlgeschlagen');
    }

    const result = (await response.json()) as ColorChartImportResponse;
    
    if (result.results.errors.length > 0 && result.results.success.length === 0) {
      setError(`Import fehlgeschlagen: ${result.results.errors.join(', ')}`);
    } else if (result.results.errors.length > 0) {
      setSuccess(`${result.imported} von ${result.total} Farbtafeln erfolgreich importiert.`);
      setError(`Einige Fehler: ${result.results.errors.slice(0, 3).join(', ')}${result.results.errors.length > 3 ? '...' : ''}`);
    } else {
      setSuccess(`${result.imported} Farbtafel(n) erfolgreich importiert!`);
    }

    // Refresh the page after successful import
    if (result.imported > 0) {
      setTimeout(() => {
        router.refresh();
        setOpen(false);
      }, 2000);
    }
    
    setIsUploading(false);
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


  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Import von Farbtafeln</DialogTitle>
          <DialogDescription>
            Importieren Sie mehrere Farbtafeln gleichzeitig aus verschiedenen Formaten: JSON, CSV, Excel oder YAML.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {/* Drop zone */}
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) handleFile(file);
                }}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#9A1A63] transition-colors"
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
                  disabled={isUploading}
                  className="mt-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importiere...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Datei auswählen
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getAcceptString()}
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isUploading}
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
                    disabled={!textInput.trim() || isUploading}
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Importiere...
                      </>
                    ) : (
                      'Aus Text importieren'
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Format examples */}
          <details className="mt-4">
            <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
              Format-Beispiele anzeigen
            </summary>
            <div className="mt-2 space-y-4">
              {activeTab === 'json' && (
                <pre className="p-4 bg-gray-900/50 rounded-lg text-xs text-gray-300 overflow-x-auto">
                  {JSON.stringify(
                    [
                      {
                        name: 'Beispiel Farbtafel 1',
                        origin: 'Beispiel Herkunft',
                        gia: { hue: 'R', tone: '5', sat: '6' },
                        gradient: ['#FF0000', '#FF6666'],
                        pleochro: ['#FF0000'],
                        light: 'D55, CRI ≥95',
                      },
                      {
                        name: 'Beispiel Farbtafel 2',
                        origin: 'Beispiel Herkunft 2',
                        gia: { hue: 'B', tone: '4', sat: '5' },
                        gradient: ['#0000FF', '#6666FF'],
                        pleochro: ['#0000FF'],
                        light: 'D55, CRI ≥95',
                      },
                    ],
                    null,
                    2
                  )}
                </pre>
              )}
              {activeTab === 'csv' && (
                <div className="p-4 bg-gray-900/50 rounded-lg text-xs text-gray-300">
                  <p className="mb-2">CSV Header:</p>
                  <code className="block mb-2">name,origin,gia_hue,gia_tone,gia_sat,gradient,pleochro,light</code>
                  <p className="mb-2">Beispiel Zeilen:</p>
                  <code className="block mb-1">
                    &quot;Beispiel Farbtafel 1&quot;,&quot;Beispiel Herkunft&quot;,&quot;R&quot;,&quot;5&quot;,&quot;6&quot;,&quot;#FF0000,#FF6666&quot;,&quot;#FF0000&quot;,&quot;D55, CRI ≥95&quot;
                  </code>
                  <code className="block">
                    &quot;Beispiel Farbtafel 2&quot;,&quot;Beispiel Herkunft 2&quot;,&quot;B&quot;,&quot;4&quot;,&quot;5&quot;,&quot;#0000FF,#6666FF&quot;,&quot;#0000FF&quot;,&quot;D55, CRI ≥95&quot;
                  </code>
                </div>
              )}
              {activeTab === 'yaml' && (
                <pre className="p-4 bg-gray-900/50 rounded-lg text-xs text-gray-300 overflow-x-auto">
                  {`- name: Beispiel Farbtafel 1
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
  light: D55, CRI ≥95
- name: Beispiel Farbtafel 2
  origin: Beispiel Herkunft 2
  gia:
    hue: B
    tone: 4
    sat: 5
  gradient:
    - "#0000FF"
    - "#6666FF"
  pleochro:
    - "#0000FF"
  light: D55, CRI ≥95`}
                </pre>
              )}
              {activeTab === 'excel' && (
                <div className="p-4 bg-gray-900/50 rounded-lg text-xs text-gray-300">
                  <p className="mb-2">Excel Spalten:</p>
                  <code className="block mb-2">
                    name | origin | gia_hue | gia_tone | gia_sat | gradient | pleochro | light
                  </code>
                  <p className="mt-2 text-gray-400">
                    Gradient und Pleochro können als komma-separierte Werte eingegeben werden.
                  </p>
                </div>
              )}
            </div>
          </details>
        </div>
      </DialogContent>
    </Dialog>
  );
}
