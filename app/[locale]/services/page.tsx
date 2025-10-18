'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gem, Sparkles, Shield, Truck, Headphones } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const t = useTranslations('services');

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
    <div className="container py-12 md:py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
          <span className="gradient-text animate-glow">Unsere Services</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Professionelle Edelstein-Services für jeden Bedarf
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
        {services.map((service, index) => (
          <div key={index} className="group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <ul className="space-y-1">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                    <Sparkles className="mr-2 h-3 w-3 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Haben Sie Fragen zu unseren Services?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
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
  );
}
