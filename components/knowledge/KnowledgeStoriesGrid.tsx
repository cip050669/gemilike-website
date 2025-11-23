'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import navStyles from '@/components/layout/HeaderNav.module.css';
import { cn } from '@/lib/utils';
import { KNOWLEDGE_PLACEHOLDER_IMAGE } from '@/lib/constants/knowledge';
import type { KnowledgeVectorSearchResult } from '@/lib/services/knowledge.service';

export interface KnowledgeStoryCard {
  id: string;
  slug: string;
  title: string;
  href: string;
  image: string;
  excerpt: string;
  similarity?: number;
}

interface KnowledgeStoriesGridProps {
  locale: string;
  initialStories: KnowledgeStoryCard[];
}

export function KnowledgeStoriesGrid({ locale, initialStories }: KnowledgeStoriesGridProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KnowledgeStoryCard[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState('');

  const activeStories = useMemo(() => {
    if (results === null) return initialStories;
    return results;
  }, [initialStories, results]);

  const showEmptyState = !loading && activeStories.length === 0;
  const hasInitialContent = initialStories.length > 0;

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setResults(null);
      setLastQuery('');
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setLastQuery(trimmed);

    try {
      const response = await fetch(
        `/api/knowledge-base/vector-search?q=${encodeURIComponent(trimmed)}&locale=${locale}`
      );

      if (!response.ok) {
        throw new Error('Die Vektorsuche konnte nicht ausgeführt werden.');
      }

      const data = await response.json();
      const mapped: KnowledgeStoryCard[] = (data.results || []).map((result: KnowledgeVectorSearchResult) => ({
        id: result.id,
        slug: result.slug,
        title: result.title,
        excerpt: result.excerpt,
        image: result.image || KNOWLEDGE_PLACEHOLDER_IMAGE,
        href: `/${locale}/wissenswertes/${result.slug}`,
        similarity: result.similarity,
      }));

      setResults(mapped);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unbekannter Fehler bei der Vektorsuche. Bitte versuche es erneut.'
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setQuery('');
    setResults(null);
    setError(null);
    setLastQuery('');
  };

  const renderRelevanceBadge = (similarity?: number) => {
    if (typeof similarity !== 'number') return null;
    const percent = Math.max(1, Math.min(99, Math.round(similarity * 100)));
    return (
      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
        {percent}% Relevanz
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur"
      >
        <label htmlFor="knowledge-search" className="text-sm uppercase tracking-[0.3em] text-white/60">
          Semantische Vektorsuche
        </label>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            id="knowledge-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Suche nach Fragen, Themen oder Edelsteinen ..."
            className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-base text-white placeholder:text-white/50 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/25"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className={cn(
                navStyles.navButton,
                navStyles.navButtonTight,
                'inline-flex min-w-[140px] justify-center'
              )}
            >
              <span className={navStyles.navLabel}>
                {loading ? 'Suche …' : 'Vektor-Suche'}
              </span>
              <span className={navStyles.navGlow} />
            </button>
            {query && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
              >
                Zurücksetzen
              </button>
            )}
          </div>
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">
          Ergebnisse nach semantischer Ähnlichkeit sortiert
        </p>
      </form>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {lastQuery && results !== null && (
        <div className="text-sm text-white/60">
          {results.length > 0 ? (
            <>
              <strong className="text-white">{results.length}</strong> Treffer für „{lastQuery}“
            </>
          ) : (
            <>Keine Treffer für „{lastQuery}“ gefunden.</>
          )}
        </div>
      )}

      {showEmptyState ? (
        <div className="story-card text-center">
          <h3 className="mb-4 text-2xl font-bold gemilike-text-gradient">
            {results === null && !hasInitialContent
              ? 'Noch keine Artikel veröffentlicht'
              : 'Keine passenden Artikel gefunden'}
          </h3>
          <p className="text-base leading-relaxed text-gray-300">
            {results === null && !hasInitialContent
              ? 'Sobald Wissenswert-Artikel veröffentlicht sind, erscheinen sie hier.'
              : 'Probiere andere Suchbegriffe oder verfeinere deine Frage.'}
          </p>
        </div>
      ) : (
        <div className="max-h-[620px] overflow-y-auto pr-3 scrollbar-thin">
          <div className="grid grid-cols-1 gap-[75px] md:grid-cols-2 lg:grid-cols-3">
            {activeStories.map((story) => (
              <div
                key={story.id}
                className="story-card group transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-[50px]">
                  <div className="relative flex h-[240px] w-[240px] flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-gray-900/30 public-page-bg/20">
                    <NextImage
                      src={story.image || KNOWLEDGE_PLACEHOLDER_IMAGE}
                      alt={story.title}
                      width={240}
                      height={240}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      sizes="(max-width: 768px) 240px, 240px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-6">
                    <div className="flex w-full items-center gap-6">
                      <div className="flex flex-1 flex-col gap-3 text-left">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-xl font-bold gemilike-text-gradient">{story.title}</h3>
                          {renderRelevanceBadge(story.similarity)}
                        </div>
                        <p className="text-sm leading-relaxed text-gray-300 line-clamp-4">
                          {story.excerpt}
                        </p>
                      </div>
                      <Link
                        href={story.href}
                        className={cn(
                          navStyles.navButton,
                          navStyles.navButtonTight,
                          'ml-auto inline-flex items-center gap-3'
                        )}
                      >
                        <span className={navStyles.navLabel}>Mehr lesen</span>
                        <svg
                          className="relative z-[1] h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        <span className={navStyles.navGlow} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
