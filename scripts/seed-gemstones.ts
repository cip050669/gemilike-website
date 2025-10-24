import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Die 20 wichtigsten Edelsteine mit ihren typischen Fundorten
const gemstonesData = [
  {
    name: 'Diamant',
    color: '#E6E6FA',
    description: 'Der härteste bekannte Edelstein',
    locations: [
      { name: 'Kimberley Mine', country: 'Südafrika', lat: -28.7383, lng: 24.7633, mineType: 'underground' },
      { name: 'Mir Mine', country: 'Russland', lat: 62.5240, lng: 113.9930, mineType: 'open-pit' },
      { name: 'Argyle Mine', country: 'Australien', lat: -17.3314, lng: 128.0070, mineType: 'open-pit' },
      { name: 'Cullinan Mine', country: 'Südafrika', lat: -25.6703, lng: 28.5236, mineType: 'underground' }
    ]
  },
  {
    name: 'Rubin',
    color: '#DC143C',
    description: 'Roter Edelstein aus der Korund-Familie',
    locations: [
      { name: 'Mogok Valley', country: 'Myanmar', lat: 22.9170, lng: 96.5097, mineType: 'primary' },
      { name: 'Winza Mine', country: 'Tansania', lat: -4.8333, lng: 33.8333, mineType: 'primary' },
      { name: 'Mong Hsu', country: 'Myanmar', lat: 20.8333, lng: 97.4167, mineType: 'primary' }
    ]
  },
  {
    name: 'Smaragd',
    color: '#50C878',
    description: 'Grüner Edelstein aus der Beryll-Familie',
    locations: [
      { name: 'Muzo Mine', country: 'Kolumbien', lat: 5.5311, lng: -74.1081, mineType: 'underground' },
      { name: 'Chivor Mine', country: 'Kolumbien', lat: 4.8889, lng: -73.3681, mineType: 'underground' },
      { name: 'Zambia Emerald', country: 'Sambia', lat: -13.1339, lng: 28.4081, mineType: 'primary' }
    ]
  },
  {
    name: 'Saphir',
    color: '#0F52BA',
    description: 'Blauer Edelstein aus der Korund-Familie',
    locations: [
      { name: 'Kashmir Sapphire', country: 'Indien', lat: 34.0837, lng: 75.4173, mineType: 'primary' },
      { name: 'Ceylon Sapphire', country: 'Sri Lanka', lat: 7.8731, lng: 80.7718, mineType: 'alluvial' },
      { name: 'Montana Sapphire', country: 'USA', lat: 45.2551, lng: -112.1540, mineType: 'alluvial' }
    ]
  },
  {
    name: 'Opal',
    color: '#A8E6CF',
    description: 'Bunt schillernder Edelstein',
    locations: [
      { name: 'Coober Pedy', country: 'Australien', lat: -29.0134, lng: 134.7545, mineType: 'underground' },
      { name: 'Lightning Ridge', country: 'Australien', lat: -29.4289, lng: 147.9789, mineType: 'underground' },
      { name: 'Virgin Valley', country: 'USA', lat: 41.8333, lng: -118.3333, mineType: 'open-pit' }
    ]
  },
  {
    name: 'Tanzanit',
    color: '#9370DB',
    description: 'Blau-violetter Edelstein aus Tansania',
    locations: [
      { name: 'Merelani Hills', country: 'Tansania', lat: -3.5833, lng: 36.7500, mineType: 'underground' }
    ]
  },
  {
    name: 'Alexandrit',
    color: '#00CED1',
    description: 'Farbwechselnder Edelstein',
    locations: [
      { name: 'Ural Mountains', country: 'Russland', lat: 56.8431, lng: 60.6454, mineType: 'primary' },
      { name: 'Hematita Mine', country: 'Brasilien', lat: -19.9167, lng: -43.9333, mineType: 'primary' }
    ]
  },
  {
    name: 'Aquamarin',
    color: '#7FFFD4',
    description: 'Blau-grüner Beryll',
    locations: [
      { name: 'Santa Maria', country: 'Brasilien', lat: -19.9167, lng: -43.9333, mineType: 'primary' },
      { name: 'Karur Aquamarine', country: 'Indien', lat: 10.9500, lng: 78.0833, mineType: 'primary' }
    ]
  },
  {
    name: 'Topas',
    color: '#FFD700',
    description: 'Gelber bis farbloser Edelstein',
    locations: [
      { name: 'Ouro Preto', country: 'Brasilien', lat: -20.3856, lng: -43.5036, mineType: 'primary' },
      { name: 'Schneckenstein', country: 'Deutschland', lat: 50.4333, lng: 12.3167, mineType: 'primary' }
    ]
  },
  {
    name: 'Amethyst',
    color: '#9966CC',
    description: 'Violetter Quarz',
    locations: [
      { name: 'Rio Grande do Sul', country: 'Brasilien', lat: -30.0346, lng: -51.2177, mineType: 'primary' },
      { name: 'Uruguay Amethyst', country: 'Uruguay', lat: -32.5228, lng: -55.7658, mineType: 'primary' }
    ]
  },
  {
    name: 'Citrin',
    color: '#FFFF00',
    description: 'Gelber Quarz',
    locations: [
      { name: 'Rio Grande do Sul', country: 'Brasilien', lat: -30.0346, lng: -51.2177, mineType: 'primary' }
    ]
  },
  {
    name: 'Peridot',
    color: '#98FB98',
    description: 'Olivgrüner Olivin',
    locations: [
      { name: 'Zabargad Island', country: 'Ägypten', lat: 23.6333, lng: 36.2000, mineType: 'primary' },
      { name: 'Arizona Peridot', country: 'USA', lat: 33.4484, lng: -112.0740, mineType: 'primary' }
    ]
  },
  {
    name: 'Garnet',
    color: '#FF4500',
    description: 'Roter Granat',
    locations: [
      { name: 'Bohemian Garnet', country: 'Tschechien', lat: 50.0755, lng: 14.4378, mineType: 'primary' },
      { name: 'Arizona Garnet', country: 'USA', lat: 33.4484, lng: -112.0740, mineType: 'primary' }
    ]
  },
  {
    name: 'Turmalin',
    color: '#FF69B4',
    description: 'Bunter Edelstein',
    locations: [
      { name: 'Paraiba Tourmaline', country: 'Brasilien', lat: -7.1195, lng: -37.1200, mineType: 'primary' },
      { name: 'California Tourmaline', country: 'USA', lat: 36.7783, lng: -119.4179, mineType: 'primary' }
    ]
  },
  {
    name: 'Zirkon',
    color: '#F0E68C',
    description: 'Farbiger Zirkon',
    locations: [
      { name: 'Cambodia Zircon', country: 'Kambodscha', lat: 12.5657, lng: 104.9910, mineType: 'alluvial' },
      { name: 'Sri Lanka Zircon', country: 'Sri Lanka', lat: 7.8731, lng: 80.7718, mineType: 'alluvial' }
    ]
  },
  {
    name: 'Spinel',
    color: '#FF1493',
    description: 'Roter Spinell',
    locations: [
      { name: 'Mogok Spinel', country: 'Myanmar', lat: 22.9170, lng: 96.5097, mineType: 'primary' },
      { name: 'Tajikistan Spinel', country: 'Tadschikistan', lat: 38.5358, lng: 68.7791, mineType: 'primary' }
    ]
  },
  {
    name: 'Iolith',
    color: '#8A2BE2',
    description: 'Violetter Cordierit',
    locations: [
      { name: 'Sri Lanka Iolite', country: 'Sri Lanka', lat: 7.8731, lng: 80.7718, mineType: 'alluvial' },
      { name: 'Madagascar Iolite', country: 'Madagaskar', lat: -18.7669, lng: 46.8691, mineType: 'primary' }
    ]
  },
  {
    name: 'Kunzit',
    color: '#FFB6C1',
    description: 'Rosa Spodumen',
    locations: [
      { name: 'Afghanistan Kunzite', country: 'Afghanistan', lat: 33.9391, lng: 67.7100, mineType: 'primary' },
      { name: 'Brazil Kunzite', country: 'Brasilien', lat: -19.9167, lng: -43.9333, mineType: 'primary' }
    ]
  },
  {
    name: 'Morganit',
    color: '#FFC0CB',
    description: 'Rosa Beryll',
    locations: [
      { name: 'Maine Morganite', country: 'USA', lat: 44.6939, lng: -69.3819, mineType: 'primary' },
      { name: 'Brazil Morganite', country: 'Brasilien', lat: -19.9167, lng: -43.9333, mineType: 'primary' }
    ]
  },
  {
    name: 'Tansanit',
    color: '#9370DB',
    description: 'Blau-violetter Zoisit',
    locations: [
      { name: 'Merelani Hills', country: 'Tansania', lat: -3.5833, lng: 36.7500, mineType: 'underground' }
    ]
  }
];

