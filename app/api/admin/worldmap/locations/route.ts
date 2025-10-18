import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Neue Lagerstätte erstellen
export async function POST(request: NextRequest) {
  try {
    // Authentifizierung - in Entwicklung optional
    const session = await getServerSession(authOptions);
    if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Creating location:', data);

    // Finde oder erstelle Edelstein-Typ
    let gemType = await prisma.gemType.findFirst({
      where: { name: data.gem }
    });

    if (!gemType) {
      gemType = await prisma.gemType.create({
        data: { name: data.gem }
      });
    }

    // Erstelle neue Lagerstätte
    const location = await prisma.location.create({
      data: {
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        description: data.description,
        mineType: data.mineType,
        status: data.status,
        countryId: data.countryId,
        gemTypeId: gemType.id
      },
      include: {
        gemType: true,
        country: true
      }
    });

    console.log('Location created:', location);
    return NextResponse.json({ success: true, location });
  } catch (error: any) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT - Lagerstätte aktualisieren
export async function PUT(request: NextRequest) {
  try {
    // Authentifizierung - in Entwicklung optional
    const session = await getServerSession(authOptions);
    if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Updating location:', data);

    // Finde oder erstelle Edelstein-Typ
    let gemType = await prisma.gemType.findFirst({
      where: { name: data.gem }
    });

    if (!gemType) {
      gemType = await prisma.gemType.create({
        data: { name: data.gem }
      });
    }

    // Aktualisiere Lagerstätte
    const location = await prisma.location.update({
      where: { id: data.id },
      data: {
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        description: data.description,
        mineType: data.mineType,
        status: data.status,
        gemTypeId: gemType.id
      },
      include: {
        gemType: true,
        country: true
      }
    });

    console.log('Location updated:', location);
    return NextResponse.json({ success: true, location });
  } catch (error: any) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE - Lagerstätte löschen
export async function DELETE(request: NextRequest) {
  try {
    // Authentifizierung - in Entwicklung optional
    const session = await getServerSession(authOptions);
    if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('id');

    if (!locationId) {
      return NextResponse.json({ error: 'Location ID is required' }, { status: 400 });
    }

    console.log('Deleting location:', locationId);

    // Lösche Lagerstätte
    await prisma.location.delete({
      where: { id: locationId }
    });

    console.log('Location deleted:', locationId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting location:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

