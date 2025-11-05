import Link from 'next/link';
import { getKnowledgeArticles } from '@/lib/services/knowledge.service';
import { loadKnowledgeSectionSettings } from '@/lib/data/knowledge-settings';
import { KnowledgeTable } from '@/components/admin/KnowledgeTable';
import { KnowledgeSettingsForm } from '@/components/admin/KnowledgeSettingsForm';

import type { KnowledgeArticle } from '@/lib/types/knowledge';

const PLACEHOLDER_IMAGE = '/images/stories/placeholder-gem.svg';

const toListItem = (article: KnowledgeArticle) => ({
  id: article.id,
  title: article.title,
  excerpt: article.excerpt,
  author: article.author,
  category: article.category,
  published: article.published,
  featured: article.featured,
  updatedAt: article.updatedAt?.toISOString() || new Date().toISOString(),
  createdAt: article.createdAt?.toISOString() || new Date().toISOString(),
  publishedAt: article.publishedAt?.toISOString(),
  slug: article.slug,
  tags: article.tags || [],
  image: article.image?.trim() ? article.image : PLACEHOLDER_IMAGE,
});

const countByStatus = (articles: KnowledgeArticle[]) => ({
  total: articles.length,
  published: articles.filter((article) => article.published).length,
  draft: articles.filter((article) => !article.published).length,
  featured: articles.filter((article) => article.featured).length,
});

export default async function KnowledgeAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const articles = await getKnowledgeArticles(locale, false);
  const settings = await loadKnowledgeSectionSettings();
  
  // Convert Prisma KnowledgeBase objects to KnowledgeArticle type
  const articlesAsKnowledgeArticle: KnowledgeArticle[] = articles.map((article) => ({
    ...article,
    difficulty: article.difficulty && ['beginner', 'intermediate', 'advanced'].includes(article.difficulty)
      ? article.difficulty as 'beginner' | 'intermediate' | 'advanced'
      : undefined,
    image: article.image || '',
    excerpt: article.excerpt || '',
  }));
  
  const sorted = [...articlesAsKnowledgeArticle].sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt).getTime();
    const bTime = new Date(b.updatedAt ?? b.createdAt).getTime();
    return bTime - aTime;
  });
  const stats = countByStatus(sorted);

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">
                Wissenswertes-Verwaltung
              </h1>
              <p className="text-gray-300">Verwalten Sie Wissensartikel rund um Edelsteine</p>
            </div>
            <Link
              href={`/${locale}/admin/wissenswertes/new`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              + Neuer Wissenswert-Artikel
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/30 p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Gesamt</h3>
            <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Veröffentlicht</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.published}</p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Entwürfe</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.draft}</p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Hervorgehoben</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.featured}</p>
          </div>
        </div>

        <div className="mb-8">
          <KnowledgeSettingsForm
            heading={settings.heading}
            subheading={settings.subheading}
            headingColor={settings.headingColor}
            subheadingColor={settings.subheadingColor}
          />
        </div>

        <KnowledgeTable articles={articlesAsKnowledgeArticle.map(toListItem)} locale={locale} />
      </div>
    </div>
  );
}
