import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Länder und Lagerstätten abrufen
export async function GET(request: NextRequest) {
  
  try {
    // Authentifizierung - in Entwicklung optional
    const session = await getServerSession(authOptions);
    if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching worldmap data...');

    // Lade alle Länder mit ihren Lagerstätten
    const countries = await prisma.country.findMany({
      include: {
        locations: {
          include: {
            gemType: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('Found countries:', countries.length);

    // Transformiere die Daten für die Frontend-Komponente
    const transformedCountries = countries.map(country => ({
      id: country.id,
      country: country.name,
      lat: country.lat,
      lng: country.lng,
      locationCount: country.locations.length,
      gemTypes: [...new Set(country.locations.map(loc => loc.gemType.name))],
      locations: country.locations.map(location => ({
        id: location.id,
        name: location.name,
        lat: location.lat,
        lng: location.lng,
        gem: location.gemType.name,
        description: location.description,
        mineType: location.mineType,
        status: location.status
      }))
    }));

    console.log('Transformed countries:', transformedCountries.length);

    return NextResponse.json({ countries: transformedCountries });
  } catch (error: any) {
    console.error('Error fetching worldmap data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Neues Land erstellen
export async function POST(request: NextRequest) {
  
  try {
    // Authentifizierung - in Entwicklung optional
    const session = await getServerSession(authOptions);
    if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Creating country:', data);

    // Erstelle neues Land
    const country = await prisma.country.create({
      data: {
        name: data.country,
        lat: data.lat,
        lng: data.lng,
        continent: data.continent
      }
    });

    console.log('Country created:', country);
    return NextResponse.json({ success: true, country });
  } catch (error: any) {
    console.error('Error creating country:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Land aktualisieren
export async function PUT(request: NextRequest) {
  
  try {
    // Authentifizierung - in Entwicklung optional
    const session = await getServerSession(authOptions);
    if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Updating country:', data);

    // Aktualisiere Land
    const country = await prisma.country.update({
      where: { id: data.id },
      data: {
        name: data.country,
        lat: data.lat,
        lng: data.lng,
        continent: data.continent
      }
    });

    console.log('Country updated:', country);
    return NextResponse.json({ success: true, country });
  } catch (error: any) {
    console.error('Error updating country:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Land löschen
export async function DELETE(request: NextRequest) {
  
  try {
    // Authentifizierung - in Entwicklung optional
    const session = await getServerSession(authOptions);
    if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('id');

    if (!countryId) {
      return NextResponse.json({ error: 'Country ID is required' }, { status: 400 });
    }

    console.log('Deleting country:', countryId);

    // Lösche Land (Cascade löscht auch alle Lagerstätten)
    await prisma.country.delete({
      where: { id: countryId }
    });

    console.log('Country deleted:', countryId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting country:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}