import { LegalPageContent } from '@/components/legal/LegalPageContent';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';

export default async function AgbPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PublicLayout>
      <div className="min-h-screen public-page-bg text-white pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimated direction="fade" delay={0}>
            <section className="main-container">
              <div className="story-card space-y-4 p-6 md:p-8">
          <LegalPageContent
            slug="agb"
            locale={locale}
            fallbackContent={
                    <>
                      <div className="space-y-4 text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                          <span className="gemilike-text-gradient">Allgemeine Geschäftsbedingungen</span>
                        </h1>
                      </div>
                      <div className="text-center text-gray-200">
                AGB-Seite wird geladen...
              </div>
                    </>
            }
          />
              </div>
            </section>
          </ScrollAnimated>
        </div>
      </div>
    </PublicLayout>
  );
}

