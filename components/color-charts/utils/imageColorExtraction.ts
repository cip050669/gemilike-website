/**
 * Image color extraction utilities
 * Extracts colors from gemstone images for analysis
 * Enhanced with improved accuracy algorithms
 */

import { deltaE2000 } from './deltaE2000';

export interface ColorSample {
  hex: string;
  rgb: { r: number; g: number; b: number };
  lab: { L: number; a: number; b: number };
  xyz: { x: number; y: number; z: number };
  percentage: number;
  x: number;
  y: number;
  weight?: number; // Weight for statistical calculations
}

export interface ImageAnalysis {
  primaryColor: ColorSample;
  secondaryColors: ColorSample[];
  allColors: ColorSample[];
  luminance: number;
  saturation: number;
  colorPurity: number;
}

/**
 * Detect and remove background from image
 * Returns a mask indicating which pixels belong to the gemstone
 */
function detectGemstoneMask(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): boolean[][] {
  const mask: boolean[][] = [];
  const backgroundTolerance = 40; // Tolerance for background color detection

  // First pass: detect background colors (typically white, light gray, or very light colors)
  const backgroundColors: { r: number; g: number; b: number }[] = [];

  // Sample corners and edges for background color
  const backgroundSamples = [
    // Corners
    { x: 0, y: 0 },
    { x: width - 1, y: 0 },
    { x: 0, y: height - 1 },
    { x: width - 1, y: height - 1 },
    // Edge centers
    { x: Math.floor(width / 2), y: 0 },
    { x: Math.floor(width / 2), y: height - 1 },
    { x: 0, y: Math.floor(height / 2) },
    { x: width - 1, y: Math.floor(height / 2) },
  ];

  for (const sample of backgroundSamples) {
    const imageData = ctx.getImageData(sample.x, sample.y, 1, 1);
    const [r, g, b] = imageData.data;
    if (imageData.data[3] > 128) {
      backgroundColors.push({ r, g, b });
    }
  }

  // Calculate average background color
  const avgBg = backgroundColors.length > 0
    ? backgroundColors.reduce(
        (acc, c) => ({ r: acc.r + c.r, g: acc.g + c.g, b: acc.b + c.b }),
        { r: 0, g: 0, b: 0 }
      )
    : { r: 255, g: 255, b: 255 };
  if (backgroundColors.length > 0) {
    avgBg.r /= backgroundColors.length;
    avgBg.g /= backgroundColors.length;
    avgBg.b /= backgroundColors.length;
  }

  // Initialize mask
  for (let y = 0; y < height; y++) {
    mask[y] = [];
    for (let x = 0; x < width; x++) {
      mask[y][x] = false;
    }
  }

  // Second pass: identify gemstone pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const imageData = ctx.getImageData(x, y, 1, 1);
      const [r, g, b, a] = imageData.data;

      // Skip transparent pixels
      if (a < 128) {
        mask[y][x] = false;
        continue;
      }

      // Check if pixel is similar to background
      const distToBg = Math.sqrt(
        Math.pow(r - avgBg.r, 2) +
        Math.pow(g - avgBg.g, 2) +
        Math.pow(b - avgBg.b, 2)
      );

      // Check if pixel is very bright (likely background)
      const brightness = (r + g + b) / 3;
      const isVeryBright = brightness > 240;

      // Check if pixel is very dark (likely shadow/background)
      const isVeryDark = brightness < 20;

      // Check color saturation (backgrounds are usually desaturated)
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      const isDesaturated = saturation < 0.1 && brightness > 200;

      // Pixel is part of gemstone if:
      // - Not too close to background color
      // - Not very bright (unless saturated)
      // - Not very dark (unless in center region)
      const centerX = width / 2;
      const centerY = height / 2;
      const distFromCenter = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
      const isNearCenter = distFromCenter < maxDist * 0.6;

      if (
        distToBg > backgroundTolerance &&
        !(isVeryBright && !isDesaturated) &&
        !(isVeryDark && !isNearCenter)
      ) {
        mask[y][x] = true;
      }
    }
  }

  // Third pass: flood fill from center to ensure we capture the gemstone
  const visited: boolean[][] = [];
  for (let y = 0; y < height; y++) {
    visited[y] = new Array(width).fill(false);
  }

  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  // Flood fill from center
  const queue: { x: number; y: number }[] = [{ x: centerX, y: centerY }];
  while (queue.length > 0) {
    const { x, y } = queue.shift()!;
    if (x < 0 || x >= width || y < 0 || y >= height || visited[y][x]) continue;

    visited[y][x] = true;
    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b, a] = imageData.data;

    if (a < 128) continue;

    // If pixel is not background-like, mark it as gemstone
    const brightness = (r + g + b) / 3;
    const distToBg = Math.sqrt(
      Math.pow(r - avgBg.r, 2) +
      Math.pow(g - avgBg.g, 2) +
      Math.pow(b - avgBg.b, 2)
    );

    if (distToBg > backgroundTolerance && brightness < 250) {
      mask[y][x] = true;
      // Add neighbors to queue
      queue.push({ x: x + 1, y });
      queue.push({ x: x - 1, y });
      queue.push({ x, y: y + 1 });
      queue.push({ x, y: y - 1 });
    }
  }

  return mask;
}

