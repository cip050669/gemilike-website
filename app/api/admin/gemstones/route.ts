import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const where: any = {};
    
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
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gemstones: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const gemstone = await prisma.gemstone.create({
      data: {
        name: body.name,
        category: body.category || 'Edelstein',
        type: body.type || 'cut',
        price: parseFloat(body.price) || 0,
        weight: body.weight ? parseFloat(body.weight) : null,
        dimensions: body.dimensions,
        color: body.color,
        colorIntensity: body.colorIntensity,
        colorBrightness: body.colorBrightness,
        clarity: body.clarity,
        cut: body.cut,
        cutForm: body.cutForm,
        treatment: body.treatment,
        certification: body.certification,
        rarity: body.rarity,
        origin: body.origin,
        description: body.description,
        images: body.images,
        inStock: body.inStock !== false,
        stock: parseInt(body.stock) || 0,
        sku: body.sku,
        isNew: body.isNew || false
      }
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