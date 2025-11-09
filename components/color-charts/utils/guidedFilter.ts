/**
 * Guided Filter for edge-preserving smoothing
 * 
 * Smooths a mask (or any grayscale image) while preserving edges based on
 * a guidance image (typically the intensity of the original image).
 * 
 * Based on the Borderline v4 implementation with enhancements:
 * - Efficient box filter using integral images
 * - Edge-preserving smoothing
 * - Configurable radius and regularization
 */

/**
 * Guided Filter for grayscale images
 * 
 * Filters input image `p` using guidance image `I` to produce output `q`.
 * The filter preserves edges in `I` while smoothing `p`.
 * 
 * Algorithm:
 * 1. Compute local statistics (mean, variance, covariance) using box filter
 * 2. Compute linear coefficients a and b for each pixel
 * 3. Apply box filter to a and b
 * 4. Output: q = meanA * I + meanB
 * 
 * @param I Guidance image (Float32Array, 0-1 range, typically image intensity)
 * @param p Input image to filter (Float32Array, 0-1 range, typically mask)
 * @param w Image width
 * @param h Image height
 * @param r Filter radius (default: 4). Larger = smoother, slower
 * @param eps Regularization parameter (default: 1e-3). Higher = more smoothing
 * @returns Filtered image (Float32Array, 0-1 range)
 */
export function guidedFilterGray(
  I: Float32Array,
  p: Float32Array,
  w: number,
  h: number,
  r: number = 4,
  eps: number = 1e-3
): Float32Array {
  if (I.length !== w * h || p.length !== w * h) {
    throw new Error('Image dimensions must match');
  }
  
  /**
   * Box filter using integral image for efficient mean computation
   * 
   * Computes the mean of each pixel's neighborhood (radius r) using
   * an integral image for O(1) per-pixel computation.
   */
  function boxMean(src: Float32Array): Float32Array {
    const dst = new Float32Array(w * h);
    
    // Build integral image
    // integral[y][x] = sum of all pixels from (0,0) to (x-1,y-1)
    const integral = new Float32Array((w + 1) * (h + 1));
    
    for (let y = 1; y <= h; y++) {
      let rowsum = 0;
      for (let x = 1; x <= w; x++) {
        rowsum += src[(y - 1) * w + (x - 1)];
        // integral[y][x] = sum above + sum left - sum top-left + current
        integral[y * (w + 1) + x] = integral[(y - 1) * (w + 1) + x] + rowsum;
      }
    }
    
    // Compute mean for each pixel using integral image
    const rad = r;
    for (let y = 0; y < h; y++) {
      const y0 = Math.max(0, y - rad);
      const y1 = Math.min(h - 1, y + rad);
      
      for (let x = 0; x < w; x++) {
        const x0 = Math.max(0, x - rad);
        const x1 = Math.min(w - 1, x + rad);
        
        // Use integral image to compute sum in rectangle [x0,y0] to [x1,y1]
        // D = sum from (0,0) to (x1,y1)
        // B = sum from (0,0) to (x0-1,y1)
        // C = sum from (0,0) to (x1,y0-1)
        // A = sum from (0,0) to (x0-1,y0-1)
        // Sum in rectangle = D - B - C + A
        const A = integral[y0 * (w + 1) + x0];
        const B = integral[y0 * (w + 1) + (x1 + 1)];
        const C = integral[(y1 + 1) * (w + 1) + x0];
        const D = integral[(y1 + 1) * (w + 1) + (x1 + 1)];
        
        const area = (x1 - x0 + 1) * (y1 - y0 + 1);
        dst[y * w + x] = (D - B - C + A) / area;
      }
    }
    
    return dst;
  }
  
  // Step 1: Compute local statistics
  const meanI = boxMean(I);  // Mean of guidance image
  const meanP = boxMean(p);  // Mean of input image
  
  // Mean of I * P (for covariance)
  const meanIp = boxMean(
    new Float32Array(w * h).map((_, i) => I[i] * p[i])
  );
  
  // Mean of I * I (for variance)
  const corrI = boxMean(
    new Float32Array(w * h).map((_, i) => I[i] * I[i])
  );
  
  // Variance of I: varI = E[I²] - E[I]²
  const varI = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    varI[i] = corrI[i] - meanI[i] * meanI[i];
  }
  
  // Step 2: Compute linear coefficients a and b
  // a = cov(I,P) / (var(I) + eps)
  // b = E[P] - a * E[I]
  const a = new Float32Array(w * h);
  const b = new Float32Array(w * h);
  
  for (let i = 0; i < w * h; i++) {
    // Covariance: cov(I,P) = E[I*P] - E[I]*E[P]
    const covIp = meanIp[i] - meanI[i] * meanP[i];
    
    // Linear coefficient
    const ai = covIp / (varI[i] + eps);
    a[i] = ai;
    b[i] = meanP[i] - ai * meanI[i];
  }
  
  // Step 3: Apply box filter to a and b
  const meanA = boxMean(a);
  const meanB = boxMean(b);
  
  // Step 4: Compute output: q = meanA * I + meanB
  const q = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    q[i] = meanA[i] * I[i] + meanB[i];
  }
  
  return q;
}

