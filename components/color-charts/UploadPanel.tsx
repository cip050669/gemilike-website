'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileJson, FileSpreadsheet, FileText, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as yaml from 'yaml';
import { ColorChart } from './GemColorCard';

interface UploadPanelProps {
  onImport: (charts: ColorChart[]) => void;
  className?: string;
}

type FileFormat = 'json' | 'csv' | 'excel' | 'yaml' | 'text';

export function UploadPanel({ onImport, className = '' }: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FileFormat>('json');
  const [textInput, setTextInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateColorChart = (data: any): data is ColorChart => {
    return (
      typeof data === 'object' &&
      typeof data.name === 'string' &&
      Array.isArray(data.gradient) &&
      data.gradient.length > 0 &&
      Array.isArray(data.pleochro) &&
      typeof data.gia === 'object'
    );
  };

  const processCharts = (charts: any[]): { valid: ColorChart[]; errors: string[] } => {
    const validCharts: ColorChart[] = [];
    const errors: string[] = [];

    charts.forEach((chart, index) => {
      if (validateColorChart(chart)) {
        const validChart: ColorChart = {
          id: chart.id || `imported-${Date.now()}-${index}`,
          name: chart.name,
          origin: chart.origin || null,
          locale: chart.locale || 'de',
          gia: chart.gia || { hue: '', tone: '', sat: '' },
          gradient: chart.gradient,
          pleochro: chart.pleochro || [],
          light: chart.light || 'D55, CRI ≥95',
          note: chart.note || null,
          description: chart.description || null,
          published: chart.published || false,
          featured: chart.featured || false,
          order: chart.order || 0,
          createdAt: chart.createdAt ? new Date(chart.createdAt) : new Date(),
          updatedAt: chart.updatedAt ? new Date(chart.updatedAt) : new Date(),
        };
        validCharts.push(validChart);
      } else {
        errors.push(`Chart ${index + 1}: Ungültiges Format`);
      }
    });

    return { valid: validCharts, errors };
  };

  const handleJSON = (text: string) => {
    try {
      const data = JSON.parse(text);
      const charts = Array.isArray(data) ? data : [data];
      return processCharts(charts);
    } catch (err) {
      throw new Error(`JSON Parse Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleCSV = (text: string) => {
    try {
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });

      const charts = result.data.map((row: any) => {
        // Parse gradient and pleochro from comma-separated strings
        const gradient = row.gradient
          ? row.gradient.split(',').map((c: string) => c.trim()).filter(Boolean)
          : [];
        const pleochro = row.pleochro
          ? row.pleochro.split(',').map((c: string) => c.trim()).filter(Boolean)
          : [];

        return {
          name: row.name || '',
          origin: row.origin || null,
          gia: {
            hue: row.gia_hue || row.hue || '',
            tone: row.gia_tone || row.tone || '',
            sat: row.gia_sat || row.sat || '',
          },
          gradient,
          pleochro,
          light: row.light || 'D55, CRI ≥95',
          note: row.note || null,
          description: row.description || null,
          published: row.published === 'true' || row.published === true,
          featured: row.featured === 'true' || row.featured === true,
          order: parseInt(row.order) || 0,
        };
      });

      return processCharts(charts);
    } catch (err) {
      throw new Error(`CSV Parse Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleExcel = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const charts = jsonData.map((row: any) => {
        const gradient = row.gradient
          ? (typeof row.gradient === 'string' 
              ? row.gradient.split(',').map((c: string) => c.trim()).filter(Boolean)
              : Array.isArray(row.gradient) ? row.gradient : [])
          : [];
        const pleochro = row.pleochro
          ? (typeof row.pleochro === 'string'
              ? row.pleochro.split(',').map((c: string) => c.trim()).filter(Boolean)
              : Array.isArray(row.pleochro) ? row.pleochro : [])
          : [];

        return {
          name: row.name || '',
          origin: row.origin || null,
          gia: {
            hue: row.gia_hue || row.hue || '',
            tone: row.gia_tone || row.tone || '',
            sat: row.gia_sat || row.sat || '',
          },
          gradient,
          pleochro,
          light: row.light || 'D55, CRI ≥95',
          note: row.note || null,
          description: row.description || null,
          published: row.published === true || row.published === 'true',
          featured: row.featured === true || row.featured === 'true',
          order: parseInt(row.order) || 0,
        };
      });

      return processCharts(charts);
    } catch (err) {
      throw new Error(`Excel Parse Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleYAML = (text: string) => {
    try {
      const data = yaml.parse(text);
      const charts = Array.isArray(data) ? data : [data];
      return processCharts(charts);
    } catch (err) {
      throw new Error(`YAML Parse Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(null);

    const extension = file.name.split('.').pop()?.toLowerCase();
    let result;

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
                  "Beispiel Farbtafel","Beispiel Herkunft","R","5","6","#FF0000,#FF6666","#FF0000","D55, CRI ≥95"
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
