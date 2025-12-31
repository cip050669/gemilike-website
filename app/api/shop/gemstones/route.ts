import { NextRequest, NextResponse } from 'next/server';
import { fetchGemstonesByIds } from '@/lib/services/shop/gemstone.service';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    
    if (!idsParam) {
      return NextResponse.json(
        { error: 'ids parameter is required' },
        { status: 400 }
      );
    }

    let ids: string[];
    try {
      ids = JSON.parse(idsParam);
    } catch {
      // Fallback: versuche als komma-separierte Liste
      ids = idsParam.split(',').map(id => id.trim()).filter(Boolean);
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'ids must be a non-empty array' },
        { status: 400 }
      );
    }

    const gemstones = await fetchGemstonesByIds(ids);
    return NextResponse.json(gemstones);
  } catch (error) {
    console.error('Error fetching gemstones by ids:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gemstones' },
      { status: 500 }
    );
  }
}

