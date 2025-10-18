import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Edelstein-Typen mit Farben
const gemTypes = [
  { name: 'Diamond', color: '#FFFFFF', description: 'Diamant' },
  { name: 'Ruby', color: '#FF0000', description: 'Rubin' },
  { name: 'Sapphire', color: '#0000FF', description: 'Saphir' },
  { name: 'Emerald', color: '#00FF00', description: 'Smaragd' },
  { name: 'Tanzanite', color: '#8A2BE2', description: 'Tansanit' },
  { name: 'Opal', color: '#FFD700', description: 'Opal' },
  { name: 'Tourmaline', color: '#FF69B4', description: 'Turmalin' },
  { name: 'Garnet', color: '#DC143C', description: 'Granat' },
  { name: 'Spinel', color: '#FF1493', description: 'Spinell' },
  { name: 'Alexandrite', color: '#32CD32', description: 'Alexandrit' },
  { name: 'Zircon', color: '#87CEEB', description: 'Zirkon' },
  { name: 'Peridot', color: '#90EE90', description: 'Peridot' },
  { name: 'Aquamarine', color: '#00FFFF', description: 'Aquamarin' },
  { name: 'Topaz', color: '#FFA500', description: 'Topas' },
  { name: 'Jade', color: '#00FF7F', description: 'Jade' },
  { name: 'Demantoid', color: '#228B22', description: 'Demantoid' },
  { name: 'Uvarovite', color: '#006400', description: 'Uwarowit' },
  { name: 'Pearl', color: '#F0F8FF', description: 'Perle' }
];

// Länder mit Koordinaten
const countries = [
  { name: 'Südafrika', lat: -25.6703, lng: 28.5231, continent: 'Afrika' },
  { name: 'Botswana', lat: -22.3285, lng: 24.6849, continent: 'Afrika' },
  { name: 'Namibia', lat: -22.9576, lng: 18.4904, continent: 'Afrika' },
  { name: 'Tansania', lat: -6.3690, lng: 34.8888, continent: 'Afrika' },
  { name: 'Kenia', lat: -0.0236, lng: 37.9062, continent: 'Afrika' },
  { name: 'Uganda', lat: 1.0, lng: 32.0, continent: 'Afrika' },
  { name: 'Madagaskar', lat: -18.7669, lng: 46.8691, continent: 'Afrika' },
  { name: 'Mosambik', lat: -18.6657, lng: 35.5296, continent: 'Afrika' },
  { name: 'Sambia', lat: -13.1339, lng: 27.8493, continent: 'Afrika' },
  { name: 'Myanmar', lat: 22.0, lng: 96.0, continent: 'Asien' },
  { name: 'Thailand', lat: 15.8700, lng: 100.9925, continent: 'Asien' },
  { name: 'Sri Lanka', lat: 7.8731, lng: 80.7718, continent: 'Asien' },
  { name: 'Indien', lat: 20.5937, lng: 78.9629, continent: 'Asien' },
  { name: 'Vietnam', lat: 14.0583, lng: 108.2772, continent: 'Asien' },
  { name: 'Kambodscha', lat: 12.5657, lng: 104.9910, continent: 'Asien' },
  { name: 'Indonesien', lat: -0.7893, lng: 113.9213, continent: 'Asien' },
  { name: 'Philippinen', lat: 12.8797, lng: 121.7740, continent: 'Asien' },
  { name: 'Kolumbien', lat: 4.5709, lng: -74.2973, continent: 'Amerika' },
  { name: 'Brasilien', lat: -14.2350, lng: -51.9253, continent: 'Amerika' },
  { name: 'USA', lat: 37.0902, lng: -95.7129, continent: 'Amerika' },
  { name: 'Kanada', lat: 56.1304, lng: -106.3468, continent: 'Amerika' },
  { name: 'Australien', lat: -25.2744, lng: 133.7751, continent: 'Australien' },
  { name: 'Russland', lat: 61.5240, lng: 105.3188, continent: 'Europa' },
  { name: 'Tschechien', lat: 49.8175, lng: 15.4730, continent: 'Europa' },
  { name: 'Ägypten', lat: 26.0975, lng: 30.0444, continent: 'Afrika' },
  { name: 'Tadschikistan', lat: 38.8610, lng: 71.2761, continent: 'Asien' }
];

