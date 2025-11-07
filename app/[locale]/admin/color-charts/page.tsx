import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ColorChartTable } from '@/components/admin/color-charts/ColorChartTable';
import { BulkImportDialog } from '@/components/admin/color-charts/BulkImportDialog';
import { Button } from '@/components/ui/button';
import { ColorChart } from '@prisma/client';

const toListItem = (chart: ColorChart) => ({
  id: chart.id,
  name: chart.name,
  origin: chart.origin,
  published: chart.published,
  featured: chart.featured,
  gradient: chart.gradient,
  gia: chart.gia as { hue?: string; tone?: string; sat?: string },
  updatedAt:
    chart.updatedAt instanceof Date
      ? chart.updatedAt.toISOString()
      : String(chart.updatedAt),
  createdAt:
    chart.createdAt instanceof Date
      ? chart.createdAt.toISOString()
      : String(chart.createdAt),
});

const countByStatus = (charts: ColorChart[]) => ({
  total: charts.length,
  published: charts.filter((chart) => chart.published).length,
  draft: charts.filter((chart) => !chart.published).length,
  featured: charts.filter((chart) => chart.featured).length,
});

export default async function ColorChartsAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const charts = await prisma.colorChart.findMany({
    where: { locale },
    orderBy: [
      { featured: 'desc' },
      { order: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  const sorted = [...charts].sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt).getTime();
    const bTime = new Date(b.updatedAt ?? b.createdAt).getTime();
    return bTime - aTime;
  });
  const stats = countByStatus(sorted);

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">
                Farbtafeln-Verwaltung
              </h1>
              <p className="text-gray-400">
                Verwalten Sie die GemILike Farbtafeln mit GIA-konformer Benennung
              </p>
            </div>
            <div className="flex gap-2">
              <BulkImportDialog locale={locale} />
              <Link href={`/${locale}/admin/color-charts/new`}>
                <Button className="bg-[#9A1A63] hover:bg-[#7a1450]">
                  Neue Farbtafel
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Gesamt</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Veröffentlicht</div>
            <div className="text-2xl font-bold text-green-400">{stats.published}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Entwürfe</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.draft}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Featured</div>
            <div className="text-2xl font-bold text-[#9A1A63]">{stats.featured}</div>
          </div>
        </div>

        {/* Table */}
        <ColorChartTable charts={sorted.map(toListItem)} locale={locale} />
      </div>
    </div>
  );
}

