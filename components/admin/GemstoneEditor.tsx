'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export type GemstoneFormValues = {
  id?: string;
  name: string;
  gemstoneType: string;
  type: 'cut' | 'rough';
  origin: string;
  price: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  color: string;
  colorSaturation: string;
  treatment: string;
  certification: string;
  images: string[];
  videos: string[];
  isNew: boolean;
  isSold: boolean;
  description: string;
};

interface GemstoneEditorProps {
  initialValues?: GemstoneFormValues | null;
  onCancel: () => void;
  onSubmit: (values: GemstoneFormValues) => void;
}

const EMPTY_FORM: GemstoneFormValues = {
  name: '',
  gemstoneType: '',
  type: 'cut',
  origin: '',
  price: '',
  weight: '',
  dimensions: {
    length: '',
    width: '',
    height: '',
  },
  color: '',
  colorSaturation: '',
  treatment: '',
  certification: '',
  images: [''],
  videos: [''],
  isNew: false,
  isSold: false,
  description: '',
};

export function GemstoneEditor({ initialValues, onCancel, onSubmit }: GemstoneEditorProps) {
  const [formValues, setFormValues] = useState<GemstoneFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...EMPTY_FORM,
        ...initialValues,
        images: initialValues.images.length ? initialValues.images.slice(0, 10) : [''],
        videos: initialValues.videos.length ? initialValues.videos.slice(0, 2) : [''],
      });
    } else {
      setFormValues(EMPTY_FORM);
    }
  }, [initialValues]);

  const handleChange = <K extends keyof GemstoneFormValues>(field: K, value: GemstoneFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const updateDimension = (field: keyof GemstoneFormValues['dimensions'], value: string) => {
    setFormValues((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [field]: value },
    }));
  };

  const updateArrayValue = (field: 'images' | 'videos', index: number, value: string) => {
    setFormValues((prev) => {
      const next = [...prev[field]];
      next[index] = value;
      return { ...prev, [field]: next };
    });
  };

  const addArrayField = (field: 'images' | 'videos', limit: number) => {
    setFormValues((prev) => {
      if (prev[field].length >= limit) return prev;
      return { ...prev, [field]: [...prev[field], ''] };
    });
  };

  const removeArrayField = (field: 'images' | 'videos', index: number) => {
    setFormValues((prev) => {
      const next = prev[field].filter((_, idx) => idx !== index);
      return { ...prev, [field]: next.length ? next : [''] };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitized: GemstoneFormValues = {
      ...formValues,
      images: formValues.images.filter((url) => url.trim()).slice(0, 10),
      videos: formValues.videos.filter((url) => url.trim()).slice(0, 2),
    };
    onSubmit(sanitized);
  };

  const weightLabel = formValues.type === 'cut' ? 'Gewicht (ct)' : 'Gewicht (g)';

  return (
    <div className="rounded-2xl border border-white/10 bg-black/50 p-8 text-white shadow-xl shadow-black/40">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-semibold">
            {formValues.id ? 'Edelstein bearbeiten' : 'Neuen Edelstein anlegen'}
          </h2>
          <p className="text-sm text-white/60">
            Legen Sie die zentralen Eigenschaften fest. Bilder und Videos werden über öffentliche URLs eingebunden.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button type="submit" form="gemstone-editor-form" className="bg-primary text-primary-foreground hover:bg-primary/90">
            {formValues.id ? 'Änderungen speichern' : 'Edelstein speichern'}
          </Button>
        </div>
      </div>

      <form id="gemstone-editor-form" onSubmit={handleSubmit} className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="gem-name">Name *</Label>
            <Input
              id="gem-name"
              value={formValues.name}
              onChange={(event) => handleChange('name', event.target.value)}
              required
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              placeholder="z. B. Kolumbianischer Smaragd"
            />
          </div>

          <div>
            <Label htmlFor="gemstone-type">Edelsteinart *</Label>
            <Input
              id="gemstone-type"
              value={formValues.gemstoneType}
              onChange={(event) => handleChange('gemstoneType', event.target.value)}
              required
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              placeholder="z. B. Amethyst"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="gem-type">Art *</Label>
              <Select
                value={formValues.type}
                onValueChange={(value: 'cut' | 'rough') => handleChange('type', value)}
              >
                <SelectTrigger id="gem-type" className="border-white/20 bg-black/40 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cut">Geschliffen</SelectItem>
                  <SelectItem value="rough">Rohstein</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gem-origin">Herkunft (Land)</Label>
              <Input
                id="gem-origin"
                value={formValues.origin}
                onChange={(event) => handleChange('origin', event.target.value)}
                className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
                placeholder="z. B. Kolumbien"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="gem-price">Preis (€)</Label>
              <Input
                id="gem-price"
                type="number"
                value={formValues.price}
                onChange={(event) => handleChange('price', event.target.value)}
                className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
                placeholder="z. B. 12500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="gem-weight">{weightLabel}</Label>
              <Input
                id="gem-weight"
                value={formValues.weight}
                onChange={(event) => handleChange('weight', event.target.value)}
                className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
                placeholder="z. B. 2.35"
              />
            </div>
          </div>

          <div>
            <Label>Maße (mm)</Label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              <Input
                placeholder="Länge"
                value={formValues.dimensions.length}
                onChange={(event) => updateDimension('length', event.target.value)}
                className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              />
              <Input
                placeholder="Breite"
                value={formValues.dimensions.width}
                onChange={(event) => updateDimension('width', event.target.value)}
                className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              />
              <Input
                placeholder="Höhe"
                value={formValues.dimensions.height}
                onChange={(event) => updateDimension('height', event.target.value)}
                className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="gem-color">Farbe</Label>
            <Input
              id="gem-color"
              value={formValues.color}
              onChange={(event) => handleChange('color', event.target.value)}
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              placeholder="z. B. Tiefgrün"
            />
          </div>

          <div>
            <Label htmlFor="gem-saturation">Farbsättigung</Label>
            <Input
              id="gem-saturation"
              value={formValues.colorSaturation}
              onChange={(event) => handleChange('colorSaturation', event.target.value)}
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              placeholder="z. B. Vivid"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="gem-treatment">Behandlung</Label>
            <Input
              id="gem-treatment"
              value={formValues.treatment}
              onChange={(event) => handleChange('treatment', event.target.value)}
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              placeholder="z. B. geölt"
            />
          </div>

          <div>
            <Label htmlFor="gem-certification">Zertifizierung</Label>
            <Input
              id="gem-certification"
              value={formValues.certification}
              onChange={(event) => handleChange('certification', event.target.value)}
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              placeholder="z. B. GIA"
            />
          </div>

          <MediaInputList
            label="Bilder (bis zu 10)"
            items={formValues.images}
            onChange={(index, value) => updateArrayValue('images', index, value)}
            onAdd={() => addArrayField('images', 10)}
            onRemove={(index) => removeArrayField('images', index)}
          />

          <MediaInputList
            label="Videos (bis zu 2)"
            items={formValues.videos}
            onChange={(index, value) => updateArrayValue('videos', index, value)}
            onAdd={() => addArrayField('videos', 2)}
            onRemove={(index) => removeArrayField('videos', index)}
          />

          <div className="rounded-xl border border-white/15 bg-black/40 p-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Neu im Sortiment</Label>
                <p className="text-xs text-white/50">Nur Edelsteine mit „Neu“ werden auf der Startseite gezeigt.</p>
              </div>
              <Switch checked={formValues.isNew} onCheckedChange={(value) => handleChange('isNew', value)} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <Label className="text-white">Verkauft</Label>
                <p className="text-xs text-white/50">Markiert den Edelstein als verkauft (erscheint nicht mehr verfügbar).</p>
              </div>
              <Switch checked={formValues.isSold} onCheckedChange={(value) => handleChange('isSold', value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="gem-description">Beschreibung</Label>
            <Textarea
              id="gem-description"
              value={formValues.description}
              onChange={(event) => handleChange('description', event.target.value)}
              rows={6}
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              placeholder="Ausführliche Beschreibung des Edelsteins …"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

interface MediaInputListProps {
  label: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

function MediaInputList({ label, items, onChange, onAdd, onRemove }: MediaInputListProps) {
  const limitReached = items.length >= (label.includes('Video') ? 2 : 10);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(event) => onChange(index, event.target.value)}
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40"
              placeholder="https://…"
            />
            <Button
              type="button"
              variant="outline"
              className={cn(
                'border-white/20 text-white hover:bg-white/10',
                items.length === 1 && item === '' && 'opacity-50'
              )}
              onClick={() => onRemove(index)}
              disabled={items.length === 1 && item === ''}
            >
              Entfernen
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        className="border-white/30 text-white hover:bg-white/10"
        onClick={onAdd}
        disabled={limitReached}
      >
        Weiteres {label.includes('Video') ? 'Video' : 'Bild'} hinzufügen
      </Button>
    </div>
  );
}
