import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type ParamsPromise = Promise<{ id: string }>;

export async function PUT(
  request: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { name, lat, lng, description, mineType, status, countryId, gemTypeId } = body;

    // Validierung
    if (!name || !lat || !lng || !countryId || !gemTypeId) {
      return NextResponse.json(
        { error: 'Name, Koordinaten, Land und Edelstein-Typ sind erforderlich' },
        { status: 400 }
      );
    }

    // Prüfe ob Fundort existiert
    const existingLocation = await prisma.location.findUnique({ where: { id } });
    if (!existingLocation) {
      return NextResponse.json({ error: 'Fundort nicht gefunden' }, { status: 404 });
    }

    // Prüfe ob Land und Edelstein-Typ existieren
    const country = await prisma.country.findUnique({ where: { id: countryId } });
    const gemType = await prisma.gemType.findUnique({ where: { id: gemTypeId } });

    if (!country) {
      return NextResponse.json({ error: 'Land nicht gefunden' }, { status: 404 });
    }

    if (!gemType) {
      return NextResponse.json({ error: 'Edelstein-Typ nicht gefunden' }, { status: 404 });
    }

    // Aktualisiere Fundort
    const location = await prisma.location.update({
      where: { id },
      data: {
        name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        description,
        mineType,
        status,
        countryId,
        gemTypeId
      },
      include: {
        country: true,
        gemType: true
      }
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Fundorts' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    const { id } = await params;

    // Prüfe ob Fundort existiert
    const existingLocation = await prisma.location.findUnique({ where: { id } });
    if (!existingLocation) {
      return NextResponse.json({ error: 'Fundort nicht gefunden' }, { status: 404 });
    }

    // Lösche Fundort
    await prisma.location.delete({ where: { id } });

    return NextResponse.json({ message: 'Fundort erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Fundorts' },
      { status: 500 }
    );
  }
}
