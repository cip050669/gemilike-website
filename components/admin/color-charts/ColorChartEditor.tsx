'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { GradientBar } from '@/components/color-charts/GradientBar';
import { GemColorCard, ColorChart } from '@/components/color-charts/GemColorCard';

interface ColorChartEditorProps {
  chart?: ColorChart;
  locale: string;
  mode: 'create' | 'edit';
}

export function ColorChartEditor({ chart, locale, mode }: ColorChartEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: chart?.name || '',
    origin: chart?.origin || '',
    gia: {
      hue: (chart?.gia as any)?.hue || '',
      tone: (chart?.gia as any)?.tone || '',
      sat: (chart?.gia as any)?.sat || '',
    },
    gradient: chart?.gradient || ['#FFFFFF'],
    pleochro: chart?.pleochro || [],
    light: chart?.light || 'D55, CRI ≥95',
    note: chart?.note || '',
    description: chart?.description || '',
    published: chart?.published || false,
    featured: chart?.featured || false,
    order: chart?.order || 0,
  });

  const [newGradientColor, setNewGradientColor] = useState('#FFFFFF');
  const [newPleochroColor, setNewPleochroColor] = useState('#FFFFFF');

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('gia.')) {
      const giaField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        gia: {
          ...prev.gia,
          [giaField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const addGradientColor = () => {
    if (newGradientColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      setFormData(prev => ({
        ...prev,
        gradient: [...prev.gradient, newGradientColor],
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
    if (newPleochroColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      setFormData(prev => ({
        ...prev,
        pleochro: [...prev.pleochro, newPleochroColor],
      }));
      setNewPleochroColor('#FFFFFF');
    }
  };

  const removePleochroColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pleochro: prev.pleochro.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = mode === 'create'
        ? '/api/color-charts'
        : `/api/color-charts/${chart?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Speichern');
      }

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
                <Label htmlFor="gia-hue" className="text-white">Hue</Label>
                <Input
                  id="gia-hue"
                  value={formData.gia.hue}
                  onChange={(e) => handleInputChange('gia.hue', e.target.value)}
                  className="bg-gray-700 text-white border-gray-600"
                  placeholder="z.B. pkR–R (pinkish Red → Red)"
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
              <GradientBar colors={formData.gradient} height={60} />
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
                    onCheckedChange={(checked) => handleInputChange('published', checked)}
                  />
                  <Label htmlFor="published" className="text-white">Veröffentlicht</Label>
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

