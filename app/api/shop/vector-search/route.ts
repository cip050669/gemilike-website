import { NextRequest, NextResponse } from 'next/server';
import { searchGemstonesVector } from '@/lib/services/shop/gemstone.service';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') || '';
  const locale = url.searchParams.get('locale') || 'de';
  const limitParam = url.searchParams.get('limit');

  const limit = limitParam ? Math.min(Math.max(Number(limitParam), 1), 50) : 15;

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchGemstonesVector(query, locale, limit);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Gemstone vector search failed:', error);
    return NextResponse.json(
      { error: 'Gemstone vector search failed' },
      { status: 500 }
    );
  }
}

