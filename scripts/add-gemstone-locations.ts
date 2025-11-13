import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 10 Standorte für jeden Edelsteintyp
const locationsData = {
  Garnet: [
    { country: 'Namibia', name: 'Erongo Region Granat', lat: -21.5, lng: 15.5, description: 'Demantoid-Granat Vorkommen', mineType: 'primary', status: 'active' },
    { country: 'Tansania', name: 'Tunduru Granat', lat: -10.5, lng: 37.0, description: 'Verschiedene Granatarten', mineType: 'alluvial', status: 'active' },
    { country: 'Sri Lanka', name: 'Ratnapura Granat', lat: 6.6828, lng: 80.4019, description: 'Hessonit-Granat und andere Varianten', mineType: 'alluvial', status: 'active' },
    { country: 'Indien', name: 'Rajasthan Granat', lat: 27.0238, lng: 74.2179, description: 'Almandin-Granat Vorkommen', mineType: 'primary', status: 'active' },
    { country: 'Brasilien', name: 'Minas Gerais Granat', lat: -19.0, lng: -43.0, description: 'Spessartin-Granat Lagerstätte', mineType: 'primary', status: 'active' },
    { country: 'Madagaskar', name: 'Bekily Granat', lat: -24.2, lng: 45.3, description: 'Rhodolith-Granat Vorkommen', mineType: 'primary', status: 'active' },
    { country: 'USA', name: 'Idaho Stern-Granat', lat: 44.2405, lng: -114.4788, description: 'Stern-Granat Mine', mineType: 'primary', status: 'active' },
    { country: 'Russland', name: 'Ural Granat', lat: 60.0, lng: 60.0, description: 'Demantoid-Granat im Ural', mineType: 'primary', status: 'active' },
    { country: 'Tschechien', name: 'Böhmen Granat', lat: 50.0, lng: 15.0, description: 'Pyrop-Granat Lagerstätte', mineType: 'primary', status: 'active' },
    { country: 'Südafrika', name: 'Mpumalanga Granat', lat: -25.5, lng: 30.0, description: 'Tsavorit-Granat Vorkommen', mineType: 'primary', status: 'active' }
  ],
  Tourmaline: [
    { country: 'Brasilien', name: 'Minas Gerais Paraiba', lat: -6.0, lng: -37.0, description: 'Paraiba-Turmalin Mine', mineType: 'primary', status: 'active' },
    { country: 'Mosambik', name: 'Alto Ligonha Turmalin', lat: -15.0, lng: 37.5, description: 'Verschiedene Turmalinarten', mineType: 'primary', status: 'active' },
    { country: 'Afghanistan', name: 'Nuristan Turmalin', lat: 35.0, lng: 70.0, description: 'Grüne und blaue Turmaline', mineType: 'primary', status: 'active' },
    { country: 'Madagaskar', name: 'Anjanabonoina Turmalin', lat: -18.5, lng: 46.5, description: 'Rosa und grüne Turmaline', mineType: 'primary', status: 'active' },
    { country: 'USA', name: 'Pala Turmalin', lat: 33.4, lng: -117.1, description: 'Rosa Turmalin Mine', mineType: 'primary', status: 'active' },
    { country: 'Nigeria', name: 'Oyo Turmalin', lat: 7.8, lng: 4.0, description: 'Grüne Turmaline', mineType: 'primary', status: 'active' },
    { country: 'Tansania', name: 'Umba-Tal Turmalin', lat: -4.8, lng: 38.3, description: 'Verschiedene Farben', mineType: 'alluvial', status: 'active' },
    { country: 'Sri Lanka', name: 'Ratnapura Turmalin', lat: 6.6828, lng: 80.4019, description: 'Mehrfarbige Turmaline', mineType: 'alluvial', status: 'active' },
    { country: 'Pakistan', name: 'Gilgit-Baltistan Turmalin', lat: 35.5, lng: 75.0, description: 'Grüne Turmaline', mineType: 'primary', status: 'active' },
    { country: 'Namibia', name: 'Erongo Turmalin', lat: -21.5, lng: 15.5, description: 'Blaue und grüne Turmaline', mineType: 'primary', status: 'active' }
  ],
  Sapphire: [
    { country: 'Sri Lanka', name: 'Ratnapura Saphir', lat: 6.6828, lng: 80.4019, description: 'Blaue und gelbe Saphire', mineType: 'alluvial', status: 'active' },
    { country: 'Myanmar', name: 'Mogok Saphir', lat: 22.9167, lng: 96.5167, description: 'Hochwertige blaue Saphire', mineType: 'primary', status: 'active' },
    { country: 'Thailand', name: 'Chanthaburi Saphir', lat: 12.6, lng: 102.1, description: 'Blaue und gelbe Saphire', mineType: 'alluvial', status: 'active' },
    { country: 'Australien', name: 'New South Wales Saphir', lat: -30.0, lng: 151.0, description: 'Blaue Saphire', mineType: 'alluvial', status: 'active' },
    { country: 'Madagaskar', name: 'Ilakaka Saphir', lat: -22.6, lng: 45.0, description: 'Verschiedene Farben', mineType: 'alluvial', status: 'active' },
    { country: 'Tansania', name: 'Umba-Tal Saphir', lat: -4.8, lng: 38.3, description: 'Mehrfarbige Saphire', mineType: 'alluvial', status: 'active' },
    { country: 'USA', name: 'Montana Saphir', lat: 46.0, lng: -110.0, description: 'Blaue Saphire', mineType: 'alluvial', status: 'active' },
    { country: 'Kambodscha', name: 'Pailin Saphir', lat: 12.8, lng: 102.6, description: 'Blaue Saphire', mineType: 'alluvial', status: 'active' },
    { country: 'China', name: 'Shandong Saphir', lat: 36.0, lng: 120.0, description: 'Blaue Saphire', mineType: 'primary', status: 'active' },
    { country: 'Nigeria', name: 'Mambilla-Plateau Saphir', lat: 7.0, lng: 11.5, description: 'Blaue Saphire', mineType: 'primary', status: 'active' }
  ],
  Ruby: [
    { country: 'Myanmar', name: 'Mogok Valley Ruby', lat: 22.9167, lng: 96.5167, description: 'Taubenblut-Rubine', mineType: 'primary', status: 'active' },
    { country: 'Mosambik', name: 'Montepuez Ruby', lat: -13.0, lng: 39.0, description: 'Bedeutende Rubin-Vorkommen', mineType: 'primary', status: 'active' },
    { country: 'Thailand', name: 'Chanthaburi Ruby', lat: 12.6, lng: 102.1, description: 'Hochwertige Rubine', mineType: 'primary', status: 'active' },
    { country: 'Sri Lanka', name: 'Ratnapura Ruby', lat: 6.6828, lng: 80.4019, description: 'Rosa bis rote Rubine', mineType: 'alluvial', status: 'active' },
    { country: 'Tansania', name: 'Songea Ruby', lat: -10.7, lng: 35.6, description: 'Tiefrote Rubine', mineType: 'primary', status: 'active' },
    { country: 'Afghanistan', name: 'Jegdalek Ruby', lat: 34.0, lng: 69.0, description: 'Hochwertige Rubine', mineType: 'primary', status: 'active' },
    { country: 'Pakistan', name: 'Hunza-Tal Ruby', lat: 36.3, lng: 74.6, description: 'Rosa bis rote Rubine', mineType: 'primary', status: 'active' },
    { country: 'Indien', name: 'Kashmir Ruby', lat: 34.0, lng: 74.5, description: 'Seltene Rubine', mineType: 'primary', status: 'active' },
    { country: 'Vietnam', name: 'Luc Yen Ruby', lat: 22.0, lng: 105.0, description: 'Rote Rubine', mineType: 'primary', status: 'active' },
    { country: 'Grönland', name: 'Aappaluttoq Ruby', lat: 61.0, lng: -48.0, description: 'Neue Rubin-Vorkommen', mineType: 'primary', status: 'active' }
  ],
  Beryl: [
    { country: 'Kolumbien', name: 'Muzo Beryll', lat: 5.5, lng: -74.0, description: 'Hochwertige Smaragde (Beryll)', mineType: 'underground', status: 'active' },
    { country: 'Sambia', name: 'Kafubu Beryll', lat: -13.0, lng: 28.0, description: 'Bedeutende Smaragdvorkommen', mineType: 'primary', status: 'active' },
    { country: 'Brasilien', name: 'Minas Gerais Beryll', lat: -19.0, lng: -43.0, description: 'Aquamarin und Smaragd', mineType: 'primary', status: 'active' },
    { country: 'Madagaskar', name: 'Mananjary Beryll', lat: -21.2, lng: 48.3, description: 'Smaragde', mineType: 'primary', status: 'active' },
    { country: 'Pakistan', name: 'Swat-Tal Beryll', lat: 35.0, lng: 72.0, description: 'Smaragde', mineType: 'primary', status: 'active' },
    { country: 'Afghanistan', name: 'Panjshir-Tal Beryll', lat: 35.3, lng: 69.5, description: 'Smaragde', mineType: 'primary', status: 'active' },
    { country: 'Russland', name: 'Ural Beryll', lat: 60.0, lng: 60.0, description: 'Smaragde im Ural', mineType: 'primary', status: 'active' },
    { country: 'USA', name: 'North Carolina Beryll', lat: 35.5, lng: -80.0, description: 'Smaragde', mineType: 'primary', status: 'active' },
    { country: 'Australien', name: 'New England Beryll', lat: -30.0, lng: 152.0, description: 'Aquamarin', mineType: 'primary', status: 'active' },
    { country: 'China', name: 'Yunnan Beryll', lat: 25.0, lng: 102.0, description: 'Smaragde', mineType: 'primary', status: 'active' }
  ],
  Chrysoberyl: [
    { country: 'Russland', name: 'Ural Alexandrit', lat: 60.0, lng: 60.0, description: 'Ursprüngliche Alexandrit-Funde', mineType: 'primary', status: 'active' },
    { country: 'Brasilien', name: 'Minas Gerais Alexandrit', lat: -19.0, lng: -43.0, description: 'Bedeutende Alexandrit-Vorkommen', mineType: 'primary', status: 'active' },
    { country: 'Sri Lanka', name: 'Ratnapura Chrysoberyll', lat: 6.6828, lng: 80.4019, description: 'Alexandrit und Chrysoberyll', mineType: 'alluvial', status: 'active' },
    { country: 'Tansania', name: 'Tunduru Alexandrit', lat: -10.5, lng: 37.0, description: 'Alexandrit Vorkommen', mineType: 'alluvial', status: 'active' },
    { country: 'Indien', name: 'Andhra Pradesh Alexandrit', lat: 15.5, lng: 78.5, description: 'Alexandrit', mineType: 'primary', status: 'active' },
    { country: 'Madagaskar', name: 'Ilakaka Alexandrit', lat: -22.6, lng: 45.0, description: 'Alexandrit', mineType: 'alluvial', status: 'active' },
    { country: 'USA', name: 'Montana Alexandrit', lat: 46.0, lng: -110.0, description: 'Alexandrit', mineType: 'primary', status: 'active' },
    { country: 'Zimbabwe', name: 'Masvingo Alexandrit', lat: -20.0, lng: 31.0, description: 'Alexandrit', mineType: 'primary', status: 'active' },
    { country: 'Myanmar', name: 'Mogok Alexandrit', lat: 22.9167, lng: 96.5167, description: 'Alexandrit', mineType: 'primary', status: 'active' },
    { country: 'Mosambik', name: 'Alto Ligonha Alexandrit', lat: -15.0, lng: 37.5, description: 'Alexandrit', mineType: 'primary', status: 'active' }
  ]
};

