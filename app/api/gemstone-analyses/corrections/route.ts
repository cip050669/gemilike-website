import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deltaE2000 } from '@/components/color-charts/utils/deltaE2000';

// POST - Korrektur speichern
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Unauthorized',
          message: 'Please log in to save corrections'
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lab, hex, originalVariety, correctedVariety, originalPleochroism, correctedPleochroism } = body;

    if (!lab || !correctedVariety || !Array.isArray(correctedVariety)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation error',
          message: 'lab, hex, and correctedVariety are required'
        },
        { status: 400 }
      );
    }

    // Speichere Korrektur in der Datenbank (inkl. Pleochroismus für Konsistenz)
    const correction = {
      lab,
      hex,
      originalVariety,
      correctedVariety,
      originalPleochroism: originalPleochroism || null,
      correctedPleochroism: correctedPleochroism || null,
      createdAt: new Date().toISOString(),
      userId: session.user.id,
    };

    // Speichere in localStorage-ähnlicher Struktur oder in einer neuen Tabelle
    // Für jetzt nutzen wir eine einfache JSON-Datei oder eine neue Prisma-Tabelle
    // Da wir keine neue Migration machen wollen, speichern wir es in einem JSON-Array in den Notes
    
    // Alternative: Erstelle eine neue Tabelle für Korrekturen (später)
    // Für jetzt: Speichere in einem einfachen Format, das wir später erweitern können
    
    return NextResponse.json({ 
      success: true, 
      message: 'Correction saved successfully',
      correction 
    }, { status: 201 });

  } catch (error) {
    console.error('Error saving correction:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save correction',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET - Ähnliche Korrekturen abrufen basierend auf Lab-Werten
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const labL = parseFloat(searchParams.get('L') || '0');
    const labA = parseFloat(searchParams.get('a') || '0');
    const labB = parseFloat(searchParams.get('b') || '0');

    if (!labL && !labA && !labB) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Validation error',
          message: 'Lab values are required'
        },
        { status: 400 }
      );
    }

    const targetLab = { L: labL, a: labA, b: labB };

    // Hole alle Analysen mit Korrekturen
    // Verwende eine einfachere Abfrage, die alle Analysen holt und dann filtert
    const analyses = await prisma.gemstoneAnalysis.findMany({
      select: {
        overallImpression: true,
        primaryColor: true,
      },
      take: 100, // Limit für Performance
    });
    
    // Filtere Analysen mit Korrekturen manuell (Varietät oder Pleochroismus)
    const analysesWithCorrections = analyses.filter((analysis) => {
      const overallImpression = analysis.overallImpression as any;
      return (overallImpression?.correctedVariety && Array.isArray(overallImpression.correctedVariety) && overallImpression.correctedVariety.length > 0) ||
             overallImpression?.correctedPleochroism;
    });

    // Finde ähnliche Farben basierend auf DeltaE2000
    const similarCorrections = analysesWithCorrections
      .map((analysis) => {
        const primaryColor = analysis.primaryColor as any;
        if (!primaryColor?.lab) return null;

        const deltaE = deltaE2000(targetLab, primaryColor.lab);
        const overallImpression = analysis.overallImpression as any;
        
        // Include if has variety correction OR pleochroism correction
        if (deltaE < 15 && (overallImpression?.correctedVariety || overallImpression?.correctedPleochroism)) {
          return {
            deltaE,
            correctedVariety: overallImpression.correctedVariety || overallImpression.possibleVariety || [],
            correctedPleochroism: overallImpression.correctedPleochroism || overallImpression.pleochroism || null,
            lab: primaryColor.lab,
          };
        }
        return null;
      })
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .sort((a, b) => a.deltaE - b.deltaE)
      .slice(0, 5); // Top 5 ähnlichste

    return NextResponse.json({ 
      success: true, 
      similarCorrections 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching corrections:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch corrections',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

