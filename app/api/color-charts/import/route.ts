import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// POST - Bulk Import von Farbtafeln (nur Admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - No session. Please log in at /de/admin/login' },
        { status: 401 }
      );
    }
    if ((session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Not ADMIN' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { charts, locale = 'de' } = body;

    if (!Array.isArray(charts) || charts.length === 0) {
      return NextResponse.json(
        { error: 'Charts must be a non-empty array' },
        { status: 400 }
      );
    }

    const results = {
      success: [] as any[],
      errors: [] as string[],
    };

    // Validate hex color regex
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    for (let i = 0; i < charts.length; i++) {
      const chartData = charts[i];

      try {
        // Validate required fields
        if (!chartData.name) {
          results.errors.push(`Chart ${i + 1}: Name is required`);
          continue;
        }

        if (!chartData.gradient || !Array.isArray(chartData.gradient) || chartData.gradient.length === 0) {
          results.errors.push(`Chart ${i + 1}: Gradient must be a non-empty array`);
          continue;
        }

        // Validate hex colors
        for (const color of chartData.gradient) {
          if (!hexColorRegex.test(color)) {
            results.errors.push(`Chart ${i + 1}: Invalid hex color in gradient: ${color}`);
            continue;
          }
        }

        if (chartData.pleochro && Array.isArray(chartData.pleochro)) {
          for (const color of chartData.pleochro) {
            if (!hexColorRegex.test(color)) {
              results.errors.push(`Chart ${i + 1}: Invalid hex color in pleochro: ${color}`);
              continue;
            }
          }
        }

        // Generate slug
        let slug = generateSlug(chartData.name);
        
        // Check if slug exists
        const existing = await prisma.colorChart.findUnique({
          where: { slug },
        });

        if (existing) {
          // Append number if slug exists
          let counter = 1;
          while (existing) {
            slug = `${generateSlug(chartData.name)}-${counter}`;
            const check = await prisma.colorChart.findUnique({
              where: { slug },
            });
            if (!check) break;
            counter++;
          }
        }

        // Create chart
        const chart = await prisma.colorChart.create({
          data: {
            name: chartData.name,
            slug,
            origin: chartData.origin || null,
            locale: chartData.locale || locale,
            gia: chartData.gia || {},
            gradient: chartData.gradient,
            pleochro: chartData.pleochro || [],
            light: chartData.light || 'D55, CRI ≥95',
            note: chartData.note || null,
            description: chartData.description || null,
            published: chartData.published || false,
            featured: chartData.featured || false,
            order: chartData.order || 0,
            createdById: session.user.id,
          },
        });

        results.success.push({ id: chart.id, name: chart.name });
      } catch (error) {
        results.errors.push(`Chart ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      imported: results.success.length,
      total: charts.length,
      results,
    });

  } catch (error) {
    console.error('Error importing color charts:', error);
    return NextResponse.json(
      { error: 'Failed to import color charts' },
      { status: 500 }
    );
  }
}

