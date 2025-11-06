import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ColorChartEditor } from '@/components/admin/color-charts/ColorChartEditor';
import { Button } from '@/components/ui/button';
import { ColorChart } from '@/components/color-charts/GemColorCard';

export default async function ColorChartEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  
  const chart = await prisma.colorChart.findUnique({
    where: { id },
  });

  if (!chart) {
    return (
      <div className="min-h-screen bg-gray-800/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Farbtafel nicht gefunden</h1>
            <Link href={`/${locale}/admin/color-charts`}>
              <Button>Zurück zur Übersicht</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const chartData: ColorChart = {
    id: chart.id,
    name: chart.name,
    origin: chart.origin,
    locale: chart.locale,
    gia: chart.gia as { hue?: string; tone?: string; sat?: string },
    gradient: chart.gradient,
    pleochro: chart.pleochro,
    light: chart.light,
    note: chart.note,
    description: chart.description,
    published: chart.published,
    featured: chart.featured,
    order: chart.order,
    createdAt: chart.createdAt,
    updatedAt: chart.updatedAt,
  };

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Farbtafel bearbeiten</h1>
            <p className="text-gray-400">
              Bearbeiten Sie die Farbtafel: {chart.name}
            </p>
          </div>
          <Link href={`/${locale}/admin/color-charts`}>
            <Button variant="outline">Zurück zur Übersicht</Button>
          </Link>
        </div>

        <ColorChartEditor chart={chartData} mode="edit" locale={locale} />
      </div>
    </div>
  );
}

