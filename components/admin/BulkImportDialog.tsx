'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
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
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Trash2
} from 'lucide-react';

interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  errors: string[];
  warnings: string[];
}

interface BulkImportDialogProps {
  onImportComplete: () => void;
}

export default function BulkImportDialog({ onImportComplete }: BulkImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [csvData, setCsvData] = useState<string>('');
  const [previewData, setPreviewData] = useState<any[]>([]);
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
    reader.readAsText(file);
  };

  const parseCSV = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      alert('CSV-Datei muss mindestens eine Header-Zeile und eine Daten-Zeile enthalten.');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    setPreviewData(data.slice(0, 5)); // Zeige nur die ersten 5 Zeilen
  };

  const handleManualCSV = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setCsvData(content);
    if (content.trim()) {
      parseCSV(content);
    }
  };

  const validateData = (data: any[]): { valid: any[], errors: string[] } => {
    const valid: any[] = [];
    const errors: string[] = [];

    data.forEach((row, index) => {
      const lineNumber = index + 2; // +2 wegen Header und 0-basiertem Index
      
      // Erforderliche Felder prüfen
      if (!row.name || !row.country || !row.lat || !row.lng) {
        errors.push(`Zeile ${lineNumber}: Name, Land, Breitengrad und Längengrad sind erforderlich`);
        return;
      }

      // Koordinaten validieren
      const lat = parseFloat(row.lat);
      const lng = parseFloat(row.lng);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push(`Zeile ${lineNumber}: Ungültiger Breitengrad (${row.lat})`);
        return;
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.push(`Zeile ${lineNumber}: Ungültiger Längengrad (${row.lng})`);
        return;
      }

      valid.push({
        name: row.name,
        country: row.country,
        lat: lat,
        lng: lng,
        gem: row.gem || 'Unknown',
        description: row.description || '',
        mineType: row.mineType || 'primary',
        status: row.status || 'active'
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
      const lines = csvData.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      const { valid, errors } = validateData(data);
      
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

      // Importiere Daten in Batches
      const batchSize = 10;
      const batches = [];
      for (let i = 0; i < valid.length; i += batchSize) {
        batches.push(valid.slice(i, i + batchSize));
      }

      let totalImported = 0;
      const importErrors: string[] = [];

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        setProgress((i / batches.length) * 100);

        try {
          const response = await fetch('/api/admin/worldmap/bulk-import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: batch }),
          });

          const result = await response.json();
          
          if (result.success) {
            totalImported += result.imported;
          } else {
            importErrors.push(...result.errors);
          }
        } catch (error) {
          importErrors.push(`Batch ${i + 1}: ${error}`);
        }
      }

      setProgress(100);
      setImportResult({
        success: importErrors.length === 0,
        message: `${totalImported} von ${valid.length} Einträgen erfolgreich importiert`,
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
        message: 'Import fehlgeschlagen',
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Unbekannter Fehler'],
        warnings: []
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    // Lade das Template von der Server-Route
    window.open('/templates/worldmap-import-template.csv', '_blank');
  };

  const downloadMinimalTemplate = () => {
    // Lade das minimale Template von der Server-Route
    window.open('/templates/worldmap-minimal-template.csv', '_blank');
  };

  const downloadGuide = () => {
    // Öffne den Import-Guide
    window.open('/templates/worldmap-import-guide.md', '_blank');
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
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Bulk Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import - Weltkarten-Daten</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CSV-Templates und Dokumentation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Laden Sie die CSV-Templates herunter und konsultieren Sie die Dokumentation für das richtige Format.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button onClick={downloadTemplate} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Vollständiges Template
                </Button>
                <Button onClick={downloadMinimalTemplate} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Minimales Template
                </Button>
                <Button onClick={downloadGuide} variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Import-Guide
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">CSV-Datei hochladen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-file">CSV-Datei auswählen</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    className="mt-1"
                  />
                </div>
                
                <div className="text-center text-muted-foreground">oder</div>
                
                <div>
                  <Label htmlFor="csv-content">CSV-Daten direkt eingeben</Label>
                  <Textarea
                    id="csv-content"
                    placeholder="name,country,lat,lng,gem,description,mineType,status&#10;Cullinan Mine,Südafrika,-25.6703,28.5231,Diamond,Heimat des größten Diamanten der Welt,open-pit,active"
                    value={csvData}
                    onChange={handleManualCSV}
                    rows={6}
                    className="mt-1 font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {previewData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vorschau (erste 5 Zeilen)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {Object.keys(previewData[0]).map((key) => (
                          <th key={key} className="text-left p-2 font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-b">
                          {Object.values(row).map((value, i) => (
                            <td key={i} className="p-2">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress */}
          {isImporting && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import läuft...</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {Math.round(progress)}% abgeschlossen
                </p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {importResult && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  Import-Ergebnis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className={importResult.success ? 'text-green-600' : 'text-red-600'}>
                    {importResult.message}
                  </p>
                  
                  {importResult.imported > 0 && (
                    <Badge variant="secondary">
                      {importResult.imported} Einträge importiert
                    </Badge>
                  )}

                  {importResult.errors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600 mb-2">Fehler:</h4>
                      <ul className="text-sm text-red-600 space-y-1">
                        {importResult.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {importResult.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-yellow-600 mb-2">Warnungen:</h4>
                      <ul className="text-sm text-yellow-600 space-y-1">
                        {importResult.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={resetImport}
              disabled={isImporting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>
            
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isImporting}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleImport}
                disabled={isImporting || !csvData.trim()}
              >
                {isImporting ? 'Importiere...' : 'Import starten'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
