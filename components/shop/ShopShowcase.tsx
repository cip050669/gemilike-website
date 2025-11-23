'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { GemstoneGrid } from '@/components/shop/GemstoneGrid';
import type { ShopGemstone } from '@/lib/services/shop/types';
import { Input } from '@/components/ui/input';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';
import navStyles from '@/components/layout/HeaderNav.module.css';
import { cn } from '@/lib/utils';

interface ShopShowcaseProps {
  gemstones: ShopGemstone[];
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'weight-asc' | 'weight-desc';

const LOAD_STEP = 15;

export function ShopShowcase({ gemstones }: ShopShowcaseProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('alle');
  const [origin, setOrigin] = useState<string>('alle');
  const [color, setColor] = useState<string>('alle');
  const [clarity, setClarity] = useState<string>('alle');
  const [treatment, setTreatment] = useState<string>('alle');
  const [certification, setCertification] = useState<string>('alle');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [hideSold, setHideSold] = useState(true);
  const [visibleCount, setVisibleCount] = useState(LOAD_STEP);
  const [vectorQuery, setVectorQuery] = useState('');
  const [vectorMatches, setVectorMatches] = useState<string[] | null>(null);
  const [vectorStatus, setVectorStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [vectorError, setVectorError] = useState<string | null>(null);
  const [lastVectorQuery, setLastVectorQuery] = useState('');
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? 'de';
  const searchParams = useSearchParams();
  const vectorMatchSet = useMemo(
    () => (vectorMatches ? new Set(vectorMatches) : null),
    [vectorMatches]
  );
  const vectorActive = vectorMatchSet !== null && lastVectorQuery.trim().length > 0;
  const vectorSearching = vectorStatus === 'loading';

  useEffect(() => {
    setVisibleCount(LOAD_STEP);
  }, [
    search,
    category,
    origin,
    color,
    clarity,
    treatment,
    certification,
    sortBy,
    hideSold,
    gemstones,
    vectorMatches,
  ]);

  const categoryOptions = useMemo(() => {
    const options = new Set<string>();
    gemstones.forEach((gem) => {
      if (gem.category) options.add(gem.category);
    });
    return Array.from(options).sort((a, b) => a.localeCompare(b, locale));
  }, [gemstones, locale]);

  const originOptions = useMemo(() => {
    const options = new Set<string>();
    gemstones.forEach((gem) => {
      if (gem.origin) options.add(gem.origin);
    });
    return Array.from(options).sort((a, b) => a.localeCompare(b, locale));
  }, [gemstones, locale]);

  const colorOptions = useMemo(() => {
    const options = new Set<string>();
    gemstones.forEach((gem) => {
      if (gem.color) options.add(gem.color);
    });
    return Array.from(options).sort((a, b) => a.localeCompare(b, locale));
  }, [gemstones, locale]);

  const clarityOptions = useMemo(() => {
    const options = new Set<string>();
    gemstones.forEach((gem) => {
      if (gem.clarity) options.add(gem.clarity);
    });
    return Array.from(options).sort((a, b) => a.localeCompare(b, locale));
  }, [gemstones, locale]);

  const treatmentOptions = useMemo(() => {
    const options = new Set<string>();
    gemstones.forEach((gem) => {
      if (gem.treatment) options.add(gem.treatment);
    });
    const sorted = Array.from(options).sort((a, b) => a.localeCompare(b, locale));
    // Move "Keine Behandlung" to the beginning if it exists
    const keineBehandlungIndex = sorted.findIndex(opt => 
      opt.toLowerCase().includes('keine') || opt.toLowerCase().includes('none') || opt.toLowerCase().includes('ohne')
    );
    if (keineBehandlungIndex > 0) {
      const keineBehandlung = sorted.splice(keineBehandlungIndex, 1)[0];
      return [keineBehandlung, ...sorted];
    }
    return sorted;
  }, [gemstones, locale]);

  const certificationOptions = useMemo(() => {
    const options = new Set<string>();
    gemstones.forEach((gem) => {
      if (gem.certification) options.add(gem.certification);
    });
    return Array.from(options).sort((a, b) => a.localeCompare(b, locale));
  }, [gemstones, locale]);

  const filteredGemstones = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return gemstones
      .filter((gem) => {
        if (hideSold && gem.isSold) return false;
        if (category !== 'alle' && gem.category !== category) return false;
        if (origin !== 'alle' && gem.origin !== origin) return false;
        if (color !== 'alle' && gem.color !== color) return false;
        if (clarity !== 'alle' && gem.clarity !== clarity) return false;
        if (treatment !== 'alle' && gem.treatment !== treatment) return false;
        if (certification !== 'alle') {
          if (certification === 'keine') {
            // Filter for gems without certification
            if (gem.certification) return false;
          } else {
            // Filter for specific certification
            if (gem.certification !== certification) return false;
          }
        }
        if (vectorMatchSet && !vectorMatchSet.has(gem.id)) return false;
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
  }, [gemstones, hideSold, category, origin, color, clarity, treatment, certification, sortBy, search, vectorMatchSet]);

  useEffect(() => {
    if (!searchParams) {
      return;
    }
    const gemId = searchParams.get('gem');
    if (!gemId) {
      return;
    }
    const index = filteredGemstones.findIndex((gem) => gem.id === gemId);
    if (index === -1) {
      return;
    }
    setVisibleCount((current) => {
      if (index < current) {
        return current;
      }
      const required = Math.ceil((index + 1) / LOAD_STEP) * LOAD_STEP;
      return Math.max(current, required);
    });
  }, [filteredGemstones, searchParams]);

  const visibleGemstones = useMemo(
    () => filteredGemstones.slice(0, visibleCount),
    [filteredGemstones, visibleCount]
  );
  const hasMore = visibleCount < filteredGemstones.length;
  const shownCount = visibleGemstones.length;

  const handleVectorReset = () => {
    setVectorMatches(null);
    setVectorError(null);
    setVectorStatus('idle');
    setVectorQuery('');
    setLastVectorQuery('');
  };

  const handleVectorSearch = async (event: FormEvent<HTMLFormElement>) => {
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
        `/api/shop/vector-search?q=${encodeURIComponent(trimmed)}&locale=${locale}`
      );
      if (!response.ok) {
        throw new Error('Die Vektorsuche konnte nicht ausgeführt werden.');
      }
      const data = await response.json();
      const ids: string[] = Array.isArray(data.results)
        ? data.results.map((result: { id: string }) => result.id)
        : [];
      setVectorMatches(ids);
      setLastVectorQuery(trimmed);
      setVectorStatus('success');
      setVectorError(ids.length ? null : 'Keine Edelsteine entsprechen dieser Beschreibung.');
    } catch (error) {
      console.error(error);
      setVectorStatus('error');
      setVectorError(
        error instanceof Error
          ? error.message
          : 'Unbekannter Fehler bei der Vektorsuche. Bitte versuche es erneut.'
      );
    }
  };