/**
 * Apply guided filter to a binary mask
 * 
 * Converts mask to float, applies guided filter, and binarizes result.
 * 
 * @param mask Binary mask (Uint8Array, 0 or 255)
 * @param guidance Guidance image (Float32Array, 0-1 range, typically image intensity)
 * @param w Image width
 * @param h Image height
 * @param r Filter radius (default: 4)
 * @param eps Regularization parameter (default: 1e-3)
 * @param threshold Binarization threshold (default: 0.5)
 * @returns Filtered and binarized mask (Uint8Array, 0 or 255)
 */
export function guidedFilterMask(
  mask: Uint8Array,
  guidance: Float32Array,
  w: number,
  h: number,
  r: number = 4,
  eps: number = 1e-3,
  threshold: number = 0.5
): Uint8Array {
  // Convert mask to float (0-1)
  const p = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    p[i] = mask[i] / 255;
  }
  
  // Apply guided filter
  const q = guidedFilterGray(guidance, p, w, h, r, eps);
  
  // Binarize result
  const result = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    result[i] = q[i] > threshold ? 255 : 0;
  }
  
  return result;
}

/**
 * Compute image intensity (luminance) from RGB data
 * 
 * @param data RGBA image data (Uint8ClampedArray)
 * @param w Image width
 * @param h Image height
 * @returns Intensity image (Float32Array, 0-1 range)
 */
export function computeIntensity(
  data: Uint8ClampedArray,
  w: number,
  h: number
): Float32Array {
  const intensity = new Float32Array(w * h);
  
  // Luminance: Y = 0.2126*R + 0.7152*G + 0.0722*B
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    intensity[i] = luma / 255; // Normalize to 0-1
  }
  
  return intensity;
}

/**
 * Complete pipeline: Apply guided filter to mask using image intensity as guidance
 * 
 * @param mask Binary mask (Uint8Array, 0 or 255)
 * @param imageData RGBA image data (Uint8ClampedArray)
 * @param w Image width
 * @param h Image height
 * @param r Filter radius (default: 4)
 * @param eps Regularization parameter (default: 1e-3)
 * @param threshold Binarization threshold (default: 0.5)
 * @returns Filtered and binarized mask (Uint8Array, 0 or 255)
 */
export function guidedFilterMaskWithImage(
  mask: Uint8Array,
  imageData: Uint8ClampedArray,
  w: number,
  h: number,
  r: number = 4,
  eps: number = 1e-3,
  threshold: number = 0.5
): Uint8Array {
  // Compute intensity from image
  const intensity = computeIntensity(imageData, w, h);
  
  // Apply guided filter
  return guidedFilterMask(mask, intensity, w, h, r, eps, threshold);
}

