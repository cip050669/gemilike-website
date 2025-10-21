import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GemIcon, StarIcon, ShieldIcon, TruckIcon } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { loadBlogs } from '@/lib/data/blogs';
import { loadBlogSectionSettings } from '@/lib/data/blog-settings';
import { loadNewstickerData } from '@/app/api/admin/newsticker/route';
import { Newsticker } from '@/components/ui/Newsticker';

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
  const { locale } = await params;
  const blogs = await loadBlogs();
  const blogSettings = await loadBlogSectionSettings();
  const newstickerItems = loadNewstickerData();
  const activeNewstickerItems = newstickerItems.filter((item) => item.isActive);
  const stories = blogs
    .filter((blog) => blog.published)
    .sort((a, b) => {
      const aTime = new Date(a.publishedAt ?? a.updatedAt ?? a.createdAt).getTime();
      const bTime = new Date(b.publishedAt ?? b.updatedAt ?? b.createdAt).getTime();
      return bTime - aTime;
    })
    .slice(0, 3)
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection locale={locale} />

      {/* Newsticker */}
      {activeNewstickerItems.length > 0 && (
        <div className="my-[150px] flex justify-center px-6">
          <Newsticker items={activeNewstickerItems} />
        </div>
      )}

      {/* Container 1: Geschichten um Edelsteine */}
      <div className="main-container">
        <h2 className="text-3xl md:text-4xl font-impact font-weight-impact mb-4 text-white text-center">
          <span style={{ color: blogSettings.headingColor }}>{blogSettings.heading}</span>
        </h2>
        <p className="text-lg text-gray-300 text-center mb-16">
          <span style={{ color: blogSettings.subheadingColor }}>{blogSettings.subheading}</span>
        </p>
        {stories.length > 0 ? (
          <div className="max-h-[340px] overflow-y-auto pr-3 scrollbar-thin">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="story-card group transition-transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex gap-[50px] items-center">
                    <div className="overflow-hidden rounded-lg border border-white/10 bg-black/20 h-[180px] w-[204px] flex-shrink-0">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-col gap-6 justify-center flex-1">
                      <div className="flex items-center gap-6 w-full">
                        <div className="flex flex-col gap-3 text-left flex-1">
                          <h3 className="text-xl font-bold text-white">
                            {story.title}
                          </h3>
                          <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                            {story.excerpt}
                          </p>
                        </div>
                        <Link
                          href={story.href}
                          className="ml-auto inline-flex items-center gap-3 text-sm text-primary whitespace-nowrap"
                        >
                          <span>Mehr lesen</span>
                          <svg
                            className="h-4 w-4"
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
            <h3 className="text-2xl font-bold mb-4 text-white">
              Noch keine Geschichten veröffentlicht
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              Sobald Blog-Beiträge veröffentlicht sind, erscheinen sie hier als
              Inspiration rund um Edelsteine.
            </p>
            <Button
              variant="outline"
              className="mt-6 border-white/40 text-white hover:bg-white/10"
              asChild
            >
              <Link href={`/${locale}/blog`}>Zum Blog</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Container 2: Neue Edelsteine */}
      <div className="main-container">
        <h2 className="text-3xl md:text-4xl font-impact font-weight-impact mb-4 text-white text-center">NEUE EDELSTEINE</h2>
        <p className="text-lg text-gray-300 text-center mb-16">
          Entdecken Sie unsere neuesten und exklusivsten Edelsteine
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="gem-card">
            <GemIcon className="h-20 w-20 text-primary mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4 text-white">Neuer Diamant</h3>
            <p className="text-gray-300 text-base">Frisch geschliffen</p>
          </div>
          <div className="gem-card">
            <GemIcon className="h-20 w-20 text-secondary mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4 text-white">Seltener Smaragd</h3>
            <p className="text-gray-300 text-base">Aus Kolumbien</p>
          </div>
          <div className="gem-card">
            <GemIcon className="h-20 w-20 text-accent mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4 text-white">Exklusiver Rubin</h3>
            <p className="text-gray-300 text-base">Aus Myanmar</p>
          </div>
          <div className="gem-card">
            <GemIcon className="h-20 w-20 text-primary mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4 text-white">Saphir</h3>
            <p className="text-gray-300 text-base">Aus Sri Lanka</p>
          </div>
        </div>
      </div>
    </div>
    </PublicLayout>
  );
}
