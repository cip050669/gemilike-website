import Link from 'next/link';
import { ColorChartEditor } from '@/components/admin/color-charts/ColorChartEditor';
import { Button } from '@/components/ui/button';

export default async function ColorChartCreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">Neue Farbtafel</h1>
            <p className="text-gray-400">
              Erstellen Sie eine neue Farbtafel mit GIA-konformer Benennung
            </p>
          </div>
          <Link href={`/${locale}/admin/color-charts`}>
            <Button variant="outline">Zurück zur Übersicht</Button>
          </Link>
        </div>

        <ColorChartEditor mode="create" locale={locale} />
      </div>
    </div>
  );
}