async function seedGemstones() {
  try {
    console.log('🌍 Starte Seeding der Edelstein-Fundorte...');

    // Erstelle Länder
    const countries = new Map();
    for (const gemstone of gemstonesData) {
      for (const location of gemstone.locations) {
        if (!countries.has(location.country)) {
          const country = await prisma.country.upsert({
            where: { name: location.country },
            update: {},
            create: {
              name: location.country,
              lat: location.lat,
              lng: location.lng,
              isActive: true
            }
          });
          countries.set(location.country, country);
        }
      }
    }

    // Erstelle Edelstein-Typen
    const gemTypes = new Map();
    for (const gemstone of gemstonesData) {
      const gemType = await prisma.gemType.upsert({
        where: { name: gemstone.name },
        update: {
          color: gemstone.color,
          description: gemstone.description
        },
        create: {
          name: gemstone.name,
          color: gemstone.color,
          description: gemstone.description,
          isActive: true
        }
      });
      gemTypes.set(gemstone.name, gemType);
    }

    // Erstelle Fundorte
    for (const gemstone of gemstonesData) {
      for (const location of gemstone.locations) {
        const country = countries.get(location.country);
        const gemType = gemTypes.get(gemstone.name);

        await prisma.location.upsert({
          where: {
            name_countryId: {
              name: location.name,
              countryId: country.id
            }
          },
          update: {
            lat: location.lat,
            lng: location.lng,
            mineType: location.mineType,
            gemTypeId: gemType.id,
            isActive: true
          },
          create: {
            name: location.name,
            lat: location.lat,
            lng: location.lng,
            mineType: location.mineType,
            status: 'active',
            countryId: country.id,
            gemTypeId: gemType.id,
            isActive: true
          }
        });
      }
    }

    console.log('✅ Edelstein-Fundorte erfolgreich geladen!');
    console.log(`📊 ${countries.size} Länder erstellt`);
    console.log(`💎 ${gemTypes.size} Edelstein-Typen erstellt`);
    console.log(`📍 ${gemstonesData.reduce((sum, g) => sum + g.locations.length, 0)} Fundorte erstellt`);

  } catch (error) {
    console.error('❌ Fehler beim Seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedGemstones();
