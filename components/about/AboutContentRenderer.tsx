import { Button } from '@/components/ui/button';
import { Gem, Sparkles, Diamond, Mountain, Award, Package, Users, Target, Heart } from 'lucide-react';
import Link from 'next/link';
import { getAboutContent, getServices } from '@/lib/services/about.service';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mountain,
  Diamond,
  Sparkles,
  Gem,
  Award,
  Package,
  Users,
  Target,
  Heart,
};

export async function AboutContentRenderer({ locale }: { locale: string }) {
  const isEnglish = locale === 'en';
  const [content, services] = await Promise.all([
    getAboutContent(locale),
    getServices(locale),
  ]);

  // Create a map for quick lookup
  const contentMap = new Map(content.map((c) => [c.section, c.content]));

  // Fallback to default values if DB content is missing
  const title = contentMap.get('title') || (isEnglish ? 'About Gemilike' : 'Über Gemilike');
  const subtitle =
    contentMap.get('subtitle') ||
    (isEnglish
      ? 'Exclusive gemstones, decades of experience, and personal advice'
      : 'Exklusive Edelsteine, jahrzehntelange Erfahrung und persönliche Beratung');
  const intro1 = contentMap.get('intro1') || '';
  const intro2 = contentMap.get('intro2') || '';
  const mission = contentMap.get('mission') || (isEnglish ? 'Our mission' : 'Unsere Mission');
  const missionDesc = contentMap.get('missionDesc') || '';
  const values = contentMap.get('values') || (isEnglish ? 'Our values' : 'Unsere Werte');
  const valuesDesc = contentMap.get('valuesDesc') || '';
  const expertise = contentMap.get('expertise') || (isEnglish ? 'Our expertise' : 'Unsere Expertise');
  const expertiseDesc = contentMap.get('expertiseDesc') || '';
  const quality = contentMap.get('quality') || (isEnglish ? 'Quality promise' : 'Qualitätsversprechen');
  const qualityDesc = contentMap.get('qualityDesc') || '';

  return (
    <div className="min-h-screen public-page-bg text-white pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollAnimated direction="fade" delay={0}>
          <section className="main-container">
          <div className="story-card space-y-4 p-6 md:p-8">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                <span className="gemilike-text-gradient">{title}</span>
              </h1>
              <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
                {subtitle}
              </p>
            </div>
          </div>
          </section>
        </ScrollAnimated>

        {(intro1 || intro2) && (
          <ScrollAnimated direction="up" delay={100}>
            <section className="main-container mt-8">
            <div className="story-card p-6 md:p-8">
              <div className="prose prose-lg max-w-none text-gray-200">
                {intro1 && <p className="text-gray-200">{intro1}</p>}
                {intro2 && <p className="text-gray-200">{intro2}</p>}
              </div>
            </div>
            </section>
          </ScrollAnimated>
        )}

        <ScrollAnimated direction="up" delay={200}>
          <section className="main-container mt-8">
            <div className="grid gap-8 md:grid-cols-2 mb-16">
          <div className="story-card">
            <div className="p-6 md:p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-[var(--color-text-primary)]" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-200">{mission}</h2>
              <p className="text-gray-300">
                {missionDesc}
              </p>
            </div>
          </div>

          <div className="story-card">
            <div className="p-6 md:p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-[var(--color-text-primary)]" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-200">{values}</h2>
              <p className="text-gray-300">
                {valuesDesc}
              </p>
            </div>
          </div>

          <div className="story-card">
            <div className="p-6 md:p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-[var(--color-text-primary)]" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-200">{expertise}</h2>
              <p className="text-gray-300">
                {expertiseDesc}
              </p>
            </div>
          </div>

          <div className="story-card">
            <div className="p-6 md:p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-[var(--color-text-primary)]" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-200">{quality}</h2>
              <p className="text-gray-300">
                {qualityDesc}
              </p>
            </div>
          </div>
        </div>
          </section>
        </ScrollAnimated>

        {/* Services Section */}
        {services.length > 0 && (
          <>
            <ScrollAnimated direction="fade" delay={300}>
              <section className="main-container mb-12">
              <div className="story-card p-6 md:p-8">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-impact font-weight-impact mb-4">
                    <span className="gemilike-text-gradient">{isEnglish ? 'Our gemstone service' : 'Unser Edelstein-Service'}</span>
                  </h2>
                  <p className="text-gray-200">
                    {isEnglish
                      ? 'From rough stones to collection support, we guide you personally'
                      : 'Vom Rohstein bis zur Sammlungsbetreuung – wir begleiten Sie persönlich'}
                  </p>
                </div>
              </div>
              </section>
            </ScrollAnimated>

            <ScrollAnimated direction="up" delay={400}>
              <section className="main-container">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon ? iconMap[service.icon] || Gem : Gem;
                return (
                  <div key={service.id || index} className="story-card">
                    <div className="p-6 md:p-8 flex flex-col">
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-[var(--color-text-primary)]" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-200">{service.title}</h3>
                      <p className="text-gray-300 mb-4">{service.description}</p>
                      <ul className="space-y-2 flex-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-300">
                            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[var(--color-text-primary)]"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
              </section>
            </ScrollAnimated>

            <ScrollAnimated direction="up" delay={500}>
              <section className="main-container mt-8">
                <div className="story-card text-center">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-4 text-gray-200">
                    {isEnglish ? 'Get personal advice' : 'Lassen Sie sich persönlich beraten'}
                  </h2>
                  <p className="text-gray-300 mb-6">
                    {isEnglish
                      ? 'Together we will find the right gemstone for your project or collection.'
                      : 'Gemeinsam finden wir den passenden Edelstein für Ihr Projekt oder Ihre Sammlung.'}
                  </p>
                  <Button size="lg" asChild>
                    <Link href={`/${locale}/contact`}>{isEnglish ? 'Get in touch' : 'Kontakt aufnehmen'}</Link>
                  </Button>
                </div>
              </div>
              </section>
            </ScrollAnimated>
          </>
        )}
      </div>
    </div>
  );
}
