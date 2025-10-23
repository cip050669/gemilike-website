import { NextRequest, NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { extractPayload, normaliseGemstonePayload } from './utils';
import { allGemstones } from '@/lib/data/gemstones';
import { isCutGemstone, isRoughGemstone } from '@/lib/types/gemstone';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching gemstones...');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const search = searchParams.get('search') || '';
    const color = searchParams.get('color') || '';
    const cut = searchParams.get('cut') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.GemstoneWhereInput = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (color) {
      where.color = { contains: color, mode: 'insensitive' };
    }
    
    if (cut) {
      where.cut = { contains: cut, mode: 'insensitive' };
    }

    console.log('API: Where clause:', where);

    // Get gemstones with pagination
    const [gemstones, total] = await Promise.all([
      prisma.gemstone.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.gemstone.count({ where })
    ]);

    console.log('API: Found gemstones:', gemstones.length);

    return NextResponse.json({
      success: true,
      data: gemstones,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
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
