import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initFooterLinks() {
  const locale = 'de';

  // Erstelle Footer-Sections
  await prisma.footerSection.upsert({
    where: {
      section_locale: {
        section: 'about',
        locale,
      },
    },
    update: {
      title: 'Wer sind wir?',
    },
    create: {
      section: 'about',
      title: 'Wer sind wir?',
      locale,
    },
  });

  await prisma.footerSection.upsert({
    where: {
      section_locale: {
        section: 'legal',
        locale,
      },
    },
    update: {
      title: 'Rechtliches',
    },
    create: {
      section: 'legal',
      title: 'Rechtliches',
      locale,
    },
  });

  // Erstelle Footer-Links für "Wer sind wir?"
  const aboutLinks = [
    { text: 'Über uns', url: '/about', order: 0 },
    { text: 'Unsere Leistungen', url: '/services', order: 1 },
    { text: 'Wissenswertes', url: '/wissenswertes', order: 2 },
    { text: 'Kontakt', url: '/contact', order: 3 },
  ];

  for (const link of aboutLinks) {
    // Check if link exists
    const existing = await prisma.footerLink.findFirst({
      where: {
        url: link.url,
        section: 'about',
        locale,
      },
    });

    if (existing) {
      await prisma.footerLink.update({
        where: { id: existing.id },
        data: {
          text: link.text,
          url: link.url,
          order: link.order,
        },
      });
      console.log(`✓ Aktualisiert: ${link.text}`);
    } else {
      await prisma.footerLink.create({
        data: {
          text: link.text,
          url: link.url,
          section: 'about',
          order: link.order,
          locale,
          isActive: true,
        },
      });
      console.log(`✓ Erstellt: ${link.text}`);
    }
  }

  // Erstelle Footer-Links für "Rechtliches"
  const legalLinks = [
    { text: 'Impressum', url: '/impressum', order: 0 },
    { text: 'Datenschutz', url: '/datenschutz', order: 1 },
    { text: 'AGB', url: '/agb', order: 2 },
    { text: 'Widerruf', url: '/widerruf', order: 3 },
  ];

  for (const link of legalLinks) {
    // Check if link exists
    const existing = await prisma.footerLink.findFirst({
      where: {
        url: link.url,
        section: 'legal',
        locale,
      },
    });

    if (existing) {
      await prisma.footerLink.update({
        where: { id: existing.id },
        data: {
          text: link.text,
          url: link.url,
          order: link.order,
        },
      });
      console.log(`✓ Aktualisiert: ${link.text}`);
    } else {
      await prisma.footerLink.create({
        data: {
          text: link.text,
          url: link.url,
          section: 'legal',
          order: link.order,
          locale,
          isActive: true,
        },
      });
      console.log(`✓ Erstellt: ${link.text}`);
    }
  }

  console.log('✓ Footer-Links initialisiert');
}

initFooterLinks()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

