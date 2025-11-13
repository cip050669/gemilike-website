import { prisma } from '@/lib/prisma';
import { InteractiveWorldMap } from '@/components/worldmap/InteractiveWorldMap';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default async function WorldMapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isGerman = locale === 'de';
  const heading = isGerman ? 'Edelstein-Fundorte' : 'Gemstone Locations';
  const subheading = isGerman
    ? 'Entdecken Sie die wichtigsten Fundorte der 20 bedeutendsten Edelsteine auf unserer interaktiven Weltkarte'
    : 'Discover the key deposits of the 20 most significant gemstones on our interactive world map.';

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
    <PublicLayout>
      <div className="public-page-bg text-foreground">
        <div className="container py-12 md:py-20 space-y-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text animate-glow">{heading}</span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {subheading}
            </p>
          </div>

          <InteractiveWorldMap locations={locations} gemTypes={gemTypes} />
        </div>
      </div>
    </PublicLayout>
  );
}
