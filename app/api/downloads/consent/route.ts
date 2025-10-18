import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('download-auth');
    
    if (!authCookie) {
      return NextResponse.json({ hasConsented: false, version: '1.0', terms: '' });
    }

    const authData = JSON.parse(authCookie.value);
    const consent = await prisma.downloadConsent.findUnique({
      where: { userEmail: authData.email }
    });

    const terms = `
      <h3>Download-Bedingungen</h3>
      <p><strong>Haftungsausschluss:</strong></p>
      <ul>
        <li>Alle Downloads erfolgen auf eigene Gefahr</li>
        <li>Wir übernehmen keine Haftung für Schäden durch heruntergeladene Dateien</li>
        <li>Virenschutz und Datei-Integrität sind Ihre Verantwortung</li>
      </ul>
      
      <p><strong>Nutzungsbedingungen:</strong></p>
      <ul>
        <li>Dateien sind nur für den persönlichen Gebrauch bestimmt</li>
        <li>Kommerzielle Nutzung nur nach schriftlicher Genehmigung</li>
        <li>Urheberrechte sind zu beachten</li>
      </ul>
      
      <p><strong>Datenschutz:</strong></p>
      <ul>
        <li>Ihre E-Mail-Adresse wird für Download-Logs gespeichert</li>
        <li>IP-Adresse und Download-Zeit werden protokolliert</li>
        <li>Daten werden nach 12 Monaten automatisch gelöscht</li>
      </ul>
    `;

    return NextResponse.json({
      hasConsented: consent?.consent || false,
      version: consent?.version || '1.0',
      terms
    });
  } catch (error) {
    console.error('Error loading consent data:', error);
    return NextResponse.json(
      { hasConsented: false, version: '1.0', terms: '' }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, consent, version } = await request.json();
    
    if (!email || !consent) {
      return NextResponse.json(
        { error: 'Email and consent are required' },
        { status: 400 }
      );
    }

    await prisma.downloadConsent.upsert({
      where: { userEmail: email },
      update: {
        consent: true,
        version,
        consentedAt: new Date()
      },
      create: {
        userEmail: email,
        consent: true,
        version,
        consentedAt: new Date()
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving consent:', error);
    return NextResponse.json(
      { error: 'Failed to save consent' },
      { status: 500 }
    );
  }
}


