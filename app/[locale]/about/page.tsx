import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, Sparkles, Diamond, Mountain, Award, Package, Users, Target, Heart } from 'lucide-react';
import Link from 'next/link';

const getServices = (t: any) => [
  {
    icon: Mountain,
    title: t.services.rough,
    description: t.services.roughDesc,
    features: ['Smaragde', 'Rubine', 'Saphire', 'Turmaline', 'Aquamarine', 'Weitere Raritäten'],
  },
  {
    icon: Diamond,
    title: t.services.cut,
    description: t.services.cutDesc,
    features: ['Brillantschliff', 'Facettenschliff', 'Cabochon', 'Fantasieschliffe'],
  },
  {
    icon: Sparkles,
    title: t.services.diamonds,
    description: t.services.diamondsDesc,
    features: ['Brillanten', 'Farbdiamanten', 'Zertifikate', 'Individuelle Auswahl'],
  },
  {
    icon: Gem,
    title: t.services.colored,
    description: t.services.coloredDesc,
    features: ['Smaragde', 'Rubine', 'Saphire', 'Opale', 'Tansanite', 'Paraiba'],
  },
  {
    icon: Award,
    title: t.services.collector,
    description: t.services.collectorDesc,
    features: ['Museumsstücke', 'Seltene Fundstücke', 'Zertifiziert', 'Dokumentiert'],
  },
  {
    icon: Package,
    title: t.services.wholesale,
    description: t.services.wholesaleDesc,
    features: ['Großmengen', 'Individuelle Auswahl', 'Faire Preise', 'Zuverlässige Lieferung'],
  },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await import(`@/messages/${locale}.json`).then(m => m.default);
  const services = getServices(t);
  
  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-6xl container-dark">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            <span className="gradient-text animate-glow">{t.about.title}</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {t.about.subtitle}
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-16">
          <p>
            {t.about.intro1}
          </p>
          <p>
            {t.about.intro2}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <Card>
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t.about.mission}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t.about.missionDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t.about.values}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t.about.valuesDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t.about.expertise}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t.about.expertiseDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t.about.quality}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t.about.qualityDesc}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              <span className="gradient-text animate-glow">{t.services.title}</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              {t.services.subtitle}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-2xl">{t.services.ctaTitle}</CardTitle>
                <CardDescription className="text-base">
                  {t.services.ctaDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" asChild>
                  <Link href={`/${locale}/contact`}>{t.services.ctaButton}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
