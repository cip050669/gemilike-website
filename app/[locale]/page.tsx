import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GemIcon, StarIcon, ShieldIcon, TruckIcon } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-fire-to-ice py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="gemilike-text-gradient text-5xl md:text-6xl font-bold mb-6">
            Willkommen bei Gemilike
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto mb-8">
            Ihr Spezialist für rohe und geschliffene Edelsteine. Entdecken Sie unsere exquisite Auswahl an Diamanten, Smaragden, Rubinen und weiteren Edelsteinen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                Edelsteine entdecken
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                Über uns
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Warum Gemilike?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Wir bieten Ihnen die höchste Qualität und den besten Service im Edelsteinhandel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-card text-card-foreground">
              <CardHeader>
                <GemIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Premium Qualität</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Nur die besten Edelsteine aus vertrauensvollen Quellen
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-card text-card-foreground">
              <CardHeader>
                <StarIcon className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Expertenwissen</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Jahrzehntelange Erfahrung im Edelsteinhandel
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-card text-card-foreground">
              <CardHeader>
                <ShieldIcon className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle>Zertifiziert</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Alle Edelsteine mit offiziellen Zertifikaten
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-card text-card-foreground">
              <CardHeader>
                <TruckIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Sicherer Versand</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Versicherter und sicherer Versand weltweit
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Unsere Highlights</h2>
            <p className="text-lg text-muted-foreground">
              Entdecken Sie unsere beliebtesten Edelsteine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card text-card-foreground">
              <div className="h-64 bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <GemIcon className="h-24 w-24 text-primary-foreground" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle>Diamant</CardTitle>
                  <Badge variant="secondary">Premium</Badge>
                </div>
                <CardDescription className="mb-4">
                  Brillant geschliffener Diamant in höchster Qualität
                </CardDescription>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">Auf Anfrage</span>
                  <Button size="sm">Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card text-card-foreground">
              <div className="h-64 bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <GemIcon className="h-24 w-24 text-primary-foreground" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle>Smaragd</CardTitle>
                  <Badge variant="secondary">Selten</Badge>
                </div>
                <CardDescription className="mb-4">
                  Natürlicher Smaragd mit intensiver grüner Farbe
                </CardDescription>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-secondary">Auf Anfrage</span>
                  <Button size="sm">Details</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow bg-card text-card-foreground">
              <div className="h-64 bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                <GemIcon className="h-24 w-24 text-primary-foreground" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle>Rubin</CardTitle>
                  <Badge variant="secondary">Exklusiv</Badge>
                </div>
                <CardDescription className="mb-4">
                  Feuerroter Rubin von außergewöhnlicher Klarheit
                </CardDescription>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-accent">Auf Anfrage</span>
                  <Button size="sm">Details</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
                Alle Edelsteine anzeigen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 gradient-ice">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Newsletter abonnieren</h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Erhalten Sie exklusive Angebote und Neuigkeiten über unsere neuesten Edelsteine
              </p>
            </div>
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </section>
    </div>
  );
}