  return (
    <div className="space-y-16">
      <ScrollAnimated direction="fade" delay={0}>
        <section className="main-container">
          <div className="story-card space-y-4 p-6 md:p-8">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                <span className="gemilike-text-gradient">Unsere Auswahl an Edelsteinen</span>
              </h1>
              <p className="mx-auto max-w-3xl text-sm md:text-base text-white/80">
                Entdecken Sie neue Funde, einzigartige Einzelstücke und zertifizierte Qualitäten. Jede
                Kachel zeigt Gewicht, Herkunft, Preis und Status auf einen Blick.
              </p>
            </div>
          </div>
        </section>
      </ScrollAnimated>

      <ScrollAnimated direction="up" delay={100}>
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
              <div className="flex items-center gap-5">
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory('alle');
                    setOrigin('alle');
                    setColor('alle');
                    setClarity('alle');
                    setTreatment('alle');
                    setCertification('alle');
                    setSortBy('newest');
                    setHideSold(true);
                    handleVectorReset();
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
                <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-white/55" style={{ marginLeft: '20px' }}>
                  <input
                    type="checkbox"
                    checked={hideSold}
                    onChange={(event) => setHideSold(event.target.checked)}
                    className="h-4 w-4 rounded border border-white/30 bg-gray-900 text-primary focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  Verkauft-Status ausblenden
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <form
              onSubmit={handleVectorSearch}
              className="space-y-3 rounded-2xl border border-white/15 bg-gray-900/40 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1">
                  <label className="text-xs uppercase tracking-wide text-white/55">
                    Semantische Vektorsuche
                  </label>
                  <Input
                    placeholder="Beschreibe Farbe, Herkunft, Zertifikat …"
                    value={vectorQuery}
                    onChange={(event) => setVectorQuery(event.target.value)}
                    className="border-white/20 bg-gray-900/60 text-white placeholder:text-white/35 focus-visible:ring-primary"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={vectorSearching}
                    className={cn(
                      navStyles.navButton,
                      navStyles.navButtonTight,
                      'px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60'
                    )}
                  >
                    <span className={navStyles.navLabel}>
                      {vectorSearching ? 'Suche …' : 'Vektor-Suche'}
                    </span>
                    <span className={navStyles.navGlow} />
                  </button>
                  {vectorActive && (
                    <button
                      type="button"
                      onClick={handleVectorReset}
                      disabled={vectorSearching}
                      className="rounded-lg border border-white/30 px-4 py-2 text-sm text-white transition hover:border-white/60 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Zurücksetzen
                    </button>
                  )}
                </div>
              </div>
              {vectorActive ? (
                <p className="text-xs text-emerald-200">
                  {vectorMatches?.length ?? 0} semantische Treffer für „{lastVectorQuery}“ – alle
                  anderen Edelsteine werden ausgeblendet.
                </p>
              ) : (
                <p className="text-xs text-white/55">
                  Beschreibe natürliche Sprache, z. B. „intensiv grüner Smaragd aus Kolumbien“, um
                  ähnliche Stücke zu finden.
                </p>
              )}
              {vectorError && (
                <p className="text-xs text-red-300">{vectorError}</p>
              )}
            </form>

            <div className="space-y-2 max-w-[33.333%]">
              <label className="text-xs uppercase tracking-wide text-white/55">Suche</label>
              <Input
                placeholder="Name, Art, Herkunft …"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="border-white/20 bg-gray-800/60 text-white placeholder:text-white/35 focus-visible:ring-primary"
              />
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="space-y-2 max-w-[33.333%]">
                <label className="text-xs uppercase tracking-wide text-white/55">Edelsteinart</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-gray-800/60 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="alle">Alle Edelsteinarten</option>
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 max-w-[33.333%]">
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
              <div className="space-y-2 max-w-[33.333%]">
                <label className="text-xs uppercase tracking-wide text-white/55">Farbe</label>
                <select
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-gray-800/60 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="alle">Alle Farben</option>
                  {colorOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 max-w-[33.333%]">
                <label className="text-xs uppercase tracking-wide text-white/55">Klarheit</label>
                <select
                  value={clarity}
                  onChange={(event) => setClarity(event.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-gray-800/60 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="alle">Alle Klarheiten</option>
                  {clarityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 max-w-[33.333%]">
                <label className="text-xs uppercase tracking-wide text-white/55">Behandlung</label>
                <select
                  value={treatment}
                  onChange={(event) => setTreatment(event.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-gray-800/60 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="alle">Alle Behandlungen</option>
                  {treatmentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 max-w-[33.333%]">
                <label className="text-xs uppercase tracking-wide text-white/55">Zertifizierung</label>
                <select
                  value={certification}
                  onChange={(event) => setCertification(event.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-gray-800/60 px-3 py-2 text-sm text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="alle">Alle Zertifizierungen</option>
                  <option value="keine">Keine Zertifizierungen</option>
                  {certificationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2 max-w-[33.333%]">
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
        </div>

        {filteredGemstones.length > 0 ? (
          <>
            <ScrollAnimated direction="up" delay={200}>
              <GemstoneGrid gemstones={visibleGemstones} />
            </ScrollAnimated>
            <ScrollAnimated direction="fade" delay={300}>
              <div className="mt-10 flex flex-col items-center gap-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                  {hasMore
                    ? `Zeigt ${shownCount} von ${filteredGemstones.length} Edelsteinen`
                    : `Alle ${filteredGemstones.length} Edelsteine werden angezeigt`}
                </p>
                {hasMore && (
                  <button
                    type="button"
                    className={cn(
                      navStyles.navButton,
                      navStyles.navButtonTight,
                      'px-6 py-2 text-sm'
                    )}
                    onClick={() =>
                      setVisibleCount((count) =>
                        Math.min(count + LOAD_STEP, filteredGemstones.length)
                      )
                    }
                  >
                    <span className={navStyles.navLabel}>Weitere Edelsteine laden</span>
                    <span className={navStyles.navGlow} />
                  </button>
                )}
              </div>
            </ScrollAnimated>
          </>
        ) : (
          <ScrollAnimated direction="fade">
            <div className="rounded-3xl border border-white/10 bg-gray-900/60 p-10 text-center text-white/70">
              Keine Edelsteine gefunden. Passen Sie die Filter oder die Suche an.
            </div>
          </ScrollAnimated>
        )}
        </section>
      </ScrollAnimated>
    </div>
  );
}
