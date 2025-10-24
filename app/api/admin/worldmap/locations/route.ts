import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, lat, lng, description, mineType, status, countryId, gemTypeId } = body;

    // Validierung
    if (!name || !lat || !lng || !countryId || !gemTypeId) {
      return NextResponse.json(
        { error: 'Name, Koordinaten, Land und Edelstein-Typ sind erforderlich' },
        { status: 400 }
      );
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

    // Erstelle neuen Fundort
    const location = await prisma.location.create({
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

    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Fundorts' },
      { status: 500 }
    );
  }
}