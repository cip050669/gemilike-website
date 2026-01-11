'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Gem, Sparkles, Shield, Truck, Headphones } from 'lucide-react';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';

export default function ServicesPage() {
  // i18n derzeit ungenutzt

  const services = [
    {
      icon: Gem,
      title: 'Edelstein-Beratung',
      description: 'Professionelle Beratung für Ihre Edelstein-Auswahl',
      features: ['Individuelle Beratung', 'Qualitätsbewertung', 'Preisempfehlungen']
    },
    {
      icon: Shield,
      title: 'Zertifizierung',
      description: 'Offizielle Zertifikate für alle Edelsteine',
      features: ['GIA-Zertifikate', 'AIGS-Zertifikate', 'IGI-Zertifikate']
    },
    {
      icon: Truck,
      title: 'Versand & Lieferung',
      description: 'Sicherer Versand weltweit',
      features: ['Versicherter Versand', 'Schnelle Lieferung', 'Tracking']
    },
    {
      icon: Headphones,
      title: 'Kundenservice',
      description: 'Persönlicher Support für alle Fragen',
      features: ['24/7 Support', 'Fachberatung', 'Nachkauf-Service']
    }
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen public-page-bg text-white pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimated direction="fade" delay={0}>
            <section className="main-container">
              <div className="story-card space-y-4 p-6 md:p-8">
                <div className="space-y-4 text-center">
                  <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                    <span className="gemilike-text-gradient">Unsere Services</span>
                  </h1>
                  <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
                    Professionelle Edelstein-Services für jeden Bedarf
                  </p>
                </div>
              </div>
            </section>
          </ScrollAnimated>

          <ScrollAnimated direction="up" delay={100}>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16 mt-8">
              {services.map((service, index) => (
                <div key={index} className="story-card">
                  <div className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <service.icon className="h-6 w-6 text-[var(--color-text-primary)]" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-200">{service.title}</h3>
                    <p className="text-gray-200 mb-4">{service.description}</p>
                    <ul className="space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-200">
                          <Sparkles className="mr-2 h-3 w-3 text-[var(--color-text-primary)]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </ScrollAnimated>

          <ScrollAnimated direction="up" delay={200}>
            <section className="main-container">
              <div className="story-card p-6 md:p-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-4 text-gray-200">Haben Sie Fragen zu unseren Services?</h2>
                  <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
                    Kontaktieren Sie uns für eine persönliche Beratung oder weitere Informationen zu unseren Edelstein-Services.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="group">
                      <Link href="/contact">
                        Kontakt aufnehmen
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/shop">
                        Sortiment entdecken
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </ScrollAnimated>
        </div>
      </div>
    </PublicLayout>
  );
}
