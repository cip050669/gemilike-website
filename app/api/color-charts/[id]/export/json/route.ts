import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - JSON Export einer Farbtafel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const chart = await prisma.colorChart.findUnique({
      where: { id },
    });

    if (!chart) {
      return NextResponse.json(
        { error: 'Color chart not found' },
        { status: 404 }
      );
    }

    // Return as JSON file download
    const json = JSON.stringify(chart, null, 2);
    
    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${chart.name.replace(/\s+/g, '-').toLowerCase()}-${chart.id}.json"`,
      },
    });

  } catch (error) {
    console.error('Error exporting color chart JSON:', error);
    return NextResponse.json(
      { error: 'Failed to export color chart' },
      { status: 500 }
    );
  }
}

