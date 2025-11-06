/**
 * CIEDE2000 color difference calculation
 * Implementation of the CIEDE2000 color difference formula
 */

import { Lab, hexToLab } from './colorConversions';

/**
 * Convert degrees to radians
 */
function deg2rad(d: number): number {
  return (d * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
function rad2deg(r: number): number {
  return (r * 180) / Math.PI;
}

/**
 * Calculate CIEDE2000 color difference between two Lab colors
 * Returns a value where:
 * - 0-1: Not perceptible by human eyes
 * - 1-2: Perceptible through close observation
 * - 2-10: Perceptible at a glance
 * - 11-49: Colors are more similar than opposite
 * - 100: Colors are exact opposite
 */
export function deltaE2000(lab1: Lab, lab2: Lab): number {
  const { L: L1, a: a1, b: b1 } = lab1;
  const { L: L2, a: a2, b: b2 } = lab2;
  
  // Weighting factors (default values)
  const kL = 1;
  const kC = 1;
  const kH = 1;
  
  // Calculate chroma
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cbar = (C1 + C2) / 2;
  
  // Calculate G (chroma weighting factor)
  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cbar, 7) / (Math.pow(Cbar, 7) + Math.pow(25, 7))));
  
  // Calculate a' (adjusted a values)
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  
  // Calculate C' (adjusted chroma)
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  
  // Calculate h' (adjusted hue angles)
  const h1p = (Math.atan2(b1, a1p) + 2 * Math.PI) % (2 * Math.PI);
  const h2p = (Math.atan2(b2, a2p) + 2 * Math.PI) % (2 * Math.PI);
  
  // Calculate differences
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  
  // Calculate delta h'
  let dhp = h2p - h1p;
  if (dhp > Math.PI) dhp -= 2 * Math.PI;
  if (dhp < -Math.PI) dhp += 2 * Math.PI;
  
  // Calculate delta H'
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp / 2);
  
  // Calculate mean values
  const Lbarp = (L1 + L2) / 2;
  const Cbarp = (C1p + C2p) / 2;
  
  // Calculate mean h'
  let hbarp = h1p + h2p;
  if (Math.abs(h1p - h2p) > Math.PI) hbarp += 2 * Math.PI;
  hbarp /= 2;
  
  // Calculate T (hue rotation term)
  const T =
    1 -
    0.17 * Math.cos(hbarp - deg2rad(30)) +
    0.24 * Math.cos(2 * hbarp) +
    0.32 * Math.cos(3 * hbarp + deg2rad(6)) -
    0.20 * Math.cos(4 * hbarp - deg2rad(63));
  
  // Calculate delta theta
  const dRo = deg2rad(30) * Math.exp(-Math.pow((rad2deg(hbarp) - 275) / 25, 2));
  
  // Calculate Rc (chroma rotation term)
  const Rc = 2 * Math.sqrt(Math.pow(Cbarp, 7) / (Math.pow(Cbarp, 7) + Math.pow(25, 7)));
  
  // Calculate weighting functions
  const Sl = 1 + (0.015 * Math.pow(Lbarp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbarp - 50, 2));
  const Sc = 1 + 0.045 * Cbarp;
  const Sh = 1 + 0.015 * Cbarp * T;
  
  // Calculate Rt (hue rotation term)
  const Rt = -Math.sin(2 * dRo) * Rc;
  
  // Calculate final delta E
  return Math.sqrt(
    Math.pow(dLp / (kL * Sl), 2) +
    Math.pow(dCp / (kC * Sc), 2) +
    Math.pow(dHp / (kH * Sh), 2) +
    Rt * (dCp / (kC * Sc)) * (dHp / (kH * Sh))
  );
}

/**
 * Calculate delta E2000 between two hex colors
 */
export function deltaE2000Hex(hex1: string, hex2: string): number | null {
  const lab1 = hexToLab(hex1);
  const lab2 = hexToLab(hex2);
  
  if (!lab1 || !lab2) return null;
  
  return deltaE2000(lab1, lab2);
}

/**
 * Get human-readable interpretation of delta E value
 */
export function getDeltaEInterpretation(deltaE: number): {
  level: string;
  description: string;
  color: string;
} {
  if (deltaE < 1) {
    return {
      level: 'Perfekt',
      description: 'Nicht wahrnehmbar',
      color: 'text-green-600 dark:text-green-400',
    };
  } else if (deltaE < 2) {
    return {
      level: 'Sehr gut',
      description: 'Nur bei genauer Betrachtung wahrnehmbar',
      color: 'text-green-500 dark:text-green-300',
    };
  } else if (deltaE < 3) {
    return {
      level: 'Gut',
      description: 'Bei genauer Betrachtung wahrnehmbar',
      color: 'text-yellow-500 dark:text-yellow-300',
    };
  } else if (deltaE < 5) {
    return {
      level: 'Akzeptabel',
      description: 'Auf den ersten Blick wahrnehmbar',
      color: 'text-orange-500 dark:text-orange-300',
    };
  } else if (deltaE < 10) {
    return {
      level: 'Unterschiedlich',
      description: 'Deutlich unterschiedlich',
      color: 'text-red-500 dark:text-red-300',
    };
  } else {
    return {
      level: 'Sehr unterschiedlich',
      description: 'Sehr deutlich unterschiedlich',
      color: 'text-red-600 dark:text-red-400',
    };
  }
}

