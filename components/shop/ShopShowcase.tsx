'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  sortBy: 'price-asc',
};

export function ShopShowcase({ gemstones, fallback = false }: ShopShowcaseProps) {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'de';

  const [filters, setFilters] = useState(initialFilters);

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

  const sortedRegularGemstones = useMemo(() => {
    const base = hasFiltersApplied ? filteredRegularGemstones : regularGemstones.length ? regularGemstones : newGemstones;

    const sorter = (a: ShopGemstone, b: ShopGemstone) => {
      switch (filters.sortBy) {
        case 'price-desc':
          return b.price - a.price;
        case 'weight-asc': {
          const weightA = typeof a.weight === 'number' ? a.weight : Number.MAX_SAFE_INTEGER;
          const weightB = typeof b.weight === 'number' ? b.weight : Number.MAX_SAFE_INTEGER;
          return weightA - weightB;
        }
        case 'weight-desc': {
          const weightA = typeof a.weight === 'number' ? a.weight : Number.MIN_SAFE_INTEGER;
          const weightB = typeof b.weight === 'number' ? b.weight : Number.MIN_SAFE_INTEGER;
          return weightB - weightA;
        }
        case 'name-asc':
          return a.name.localeCompare(b.name, 'de');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'de');
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'price-asc':
        default:
          return a.price - b.price;
      }
    };

    return [...base].sort(sorter);
  }, [filteredRegularGemstones, regularGemstones, newGemstones, filters.sortBy, hasFiltersApplied]);

  const inventoryGemstones = useMemo(() => {
    if (sortedRegularGemstones.length > 0) {
      return sortedRegularGemstones;
    }
    if (hasFiltersApplied) {
      return [];
    }
    return sortedRegularGemstones;
  }, [sortedRegularGemstones, hasFiltersApplied]);

  const handleFilterChange = (field: keyof typeof initialFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderFilterControls = () => (
    <section className="main-container space-y-6 max-w-6xl !mx-auto !my-[50px] !px-[50px] !py-[40px]">
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

      <div className="space-y-6">
        <div className="grid gap-5 grid-cols-4 min-w-0">
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
        </div>

        <div className="grid gap-5 grid-cols-4 min-w-0">
          <FilterSelect
            label="Zertifizierung"
            value={filters.certification}
            onChange={(value) => handleFilterChange('certification', value)}
            options={certificationOptions}
          />
          <div className="space-y-2 min-w-0">
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
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40 focus-visible:ring-primary"
                style={{ width: 'calc(100% - 25px)' }}
              />
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={filters.weightMax}
                onChange={(event) => handleFilterChange('weightMax', event.target.value)}
                placeholder="Max"
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40 focus-visible:ring-primary"
                style={{ width: 'calc(100% - 25px)' }}
              />
            </div>
          </div>
          <div className="space-y-2 min-w-0">
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
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40 focus-visible:ring-primary"
                style={{ width: 'calc(100% - 25px)' }}
              />
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                step="100"
                value={filters.priceMax}
                onChange={(event) => handleFilterChange('priceMax', event.target.value)}
                placeholder="Max"
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40 focus-visible:ring-primary"
                style={{ width: 'calc(100% - 25px)' }}
              />
            </div>
          </div>
          <div className="space-y-2 min-w-0">
            <label className="text-xs uppercase tracking-wide text-white/55">Sortierung</label>
            <select
              value={filters.sortBy}
              onChange={(event) => handleFilterChange('sortBy', event.target.value)}
              className="w-full rounded-lg border border-white/20 bg-gray-800/50/40 px-3 py-2 text-sm text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{ width: 'calc(100% - 25px)' }}
            >
              <option value="price-asc">Preis (aufsteigend)</option>
              <option value="price-desc">Preis (absteigend)</option>
              <option value="weight-asc">Gewicht (aufsteigend)</option>
              <option value="weight-desc">Gewicht (absteigend)</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="newest">Neueste zuerst</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant="secondary"
          className="border-white/20 bg-gray-800/30/5 text-white hover:bg-gray-800/30/10"
          onClick={() => setFilters({ ...initialFilters })}
          disabled={!hasFiltersApplied}
        >
          Filter zurücksetzen
        </Button>
      </div>
    </section>
  );


  const renderInventoryGrid = (items: ShopGemstone[]) => (
    <section className="main-container space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-white/60">Verfügbare Edelsteine</p>
        <h2 className="text-3xl md:text-4xl font-impact font-weight-impact text-white">Bestand</h2>
        {fallback && (
          <p className="text-xs text-white/50">
            Hinweis: Temporäre Beispiel-Daten, da aktuell keine Datenbankverbindung möglich war.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-[50px]">
        {items.map((gemstone) => (
          <GemCard key={gemstone.id} gemstone={gemstone} locale={locale} showNewBadge variant="grid" />
        ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-12">
      {renderFilterControls()}
      {inventoryGemstones.length > 0 ? (
        renderInventoryGrid(inventoryGemstones)
      ) : hasFiltersApplied ? (
        <section className="main-container space-y-3 text-center">
          <h2 className="text-2xl font-semibold text-white">Keine Treffer</h2>
          <p className="text-sm text-white/70">
            Passen Sie die Filter an oder setzen Sie sie zurück, um weitere Edelsteine im Bestand zu sehen.
          </p>
        </section>
      ) : null}
    </div>
  );
}

function GemCard({
  gemstone,
  locale,
  showNewBadge = false,
  variant = 'grid',
}: {
  gemstone: ShopGemstone;
  locale: string;
  showNewBadge?: boolean;
  variant?: 'grid' | 'carousel';
}) {
  const detailHref = `/${locale}/shop/${gemstone.id}`;
  const imageSrc = gemstone.images[0] ?? PLACEHOLDER_IMAGE;
  const wrapperClass =
    variant === 'carousel'
      ? 'group min-w-[240px] max-w-[240px] snap-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary'
      : 'group block w-[240px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary';
  const imageSizes = '240px';

  return (
    <Link
      href={detailHref}
      prefetch={true}
      className={wrapperClass}
      aria-label={`${gemstone.name} Details anzeigen`}
    >
      <article className="story-card bg-[#2D2D2D]/90 border border-white/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="overflow-hidden rounded-lg mb-4">
          <div className="aspect-[4/3] relative bg-gray-800/50/30">
            <Image
              src={imageSrc}
              alt={gemstone.name}
              fill
              sizes={imageSizes}
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
    <div className="space-y-2 min-w-0">
      <label className="text-xs uppercase tracking-wide text-white/55">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-white/20 bg-gray-800/50/40 px-3 py-2 text-sm text-white shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        style={{ width: 'calc(100% - 25px)' }}
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
