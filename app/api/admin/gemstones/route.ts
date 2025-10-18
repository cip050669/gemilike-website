import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { Gemstone } from '@/lib/types/gemstone';

const GEMSTONES_FILE_PATH = join(process.cwd(), 'lib', 'data', 'gemstones.ts');

export async function GET() {
  try {
    // Import the gemstones data dynamically
    const { allGemstones } = await import('@/lib/data/gemstones');
    
    // Ensure we always return an array
    const gemstones = Array.isArray(allGemstones) ? allGemstones : [];
    
    // Add cache control headers to prevent caching
    const response = NextResponse.json({ success: true, gemstones });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    // Return empty array instead of error
    const response = NextResponse.json({ success: true, gemstones: [] });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    return response;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { gemstones } = await request.json();
    
    if (!Array.isArray(gemstones)) {
      return NextResponse.json({ success: false, error: 'Invalid gemstones data' }, { status: 400 });
    }

    // Generate the TypeScript file content
    const fileContent = generateGemstonesFile(gemstones);
    
    // Write the file
    await writeFile(GEMSTONES_FILE_PATH, fileContent, 'utf-8');
    
    return NextResponse.json({ success: true, message: 'Gemstones updated successfully' });
  } catch (error) {
    console.error('Error updating gemstones:', error);
    return NextResponse.json({ success: false, error: 'Failed to update gemstones file' }, { status: 500 });
  }
}

function generateGemstonesFile(gemstones: Gemstone[]): string {
  const cutGemstones = gemstones.filter(g => g.type === 'cut');
  const roughGemstones = gemstones.filter(g => g.type === 'rough');

  let content = `import { CutGemstone, RoughGemstone, Gemstone } from '@/lib/types/gemstone';

// Beispiel-Daten für geschliffene Edelsteine
export const cutGemstones: CutGemstone[] = [
`;

  // Add cut gemstones
  cutGemstones.forEach((gemstone, index) => {
    content += `  ${JSON.stringify(gemstone, null, 2)}`;
    if (index < cutGemstones.length - 1) {
      content += ',';
    }
    content += '\n';
  });

  content += `];

// Beispiel-Daten für Rohsteine
export const roughGemstones: RoughGemstone[] = [
`;

  // Add rough gemstones
  roughGemstones.forEach((gemstone, index) => {
    content += `  ${JSON.stringify(gemstone, null, 2)}`;
    if (index < roughGemstones.length - 1) {
      content += ',';
    }
    content += '\n';
  });

  content += `];

// Alle Edelsteine kombiniert
export const allGemstones: Gemstone[] = [
  ...cutGemstones,
  ...roughGemstones,
];

// Helper-Funktionen
export function getGemstoneById(id: string): Gemstone | undefined {
  return allGemstones.find(gem => gem.id === id);
}

export function getGemstonesByType(type: 'cut' | 'rough'): Gemstone[] {
  return allGemstones.filter(gem => gem.type === type);
}

export function getGemstonesByCategory(category: string): Gemstone[] {
  return allGemstones.filter(gem => gem.category === category);
}
`;

  return content;
}