/**
 * Extract colors from image using canvas, focusing only on gemstone pixels
 */
export async function extractColorsFromImage(
  imageFile: File,
  sampleSize: number = 10000,
  cropRegion?: { x: number; y: number; width: number; height: number }
): Promise<ImageAnalysis> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Detect gemstone mask (which pixels belong to the gemstone)
        const mask = detectGemstoneMask(ctx, img.width, img.height);

        // Determine analysis region
        let startX = 0;
        let startY = 0;
        let endX = img.width;
        let endY = img.height;

        if (cropRegion) {
          startX = Math.max(0, cropRegion.x);
          startY = Math.max(0, cropRegion.y);
          endX = Math.min(img.width, cropRegion.x + cropRegion.width);
          endY = Math.min(img.height, cropRegion.y + cropRegion.height);
        }

        // Adaptive sampling: more samples in important areas
        const pixels: ColorSample[] = [];
        const baseStep = Math.max(1, Math.floor(((endX - startX) * (endY - startY)) / sampleSize));
        
        // First pass: uniform sampling
        for (let y = startY; y < endY; y += baseStep) {
          for (let x = startX; x < endX; x += baseStep) {
            if (!mask[y] || !mask[y][x]) continue;

            const imageData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b] = imageData.data;
            
            if (imageData.data[3] < 128) continue;

            const hex = rgbToHex(r, g, b);
            const rgb = { r: r / 255, g: g / 255, b: b / 255 };
            const xyz = rgbToXyz(rgb);
            const lab = xyzToLab(xyz);

            // Calculate weight based on color saturation (more saturated = more important)
            const chroma = Math.sqrt(lab.a ** 2 + lab.b ** 2);
            const weight = 1 + (chroma / 50); // Weight by chroma

            pixels.push({
              hex,
              rgb: { r, g, b },
              lab,
              xyz,
              percentage: 0,
              x,
              y,
              weight,
            });
          }
        }

        // Second pass: additional samples in high-contrast areas (edges, facets)
        const additionalSamples = Math.floor(sampleSize * 0.3); // 30% more samples
        const fineStep = Math.max(1, baseStep / 2);
        let added = 0;
        
        for (let y = startY; y < endY && added < additionalSamples; y += fineStep) {
          for (let x = startX; x < endX && added < additionalSamples; x += fineStep) {
            if (!mask[y] || !mask[y][x]) continue;
            
            // Check if this is an edge/high-contrast area
            const isEdge = detectEdge(ctx, x, y, mask, img.width, img.height);
            if (!isEdge && Math.random() > 0.3) continue; // Only sample edges with higher probability

            const imageData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b] = imageData.data;
            
            if (imageData.data[3] < 128) continue;

            const hex = rgbToHex(r, g, b);
            const rgb = { r: r / 255, g: g / 255, b: b / 255 };
            const xyz = rgbToXyz(rgb);
            const lab = xyzToLab(xyz);

            const chroma = Math.sqrt(lab.a ** 2 + lab.b ** 2);
            const weight = 1.5 + (chroma / 50); // Higher weight for edge samples

            pixels.push({
              hex,
              rgb: { r, g, b },
              lab,
              xyz,
              percentage: 0,
              x,
              y,
              weight,
            });
            added++;
          }
        }

        // Cluster similar colors
        const clustered = clusterColors(pixels);
        
        // Calculate primary and secondary colors
        const sorted = clustered.sort((a, b) => b.percentage - a.percentage);
        const primaryColor = sorted[0];
        const secondaryColors = sorted.slice(1, 5); // Top 4 secondary colors

        // Calculate overall metrics with weighted statistics
        const totalWeight = clustered.reduce((sum, c) => sum + (c.weight || c.percentage), 0);
        
        // Weighted average luminance
        const avgL = totalWeight > 0
          ? clustered.reduce((sum, c) => sum + c.lab.L * (c.weight || c.percentage), 0) / totalWeight
          : clustered.reduce((sum, c) => sum + c.lab.L, 0) / clustered.length;
        
        // Weighted average saturation
        const avgS = totalWeight > 0
          ? clustered.reduce((sum, c) => {
              const chroma = Math.sqrt(c.lab.a ** 2 + c.lab.b ** 2);
              return sum + chroma * (c.weight || c.percentage);
            }, 0) / totalWeight
          : clustered.reduce((sum, c) => {
              const chroma = Math.sqrt(c.lab.a ** 2 + c.lab.b ** 2);
              return sum + chroma;
            }, 0) / clustered.length;
        
        // Color purity (how close colors are to primary) using CIEDE2000
        const colorPurity = calculateColorPurity(clustered, primaryColor);

        resolve({
          primaryColor,
          secondaryColors,
          allColors: clustered,
          luminance: avgL,
          saturation: avgS,
          colorPurity,
        });

        URL.revokeObjectURL(url);
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Cluster similar colors together using improved K-Means with CIEDE2000
 * Uses CIEDE2000 for perceptually uniform color distance
 */
