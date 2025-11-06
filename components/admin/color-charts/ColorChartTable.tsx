'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GradientBar } from '@/components/color-charts/GradientBar';

interface ColorChartListItem {
  id: string;
  name: string;
  origin?: string | null;
  published: boolean;
  featured: boolean;
  gradient: string[];
  gia?: {
    hue?: string;
    tone?: string;
    sat?: string;
  };
  updatedAt: string;
  createdAt: string;
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
  return new Intl.DateTimeFormat('de-DE').format(date);
};

export function ColorChartTable({
  charts,
  locale,
}: {
  charts: ColorChartListItem[];
  locale: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [onlyPublished, setOnlyPublished] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return charts.filter((chart) => {
      if (onlyPublished && !chart.published) return false;
      if (!needle) return true;
      return (
        chart.name.toLowerCase().includes(needle) ||
        (chart.origin && chart.origin.toLowerCase().includes(needle))
      );
    });
  }, [charts, search, onlyPublished]);

  const handleDelete = async (id: string) => {
    if (!confirm('Diese Farbtafel wirklich löschen?')) {
      return;
    }
    startTransition(async () => {
      const response = await fetch(`/api/color-charts/${id}`, {
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
              Farbtafeln ({filtered.length} von {charts.length})
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
              placeholder="Suche nach Name oder Herkunft"
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Farbverlauf
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Aktualisiert
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800/30 divide-y divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Keine Farbtafeln gefunden.
                </td>
              </tr>
            ) : (
              filtered.map((chart) => (
                <tr key={chart.id} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {chart.name}
                        </div>
                        {chart.origin && (
                          <div className="text-sm text-gray-400">
                            {chart.origin}
                          </div>
                        )}
                        {chart.featured && (
                          <Badge className="mt-1 bg-[#9A1A63]">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <GradientBar colors={chart.gradient} height={30} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${statusBadgeClasses(
                        chart.published
                      )}`}
                    >
                      {statusLabel(chart.published)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(chart.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link href={`/${locale}/admin/color-charts/edit/${chart.id}`}>
                        <Button variant="outline" size="sm">
                          Bearbeiten
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(chart.id)}
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

