import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

// Globale Prisma-Instanz
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  
  try {
    // Authentifizierung - in Entwicklung optional
    const session = await getServerSession(authOptions);
    if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hole Footer-Daten aus der Datenbank (mit Fallback)
    let footerData, sections, legalLinks, contactData;
    
    try {
      footerData = await prisma.footerData.findFirst();
      sections = await prisma.footerSection.findMany({
        include: {
          links: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      });
      legalLinks = await prisma.legalLink.findMany({
        orderBy: { order: 'asc' }
      });
      // Hole zentrale Kontaktdaten
      contactData = await prisma.contactData.findFirst();
    } catch (dbError) {
      console.log('Database not ready, using fallback data');
      footerData = null;
      sections = [];
      legalLinks = [];
      contactData = null;
    }

    // Transformiere Daten für Frontend - verwende zentrale Kontaktdaten
    const transformedData = {
      companyInfo: {
        name: contactData?.companyName || footerData?.companyName || 'Gemilike',
        description: footerData?.description || 'Ihr Spezialist für rohe und geschliffene Edelsteine. Entdecken Sie unsere einzigartige Sammlung von hochwertigen Steinen.',
        address: contactData?.address || footerData?.address || 'Musterstraße 123, 12345 Musterstadt',
        phone: contactData?.phone || footerData?.phone || '+49 123 456 789',
        email: contactData?.email || footerData?.email || 'info@gemilike.com'
      },
      socialMedia: {
        facebook: footerData?.facebook || 'https://facebook.com/gemilike',
        instagram: footerData?.instagram || 'https://instagram.com/gemilike',
        twitter: footerData?.twitter || 'https://twitter.com/gemilike',
        youtube: footerData?.youtube || 'https://youtube.com/gemilike',
        website: footerData?.website || 'https://gemilike.com'
      },
      sections: sections.length > 0 ? sections.map(section => ({
        id: section.id,
        title: section.title,
        links: section.links.map(link => ({
          id: link.id,
          text: link.text,
          url: link.url,
          icon: link.icon
        }))
      })) : [
        {
          id: '1',
          title: 'Shop',
          links: [
            { id: '1', text: 'Alle Edelsteine', url: '/shop' },
            { id: '2', text: 'Rohsteine', url: '/shop/raw' },
            { id: '3', text: 'Geschliffene Steine', url: '/shop/cut' },
            { id: '4', text: 'Neue Artikel', url: '/shop/new' }
          ]
        },
        {
          id: '2',
          title: 'Service',
          links: [
            { id: '5', text: 'Versand & Lieferung', url: '/shipping' },
            { id: '6', text: 'Rückgabe', url: '/returns' },
            { id: '7', text: 'Beratung', url: '/consultation' },
            { id: '8', text: 'Zertifikate', url: '/certificates' }
          ]
        },
        {
          id: '3',
          title: 'Unternehmen',
          links: [
            { id: '9', text: 'Über uns', url: '/about' },
            { id: '10', text: 'Kontakt', url: '/contact' },
            { id: '11', text: 'Impressum', url: '/imprint' },
            { id: '12', text: 'Datenschutz', url: '/privacy' }
          ]
        }
      ],
      copyright: footerData?.copyright || '© 2024 Gemilike. Alle Rechte vorbehalten.',
      legalLinks: legalLinks.length > 0 ? legalLinks.map(link => ({
        id: link.id,
        text: link.text,
        url: link.url
      })) : [
        { id: '13', text: 'Impressum', url: '/imprint' },
        { id: '14', text: 'Datenschutz', url: '/privacy' },
        { id: '15', text: 'AGB', url: '/terms' },
        { id: '16', text: 'Widerruf', url: '/cancellation' }
      ]
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received data:', data);
    
    // Erstelle neue Prisma-Instanz
    const prismaClient = new PrismaClient();
    
    try {
      // Aktualisiere nur Footer-Daten (vereinfacht)
      const footerData = await prismaClient.footerData.upsert({
        where: { id: 'default' },
        update: {
          companyName: data.companyInfo.name,
          description: data.companyInfo.description,
          address: data.companyInfo.address,
          phone: data.companyInfo.phone,
          email: data.companyInfo.email,
          facebook: data.socialMedia.facebook,
          instagram: data.socialMedia.instagram,
          twitter: data.socialMedia.twitter,
          youtube: data.socialMedia.youtube,
          website: data.socialMedia.website,
          copyright: data.copyright
        },
        create: {
          id: 'default',
          companyName: data.companyInfo.name,
          description: data.companyInfo.description,
          address: data.companyInfo.address,
          phone: data.companyInfo.phone,
          email: data.companyInfo.email,
          facebook: data.socialMedia.facebook,
          instagram: data.socialMedia.instagram,
          twitter: data.socialMedia.twitter,
          youtube: data.socialMedia.youtube,
          website: data.socialMedia.website,
          copyright: data.copyright
        }
      });

      console.log('Footer data updated:', footerData);

      await prismaClient.$disconnect();
      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.error('Database error during save:', dbError);
      await prismaClient.$disconnect();
      return NextResponse.json({ success: true, warning: 'Data not persisted to database', error: dbError.message });
    }
  } catch (error) {
    console.error('Error updating footer data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}