'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { GradientBar } from '@/components/color-charts/GradientBar';
import { GemColorCard, ColorChart } from '@/components/color-charts/GemColorCard';
import { generateGradientFromGIA } from '@/components/color-charts/utils/giaToGradient';

interface ColorChartEditorProps {
  chart?: ColorChart;
  locale: string;
  mode: 'create' | 'edit';
}

interface ColorChartFormData {
  name: string;
  origin: string;
  gia: {
    hue: string;
    tone: string;
    sat: string;
  };
  gradient: string[];
  pleochro: string[];
  light: string;
  note: string;
  description: string;
  published: boolean;
  featured: boolean;
  order: number;
}

export function ColorChartEditor({ chart, locale, mode }: ColorChartEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // CRITICAL: Ensure published and featured are explicitly booleans
  // Handle potential type mismatches from database (boolean, string, or number)
  const initialPublished = chart?.published === true || 
    (typeof chart?.published === 'string' && chart.published === 'true') ||
    (typeof chart?.published === 'number' && chart.published === 1);
  const initialFeatured = chart?.featured === true ||
    (typeof chart?.featured === 'string' && chart.featured === 'true') ||
    (typeof chart?.featured === 'number' && chart.featured === 1);
  
  // Ensure pleochro is always an array
  const initialPleochro = Array.isArray(chart?.pleochro) 
    ? chart.pleochro 
    : (chart?.pleochro ? [chart.pleochro] : []);
  
  const [formData, setFormData] = useState<ColorChartFormData>({
    name: chart?.name || '',
    origin: chart?.origin ?? '',
    gia: {
      hue: chart?.gia?.hue ?? '',
      tone: chart?.gia?.tone ?? '',
      sat: chart?.gia?.sat ?? '',
    },
    gradient: Array.isArray(chart?.gradient) && chart.gradient.length > 0 
      ? chart.gradient 
      : (chart?.gradient && !Array.isArray(chart.gradient) ? [chart.gradient] : []),
    pleochro: initialPleochro,
    light: chart?.light || 'D55, CRI ≥95',
    note: chart?.note ?? '',
    description: chart?.description ?? '',
    published: initialPublished,
    featured: initialFeatured,
    order: chart?.order || 0,
  });
  
  // Debug: Log pleochro initialization
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ColorChartEditor] Pleochro initialization:', {
        chartPleochro: chart?.pleochro,
        chartPleochroType: typeof chart?.pleochro,
        isArray: Array.isArray(chart?.pleochro),
        initialPleochro,
        formDataPleochro: formData.pleochro,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug: Log initial state
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ColorChartEditor] Initialized:', {
        mode,
        chartId: chart?.id,
        chartPublished: chart?.published,
        chartPublishedType: typeof chart?.published,
        formDataPublished: formData.published,
        formDataPublishedType: typeof formData.published,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [newGradientColor, setNewGradientColor] = useState('#FFFFFF');
  const [newPleochroColor, setNewPleochroColor] = useState('#FFFFFF');

  type GiaField = keyof ColorChartFormData['gia'];
  type FormField = Exclude<keyof ColorChartFormData, 'gia'>;

  const handleInputChange = (
    field: FormField | `gia.${GiaField}`,
    value: string | number | boolean
  ) => {
    if (field.startsWith('gia.')) {
      const [, key] = field.split('.');
      const stringValue = value as string;
      
      // Auto-parse GIA format: "pkR,5,4" -> hue="pkR", tone="5", sat="4"
      if (key === 'hue' && stringValue.includes(',')) {
        const parts = stringValue.split(',').map(p => p.trim());
        if (parts.length === 3) {
          setFormData(prev => ({
            ...prev,
            gia: {
              hue: parts[0],
              tone: parts[1],
              sat: parts[2],
            },
          }));
          return;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        gia: {
          ...prev.gia,
          [key as GiaField]: stringValue,
        },
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addGradientColor = () => {
    // Normalize the color value
    let colorValue = newGradientColor.trim();
    
    // Add # if missing
    if (!colorValue.startsWith('#')) {
      colorValue = '#' + colorValue;
    }
    
    // Convert 3-digit hex to 6-digit
    if (colorValue.match(/^#[A-Fa-f0-9]{3}$/)) {
      const hex = colorValue.slice(1);
      colorValue = `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    
    // Validate and add
    if (colorValue.match(/^#[A-Fa-f0-9]{6}$/)) {
      setFormData(prev => ({
        ...prev,
        gradient: [...prev.gradient, colorValue],
      }));
      setNewGradientColor('#FFFFFF');
    }
  };

  const removeGradientColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gradient: prev.gradient.filter((_, i) => i !== index),
    }));
  };

  const addPleochroColor = () => {
    // Normalize the color value
    let colorValue = newPleochroColor.trim();
    
    // Add # if missing
    if (!colorValue.startsWith('#')) {
      colorValue = '#' + colorValue;
    }
    
    // Convert 3-digit hex to 6-digit
    if (colorValue.match(/^#[A-Fa-f0-9]{3}$/)) {
      const hex = colorValue.slice(1);
      colorValue = `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }
    
    // Validate and add
    if (colorValue.match(/^#[A-Fa-f0-9]{6}$/)) {
      setFormData(prev => {
        // Ensure pleochro is always an array
        const currentPleochro = Array.isArray(prev.pleochro) ? prev.pleochro : [];
        return {
          ...prev,
          pleochro: [...currentPleochro, colorValue],
        };
      });
      setNewPleochroColor('#FFFFFF');
    }
  };

  const removePleochroColor = (index: number) => {
    setFormData(prev => {
      // Ensure pleochro is always an array
      const currentPleochro = Array.isArray(prev.pleochro) ? prev.pleochro : [];
      return {
        ...prev,
        pleochro: currentPleochro.filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = mode === 'create'
        ? '/api/color-charts'
        : `/api/color-charts/${chart?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      // Ensure published and featured are explicitly booleans
      // Ensure pleochro and gradient are arrays
      const payload = {
        ...formData,
        locale,
        published: Boolean(formData.published),
        featured: Boolean(formData.featured),
        gradient: Array.isArray(formData.gradient) ? formData.gradient : (formData.gradient ? [formData.gradient] : []),
        pleochro: Array.isArray(formData.pleochro) ? formData.pleochro : (formData.pleochro ? [formData.pleochro] : []),
      };

      console.log('[ColorChartEditor] Submitting chart:', {
        mode,
        published: payload.published,
        publishedType: typeof payload.published,
        featured: payload.featured,
        featuredType: typeof payload.featured,
        name: payload.name,
        pleochro: payload.pleochro,
        pleochroLength: payload.pleochro.length,
        pleochroIsArray: Array.isArray(payload.pleochro),
        formDataPleochro: formData.pleochro,
        formDataPleochroType: typeof formData.pleochro,
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Speichern');
      }

      const result = await response.json();
      console.log('[ColorChartEditor] Save successful:', {
        success: result.success,
        chartPublished: result.chart?.published,
        chartPublishedType: typeof result.chart?.published,
      });

      // Navigate back to list
      router.push(`/${locale}/admin/color-charts`);
      router.refresh();
    } catch (error) {
      console.error('Error saving color chart:', error);
      alert(`Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Preview chart data
  const previewChart: ColorChart = {
    id: chart?.id || 'preview',
    name: formData.name || 'Vorschau',
    origin: formData.origin || null,
    locale,
    gia: formData.gia,
    gradient: formData.gradient,
    pleochro: formData.pleochro,
    light: formData.light,
    note: formData.note || null,
    description: formData.description || null,
    published: formData.published,
    featured: formData.featured,
    order: formData.order,
    createdAt: chart?.createdAt || new Date(),
    updatedAt: chart?.updatedAt || new Date(),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Basis-Informationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                  required
                />
              </div>
              <div>
                <Label htmlFor="origin" className="text-white">Herkunft</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* GIA Data */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">GIA-Daten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gia-hue" className="text-white">Hue (oder komplett: pkR,5,4)</Label>
                <Input
                  id="gia-hue"
                  value={formData.gia.hue}
                  onChange={(e) => handleInputChange('gia.hue', e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                  placeholder="z.B. pkR oder pkR,5,4 (wird automatisch aufgeteilt)"
                />
              </div>
              <div>
                <Label htmlFor="gia-tone" className="text-white">Tone</Label>
                <Input
                  id="gia-tone"
                  value={formData.gia.tone}
                  onChange={(e) => handleInputChange('gia.tone', e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                  placeholder="z.B. 3–5 (Medium-Light → Medium)"
                />
              </div>
              <div>
                <Label htmlFor="gia-sat" className="text-white">Saturation</Label>
                <Input
                  id="gia-sat"
                  value={formData.gia.sat}
                  onChange={(e) => handleInputChange('gia.sat', e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                  placeholder="z.B. 4–6 (Strong → Vivid)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Gradient Colors */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Farbverlauf (Gradient)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                // Check if we have a manual gradient
                const hasManualGradient = Array.isArray(formData.gradient) && formData.gradient.length > 0 && formData.gradient.some(c => c && c.trim().toUpperCase() !== '#FFFFFF' && c.trim().toUpperCase() !== 'FFFFFF');
                
                // If no manual gradient, try to generate from GIA data
                if (!hasManualGradient && formData.gia.hue) {
                  const giaGradient = generateGradientFromGIA(formData.gia);
                  if (giaGradient.length > 0) {
                    return <GradientBar colors={giaGradient} height={60} />;
                  }
                }
                
                // Show manual gradient if available
                if (hasManualGradient) {
                  return <GradientBar colors={formData.gradient.filter(c => c && c.trim().toUpperCase() !== '#FFFFFF' && c.trim().toUpperCase() !== 'FFFFFF')} height={60} />;
                }
                
                // No gradient available
                return (
                  <div className="h-[60px] rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-muted-foreground">
                    Kein Farbverlauf - Bitte Farben hinzufügen oder GIA-Daten eingeben
                  </div>
                );
              })()}
              <div className="flex gap-2 flex-wrap">
                {formData.gradient.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-12 h-12 rounded border border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeGradientColor(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={newGradientColor}
                  onChange={(e) => setNewGradientColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={newGradientColor}
                  onChange={(e) => setNewGradientColor(e.target.value)}
                  className="flex-1 bg-gray-700 text-white border-gray-600"
                  placeholder="#FFFFFF"
                />
                <Button type="button" onClick={addGradientColor}>
                  Hinzufügen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pleochroism Colors */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Pleochroismus-Farben</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {formData.pleochro.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-12 h-12 rounded border border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePleochroColor(index)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={newPleochroColor}
                  onChange={(e) => setNewPleochroColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={newPleochroColor}
                  onChange={(e) => setNewPleochroColor(e.target.value)}
                  className="flex-1 bg-gray-700 text-white border-gray-600"
                  placeholder="#FFFFFF"
                />
                <Button type="button" onClick={addPleochroColor}>
                  Hinzufügen
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Weitere Einstellungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="light" className="text-white">Lichtstandard</Label>
                <Input
                  id="light"
                  value={formData.light}
                  onChange={(e) => handleInputChange('light', e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="note" className="text-white">Notiz</Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                  rows={4}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => {
                      console.log('[ColorChartEditor] Published changed to:', checked);
                      handleInputChange('published', checked);
                    }}
                  />
                  <Label htmlFor="published" className="text-white">
                    Veröffentlicht {formData.published ? '(wird auf öffentlicher Seite angezeigt)' : '(nur im Admin sichtbar)'}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured" className="text-white">Featured</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="order" className="text-white">Sortierung</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#9A1A63] hover:bg-[#7a1450]"
            >
              {isLoading ? 'Speichere...' : mode === 'create' ? 'Erstellen' : 'Speichern'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${locale}/admin/color-charts`)}
            >
              Abbrechen
            </Button>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div>
          <Card className="bg-gray-800/50 border-gray-700 sticky top-4">
            <CardHeader>
              <CardTitle className="text-white">Vorschau</CardTitle>
            </CardHeader>
            <CardContent>
              <GemColorCard chart={previewChart} />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
