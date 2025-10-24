import { prisma } from '@/lib/prisma';
import { WorldMapAdmin } from '@/components/admin/WorldMapAdmin';

export default async function WorldMapAdminPage() {
  // Lade alle Länder, Edelstein-Typen und Fundorte
  const countries = await prisma.country.findMany({
    orderBy: { name: 'asc' }
  });

  const gemTypes = await prisma.gemType.findMany({
    orderBy: { name: 'asc' }
  });

  const locations = await prisma.location.findMany({
    include: {
      country: true,
      gemType: true
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Weltkarte - Fundorte verwalten</h1>
          <p className="text-gray-300">
            Verwalten Sie die Fundorte der wichtigsten Edelsteine auf der interaktiven Weltkarte
          </p>
        </div>

        <WorldMapAdmin 
          countries={countries}
          gemTypes={gemTypes}
          locations={locations}
        />
      </div>
    </div>
  );
}