import Link from 'next/link';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { loadKnowledgeSectionSettings } from '@/lib/data/knowledge-settings';
import { getBlogs } from '@/lib/services/blog.service';
import { ArrowLeftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import navStyles from '@/components/layout/HeaderNav.module.css';
import { PublicLayout } from '@/components/layout/PublicLayout';

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
  const [settings, blogs] = await Promise.all([
    loadKnowledgeSectionSettings(),
    getBlogs(locale, true), // Get only published blogs for this locale
  ]);

  const stories = blogs
    .sort((a, b) => {
      const aTime = new Date(a.publishedAt ?? a.updatedAt ?? a.createdAt).getTime();
      const bTime = new Date(b.publishedAt ?? b.updatedAt ?? b.createdAt).getTime();
      return bTime - aTime;
    })
    .map((blog) => {
      const baseText = blog.excerpt?.trim() || stripMarkdown(blog.content);
      const excerpt =
        baseText.length > 220
          ? `${baseText.slice(0, 220).trimEnd()} …`
          : baseText;

      const image =
        blog.image && blog.image.trim() && blog.image !== '/blog/default-blog.jpg'
          ? blog.image
          : STORY_PLACEHOLDER_IMAGE;

      return {
        id: blog.id,
        title: blog.title,
        href: `/${locale}/blog/${blog.slug}`,
        image,
        excerpt,
      };
    });

  return (
    <PublicLayout>
      <div className="public-page-bg text-foreground">
        <div className="container py-12 md:py-20 space-y-10">
        <header className="space-y-4 text-center">
          <div className="flex justify-center mb-4">
            <Link
              href={`/${locale}`}
              className={cn(navStyles.navButton, navStyles.navButtonTight, 'gap-2 px-3')}
            >
              <ArrowLeftIcon className="relative z-[1] h-4 w-4" />
              <span className={navStyles.navLabel}>Zurück zur Startseite</span>
              <span className={navStyles.navGlow} />
            </Link>
          </div>
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

        {/* Container: Geschichten um Edelsteine */}
        <div className="main-container">
          {stories.length > 0 ? (
            <div className="max-h-[620px] overflow-y-auto pr-3 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[75px]">
                {stories.map((story) => (
                  <div
                    key={story.id}
                    className="story-card group transition-transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex gap-[50px] items-center">
                      <div className="relative overflow-hidden rounded-lg border border-white/10 public-page-bg/20 h-[180px] w-[204px] flex-shrink-0">
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
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
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
                Noch keine Geschichten veröffentlicht
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Sobald Blog-Beiträge veröffentlicht sind, erscheinen sie hier als
                Inspiration rund um Edelsteine.
              </p>
              <Button
                variant="outline"
                className="mt-6 border-white/40 text-white hover:bg-gray-800/30/10"
                asChild
              >
                <Link href={`/${locale}/blog`}>Zum Blog</Link>
              </Button>
            </div>
          )}
        </div>
        </div>
      </div>
    </PublicLayout>
  );
}
