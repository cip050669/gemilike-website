import Link from 'next/link';
import NextImage from 'next/image';
import { loadKnowledgeSectionSettings } from '@/lib/data/knowledge-settings';
import { getKnowledgeArticles } from '@/lib/services/knowledge.service';
import { cn } from '@/lib/utils';
import navStyles from '@/components/layout/HeaderNav.module.css';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';

// Force dynamic rendering to always show latest articles
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STORY_PLACEHOLDER_IMAGE = '/images/stories/placeholder-gem.svg';

const stripMarkdown = (markdown: string) =>
  markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[(.*?)\]\([^)]*\)/g, (_, text) => text || '')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export default async function KnowledgeListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [settings, articles] = await Promise.all([
    loadKnowledgeSectionSettings(),
    getKnowledgeArticles(locale, true), // Get only published knowledge articles for this locale
  ]);

  const stories = articles
    .sort((a, b) => {
      const aTime = new Date(a.publishedAt ?? a.updatedAt ?? a.createdAt).getTime();
      const bTime = new Date(b.publishedAt ?? b.updatedAt ?? b.createdAt).getTime();
      return bTime - aTime;
    })
    .map((article) => {
      const baseText = article.excerpt?.trim() || stripMarkdown(article.content);
      const excerpt =
        baseText.length > 220
          ? `${baseText.slice(0, 220).trimEnd()} …`
          : baseText;

      const image =
        article.image && article.image.trim() && article.image !== '/blog/default-blog.jpg'
          ? article.image
          : STORY_PLACEHOLDER_IMAGE;

      return {
        id: article.id,
        title: article.title,
        href: `/${locale}/wissenswertes/${article.slug}`,
        image,
        excerpt,
      };
    });

  return (
    <PublicLayout>
      <div className="min-h-screen public-page-bg text-white pb-16">
        <div className="max-w-6xl mx-auto px-4">
        <ScrollAnimated direction="fade" delay={0}>
          <section className="main-container">
            <div className="story-card space-y-4 p-6 md:p-8">
              <div className="space-y-4 text-center">
                <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                  <span className="gemilike-text-gradient">{settings.heading}</span>
                </h1>
                <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
                  {settings.subheading}
                </p>
              </div>
            </div>
          </section>
        </ScrollAnimated>

        <ScrollAnimated direction="up" delay={100}>
          <section className="main-container">
          {stories.length > 0 ? (
            <div className="max-h-[620px] overflow-y-auto pr-3 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[75px]">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="story-card group transition-transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex gap-[50px] items-center">
                      <div className="relative overflow-hidden rounded-lg border border-white/20 bg-gray-900/70 backdrop-blur h-[180px] w-[204px] flex-shrink-0 flex items-center justify-center">
                        <NextImage
                          src={story.image}
                          alt={story.title}
                          fill
                          sizes="(max-width: 768px) 50vw, 204px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          priority={false}
                        />
                      </div>
                      <div className="flex flex-col gap-6 justify-center flex-1">
                        <div className="flex items-center gap-6 w-full">
                          <div className="flex flex-col gap-3 text-left flex-1">
                            <h3 className="text-xl font-bold gemilike-text-gradient">
                              {story.title}
                            </h3>
                            <p className="text-gray-200 text-sm leading-relaxed line-clamp-4">
                              {story.excerpt}
                            </p>
                          </div>
                          <Link
                            href={story.href}
                            className={cn(
                              navStyles.navButton,
                              navStyles.navButtonTight,
                              'ml-auto inline-flex items-center gap-3'
                            )}
                          >
                            <span className={navStyles.navLabel}>Mehr lesen</span>
                            <svg
                              className="relative z-[1] h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 4.5l7.5 7.5-7.5 7.5"
                              />
                            </svg>
                            <span className={navStyles.navGlow} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="story-card text-center">
              <h3 className="text-2xl font-bold mb-4 gemilike-text-gradient">
                Noch keine Artikel veröffentlicht
              </h3>
              <p className="text-gray-200 text-base leading-relaxed">
                Sobald Wissenswert-Artikel veröffentlicht sind, erscheinen sie hier.
              </p>
            </div>
          )}
          </section>
        </ScrollAnimated>
        </div>
      </div>
    </PublicLayout>
  );
}
