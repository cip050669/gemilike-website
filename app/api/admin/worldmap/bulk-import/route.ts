import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

interface ImportData {
  name: string;
  country: string;
  lat: number;
  lng: number;
  gem: string;
  description?: string;
  mineType?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Authentifizierung - in Entwicklung optional
    const { userId } = await getSessionWithUser();
    if (process.env.NODE_ENV === 'production' && !userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data }: { data: ImportData[] } = await request.json();
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Keine Daten zum Importieren erhalten' 
      }, { status: 400 });
    }

    console.log(`Bulk import: ${data.length} Einträge erhalten`);

    const results = {
      imported: 0,
      errors: [] as string[],
      warnings: [] as string[]
    };

    // Verarbeite jeden Eintrag
    for (const item of data) {
      try {
        // 1. Land finden oder erstellen
        let country = await prisma.country.findFirst({
          where: { name: item.country }
        });

        if (!country) {
          country = await prisma.country.create({
            data: {
              name: item.country,
              lat: item.lat,
              lng: item.lng,
              continent: getContinentFromCountry(item.country)
            }
          });
          console.log(`Neues Land erstellt: ${item.country}`);
        }

        // 2. Edelstein-Typ finden oder erstellen
        let gemType = await prisma.gemType.findFirst({
          where: { name: item.gem }
        });

        if (!gemType) {
          gemType = await prisma.gemType.create({
            data: {
              name: item.gem,
              color: getGemColor(item.gem),
              description: getGemDescription(item.gem)
            }
          });
          console.log(`Neuer Edelstein-Typ erstellt: ${item.gem}`);
        }

        // 3. Lagerstätte erstellen
        const location = await prisma.location.create({
          data: {
            name: item.name,
            lat: item.lat,
            lng: item.lng,
            description: item.description || null,
            mineType: item.mineType || 'primary',
            status: item.status || 'active',
            countryId: country.id,
            gemTypeId: gemType.id
          }
        });

        results.imported++;
        console.log(`Lagerstätte erstellt: ${item.name} in ${item.country}`);

      } catch (error: any) {
        const errorMessage = `Fehler bei ${item.name} (${item.country}): ${error.message}`;
        results.errors.push(errorMessage);
        console.error(errorMessage);
      }
    }

    console.log(`Bulk import abgeschlossen: ${results.imported} importiert, ${results.errors.length} Fehler`);

    return NextResponse.json({
      success: results.errors.length === 0,
      imported: results.imported,
      errors: results.errors,
      warnings: results.warnings
    });

  } catch (error: any) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error', 
        details: error?.message || 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Hilfsfunktionen
function getContinentFromCountry(country: string): string {
  const continentMap: { [key: string]: string } = {
    'Südafrika': 'Afrika',
    'Botswana': 'Afrika',
    'Namibia': 'Afrika',
    'Tansania': 'Afrika',
    'Kenia': 'Afrika',
    'Uganda': 'Afrika',
    'Madagaskar': 'Afrika',
    'Mosambik': 'Afrika',
    'Sambia': 'Afrika',
    'Ägypten': 'Afrika',
    'Myanmar': 'Asien',
    'Thailand': 'Asien',
    'Sri Lanka': 'Asien',
    'Indien': 'Asien',
    'Vietnam': 'Asien',
    'Kambodscha': 'Asien',
    'Indonesien': 'Asien',
    'Philippinen': 'Asien',
    'Tadschikistan': 'Asien',
    'Kolumbien': 'Amerika',
    'Brasilien': 'Amerika',
    'USA': 'Amerika',
    'Kanada': 'Amerika',
    'Australien': 'Australien',
    'Russland': 'Europa',
    'Tschechien': 'Europa'
  };
  
  return continentMap[country] || 'Unbekannt';
}

function getGemColor(gem: string): string {
  const colorMap: { [key: string]: string } = {
    'Diamond': '#FFFFFF',
    'Ruby': '#FF0000',
    'Sapphire': '#0000FF',
    'Emerald': '#00FF00',
    'Tanzanite': '#8A2BE2',
    'Opal': '#FFD700',
    'Tourmaline': '#FF69B4',
    'Garnet': '#DC143C',
    'Spinel': '#FF1493',
    'Alexandrite': '#32CD32',
    'Zircon': '#87CEEB',
    'Peridot': '#90EE90',
    'Aquamarine': '#00FFFF',
    'Topaz': '#FFA500',
    'Jade': '#00FF7F',
    'Demantoid': '#228B22',
    'Uvarovite': '#006400',
    'Pearl': '#F0F8FF'
  };
  
  return colorMap[gem] || '#333333';
}

function getGemDescription(gem: string): string {
  const descriptionMap: { [key: string]: string } = {
    'Diamond': 'Diamant',
    'Ruby': 'Rubin',
    'Sapphire': 'Saphir',
    'Emerald': 'Smaragd',
    'Tanzanite': 'Tansanit',
    'Opal': 'Opal',
    'Tourmaline': 'Turmalin',
    'Garnet': 'Granat',
    'Spinel': 'Spinell',
    'Alexandrite': 'Alexandrit',
    'Zircon': 'Zirkon',
    'Peridot': 'Peridot',
    'Aquamarine': 'Aquamarin',
    'Topaz': 'Topas',
    'Jade': 'Jade',
    'Demantoid': 'Demantoid',
    'Uvarovite': 'Uwarowit',
    'Pearl': 'Perle'
  };
  
  return descriptionMap[gem] || gem;
}
