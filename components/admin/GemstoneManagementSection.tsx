'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Eye, PenSquare, Trash2, Star, Play, ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GemstoneEditor, GemstoneFormValues } from '@/components/admin/GemstoneEditor';
import { allGemstones } from '@/lib/data/gemstones';
import { Gemstone, isCutGemstone, isRoughGemstone } from '@/lib/types/gemstone';

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

type DisplayGemstone = {
  id: string;
  name: string;
  gemstoneType: string;
  type: 'cut' | 'rough';
  origin: string;
  mainImage: string;
  price: number;
  weight?: string;
  dimensions?: { length?: string; width?: string; height?: string };
  color?: string;
  colorSaturation?: string;
  treatment?: string;
  certification?: string;
  description?: string;
  isNew: boolean;
  isSold: boolean;
  images: string[];
  videos: string[];
};

const parseList = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item)).filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((item: unknown) => String(item)).filter(Boolean);
      }
    } catch {
      return value.split(',').map((part) => part.trim()).filter(Boolean);
    }
  }
  return [];
};

const convertLibraryGemstone = (gem: Gemstone): DisplayGemstone => {
  const weight = isCutGemstone(gem)
    ? `${gem.caratWeight} ct`
    : isRoughGemstone(gem)
      ? `${gem.gramWeight} g`
      : undefined;

  const size = gem.dimensions
    ? {
        length: String(gem.dimensions.length ?? ''),
        width: String(gem.dimensions.width ?? ''),
        height: String(gem.dimensions.height ?? ''),
      }
    : undefined;

  const mainImage = gem.mainImage || gem.images?.[0] || PLACEHOLDER_IMAGE;

  return {
    id: gem.id,
    name: gem.name,
    gemstoneType: gem.category ?? 'Edelstein',
    type: gem.type,
    origin: gem.origin ?? '–',
    mainImage,
    price: gem.price,
    weight,
    dimensions: size,
    color: (gem as Gemstone & { color?: string }).color ?? undefined,
    colorSaturation: isCutGemstone(gem) ? gem.colorIntensity ?? undefined : undefined,
    treatment: gem.treatment?.type ?? '–',
    certification: gem.certification?.lab ?? '–',
    description: gem.description ?? '',
    isNew: gem.isNew ?? false,
    isSold: gem.inStock === false,
    images: gem.images ?? (mainImage ? [mainImage] : []),
    videos: gem.videos ?? [],
  };
};

