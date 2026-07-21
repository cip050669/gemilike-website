import './env-bootstrap';

import { GemstoneCondition, GemstoneStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import seedWorldMap from './seed-worldmap';

async function seedHeroSettings() {
  const shouldResetHero = process.env.RESET_HERO_SETTINGS === '1';
  const existingHero = await prisma.heroSettings.findUnique({
    where: { id: 'singleton' },
  });

  if (existingHero && !shouldResetHero) {
    console.log('⏭️ Hero settings already exist. Skipping overwrite.');
    return;
  }

  await prisma.heroSettings.upsert({
    where: { id: 'singleton' },
    update: {
      title: 'Schätze aus aller Welt',
      titleLine2: 'Handverlesene Edelsteine für Sammler:innen',
      subtitle:
        'Entdecken Sie einzigartig zertifizierte Edelsteine, kuratiert nach Herkunft, Qualität und Geschichte.',
      imageUrl: '/images/hero-fallback.jpg',
      primaryButtonText: 'Zum Shop',
      primaryButtonLink: '/shop',
      secondaryButtonText: 'Kontakt aufnehmen',
      secondaryButtonLink: '/contact',
    },
    create: {
      id: 'singleton',
      title: 'Schätze aus aller Welt',
      titleLine2: 'Handverlesene Edelsteine für Sammler:innen',
      subtitle:
        'Entdecken Sie einzigartig zertifizierte Edelsteine, kuratiert nach Herkunft, Qualität und Geschichte.',
      imageUrl: '/images/hero-fallback.jpg',
      primaryButtonText: 'Zum Shop',
      primaryButtonLink: '/shop',
      secondaryButtonText: 'Kontakt aufnehmen',
      secondaryButtonLink: '/contact',
    },
  });
}

async function seedSelectOptions() {
  const cutOptions = [
    { value: 'Brillant', label: 'Brillantschliff' },
    { value: 'Princess', label: 'Princess-Schliff' },
    { value: 'Emerald', label: 'Emerald-Schliff' },
    { value: 'Oval', label: 'Ovaler Schliff' },
    { value: 'Cushion', label: 'Kissenschliff' },
  ];

  const formOptions = [
    { value: 'Rund', label: 'Rund' },
    { value: 'Oval', label: 'Oval' },
    { value: 'Kissen', label: 'Kissen' },
    { value: 'Herz', label: 'Herz' },
    { value: 'Tropfen', label: 'Tropfen' },
  ];

  await prisma.selectOption.deleteMany({
    where: { category: { in: ['cut', 'form'] } },
  });

  await prisma.selectOption.createMany({
    data: [
      ...cutOptions.map((option, index) => ({
        category: 'cut',
        value: option.value,
        label: option.label,
        order: index,
        isActive: true,
      })),
      ...formOptions.map((option, index) => ({
        category: 'form',
        value: option.value,
        label: option.label,
        order: index,
        isActive: true,
      })),
    ],
  });
}

async function seedGemstones() {
  const shouldResetCatalog = process.env.RESET_GEMSTONE_CATALOG === '1';
  const existingCount = await prisma.gemstone.count();

  if (existingCount > 0 && !shouldResetCatalog) {
    console.log(
      `⏭️ Gemstone catalog already contains ${existingCount} entries. ` +
        'Skipping demo overwrite. Set RESET_GEMSTONE_CATALOG=1 to replace it.'
    );
    return;
  }

  if (shouldResetCatalog) {
    await prisma.wishlistItem.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.gemstonePrice.deleteMany();
    await prisma.gemstoneMedia.deleteMany();
    await prisma.gemstoneAttributes.deleteMany();
    await prisma.gemstoneInventory.deleteMany();
    await prisma.gemstone.deleteMany();
  }

  const gemstones = [
    {
      slug: 'emerald-aurora',
      status: GemstoneStatus.PUBLISHED,
      category: 'Smaragd',
      name: 'Emerald Aurora',
      shortDescription: 'Intensiv grüner Smaragd aus Kolumbien mit lebhaftem Funkeln.',
      longDescription:
        'Ein sorgfältig facettierter Smaragd in erlesener Qualität. Seine tiefgrüne Farbe mit hoher Transparenz macht ihn zu einem Highlight für jede Sammlung.',
      origin: 'Kolumbien',
      condition: GemstoneCondition.CUT,
      isNew: true,
      isSold: false,
      featured: true,
      cut: 'Brillant',
      cutForm: 'Oval',
      publishedAt: new Date(),
      inventory: {
        create: {
          condition: GemstoneCondition.CUT,
          caratWeight: '2.34',
          quantity: 1,
          warehouseLocation: 'Berlin-01',
        },
      },
      attributes: {
        create: {
          lengthMm: '8.2',
          widthMm: '5.9',
          heightMm: '4.1',
          color: 'Smaragdgrün',
          colorSaturation: 'Intense',
          clarity: 'VS1',
          cutGrade: 'Excellent',
          treatment: 'Geölt',
          certification: 'GIA',
        },
      },
      priceBooks: {
        create: {
          currency: 'EUR',
          priceNet: '5200',
          priceGross: '6188',
          taxRate: '19',
        },
      },
      media: {
        create: [
          {
            url: '/products/placeholder-gem.jpg',
            isPrimary: true,
            position: 0,
          },
          {
            url: '/products/placeholder-gem.jpg',
            isPrimary: false,
            position: 1,
          },
        ],
      },
    },
    {
      slug: 'ruby-flame',
      status: GemstoneStatus.PUBLISHED,
      category: 'Rubin',
      name: 'Ruby Flame',
      shortDescription: 'Thailändischer Rubin mit warmem Rot und klassischem Princess-Schliff.',
      longDescription:
        'Dieser Rubin besticht durch sein intensives Rot und saubere Facetten. Perfekt für feinste Schmuckstücke oder als Anlageobjekt.',
      origin: 'Thailand',
      condition: GemstoneCondition.CUT,
      isNew: false,
      isSold: false,
      featured: true,
      cut: 'Princess',
      cutForm: 'Rund',
      publishedAt: new Date(),
      inventory: {
        create: {
          condition: GemstoneCondition.CUT,
          caratWeight: '1.78',
          quantity: 1,
          warehouseLocation: 'Berlin-02',
        },
      },
      attributes: {
        create: {
          lengthMm: '6.1',
          widthMm: '6.0',
          heightMm: '4.0',
          color: 'Rot',
          colorSaturation: 'Vivid',
          clarity: 'VS2',
          cutGrade: 'Very Good',
          treatment: 'Erhitzt',
          certification: 'IGI',
        },
      },
      priceBooks: {
        create: {
          currency: 'EUR',
          priceNet: '4100',
          priceGross: '4879',
          taxRate: '19',
        },
      },
      media: {
        create: [
          {
            url: '/products/placeholder-gem.jpg',
            isPrimary: true,
            position: 0,
          },
        ],
      },
    },
    {
      slug: 'sapphire-dawn',
      status: GemstoneStatus.PUBLISHED,
      category: 'Saphir',
      name: 'Sapphire Dawn',
      shortDescription: 'Unbehandelter Rohsaphir aus Madagaskar mit natürlicher Form.',
      longDescription:
        'Ein authentischer Rohsaphir, der die natürliche Schönheit des Gesteins zeigt. Ideal für Sammler:innen, die Ursprünglichkeit schätzen.',
      origin: 'Madagaskar',
      condition: GemstoneCondition.ROUGH,
      isNew: false,
      isSold: false,
      featured: false,
      cut: null,
      cutForm: null,
      publishedAt: new Date(),
      inventory: {
        create: {
          condition: GemstoneCondition.ROUGH,
          gramWeight: '12.6',
          quantity: 1,
          warehouseLocation: 'Berlin-03',
        },
      },
      attributes: {
        create: {
          lengthMm: '18.4',
          widthMm: '11.2',
          heightMm: '9.7',
          color: 'Blau',
          colorSaturation: 'Medium',
          clarity: 'Included',
          treatment: 'Keine Behandlung',
        },
      },
      priceBooks: {
        create: {
          currency: 'EUR',
          priceNet: '950',
          priceGross: '1130.5',
          taxRate: '19',
        },
      },
      media: {
        create: [
          {
            url: '/products/placeholder-gem.jpg',
            isPrimary: true,
            position: 0,
          },
        ],
      },
    },
  ];

  for (const data of gemstones) {
    await prisma.gemstone.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    });
  }
}

async function main() {
  console.log('🌱 Seeding database...');
  await seedHeroSettings();
  await seedSelectOptions();
  await seedGemstones();
  await seedWorldMap();
  console.log('✅ Seed completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    // pg Pool (Prisma adapter) keeps the process alive after $disconnect
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('❌ Seed failed:', error);
    try {
      await prisma.$disconnect();
    } catch {
      // ignore disconnect errors on failure path
    }
    process.exit(1);
  });
