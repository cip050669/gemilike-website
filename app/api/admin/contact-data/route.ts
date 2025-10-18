import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('Contact data API called');
    
    // Authentifizierung - in Entwicklung optional
    const session = await getServerSession(authOptions);
    if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fallback-Daten (immer verwenden für Stabilität)
    const fallbackData = {
      companyName: 'Gemilike',
      phone: '+49 123 456 789',
      email: 'info@gemilike.com',
      address: 'Musterstraße 123, 12345 Musterstadt',
      openingHours: 'Mo-Fr: 9:00-18:00, Sa: 10:00-16:00',
      website: 'https://gemilike.com'
    };

    // Versuche Datenbank-Abfrage, aber verwende Fallback bei Fehlern
    try {
      const contactData = await prisma.contactData.findFirst();
      if (contactData) {
        return NextResponse.json({
          companyName: contactData.companyName || fallbackData.companyName,
          phone: contactData.phone || fallbackData.phone,
          email: contactData.email || fallbackData.email,
          address: contactData.address || fallbackData.address,
          openingHours: contactData.openingHours || fallbackData.openingHours,
          website: contactData.website || fallbackData.website
        });
      }
    } catch (dbError) {
      console.log('Database error, using fallback data:', dbError);
    }

    // Verwende Fallback-Daten
    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authentifizierung - in Entwicklung optional
    const session = await getServerSession(authOptions);
    if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Received contact data:', data);
    
    // Aktualisiere Kontaktdaten
    try {
      const contactData = await prisma.contactData.upsert({
        where: { id: 'default' },
        update: {
          companyName: data.companyName,
          phone: data.phone,
          email: data.email,
          address: data.address,
          openingHours: data.openingHours,
          website: data.website
        },
        create: {
          id: 'default',
          companyName: data.companyName,
          phone: data.phone,
          email: data.email,
          address: data.address,
          openingHours: data.openingHours,
          website: data.website
        }
      });

      console.log('Contact data updated:', contactData);
      return NextResponse.json({ success: true });
    } catch (dbError: any) {
      console.error('Database error during save:', dbError);
      return NextResponse.json({ 
        success: false, 
        error: 'Database error', 
        details: dbError?.message || 'Unknown database error' 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error updating contact data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