export function GemstoneManagementSection() {
  const fallbackGemstones = useMemo(
    () => allGemstones.map(convertLibraryGemstone),
    []
  );

  const [gemstones, setGemstones] = useState<DisplayGemstone[]>(fallbackGemstones);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);
  const [detailGemstone, setDetailGemstone] = useState<DisplayGemstone | null>(null);
  const [editorState, setEditorState] = useState<{ open: boolean; initial: GemstoneFormValues | null }>({
    open: false,
    initial: null,
  });

  const mapApiGemstone = useCallback((gem: any): DisplayGemstone => {
    const images = parseList(gem.images);
    const videos = parseList(gem.videos);

    const dimensionsString: string | null = typeof gem.dimensions === 'string' ? gem.dimensions : null;
    let dimensions: DisplayGemstone['dimensions'];
    if (dimensionsString) {
      const cleaned = dimensionsString.replace(/mm/gi, '');
      const parts = cleaned.split(/x|×/i).map((part) => part.trim());
      if (parts.length === 3) {
        dimensions = {
          length: parts[0] || undefined,
          width: parts[1] || undefined,
          height: parts[2] || undefined,
        };
      }
    }

    const weight = typeof gem.weight === 'number'
      ? `${gem.weight.toFixed(2)} ${gem.type === 'cut' ? 'ct' : 'g'}`
      : undefined;

    return {
      id: gem.id,
      name: gem.name,
      gemstoneType: gem.category ?? 'Edelstein',
      type: (gem.type as 'cut' | 'rough') ?? 'cut',
      origin: gem.origin ?? '–',
      mainImage: images[0] || PLACEHOLDER_IMAGE,
      price: typeof gem.price === 'number' ? gem.price : Number(gem.price ?? 0),
      weight,
      dimensions,
      color: gem.color ?? undefined,
      colorSaturation: gem.colorIntensity ?? undefined,
      treatment: gem.treatment ?? '–',
      certification: gem.certification ?? '–',
      description: gem.description ?? '',
      isNew: Boolean(gem.isNew),
      isSold: gem.inStock === false,
      images: images.length ? images : [PLACEHOLDER_IMAGE],
      videos,
    };
  }, []);

  const loadGemstones = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/admin/gemstones?limit=200', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Fehler beim Laden der Edelsteine');
      }
      const mapped = Array.isArray(result.data) ? result.data.map(mapApiGemstone) : [];
      console.log('Loaded gemstones from API:', mapped.length, mapped.map(g => ({ name: g.name, mainImage: g.mainImage })));
      setGemstones(mapped);
      setUsingFallback(Boolean(result.fallback));
    } catch (err) {
      console.log('Using fallback gemstones:', fallbackGemstones.length, fallbackGemstones.map(g => ({ name: g.name, mainImage: g.mainImage })));
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setGemstones(fallbackGemstones);
      setUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, [fallbackGemstones, mapApiGemstone]);

  useEffect(() => {
    loadGemstones();
  }, [loadGemstones]);

  const actionsDisabled = usingFallback || isLoading;

  const handleOpenEditor = (gemstone?: DisplayGemstone) => {
    if (gemstone) {
      setEditorState({
        open: true,
        initial: {
          id: gemstone.id,
          name: gemstone.name,
          gemstoneType: gemstone.gemstoneType,
          type: gemstone.type,
          origin: gemstone.origin === '–' ? '' : gemstone.origin,
          price: gemstone.price ? String(gemstone.price) : '',
          weight: gemstone.weight ? gemstone.weight.replace(/[^0-9.,]/g, '') : '',
          dimensions: {
            length: gemstone.dimensions?.length ?? '',
            width: gemstone.dimensions?.width ?? '',
            height: gemstone.dimensions?.height ?? '',
          },
          color: gemstone.color ?? '',
          colorSaturation: gemstone.colorSaturation ?? '',
          treatment: gemstone.treatment === '–' ? '' : gemstone.treatment ?? '',
          certification: gemstone.certification === '–' ? '' : gemstone.certification ?? '',
          images: gemstone.images.length ? gemstone.images.slice(0, 10) : [''],
          videos: gemstone.videos.length ? gemstone.videos.slice(0, 2) : [''],
          isNew: gemstone.isNew,
          isSold: gemstone.isSold,
          description: gemstone.description ?? '',
        },
      });
    } else {
      setEditorState({ open: true, initial: null });
    }
  };

  const handleSaveGemstone = (values: GemstoneFormValues) => {
    if (usingFallback) {
      setEditorState({ open: false, initial: null });
      return;
    }

    const dimensionsString =
      values.dimensions.length || values.dimensions.width || values.dimensions.height
        ? `${values.dimensions.length || '0'}x${values.dimensions.width || '0'}x${values.dimensions.height || '0'}mm`
        : null;

    const payload = {
      name: values.name,
      category: values.gemstoneType,
      type: values.type,
      origin: values.origin,
      price: values.price ? Number(values.price) : 0,
      weight: values.weight ? Number(values.weight) : null,
      dimensions: dimensionsString,
      color: values.color,
      colorIntensity: values.colorSaturation,
      treatment: values.treatment,
      certification: values.certification,
      description: values.description,
      images: values.images.filter((url) => url.trim()).slice(0, 10),
      videos: values.videos.filter((url) => url.trim()).slice(0, 2),
      isNew: values.isNew,
      inStock: !values.isSold,
    };

    const isUpdate = Boolean(values.id);
    const endpoint = isUpdate ? `/api/admin/gemstones/${values.id}` : '/api/admin/gemstones';
    const method = isUpdate ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Speichern fehlgeschlagen');
        }
      })
      .then(() => {
        setEditorState({ open: false, initial: null });
        loadGemstones();
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  };

  const handleDelete = (gemstone: DisplayGemstone) => {
    if (usingFallback) {
      alert('Aktion nicht möglich: Datenbankverbindung erforderlich.');
      return;
    }
    if (!window.confirm(`Soll der Edelstein „${gemstone.name}“ wirklich entfernt werden?`)) {
      return;
    }
    fetch(`/api/admin/gemstones/${gemstone.id}`, { method: 'DELETE' })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Löschen fehlgeschlagen');
        }
      })
      .then(() => {
        loadGemstones();
        if (detailGemstone?.id === gemstone.id) {
          setDetailGemstone(null);
        }
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  };

  const handleToggleNew = (gemstone: DisplayGemstone, value: boolean) => {
    if (usingFallback) {
      alert('Aktion nicht möglich: Datenbankverbindung erforderlich.');
      return;
    }
    fetch(`/api/admin/gemstones/${gemstone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isNew: value }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Aktualisierung fehlgeschlagen');
        }
      })
      .then(() => loadGemstones())
      .catch((err: Error) => setError(err.message));
  };

  const handleToggleSold = (gemstone: DisplayGemstone, value: boolean) => {
    if (usingFallback) {
      alert('Aktion nicht möglich: Datenbankverbindung erforderlich.');
      return;
    }
    fetch(`/api/admin/gemstones/${gemstone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inStock: !value }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Aktualisierung fehlgeschlagen');
        }
      })
      .then(() => loadGemstones())
      .catch((err: Error) => setError(err.message));
  };

  const handleSetMainImage = (gemstone: DisplayGemstone, imageUrl: string) => {
    if (usingFallback) {
      alert('Aktion nicht möglich: Datenbankverbindung erforderlich.');
      return;
    }
    
    // Aktualisiere die Bilder-Liste so, dass das gewählte Bild an erster Stelle steht
    const updatedImages = [imageUrl, ...gemstone.images.filter(img => img !== imageUrl)];
    
    fetch(`/api/admin/gemstones/${gemstone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        images: updatedImages,
        mainImage: imageUrl 
      }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Hauptbild-Aktualisierung fehlgeschlagen');
        }
      })
      .then(() => {
        loadGemstones();
        // Aktualisiere auch die Detailansicht
        if (detailGemstone?.id === gemstone.id) {
          setDetailGemstone({
            ...detailGemstone,
            mainImage: imageUrl,
            images: updatedImages
          });
        }
      })
      .catch((err: Error) => setError(err.message));
  };

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.42em] text-white/40">Inventar</p>
          <h1 className="text-3xl font-bold text-white">Edelsteine verwalten</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Übersicht über alle aktuell gepflegten Edelsteine. Sobald die Datenbank erreichbar ist, werden
            Bearbeitungen dauerhaft gespeichert. Fällt die Verbindung aus, sehen Sie Demodaten.
          </p>
          {error && (
            <div className="mt-3 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {error}
            </div>
          )}
        </div>
        <Button
          type="button"
          className="w-full bg-primary text-primary-foreground shadow-primary-glow hover:bg-primary-strong sm:w-auto"
          onClick={() => handleOpenEditor()}
          disabled={actionsDisabled}
        >
          Edelsteineditor
        </Button>
      </div>

      <Card className="border-white/10 bg-gray-800/50/50 p-0">
        <div className="divide-y divide-white/5">
          {gemstones.map((gemstone) => (
            <div
              key={gemstone.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/15 bg-gray-800/50/40">
                  <Image
                    src={gemstone.mainImage}
                    alt={gemstone.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={(e) => {
                      console.error('Admin thumbnail failed to load:', gemstone.name, gemstone.mainImage);
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                    onLoad={() => {
                      console.log('Admin thumbnail loaded successfully:', gemstone.name, gemstone.mainImage);
                    }}
                  />
                </div>
                <div className="grid gap-1 text-sm text-white/70">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-base font-semibold text-white">{gemstone.name}</p>
                    {gemstone.isNew && (
                      <Badge variant="outline" className="border-emerald-400/40 bg-emerald-500/10 text-emerald-100">
                        Neu
                      </Badge>
                    )}
                    {gemstone.isSold && (
                      <Badge variant="outline" className="border-red-400/40 bg-red-500/10 text-red-200">
                        Verkauft
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wide text-white/50">
                    <span>Art: <span className="text-white/80">{gemstone.type === 'cut' ? 'Geschliffen' : 'Rohstein'}</span></span>
                    <span>Edelsteinart: <span className="text-white/80">{gemstone.gemstoneType}</span></span>
                    <span>Herkunft: <span className="text-white/80">{gemstone.origin}</span></span>
                    {gemstone.weight && <span>Gewicht: <span className="text-white/80">{gemstone.weight}</span></span>}
                    {gemstone.dimensions && (
                      <span>
                        Größe: <span className="text-white/80">{gemstone.dimensions.length ?? '–'} × {gemstone.dimensions.width ?? '–'} × {gemstone.dimensions.height ?? '–'} mm</span>
                      </span>
                    )}
                    {gemstone.color && <span>Farbe: <span className="text-white/80">{gemstone.color}</span></span>}
                    {gemstone.colorSaturation && (
                      <span>Farbsättigung: <span className="text-white/80">{gemstone.colorSaturation}</span></span>
                    )}
                    {gemstone.treatment && <span>Behandlung: <span className="text-white/80">{gemstone.treatment}</span></span>}
                    {gemstone.certification && <span>Zertifizierung: <span className="text-white/80">{gemstone.certification}</span></span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 border-white/15 bg-gray-800/30/10 text-white hover:bg-gray-800/30/20"
                  onClick={() => setDetailGemstone(gemstone)}
                  aria-label={`${gemstone.name} anzeigen`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 border-white/15 bg-gray-800/30/10 text-white hover:bg-gray-800/30/20"
                  onClick={() => handleOpenEditor(gemstone)}
                  aria-label={`${gemstone.name} bearbeiten`}
                  disabled={actionsDisabled}
                >
                  <PenSquare className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-9 w-9 border-red-400/40 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                  onClick={() => handleDelete(gemstone)}
                  aria-label={`${gemstone.name} löschen`}
                  disabled={actionsDisabled}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {detailGemstone && (
        <div className="rounded-2xl border border-white/10 bg-gray-800/50/40 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Detailansicht</p>
              <h2 className="text-2xl font-semibold text-white">{detailGemstone.name}</h2>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-gray-800/30/10"
                onClick={() => handleToggleNew(detailGemstone, !detailGemstone.isNew)}
                disabled={actionsDisabled}
              >
                {detailGemstone.isNew ? 'Neu-Markierung entfernen' : 'Als neu markieren'}
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-gray-800/30/10"
                onClick={() => handleToggleSold(detailGemstone, !detailGemstone.isSold)}
                disabled={actionsDisabled}
              >
                {detailGemstone.isSold ? 'Als verfügbar markieren' : 'Als verkauft markieren'}
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-gray-800/30/10"
                onClick={() => setDetailGemstone(null)}
              >
                Detailansicht schließen
              </Button>
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
            <div className="space-y-4">
              {/* Hauptbild */}
              <div className="relative h-56 overflow-hidden rounded-xl border border-white/10 bg-gray-800/50/40">
                <Image
                  src={detailGemstone.mainImage}
                  alt={detailGemstone.name}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-primary/20 text-primary-foreground border-primary/30">
                    <Star className="h-3 w-3 mr-1" />
                    Hauptbild
                  </Badge>
                </div>
              </div>
              
              {/* Thumbnail-Galerie */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-white/80 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Medien-Galerie
                </h4>
                
                {/* Bilder Thumbnails */}
                {detailGemstone.images.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-white/60">Bilder ({detailGemstone.images.length})</p>
                    <div className="grid grid-cols-3 gap-2">
                      {detailGemstone.images.map((image, index) => (
                        <div
                          key={`img-${index}`}
                          className={`relative h-16 overflow-hidden rounded-lg border-2 cursor-pointer transition-all ${
                            image === detailGemstone.mainImage
                              ? 'border-primary/60 bg-primary/10'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                          onClick={() => handleSetMainImage(detailGemstone, image)}
                        >
                          <Image
                            src={image}
                            alt={`${detailGemstone.name} ${index + 1}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                          {image === detailGemstone.mainImage && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <Star className="h-3 w-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Video Thumbnails */}
                {detailGemstone.videos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-white/60">Videos ({detailGemstone.videos.length})</p>
                    <div className="grid grid-cols-3 gap-2">
                      {detailGemstone.videos.map((video, index) => (
                        <div
                          key={`vid-${index}`}
                          className="relative h-16 overflow-hidden rounded-lg border border-white/20 bg-gray-800/50/40 cursor-pointer hover:border-white/40 transition-all"
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white/80" />
                          </div>
                          <div className="absolute bottom-1 right-1">
                            <Video className="h-3 w-3 text-white/60" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Hinweis für Hauptbild-Auswahl */}
                <p className="text-xs text-white/50">
                  Klicken Sie auf ein Bild, um es als Hauptbild zu setzen
                </p>
              </div>
            </div>
            
            <div className="grid gap-3 text-sm text-white/70">
              <p><span className="text-white/50">Art:</span> {detailGemstone.type === 'cut' ? 'Geschliffen' : 'Rohstein'}</p>
              <p><span className="text-white/50">Edelsteinart:</span> {detailGemstone.gemstoneType}</p>
              <p><span className="text-white/50">Herkunft:</span> {detailGemstone.origin}</p>
              <p><span className="text-white/50">Gewicht:</span> {detailGemstone.weight ?? '–'}</p>
              <p>
                <span className="text-white/50">Größe:</span>{' '}
                {detailGemstone.dimensions
                  ? `${detailGemstone.dimensions.length ?? '–'} × ${detailGemstone.dimensions.width ?? '–'} × ${detailGemstone.dimensions.height ?? '–'} mm`
                  : '–'}
              </p>
              <p><span className="text-white/50">Farbe:</span> {detailGemstone.color ?? '–'}</p>
              <p><span className="text-white/50">Farbsättigung:</span> {detailGemstone.colorSaturation ?? '–'}</p>
              <p><span className="text-white/50">Behandlung:</span> {detailGemstone.treatment ?? '–'}</p>
              <p><span className="text-white/50">Zertifizierung:</span> {detailGemstone.certification ?? '–'}</p>
              <p><span className="text-white/50">Status:</span> {detailGemstone.isSold ? 'Verkauft' : 'Verfügbar'}</p>
              <p className="text-white/50">Beschreibung:</p>
              <p className="whitespace-pre-line text-white/70">{detailGemstone.description || 'Keine Beschreibung hinterlegt.'}</p>
              
              {/* Vollansicht Videos */}
              {detailGemstone.videos.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-white/50">Video-Wiedergabe</p>
                  {detailGemstone.videos.map((video, index) => (
                    <video key={index} src={video} controls className="w-full rounded-lg border border-white/10 bg-gray-800/50/60" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editorState.open && (
        <GemstoneEditor
          initialValues={editorState.initial}
          onCancel={() => setEditorState({ open: false, initial: null })}
          onSubmit={handleSaveGemstone}
        />
      )}
    </div>
  );
}
