'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShopGemstone } from '@/components/shop/GemstoneGrid';

interface ShopShowcaseProps {
  gemstones: ShopGemstone[];
  fallback?: boolean;
}

const PLACEHOLDER_IMAGE = '/products/placeholder-gem.jpg';

const initialFilters = {
  category: '',
  origin: '',
  color: '',
  treatment: '',
  certification: '',
  weightMin: '',
  weightMax: '',
  priceMin: '',
  priceMax: '',
};

export function ShopShowcase({ gemstones, fallback = false }: ShopShowcaseProps) {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'de';

  const [filters, setFilters] = useState(initialFilters);
  const [selectedGemstone, setSelectedGemstone] = useState<ShopGemstone | null>(null);

  const newGemstones = useMemo(
    () => gemstones.filter((gem) => gem.isNew),
    [gemstones]
  );

  const regularGemstones = useMemo(
    () => gemstones.filter((gem) => !gem.isNew),
    [gemstones]
  );

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    gemstones.forEach((gem) => {
      if (gem.category) {
        set.add(gem.category);
      }
      if (gem.name) {
        set.add(gem.name);
      }
    });
    return Array.from(set).sort();
  }, [gemstones]);

  const originOptions = useMemo(() => {
    return Array.from(new Set(gemstones.map((gem) => gem.origin).filter(Boolean))).sort();
  }, [gemstones]);

  const colorOptions = useMemo(() => {
    return Array.from(new Set(gemstones.map((gem) => gem.color).filter(Boolean))).sort();
  }, [gemstones]);

  const treatmentOptions = useMemo(() => {
    return Array.from(new Set(gemstones.map((gem) => gem.treatment).filter(Boolean))).sort();
  }, [gemstones]);

  const certificationOptions = useMemo(() => {
    return Array.from(
      new Set(gemstones.map((gem) => gem.certification).filter(Boolean))
    ).sort();
  }, [gemstones]);

  const filteredRegularGemstones = useMemo(() => {
    const weightMin = filters.weightMin ? Number(filters.weightMin) : null;
    const weightMax = filters.weightMax ? Number(filters.weightMax) : null;
    const priceMin = filters.priceMin ? Number(filters.priceMin) : null;
    const priceMax = filters.priceMax ? Number(filters.priceMax) : null;

    return regularGemstones.filter((gem) => {
      if (
        filters.category &&
        gem.category !== filters.category &&
        gem.name !== filters.category
      ) {
        return false;
      }
      if (filters.origin && gem.origin !== filters.origin) return false;
      if (filters.color && gem.color !== filters.color) return false;
      if (filters.treatment && gem.treatment !== filters.treatment) return false;
      if (filters.certification && gem.certification !== filters.certification) return false;

      const weightValue = typeof gem.weight === 'number' ? gem.weight : null;
      if (weightMin !== null && (weightValue === null || weightValue < weightMin)) {
        return false;
      }
      if (weightMax !== null && (weightValue === null || weightValue > weightMax)) {
        return false;
      }

      if (priceMin !== null && gem.price < priceMin) return false;
      if (priceMax !== null && gem.price > priceMax) return false;

      return true;
    });
  }, [regularGemstones, filters]);

  const hasFiltersApplied = useMemo(
    () =>
      Object.entries(filters).some(([key, value]) => {
        if (key.endsWith('Min') || key.endsWith('Max')) {
          return value !== '';
        }
        return Boolean(value);
      }),
    [filters]
  );

  const inventoryGemstones = useMemo(() => {
    if (filteredRegularGemstones.length > 0) {
      return filteredRegularGemstones;
    }
    if (hasFiltersApplied) {
      return [];
    }
    if (regularGemstones.length > 0) {
      return regularGemstones;
    }
    return newGemstones;
  }, [filteredRegularGemstones, hasFiltersApplied, regularGemstones, newGemstones]);

  useEffect(() => {
    if (inventoryGemstones.length === 0) {
      setSelectedGemstone(null);
      return;
    }

    setSelectedGemstone((current) => {
      if (!current) {
        return inventoryGemstones[0];
      }
      const stillExists = inventoryGemstones.some((gem) => gem.id === current.id);
      return stillExists ? current : inventoryGemstones[0];
    });
  }, [inventoryGemstones]);

  const renderCarousel = (
    items: ShopGemstone[],
    label: string,
    subtitle: string,
    showNewBadge = false
  ) => {
    if (items.length === 0) {
      return null;
    }

    return (
      <section className="main-container space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-white/60">{subtitle}</p>
            <h2 className="text-3xl md:text-4xl font-impact font-weight-impact text-white">
              {label}
            </h2>
            {fallback && (
              <p className="text-xs text-white/50">
                Hinweis: Temporäre Beispiel-Daten, da aktuell keine Datenbankverbindung möglich war.
              </p>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="flex gap-[75px] overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {items.map((gemstone) => {
              const imageSrc = gemstone.images[0] ?? PLACEHOLDER_IMAGE;
              const detailHref = `/${locale}/shop/${gemstone.id}`;

              return (
                <Link
                  key={gemstone.id}
                  href={detailHref}
                  prefetch={true}
                  className="group min-w-[240px] max-w-[240px] snap-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  aria-label={`${gemstone.name} Details anzeigen`}
                >
                  <article className="story-card bg-[#2D2D2D]/90 border border-white/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="overflow-hidden rounded-lg mb-4">
                      <div className="aspect-[4/3] relative bg-black/30">
                        <Image
                          src={imageSrc}
                          alt={gemstone.name}
                          fill
                          sizes="240px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div className="space-y-3 px-2 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-white line-clamp-1">
                          {gemstone.name}
                        </h3>
                        {showNewBadge && gemstone.isNew && (
                          <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wide">
                            Neu
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/80">
                        {typeof gemstone.weight === 'number' && (
                          <span className="inline-flex items-center gap-1">
                            Gewicht {gemstone.weight.toFixed(2)} {gemstone.weightUnit ?? 'ct'}
                          </span>
                        )}
                        {gemstone.origin && (
                          <span className="inline-flex items-center gap-1">
                            Herkunft {gemstone.origin}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/80">
                        <span className="inline-flex items-center gap-1">
                          Kategorie {gemstone.category}
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          €{gemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/60">Bestand: {gemstone.stock}</div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderInventorySection = (items: ShopGemstone[]) => (
    <section className="main-container space-y-8 min-h-[75vh]">
      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-wide text-white/60">Verfügbare Edelsteine</p>
          <h2 className="text-3xl md:text-4xl font-impact font-weight-impact text-white">Bestand</h2>
        </div>
        {fallback && (
          <p className="text-xs text-white/50">
            Hinweis: Temporäre Beispiel-Daten, da aktuell keine Datenbankverbindung möglich war.
          </p>
        )}
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          {selectedGemstone ? (
            <>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={selectedGemstone.images[0] ?? PLACEHOLDER_IMAGE}
                    alt={selectedGemstone.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {!selectedGemstone.inStock && (
                  <div className="absolute left-4 top-4">
                    <Badge variant="destructive">Nicht verfügbar</Badge>
                  </div>
                )}
                {selectedGemstone.isNew && (
                  <div className="absolute right-4 top-4">
                    <Badge variant="accent">Neu</Badge>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-white">{selectedGemstone.name}</h3>
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-white/60">
                    <Badge variant="secondary">{selectedGemstone.category}</Badge>
                    <Badge variant="outline">
                      {selectedGemstone.type === 'cut' ? 'Geschliffener Stein' : 'Rohstein'}
                    </Badge>
                    {selectedGemstone.origin && (
                      <Badge variant="outline">Herkunft {selectedGemstone.origin}</Badge>
                    )}
                    {selectedGemstone.rarity && (
                      <Badge variant="outline">Seltenheit {selectedGemstone.rarity}</Badge>
                    )}
                  </div>
                </div>

                {selectedGemstone.description && (
                  <p className="text-sm leading-relaxed text-white/75">{selectedGemstone.description}</p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <InventoryDetail label="Preis">
                    €{selectedGemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </InventoryDetail>
                  <InventoryDetail label="Bestand">{selectedGemstone.stock} Stück</InventoryDetail>
                  {typeof selectedGemstone.weight === 'number' && (
                    <InventoryDetail label="Gewicht">
                      {selectedGemstone.weight.toFixed(2)} {selectedGemstone.weightUnit ?? 'ct'}
                    </InventoryDetail>
                  )}
                  {selectedGemstone.color && (
                    <InventoryDetail label="Farbe">{selectedGemstone.color}</InventoryDetail>
                  )}
                  {selectedGemstone.clarity && (
                    <InventoryDetail label="Klarheit">{selectedGemstone.clarity}</InventoryDetail>
                  )}
                  {selectedGemstone.treatment && (
                    <InventoryDetail label="Behandlung">{selectedGemstone.treatment}</InventoryDetail>
                  )}
                  {selectedGemstone.certification && (
                    <InventoryDetail label="Zertifizierung">{selectedGemstone.certification}</InventoryDetail>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    asChild
                    className="bg-primary text-black hover:bg-primary/80"
                  >
                    <Link href={`/${locale}/shop/${selectedGemstone.id}`}>Details öffnen</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    asChild
                  >
                    <Link href={`/${locale}/shop/${selectedGemstone.id}?fullscreen=true`}>
                      Kartenansicht
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 p-12 text-center text-white/60">
              Wählen Sie rechts einen Edelstein aus, um Details anzuzeigen.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="flex items-center justify-between pb-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Bestandsliste</p>
              <p className="text-xs text-white/60">{items.length} Edelsteine gefunden</p>
            </div>
            <Button
              variant="ghost"
              className="text-xs text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setSelectedGemstone(items[0])}
              disabled={items.length === 0}
            >
              Erste Auswahl
            </Button>
          </div>

          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {items.map((gemstone) => {
              const imageSrc = gemstone.images[0] ?? PLACEHOLDER_IMAGE;
              const isSelected = selectedGemstone?.id === gemstone.id;

              return (
                <button
                  key={gemstone.id}
                  type="button"
                  onClick={() => setSelectedGemstone(gemstone)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    isSelected
                      ? 'border-primary/80 bg-primary/10 text-white shadow-lg'
                      : 'border-white/10 bg-black/40 text-white/80 hover:border-primary/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                      <Image
                        src={imageSrc}
                        alt={gemstone.name}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-white">
                          {gemstone.name}
                        </p>
                        <span className="text-xs font-medium text-primary">
                          €{gemstone.price.toLocaleString('de-DE', { minimumFractionDigits: 0 })}
                        </span>
                      </div>
                      <p className="text-xs text-white/60">
                        {gemstone.category} • Bestand {gemstone.stock}
                      </p>
                      {gemstone.origin && (
                        <p className="text-[11px] text-white/50">
                          Herkunft {gemstone.origin}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );

  const handleFilterChange = (field: keyof typeof initialFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderFilterControls = () => (
    <section className="main-container space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-white/60">Filter</p>
        <h2 className="text-3xl md:text-4xl font-impact font-weight-impact text-white">
          Bestand filtern
        </h2>
        <p className="text-sm md:text-base text-white/70 max-w-3xl">
          Verfeinern Sie die Auswahl der verfügbaren Edelsteine nach Kategorie, Herkunft, Farbe oder
          Preis. Die Filter wirken ausschließlich auf den Bestand.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <FilterSelect
          label="Edelstein (Art)"
          value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
          options={categoryOptions}
        />
        <FilterSelect
          label="Herkunft"
          value={filters.origin}
          onChange={(value) => handleFilterChange('origin', value)}
          options={originOptions}
        />
        <FilterSelect
          label="Farbe"
          value={filters.color}
          onChange={(value) => handleFilterChange('color', value)}
          options={colorOptions}
        />
        <FilterSelect
          label="Behandlung"
          value={filters.treatment}
          onChange={(value) => handleFilterChange('treatment', value)}
          options={treatmentOptions}
        />
        <FilterSelect
          label="Zertifizierung"
          value={filters.certification}
          onChange={(value) => handleFilterChange('certification', value)}
          options={certificationOptions}
        />
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-white/55">Gewicht (von - bis)</label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={filters.weightMin}
              onChange={(event) => handleFilterChange('weightMin', event.target.value)}
              placeholder="Min"
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40 focus-visible:ring-primary"
            />
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={filters.weightMax}
              onChange={(event) => handleFilterChange('weightMax', event.target.value)}
              placeholder="Max"
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40 focus-visible:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wide text-white/55">Preis (von - bis)</label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step="100"
              value={filters.priceMin}
              onChange={(event) => handleFilterChange('priceMin', event.target.value)}
              placeholder="Min"
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40 focus-visible:ring-primary"
            />
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step="100"
              value={filters.priceMax}
              onChange={(event) => handleFilterChange('priceMax', event.target.value)}
              placeholder="Max"
              className="border-white/20 bg-black/40 text-white placeholder:text-white/40 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="secondary"
          className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          onClick={() => setFilters({ ...initialFilters })}
          disabled={!hasFiltersApplied}
        >
          Filter zurücksetzen
        </Button>
      </div>
    </section>
  );

  return (
    <div className="space-y-12">
      {renderCarousel(newGemstones, 'Neue Edelsteine', 'Highlights', true)}
      {renderFilterControls()}
      {filteredRegularGemstones.length > 0 ? (
        renderCarousel(filteredRegularGemstones, 'Bestand', 'Verfügbare Edelsteine', false)
      ) : hasFiltersApplied ? (
        <section className="main-container space-y-3 text-center">
          <h2 className="text-2xl font-semibold text-white">Keine Treffer</h2>
          <p className="text-sm text-white/70">
            Passen Sie die Filter an oder setzen Sie sie zurück, um weitere Edelsteine im Bestand zu sehen.
          </p>
        </section>
      ) : (
        renderCarousel(regularGemstones, 'Bestand', 'Verfügbare Edelsteine', false)
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-wide text-white/55">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <option value="">Alle</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
