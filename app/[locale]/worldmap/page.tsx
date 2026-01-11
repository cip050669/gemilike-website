import { prisma, withRetry } from '@/lib/prisma';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { WorldMapClient } from '@/components/worldmap/WorldMapClient';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';

export default async function WorldMapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isGerman = locale === 'de';
  const heading = isGerman ? 'Edelstein-Fundorte' : 'Gemstone Locations';
  const subheading = isGerman
    ? 'Entdecken Sie die wichtigsten Fundorte der 20 bedeutendsten Edelsteine auf unserer interaktiven Weltkarte'
    : 'Discover the key deposits of the 20 most significant gemstones on our interactive world map.';

  // Lade alle aktiven Fundorte mit ihren Daten (mit Retry-Logik für Verbindungsfehler)
  const locationRecords = await withRetry(() =>
    prisma.location.findMany({
      where: { isActive: true },
      include: {
        country: true,
        gemType: true
      },
      orderBy: { name: 'asc' }
    })
  ) as Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    description?: string | null;
    mineType?: string | null;
    status?: string | null;
    isActive: boolean;
    country: {
      id: string;
      name: string;
      lat: number;
      lng: number;
      continent?: string | null;
      isActive: boolean;
    };
    gemType: {
      id: string;
      name: string;
      color?: string | null;
      description?: string | null;
      isActive: boolean;
    };
  }>;

  // Lade alle Edelstein-Typen für die Legende (mit Retry-Logik für Verbindungsfehler)
  const gemTypeRecords = await withRetry(() =>
    prisma.gemType.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
  ) as Array<{
    id: string;
    name: string;
    color?: string | null;
    description?: string | null;
    isActive: boolean;
  }>;

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
      <div className="min-h-screen public-page-bg text-white pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimated direction="fade" delay={0}>
            <section className="main-container">
              <div className="story-card space-y-4 p-6 md:p-8">
                <div className="space-y-4 text-center">
                  <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                    <span className="gemilike-text-gradient">{heading}</span>
                  </h1>
                  <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
                    {subheading}
                  </p>
                </div>
              </div>
            </section>
          </ScrollAnimated>

          <ScrollAnimated direction="up" delay={100}>
            <section className="main-container mt-8">
              <WorldMapClient locations={locations} gemTypes={gemTypes} />
            </section>
          </ScrollAnimated>
        </div>
      </div>
    </PublicLayout>
  );
}
