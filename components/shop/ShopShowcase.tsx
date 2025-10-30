'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShopGemstone, GemstoneGrid } from '@/components/shop/GemstoneGrid';
import { Input } from '@/components/ui/input';
import navStyles from '@/components/layout/HeaderNav.module.css';
import { cn } from '@/lib/utils';

interface ShopShowcaseProps {
  gemstones: ShopGemstone[];
  fallback?: boolean;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'weight-asc' | 'weight-desc';

export function ShopShowcase({ gemstones, fallback = false }: ShopShowcaseProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('alle');
  const [origin, setOrigin] = useState<string>('alle');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [hideSold, setHideSold] = useState(true);
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'de';

  const categoryOptions = useMemo(() => {
    const options = new Set<string>();
    gemstones.forEach((gem) => {
      if (gem.category) options.add(gem.category);
    });
    return Array.from(options).sort((a, b) => a.localeCompare(b, 'de'));
  }, [gemstones]);

  const originOptions = useMemo(() => {
    const options = new Set<string>();
    gemstones.forEach((gem) => {
      if (gem.origin) options.add(gem.origin);
    });
    return Array.from(options).sort((a, b) => a.localeCompare(b, 'de'));
  }, [gemstones]);

  const filteredGemstones = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return gemstones
      .filter((gem) => {
        if (hideSold && gem.isSold) return false;
        if (category !== 'alle' && gem.category !== category) return false;
        if (origin !== 'alle' && gem.origin !== origin) return false;
        if (normalizedSearch.length) {
          const haystack = [
            gem.name,
            gem.category,
            gem.origin ?? '',
            gem.description ?? '',
          ]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(normalizedSearch)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'weight-asc': {
            const weightA = typeof a.weight === 'number' ? a.weight : Number.POSITIVE_INFINITY;
            const weightB = typeof b.weight === 'number' ? b.weight : Number.POSITIVE_INFINITY;
            return weightA - weightB;
          }
          case 'weight-desc': {
            const weightA = typeof a.weight === 'number' ? a.weight : Number.NEGATIVE_INFINITY;
            const weightB = typeof b.weight === 'number' ? b.weight : Number.NEGATIVE_INFINITY;
            return weightB - weightA;
          }
          case 'newest':
          default:
            if (a.isNew === b.isNew) {
              return (b.stock ?? 0) - (a.stock ?? 0);
            }
            return a.isNew ? -1 : 1;
        }
      });
  }, [gemstones, hideSold, category, origin, sortBy, search]);

  return (
    <div className="space-y-16">
      <section className="main-container">
        <div className="story-card space-y-4 p-6 md:p-8">
          <div className="flex flex-col items-center gap-3 text-center md:flex-row md:items-start md:justify-between md:text-left">
            <span className="text-xs uppercase tracking-[0.4em] text-white/50">
              Edelstein-Shop
            </span>
            <Link
              href={`/${locale}`}
              className={cn(
                navStyles.navButton,
                navStyles.navButtonTight,
                'px-4 py-2 text-sm'
              )}
            >
              <span className={navStyles.navLabel}>Zurück zur Startseite</span>
              <span className={navStyles.navGlow} />
            </Link>
          </div>
          <div className="space-y-4 text-center">
            <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
              <span className="gemilike-text-gradient">Unsere Auswahl an Edelsteinen</span>
            </h1>
            <p className="mx-auto max-w-3xl text-sm md:text-base text-white/80">
              Entdecken Sie neue Funde, einzigartige Einzelstücke und zertifizierte Qualitäten. Jede
              Kachel zeigt Gewicht, Herkunft, Preis und Status auf einen Blick.
            </p>
            {fallback && (
              <p className="mx-auto inline-block rounded-md border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-100">
                Hinweis: Temporäre Beispiel-Daten, da aktuell keine Datenbankverbindung möglich war.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="main-container">
        <div className="story-card space-y-8">
          <div className="flex flex-col gap-6 rounded-2xl border border-white/20 bg-gray-900/70/80 p-6 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-white">Bestand filtern</h2>
                <p className="text-sm text-white/60">
                  Verfeinern Sie die Auswahl nach Kategorie, Herkunft oder Stichwort. Mit einem Klick
                  blenden Sie verkaufte Exemplare aus.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('alle');
                  setOrigin('alle');
                  setSortBy('newest');
                  setHideSold(true);
                }}
                className={cn(
                  navStyles.navButton,
                  navStyles.navButtonTight,
                  'self-start text-sm px-4 py-2'
                )}
              >
                <span className={navStyles.navLabel}>Filter zurücksetzen</span>
                <span className={navStyles.navGlow} />
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-white/55">Suche</label>
              <Input
                placeholder="Name, Art, Herkunft …"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="border-white/20 bg-gray-800/60 text-white placeholder:text-white/35 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-white/55">Kategorie</label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-gray-800/60 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="alle">Alle Kategorien</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-white/55">Herkunft</label>
              <select
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
                className="w-full rounded-lg border border-white/20 bg-gray-800/60 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="alle">Alle Herkunftsangaben</option>
                {originOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-white/55">Sortierung</label>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="w-full rounded-lg border border-white/20 bg-gray-800/60 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="newest">Neuheiten zuerst</option>
                <option value="price-asc">Preis (aufsteigend)</option>
                <option value="price-desc">Preis (absteigend)</option>
                <option value="weight-asc">Gewicht (aufsteigend)</option>
                <option value="weight-desc">Gewicht (absteigend)</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/55">
            <input
              type="checkbox"
              checked={hideSold}
              onChange={(event) => setHideSold(event.target.checked)}
              className="h-4 w-4 rounded border border-white/30 bg-gray-900 text-primary focus-visible:ring-2 focus-visible:ring-primary"
            />
            Verkauft-Status ausblenden
          </label>
        </div>

        {filteredGemstones.length > 0 ? (
          <GemstoneGrid gemstones={filteredGemstones} fallback={fallback} />
        ) : (
          <div className="rounded-3xl border border-white/10 bg-gray-900/60 p-10 text-center text-white/70">
            Keine Edelsteine gefunden. Passen Sie die Filter oder die Suche an.
          </div>
        )}
      </section>
    </div>
  );
}
