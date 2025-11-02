import { CartAnalyticsDashboard } from '@/components/admin/CartAnalyticsDashboard';

export default async function CartsAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Warenkorb-Analyse</h1>
          <p className="text-gray-300">
            Übersicht über Warenkörbe, Conversion-Raten und Abandonment-Analysen
          </p>
        </div>

        <CartAnalyticsDashboard locale={locale} />
      </div>
    </div>
  );
}

