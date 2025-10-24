import Link from 'next/link';
import Image from 'next/image';
import { loadKnowledgeArticles } from '@/lib/data/knowledge';
import { loadKnowledgeSectionSettings } from '@/lib/data/knowledge-settings';

export default async function KnowledgeListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [articles, settings] = await Promise.all([
    loadKnowledgeArticles(),
    loadKnowledgeSectionSettings(),
  ]);
  const publishedArticles = articles.filter((article) => article.published);
  const sorted = publishedArticles.sort((a, b) => {
    const dateA = new Date(a.publishedAt ?? a.updatedAt ?? a.createdAt).getTime();
    const dateB = new Date(b.publishedAt ?? b.updatedAt ?? b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-gray-800/50 text-foreground">
      <div className="container py-12 md:py-20 space-y-10">
        <header className="space-y-4 text-center">
          <h1
            className="text-4xl md:text-5xl font-impact font-weight-impact"
            style={{ color: settings.headingColor }}
          >
            {settings.heading}
          </h1>
          <p
            className="mx-auto max-w-3xl text-base md:text-lg text-white/70"
            style={{ color: settings.subheadingColor }}
          >
            {settings.subheading}
          </p>
        </header>

        {sorted.length === 0 ? (
          <div className="text-center text-white/60">
            Noch keine Wissensartikel veröffentlicht.
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
            {sorted.map((article) => (
              <article
                key={article.id}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gray-800/50/80 shadow-lg ring-1 ring-black/30 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={article.image || '/images/stories/placeholder-gem.svg'}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-white/50">
                      {new Date(article.publishedAt ?? article.updatedAt ?? article.createdAt).toLocaleDateString('de-DE')}
                    </p>
                    <h2 className="text-2xl font-semibold text-white line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-sm text-white/70 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {article.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/70">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/${locale}/wissenswertes/${article.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800/30/10"
                  >
                    Artikel lesen
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
