'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gem, Sparkles } from 'lucide-react';

export default function SimpleHomePage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen public-page-bg text-foreground">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              <span className="gradient-text animate-glow">Einfach nur Gemilike</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-primary">
              Heroes in Gems
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ihr Spezialist für rohe und geschliffene Edelsteine. Entdecken Sie unsere exquisite Auswahl an Diamanten, Smaragden, Rubinen und weiteren Edelsteinen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/de/shop">
                  Sortiment entdecken
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link href="/de/contact">
                  Kontaktieren Sie uns
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 public-page-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              <span className="gradient-text animate-glow">Warum Gemilike?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Entdecken Sie die Welt der Edelsteine mit unserem Expertenwissen und unserer Leidenschaft für außergewöhnliche Steine.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exklusive Edelsteine</h3>
              <p className="text-muted-foreground">
                Handverlesene Edelsteine aus den besten Quellen weltweit, sorgfältig ausgewählt für ihre außergewöhnliche Qualität.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expertenwissen</h3>
              <p className="text-muted-foreground">
                Jahrzehntelange Erfahrung in der Edelsteinbranche mit fundiertem Wissen über Herkunft, Qualität und Verarbeitung.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Persönliche Beratung</h3>
              <p className="text-muted-foreground">
                Individuelle Beratung für jeden Kunden, um den perfekten Edelstein für Ihre Bedürfnisse zu finden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Bereit für Ihre Edelstein-Reise?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entdecken Sie unsere Kollektion und finden Sie den perfekten Edelstein für Ihr nächstes Projekt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/de/shop">
                Jetzt entdecken
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link href="/de/contact">
                Beratung anfragen
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

