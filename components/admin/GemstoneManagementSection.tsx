'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Loader2, PenSquare, Plus, Search, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GemstoneEditor } from '@/components/admin/GemstoneEditor';
import { AdminGemstone } from '@/lib/types/admin-gemstone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

type DisplayGemstone = AdminGemstone & {
  mainImage: string;
};

const parseImages = (images: string | null | undefined): string[] => {
  if (!images) {
    return [];
  }
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const mapToDisplayGemstone = (gem: any): DisplayGemstone => {
  const images = Array.isArray(gem.images) ? gem.images : parseImages(gem.images);
  const mainImage = images?.[0] ?? PLACEHOLDER_IMAGE;
  return {
    id: gem.id,
    name: gem.name,
    category: gem.category,
    type: gem.type,
    price: gem.price,
    weight: gem.weight,
    dimensions: gem.dimensions,
    color: gem.color,
    colorIntensity: gem.colorIntensity,
    colorBrightness: gem.colorBrightness,
    clarity: gem.clarity,
    cut: gem.cut,
    cutForm: gem.cutForm,
    treatment: gem.treatment,
    certification: gem.certification,
    rarity: gem.rarity,
    origin: gem.origin,
    description: gem.description,
    images,
    inStock: gem.inStock,
    stock: gem.stock,
    sku: gem.sku,
    isNew: gem.isNew,
    createdAt: gem.createdAt,
    updatedAt: gem.updatedAt,
    mainImage,
  };
};

export function GemstoneManagementSection() {
  const [gemstones, setGemstones] = useState<DisplayGemstone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGemstone, setSelectedGemstone] = useState<DisplayGemstone | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [detailGemstone, setDetailGemstone] = useState<DisplayGemstone | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadGemstones = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/admin/gemstones?limit=200', {
        cache: 'no-store',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Fehler beim Laden der Edelsteine');
      }

      const mapped = Array.isArray(result.data)
        ? result.data.map(mapToDisplayGemstone)
        : [];

      setGemstones(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGemstones();
  }, [loadGemstones]);

  const filteredGemstones = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return gemstones;
    }

    return gemstones.filter((gem) =>
      [
        gem.name,
        gem.type,
        gem.origin,
        gem.category,
        gem.certification,
        gem.rarity,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term))
    );
  }, [gemstones, searchTerm]);

  const handleCreate = () => {
    setSelectedGemstone(null);
    setShowEditor(true);
  };

  const handleEdit = (gem: DisplayGemstone) => {
    setSelectedGemstone(gem);
    setShowEditor(true);
  };

  const handleDelete = async (gem: DisplayGemstone) => {
    const confirmed = window.confirm(
      `Soll der Edelstein „${gem.name}“ wirklich dauerhaft gelöscht werden?`
    );
    if (!confirmed) {
      return;
    }
    try {
      setDeletingId(gem.id);
      const response = await fetch(`/api/admin/gemstones/${gem.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Löschen fehlgeschlagen');
      }
      await loadGemstones();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = async () => {
    setShowEditor(false);
    await loadGemstones();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-muted-foreground">Inventar</p>
          <h1 className="text-3xl font-bold text-white">Edelsteine verwalten</h1>
          <p className="text-sm text-white/60 max-w-2xl">
            Pflegen Sie Ihr Portfolio, bearbeiten Sie bestehende Einträge oder legen Sie neue Edelsteine
            an. Alle Änderungen werden direkt in der Datenbank gespeichert.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Suchen nach Name, Typ oder Herkunft …"
              className="border-white/10 bg-black/40 pl-9 text-white placeholder:text-white/40"
            />
          </div>
          <Button
            onClick={handleCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Neuer Edelstein
          </Button>
        </div>
      </div>

      <Card className="border-white/10 bg-black/40 text-white">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold">
            Bestand ({filteredGemstones.length})
          </CardTitle>
          <p className="text-sm text-white/50">
            Die Daten werden aus der Prisma-Datenbank geladen. Änderungen sind sofort aktiv.
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-white/50">
              <Loader2 className="h-5 w-5 animate-spin" />
              Daten werden geladen …
            </div>
          ) : filteredGemstones.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/20 p-12 text-center text-white/60">
              <p className="text-lg font-semibold text-white">Keine Edelsteine gefunden</p>
              <p className="mt-2 text-sm text-white/50">
                Passen Sie die Suche an oder legen Sie einen neuen Edelstein an.
              </p>
              <Button onClick={handleCreate} className="mt-4 bg-primary text-primary-foreground">
                Neuen Edelstein hinzufügen
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredGemstones.map((gem) => (
                <article
                  key={gem.id}
                  className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5 shadow-lg shadow-black/20 transition-transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      <Image
                        src={gem.mainImage || PLACEHOLDER_IMAGE}
                        alt={gem.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="border-white/10 bg-white/10 text-white"
                          >
                            {gem.type === 'cut' ? 'Geschliffen' : 'Roh'}
                          </Badge>
                          {gem.category && (
                            <Badge className="border-primary/40 bg-primary/20 text-primary-foreground">
                              {gem.category}
                            </Badge>
                          )}
                          {!gem.inStock && (
                            <Badge className="border-red-400/40 bg-red-500/10 text-red-200">
                              Nicht verfügbar
                            </Badge>
                          )}
                          {gem.isNew && (
                            <Badge className="border-emerald-400/40 bg-emerald-500/10 text-emerald-200">
                              Neu
                            </Badge>
                          )}
                        </div>
                        <h2 className="mt-2 text-xl font-semibold text-white">{gem.name}</h2>
                        {gem.origin && (
                          <p className="text-sm text-white/60">Herkunft: {gem.origin}</p>
                        )}
                      </div>

                      {gem.description && (
                        <p className="line-clamp-3 text-sm text-white/70">{gem.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          {typeof gem.price === 'number' && (
                            <p className="text-lg font-semibold text-primary">
                              €{gem.price.toLocaleString('de-DE')}
                            </p>
                          )}
                          {typeof gem.weight === 'number' && (
                            <p className="text-xs text-white/60">
                              Gewicht: {gem.weight.toFixed(2)} ct
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 border-white/20 text-white hover:bg-white/10"
                            onClick={() => setDetailGemstone(gem)}
                            aria-label={`${gem.name} Details anzeigen`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 border-white/20 text-white hover:bg-white/10"
                            onClick={() => handleEdit(gem)}
                            aria-label={`${gem.name} bearbeiten`}
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 border-red-300/40 text-red-300 hover:bg-red-500/10"
                            onClick={() => handleDelete(gem)}
                            aria-label={`${gem.name} löschen`}
                            disabled={deletingId === gem.id}
                          >
                            {deletingId === gem.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showEditor && (
        <GemstoneEditor
          gemstone={selectedGemstone}
          onClose={() => setShowEditor(false)}
          onSaved={handleSaved}
        />
      )}

      <Dialog open={detailGemstone != null} onOpenChange={() => setDetailGemstone(null)}>
        <DialogContent className="max-w-3xl bg-[#101010] text-white">
          {detailGemstone && (
            <>
              <DialogHeader>
                <DialogTitle>{detailGemstone.name}</DialogTitle>
                <DialogDescription className="text-white/60">
                  Vollständige Detailansicht aus der Datenbank
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                <div className="space-y-4">
                  <div className="relative h-48 w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
                    <Image
                      src={detailGemstone.mainImage || PLACEHOLDER_IMAGE}
                      alt={detailGemstone.name}
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                  </div>
                  {detailGemstone.images && detailGemstone.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {detailGemstone.images.slice(0, 6).map((img, idx) => (
                        <div key={idx} className="relative h-16 w-full overflow-hidden rounded-lg border border-white/10">
                          <Image src={img} alt={`${detailGemstone.name} ${idx + 1}`} fill sizes="64px" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-4 text-sm text-white/80">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-white/50">Kategorie</p>
                      <p className="font-medium text-white">{detailGemstone.category || '–'}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Typ</p>
                      <p className="font-medium text-white">
                        {detailGemstone.type === 'cut' ? 'Geschliffener Stein' : 'Rohstein'}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50">Preis</p>
                      <p className="font-medium text-white">
                        {typeof detailGemstone.price === 'number'
                          ? `€${detailGemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`
                          : '–'}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50">Gewicht / Karat</p>
                      <p className="font-medium text-white">
                        {typeof detailGemstone.weight === 'number'
                          ? `${detailGemstone.weight.toFixed(2)} ct`
                          : '–'}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50">Farbe</p>
                      <p className="font-medium text-white">{detailGemstone.color || '–'}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Schliff</p>
                      <p className="font-medium text-white">{detailGemstone.cut || '–'}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Herkunft</p>
                      <p className="font-medium text-white">{detailGemstone.origin || '–'}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Zertifizierung</p>
                      <p className="font-medium text-white">{detailGemstone.certification || '–'}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Seltenheit</p>
                      <p className="font-medium text-white">{detailGemstone.rarity || '–'}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Bestand</p>
                      <p className="font-medium text-white">{detailGemstone.stock ?? 0}</p>
                    </div>
                    <div>
                      <p className="text-white/50">SKU</p>
                      <p className="font-medium text-white">{detailGemstone.sku || '–'}</p>
                    </div>
                    <div>
                      <p className="text-white/50">Status</p>
                      <p className="font-medium text-white">
                        {detailGemstone.inStock ? 'Verfügbar' : 'Nicht verfügbar'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/50">Beschreibung</p>
                    <p className="mt-2 whitespace-pre-line text-white/70">
                      {detailGemstone.description || 'Keine Beschreibung vorhanden.'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