function clusterColors(colors: ColorSample[]): ColorSample[] {
  if (colors.length === 0) return [];
  if (colors.length === 1) {
    colors[0].percentage = 100;
    return colors;
  }

  // Use K-Means clustering with CIEDE2000
  const k = Math.min(Math.max(3, Math.floor(colors.length / 100)), 20); // Adaptive k
  const clusters = kMeansClustering(colors, k);
  
  // Normalize percentages
  const total = clusters.reduce((sum, c) => sum + c.percentage, 0);
  if (total > 0) {
    clusters.forEach(c => {
      c.percentage = (c.percentage / total) * 100;
    });
  }

  return clusters;
}

/**
 * K-Means clustering using CIEDE2000 distance metric
 */
function kMeansClustering(colors: ColorSample[], k: number, maxIterations: number = 20): ColorSample[] {
  if (colors.length === 0) return [];
  if (k >= colors.length) {
    // Each color is its own cluster
    return colors.map(c => ({ ...c, percentage: 1 }));
  }

  // Initialize centroids using k-means++ (better initialization)
  const centroids: ColorSample[] = [];
  
  // First centroid: random or most representative
  const firstIdx = Math.floor(Math.random() * colors.length);
  centroids.push({ ...colors[firstIdx] });

  // Select remaining centroids using k-means++
  for (let i = 1; i < k; i++) {
    const distances: number[] = [];
    for (const color of colors) {
      let minDist = Infinity;
      for (const centroid of centroids) {
        const dist = deltaE2000(color.lab, centroid.lab);
        if (dist < minDist) minDist = dist;
      }
      distances.push(minDist * minDist); // Square for probability weighting
    }
    
    // Select color with highest distance (farthest from existing centroids)
    const sum = distances.reduce((a, b) => a + b, 0);
    let random = Math.random() * sum;
    let selectedIdx = 0;
    for (let j = 0; j < distances.length; j++) {
      random -= distances[j];
      if (random <= 0) {
        selectedIdx = j;
        break;
      }
    }
    centroids.push({ ...colors[selectedIdx] });
  }

  // K-Means iterations
  let clusters: ColorSample[] = [];
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign colors to nearest centroid
    const assignments: number[] = new Array(colors.length).fill(-1);
    const clusterColors: ColorSample[][] = new Array(k).fill(null).map(() => []);
    const clusterWeights: number[] = new Array(k).fill(0);

    for (let i = 0; i < colors.length; i++) {
      let minDist = Infinity;
      let nearestCluster = 0;
      
      for (let j = 0; j < k; j++) {
        const dist = deltaE2000(colors[i].lab, centroids[j].lab);
        if (dist < minDist) {
          minDist = dist;
          nearestCluster = j;
        }
      }
      
      assignments[i] = nearestCluster;
      clusterColors[nearestCluster].push(colors[i]);
      clusterWeights[nearestCluster] += colors[i].weight || 1;
    }

    // Update centroids (weighted average)
    let converged = true;
    for (let j = 0; j < k; j++) {
      if (clusterColors[j].length === 0) continue;
      
      const totalWeight = clusterWeights[j];
      if (totalWeight === 0) continue;

      let newL = 0, newA = 0, newB = 0;
      let newR = 0, newG = 0, newBl = 0;
      
      for (const color of clusterColors[j]) {
        const weight = color.weight || 1;
        newL += color.lab.L * weight;
        newA += color.lab.a * weight;
        newB += color.lab.b * weight;
        newR += color.rgb.r * weight;
        newG += color.rgb.g * weight;
        newBl += color.rgb.b * weight;
      }
      
      const newCentroid: ColorSample = {
        hex: '', // Will be recalculated
        rgb: { r: newR / totalWeight, g: newG / totalWeight, b: newBl / totalWeight },
        lab: { L: newL / totalWeight, a: newA / totalWeight, b: newB / totalWeight },
        xyz: { x: 0, y: 0, z: 0 }, // Will be recalculated if needed
        percentage: clusterColors[j].length,
        x: 0,
        y: 0,
      };
      
      // Recalculate hex and xyz from averaged Lab
      newCentroid.hex = labToHex(newCentroid.lab);
      newCentroid.xyz = labToXyz(newCentroid.lab);
      
      // Check convergence
      const dist = deltaE2000(newCentroid.lab, centroids[j].lab);
      if (dist > 0.5) converged = false;
      
      centroids[j] = newCentroid;
    }

    if (converged && iter > 2) break;
  }

  // Create final clusters with percentages
  clusters = centroids.map((centroid, idx) => {
    // Count colors assigned to this cluster
    let count = 0;
    for (let i = 0; i < colors.length; i++) {
      const dist = deltaE2000(colors[i].lab, centroid.lab);
      // Find which centroid is nearest
      let minDist = dist;
      let nearestIdx = idx;
      for (let j = 0; j < k; j++) {
        const d = deltaE2000(colors[i].lab, centroids[j].lab);
        if (d < minDist) {
          minDist = d;
          nearestIdx = j;
        }
      }
      if (nearestIdx === idx) {
        count++;
      }
    }
    
    return {
      ...centroid,
      percentage: count,
    };
  });

  // Filter out empty clusters and sort by percentage
  return clusters
    .filter(c => c.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);
}

