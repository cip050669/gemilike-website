'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { AdminGemstone } from '@/lib/types/admin-gemstone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface GemstoneEditorProps {
  gemstone: AdminGemstone | null;
  onClose: () => void;
  onSaved: () => void;
}

type GemstoneFormState = {
  name: string;
  category: string;
  type: 'cut' | 'rough';
  price: string;
  weight: string;
  color: string;
  cut: string;
  origin: string;
  stock: string;
  inStock: boolean;
  isNew: boolean;
  sku: string;
  description: string;
  certification: string;
  rarity: string;
  imageUrls: string[];
  videoUrls: string[];
};

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

const DEFAULT_FORM_STATE: GemstoneFormState = {
  name: '',
  category: '',
  type: 'cut',
  price: '',
  weight: '',
  color: '',
  cut: '',
  origin: '',
  stock: '0',
  inStock: true,
  isNew: false,
  sku: '',
  description: '',
  certification: '',
  rarity: '',
  imageUrls: [],
  videoUrls: [],
};

export function GemstoneEditor({ gemstone, onClose, onSaved }: GemstoneEditorProps) {
  const t = useTranslations();
  const [formState, setFormState] = useState<GemstoneFormState>(DEFAULT_FORM_STATE);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrlsInput, setImageUrlsInput] = useState('');
  const [videoUrlsInput, setVideoUrlsInput] = useState('');

  useEffect(() => {
    if (!gemstone) {
      setFormState(DEFAULT_FORM_STATE);
      setImagePreview(null);
      setImageFile(null);
      setImageUrlsInput('');
      setVideoUrlsInput('');
      return;
    }

    setFormState({
      name: gemstone.name ?? '',
      category: gemstone.category ?? '',
      type: (gemstone.type as 'cut' | 'rough') ?? 'cut',
      price: gemstone.price?.toString() ?? '',
      weight: gemstone.weight != null ? gemstone.weight.toString() : '',
      color: gemstone.color ?? '',
      cut: gemstone.cut ?? '',
      origin: gemstone.origin ?? '',
      stock: gemstone.stock?.toString() ?? '0',
      inStock: gemstone.inStock ?? true,
      isNew: gemstone.isNew ?? false,
      sku: gemstone.sku ?? '',
      description: gemstone.description ?? '',
      certification: gemstone.certification ?? '',
      rarity: gemstone.rarity ?? '',
      imageUrls: gemstone.images ?? [],
      videoUrls: gemstone.videos ?? [],
    });
    setImageUrlsInput((gemstone.images ?? []).join('\n'));
    setVideoUrlsInput((gemstone.videos ?? []).join('\n'));
    setImagePreview((gemstone.images ?? [])[0] ?? null);
    setImageFile(null);
  }, [gemstone]);

  useEffect(() => {
    if (!imageFile) {
      return;
    }
    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const handleChange = (field: keyof GemstoneFormState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const parseListInput = (value: string) =>
    value
      .split(/\r?\n|,/)
      .map((entry) => entry.trim())
      .filter(Boolean);

  const handleImageUrlsChange = (value: string) => {
    setImageUrlsInput(value);
    const list = parseListInput(value).slice(0, 10);
    setFormState((prev) => ({ ...prev, imageUrls: list }));
    if (!imageFile) {
      setImagePreview(list[0] ?? null);
    }
  };

  const handleVideoUrlsChange = (value: string) => {
    setVideoUrlsInput(value);
    const list = parseListInput(value).slice(0, 2);
    setFormState((prev) => ({ ...prev, videoUrls: list }));
  };

  const apiUrl = useMemo(() => {
    if (!gemstone) {
      return '/api/admin/gemstones';
    }
    return `/api/admin/gemstones/${gemstone.id}`;
  }, [gemstone]);

  const method = gemstone ? 'PUT' : 'POST';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('category', formState.category || 'Edelstein');
      formData.append('type', formState.type);
      formData.append('price', formState.price || '0');
      formData.append('weight', formState.weight || '');
      formData.append('color', formState.color || '');
      formData.append('cut', formState.cut || '');
      formData.append('origin', formState.origin || '');
      formData.append('stock', formState.stock || '0');
      formData.append('inStock', formState.inStock ? 'true' : 'false');
      formData.append('isNew', formState.isNew ? 'true' : 'false');
      formData.append('sku', formState.sku || '');
      formData.append('description', formState.description || '');
      formData.append('certification', formState.certification || '');
      formData.append('rarity', formState.rarity || '');

      if (formState.imageUrls.length > 0) {
        formData.append('images', JSON.stringify(formState.imageUrls.slice(0, 10)));
      }

      if (formState.videoUrls.length > 0) {
        formData.append('videos', JSON.stringify(formState.videoUrls.slice(0, 2)));
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(apiUrl, {
        method,
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unbekannter Fehler');
      }

      onSaved();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Speichern';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] text-white shadow-2xl">
        <div className="flex justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-2xl font-semibold">
              {gemstone ? 'Edelstein bearbeiten' : 'Neuen Edelstein anlegen'}
            </h2>
            <p className="text-sm text-white/60">
              Füllen Sie die folgenden Angaben aus, um den Edelstein im Sortiment zu verwalten.
            </p>
          </div>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={onClose}>
            {t('admin.cancel')}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 px-6 py-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="gem-name" className="text-white/80">
                Name *
              </Label>
              <Input
                id="gem-name"
                value={formState.name}
                onChange={(event) => handleChange('name', event.target.value)}
                required
                className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gem-type" className="text-white/80">
                  Typ *
                </Label>
                <select
                  id="gem-type"
                  value={formState.type}
                  onChange={(event) => handleChange('type', event.target.value as 'cut' | 'rough')}
                  className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
                >
                  <option value="cut">Geschliffen</option>
                  <option value="rough">Rohstein</option>
                </select>
              </div>
              <div>
                <Label htmlFor="gem-category" className="text-white/80">
                  Kategorie
                </Label>
                <Input
                  id="gem-category"
                  value={formState.category}
                  onChange={(event) => handleChange('category', event.target.value)}
                  className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gem-price" className="text-white/80">
                  Preis (€)
                </Label>
                <Input
                  id="gem-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.price}
                  onChange={(event) => handleChange('price', event.target.value)}
                  className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label htmlFor="gem-weight" className="text-white/80">
                  Gewicht (ct)
                </Label>
                <Input
                  id="gem-weight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.weight}
                  onChange={(event) => handleChange('weight', event.target.value)}
                  className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gem-color" className="text-white/80">
                  Farbe
                </Label>
                <Input
                  id="gem-color"
                  value={formState.color}
                  onChange={(event) => handleChange('color', event.target.value)}
                  className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label htmlFor="gem-cut" className="text-white/80">
                  Schliff
                </Label>
                <Input
                  id="gem-cut"
                  value={formState.cut}
                  onChange={(event) => handleChange('cut', event.target.value)}
                  className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gem-origin" className="text-white/80">
                Herkunft
              </Label>
              <Input
                id="gem-origin"
                value={formState.origin}
                onChange={(event) => handleChange('origin', event.target.value)}
                className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gem-cert" className="text-white/80">
                  Zertifizierung
                </Label>
                <Input
                  id="gem-cert"
                  value={formState.certification}
                  onChange={(event) => handleChange('certification', event.target.value)}
                  className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label htmlFor="gem-rarity" className="text-white/80">
                  Seltenheit
                </Label>
                <Input
                  id="gem-rarity"
                  value={formState.rarity}
                  onChange={(event) => handleChange('rarity', event.target.value)}
                  className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="gem-stock" className="text-white/80">
                  Bestand
                </Label>
                <Input
                  id="gem-stock"
                  type="number"
                  min="0"
                  value={formState.stock}
                  onChange={(event) => handleChange('stock', event.target.value)}
                  className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label htmlFor="gem-sku" className="text-white/80">
                  SKU / Artikelnummer
                </Label>
                <Input
                  id="gem-sku"
                  value={formState.sku}
                  onChange={(event) => handleChange('sku', event.target.value)}
                  className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="gem-description" className="text-white/80">
                Beschreibung
              </Label>
              <Textarea
                id="gem-description"
                value={formState.description}
                onChange={(event) => handleChange('description', event.target.value)}
                rows={4}
                className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4 rounded-xl border border-white/10 bg-black/30 p-4">
              <Label className="text-white/80">Bild</Label>
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-dashed border-white/20 bg-black/40">
                <Image
                  src={imagePreview || formState.imageUrls[0] || PLACEHOLDER_IMAGE}
                  alt={formState.name || 'Edelstein'}
                  fill
                  className="object-cover"
                />
              </div>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setImageFile(file);
                }}
                className="cursor-pointer border-white/10 bg-black/40 text-white"
              />
            <p className="text-xs text-white/50">
              Unterstützt JPG, PNG oder WEBP. Das Bild wird optimiert im Verzeichnis <code>/public/uploads/gemstones</code> gespeichert.
            </p>

            <div className="space-y-2">
              <Label htmlFor="gem-images" className="text-white/80">
                Zusätzliche Bild-URLs (max. 10, eine pro Zeile)
              </Label>
              <Textarea
                id="gem-images"
                value={imageUrlsInput}
                onChange={(event) => handleImageUrlsChange(event.target.value)}
                rows={4}
                className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                placeholder="https://...jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gem-videos" className="text-white/80">
                Video-URLs (max. 2, MP4/HLS)
              </Label>
              <Textarea
                id="gem-videos"
                value={videoUrlsInput}
                onChange={(event) => handleVideoUrlsChange(event.target.value)}
                rows={2}
                className="border-white/10 bg-black/40 text-white placeholder:text-white/40"
                placeholder="https://...mp4"
              />
              <p className="text-xs text-white/40">
                Für Videos bitte öffentlich abrufbare MP4- oder HLS-Links verwenden. Maximal zwei Videos werden in der Galerie angezeigt.
              </p>
            </div>
            </div>

            <div className="grid gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/80">Auf Lager</Label>
                  <p className="text-xs text-white/50">Steuert die Sichtbarkeit im Shop.</p>
                </div>
                <Switch
                  checked={formState.inStock}
                  onCheckedChange={(value) => handleChange('inStock', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/80">Neu im Sortiment</Label>
                  <p className="text-xs text-white/50">Markiert Edelsteine als Highlight.</p>
                </div>
                <Switch
                  checked={formState.isNew}
                  onCheckedChange={(value) => handleChange('isNew', value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting
                  ? 'Speichern …'
                  : gemstone
                    ? 'Edelstein aktualisieren'
                    : 'Edelstein anlegen'}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                disabled={isSubmitting}
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
