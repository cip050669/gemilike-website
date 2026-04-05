'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Eye, PenSquare, Trash2, Star, Play, ImageIcon, Video, X } from 'lucide-react';
import { AdminButton } from './AdminButton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GemstoneEditor, GemstoneFormValues } from '@/components/admin/GemstoneEditor';
import { Gemstone, isCutGemstone, isRoughGemstone } from '@/lib/types/gemstone';
import { GemstoneBulkImportDialog } from './GemstoneBulkImportDialog';

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

type DisplayGemstone = {
  id: string;
  name: string;
  gemstoneType: string;
  type: 'cut' | 'rough';
  cut?: string;
  cutForm?: string;
  rarity?: string;
  origin: string;
  originType?: string;
  mainImage: string;
  price: number;
  weight?: string;
  dimensions?: { length?: string; width?: string; height?: string };
  color?: string;
  colorSaturation?: string;
  colorBrightness?: number; // 0-10
  clarity?: string;
  treatment?: string;
  certification?: string;
  description?: string;
  isNew: boolean;
  isSold: boolean;
  featured: boolean;
  images: string[];
  videos: string[];
  wishlistCount?: number;
  cartCount?: number;
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

const toDecimalNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

// Reserved for future use
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
  const cut = isCutGemstone(gem) ? gem.cut ?? undefined : undefined;
  const cutForm = isCutGemstone(gem) ? gem.cutForm ?? undefined : undefined;
  const featured = (gem as Gemstone & { featured?: boolean }).featured ?? false;

  return {
    id: gem.id,
    name: gem.name,
    gemstoneType: gem.category ?? 'Edelstein',
    type: gem.type,
    cut,
    cutForm,
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
    featured,
    isSold: gem.inStock === false,
    images: gem.images ?? (mainImage ? [mainImage] : []),
    videos: gem.videos ?? [],
    wishlistCount: 0,
    cartCount: 0,
  };
};

interface ShopMetrics {
  totals: {
    wishlistItems: number;
    cartItems: number;
    activeCarts: number;
  };
  topWishlisted: Array<{
    gemstoneId: string | null;
    name: string;
    slug: string | null;
    count: number;
  }>;
  topCarted: Array<{
    gemstoneId: string | null;
    name: string;
    slug: string | null;
    quantity: number;
  }>;
}

