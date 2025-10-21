import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GemIcon, StarIcon, ShieldIcon, TruckIcon } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroSection } from '@/components/home/HeroSection';
import { loadBlogs } from '@/lib/data/blogs';

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

      return {
        id: blog.id,
        title: blog.title,
        href: `/${locale}/blog/${blog.slug}`,
        excerpt,
      };
    });

  return (
    <PublicLayout>
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection locale={locale} />

      {/* Container 1: Geschichten um Edelsteine */}
      <div className="main-container">
        <h2 className="text-3xl md:text-4xl font-impact font-weight-impact mb-4 text-white text-center">GESCHICHTEN UM EDELSTEINE</h2>
        <p className="text-lg text-gray-300 text-center mb-16">
          Entdecken Sie die faszinierenden Geschichten und Mythen hinter unseren Edelsteinen
        </p>
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Link key={story.id} href={story.href} className="story-card transition-transform hover:-translate-y-1 hover:shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  {story.title}
                </h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  {story.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 mt-6 text-sm text-primary">
                  Mehr lesen
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
                </span>
              </Link>
            ))}
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
