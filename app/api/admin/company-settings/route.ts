import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Firmeneinstellungen abrufen
export async function GET() {
  try {
    let settings = await prisma.companySettings.findFirst();
    
    // Wenn keine Einstellungen existieren, Standardwerte erstellen
    if (!settings) {
      settings = await prisma.companySettings.create({
        data: {
          companyName: 'Gemilike',
          ownerName: 'Inhaber Name',
          address: 'Musterstraße 1',
          postalCode: '12345',
          city: 'Musterstadt',
          country: 'Deutschland',
          email: 'info@gemilike.com',
          invoicePrefix: 'RE',
          nextInvoiceNumber: 1,
          smallBusinessNotice: 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
          paymentTerms: 14
        }
      });
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching company settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company settings' },
      { status: 500 }
    );
  }
}

// PUT - Firmeneinstellungen aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const settings = await prisma.companySettings.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating company settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update company settings' },
      { status: 500 }
    );
  }
}