export function GemstoneManagementSection() {
  const [gemstones, setGemstones] = useState<DisplayGemstone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);
  const [detailGemstone, setDetailGemstone] = useState<DisplayGemstone | null>(null);
  const [editorState, setEditorState] = useState<{ open: boolean; initial: GemstoneFormValues | null }>({
    open: false,
    initial: null,
  });
  const [metrics, setMetrics] = useState<ShopMetrics | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [vectorQuery, setVectorQuery] = useState('');
  const [vectorMatches, setVectorMatches] = useState<string[] | null>(null);
  const [vectorStatus, setVectorStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [vectorError, setVectorError] = useState<string | null>(null);
  const [lastVectorQuery, setLastVectorQuery] = useState('');

  const mapApiGemstone = useCallback((gem: Record<string, unknown>): DisplayGemstone => {
    // Extract images from media relation if available, otherwise from images field
    const mediaImages = Array.isArray((gem as { media?: Array<{ type?: string; url?: string }> }).media)
      ? (gem as { media: Array<{ type?: string; url?: string }> }).media
          .filter((m) => m.type === 'IMAGE' && m.url)
          .map((m) => m.url!)
      : [];
    const fallbackImages = parseList(gem.images);
    const images = mediaImages.length > 0 ? mediaImages : fallbackImages;
    
    // Extract videos from media relation if available, otherwise from videos field
    const mediaVideos = Array.isArray((gem as { media?: Array<{ type?: string; url?: string }> }).media)
      ? (gem as { media: Array<{ type?: string; url?: string }> }).media
          .filter((m) => m.type === 'VIDEO' && m.url)
          .map((m) => m.url!)
      : [];
    const fallbackVideos = parseList(gem.videos);
    const videos = mediaVideos.length > 0 ? mediaVideos : fallbackVideos;

    const formatWeight = (value?: number, unit?: 'ct' | 'g') => {
      if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
      const formatted = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      }).format(value);
      return `${formatted} ${unit ?? 'ct'}`;
    };

    const inventory = (gem as { inventory?: { caratWeight?: unknown; gramWeight?: unknown } }).inventory;
    const caratWeight = toDecimalNumber(inventory?.caratWeight);
    const gramWeight = toDecimalNumber(inventory?.gramWeight);
    const weightValue =
      typeof gem.weight === 'number'
        ? gem.weight
        : gem.type === 'rough'
          ? gramWeight ?? null
          : caratWeight ?? null;
    const weight = weightValue !== null
      ? formatWeight(weightValue, gem.type === 'rough' ? 'g' : 'ct')
      : undefined;

    const attributes = (gem as { attributes?: { lengthMm?: unknown; widthMm?: unknown; heightMm?: unknown; metadata?: unknown } }).attributes;
    const lengthMm = toDecimalNumber(attributes?.lengthMm);
    const widthMm = toDecimalNumber(attributes?.widthMm);
    const heightMm = toDecimalNumber(attributes?.heightMm);
    const dimensions: DisplayGemstone['dimensions'] =
      lengthMm !== null || widthMm !== null || heightMm !== null
        ? {
            length: lengthMm !== null ? String(lengthMm) : undefined,
            width: widthMm !== null ? String(widthMm) : undefined,
            height: heightMm !== null ? String(heightMm) : undefined,
          }
        : undefined;

    const priceBook = Array.isArray((gem as { priceBooks?: Array<{ priceGross?: unknown; priceNet?: unknown }> }).priceBooks)
      ? (gem as { priceBooks: Array<{ priceGross?: unknown; priceNet?: unknown }> }).priceBooks[0]
      : undefined;
    const priceGross = toDecimalNumber(priceBook?.priceGross);
    const priceNet = toDecimalNumber(priceBook?.priceNet);
    const priceValue =
      typeof gem.price === 'number'
        ? gem.price
        : priceGross ?? priceNet ?? 0;
    const originType = (() => {
      const metadata = attributes?.metadata as { originType?: unknown } | undefined;
      return typeof metadata?.originType === 'string' ? metadata.originType : undefined;
    })();

    const wishlistCount =
      typeof (gem as { wishlistCount?: unknown }).wishlistCount === 'number'
        ? (gem as { wishlistCount?: number }).wishlistCount
        : 0;
    const cartCount =
      typeof (gem as { cartCount?: unknown }).cartCount === 'number'
        ? (gem as { cartCount?: number }).cartCount
        : 0;

    return {
      id: String(gem.id ?? ''),
      name: String(gem.name ?? ''),
      gemstoneType: (typeof gem.category === 'string' ? gem.category : 'Edelstein'),
      type: ((gem as { inventory?: { condition?: string } }).inventory?.condition === 'ROUGH' ? 'rough' : 'cut') as 'cut' | 'rough',
      cut: typeof gem.cut === 'string' && gem.cut ? String(gem.cut) : undefined,
      cutForm: typeof gem.cutForm === 'string' && gem.cutForm ? String(gem.cutForm) : undefined,
      origin: (typeof gem.origin === 'string' ? gem.origin : '–'),
      originType,
      mainImage: images[0] || PLACEHOLDER_IMAGE,
      price: priceValue,
      weight,
      dimensions,
      color: (typeof (gem as { color?: unknown }).color === 'string' ? (gem as { color: string }).color : (typeof (gem as { attributes?: { color?: unknown } }).attributes?.color === 'string' ? (gem as { attributes: { color: string } }).attributes.color : undefined)),
      colorSaturation: (typeof (gem as { colorIntensity?: unknown }).colorIntensity === 'string' ? (gem as { colorIntensity: string }).colorIntensity : (typeof (gem as { attributes?: { colorSaturation?: unknown } }).attributes?.colorSaturation === 'string' ? (gem as { attributes: { colorSaturation: string } }).attributes.colorSaturation : undefined)),
      colorBrightness: (typeof (gem as { attributes?: { colorBrightness?: unknown } }).attributes?.colorBrightness === 'number' ? (gem as { attributes: { colorBrightness: number } }).attributes.colorBrightness : undefined),
      clarity: (typeof (gem as { clarity?: unknown }).clarity === 'string' ? (gem as { clarity: string }).clarity : (typeof (gem as { attributes?: { clarity?: unknown } }).attributes?.clarity === 'string' ? (gem as { attributes: { clarity: string } }).attributes.clarity : undefined)),
      treatment: (typeof (gem as { treatment?: unknown }).treatment === 'string' ? (gem as { treatment: string }).treatment : (typeof (gem as { attributes?: { treatment?: unknown } }).attributes?.treatment === 'string' ? (gem as { attributes: { treatment: string } }).attributes.treatment : '–')),
      certification: (typeof (gem as { certification?: unknown }).certification === 'string' ? (gem as { certification: string }).certification : (typeof (gem as { attributes?: { certification?: unknown } }).attributes?.certification === 'string' ? (gem as { attributes: { certification: string } }).attributes.certification : '–')),
      rarity: (typeof (gem as { rarity?: unknown }).rarity === 'string' ? (gem as { rarity: string }).rarity : undefined),
      description: (typeof gem.description === 'string' ? gem.description : (typeof gem.longDescription === 'string' ? gem.longDescription : (typeof gem.shortDescription === 'string' ? gem.shortDescription : ''))),
      isNew: Boolean(gem.isNew),
      isSold: gem.inStock === false,
      featured: Boolean((gem as { featured?: unknown }).featured),
      images: images.length ? images : [PLACEHOLDER_IMAGE],
      videos,
      wishlistCount,
      cartCount,
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
      setGemstones(mapped);
      setUsingFallback(Boolean(result.fallback));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      setGemstones([]);
      setUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, [mapApiGemstone]);

  useEffect(() => {
    loadGemstones();
  }, [loadGemstones]);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setMetricsError(null);
        const response = await fetch('/api/admin/shop/metrics', { cache: 'no-store' });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Kennzahlen konnten nicht geladen werden.');
        }

        setMetrics(result.data as ShopMetrics);
      } catch (err) {
        console.error('Error loading shop metrics:', err);
        setMetrics(null);
        setMetricsError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Laden der Kennzahlen.');
      }
    };

    loadMetrics();
  }, []);

  const vectorMatchSet = useMemo(
    () => (vectorMatches ? new Set(vectorMatches) : null),
    [vectorMatches]
  );
  const vectorActive = vectorMatchSet !== null && lastVectorQuery.trim().length > 0;
  const vectorSearching = vectorStatus === 'loading';

  const filteredGemstones = useMemo(() => {
    if (!vectorMatchSet) return gemstones;
    return gemstones.filter((gem) => vectorMatchSet.has(gem.id));
  }, [gemstones, vectorMatchSet]);

  const actionsDisabled = usingFallback || isLoading;

  const handleVectorReset = () => {
    setVectorMatches(null);
    setVectorError(null);
    setVectorStatus('idle');
    setVectorQuery('');
    setLastVectorQuery('');
  };

  const handleVectorSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = vectorQuery.trim();
    if (!trimmed) {
      handleVectorReset();
      return;
    }
    setVectorStatus('loading');
    setVectorError(null);

    try {
      const response = await fetch(
        `/api/shop/vector-search?q=${encodeURIComponent(trimmed)}&locale=de`
      );
      if (!response.ok) {
        throw new Error('Vektorsuche fehlgeschlagen.');
      }
      const data = await response.json();
      const ids: string[] = Array.isArray(data.results)
        ? data.results.map((result: { id: string }) => result.id)
        : [];

      setLastVectorQuery(trimmed);
      setVectorMatches(ids);
      setVectorStatus(ids.length ? 'success' : 'error');
      setVectorError(ids.length ? null : 'Keine passenden Edelsteine gefunden.');
    } catch (err) {
      console.error(err);
      setVectorStatus('error');
      setVectorError(err instanceof Error ? err.message : 'Unbekannter Fehler bei der Vektorsuche.');
    }
  };

  const handleOpenEditor = (gemstone?: DisplayGemstone) => {
    if (gemstone) {
      setEditorState({
        open: true,
        initial: {
          id: gemstone.id,
          name: gemstone.name,
          gemstoneType: gemstone.gemstoneType,
          type: gemstone.type,
          cut: gemstone.cut ?? '',
          cutForm: gemstone.cutForm ?? '',
          rarity: gemstone.rarity ?? '',
          origin: gemstone.origin === '–' ? '' : gemstone.origin,
          originType: gemstone.originType ?? '',
          price: gemstone.price ? String(gemstone.price) : '',
          weight: gemstone.weight ? gemstone.weight.replace(/[^0-9.,]/g, '') : '',
          dimensions: {
            length: gemstone.dimensions?.length ?? '',
            width: gemstone.dimensions?.width ?? '',
            height: gemstone.dimensions?.height ?? '',
          },
          color: gemstone.color ?? '',
          colorSaturation: gemstone.colorSaturation ?? '',
          colorBrightness: gemstone.colorBrightness ?? 5,
          clarity: gemstone.clarity ?? '',
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

    const parseLocaleNumber = (value?: string | null) => {
      if (!value) return null;
      const trimmed = value.trim();
      if (!trimmed) return null;
      let normalized = trimmed.replace(/\s+/g, '');
      if (normalized.includes(',') && normalized.includes('.')) {
        normalized = normalized.replace(/\./g, '').replace(',', '.');
      } else {
        normalized = normalized.replace(',', '.');
      }
      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const weightValue = parseLocaleNumber(values.weight);
    
    const payload: Record<string, unknown> = {
      name: values.name,
      category: values.gemstoneType,
      type: values.type,
      condition: values.type === 'cut' ? 'CUT' : 'ROUGH',
      cut: values.type === 'cut' ? values.cut : '',
      cutForm: values.type === 'cut' ? values.cutForm : '',
      origin: values.origin,
      originType: values.originType,
      price: parseLocaleNumber(values.price) ?? 0,
      weight: weightValue,
      // For cut gemstones, use caratWeight; for rough, use gramWeight
      ...(values.type === 'cut' 
        ? { caratWeight: weightValue } 
        : { gramWeight: weightValue }),
      description: values.description,
      shortDescription: values.description,
      color: values.color,
      colorIntensity: values.colorSaturation,
      colorBrightness: values.colorBrightness,
      clarity: values.clarity,
      treatment: values.treatment,
      certification: values.certification,
      rarity: values.rarity,
      images: values.images.filter((url) => url.trim()).slice(0, 10),
      videos: values.videos.filter((url) => url.trim()).slice(0, 2),
      isNew: values.isNew,
      isSold: values.isSold,
      inStock: !values.isSold,
    };

    // Add dimensions as separate fields (lengthMm, widthMm, heightMm)
    if (values.dimensions.length) {
      payload.lengthMm = parseLocaleNumber(values.dimensions.length);
    }
    if (values.dimensions.width) {
      payload.widthMm = parseLocaleNumber(values.dimensions.width);
    }
    if (values.dimensions.height) {
      payload.heightMm = parseLocaleNumber(values.dimensions.height);
    }

    console.log('Saving gemstone with payload:', payload);

    const isUpdate = Boolean(values.id);
    const endpoint = isUpdate ? `/api/admin/gemstones/${values.id}` : '/api/admin/gemstones';
    const method = isUpdate ? 'PUT' : 'POST';

    fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        console.log('API Response status:', response.status);
        let result;
        try {
          const text = await response.text();
          result = text ? JSON.parse(text) : {};
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          throw new Error('Ungültige Antwort vom Server');
        }
        console.log('API Response:', result);
        if (!response.ok || !result.success) {
          throw new Error(result.error || `Speichern fehlgeschlagen: ${response.status}`);
        }
        return result;
      })
      .then(() => {
        setEditorState({ open: false, initial: null });
        setError(null);
        loadGemstones();
      })
      .catch((err: Error) => {
        console.error('Error saving gemstone:', err);
        const errorMessage = err.message || 'Fehler beim Speichern';
        setError(errorMessage);
        alert(`Fehler beim Speichern: ${errorMessage}`);
      });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredGemstones.map((g) => g.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleBulkDelete = async () => {
    console.log('[DELETE] Function called');
    
    if (usingFallback) {
      alert('Aktion nicht möglich: Datenbankverbindung erforderlich.');
      return;
    }
    
    if (selectedIds.size === 0) {
      alert('Bitte wählen Sie mindestens einen Edelstein zum Löschen aus.');
      return;
    }

    const idsArray = Array.from(selectedIds);
    console.log('[DELETE] Starting deletion of', idsArray.length, 'gemstones');
    setError(null);
    setIsLoading(true);
    const idsToDelete = [...idsArray];

    let successCount = 0;
    let failCount = 0;

    for (const id of idsToDelete) {
      console.log(`[DELETE] Deleting ID: ${id}`);
      try {
        const url = `/api/admin/gemstones/${id}`;
        console.log(`[DELETE] Fetching: ${url}`);
        const res = await fetch(url, { method: 'DELETE' });
        console.log(`[DELETE] Response status: ${res.status}`);
        const data = await res.json();
        console.log(`[DELETE] Response data:`, data);
        
        if (res.ok && data.success) {
          successCount++;
          console.log(`[DELETE] Successfully deleted: ${id}`);
        } else {
          failCount++;
          const errorMsg = `${id}: ${data.error || 'Fehler'}`;
          console.error(`[DELETE] Failed: ${errorMsg}`);
          setError(prev => (prev ? prev + '\n' : '') + errorMsg);
        }
      } catch (err) {
        failCount++;
        const errorMsg = `${id}: ${err instanceof Error ? err.message : 'Fehler'}`;
        console.error(`[DELETE] Exception: ${errorMsg}`, err);
        setError(prev => (prev ? prev + '\n' : '') + errorMsg);
      }
    }

    console.log(`[DELETE] Complete. Success: ${successCount}, Failed: ${failCount}`);
    setSelectedIds(new Set());
    if (detailGemstone && idsToDelete.includes(detailGemstone.id)) {
      setDetailGemstone(null);
    }

    await loadGemstones();
    setIsLoading(false);

    if (failCount === 0) {
      alert(`${successCount} Edelstein(e) erfolgreich gelöscht.`);
    } else {
      alert(`${successCount} gelöscht, ${failCount} Fehler.`);
    }
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

  const handleRemoveImage = (gemstone: DisplayGemstone, imageUrl: string) => {
    if (usingFallback) {
      alert('Aktion nicht möglich: Datenbankverbindung erforderlich.');
      return;
    }
    const updatedImages = gemstone.images.filter((img) => img !== imageUrl);
    const newMainImage = updatedImages[0] ?? PLACEHOLDER_IMAGE;

    fetch(`/api/admin/gemstones/${gemstone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        images: updatedImages,
        mainImage: newMainImage,
      }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Bild löschen fehlgeschlagen');
        }
      })
      .then(() => {
        loadGemstones();
        if (detailGemstone?.id === gemstone.id) {
          setDetailGemstone({
            ...detailGemstone,
            images: updatedImages.length ? updatedImages : [PLACEHOLDER_IMAGE],
            mainImage: newMainImage,
          });
        }
      })
      .catch((err: Error) => setError(err.message));
  };

  const handleRemoveVideo = (gemstone: DisplayGemstone, videoUrl: string) => {
    if (usingFallback) {
      alert('Aktion nicht möglich: Datenbankverbindung erforderlich.');
      return;
    }
    const updatedVideos = gemstone.videos.filter((vid) => vid !== videoUrl);

    fetch(`/api/admin/gemstones/${gemstone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videos: updatedVideos,
      }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Video löschen fehlgeschlagen');
        }
      })
      .then(() => {
        loadGemstones();
        if (detailGemstone?.id === gemstone.id) {
          setDetailGemstone({
            ...detailGemstone,
            videos: updatedVideos,
          });
        }
      })
      .catch((err: Error) => setError(err.message));
  };

  return (
    <div className="space-y-8 text-white">
      {editorState.open && (
        <GemstoneEditor
          initialValues={editorState.initial}
          onCancel={() => setEditorState({ open: false, initial: null })}
          onSubmit={handleSaveGemstone}
        />
      )}
      
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
      <div className="flex flex-col sm:flex-row gap-2">
        <AdminButton
          type="button"
          className="w-full bg-primary text-primary-foreground shadow-primary-glow hover:bg-primary-strong sm:w-auto"
          onClick={() => handleOpenEditor()}
          disabled={actionsDisabled}
        >
          Edelsteineditor
        </AdminButton>
        <GemstoneBulkImportDialog onImportComplete={loadGemstones} />
        {selectedIds.size > 0 && (
          <AdminButton
            type="button"
            className="w-full border-red-400/40 bg-red-500/10 text-red-200 hover:bg-red-500/20 sm:w-auto"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Delete button clicked');
              console.log('Selected IDs:', Array.from(selectedIds));
              console.log('Using fallback:', usingFallback);
              console.log('Actions disabled:', actionsDisabled);
              console.log('Is loading:', isLoading);
              await handleBulkDelete();
            }}
            disabled={actionsDisabled || isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {selectedIds.size} ausgewählte löschen
          </AdminButton>
        )}
      </div>
    </div>

      <div className="rounded-2xl border border-white/10 bg-gray-800/50 p-4">
        <form onSubmit={handleVectorSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-xs uppercase tracking-[0.3em] text-white/50 mb-2">
              Vektorsuche (Admin)
            </label>
            <input
              type="text"
              value={vectorQuery}
              onChange={(e) => setVectorQuery(e.target.value)}
              placeholder="z.B. gelber Saphir, oval, unbehandelt..."
              className="w-full rounded-lg border border-white/10 bg-gray-900/60 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/70"
              disabled={vectorSearching}
            />
          </div>
          <div className="flex gap-2">
            <AdminButton
              type="submit"
              className="bg-primary text-primary-foreground shadow-primary-glow hover:bg-primary-strong"
              disabled={vectorSearching}
            >
              {vectorSearching ? 'Suche läuft...' : 'Suchen'}
            </AdminButton>
            {vectorActive && (
              <AdminButton
                type="button"
                variant="outline"
                className="border-white/20 text-white hover:bg-gray-800/30/10"
                onClick={handleVectorReset}
                disabled={vectorSearching}
              >
                Zurücksetzen
              </AdminButton>
            )}
          </div>
        </form>
        {vectorActive && (
          <div className="mt-3 text-xs text-white/60">
            Treffer: {filteredGemstones.length} • Anfrage: „{lastVectorQuery}“
          </div>
        )}
        {vectorError && (
          <div className="mt-2 text-xs text-red-300">{vectorError}</div>
        )}
      </div>

      {/* Gemstone Statistics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-gray-800/50 p-4 shadow-lg shadow-black/30">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Gesamt</p>
          <p className="mt-2 text-3xl font-semibold text-white">{gemstones.length}</p>
          <p className="mt-1 text-xs text-white/60">Edelsteine</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gray-800/50 p-4 shadow-lg shadow-black/30">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Neu</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-400">
            {gemstones.filter((g) => g.isNew).length}
          </p>
          <p className="mt-1 text-xs text-white/60">Markiert als neu</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gray-800/50 p-4 shadow-lg shadow-black/30">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Featured</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {gemstones.filter((g) => g.featured).length}
          </p>
          <p className="mt-1 text-xs text-white/60">Hervorgehoben</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-gray-800/50 p-4 shadow-lg shadow-black/30">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Verkauft</p>
          <p className="mt-2 text-3xl font-semibold text-red-400">
            {gemstones.filter((g) => g.isSold).length}
          </p>
          <p className="mt-1 text-xs text-white/60">Nicht verfügbar</p>
        </div>
      </div>

      {metricsError && (
        <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {metricsError}
        </div>
      )}

      {metrics && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-gray-800/50 p-4 shadow-lg shadow-black/30">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Wishlist-Einträge</p>
              <p className="mt-2 text-3xl font-semibold text-white">{metrics.totals.wishlistItems}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gray-800/50 p-4 shadow-lg shadow-black/30">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Gespeicherte Warenkorb-Artikel</p>
              <p className="mt-2 text-3xl font-semibold text-white">{metrics.totals.cartItems}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gray-800/50 p-4 shadow-lg shadow-black/30">
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Aktive Warenkörbe</p>
              <p className="mt-2 text-3xl font-semibold text-white">{metrics.totals.activeCarts}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-gray-800/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
                Top Wunschlisten
              </h3>
              <div className="mt-3 space-y-2">
                {metrics.topWishlisted.length === 0 && (
                  <p className="text-sm text-white/50">Noch keine Wunschlisten vorhanden.</p>
                )}
                {metrics.topWishlisted.map((entry) => (
                  <div
                    key={entry.gemstoneId ?? entry.name}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-gray-900/40 px-3 py-2"
                  >
                    <span className="text-sm text-white/80">{entry.name}</span>
                    <span className="text-sm font-semibold text-primary">{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gray-800/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
                Top Warenkorb-Artikel
              </h3>
              <div className="mt-3 space-y-2">
                {metrics.topCarted.length === 0 && (
                  <p className="text-sm text-white/50">Noch keine Warenkorb-Daten vorhanden.</p>
                )}
                {metrics.topCarted.map((entry) => (
                  <div
                    key={entry.gemstoneId ?? entry.name}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-gray-900/40 px-3 py-2"
                  >
                    <span className="text-sm text-white/80">{entry.name}</span>
                    <span className="text-sm font-semibold text-primary">{entry.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Card className="border-white/10 bg-gray-700/50/50 p-0">
        {filteredGemstones.length > 0 && (
          <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-gray-800/30">
            <input
              type="checkbox"
              checked={
                filteredGemstones.length > 0 &&
                filteredGemstones.every((gem) => selectedIds.has(gem.id))
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-2 focus:ring-primary"
              disabled={actionsDisabled}
            />
            <label className="text-sm text-white/70">
              {selectedIds.size > 0
                ? `${filteredGemstones.filter((g) => selectedIds.has(g.id)).length} von ${filteredGemstones.length} ausgewählt`
                : 'Alle auswählen'}
            </label>
          </div>
        )}
        <div className="divide-y divide-white/5">
          {filteredGemstones.map((gemstone) => (
            <div
              key={gemstone.id}
              className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-1 items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(gemstone.id)}
                  onChange={() => handleToggleSelect(gemstone.id)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-2 focus:ring-primary flex-shrink-0"
                  disabled={actionsDisabled}
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                  <AdminButton
                    type="button"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-gray-800/30/10"
                    onClick={() => setDetailGemstone(gemstone)}
                    aria-label={`${gemstone.name} anzeigen`}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Anzeigen
                  </AdminButton>
                  <AdminButton
                    type="button"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-gray-800/30/10"
                    onClick={() => handleOpenEditor(gemstone)}
                    aria-label={`${gemstone.name} bearbeiten`}
                    disabled={actionsDisabled}
                  >
                    <PenSquare className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </AdminButton>
                </div>
                <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white/15 bg-gray-700/50/40">
                  <Image
                    src={gemstone.mainImage}
                    alt={gemstone.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={(e) => {
                      // Silently fallback to placeholder on error
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(gemstone, gemstone.mainImage)}
                    className="absolute right-1 top-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-white shadow-lg ring-1 ring-white/40 hover:bg-black"
                    title="Bild entfernen"
                    aria-label="Bild entfernen"
                  >
                    <X className="h-3 w-3" />
                  </button>
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
                    {gemstone.type === 'cut' && gemstone.cut && (
                      <span>Schliff: <span className="text-white/80">{gemstone.cut}</span></span>
                    )}
                    {gemstone.type === 'cut' && gemstone.cutForm && (
                      <span>Schliffform: <span className="text-white/80">{gemstone.cutForm}</span></span>
                    )}
                    {gemstone.dimensions && (
                      <span>
                        Größe: <span className="text-white/80">{gemstone.dimensions.length ?? '–'} × {gemstone.dimensions.width ?? '–'} × {gemstone.dimensions.height ?? '–'} mm</span>
                      </span>
                    )}
                    <span>Wishlist: <span className="text-white/80">{gemstone.wishlistCount ?? 0}</span></span>
                    <span>Warenkorb: <span className="text-white/80">{gemstone.cartCount ?? 0}</span></span>
                    {gemstone.color && <span>Farbe: <span className="text-white/80">{gemstone.color}</span></span>}
                    {gemstone.colorSaturation && (
                      <span>Farbsättigung: <span className="text-white/80">{gemstone.colorSaturation}</span></span>
                    )}
                    {gemstone.colorBrightness !== undefined && (
                      <span>Farbhelligkeit: <span className="text-white/80">{gemstone.colorBrightness}/10</span></span>
                    )}
                    {gemstone.clarity && <span>Reinheit: <span className="text-white/80">{gemstone.clarity}</span></span>}
                    {gemstone.treatment && <span>Behandlung: <span className="text-white/80">{gemstone.treatment}</span></span>}
                    {gemstone.certification && <span>Zertifizierung: <span className="text-white/80">{gemstone.certification}</span></span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {detailGemstone && (
        <div className="rounded-2xl border border-white/10 bg-gray-700/50/40 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Detailansicht</p>
              <h2 className="text-2xl font-semibold text-white">{detailGemstone.name}</h2>
            </div>
            <div className="flex gap-3">
              <AdminButton
                variant="outline"
                className="border-white/20 text-white hover:bg-gray-700/30/10"
                onClick={() => handleToggleNew(detailGemstone, !detailGemstone.isNew)}
                disabled={actionsDisabled}
              >
                {detailGemstone.isNew ? 'Neu-Markierung entfernen' : 'Als neu markieren'}
              </AdminButton>
              <AdminButton
                variant="outline"
                className="border-white/20 text-white hover:bg-gray-700/30/10"
                onClick={() => handleToggleSold(detailGemstone, !detailGemstone.isSold)}
                disabled={actionsDisabled}
              >
                {detailGemstone.isSold ? 'Als verfügbar markieren' : 'Als verkauft markieren'}
              </AdminButton>
              <AdminButton
                variant="outline"
                className="border-white/20 text-white hover:bg-gray-700/30/10"
                onClick={() => setDetailGemstone(null)}
              >
                Detailansicht schließen
              </AdminButton>
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
            <div className="space-y-4">
              {/* Hauptbild */}
              <div className="relative h-56 overflow-hidden rounded-xl border border-white/10 bg-gray-700/50/40">
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
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(detailGemstone, image);
                            }}
                            className="absolute right-1 top-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-white shadow-lg ring-1 ring-white/40 hover:bg-black"
                            title="Bild entfernen"
                          >
                            <X className="h-3 w-3" />
                          </button>
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
                          className="relative h-16 overflow-hidden rounded-lg border border-white/20 bg-gray-700/50/40 cursor-pointer hover:border-white/40 transition-all"
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white/80" />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(detailGemstone, video)}
                            className="absolute right-1 top-1 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/80 text-white shadow-lg ring-1 ring-white/40 hover:bg-black"
                            title="Video entfernen"
                          >
                            <X className="h-3 w-3" />
                          </button>
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
              {detailGemstone.type === 'cut' && (
                <>
                  <p><span className="text-white/50">Schliff:</span> {detailGemstone.cut ?? '–'}</p>
                  <p><span className="text-white/50">Schliffform:</span> {detailGemstone.cutForm ?? '–'}</p>
                </>
              )}
              <p>
                <span className="text-white/50">Größe:</span>{' '}
                {detailGemstone.dimensions
                  ? `${detailGemstone.dimensions.length ?? '–'} × ${detailGemstone.dimensions.width ?? '–'} × ${detailGemstone.dimensions.height ?? '–'} mm`
                  : '–'}
              </p>
              <p><span className="text-white/50">Farbe:</span> {detailGemstone.color ?? '–'}</p>
              <p><span className="text-white/50">Farbsättigung:</span> {detailGemstone.colorSaturation ?? '–'}</p>
              {detailGemstone.colorBrightness !== undefined && (
                <p><span className="text-white/50">Farbhelligkeit:</span> {detailGemstone.colorBrightness}/10 ({detailGemstone.colorBrightness === 0 ? 'Weiß' : detailGemstone.colorBrightness === 10 ? 'Schwarz' : `Stufe ${detailGemstone.colorBrightness}`})</p>
              )}
              <p><span className="text-white/50">Reinheit:</span> {detailGemstone.clarity ?? '–'}</p>
              <p><span className="text-white/50">Behandlung:</span> {detailGemstone.treatment ?? '–'}</p>
              <p><span className="text-white/50">Zertifizierung:</span> {detailGemstone.certification ?? '–'}</p>
              <p><span className="text-white/50">Wishlist-Einträge:</span> {detailGemstone.wishlistCount ?? 0}</p>
              <p><span className="text-white/50">Warenkorb-Einträge:</span> {detailGemstone.cartCount ?? 0}</p>
              <p><span className="text-white/50">Status:</span> {detailGemstone.isSold ? 'Verkauft' : 'Verfügbar'}</p>
              <p className="text-white/50">Beschreibung:</p>
              <p className="whitespace-pre-line text-white/70">{detailGemstone.description || 'Keine Beschreibung hinterlegt.'}</p>
              
              {/* Vollansicht Videos */}
              {detailGemstone.videos.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-white/50">Video-Wiedergabe</p>
                  {detailGemstone.videos.map((video, index) => (
                    <video key={index} src={video} controls className="w-full rounded-lg border border-white/10 bg-gray-700/50/60" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