/**
 * Convert Lab to Hex (approximate, via XYZ and RGB)
 */
function labToHex(lab: { L: number; a: number; b: number }): string {
  const xyz = labToXyz(lab);
  const rgb = xyzToRgb(xyz);
  return rgbToHex(
    Math.round(Math.max(0, Math.min(255, rgb.r * 255))),
    Math.round(Math.max(0, Math.min(255, rgb.g * 255))),
    Math.round(Math.max(0, Math.min(255, rgb.b * 255)))
  );
}

/**
 * Convert Lab to XYZ
 */
function labToXyz(lab: { L: number; a: number; b: number }): { x: number; y: number; z: number } {
  const Xn = 0.95047;
  const Yn = 1.00000;
  const Zn = 1.08883;

  const fy = (lab.L + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const xr = fx > 0.206897 ? fx * fx * fx : (fx - 16 / 116) / 7.787;
  const yr = fy > 0.206897 ? fy * fy * fy : (fy - 16 / 116) / 7.787;
  const zr = fz > 0.206897 ? fz * fz * fz : (fz - 16 / 116) / 7.787;

  return {
    x: xr * Xn,
    y: yr * Yn,
    z: zr * Zn,
  };
}

/**
 * Convert XYZ to RGB
 */
function xyzToRgb(xyz: { x: number; y: number; z: number }): { r: number; g: number; b: number } {
  const gamma = (u: number) => u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055;
  
  const r = gamma(xyz.x * 3.2404542 + xyz.y * -1.5371385 + xyz.z * -0.4985314);
  const g = gamma(xyz.x * -0.9692660 + xyz.y * 1.8760108 + xyz.z * 0.0415560);
  const b = gamma(xyz.x * 0.0556434 + xyz.y * -0.2040259 + xyz.z * 1.0572252);

  return {
    r: Math.max(0, Math.min(1, r)),
    g: Math.max(0, Math.min(1, g)),
    b: Math.max(0, Math.min(1, b)),
  };
}

/**
 * Calculate Delta E between two Lab colors (legacy, now uses CIEDE2000)
 * Kept for backward compatibility, but CIEDE2000 is used in clustering
 * Note: This function is not currently used but kept for potential future use
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function calculateDeltaE(lab1: { L: number; a: number; b: number }, lab2: { L: number; a: number; b: number }): number {
  // Use CIEDE2000 for better perceptual accuracy
  return deltaE2000(lab1, lab2);
}

/**
 * Calculate color purity (how uniform the colors are) using CIEDE2000
 */
function calculateColorPurity(colors: ColorSample[], primary: ColorSample): number {
  if (colors.length === 0) return 0;
  
  const totalWeight = colors.reduce((sum, c) => sum + (c.weight || c.percentage), 0);
  
  // Weighted average Delta E using CIEDE2000
  const avgDeltaE = totalWeight > 0
    ? colors.reduce((sum, c) => {
        const deltaE = deltaE2000(c.lab, primary.lab);
        return sum + deltaE * (c.weight || c.percentage);
      }, 0) / totalWeight
    : colors.reduce((sum, c) => {
        return sum + deltaE2000(c.lab, primary.lab);
      }, 0) / colors.length;
  
  // Normalize to 0-100 (lower delta E = higher purity)
  // CIEDE2000 values: < 1 = not perceptible, < 3 = slight difference, < 10 = noticeable
  return Math.max(0, Math.min(100, 100 - (avgDeltaE * 3)));
}

/**
 * Detect if a pixel is on an edge (high contrast area)
 */
function detectEdge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  mask: boolean[][],
  width: number,
  height: number
): boolean {
  const neighbors = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];

  let validNeighbors = 0;
  let contrastSum = 0;

  const centerData = ctx.getImageData(x, y, 1, 1);
  const centerLum = (centerData.data[0] + centerData.data[1] + centerData.data[2]) / 3;

  for (const neighbor of neighbors) {
    if (neighbor.x < 0 || neighbor.x >= width || neighbor.y < 0 || neighbor.y >= height) continue;
    if (!mask[neighbor.y] || !mask[neighbor.y][neighbor.x]) continue;

    const neighborData = ctx.getImageData(neighbor.x, neighbor.y, 1, 1);
    const neighborLum = (neighborData.data[0] + neighborData.data[1] + neighborData.data[2]) / 3;
    
    const contrast = Math.abs(centerLum - neighborLum);
    contrastSum += contrast;
    validNeighbors++;
  }

  if (validNeighbors === 0) return false;
  
  const avgContrast = contrastSum / validNeighbors;
  return avgContrast > 15; // Threshold for edge detection
}

