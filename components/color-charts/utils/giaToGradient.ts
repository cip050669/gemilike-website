/**
 * Convert GIA color data (hue, tone, sat) to a gradient of hex colors
 */

interface GIAData {
  hue?: string;
  tone?: string;
  sat?: string;
}

/**
 * Convert GIA hue string to base color
 */
function getHueBaseColor(hue: string): { r: number; g: number; b: number } {
  const normalizedHue = hue.trim().toUpperCase();
  
  // Extract base hue (remove modifiers like "pk", "sl", "v", etc.)
  let baseHue = normalizedHue;
  if (normalizedHue.includes('R')) baseHue = 'R';
  else if (normalizedHue.includes('O')) baseHue = 'O';
  else if (normalizedHue.includes('Y')) baseHue = 'Y';
  else if (normalizedHue.includes('G')) baseHue = 'G';
  else if (normalizedHue.includes('B')) baseHue = 'B';
  else if (normalizedHue.includes('V')) baseHue = 'V';
  else if (normalizedHue.includes('P')) baseHue = 'P';
  
  // Base colors (RGB values 0-255)
  const baseColors: Record<string, { r: number; g: number; b: number }> = {
    'R': { r: 255, g: 0, b: 0 },      // Red
    'O': { r: 255, g: 165, b: 0 },    // Orange
    'Y': { r: 255, g: 255, b: 0 },    // Yellow
    'G': { r: 0, g: 255, b: 0 },      // Green
    'B': { r: 0, g: 0, b: 255 },      // Blue
    'V': { r: 128, g: 0, b: 128 },    // Violet
    'P': { r: 255, g: 192, b: 203 },  // Pink
  };
  
  // Get base color
  let color = baseColors[baseHue] || { r: 128, g: 128, b: 128 }; // Default to gray
  
  // Apply hue modifiers
  if (normalizedHue.includes('PK') || normalizedHue.includes('PINKISH')) {
    // Pinkish modifier - add pink tint
    color = {
      r: Math.min(255, color.r + 50),
      g: Math.min(255, color.g + 20),
      b: Math.min(255, color.b + 30),
    };
  } else if (normalizedHue.includes('SL') || normalizedHue.includes('SLIGHTLY')) {
    // Slightly modifier - reduce saturation slightly
    color = {
      r: Math.floor(color.r * 0.9),
      g: Math.floor(color.g * 0.9),
      b: Math.floor(color.b * 0.9),
    };
  } else if (normalizedHue.includes('V') && !normalizedHue.includes('VIVID')) {
    // Violetish modifier
    color = {
      r: Math.floor((color.r + 128) / 2),
      g: Math.floor(color.g / 2),
      b: Math.min(255, color.b + 50),
    };
  }
  
  return color;
}

/**
 * Apply tone (lightness) to color
 * Tone: 1 (very dark) to 10 (very light)
 */
function applyTone(color: { r: number; g: number; b: number }, tone: number): { r: number; g: number; b: number } {
  // Normalize tone to 0-1 scale (1 = dark, 10 = light)
  const toneValue = Math.max(1, Math.min(10, tone));
  const lightness = (toneValue - 1) / 9; // 0 = dark, 1 = light
  
  // Apply lightness: darken or lighten
  if (lightness < 0.5) {
    // Darken (multiply)
    const factor = lightness * 2; // 0 to 1
    return {
      r: Math.floor(color.r * factor),
      g: Math.floor(color.g * factor),
      b: Math.floor(color.b * factor),
    };
  } else {
    // Lighten (add white)
    const factor = (lightness - 0.5) * 2; // 0 to 1
    return {
      r: Math.min(255, Math.floor(color.r + (255 - color.r) * factor)),
      g: Math.min(255, Math.floor(color.g + (255 - color.g) * factor)),
      b: Math.min(255, Math.floor(color.b + (255 - color.b) * factor)),
    };
  }
}

/**
 * Apply saturation to color
 * Sat: 1 (weak) to 9 (vivid)
 */
function applySaturation(color: { r: number; g: number; b: number }, sat: number): { r: number; g: number; b: number } {
  // Normalize saturation to 0-1 scale (1 = weak, 9 = vivid)
  const satValue = Math.max(1, Math.min(9, sat));
  const saturation = (satValue - 1) / 8; // 0 = weak, 1 = vivid
  
  // Calculate grayscale value
  const gray = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  
  // Interpolate between grayscale and saturated color
  return {
    r: Math.floor(gray + (color.r - gray) * saturation),
    g: Math.floor(gray + (color.g - gray) * saturation),
    b: Math.floor(gray + (color.b - gray) * saturation),
  };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.floor(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate gradient from GIA data
 * Creates a gradient showing the color range based on GIA values
 */
export function generateGradientFromGIA(gia: GIAData): string[] {
  if (!gia.hue) {
    return [];
  }
  
  // Parse tone and sat values
  const tone = gia.tone ? parseFloat(gia.tone.replace(/[^0-9.]/g, '')) : 5;
  const sat = gia.sat ? parseFloat(gia.sat.replace(/[^0-9.]/g, '')) : 5;
  
  // Get base color from hue
  const baseColor = getHueBaseColor(gia.hue);
  
  // Generate gradient by varying tone and saturation
  const gradient: string[] = [];
  
  // Create 5-color gradient:
  // 1. Darker, less saturated
  // 2. Slightly darker, medium saturation
  // 3. Main color (with tone and sat)
  // 4. Slightly lighter, medium saturation
  // 5. Lighter, less saturated
  
  const variations = [
    { toneOffset: -2, satOffset: -2 },
    { toneOffset: -1, satOffset: -1 },
    { toneOffset: 0, satOffset: 0 },
    { toneOffset: 1, satOffset: -1 },
    { toneOffset: 2, satOffset: -2 },
  ];
  
  for (const variation of variations) {
    const adjustedTone = Math.max(1, Math.min(10, tone + variation.toneOffset));
    const adjustedSat = Math.max(1, Math.min(9, sat + variation.satOffset));
    
    let color = { ...baseColor };
    color = applyTone(color, adjustedTone);
    color = applySaturation(color, adjustedSat);
    
    gradient.push(rgbToHex(color.r, color.g, color.b));
  }
  
  return gradient;
}

