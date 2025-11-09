/**
 * K-Means++ clustering implementation
 * Optimized for RGB color clustering with improved initialization
 * 
 * Based on the Borderline v4 implementation with enhancements:
 * - K-Means++ initialization for better cluster quality
 * - Direct RGB space clustering (faster than Lab space)
 * - Support for both Uint8ClampedArray (image data) and number[][] (point arrays)
 */

export interface Cluster {
  hex: string;
  rgb: [number, number, number];
  hsv: [number, number, number];
  share: number;
}

/**
 * K-Means++ initialization
 * Selects initial centroids that are well-spaced in the color space
 * 
 * @param points Array of RGB points [r, g, b] where each value is 0-255
 * @param k Number of clusters
 * @returns Array of initial centroid positions
 */
export function kmeansPlusPlusInit(
  points: number[][],
  k: number
): number[][] {
  const n = points.length;
  if (n === 0 || k === 0) return [];
  if (k >= n) return points.map(p => [...p]);

  const centroids: number[][] = [];
  
  // First centroid: random selection
  centroids.push([...points[Math.floor(Math.random() * n)]]);
  
  // Distance squared function for RGB space
  const dist2 = (p: number[], c: number[]): number => {
    return (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
  };
  
  // Select remaining centroids
  while (centroids.length < k) {
    // Calculate minimum distance from each point to nearest centroid
    const ds = points.map(p => {
      let minDist = Infinity;
      for (const c of centroids) {
        const d = dist2(p, c);
        if (d < minDist) minDist = d;
      }
      return minDist;
    });
    
    // Select point with probability proportional to distance squared
    const sum = ds.reduce((a, b) => a + b, 0);
    if (sum === 0) {
      // Fallback: random selection if all distances are zero
      centroids.push([...points[Math.floor(Math.random() * n)]]);
      continue;
    }
    
    let r = Math.random() * sum;
    let idx = 0;
    for (let i = 0; i < n; i++) {
      r -= ds[i];
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    centroids.push([...points[idx]]);
  }
  
  return centroids;
}

/**
 * Convert RGB to HSV
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 * @returns [hue (0-360), saturation (0-100), value (0-100)]
 */
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  
  let h = 0;
  if (d === 0) {
    h = 0;
  } else if (max === r) {
    h = 60 * (((g - b) / d) % 6);
  } else if (max === g) {
    h = 60 * (((b - r) / d) + 2);
  } else {
    h = 60 * (((r - g) / d) + 4);
  }
  if (h < 0) h += 360;
  
  const s = max === 0 ? 0 : (d / max);
  const v = max;
  
  return [h, s * 100, v * 100];
}

/**
 * Convert RGB to hex string
 * @param rgb RGB tuple [r, g, b] where each value is 0-255
 * @returns Hex color string (e.g., "#ff0000")
 */
function toHex(rgb: [number, number, number]): string {
  return `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * K-Means clustering in RGB space with K-Means++ initialization
 * 
 * @param points Image data as Uint8ClampedArray (RGBA format) or number[][] (RGB points)
 * @param k Number of clusters
 * @param maxIter Maximum iterations (default: 25)
 * @param usePP Use K-Means++ initialization (default: true)
 * @returns Array of clusters sorted by share (descending)
 */
export function kmeansRGB(
  points: Uint8ClampedArray | number[][],
  k: number,
  maxIter: number = 25,
  usePP: boolean = true
): Cluster[] {
  // Convert Uint8ClampedArray to number[][] if needed
  let pts: number[][];
  if (points instanceof Uint8ClampedArray) {
    const n = Math.floor(points.length / 4);
    pts = new Array<[number, number, number]>(n);
    for (let i = 0; i < n; i++) {
      pts[i] = [points[i * 4], points[i * 4 + 1], points[i * 4 + 2]];
    }
  } else {
    pts = points.map(p => [p[0], p[1], p[2]]);
  }
  
  const n = pts.length;
  if (n === 0) return [];
  if (k >= n) {
    // Each point is its own cluster
    return pts.map(p => {
      const hsv = rgbToHsv(p[0], p[1], p[2]);
      return {
        rgb: p as [number, number, number],
        hex: toHex(p as [number, number, number]),
        hsv,
        share: 1 / n,
      };
    });
  }
  
  // Initialize centroids
  let centroids: [number, number, number][];
  if (usePP) {
    const inits = kmeansPlusPlusInit(pts, k);
    centroids = inits.map(c => [c[0], c[1], c[2]] as [number, number, number]);
  } else {
    // Random initialization (fallback)
    centroids = [[...pts[Math.floor(n / 3)]] as [number, number, number]];
    while (centroids.length < k) {
      centroids.push([...pts[Math.floor(Math.random() * n)]] as [number, number, number]);
    }
  }
  
  // K-Means iterations
  const labels = new Uint16Array(n);
  
  for (let it = 0; it < maxIter; it++) {
    let moved = false;
    
    // Assignment step: assign each point to nearest centroid
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      let bestIdx = 0;
      let bestDist = Infinity;
      
      for (let c = 0; c < k; c++) {
        const cc = centroids[c];
        const d = (p[0] - cc[0]) ** 2 + (p[1] - cc[1]) ** 2 + (p[2] - cc[2]) ** 2;
        if (d < bestDist) {
          bestDist = d;
          bestIdx = c;
        }
      }
      
      if (labels[i] !== bestIdx) {
        labels[i] = bestIdx;
        moved = true;
      }
    }
    
    // Update step: recalculate centroids
    const sum = Array.from({ length: k }, () => [0, 0, 0, 0]); // [r, g, b, count]
    
    for (let i = 0; i < n; i++) {
      const li = labels[i];
      const p = pts[i];
      sum[li][0] += p[0];
      sum[li][1] += p[1];
      sum[li][2] += p[2];
      sum[li][3]++;
    }
    
    for (let c = 0; c < k; c++) {
      const cnt = sum[c][3] || 1;
      centroids[c] = [
        Math.round(sum[c][0] / cnt),
        Math.round(sum[c][1] / cnt),
        Math.round(sum[c][2] / cnt),
      ];
    }
    
    // Early termination if converged
    if (!moved) break;
  }
  
  // Count points per cluster and create result
  const counts = new Array(k).fill(0);
  for (let i = 0; i < n; i++) {
    counts[labels[i]]++;
  }
  
  // Create clusters with percentages
  const clusters: Cluster[] = centroids.map((c, i) => {
    const hsv = rgbToHsv(c[0], c[1], c[2]);
    return {
      rgb: c,
      hex: toHex(c),
      hsv,
      share: counts[i] / n,
    };
  });
  
  // Sort by share (descending) and filter empty clusters
  return clusters
    .filter(c => c.share > 0)
    .sort((a, b) => b.share - a.share);
}

/**
 * Convert number[][] points to Uint8ClampedArray format
 * Helper function for compatibility
 */
export function pointsToUint8Array(points: number[][]): Uint8ClampedArray {
  const result = new Uint8ClampedArray(points.length * 4);
  for (let i = 0; i < points.length; i++) {
    result[i * 4] = points[i][0];
    result[i * 4 + 1] = points[i][1];
    result[i * 4 + 2] = points[i][2];
    result[i * 4 + 3] = 255; // Alpha
  }
  return result;
}

