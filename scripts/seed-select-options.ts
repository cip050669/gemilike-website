import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding select options...');

  // Color options
  const colors = [
    { value: 'Rot', order: 1 },
    { value: 'Rosa', order: 2 },
    { value: 'Orange', order: 3 },
    { value: 'Gelb', order: 4 },
    { value: 'Grün', order: 5 },
    { value: 'Blau', order: 6 },
    { value: 'Violett', order: 7 },
    { value: 'Braun', order: 8 },
    { value: 'Schwarz', order: 9 },
    { value: 'Weiß', order: 10 },
    { value: 'Farblos', order: 11 },
    { value: 'Mehrfarbig', order: 12 },
    { value: 'Champagner', order: 13 },
    { value: 'Cognac', order: 14 },
    { value: 'Lavendel', order: 15 },
    { value: 'Pfirsich', order: 16 },
    { value: 'Mint', order: 17 },
    { value: 'Teal', order: 18 },
  ];

  for (const color of colors) {
    await prisma.selectOption.upsert({
      where: { category_value: { category: 'color', value: color.value } },
      update: { order: color.order },
      create: {
        category: 'color',
        value: color.value,
        order: color.order,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${colors.length} color options`);

  // Color Intensity options
  const colorIntensities = [
    { value: 'Blass', order: 1 },
    { value: 'Leicht', order: 2 },
    { value: 'Mittel', order: 3 },
    { value: 'Mittel-Intensiv', order: 4 },
    { value: 'Intensiv', order: 5 },
    { value: 'Vivid', order: 6 },
    { value: 'Deep', order: 7 },
    { value: 'Dunkel', order: 8 },
  ];

  for (const intensity of colorIntensities) {
    await prisma.selectOption.upsert({
      where: { category_value: { category: 'colorIntensity', value: intensity.value } },
      update: { order: intensity.order },
      create: {
        category: 'colorIntensity',
        value: intensity.value,
        order: intensity.order,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${colorIntensities.length} color intensity options`);

  // Treatment options
  const treatments = [
    { value: 'Unbehandelt', order: 1 },
    { value: 'Hitzebehandelt', order: 2 },
    { value: 'Bestrahlt', order: 3 },
    { value: 'Geölt', order: 4 },
    { value: 'Gefüllt', order: 5 },
    { value: 'Diffusionsbehandelt', order: 6 },
    { value: 'Farbverstärkt', order: 7 },
    { value: 'Beschichtet', order: 8 },
    { value: 'Gefärbt', order: 9 },
    { value: 'Laserbohren', order: 10 },
    { value: 'Fraktur gefüllt', order: 11 },
    { value: 'HPHT', order: 12 },
    { value: 'Synthetisch', order: 13 },
    { value: 'Labor gewachsen', order: 14 },
    { value: 'Unbekannt', order: 15 },
  ];

  for (const treatment of treatments) {
    await prisma.selectOption.upsert({
      where: { category_value: { category: 'treatment', value: treatment.value } },
      update: { order: treatment.order },
      create: {
        category: 'treatment',
        value: treatment.value,
        order: treatment.order,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${treatments.length} treatment options`);

  // Certification options
  const certifications = [
    { value: 'GIA', order: 1 },
    { value: 'IGI', order: 2 },
    { value: 'AGS', order: 3 },
    { value: 'HRD', order: 4 },
    { value: 'SSEF', order: 5 },
    { value: 'Gübelin', order: 6 },
    { value: 'GRS', order: 7 },
    { value: 'Lotus Gemology', order: 8 },
    { value: 'AGL', order: 9 },
    { value: 'GCS', order: 10 },
    { value: 'EGL', order: 11 },
    { value: 'DSEF', order: 12 },
    { value: 'GAGTL', order: 13 },
    { value: 'Keine Zertifizierung', order: 14 },
    { value: 'Andere', order: 15 },
  ];

  for (const cert of certifications) {
    await prisma.selectOption.upsert({
      where: { category_value: { category: 'certification', value: cert.value } },
      update: { order: cert.order },
      create: {
        category: 'certification',
        value: cert.value,
        order: cert.order,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${certifications.length} certification options`);

  // Rarity options
  const rarities = [
    { value: 'Sehr häufig', order: 1 },
    { value: 'Häufig', order: 2 },
    { value: 'Mäßig häufig', order: 3 },
    { value: 'Mäßig selten', order: 4 },
    { value: 'Selten', order: 5 },
    { value: 'Sehr selten', order: 6 },
    { value: 'Extrem selten', order: 7 },
    { value: 'Einzigartig', order: 8 },
  ];

  for (const rarity of rarities) {
    await prisma.selectOption.upsert({
      where: { category_value: { category: 'rarity', value: rarity.value } },
      update: { order: rarity.order },
      create: {
        category: 'rarity',
        value: rarity.value,
        order: rarity.order,
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${rarities.length} rarity options`);

  console.log('🎉 Select options seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding select options:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


