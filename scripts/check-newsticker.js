import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkNewsticker() {
  try {
    console.log('=== Newsticker Datenbank-Prüfung ===\n');
    
  // Alle Items holen
  const allItems = await prisma.newstickerItem.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  
  console.log(`Gesamt: ${allItems.length} Newsticker-Items gefunden\n`);
  
  if (allItems.length === 0) {
    console.log('⚠️  KEINE NEWSTICKER-ITEMS IN DER DATENBANK!');
    console.log('   Bitte erstellen Sie ein Newsticker-Item im Admin-Tool.\n');
    return;
  }
  
  // Aktuelle Zeit
  const now = new Date();
  console.log(`Aktuelle Zeit: ${now.toISOString()}\n`);
  
  // Items analysieren
  allItems.forEach((item, index) => {
    console.log(`\n--- Item ${index + 1} ---`);
    console.log(`ID: ${item.id}`);
    console.log(`Text: ${item.text}`);
    console.log(`Typ: ${item.type}`);
    console.log(`Priorität: ${item.priority}`);
    console.log(`Aktiv: ${item.isActive ? '✅ JA' : '❌ NEIN'}`);
    console.log(`Startdatum: ${item.startDate ? item.startDate.toISOString() : 'keines'}`);
    console.log(`Enddatum: ${item.endDate ? item.endDate.toISOString() : 'keines'}`);
    console.log(`Order: ${item.order}`);
    
    // Prüfe, ob das Item aktiv sein sollte
    const isStartValid = !item.startDate || item.startDate <= now;
    const isEndValid = !item.endDate || item.endDate >= now;
    const shouldBeActive = item.isActive && isStartValid && isEndValid;
    
    console.log(`\nFilter-Prüfung:`);
    console.log(`  - isActive: ${item.isActive ? '✅' : '❌'}`);
    console.log(`  - Startdatum gültig: ${isStartValid ? '✅' : '❌'} ${!isStartValid && item.startDate ? `(Start: ${item.startDate.toISOString()})` : ''}`);
    console.log(`  - Enddatum gültig: ${isEndValid ? '✅' : '❌'} ${!isEndValid && item.endDate ? `(Ende: ${item.endDate.toISOString()})` : ''}`);
    console.log(`  → Sollte angezeigt werden: ${shouldBeActive ? '✅ JA' : '❌ NEIN'}`);
    
    if (!shouldBeActive) {
      if (!item.isActive) {
        console.log(`  ⚠️  Grund: Item ist als inaktiv markiert`);
      } else if (!isStartValid) {
        console.log(`  ⚠️  Grund: Startdatum liegt in der Zukunft`);
      } else if (!isEndValid) {
        console.log(`  ⚠️  Grund: Enddatum liegt in der Vergangenheit`);
      }
    }
  });
  
  // Aktive Items mit Filter
  const activeItems = await prisma.newstickerItem.findMany({
    where: {
      isActive: true,
      AND: [
        {
          OR: [{ startDate: null }, { startDate: { lte: now } }],
        },
        {
          OR: [{ endDate: null }, { endDate: { gte: now } }],
        },
      ],
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
  
  console.log(`\n\n=== ZUSAMMENFASSUNG ===`);
  console.log(`Gesamt Items: ${allItems.length}`);
  console.log(`Aktive Items (nach Filter): ${activeItems.length}`);
  
  if (activeItems.length === 0) {
    console.log(`\n❌ PROBLEM: Keine aktiven Newsticker-Items gefunden!`);
    console.log(`   Der Newsticker wird auf der Startseite nicht angezeigt.`);
    console.log(`\nLösung:`);
    console.log(`   1. Gehen Sie zu /de/admin/newsticker`);
    console.log(`   2. Prüfen Sie, ob Items existieren`);
    console.log(`   3. Stellen Sie sicher, dass mindestens ein Item:`);
    console.log(`      - isActive = true hat`);
    console.log(`      - Kein Startdatum hat ODER Startdatum <= jetzt`);
    console.log(`      - Kein Enddatum hat ODER Enddatum >= jetzt`);
  } else {
    console.log(`\n✅ ${activeItems.length} aktive Item(s) gefunden - Newsticker sollte angezeigt werden`);
    activeItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.text}`);
    });
  }
  
  } catch (error) {
    console.error('Fehler beim Prüfen der Newsticker:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkNewsticker();

