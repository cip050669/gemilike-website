import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractPayload, normaliseGemstonePayload } from './utils';
import { allGemstones } from '@/lib/data/gemstones';
import { isCutGemstone, isRoughGemstone } from '@/lib/types/gemstone';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching gemstones...');
    
    const { searchParams } = new URL(request.url);
    const rawPage = Number.parseInt(searchParams.get('page') || '1', 10);
    const rawLimit = Number.parseInt(searchParams.get('limit') || '25', 10);
    const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 25 : rawLimit;
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const color = (searchParams.get('color') || '').trim().toLowerCase();
    const cut = (searchParams.get('cut') || '').trim().toLowerCase();

    const skip = (page - 1) * limit;

    const gemstones = await prisma.gemstone.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const filtered = gemstones.filter((gemstone) => {
      const name = gemstone.name?.toLowerCase() ?? '';
      const description = gemstone.description?.toLowerCase() ?? '';
      const category = gemstone.category?.toLowerCase() ?? '';
      const gemstoneColor = gemstone.color?.toLowerCase() ?? '';
      const gemstoneCut = gemstone.cut?.toLowerCase() ?? '';

      const matchesSearch =
        !search ||
        name.includes(search) ||
        description.includes(search) ||
        category.includes(search);

      const matchesColor = !color || gemstoneColor.includes(color);
      const matchesCut = !cut || gemstoneCut.includes(cut);

      return matchesSearch && matchesColor && matchesCut;
    });

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    console.log('API: Found gemstones:', paginated.length);

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    });
  } catch (error) {
    console.error('Error fetching gemstones:', error);
    const fallbackData = allGemstones.map((gem) => {
      const weight = isCutGemstone(gem)
        ? gem.caratWeight
        : isRoughGemstone(gem)
          ? gem.gramWeight
          : null;

      const dimensions = gem.dimensions
        ? `${gem.dimensions.length}x${gem.dimensions.width}x${gem.dimensions.height}mm`
        : null;

      const cut = isCutGemstone(gem) ? gem.cut : null;
      const cutForm = isCutGemstone(gem) ? gem.cutForm ?? null : null;
      const colorIntensity = isCutGemstone(gem) ? gem.colorIntensity ?? null : null;
      const clarity = isCutGemstone(gem) ? gem.clarity ?? null : null;

      const images = [gem.mainImage, ...(gem.images ?? [])]
        .filter((image): image is string => Boolean(image))
        .slice(0, 10);

      const videos = (gem.videos ?? []).filter((video): video is string => Boolean(video));

      return {
        id: gem.id,
        name: gem.name,
        category: gem.category,
        type: gem.type,
        price: gem.price,
        weight,
        dimensions,
        color: gem.color ?? null,
        colorIntensity,
        colorBrightness: null,
        clarity,
        cut,
        cutForm,
        treatment: gem.treatment?.type ?? null,
        certification: gem.certification?.lab ?? null,
        rarity: gem.rarity ?? null,
        origin: gem.origin,
        description: gem.description,
        images: JSON.stringify(images),
        videos: JSON.stringify(videos),
        inStock: gem.inStock ?? true,
        stock: gem.quantity ?? 0,
        sku: undefined,
        isNew: gem.isNew ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: fallbackData,
        pagination: {
          page: 1,
          limit: fallbackData.length,
          total: fallbackData.length,
          pages: 1,
        },
        fallback: true,
        message:
          'Datenbank nicht erreichbar. Es werden vorerst Beispiel-Edelsteine angezeigt.',
      },
      { status: 200 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { payload, uploadedImage } = await extractPayload(request);

    if (!payload.name) {
      return NextResponse.json(
        { success: false, error: 'Name ist erforderlich' },
        { status: 400 }
      );
    }

    const data = normaliseGemstonePayload(payload, uploadedImage);
    
    const gemstone = await prisma.gemstone.create({
      data,
    });

    return NextResponse.json({
      success: true,
      data: gemstone,
      message: 'Edelstein erfolgreich erstellt'
    });
  } catch (error) {
    console.error('Error creating gemstone:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create gemstone' },
      { status: 500 }
    );
  }
}
export const runtime = 'nodejs';
