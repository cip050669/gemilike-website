import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 10 Standorte für Spinell
const spinelLocations = [
  { country: 'Myanmar', name: 'Mogok Spinell', lat: 22.9167, lng: 96.5167, description: 'Hochwertige rote Spinelle', mineType: 'primary', status: 'active' },
  { country: 'Sri Lanka', name: 'Ratnapura Spinell', lat: 6.6828, lng: 80.4019, description: 'Spinelle in verschiedenen Farben', mineType: 'alluvial', status: 'active' },
  { country: 'Tansania', name: 'Mahenge Spinell', lat: -8.0, lng: 36.5, description: 'Rote und pinkfarbene Spinelle von außergewöhnlicher Qualität', mineType: 'primary', status: 'active' },
  { country: 'Vietnam', name: 'Luc Yen Spinell', lat: 22.0, lng: 105.0, description: 'Große, rötlich-violette Spinellkristalle', mineType: 'primary', status: 'active' },
  { country: 'Tadschikistan', name: 'Kukh-i-Lal Spinell', lat: 38.5, lng: 70.5, description: 'Violette und rote Spinelle von hoher Schmucksteinqualität', mineType: 'primary', status: 'active' },
  { country: 'USA', name: 'Amity Spinell', lat: 41.0, lng: -74.0, description: 'Fundort von bis zu 14 kg schweren Spinellkristallen', mineType: 'primary', status: 'active' },
  { country: 'USA', name: 'Sterling Hill Spinell', lat: 41.1, lng: -74.6, description: 'Große Spinellkristalle', mineType: 'primary', status: 'active' },
  { country: 'Russland', name: 'Aldanhochland Spinell', lat: 58.0, lng: 125.0, description: 'Spinellkristalle der Varietät Pleonast mit bis zu 15 cm Größe', mineType: 'primary', status: 'active' },
  { country: 'Afghanistan', name: 'Ishkashim Spinell', lat: 36.7, lng: 71.6, description: 'Spinellvorkommen', mineType: 'primary', status: 'active' },
  { country: 'Afghanistan', name: 'Sorobi Spinell', lat: 34.5, lng: 69.0, description: 'Bedeutender Fundort für Spinelle', mineType: 'primary', status: 'active' }
];

async function addSpinelLocations() {
  try {
    console.log('💎 Starte Hinzufügen von Spinell-Standorten...\n');

    // 1. Prüfe ob Spinel existiert
    const spinelType = await prisma.gemType.findUnique({
      where: { name: 'Spinel' }
    });

    if (!spinelType) {
      console.error('❌ Edelstein-Typ "Spinel" nicht gefunden!');
      return;
    }

    console.log(`✅ Spinel gefunden: ${spinelType.name}\n`);

    // 2. Hole alle Länder
    const countries = await prisma.country.findMany();
    const countryMap = new Map(countries.map(c => [c.name, c]));

    // 3. Füge Standorte hinzu
    let totalAdded = 0;
    let totalSkipped = 0;

    console.log('📍 Füge Spinell-Standorte hinzu...\n');

    for (const location of spinelLocations) {
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
          gemTypeId: spinelType.id
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
          gemTypeId: spinelType.id,
          isActive: true
        }
      });

      console.log(`   ✅ Hinzugefügt: ${location.name} (${location.country})`);
      totalAdded++;
    }

    console.log('\n✅ Spinell-Standorte erfolgreich hinzugefügt!');
    console.log(`📊 Statistiken:`);
    console.log(`   Neu hinzugefügt: ${totalAdded}`);
    console.log(`   Übersprungen: ${totalSkipped}`);
    console.log(`   Gesamt: ${totalAdded + totalSkipped}`);

    // Finale Statistiken
    const finalSpinelCount = await prisma.location.count({
      where: {
        isActive: true,
        gemTypeId: spinelType.id
      }
    });

    console.log(`\n💎 Spinell-Standorte in Datenbank: ${finalSpinelCount}`);

  } catch (error) {
    console.error('❌ Fehler beim Hinzufügen der Spinell-Standorte:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Führe das Script aus
if (require.main === module) {
  addSpinelLocations()
    .then(() => {
      console.log('\n🎉 Script erfolgreich abgeschlossen!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script fehlgeschlagen:', error);
      process.exit(1);
    });
}

export default addSpinelLocations;

