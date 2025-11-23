import { PublicLayout } from '@/components/layout/PublicLayout';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';
import { loadBlogSectionSettings } from '@/lib/data/blog-settings';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  const blogSettings = await loadBlogSectionSettings();

  return (
    <PublicLayout>
      <div className="min-h-screen public-page-bg text-white pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimated direction="fade" delay={0}>
            <section className="main-container">
              <div className="story-card space-y-4 p-6 md:p-8">
                <div className="space-y-4 text-center">
                  <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                    <span className="gemilike-text-gradient">{blogSettings.heading || 'Blog'}</span>
                  </h1>
                  <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
                    {blogSettings.subheading || 'Entdecken Sie die faszinierende Welt der Edelsteine'}
                  </p>
                </div>
              </div>
            </section>
          </ScrollAnimated>

          <ScrollAnimated direction="up" delay={100}>
            <section className="main-container">
              <div className="story-card text-center">
                <h3 className="text-2xl font-bold mb-4 gemilike-text-gradient">
                  Blog-Funktionalität wird bald verfügbar sein
                </h3>
                <p className="text-gray-200 text-base leading-relaxed">
                  Die Blog-Funktionalität wird in Kürze verfügbar sein.
                </p>
              </div>
            </section>
          </ScrollAnimated>
        </div>
      </div>
    </PublicLayout>
  );
}