// Zusätzliche Länder die noch nicht in der Datenbank sind
const additionalCountries = [
  { name: 'Afghanistan', lat: 33.9391, lng: 67.7100, continent: 'Asien' },
  { name: 'Nigeria', lat: 9.0820, lng: 8.6753, continent: 'Afrika' },
  { name: 'Pakistan', lat: 30.3753, lng: 69.3451, continent: 'Asien' },
  { name: 'China', lat: 35.8617, lng: 104.1954, continent: 'Asien' },
  { name: 'Grönland', lat: 71.7069, lng: -42.6043, continent: 'Amerika' },
  { name: 'Zimbabwe', lat: -19.0154, lng: 29.1549, continent: 'Afrika' }
];

async function addGemstoneLocations() {
  try {
    console.log('🌍 Starte Hinzufügen von Edelstein-Standorten...');

    // 1. Zusätzliche Länder erstellen
    console.log('Erstelle zusätzliche Länder...');
    for (const country of additionalCountries) {
      await prisma.country.upsert({
        where: { name: country.name },
        update: country,
        create: country
      });
    }

    // 2. Prüfe und erstelle fehlende Edelstein-Typen (falls nötig)
    console.log('Prüfe Edelstein-Typen...');

    // 3. Hole alle Edelstein-Typen
    const gemTypes = await prisma.gemType.findMany();
    const gemTypeMap = new Map(gemTypes.map(gt => [gt.name, gt]));

    // 4. Hole alle Länder
    const countries = await prisma.country.findMany();
    const countryMap = new Map(countries.map(c => [c.name, c]));

    // 5. Füge Standorte für jeden Edelsteintyp hinzu
    let totalAdded = 0;
    let totalSkipped = 0;

    for (const [gemTypeName, locations] of Object.entries(locationsData)) {
      const gemType = gemTypeMap.get(gemTypeName);
      
      if (!gemType) {
        console.warn(`⚠️  Edelstein-Typ nicht gefunden: ${gemTypeName}`);
        continue;
      }

      console.log(`\n📍 Füge Standorte für ${gemTypeName} hinzu...`);
      
      for (const location of locations) {
        const country = countryMap.get(location.country);
        
        if (!country) {
          console.warn(`⚠️  Land nicht gefunden: ${location.country}`);
          continue;
        }

        // Prüfe ob Standort bereits existiert
        const existingLocation = await prisma.location.findFirst({
          where: {
            name: location.name,
            countryId: country.id,
            gemTypeId: gemType.id
          }
        });

        if (existingLocation) {
          console.log(`   ⏭️  Überspringe: ${location.name} (bereits vorhanden)`);
          totalSkipped++;
          continue;
        }

        // Erstelle neuen Standort
        await prisma.location.create({
          data: {
            name: location.name,
            lat: location.lat,
            lng: location.lng,
            description: location.description,
            mineType: location.mineType,
            status: location.status,
            countryId: country.id,
            gemTypeId: gemType.id,
            isActive: true
          }
        });

        console.log(`   ✅ Hinzugefügt: ${location.name} (${location.country})`);
        totalAdded++;
      }
    }

    console.log('\n✅ Alle Standorte erfolgreich hinzugefügt!');
    console.log(`📊 Statistiken:`);
    console.log(`   Neu hinzugefügt: ${totalAdded}`);
    console.log(`   Übersprungen: ${totalSkipped}`);
    console.log(`   Gesamt: ${totalAdded + totalSkipped}`);

    // Finale Statistiken
    const finalLocationCount = await prisma.location.count({
      where: { isActive: true }
    });
    const finalGemTypeCount = await prisma.gemType.count({
      where: { isActive: true }
    });
    const finalCountryCount = await prisma.country.count({
      where: { isActive: true }
    });

    console.log(`\n📈 Finale Datenbank-Statistiken:`);
    console.log(`   Länder: ${finalCountryCount}`);
    console.log(`   Edelstein-Typen: ${finalGemTypeCount}`);
    console.log(`   Standorte: ${finalLocationCount}`);

  } catch (error) {
    console.error('❌ Fehler beim Hinzufügen der Standorte:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Führe das Script aus
if (require.main === module) {
  addGemstoneLocations()
    .then(() => {
      console.log('\n🎉 Script erfolgreich abgeschlossen!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script fehlgeschlagen:', error);
      process.exit(1);
    });
}

export default addGemstoneLocations;

