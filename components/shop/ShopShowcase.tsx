'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { GemstoneGrid } from '@/components/shop/GemstoneGrid';
import type { ShopGemstone } from '@/lib/services/shop/types';
import { Input } from '@/components/ui/input';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';
import navStyles from '@/components/layout/HeaderNav.module.css';
import { cn } from '@/lib/utils';

interface ShopShowcaseProps {
  gemstones: ShopGemstone[];
}

const LOAD_STEP = 15;

export function ShopShowcase({ gemstones }: ShopShowcaseProps) {
  const t = useTranslations('shop');
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
    gemstones,
    vectorMatches,
  ]);


  const filteredGemstones = useMemo(() => {
    return gemstones
      .filter((gem) => {
        // Nur Vektorsuche-Filter anwenden
        if (vectorMatchSet && !vectorMatchSet.has(gem.id)) return false;
        return true;
      })
      .sort((a, b) => {
        // Standard-Sortierung: Neuheiten zuerst
        if (a.isNew === b.isNew) {
          return (b.stock ?? 0) - (a.stock ?? 0);
        }
        return a.isNew ? -1 : 1;
      });
  }, [gemstones, vectorMatchSet]);

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

    const normalized = trimmed.toLowerCase();

    // Clientseitige Fallback-Filter für Preisangaben (z. B. "Preis von 1000 bis 5000")
    const numberMatches = normalized.match(/[\d\.]+/g);
    if (numberMatches && numberMatches.length) {
      const prices = numberMatches
        .map((n) => Number(n.replace(/\./g, '').replace(',', '.')))
        .filter((n) => Number.isFinite(n));

      if (prices.length) {
        const lower = normalized;
        let min: number;
        let max: number;

        if (prices.length > 1) {
          min = Math.min(...prices);
          max = Math.max(...prices);
        } else {
          const value = prices[0];
          if (lower.includes('>') || lower.includes('über') || lower.includes('ab') || lower.includes('mind')) {
            min = value;
            max = Number.POSITIVE_INFINITY;
          } else if (lower.includes('<') || lower.includes('unter') || lower.includes('bis')) {
            min = 0;
            max = value;
          } else {
            min = value;
            max = value;
          }
        }

        const ids = gemstones
          .filter((g) => {
            const price = Number(g.price);
            if (!Number.isFinite(price)) return false;
            return price >= min && price <= max;
          })
          .map((g) => g.id);

        setLastVectorQuery(trimmed);
        setVectorMatches(ids);
        if (ids.length > 0) {
          setVectorStatus('success');
          setVectorError(null);
        } else {
          setVectorStatus('error');
          setVectorError(t('vectorSearch.noPriceMatches'));
        }
        return;
      }
    }

    // Keyword-basierter Fallback (Name/Kategorie/Origin/Farbe + Zertifikat)
    const stopwords = ['mit', 'und', 'der', 'die', 'das', 'ein', 'eine', 'von', 'ab', 'bis', 'über', 'unter', 'mehr', 'weniger', 'preis', 'kostet', 'ohne', 'kein', 'keine'];
    const tokens = normalized
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 2 && !stopwords.includes(t));

    const requiresCert =
      normalized.includes('zert') || normalized.includes('cert') || normalized.includes('gia') || normalized.includes('igi');
    const requiresNoCert =
      normalized.includes('ohne zert') ||
      normalized.includes('ohne cert') ||
      normalized.includes('ohne certificate') ||
      normalized.includes('kein zert') ||
      normalized.includes('keine zert') ||
      normalized.includes('uncertified');
    
    const requiresWithCert =
      normalized.includes('mit zert') ||
      normalized.includes('mit cert') ||
      normalized.includes('mit certificate') ||
      normalized.includes('mit zertifikat') ||
      normalized.includes('mit zertifizierung') ||
      normalized.includes('mit certification') ||
      (normalized.includes('zertifiziert') && (normalized.includes('mit') || normalized.includes('alle'))) ||
      (normalized.includes('certified') && (normalized.includes('with') || normalized.includes('all'))) ||
      (normalized.includes('zertifikat') && normalized.includes('mit')) ||
      (normalized.includes('zertifizierung') && normalized.includes('mit'));

    const requiresWithTreatment =
      normalized.includes('mit behandlung') ||
      normalized.includes('mit treatment') ||
      (normalized.includes('behandelt') && (normalized.includes('mit') || normalized.includes('alle'))) ||
      (normalized.includes('treated') && (normalized.includes('with') || normalized.includes('all'))) ||
      (normalized.includes('behandlung') && normalized.includes('mit'));

    const requiresNoTreatment =
      normalized.includes('ohne behandlung') ||
      normalized.includes('ohne treatment') ||
      normalized.includes('kein behandlung') ||
      normalized.includes('keine behandlung') ||
      normalized.includes('unbehandelt') ||
      normalized.includes('untreated') ||
      (normalized.includes('behandelt') && normalized.includes('nicht'));

    // Spezifische Behandlungs-Anfragen sofort behandeln
    if (requiresWithTreatment) {
      const ids = gemstones
        .filter((g) => {
          const treatmentRaw: unknown = (g as { treatment?: unknown }).treatment;
          let hasTreatment = false;
          if (typeof treatmentRaw === 'string') {
            const treatmentValue = treatmentRaw.toLowerCase().trim();
            hasTreatment =
              treatmentValue.length > 0 &&
              !['none', 'untreated', 'kein', 'keine', 'keiner', 'no', 'ohne', 'unbehandelt', ''].includes(treatmentValue);
          } else if (treatmentRaw && typeof treatmentRaw === 'object') {
            hasTreatment = Boolean((treatmentRaw as { treated?: boolean }).treated);
          }
          return hasTreatment;
        })
        .map((g) => g.id);

      setLastVectorQuery(trimmed);
      setVectorMatches(ids);
      setVectorStatus(ids.length ? 'success' : 'error');
      setVectorError(ids.length ? null : t('vectorSearch.noTreatedMatches'));
      return;
    }

    if (requiresNoTreatment) {
      const ids = gemstones
        .filter((g) => {
          const treatmentRaw: unknown = (g as { treatment?: unknown }).treatment;
          let hasTreatment = false;
          if (typeof treatmentRaw === 'string') {
            const treatmentValue = treatmentRaw.toLowerCase().trim();
            hasTreatment =
              treatmentValue.length > 0 &&
              !['none', 'untreated', 'kein', 'keine', 'keiner', 'no', 'ohne', 'unbehandelt', ''].includes(treatmentValue);
          } else if (treatmentRaw && typeof treatmentRaw === 'object') {
            hasTreatment = Boolean((treatmentRaw as { treated?: boolean }).treated);
          }
          return !hasTreatment;
        })
        .map((g) => g.id);

      setLastVectorQuery(trimmed);
      setVectorMatches(ids);
      setVectorStatus(ids.length ? 'success' : 'error');
      setVectorError(ids.length ? null : t('vectorSearch.noUntreatedMatches'));
      return;
    }

    // Spezifische Zertifikats-Anfragen sofort behandeln
    if (requiresWithCert) {
      const ids = gemstones
        .filter((g) => {
          const certificationRaw: unknown = (g as { certification?: unknown }).certification;
          let hasCert = false;
          if (typeof certificationRaw === 'string') {
            const certValue = certificationRaw.toLowerCase().trim();
            hasCert =
              certValue.length > 0 &&
              !['none', 'uncertified', 'kein', 'keine', 'keiner', 'no', 'ohne', ''].includes(certValue);
          } else if (certificationRaw && typeof certificationRaw === 'object') {
            hasCert = Boolean((certificationRaw as { certified?: boolean }).certified);
          }
          return hasCert;
        })
        .map((g) => g.id);

      setLastVectorQuery(trimmed);
      setVectorMatches(ids);
      setVectorStatus(ids.length ? 'success' : 'error');
      setVectorError(ids.length ? null : t('vectorSearch.noCertifiedMatches'));
      return;
    }

    if (requiresNoCert) {
      const ids = gemstones
        .filter((g) => {
          const certificationRaw: unknown = (g as { certification?: unknown }).certification;
          let hasCert = false;
          if (typeof certificationRaw === 'string') {
            const certValue = certificationRaw.toLowerCase().trim();
            hasCert =
              certValue.length > 0 &&
              !['none', 'uncertified', 'kein', 'keine', 'keiner', 'no', 'ohne'].includes(certValue);
          } else if (certificationRaw && typeof certificationRaw === 'object') {
            hasCert = Boolean((certificationRaw as { certified?: boolean }).certified);
          }
          return !hasCert;
        })
        .map((g) => g.id);

      setLastVectorQuery(trimmed);
      setVectorMatches(ids);
      setVectorStatus(ids.length ? 'success' : 'error');
      setVectorError(ids.length ? null : t('vectorSearch.noUncertifiedMatches'));
      return;
    }

    if (tokens.length > 0) {
      const genericTokens = ['edelstein', 'edelsteine', 'gem', 'gems', 'gemstone', 'stone', 'stein'];
      
      // Synonym-Mapping für bessere Suche
      const colorSaturationSynonyms: Record<string, string[]> = {
        'pale': ['blass', 'pale', 'hell', 'light'],
        'light': ['hell', 'light', 'leicht'],
        'medium': ['mittel', 'medium', 'mäßig'],
        'intense': ['intensiv', 'intense', 'stark'],
        'vivid': ['lebhaft', 'vivid', 'kräftig', 'kraeftig'],
        'deep': ['tief', 'deep', 'dunkel'],
      };
      
      const cutSynonyms: Record<string, string[]> = {
        'brillant': ['brillant', 'brillantschliff', 'round', 'rund'],
        'princess': ['princess', 'princess-schliff'],
        'emerald': ['emerald', 'emerald-schliff', 'smaragd'],
        'oval': ['oval', 'ovaler schliff'],
        'cushion': ['cushion', 'kissen', 'kissenschliff'],
      };
      
      const ids = gemstones
        .filter((g) => {
          const certificationRaw: unknown = (g as { certification?: unknown }).certification;
          let hasCert = false;
          if (typeof certificationRaw === 'string') {
            const certValue = certificationRaw.toLowerCase().trim();
            hasCert =
              certValue.length > 0 &&
              !['none', 'uncertified', 'kein', 'keine', 'keiner', 'no', 'ohne'].includes(certValue);
          } else if (certificationRaw && typeof certificationRaw === 'object') {
            hasCert = Boolean((certificationRaw as { certified?: boolean }).certified);
          }
          if (requiresCert && !hasCert) return false;
          if (requiresNoCert && hasCert) return false;

          const treatmentRaw: unknown = (g as { treatment?: unknown }).treatment;
          let hasTreatment = false;
          if (typeof treatmentRaw === 'string') {
            const treatmentValue = treatmentRaw.toLowerCase().trim();
            hasTreatment =
              treatmentValue.length > 0 &&
              !['none', 'untreated', 'kein', 'keine', 'keiner', 'no', 'ohne', 'unbehandelt', ''].includes(treatmentValue);
          } else if (treatmentRaw && typeof treatmentRaw === 'object') {
            hasTreatment = Boolean((treatmentRaw as { treated?: boolean }).treated);
          }
          if (requiresWithTreatment && !hasTreatment) return false;
          if (requiresNoTreatment && hasTreatment) return false;
          // Alle durchsuchbaren Felder aus der GemstoneCard
          const fields = [
            g.name?.toLowerCase() ?? '',
            g.category?.toLowerCase() ?? '',
            g.origin?.toLowerCase() ?? '',
            g.color?.toLowerCase() ?? '',
            g.colorSaturation?.toLowerCase() ?? '',
            g.clarity?.toLowerCase() ?? '',
            g.cut?.toLowerCase() ?? '',
            g.cutForm?.toLowerCase() ?? '',
            g.treatment?.toLowerCase() ?? '',
            g.rarity?.toLowerCase() ?? '',
            g.description?.toLowerCase() ?? '',
            g.shortDescription?.toLowerCase() ?? '',
            g.type?.toLowerCase() ?? '',
            typeof g.certification === 'string'
              ? g.certification.toLowerCase()
              : typeof certificationRaw === 'object' &&
                certificationRaw !== null &&
                'lab' in certificationRaw &&
                typeof (certificationRaw as { lab?: unknown }).lab === 'string'
              ? ((certificationRaw as { lab?: string }).lab as string).toLowerCase()
              : '',
            // Gewicht als Text (z.B. "2.5 ct" oder "10 g")
            g.weight != null && g.weightUnit
              ? `${g.weight} ${g.weightUnit}`.toLowerCase()
              : '',
            // Abmessungen als Text
            g.dimensions?.length != null || g.dimensions?.width != null || g.dimensions?.height != null
              ? `${g.dimensions.length ?? ''}x${g.dimensions.width ?? ''}x${g.dimensions.height ?? ''}`.toLowerCase()
              : '',
          ];
          return tokens.every((token) => {
            if (['zertifikat', 'zertifiziert', 'certified', 'certificate', 'zert'].includes(token)) {
              if (requiresNoCert) return !hasCert;
              if (requiresCert) return hasCert;
              return hasCert || fields.some((f) => f.includes(token));
            }
            if (['behandlung', 'behandelt', 'treatment', 'treated'].includes(token)) {
              if (requiresNoTreatment) return !hasTreatment;
              if (requiresWithTreatment) return hasTreatment;
              return hasTreatment || fields.some((f) => f.includes(token));
            }
            if (genericTokens.includes(token)) {
              return true;
            }
            
            // Spezielle Suche für Farbsättigung mit Synonymen
            const colorSat = g.colorSaturation?.toLowerCase() ?? '';
            if (colorSat) {
              // Prüfe direktes Match (z.B. "vivid" findet "Vivid")
              if (colorSat.includes(token)) return true;
              // Prüfe Synonyme (z.B. "lebhaft" findet "Vivid")
              for (const [key, synonyms] of Object.entries(colorSaturationSynonyms)) {
                if (colorSat.includes(key) && synonyms.some(syn => syn.includes(token))) {
                  return true;
                }
                // Umgekehrte Suche: Token ist der Key, suche in Synonymen
                if (token.includes(key) || synonyms.some(syn => syn.includes(token))) {
                  if (colorSat.includes(key)) return true;
                }
              }
            }
            
            // Spezielle Suche für Schliff mit Synonymen
            if (['schliff', 'cut', 'cutform'].some(kw => normalized.includes(kw))) {
              const cut = g.cut?.toLowerCase() ?? '';
              const cutForm = g.cutForm?.toLowerCase() ?? '';
              if (cut && Object.entries(cutSynonyms).some(([key, synonyms]) => 
                cut.includes(key) && synonyms.some(syn => syn.includes(token))
              )) return true;
              if (cutForm && cutForm.includes(token)) return true;
            }
            
            // Standard-Feldsuche
            return fields.some((f) => f.includes(token));
          });
        })
        .map((g) => g.id);

      if (ids.length > 0) {
        setLastVectorQuery(trimmed);
        setVectorMatches(ids);
        setVectorStatus('success');
        setVectorError(null);
        return;
      }
    }

    // Fallback: echte Vektorsuche
    try {
      const response = await fetch(
        `/api/shop/vector-search?q=${encodeURIComponent(trimmed)}&locale=${locale}`
      );
      if (!response.ok) {
        throw new Error(t('vectorSearch.error'));
      }
      const data = await response.json();
      const ids: string[] = Array.isArray(data.results)
        ? data.results.map((result: { id: string }) => result.id)
        : [];

      setLastVectorQuery(trimmed);
      setVectorMatches(ids);
      setVectorStatus(ids.length ? 'success' : 'error');
      setVectorError(ids.length ? null : t('vectorSearch.noMatches'));
    } catch (error) {
      console.error(error);
      setVectorStatus('error');
      setVectorError(
        error instanceof Error
          ? error.message
          : t('vectorSearch.unknownError')
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
                <span className="gemilike-text-gradient">{t('title')}</span>
              </h1>
              <p className="mx-auto max-w-3xl text-sm md:text-base text-white/80">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </section>
      </ScrollAnimated>

      <ScrollAnimated direction="up" delay={100}>
        <section className="main-container">
          <div className="story-card space-y-8">
            <div className="flex flex-col gap-6 rounded-2xl border border-white/20 bg-gray-900/70/80 p-6 backdrop-blur">
            <div className="flex flex-col gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-white">{t('vectorSearch.title')}</h2>
                <p className="text-sm text-white/60">
                  {t('vectorSearch.description')}
                </p>
              </div>

              <form
                onSubmit={handleVectorSearch}
                className="space-y-3 rounded-2xl border border-white/15 bg-gray-900/40 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-end">
                  <div className="flex-1">
                    <label className="text-xs uppercase tracking-wide text-white/55">
                      {t('vectorSearch.label')}
                    </label>
                    <Input
                      placeholder={t('vectorSearch.placeholder')}
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
                        {vectorSearching ? t('vectorSearch.searching') : t('vectorSearch.button')}
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
                        {t('vectorSearch.reset')}
                      </button>
                    )}
                  </div>
                </div>
                {vectorActive ? (
                  <p className="text-xs text-emerald-200">
                    {t('vectorSearch.matches', { count: vectorMatches?.length ?? 0, query: lastVectorQuery })}
                  </p>
                ) : (
                  <p className="text-xs text-white/55">
                    {t('vectorSearch.hint')}
                  </p>
                )}
                {vectorError && (
                  <p className="text-xs text-red-300">{vectorError}</p>
                )}
              </form>
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
                    ? t('showingCount', { shown: shownCount, total: filteredGemstones.length })
                    : t('showingAll', { total: filteredGemstones.length })}
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
                    <span className={navStyles.navLabel}>{t('loadMore')}</span>
                    <span className={navStyles.navGlow} />
                  </button>
                )}
              </div>
            </ScrollAnimated>
          </>
        ) : (
          <ScrollAnimated direction="fade">
            <div className="rounded-3xl border border-white/10 bg-gray-900/60 p-10 text-center text-white/70">
              {t('noResults')}
            </div>
          </ScrollAnimated>
        )}
        </section>
      </ScrollAnimated>
    </div>
  );
}
