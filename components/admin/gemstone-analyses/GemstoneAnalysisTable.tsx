'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface GemstoneAnalysisListItem {
  id: string;
  imageUrl?: string | null;
  imageName?: string | null;
  primaryColor: {
    hex: string;
    description: string;
  };
  overallImpression: {
    dominantColorTone: string;
    possibleVariety: string[];
  };
  pleochroism?: string | null;
  published: boolean;
  featured: boolean;
  createdAt: string;
  createdBy?: {
    name?: string | null;
    email: string;
  } | null;
}

const statusBadgeClasses = (published: boolean) =>
  published
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';

const statusLabel = (published: boolean) =>
  published ? 'Veröffentlicht' : 'Entwurf';

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export function GemstoneAnalysisTable({
  analyses,
  locale,
}: {
  analyses: GemstoneAnalysisListItem[];
  locale: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [onlyPublished, setOnlyPublished] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return analyses.filter((analysis) => {
      if (onlyPublished && !analysis.published) return false;
      if (!needle) return true;
      return (
        analysis.imageName?.toLowerCase().includes(needle) ||
        analysis.primaryColor.description.toLowerCase().includes(needle) ||
        analysis.overallImpression.dominantColorTone.toLowerCase().includes(needle) ||
        analysis.overallImpression.possibleVariety.some(v => v.toLowerCase().includes(needle))
      );
    });
  }, [analyses, search, onlyPublished]);

  const handleDelete = async (id: string) => {
    if (!confirm('Diese Analyse wirklich löschen?')) {
      return;
    }
    startTransition(async () => {
      const response = await fetch(`/api/gemstone-analyses/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json().catch(() => null);
        alert(data?.error ?? 'Löschen fehlgeschlagen');
      }
    });
  };

  return (
    <div className="bg-gray-800/30 rounded-lg shadow-sm border">
      <div className="p-6 border-b space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Farbanalysen ({filtered.length} von {analyses.length})
            </h2>
            {isPending && (
              <p className="text-sm text-gray-400 mt-1">
                Aktualisiere Liste…
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              placeholder="Suche nach Name, Farbe oder Varietät"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#9A1A63]"
            />
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={onlyPublished}
                onChange={(e) => setOnlyPublished(e.target.checked)}
                className="rounded"
              />
              Nur veröffentlichte
            </label>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Bild
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Primärfarbe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Mögliche Varietät
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Erstellt
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800/30 divide-y divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Keine Analysen gefunden.
                </td>
              </tr>
            ) : (
              filtered.map((analysis) => (
                <tr key={analysis.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4">
                    {analysis.imageUrl ? (
                      <div className="w-16 h-16 relative rounded overflow-hidden border border-gray-600">
                        <Image
                          src={analysis.imageUrl}
                          alt={analysis.imageName || 'Gemstone'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-xs">
                        Kein Bild
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-600"
                        style={{ backgroundColor: analysis.primaryColor.hex }}
                      />
                      <div>
                        <div className="text-sm font-medium text-white">
                          {analysis.primaryColor.description}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {analysis.primaryColor.hex}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">
                      {analysis.overallImpression.possibleVariety.slice(0, 2).join(', ')}
                      {analysis.overallImpression.possibleVariety.length > 2 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadgeClasses(
                          analysis.published
                        )}`}
                      >
                        {statusLabel(analysis.published)}
                      </span>
                      {analysis.featured && (
                        <Badge className="bg-[#9A1A63] text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(analysis.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link href={`/${locale}/admin/gemstone-analyses/${analysis.id}`}>
                        <Button variant="outline" size="sm">
                          Anzeigen
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(analysis.id)}
                        disabled={isPending}
                      >
                        Löschen
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

