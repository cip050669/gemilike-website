import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, Sparkles, Diamond, Mountain, Award, Package, Users, Target, Heart } from 'lucide-react';
import Link from 'next/link';
import { getAboutContent, getServices } from '@/lib/services/about.service';

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
  const [content, services] = await Promise.all([
    getAboutContent(locale),
    getServices(locale),
  ]);

  // Create a map for quick lookup
  const contentMap = new Map(content.map((c) => [c.section, c.content]));

  // Fallback to default values if DB content is missing
  const title = contentMap.get('title') || 'Über Gemilike';
  const subtitle = contentMap.get('subtitle') || 'Exklusive Edelsteine, jahrzehntelange Erfahrung und persönliche Beratung';
  const intro1 = contentMap.get('intro1') || '';
  const intro2 = contentMap.get('intro2') || '';
  const mission = contentMap.get('mission') || 'Unsere Mission';
  const missionDesc = contentMap.get('missionDesc') || '';
  const values = contentMap.get('values') || 'Unsere Werte';
  const valuesDesc = contentMap.get('valuesDesc') || '';
  const expertise = contentMap.get('expertise') || 'Unsere Expertise';
  const expertiseDesc = contentMap.get('expertiseDesc') || '';
  const quality = contentMap.get('quality') || 'Qualitätsversprechen';
  const qualityDesc = contentMap.get('qualityDesc') || '';

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-6xl container-dark">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            <span className="gradient-text animate-glow">{title}</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-16">
          {intro1 && <p>{intro1}</p>}
          {intro2 && <p>{intro2}</p>}
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-16">
          <Card>
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{mission}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {missionDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{values}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {valuesDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{expertise}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {expertiseDesc}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{quality}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {qualityDesc}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services Section */}
        {services.length > 0 && (
          <div className="mb-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                <span className="gradient-text animate-glow">Unser Edelstein-Service</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Vom Rohstein bis zur Sammlungsbetreuung – wir begleiten Sie persönlich
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon ? iconMap[service.icon] || Gem : Gem;
                return (
                  <Card key={service.id || index} className="flex flex-col hover:shadow-lg transition-shadow">
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
                  <CardTitle className="text-2xl">Lassen Sie sich persönlich beraten</CardTitle>
                  <CardDescription className="text-base">
                    Gemeinsam finden wir den passenden Edelstein für Ihr Projekt oder Ihre Sammlung.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="lg" asChild>
                    <Link href={`/${locale}/contact`}>Kontakt aufnehmen</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

