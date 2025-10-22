import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KnowledgeEditorContainer } from '@/components/admin/KnowledgeEditorContainer';
import { loadKnowledgeArticles } from '@/lib/data/knowledge';

export default async function KnowledgeEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const articles = await loadKnowledgeArticles();
  const article = articles.find((item) => item.id === id);

  if (!article) {
    notFound();
  }

  const serializable = {
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    publishedAt: article.publishedAt?.toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Wissenswert-Artikel bearbeiten
            </h1>
            <p className="text-gray-600">
              Aktualisieren oder veröffentlichen Sie den ausgewählten Artikel.
            </p>
          </div>
          <Link
            href={`/${locale}/admin/wissenswertes`}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Zurück zur Übersicht
          </Link>
        </div>

        <KnowledgeEditorContainer mode="edit" locale={locale} article={serializable} />
      </div>
    </div>
  );
}
