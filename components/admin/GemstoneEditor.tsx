'use client';

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Search, Upload as UploadIcon } from 'lucide-react';

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

type OptionItem = {
  value: string;
  label?: string;
  group?: string;
};

const GEMSTONE_TYPE_OPTIONS: OptionItem[] = [
  'Diamant',
  'Smaragd',
  'Rubin',
  'Saphir',
  'Aquamarin',
  'Tansanit',
  'Turmalin',
  'Opal',
  'Amethyst',
  'Topas',
  'Morganit',
  'Spinell',
  'Zirkon',
  'Peridot',
  'Alexandrit',
  'Granat',
  'Kunzit',
  'Mondstein',
].map((value) => ({ value }));

const ORIGIN_OPTIONS: OptionItem[] = [
  'Kolumbien',
  'Myanmar',
  'Sri Lanka',
  'Thailand',
  'Indien',
  'Tansania',
  'Sambia',
  'Brasilien',
  'Südafrika',
  'Madagaskar',
  'Australien',
  'Pakistan',
  'Afghanistan',
  'USA',
  'Kanada',
  'China',
  'Russland',
  'Äthiopien',
  'Kenia',
  'Mosambik',
].map((value) => ({ value }));

const COLOR_OPTIONS: OptionItem[] = [
  'Farblos',
  'Weiß',
  'Gelb',
  'Champagner',
  'Orange',
  'Rot',
  'Pink',
  'Violett',
  'Blau',
  'Türkis',
  'Grün',
  'Olivgrün',
  'Teal',
  'Braun',
  'Grau',
  'Schwarz',
].map((value) => ({ value }));

const SATURATION_OPTIONS: OptionItem[] = [
  { value: 'Pale', label: 'Pale (sehr hell)' },
  { value: 'Light', label: 'Light (hell)' },
  { value: 'Medium', label: 'Medium (mittel)' },
  { value: 'Intense', label: 'Intense (intensiv)' },
  { value: 'Vivid', label: 'Vivid (sehr intensiv)' },
  { value: 'Deep', label: 'Deep (dunkel)' },
  { value: 'Rich', label: 'Rich (satt)' },
];

const TREATMENT_OPTIONS: OptionItem[] = [
  'Keine Behandlung',
  'Erhitzt',
  'Geölt',
  'Bestrahlt',
  'Diffusionsbehandlung',
  'Beschichtet',
  'Gebleicht',
  'Gefüllt (Fracture Filling)',
  'Stabilisiert',
].map((value) => ({ value }));

