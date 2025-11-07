/**
 * Palette comparison utilities
 * Compares analyzed colors against reference palettes using ΔE calculations
 */

import { deltaE2000Hex, getDeltaEInterpretation } from './deltaE2000';
import { Whitepoint, hexToLab } from './colorConversions';

export interface PalettePreset {
  name: string;
  colors: string[];
  description?: string;
}

export const PALETTE_PRESETS: PalettePreset[] = [
  {
    name: 'Saphir-Blau (royal)',
    colors: ['#1A237E', '#283593', '#3949AB', '#5C6BC0'],
    description: 'Königliches Saphir-Blau',
  },
  {
    name: 'Saphir-Blau (kalt)',
    colors: ['#0F3D91', '#1F5FC4', '#3F7FFF', '#5AA2FF'],
    description: 'Kaltes Saphir-Blau',
  },
  {
    name: 'Padparadscha-ähnlich',
    colors: ['#FF6F61', '#FFA177', '#FFC3A0', '#FFD7BA'],
    description: 'Padparadscha-Farbtöne',
  },
  {
    name: 'Neutralgrau',
    colors: ['#6E6E6E', '#808080', '#909090', '#A0A0A0'],
    description: 'Neutrale Grautöne',
  },
  {
    name: 'Firma-Beispiel',
    colors: ['#006064', '#0097A7', '#00BCD4', '#4DD0E1'],
    description: 'Firmenfarben Beispiel',
  },
];

export interface PaletteComparisonResult {
  hex: string;
  dE76: number;
  dE2000: number;
  interpretation: ReturnType<typeof getDeltaEInterpretation>;
}

export interface PaletteComparison {
  preset: PalettePreset;
  primaryColor: string;
  results: PaletteComparisonResult[];
  bestMatch: PaletteComparisonResult | null;
}

/**
 * Compare a color against a palette using ΔE calculations
 */
export function compareColorToPalette(
  colorHex: string,
  palette: PalettePreset,
  whitepoint: Whitepoint = 'D65'
): PaletteComparisonResult[] {
  return palette.colors.map((paletteColor) => {
    const dE2000 = deltaE2000Hex(colorHex, paletteColor, whitepoint) || Infinity;
    
    // Calculate ΔE76 as well (simpler metric, for comparison)
    const dE76 = calculateDeltaE76(colorHex, paletteColor, whitepoint);
    
    return {
      hex: paletteColor,
      dE76,
      dE2000,
      interpretation: getDeltaEInterpretation(dE2000),
    };
  }).sort((a, b) => a.dE2000 - b.dE2000); // Sort by best match (lowest ΔE)
}

/**
 * Compare primary color against all palettes
 */
export function compareToAllPalettes(
  primaryColorHex: string,
  whitepoint: Whitepoint = 'D65',
  customPalette?: string[]
): PaletteComparison[] {
  const comparisons: PaletteComparison[] = PALETTE_PRESETS.map((preset) => {
    const results = compareColorToPalette(primaryColorHex, preset, whitepoint);
    const bestMatch = results.length > 0 ? results[0] : null;
    
    return {
      preset,
      primaryColor: primaryColorHex,
      results,
      bestMatch,
    };
  });

  // Add custom palette if provided
  if (customPalette && customPalette.length > 0) {
    const customPreset: PalettePreset = {
      name: 'Benutzerdefiniert',
      colors: customPalette,
      description: 'Eigene Farbpalette',
    };
    const results = compareColorToPalette(primaryColorHex, customPreset, whitepoint);
    const bestMatch = results.length > 0 ? results[0] : null;
    
    comparisons.push({
      preset: customPreset,
      primaryColor: primaryColorHex,
      results,
      bestMatch,
    });
  }

  // Sort by best overall match
  return comparisons.sort((a, b) => {
    const aBest = a.bestMatch?.dE2000 || Infinity;
    const bBest = b.bestMatch?.dE2000 || Infinity;
    return aBest - bBest;
  });
}

/**
 * Calculate ΔE76 (simpler color difference metric)
 * This is less accurate than CIEDE2000 but faster to compute
 */
function calculateDeltaE76(
  hex1: string,
  hex2: string,
  whitepoint: Whitepoint = 'D65'
): number {
  const lab1 = hexToLab(hex1, whitepoint);
  const lab2 = hexToLab(hex2, whitepoint);
  
  if (!lab1 || !lab2) return Infinity;
  
  const dL = lab1.L - lab2.L;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  
  return Math.sqrt(dL * dL + da * da + db * db);
}

