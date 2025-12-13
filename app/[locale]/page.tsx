import Link from 'next/link';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { getBlogs } from '@/lib/services/blog.service';
import { getNewstickerItems } from '@/lib/services/newsticker.service';
import { Newsticker } from '@/components/ui/Newsticker';
import { loadHeroSettings } from '@/lib/data/hero-settings';
import { loadShopGemstones } from '@/lib/shop/shopData';
import { cn } from '@/lib/utils';
import navStyles from '@/components/layout/HeaderNav.module.css';
import { NewGemstonesCarousel } from '@/components/home/NewGemstonesCarousel';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';
import { DEFAULT_CONTAINER_CONTENT, getContainerContent } from '@/lib/services/containerContent';

const STORY_PLACEHOLDER_IMAGE = '/images/stories/placeholder-gem.svg';

const stripMarkdown = (markdown: string) =>
  markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[(.*?)\]\([^)]*\)/g, (_, text) => text || '')
    .replace(/[#>*_`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  try {
    const { locale } = await params;
    const blogs = await getBlogs(locale, true).catch(() => []); // Get only published blogs for this locale
    const containerContent = await getContainerContent(
      [
        'home.blog.heading',
        'home.blog.subheading',
        'home.newGemstones.description',
      ],
      locale
    ).catch(() => []);

    const blogHeading =
      containerContent.find((item) => item.key === 'home.blog.heading')?.title ||
      DEFAULT_CONTAINER_CONTENT['home.blog.heading'].title ||
      'GESCHICHTEN UM EDELSTEINE';
    const blogSubheading =
      containerContent.find((item) => item.key === 'home.blog.subheading')?.body ||
      DEFAULT_CONTAINER_CONTENT['home.blog.subheading'].body ||
      'Entdecken Sie die faszinierenden Geschichten und Mythen hinter unseren Edelsteinen';
    const newGemstonesDescription =
      containerContent.find((item) => item.key === 'home.newGemstones.description')?.body ||
      DEFAULT_CONTAINER_CONTENT['home.newGemstones.description'].body ||
      'Entdecken Sie unsere neuesten und exklusivsten Edelsteine – handverlesen und sofort verfügbar.';
    const blogSettings = {
      heading: blogHeading,
      subheading: blogSubheading,
      headingColor: '#ffffff',
      subheadingColor: '#d1d5db',
    };
    const activeNewstickerItems = await getNewstickerItems(true).catch(() => []);
    const shopGemstones = await loadShopGemstones().catch(() => []);
    const newGemstones = shopGemstones.filter((gem) => gem.isNew).slice(0, 12);
    const heroSettings = await loadHeroSettings().catch(() => ({
      title: 'Einfach nur Gemilike',
      titleLine2: 'Heroes in Gems------',
      subtitle: 'Ihr Spezialist für rohe und geschliffene Edelsteine.',
      subtitleColor: '#F4F4FF',
      backgroundImage: '/images/hero/default-hero.jpg',
      ctaText: 'Sortiment entdecken',
      ctaLink: '/shop',
      secondaryCtaText: null,
      secondaryCtaLink: null,
    }));
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
    <div className="min-h-screen public-page-bg text-white pb-16">
      {/* Hero Section */}
      <HeroSection locale={locale} settings={heroSettings} />

      {/* Newsticker */}
      {activeNewstickerItems.length > 0 && (
        <div className="mt-[110px] mb-[150px]">
          <Newsticker items={activeNewstickerItems} />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
      {/* Container 1: Geschichten um Edelsteine */}
      <ScrollAnimated direction="fade" delay={0}>
        <section className="main-container">
          <div className="story-card space-y-4 p-6 md:p-8">
            <div className="space-y-4 text-center">
              <h2 className="text-3xl md:text-4xl font-impact font-weight-impact mb-4">
                <span className="gemilike-text-gradient">{blogSettings.heading}</span>
              </h2>
              <p className="text-lg text-gray-200 mb-16">
                {blogSettings.subheading}
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
              Noch keine Geschichten veröffentlicht
            </h3>
            <p className="text-gray-200 text-base leading-relaxed">
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
        </section>
      </ScrollAnimated>

      {/* Container 2: Neue Edelsteine */}
      <ScrollAnimated direction="up" delay={200}>
        <NewGemstonesCarousel
          gemstones={newGemstones}
          locale={locale}
          description={newGemstonesDescription}
        />
      </ScrollAnimated>
      </div>
    </div>
    </PublicLayout>
  );
  } catch (error) {
    console.error('Error in HomePage:', error);
    return (
      <PublicLayout>
        <div className="min-h-screen public-page-bg text-white pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Fehler beim Laden der Seite</h1>
            <p className="text-gray-300">Bitte versuchen Sie es später erneut.</p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 text-xs text-left bg-gray-900 p-4 rounded overflow-auto max-w-2xl">
                {error instanceof Error ? error.message : String(error)}
              </pre>
            )}
          </div>
        </div>
      </PublicLayout>
    );
  }
}