/**
 * Convert RGB to Hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
}

/**
 * Convert RGB to XYZ
 */
function rgbToXyz(rgb: { r: number; g: number; b: number }): { x: number; y: number; z: number } {
  const invGamma = (u: number) => u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4);
  
  const R = invGamma(rgb.r);
  const G = invGamma(rgb.g);
  const B = invGamma(rgb.b);

  return {
    x: R * 0.4124564 + G * 0.3575761 + B * 0.1804375,
    y: R * 0.2126729 + G * 0.7151522 + B * 0.0721750,
    z: R * 0.0193339 + G * 0.1191920 + B * 0.9503041,
  };
}

/**
 * Convert XYZ to Lab
 */
function xyzToLab(xyz: { x: number; y: number; z: number }): { L: number; a: number; b: number } {
  const Xn = 0.95047;
  const Yn = 1.00000;
  const Zn = 1.08883;

  const f = (t: number) => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27) * t + 16 / 116;

  const fx = f(xyz.x / Xn);
  const fy = f(xyz.y / Yn);
  const fz = f(xyz.z / Zn);

  return {
    L: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

/**
 * Analyze image regions (center, facets, shadows) - only gemstone pixels
 */
export async function analyzeImageRegions(
  imageFile: File,
  cropRegion?: { x: number; y: number; width: number; height: number }
): Promise<{
  center: ColorSample[];
  facets: ColorSample[];
  shadows: ColorSample[];
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Detect gemstone mask
        const mask = detectGemstoneMask(ctx, img.width, img.height);

        // Determine analysis region
        let startX = 0;
        let startY = 0;
        let endX = img.width;
        let endY = img.height;

        if (cropRegion) {
          startX = Math.max(0, cropRegion.x);
          startY = Math.max(0, cropRegion.y);
          endX = Math.min(img.width, cropRegion.x + cropRegion.width);
          endY = Math.min(img.height, cropRegion.y + cropRegion.height);
        }

        const center: ColorSample[] = [];
        const facets: ColorSample[] = [];
        const shadows: ColorSample[] = [];

        const centerX = (startX + endX) / 2;
        const centerY = (startY + endY) / 2;
        const centerRadius = Math.min(endX - startX, endY - startY) * 0.2;

        // Improved region detection with edge-aware sampling
        const step = 3; // Smaller step for better region detection
        
        for (let y = startY; y < endY; y += step) {
          for (let x = startX; x < endX; x += step) {
            // Only process gemstone pixels
            if (!mask[y] || !mask[y][x]) continue;

            const imageData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b] = imageData.data;
            
            if (imageData.data[3] < 128) continue;

            const hex = rgbToHex(r, g, b);
            const rgb = { r: r / 255, g: g / 255, b: b / 255 };
            const xyz = rgbToXyz(rgb);
            const lab = xyzToLab(xyz);

            // Detect if this is an edge (facet boundary)
            const isEdge = detectEdge(ctx, x, y, mask, img.width, img.height);
            
            const sample: ColorSample = {
              hex,
              rgb: { r, g, b },
              lab,
              xyz,
              percentage: 0,
              x,
              y,
              weight: isEdge ? 1.5 : 1.0, // Higher weight for edges (facets)
            };

            const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const luminance = lab.L;
            const chroma = Math.sqrt(lab.a ** 2 + lab.b ** 2);

            // Improved region classification
            if (distFromCenter < centerRadius) {
              center.push(sample);
            } else if (isEdge || (luminance > 55 && chroma > 10)) {
              // Facets: high luminance OR edges (facet boundaries) with good color
              facets.push(sample);
            } else if (luminance < 45 || chroma < 5) {
              // Shadows: low luminance OR very desaturated
              shadows.push(sample);
            }
          }
        }

        URL.revokeObjectURL(url);
        resolve({
          center: clusterColors(center),
          facets: clusterColors(facets),
          shadows: clusterColors(shadows),
        });
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

