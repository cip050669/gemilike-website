/**
 * Color conversion utilities for color charts
 * Converts between Hex, RGB, XYZ, and Lab color spaces
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface XYZ {
  x: number;
  y: number;
  z: number;
}

export interface Lab {
  L: number;
  a: number;
  b: number;
}

/**
 * Convert hex color to RGB (normalized 0-1)
 */
export function hexToRgb(hex: string): RGB | null {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
    const g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
    const b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
    return { r, g, b };
  }
  
  // Handle 6-digit hex
  const m = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  if (!m) return null;
  
  return {
    r: parseInt(m[1], 16) / 255,
    g: parseInt(m[2], 16) / 255,
    b: parseInt(m[3], 16) / 255,
  };
}

/**
 * Inverse gamma correction for sRGB
 */
function invGamma(u: number): number {
  return u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
}

/**
 * Convert RGB to XYZ (D65 illuminant)
 */
export function rgbToXyz(rgb: RGB): XYZ {
  const R = invGamma(rgb.r);
  const G = invGamma(rgb.g);
  const B = invGamma(rgb.b);
  
  // sRGB to XYZ matrix (D65)
  return {
    x: R * 0.4124564 + G * 0.3575761 + B * 0.1804375,
    y: R * 0.2126729 + G * 0.7151522 + B * 0.0721750,
    z: R * 0.0193339 + G * 0.1191920 + B * 0.9503041,
  };
}

/**
 * Helper function for Lab conversion
 */
function fLab(t: number): number {
  const threshold = 216 / 24389;
  return t > threshold ? Math.cbrt(t) : (24389 / 27) * t + 16 / 116;
}

/**
 * Convert XYZ to Lab (D65 reference white)
 */
export function xyzToLab(xyz: XYZ): Lab {
  // D65 reference white
  const Xn = 0.95047;
  const Yn = 1.00000;
  const Zn = 1.08883;
  
  const fx = fLab(xyz.x / Xn);
  const fy = fLab(xyz.y / Yn);
  const fz = fLab(xyz.z / Zn);
  
  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

/**
 * Convert hex color directly to Lab
 */
export function hexToLab(hex: string): Lab | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const xyz = rgbToXyz(rgb);
  return xyzToLab(xyz);
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(rgb: RGB): string {
  const r = Math.round(rgb.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(rgb.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(rgb.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

