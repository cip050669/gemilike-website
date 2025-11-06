/**
 * Image color extraction utilities
 * Extracts colors from gemstone images for analysis
 */

export interface ColorSample {
  hex: string;
  rgb: { r: number; g: number; b: number };
  lab: { L: number; a: number; b: number };
  xyz: { x: number; y: number; z: number };
  percentage: number;
  x: number;
  y: number;
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

        // Sample pixels only from gemstone area
        const pixels: ColorSample[] = [];
        const step = Math.max(1, Math.floor(((endX - startX) * (endY - startY)) / sampleSize));

        for (let y = startY; y < endY; y += step) {
          for (let x = startX; x < endX; x += step) {
            // Only process pixels that are part of the gemstone
            if (!mask[y] || !mask[y][x]) continue;

            const imageData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b] = imageData.data;
            
            // Skip transparent pixels
            if (imageData.data[3] < 128) continue;

            const hex = rgbToHex(r, g, b);
            const rgb = { r: r / 255, g: g / 255, b: b / 255 };
            const xyz = rgbToXyz(rgb);
            const lab = xyzToLab(xyz);

            pixels.push({
              hex,
              rgb: { r, g, b },
              lab,
              xyz,
              percentage: 0,
              x,
              y,
            });
          }
        }

        // Cluster similar colors
        const clustered = clusterColors(pixels);
        
        // Calculate primary and secondary colors
        const sorted = clustered.sort((a, b) => b.percentage - a.percentage);
        const primaryColor = sorted[0];
        const secondaryColors = sorted.slice(1, 5); // Top 4 secondary colors

        // Calculate overall metrics
        const avgL = clustered.reduce((sum, c) => sum + c.lab.L, 0) / clustered.length;
        const avgS = clustered.reduce((sum, c) => {
          const chroma = Math.sqrt(c.lab.a ** 2 + c.lab.b ** 2);
          return sum + chroma;
        }, 0) / clustered.length;
        
        // Color purity (how close colors are to primary)
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
 * Cluster similar colors together
 */
function clusterColors(colors: ColorSample[]): ColorSample[] {
  const clusters: ColorSample[] = [];
  const threshold = 15; // Delta E threshold for clustering

  for (const color of colors) {
    let found = false;
    for (const cluster of clusters) {
      const deltaE = calculateDeltaE(color.lab, cluster.lab);
      if (deltaE < threshold) {
        // Merge into existing cluster
        cluster.percentage += 1;
        // Weighted average of colors
        const total = cluster.percentage;
        cluster.lab.L = (cluster.lab.L * (total - 1) + color.lab.L) / total;
        cluster.lab.a = (cluster.lab.a * (total - 1) + color.lab.a) / total;
        cluster.lab.b = (cluster.lab.b * (total - 1) + color.lab.b) / total;
        found = true;
        break;
      }
    }
    if (!found) {
      clusters.push({ ...color, percentage: 1 });
    }
  }

  // Normalize percentages
  const total = clusters.reduce((sum, c) => sum + c.percentage, 0);
  clusters.forEach(c => {
    c.percentage = (c.percentage / total) * 100;
  });

  return clusters;
}

/**
 * Calculate Delta E between two Lab colors
 */
function calculateDeltaE(lab1: { L: number; a: number; b: number }, lab2: { L: number; a: number; b: number }): number {
  const dL = lab1.L - lab2.L;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;
  return Math.sqrt(dL ** 2 + da ** 2 + db ** 2);
}

/**
 * Calculate color purity (how uniform the colors are)
 */
function calculateColorPurity(colors: ColorSample[], primary: ColorSample): number {
  const avgDeltaE = colors.reduce((sum, c) => {
    return sum + calculateDeltaE(c.lab, primary.lab);
  }, 0) / colors.length;
  
  // Normalize to 0-100 (lower delta E = higher purity)
  return Math.max(0, 100 - (avgDeltaE / 2));
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

        for (let y = startY; y < endY; y += 5) {
          for (let x = startX; x < endX; x += 5) {
            // Only process gemstone pixels
            if (!mask[y] || !mask[y][x]) continue;

            const imageData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b] = imageData.data;
            
            if (imageData.data[3] < 128) continue;

            const hex = rgbToHex(r, g, b);
            const rgb = { r: r / 255, g: g / 255, b: b / 255 };
            const xyz = rgbToXyz(rgb);
            const lab = xyzToLab(xyz);

            const sample: ColorSample = {
              hex,
              rgb: { r, g, b },
              lab,
              xyz,
              percentage: 0,
              x,
              y,
            };

            const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const luminance = lab.L;

            if (distFromCenter < centerRadius) {
              center.push(sample);
            } else if (luminance > 60) {
              facets.push(sample);
            } else if (luminance < 40) {
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

