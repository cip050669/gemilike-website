/**
 * SLIC (Simple Linear Iterative Clustering) Superpixels
 * 
 * Segments an image into homogeneous regions (superpixels) by clustering
 * pixels based on both color similarity and spatial proximity.
 * 
 * Based on the Borderline v4 implementation with enhancements:
 * - Efficient distance computation
 * - Configurable superpixel size and compactness
 * - Support for ImageData and raw pixel arrays
 */

export interface SLICResult {
  labels: Int32Array;        // Label for each pixel (index into clusters)
  clusters: number[][];     // Cluster centers [x, y, r, g, b]
  step: number;             // Superpixel step size
  width: number;            // Image width
  height: number;           // Image height
}

/**
 * SLIC Superpixels algorithm
 * 
 * Segments an image into approximately regular superpixels by iteratively
 * clustering pixels based on a combined distance metric that considers both
 * color similarity and spatial proximity.
 * 
 * @param img ImageData object containing RGBA pixel data
 * @param step Superpixel size (default: 16). Larger = bigger superpixels
 * @param m Compactness parameter (default: 10). Higher = more compact, follows edges better
 * @returns SLIC result with labels and cluster centers
 */
export function slicSuperpixels(
  img: ImageData,
  step: number = 16,
  m: number = 10
): SLICResult {
  const { width: w, height: h, data } = img;
  const S = step;
  
  // Clusters: [x, y, r, g, b] for each superpixel center
  const clusters: number[][] = [];
  
  // Labels: which cluster each pixel belongs to
  const labels = new Int32Array(w * h).fill(-1);
  
  // Distances: current minimum distance for each pixel
  const dists = new Float32Array(w * h).fill(Infinity);
  
  /**
   * Get RGB color at pixel index
   */
  function colorAt(i: number): [number, number, number] {
    return [data[i], data[i + 1], data[i + 2]];
  }
  
  /**
   * L2 distance in RGB color space
   */
  function l2(a: number[], b: number[]): number {
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  }
  
  // Initialize cluster centers on a regular grid
  for (let y = S / 2; y < h; y += S) {
    for (let x = S / 2; x < w; x += S) {
      const i = (Math.floor(y) * w + Math.floor(x)) * 4;
      const rgb = colorAt(i);
      // Store: [x, y, r, g, b]
      clusters.push([x, y, rgb[0], rgb[1], rgb[2]]);
    }
  }
  
  const nc = clusters.length;
  const iter = 5; // Number of iterations
  
  // Iterative clustering
  for (let it = 0; it < iter; it++) {
    // Assignment step: assign each pixel to nearest cluster
    for (let ci = 0; ci < nc; ci++) {
      const cx = clusters[ci][0];
      const cy = clusters[ci][1];
      
      // Search in 2S × 2S neighborhood around cluster center
      const yMin = Math.max(0, Math.floor(cy - S));
      const yMax = Math.min(h, Math.floor(cy + S));
      const xMin = Math.max(0, Math.floor(cx - S));
      const xMax = Math.min(w, Math.floor(cx + S));
      
      for (let y = yMin; y < yMax; y++) {
        for (let x = xMin; x < xMax; x++) {
          const i = (y * w + x) * 4;
          const pos = y * w + x;
          
          // Color distance
          const dc = l2(colorAt(i), [clusters[ci][2], clusters[ci][3], clusters[ci][4]]);
          
          // Spatial distance
          const ds = Math.hypot(x - cx, y - cy);
          
          // Combined distance: D = sqrt(dc² + (ds/S)² × m²)
          // The (ds/S)² term normalizes spatial distance by superpixel size
          // m controls the relative weight of spatial vs. color distance
          const D = Math.sqrt(dc * dc + (ds / S) * (ds / S) * m * m);
          
          // Update if this is closer than previous best
          if (D < dists[pos]) {
            dists[pos] = D;
            labels[pos] = ci;
          }
        }
      }
    }
    
    // Update step: recalculate cluster centers based on assigned pixels
    // Accumulator: [sum_x, sum_y, sum_r, sum_g, sum_b, count]
    const acc = Array.from({ length: nc }, () => [0, 0, 0, 0, 0, 0]);
    
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const li = labels[y * w + x];
        if (li < 0) continue;
        
        const i = (y * w + x) * 4;
        acc[li][0] += x;           // sum_x
        acc[li][1] += y;           // sum_y
        acc[li][2] += data[i];     // sum_r
        acc[li][3] += data[i + 1]; // sum_g
        acc[li][4] += data[i + 2]; // sum_b
        acc[li][5] += 1;           // count
      }
    }
    
    // Update cluster centers
    for (let ci = 0; ci < nc; ci++) {
      const c = acc[ci];
      const N = Math.max(1, c[5]); // Avoid division by zero
      clusters[ci] = [
        c[0] / N, // mean_x
        c[1] / N, // mean_y
        c[2] / N, // mean_r
        c[3] / N, // mean_g
        c[4] / N, // mean_b
      ];
    }
    
    // Reset distances for next iteration
    dists.fill(Infinity);
  }
  
  return {
    labels,
    clusters,
    step: S,
    width: w,
    height: h,
  };
}

/**
 * Apply majority voting to a mask using SLIC superpixels
 * 
 * For each superpixel, determines whether it should be foreground or background
 * based on the majority of pixels in that superpixel.
 * 
 * @param slicResult Result from slicSuperpixels()
 * @param mask Binary mask (Uint8Array, 0 or 255)
 * @returns Refined mask with majority voting per superpixel
 */
export function majorityVoteMask(
  slicResult: SLICResult,
  mask: Uint8Array
): Uint8Array {
  const { labels, clusters, width: w, height: h } = slicResult;
  const nc = clusters.length;
  
  // Count foreground and background pixels per superpixel
  const counts = Array.from({ length: nc }, () => [0, 0]); // [fg, bg]
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pos = y * w + x;
      const li = labels[pos];
      if (li < 0) continue;
      
      if (mask[pos] > 128) {
        // Foreground
        counts[li][0]++;
      } else {
        // Background
        counts[li][1]++;
      }
    }
  }
  
  // Decide per superpixel: foreground if fg >= bg
  const choose = counts.map(c => (c[0] >= c[1] ? 255 : 0));
  
  // Create refined mask
  const refinedMask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const pos = y * w + x;
      const li = labels[pos];
      if (li >= 0) {
        refinedMask[pos] = choose[li];
      }
    }
  }
  
  return refinedMask;
}

/**
 * Helper function to create ImageData from raw pixel data
 * 
 * @param data RGBA pixel data (Uint8ClampedArray)
 * @param width Image width
 * @param height Image height
 * @returns ImageData object
 */
export function createImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(data);
  return imageData;
}

