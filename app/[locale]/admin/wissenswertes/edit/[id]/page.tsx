import Link from 'next/link';
import { notFound } from 'next/navigation';
import { KnowledgeEditorContainer } from '@/components/admin/KnowledgeEditorContainer';
import { getKnowledgeArticleById } from '@/lib/services/knowledge.service';

export default async function KnowledgeEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const article = await getKnowledgeArticleById(id);

  if (!article) {
    notFound();
  }

  const serializable = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    author: article.author,
    category: article.category,
    tags: article.tags,
    image: article.image || '',
    contentImages: article.contentImages || [],
    published: article.published,
    featured: article.featured,
    metaDescription: article.metaDescription || '',
    readingTime: article.readingTime || undefined,
    difficulty: article.difficulty || 'beginner',
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    publishedAt: article.publishedAt?.toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Wissenswert-Artikel bearbeiten
            </h1>
            <p className="text-gray-300">
              Aktualisieren oder veröffentlichen Sie den ausgewählten Artikel.
            </p>
          </div>
          <Link
            href={`/${locale}/admin/wissenswertes`}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-100"
          >
            Zurück zur Übersicht
          </Link>
        </div>

        <KnowledgeEditorContainer mode="edit" locale={locale} article={serializable} />
      </div>
    </div>
  );
}
