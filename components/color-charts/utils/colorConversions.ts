/**
 * Color conversion utilities for color charts
 * Converts between Hex, RGB, XYZ, and Lab color spaces
 * Supports D65 and D50 whitepoints with Bradford chromatic adaptation
 */

export type Whitepoint = 'D65' | 'D50';

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
 * Bradford chromatic adaptation matrices
 * Used for converting between D65 and D50 whitepoints
 */
const BRADFORD_M = [
  [0.8951, 0.2664, -0.1614],
  [-0.7502, 1.7135, 0.0367],
  [0.0389, -0.0685, 1.0296],
];

const BRADFORD_M_INV = [
  [0.9869929, -0.1470543, 0.1599627],
  [0.4323053, 0.5183603, 0.0492912],
  [-0.0085287, 0.0400428, 0.9684867],
];

const D65_WHITE = [0.95047, 1.00000, 1.08883];
const D50_WHITE = [0.96422, 1.00000, 0.82521];

/**
 * Apply Bradford chromatic adaptation to convert XYZ from one whitepoint to another
 */
function adaptBradford(
  xyz: [number, number, number],
  from: [number, number, number],
  to: [number, number, number]
): [number, number, number] {
  const [x, y, z] = xyz;
  
  // Convert to cone response domain
  const cone = [
    BRADFORD_M[0][0] * x + BRADFORD_M[0][1] * y + BRADFORD_M[0][2] * z,
    BRADFORD_M[1][0] * x + BRADFORD_M[1][1] * y + BRADFORD_M[1][2] * z,
    BRADFORD_M[2][0] * x + BRADFORD_M[2][1] * y + BRADFORD_M[2][2] * z,
  ];
  
  // Scale by whitepoint ratio
  const scale = [
    (cone[0] * to[0]) / from[0],
    (cone[1] * to[1]) / from[1],
    (cone[2] * to[2]) / from[2],
  ];
  
  // Convert back to XYZ
  const xo =
    BRADFORD_M_INV[0][0] * scale[0] +
    BRADFORD_M_INV[0][1] * scale[1] +
    BRADFORD_M_INV[0][2] * scale[2];
  const yo =
    BRADFORD_M_INV[1][0] * scale[0] +
    BRADFORD_M_INV[1][1] * scale[1] +
    BRADFORD_M_INV[1][2] * scale[2];
  const zo =
    BRADFORD_M_INV[2][0] * scale[0] +
    BRADFORD_M_INV[2][1] * scale[1] +
    BRADFORD_M_INV[2][2] * scale[2];
  
  return [xo, yo, zo];
}

/**
 * Convert XYZ to Lab with specified whitepoint
 * 
 * @param xyz XYZ color values
 * @param whitepoint Whitepoint type ('D65' or 'D50')
 * @param customWP Optional custom whitepoint from ICC profile [X, Y, Z]
 * @returns Lab color values
 */
export function xyzToLab(xyz: XYZ, whitepoint: Whitepoint = 'D65', customWP?: [number, number, number]): Lab {
  let [x, y, z] = [xyz.x, xyz.y, xyz.z];
  
  // Get reference white for target whitepoint
  // Priority: customWP > whitepoint
  let Xn: number, Yn: number, Zn: number;
  
  if (customWP) {
    // Use custom whitepoint (from ICC profile)
    // Adapt from D65 (since RGB is D65-based) to custom whitepoint
    [x, y, z] = adaptBradford(
      [x, y, z],
      D65_WHITE as [number, number, number],
      customWP
    );
    Xn = customWP[0];
    Yn = customWP[1];
    Zn = customWP[2];
  } else if (whitepoint === 'D50') {
    // If converting to D50, we need to adapt from D65 (since RGB is D65-based)
    [x, y, z] = adaptBradford(
      [x, y, z],
      D65_WHITE as [number, number, number],
      D50_WHITE as [number, number, number]
    );
    Xn = D50_WHITE[0];
    Yn = D50_WHITE[1];
    Zn = D50_WHITE[2];
  } else {
    // D65 (default)
    Xn = D65_WHITE[0];
    Yn = D65_WHITE[1];
    Zn = D65_WHITE[2];
  }
  
  const fx = fLab(x / Xn);
  const fy = fLab(y / Yn);
  const fz = fLab(z / Zn);
  
  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

/**
 * Convert hex color directly to Lab with specified whitepoint
 */
export function hexToLab(hex: string, whitepoint: Whitepoint = 'D65'): Lab | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const xyz = rgbToXyz(rgb);
  return xyzToLab(xyz, whitepoint);
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

/**
 * Bradford chromatic adaptation: Convert XYZ from D65 to D50 or vice versa
 * 
 * This is a convenience function that directly converts XYZ values between
 * D65 and D50 whitepoints using the Bradford transformation.
 * 
 * @param X X component of XYZ color
 * @param Y Y component of XYZ color
 * @param Z Z component of XYZ color
 * @param toD50 If true, convert from D65 to D50; if false, convert from D50 to D65
 * @returns Adapted XYZ values as [X, Y, Z]
 */
export function bradfordAdaptXYZ(
  X: number,
  Y: number,
  Z: number,
  toD50: boolean
): [number, number, number] {
  const src = toD50 ? D65_WHITE : D50_WHITE;
  const dst = toD50 ? D50_WHITE : D65_WHITE;
  
  return adaptBradford(
    [X, Y, Z],
    src as [number, number, number],
    dst as [number, number, number]
  );
}

/**
 * Get whitepoint XYZ values
 * 
 * @param whitepoint Whitepoint type ('D65' or 'D50')
 * @returns Whitepoint XYZ values as [X, Y, Z]
 */
export function getWhitepointXYZ(whitepoint: Whitepoint): [number, number, number] {
  return whitepoint === 'D50'
    ? [D50_WHITE[0], D50_WHITE[1], D50_WHITE[2]]
    : [D65_WHITE[0], D65_WHITE[1], D65_WHITE[2]];
}

