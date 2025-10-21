import Link from 'next/link';
import { BlogEditorContainer } from '@/components/admin/BlogEditorContainer';

export default async function BlogCreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Neuer Blog-Beitrag</h1>
            <p className="text-white/70">
              Erstellen Sie einen Artikel für die Sektion „Geschichten um
              Edelsteine“.
            </p>
          </div>
          <Link
            href={`/${locale}/admin/blogs`}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            Zurück zur Übersicht
          </Link>
        </div>

        <BlogEditorContainer mode="create" locale={locale} />
      </div>
    </div>
  );
}
