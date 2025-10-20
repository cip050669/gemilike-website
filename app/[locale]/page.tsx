import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GemIcon, StarIcon, ShieldIcon, TruckIcon } from 'lucide-react';
import { NewsletterForm } from '@/components/newsletter/NewsletterForm';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { HeroSection } from '@/components/home/HeroSection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <PublicLayout>
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection locale={locale} />

      {/* Container 1: Geschichten um Edelsteine */}
      <div className="main-container">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white text-center">Geschichten um Edelsteine</h2>
        <p className="text-lg text-gray-300 text-center mb-16">
          Entdecken Sie die faszinierenden Geschichten und Mythen hinter unseren Edelsteinen
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="story-card">
            <h3 className="text-2xl font-bold mb-6 text-white">Der Diamant der Hoffnung</h3>
            <p className="text-gray-300 text-lg leading-relaxed">Eine Legende über einen mystischen Diamanten, der seit Jahrhunderten die Herzen der Menschen verzaubert...</p>
          </div>
          <div className="story-card">
            <h3 className="text-2xl font-bold mb-6 text-white">Smaragde der Könige</h3>
            <p className="text-gray-300 text-lg leading-relaxed">Die Geschichte der königlichen Smaragdsammlung und ihre geheimnisvollen Kräfte...</p>
          </div>
          <div className="story-card">
            <h3 className="text-2xl font-bold mb-6 text-white">Rubine des Feuers</h3>
            <p className="text-gray-300 text-lg leading-relaxed">Mythen um die feuerroten Rubine des Orients und ihre magischen Eigenschaften...</p>
          </div>
        </div>
      </div>

      {/* Container 2: Neue Edelsteine */}
      <div className="main-container">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white text-center">Neue Edelsteine</h2>
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