const CERTIFICATION_OPTIONS: OptionItem[] = [
  'GIA',
  'IGI',
  'HRD',
  'SSEF',
  'Gübelin',
  'DSEF',
  'AIGS',
  'GRS',
  'GemResearch Swisslab',
  'Keine Zertifizierung',
].map((value) => ({ value }));

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
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [videoUploadOpen, setVideoUploadOpen] = useState(false);

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
    if (!formValues.gemstoneType.trim()) {
      alert('Bitte wählen Sie eine Edelsteinart aus.');
      return;
    }
    const sanitized: GemstoneFormValues = {
      ...formValues,
      images: formValues.images.filter((url) => url.trim()).slice(0, 10),
      videos: formValues.videos.filter((url) => url.trim()).slice(0, 2),
    };
    onSubmit(sanitized);
  };

  const handleImageUploaded = (url: string) => {
    setFormValues((prev) => {
      const nextImages = [url, ...prev.images.filter(Boolean)];
      return { ...prev, images: nextImages.slice(0, 10) };
    });
  };

  const handleVideoUploaded = (url: string) => {
    setFormValues((prev) => {
      const nextVideos = [url, ...prev.videos.filter(Boolean)];
      return { ...prev, videos: nextVideos.slice(0, 2) };
    });
  };

  const openImageUpload = () => {
    if (formValues.images.length >= 10) {
      alert('Sie können maximal 10 Bilder hinterlegen.');
      return;
    }
    setImageUploadOpen(true);
  };

  const openVideoUpload = () => {
    if (formValues.videos.length >= 2) {
      alert('Sie können maximal 2 Videos hinterlegen.');
      return;
    }
    setVideoUploadOpen(true);
  };

  const weightLabel = formValues.type === 'cut' ? 'Gewicht (ct)' : 'Gewicht (g)';

  return (
    <div className="rounded-2xl border border-white/10 bg-gray-800/50/50 p-8 text-white shadow-xl shadow-black/40">
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
          <Button variant="outline" className="border-white/30 text-white hover:bg-gray-800/30/10" onClick={onCancel}>
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
              className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
              placeholder="z. B. Kolumbianischer Smaragd"
            />
          </div>

          <OverlaySelectField
            label="Edelsteinart"
            placeholder="Edelsteinart auswählen"
            value={formValues.gemstoneType}
            options={GEMSTONE_TYPE_OPTIONS}
            onChange={(value) => handleChange('gemstoneType', value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="gem-type">Art *</Label>
              <Select
                value={formValues.type}
                onValueChange={(value: 'cut' | 'rough') => handleChange('type', value)}
              >
                <SelectTrigger id="gem-type" className="border-white/20 bg-gray-800/50/40 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cut">Geschliffen</SelectItem>
                  <SelectItem value="rough">Rohstein</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <OverlaySelectField
              label="Herkunft (Land)"
              placeholder="Land auswählen oder eingeben"
              value={formValues.origin}
              options={ORIGIN_OPTIONS}
              onChange={(value) => handleChange('origin', value)}
              allowCustom
              allowEmpty
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="gem-price">Preis (€)</Label>
              <Input
                id="gem-price"
                type="number"
                value={formValues.price}
                onChange={(event) => handleChange('price', event.target.value)}
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
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
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
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
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
              />
              <Input
                placeholder="Breite"
                value={formValues.dimensions.width}
                onChange={(event) => updateDimension('width', event.target.value)}
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
              />
              <Input
                placeholder="Höhe"
                value={formValues.dimensions.height}
                onChange={(event) => updateDimension('height', event.target.value)}
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <OverlaySelectField
            label="Farbe"
            placeholder="Farbe auswählen oder eingeben"
            value={formValues.color}
            options={COLOR_OPTIONS}
            onChange={(value) => handleChange('color', value)}
            allowCustom
            allowEmpty
          />

          <OverlaySelectField
            label="Farbsättigung"
            placeholder="Sättigung auswählen oder eingeben"
            value={formValues.colorSaturation}
            options={SATURATION_OPTIONS}
            onChange={(value) => handleChange('colorSaturation', value)}
            allowCustom
            allowEmpty
          />
        </div>

        <div className="space-y-4">
          <OverlaySelectField
            label="Behandlung"
            placeholder="Behandlung auswählen oder eingeben"
            value={formValues.treatment}
            options={TREATMENT_OPTIONS}
            onChange={(value) => handleChange('treatment', value)}
            allowCustom
            allowEmpty
          />

          <OverlaySelectField
            label="Zertifizierung"
            placeholder="Zertifizierung auswählen oder eingeben"
            value={formValues.certification}
            options={CERTIFICATION_OPTIONS}
            onChange={(value) => handleChange('certification', value)}
            allowCustom
            allowEmpty
          />

          <MediaInputList
            label="Bilder (bis zu 10)"
            items={formValues.images}
            onChange={(index, value) => updateArrayValue('images', index, value)}
            onAdd={() => addArrayField('images', 10)}
            onRemove={(index) => removeArrayField('images', index)}
            action={
              <Button
                type="button"
                variant="outline"
                className="border-white/30 text-white hover:bg-gray-800/30/10"
                onClick={openImageUpload}
                disabled={formValues.images.length >= 10}
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                Datei hochladen
              </Button>
            }
          />

          <MediaInputList
            label="Videos (bis zu 2)"
            items={formValues.videos}
            onChange={(index, value) => updateArrayValue('videos', index, value)}
            onAdd={() => addArrayField('videos', 2)}
            onRemove={(index) => removeArrayField('videos', index)}
            action={
              <Button
                type="button"
                variant="outline"
                className="border-white/30 text-white hover:bg-gray-800/30/10"
                onClick={openVideoUpload}
                disabled={formValues.videos.length >= 2}
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                Datei hochladen
              </Button>
            }
          />

          <div className="rounded-xl border border-white/15 bg-gray-800/50/40 p-4">
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
              className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
              placeholder="Ausführliche Beschreibung des Edelsteins …"
            />
          </div>
        </div>
      </form>
      <MediaUploadDialog
        type="image"
        open={imageUploadOpen}
        onOpenChange={(open) => setImageUploadOpen(open)}
        onUploaded={handleImageUploaded}
      />
      <MediaUploadDialog
        type="video"
        open={videoUploadOpen}
        onOpenChange={(open) => setVideoUploadOpen(open)}
        onUploaded={handleVideoUploaded}
      />
    </div>
  );
}

interface OverlaySelectFieldProps {
  label: string;
  placeholder: string;
  value: string;
  options: OptionItem[];
  onChange: (value: string) => void;
  required?: boolean;
  allowCustom?: boolean;
  allowEmpty?: boolean;
}

function OverlaySelectField({
  label,
  placeholder,
  value,
  options,
  onChange,
  required = false,
  allowCustom = true,
  allowEmpty = false,
}: OverlaySelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customValue, setCustomValue] = useState(value);

  const normalizedOptions = useMemo(() => {
    const seen = new Set<string>();
    return options.filter((option) => {
      const key = option.value.trim().toLowerCase();
      if (seen.has(key) || !option.value.trim()) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [options]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) {
      return normalizedOptions;
    }
    const term = search.trim().toLowerCase();
    return normalizedOptions.filter((option) => {
      const searchable = `${option.label ?? option.value}`.toLowerCase();
      return (
        searchable.includes(term) ||
        option.value.toLowerCase().includes(term)
      );
    });
  }, [normalizedOptions, search]);

  const selectedLabel = useMemo(() => {
    if (!value) return '';
    const match = normalizedOptions.find(
      (option) => option.value.trim().toLowerCase() === value.trim().toLowerCase()
    );
    return match?.label ?? match?.value ?? value;
  }, [normalizedOptions, value]);

  useEffect(() => {
    if (open) {
      setCustomValue(value);
      setSearch('');
    }
  }, [open, value]);

  const displayLabel = required ? `${label} *` : label;

  return (
    <div className="space-y-2">
      <Label>{displayLabel}</Label>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex w-full items-center justify-between rounded-lg border border-white/20 bg-gray-800/50/40 px-3 py-2 text-left text-sm text-white transition focus:outline-none focus:ring-2 focus:ring-primary',
              !value && 'text-white/40'
            )}
          >
            <span className="truncate">
              {value ? selectedLabel || value : placeholder}
            </span>
            <span className="ml-3 text-xs uppercase tracking-wide text-white/40">
              Auswählen
            </span>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-xl border-white/20 bg-gray-800/50 text-white">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Liste durchsuchen …"
                className="border-white/20 bg-gray-800/50/60 pl-9 text-white placeholder:text-white/40"
              />
            </div>
            <div className="max-h-56 overflow-y-auto rounded-lg border border-white/10">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      'flex w-full items-start justify-between gap-3 border-b border-white/5 px-4 py-3 text-left text-sm transition hover:bg-gray-800/30/10',
                      option.value.trim().toLowerCase() === value.trim().toLowerCase() && 'bg-gray-800/30/10'
                    )}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <span className="font-medium text-white">
                      {option.label ?? option.value}
                    </span>
                    {option.label && option.label !== option.value && (
                      <span className="text-xs text-white/50">{option.value}</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-white/50">
                  Keine Treffer gefunden.
                </div>
              )}
            </div>
            {allowCustom && (
              <div className="space-y-2 rounded-lg border border-white/10 p-4">
                <Label className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Eigener Wert
                </Label>
                <Input
                  value={customValue}
                  onChange={(event) => setCustomValue(event.target.value)}
                  placeholder="Freitext eingeben …"
                  className="border-white/20 bg-gray-800/50/60 text-white placeholder:text-white/40"
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      const trimmed = customValue.trim();
                      if (!trimmed && !allowEmpty) return;
                      onChange(trimmed);
                      setOpen(false);
                    }}
                    disabled={!allowEmpty && !customValue.trim()}
                  >
                    Übernehmen
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-gray-800/30/10"
                    onClick={() => setCustomValue('')}
                  >
                    Löschen
                  </Button>
                </div>
              </div>
            )}
            {allowEmpty && value && (
              <Button
                type="button"
                variant="ghost"
                className="text-white/70 hover:bg-gray-800/30/10"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
              >
                Auswahl entfernen
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MediaInputListProps {
  label: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  action?: React.ReactNode;
}

function MediaInputList({ label, items, onChange, onAdd, onRemove, action }: MediaInputListProps) {
  const limitReached = items.length >= (label.includes('Video') ? 2 : 10);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        {action}
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(event) => onChange(index, event.target.value)}
              className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
              placeholder="https://…"
            />
            <Button
              type="button"
              variant="outline"
              className={cn(
                'border-white/20 text-white hover:bg-gray-800/30/10',
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
        className="border-white/30 text-white hover:bg-gray-800/30/10"
        onClick={onAdd}
        disabled={limitReached}
      >
        Weiteres {label.includes('Video') ? 'Video' : 'Bild'} hinzufügen
      </Button>
    </div>
  );
}

interface MediaUploadDialogProps {
  type: 'image' | 'video';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: (url: string) => void;
}

function MediaUploadDialog({ type, open, onOpenChange, onUploaded }: MediaUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes =
    type === 'image'
      ? 'image/jpeg,image/png,image/webp,image/gif'
      : 'video/mp4,video/webm,video/quicktime,video/x-msvideo';

  const maxFileSizeMB = type === 'image' ? 10 : 200;
  const title = type === 'image' ? 'Bild hochladen' : 'Video hochladen';

  const resetState = () => {
    setIsDragging(false);
    setIsUploading(false);
    setError(null);
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  const handleFileUpload = async (file: File) => {
    if (!file || isUploading) {
      return;
    }

    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`Datei zu groß. Maximal ${maxFileSizeMB} MB erlaubt.`);
      return;
    }

    setIsUploading(true);
    setError(null);
    setSelectedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/admin/gemstones/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.success || !result?.url) {
        throw new Error(result?.error || 'Upload fehlgeschlagen');
      }

      onUploaded(result.url);
      onOpenChange(false);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Upload fehlgeschlagen'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    const file = event.dataTransfer.files?.[0];
    if (file) {
      void handleFileUpload(file);
    }
  };

  const instructions =
    type === 'image'
      ? 'PNG, JPG, WEBP oder GIF bis 10MB'
      : 'MP4, MOV oder WEBM bis 200MB';

  return (
    <Dialog open={open} onOpenChange={(next) => !isUploading && onOpenChange(next)}>
      <DialogContent className="max-w-xl border-white/20 bg-gray-800/50 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            className="hidden"
            onChange={handleFileInputChange}
          />
          <div
            onDragOver={(event) => {
              event.preventDefault();
              if (!isUploading) setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={cn(
              'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition',
              isDragging ? 'border-primary bg-primary/10' : 'border-white/20 bg-gray-800/50/50'
            )}
          >
            <UploadIcon className="mb-4 h-8 w-8 text-white/60" />
            <p className="text-sm text-white/70">
              {instructions}
            </p>
            <p className="mt-2 text-xs text-white/40">
              Datei ziehen oder
            </p>
            <Button
              type="button"
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Datei auswählen
            </Button>
            {selectedFileName && (
              <p className="mt-3 text-xs text-white/50">
                Ausgewählt: {selectedFileName}
              </p>
            )}
          </div>
          {isUploading && (
            <div className="rounded-lg border border-white/10 bg-gray-800/50/40 p-3 text-sm text-white/70">
              Upload läuft … bitte warten.
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
