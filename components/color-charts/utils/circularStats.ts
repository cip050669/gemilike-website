/**
 * Circular Statistics and Borderline Detection
 * 
 * Provides functions for analyzing hue distributions and detecting borderline colors
 * (colors that fall between categories, e.g., yellow-green/green).
 * 
 * Based on the Borderline v4 implementation with enhancements:
 * - Circular statistics for hue (0° = 360°)
 * - Soft category classification with confidence scores
 * - Peak detection in hue histograms
 */

export interface CircularStats {
  mean: number;      // Circular mean hue (0-360°)
  R: number;         // Resultant length (0-1), higher = more compact
  circVar: number;   // Circular variance (1-R), higher = more spread
}

export interface CategoryScore {
  name: string;
  score: number;     // Probability score (0-1)
}

export interface SoftCategory {
  primary: CategoryScore;      // Primary category
  secondary: CategoryScore | null;  // Secondary category (if borderline)
  conf: number;                // Confidence difference (primary - secondary)
  borderline: boolean;         // True if conf < 0.15 (borderline color)
  scores: CategoryScore[];      // All category scores
}

export interface HueHistogramAnalysis {
  sepDeg: number;    // Separation between peaks in degrees (0 if no clear separation)
  sm: number[];      // Smoothed histogram
}

/**
 * Color categories for soft classification
 * 
 * Each category has a center hue and a width (standard deviation).
 * Categories are defined in degrees (0-360).
 */
const CATEGORIES = [
  { name: 'Gelb', center: 90, width: 25 },
  { name: 'Gelbgrün', center: 75, width: 20 },
  { name: 'Grün', center: 140, width: 25 },
  { name: 'Blaugrün', center: 190, width: 22 },
  { name: 'Blau', center: 240, width: 22 },
  { name: 'Blauviolett', center: 280, width: 20 },
  { name: 'Violett', center: 300, width: 22 },
  { name: 'Rotviolett', center: 330, width: 20 },
  { name: 'Rot', center: 0, width: 22 },      // 0° = 360°
  { name: 'Rotorange', center: 20, width: 18 },
  { name: 'Orange', center: 40, width: 18 },
] as const;

/**
 * Calculate circular distance between two angles
 * 
 * @param a First angle in degrees (0-360)
 * @param b Second angle in degrees (0-360)
 * @returns Circular distance in degrees (0-180)
 */
export function circDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/**
 * Calculate circular statistics for hue values
 * 
 * Hue is circular (0° = 360°), so standard mean doesn't work.
 * Uses vector sum to compute circular mean.
 * 
 * @param hues Array of hue values in degrees (0-360)
 * @returns Circular statistics (mean, R, circVar)
 */
export function circularStatsDeg(hues: number[]): CircularStats {
  if (hues.length === 0) {
    return { mean: 0, R: 0, circVar: 1 };
  }
  
  const toRad = (d: number) => (d * Math.PI) / 180;
  
  // Convert to unit vectors and sum
  let x = 0;
  let y = 0;
  
  for (const h of hues) {
    x += Math.cos(toRad(h));
    y += Math.sin(toRad(h));
  }
  
  const n = hues.length;
  
  // Resultant length (0-1): measures how concentrated the data is
  const R = Math.sqrt((x / n) ** 2 + (y / n) ** 2);
  
  // Circular mean
  let mean = (Math.atan2(y, x) * 180) / Math.PI;
  if (mean < 0) mean += 360;
  
  // Circular variance (1-R): higher = more spread
  const circVar = 1 - R;
  
  return { mean, R, circVar };
}

/**
 * Soft category classification
 * 
 * Classifies a hue mean into color categories using Gaussian probability.
 * Returns primary and secondary categories with confidence scores.
 * 
 * @param hueMean Mean hue in degrees (0-360)
 * @returns Soft category classification with confidence scores
 */
export function softCategory(hueMean: number): SoftCategory {
  // Calculate probability score for each category
  const scores: CategoryScore[] = CATEGORIES.map((cat) => {
    const dist = circDist(hueMean, cat.center);
    // Gaussian probability: exp(-0.5 * (dist/width)²)
    const score = Math.exp(-0.5 * (dist / cat.width) ** 2);
    return { name: cat.name, score };
  });
  
  // Sort by score (descending)
  scores.sort((a, b) => b.score - a.score);
  
  const primary = scores[0];
  const secondary = scores[1] || null;
  
  // Confidence: difference between primary and secondary
  const conf = primary.score - (secondary?.score || 0);
  
  // Borderline: if confidence is low (< 0.15), it's a borderline color
  const borderline = conf < 0.15;
  
  return {
    primary,
    secondary,
    conf,
    borderline,
    scores,
  };
}

/**
 * Analyze hue histogram for peak separation
 * 
 * Detects multiple peaks in the hue histogram and calculates the separation
 * between them. Useful for detecting pleochroism (multiple color directions).
 * 
 * @param hist Hue histogram (array of counts, typically 360 bins for 0-360°)
 * @param smooth Smoothing radius (default: 3)
 * @returns Analysis with peak separation and smoothed histogram
 */
export function hueBorderlineFromHist(
  hist: number[],
  smooth: number = 3
): HueHistogramAnalysis {
  const bin = hist.length;
  
  // Smooth histogram using moving average
  const sm = new Array(bin).fill(0);
  for (let i = 0; i < bin; i++) {
    let s = 0;
    for (let k = -smooth; k <= smooth; k++) {
      s += hist[(i + k + bin) % bin]; // Wrap around for circular histogram
    }
    sm[i] = s;
  }
  
  // Find peaks (local maxima)
  const peaks: number[] = [];
  for (let i = 0; i < bin; i++) {
    const p = sm[i];
    const L = sm[(i - 1 + bin) % bin];
    const R = sm[(i + 1 + bin) % bin];
    
    if (p > L && p > R) {
      peaks.push(i);
    }
  }
  
  // Sort peaks
  peaks.sort((a, b) => a - b);
  
  // Find separation between peaks
  let sepDeg = 0;
  
  for (let i = 0; i < peaks.length; i++) {
    const a = peaks[i];
    const b = peaks[(i + 1) % peaks.length];
    
    // Calculate circular distance between peaks
    const d1 = (b - a + bin) % bin;
    const d2 = (a - b + bin) % bin;
    const d = Math.min(d1, d2) * (360 / bin);
    
    // Valid separation: between 6° and 40°
    if (d > 6 && d < 40) {
      sepDeg = d;
      break;
    }
  }
  
  return { sepDeg, sm };
}

/**
 * Get all color categories
 * 
 * @returns Array of color categories with center and width
 */
export function getColorCategories(): typeof CATEGORIES {
  return [...CATEGORIES];
}

/**
 * Get category by name
 * 
 * @param name Category name
 * @returns Category or null if not found
 */
export function getCategoryByName(name: string): (typeof CATEGORIES)[number] | null {
  return CATEGORIES.find((cat) => cat.name === name) || null;
}

