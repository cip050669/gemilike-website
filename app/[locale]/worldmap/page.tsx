import { prisma } from '@/lib/prisma';
import { InteractiveWorldMap } from '@/components/worldmap/InteractiveWorldMap';
import Link from 'next/link';
import { ArrowLeftIcon } from 'lucide-react';

export default async function WorldMapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Lade alle aktiven Fundorte mit ihren Daten
  const locationRecords = await prisma.location.findMany({
    where: { isActive: true },
    include: {
      country: true,
      gemType: true
    },
    orderBy: { name: 'asc' }
  });

  // Lade alle Edelstein-Typen für die Legende
  const gemTypeRecords = await prisma.gemType.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  });

  const locations = locationRecords.map((location) => ({
    ...location,
    description: location.description ?? undefined,
    mineType: location.mineType ?? undefined,
    status: location.status ?? undefined,
    country: {
      ...location.country,
      continent: location.country.continent ?? undefined,
    },
    gemType: {
      ...location.gemType,
      color: location.gemType.color ?? undefined,
      description: location.gemType.description ?? undefined,
    },
  }));

  const gemTypes = gemTypeRecords.map((gemType) => ({
    ...gemType,
    color: gemType.color ?? undefined,
    description: gemType.description ?? undefined,
  }));

  return (
    <div className="min-h-screen public-page-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link 
              href="/de" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors border border-white/20 rounded-lg hover:bg-white/10"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Zurück zur Startseite
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="gradient-text animate-glow">Edelstein-Fundorte</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entdecken Sie die wichtigsten Fundorte der 20 bedeutendsten Edelsteine auf unserer interaktiven Weltkarte
          </p>
        </div>

        <InteractiveWorldMap locations={locations} gemTypes={gemTypes} />
      </div>
    </div>
  );
}