// Lagerstätten-Daten
const locations = [
  // Südafrika
  { country: 'Südafrika', name: 'Cullinan Mine', lat: -25.6703, lng: 28.5231, gem: 'Diamond', description: 'Heimat des größten Diamanten der Welt', mineType: 'open-pit', status: 'active' },
  { country: 'Südafrika', name: 'Jwaneng Mine', lat: -24.5, lng: 24.7, gem: 'Diamond', description: 'Eine der produktivsten Diamantminen', mineType: 'open-pit', status: 'active' },
  { country: 'Südafrika', name: 'Venetia Mine', lat: -22.4, lng: 29.3, gem: 'Diamond', description: 'Moderne Diamantmine', mineType: 'open-pit', status: 'active' },
  { country: 'Südafrika', name: 'Finsch Mine', lat: -28.2, lng: 23.1, gem: 'Diamond', description: 'Historische Diamantmine', mineType: 'underground', status: 'active' },
  { country: 'Südafrika', name: 'Somerset West', lat: -34.1, lng: 18.8, gem: 'Emerald', description: 'Smaragd-Vorkommen', mineType: 'primary', status: 'active' },
  { country: 'Südafrika', name: 'Northern Cape', lat: -29.0, lng: 22.0, gem: 'Garnet', description: 'Granat-Lagerstätte', mineType: 'primary', status: 'active' },
  { country: 'Südafrika', name: 'Kuruman', lat: -27.5, lng: 23.4, gem: 'Tourmaline', description: 'Turmalin-Vorkommen', mineType: 'primary', status: 'active' },
  { country: 'Südafrika', name: 'Steinkopf', lat: -29.3, lng: 17.7, gem: 'Tourmaline', description: 'Turmalin-Lagerstätte', mineType: 'primary', status: 'active' },

  // Uganda
  { country: 'Uganda', name: 'Karamoja', lat: 2.0, lng: 34.0, gem: 'Emerald', description: 'Smaragd-Vorkommen in Karamoja', mineType: 'primary', status: 'active' },
  { country: 'Uganda', name: 'Kampala Region', lat: 0.3, lng: 32.6, gem: 'Garnet', description: 'Granat-Lagerstätte', mineType: 'primary', status: 'active' },

  // Myanmar
  { country: 'Myanmar', name: 'Mogok Valley', lat: 22.9167, lng: 96.5167, gem: 'Ruby', description: 'Berühmt für die feinsten Rubine der Welt', mineType: 'primary', status: 'active' },
  { country: 'Myanmar', name: 'Mong Hsu', lat: 20.5, lng: 97.0, gem: 'Ruby', description: 'Moderne Rubin-Mine', mineType: 'underground', status: 'active' },
  { country: 'Myanmar', name: 'Namya', lat: 24.0, lng: 97.0, gem: 'Sapphire', description: 'Saphir-Vorkommen', mineType: 'alluvial', status: 'active' },
  { country: 'Myanmar', name: 'Kachin State', lat: 26.0, lng: 97.5, gem: 'Jade', description: 'Jade-Lagerstätte', mineType: 'primary', status: 'active' },

  // Weitere Länder...
  { country: 'Kolumbien', name: 'Muzo', lat: 5.5, lng: -74.0, gem: 'Emerald', description: 'Berühmte Smaragd-Mine', mineType: 'underground', status: 'active' },
  { country: 'Kolumbien', name: 'Chivor', lat: 5.0, lng: -73.5, gem: 'Emerald', description: 'Historische Smaragd-Mine', mineType: 'underground', status: 'active' },
  { country: 'Brasilien', name: 'Minas Gerais', lat: -19.0, lng: -43.0, gem: 'Emerald', description: 'Smaragd-Vorkommen', mineType: 'primary', status: 'active' },
  { country: 'Brasilien', name: 'Bahia', lat: -12.0, lng: -38.0, gem: 'Diamond', description: 'Diamant-Vorkommen', mineType: 'alluvial', status: 'active' },
  { country: 'Australien', name: 'Argyle Mine', lat: -18.0, lng: 128.0, gem: 'Diamond', description: 'Berühmte Diamant-Mine', mineType: 'open-pit', status: 'depleted' },
  { country: 'Russland', name: 'Ural Mountains', lat: 60.0, lng: 60.0, gem: 'Emerald', description: 'Smaragd-Vorkommen im Ural', mineType: 'primary', status: 'active' },
  { country: 'Tschechien', name: 'Bohemia', lat: 50.0, lng: 15.0, gem: 'Garnet', description: 'Granat-Lagerstätte', mineType: 'primary', status: 'active' }
];

async function seedWorldMap() {
  try {
    console.log('🌍 Seeding worldmap data...');

    // 1. Edelstein-Typen erstellen
    console.log('Creating gem types...');
    for (const gemType of gemTypes) {
      await prisma.gemType.upsert({
        where: { name: gemType.name },
        update: gemType,
        create: gemType
      });
    }

    // 2. Länder erstellen
    console.log('Creating countries...');
    for (const country of countries) {
      await prisma.country.upsert({
        where: { name: country.name },
        update: country,
        create: country
      });
    }

    // 3. Lagerstätten erstellen
    console.log('Creating locations...');
    for (const location of locations) {
      // Finde das Land
      const country = await prisma.country.findUnique({
        where: { name: location.country }
      });

      if (!country) {
        console.warn(`Country not found: ${location.country}`);
        continue;
      }

      // Finde den Edelstein-Typ
      const gemType = await prisma.gemType.findUnique({
        where: { name: location.gem }
      });

      if (!gemType) {
        console.warn(`Gem type not found: ${location.gem}`);
        continue;
      }

      // Prüfe ob die Lagerstätte bereits existiert
      const existingLocation = await prisma.location.findFirst({
        where: {
          name: location.name,
          countryId: country.id
        }
      });

      if (existingLocation) {
        // Aktualisiere bestehende Lagerstätte
        await prisma.location.update({
          where: { id: existingLocation.id },
          data: {
            lat: location.lat,
            lng: location.lng,
            description: location.description,
            mineType: location.mineType,
            status: location.status,
            gemTypeId: gemType.id
          }
        });
      } else {
        // Erstelle neue Lagerstätte
        await prisma.location.create({
          data: {
            name: location.name,
            lat: location.lat,
            lng: location.lng,
            description: location.description,
            mineType: location.mineType,
            status: location.status,
            countryId: country.id,
            gemTypeId: gemType.id
          }
        });
      }
    }

    console.log('✅ Worldmap data seeded successfully!');
    
    // Statistiken ausgeben
    const countryCount = await prisma.country.count();
    const locationCount = await prisma.location.count();
    const gemTypeCount = await prisma.gemType.count();
    
    console.log(`📊 Statistics:`);
    console.log(`   Countries: ${countryCount}`);
    console.log(`   Locations: ${locationCount}`);
    console.log(`   Gem Types: ${gemTypeCount}`);

  } catch (error) {
    console.error('❌ Error seeding worldmap data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Führe das Seed-Script aus
if (require.main === module) {
  seedWorldMap()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedWorldMap;
