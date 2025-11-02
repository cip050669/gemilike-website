/**
 * Migration Script: Import AboutContent from i18n messages to Database
 * 
 * Usage: npx tsx scripts/import-about-content.ts
 */

import { prisma } from '../lib/prisma';
import deMessages from '../messages/de.json';
import enMessages from '../messages/en.json';

async function importAboutContent() {
  try {
    console.log('📝 Starting AboutContent migration from i18n to DB...');

    const sections = [
      'title',
      'subtitle',
      'intro1',
      'intro2',
      'mission',
      'missionDesc',
      'values',
      'valuesDesc',
      'expertise',
      'expertiseDesc',
      'quality',
      'qualityDesc',
    ];

    let imported = 0;
    let updated = 0;

    // Import German (de) content
    console.log('\n🇩🇪 Importing German content...');
    for (const section of sections) {
      const content = (deMessages.about as any)[section];
      if (!content) {
        console.log(`⚠️  Warning: Missing section '${section}' in German messages`);
        continue;
      }

      await prisma.aboutContent.upsert({
        where: {
          section_locale: {
            section,
            locale: 'de',
          },
        },
        update: {
          content,
          isActive: true,
        },
        create: {
          section,
          content,
          locale: 'de',
          order: sections.indexOf(section),
          isActive: true,
        },
      });

      console.log(`✅ ${section} (de)`);
      imported++;
    }

    // Import English (en) content if available
    if (enMessages.about) {
      console.log('\n🇬🇧 Importing English content...');
      for (const section of sections) {
        const content = (enMessages.about as any)[section];
        if (!content) {
          console.log(`⚠️  Warning: Missing section '${section}' in English messages`);
          continue;
        }

        await prisma.aboutContent.upsert({
          where: {
            section_locale: {
              section,
              locale: 'en',
            },
          },
          update: {
            content,
            isActive: true,
          },
          create: {
            section,
            content,
            locale: 'en',
            order: sections.indexOf(section),
            isActive: true,
          },
        });

        console.log(`✅ ${section} (en)`);
        updated++;
      }
    }

    // Import Services for German
    console.log('\n🔧 Importing Services (German)...');
    const services = [
      {
        slug: 'rough',
        title: deMessages.services.rough,
        description: deMessages.services.roughDesc,
        icon: 'Mountain',
        features: ['Smaragde', 'Rubine', 'Saphire', 'Turmaline', 'Aquamarine', 'Weitere Raritäten'],
        order: 0,
      },
      {
        slug: 'cut',
        title: deMessages.services.cut,
        description: deMessages.services.cutDesc,
        icon: 'Diamond',
        features: ['Brillantschliff', 'Facettenschliff', 'Cabochon', 'Fantasieschliffe'],
        order: 1,
      },
      {
        slug: 'diamonds',
        title: deMessages.services.diamonds,
        description: deMessages.services.diamondsDesc,
        icon: 'Sparkles',
        features: ['Brillanten', 'Farbdiamanten', 'Zertifikate', 'Individuelle Auswahl'],
        order: 2,
      },
      {
        slug: 'colored',
        title: deMessages.services.colored,
        description: deMessages.services.coloredDesc,
        icon: 'Gem',
        features: ['Smaragde', 'Rubine', 'Saphire', 'Opale', 'Tansanite', 'Paraiba'],
        order: 3,
      },
      {
        slug: 'collector',
        title: deMessages.services.collector,
        description: deMessages.services.collectorDesc,
        icon: 'Award',
        features: ['Museumsstücke', 'Seltene Fundstücke', 'Zertifiziert', 'Dokumentiert'],
        order: 4,
      },
      {
        slug: 'wholesale',
        title: deMessages.services.wholesale,
        description: deMessages.services.wholesaleDesc,
        icon: 'Package',
        features: ['Großmengen', 'Individuelle Auswahl', 'Faire Preise', 'Zuverlässige Lieferung'],
        order: 5,
      },
    ];

    for (const service of services) {
      await prisma.service.upsert({
        where: {
          slug_locale: {
            slug: service.slug,
            locale: 'de',
          },
        },
        update: {
          title: service.title,
          description: service.description,
          icon: service.icon,
          features: service.features,
          order: service.order,
          isActive: true,
        },
        create: {
          slug: service.slug,
          title: service.title,
          description: service.description,
          icon: service.icon,
          features: service.features,
          order: service.order,
          locale: 'de',
          isActive: true,
        },
      });

      console.log(`✅ Service: ${service.title}`);
      imported++;
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Imported/Updated: ${imported + updated}`);
    console.log('✨ Migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

importAboutContent();

