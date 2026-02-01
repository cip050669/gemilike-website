/**
 * Enhanced Color Extraction with Borderline v4 Features
 * 
 * Provides enhanced versions of color extraction functions that integrate:
 * - SLIC Superpixels + Guided Filter for improved masking
 * - K-Means++ with Auto-K via GMM+BIC
 * - Borderline detection
 * - ICC profile support
 */

import {
  ImageAnalysis,
  ColorSample,
  MaskingOptions,
  DEFAULT_MASKING_OPTIONS,
  detectGemstoneMask,
  calculateColorPurity,
  rgbToHex,
  rgbToHsv,
} from './imageColorExtraction';
import { Whitepoint, getWhitepointXYZ, rgbToXyz, xyzToLab } from './colorConversions';
import { slicSuperpixels, majorityVoteMask } from './slicSuperpixels';
import { guidedFilterMaskWithImage } from './guidedFilter';
import { kmeansRGB } from './kmeansPlusPlus';
import { gmmDiagBIC, getOptimalK } from './gmmBIC';
import { circularStatsDeg, softCategory, hueBorderlineFromHist } from './circularStats';
import { ICCProfile } from './iccParser';
import { segmentGemstoneViaApi } from './mlSegmentation';

export interface EnhancedMaskingOptions extends MaskingOptions {
  useSLIC?: boolean;
  slicStep?: number;
  slicM?: number;
  useGuidedFilter?: boolean;
  guidedR?: number;
  guidedEps?: number;
  useMLSegmentation?: boolean;
}

export interface EnhancedClusteringOptions {
  useAutoK?: boolean;
  autoKMin?: number;
  autoKMax?: number;
  useKMeansPP?: boolean;
  kValue?: number | null;
}

export interface EnhancedAnalysisResult extends ImageAnalysis {
  borderline?: {
    isBorderline: boolean;
    primaryCategory: string;
    secondaryCategory?: string;
    confidence: number;
    hueMean: number;
    hueR: number;
    peakSeparation: number;
  };
  clustering?: {
    k: number;
    autoK: boolean;
    method: 'kmeans++' | 'kmeans';
  };
  masking?: {
    usedSLIC: boolean;
    usedGuidedFilter: boolean;
  };
  params?: {
    whitepoint: Whitepoint;
    iccWP?: [number, number, number];
    masking: EnhancedMaskingOptions;
    clustering: EnhancedClusteringOptions;
  };
}

/**
 * Enhanced color extraction with Borderline v4 features
 */
export async function extractColorsEnhanced(
  imageFile: File,
  sampleSize: number = 10000,
  cropRegion?: { x: number; y: number; width: number; height: number },
  whitepoint: Whitepoint = 'D65',
  iccProfile?: ICCProfile | null,
  maskingOptions?: EnhancedMaskingOptions,
  clusteringOptions?: EnhancedClusteringOptions
): Promise<EnhancedAnalysisResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageFile);

    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Determine effective whitepoint (ICC > D50/D65 toggle)
        let effectiveWP: [number, number, number];
        if (iccProfile?.wtpt) {
          effectiveWP = iccProfile.wtpt;
        } else {
          effectiveWP = getWhitepointXYZ(whitepoint);
        }

        // Get masking options with defaults
        const maskOpts: EnhancedMaskingOptions = {
          ...DEFAULT_MASKING_OPTIONS,
          ...maskingOptions,
        };

        // Step 1: Enhanced mask detection
        let mask: boolean[][];
        let usedSLIC = false;
        let usedGuidedFilter = false;

        if (maskOpts.useMLSegmentation) {
          try {
            mask = await segmentGemstoneViaApi(imageFile);
          } catch (error) {
            console.warn('ML-Segmentierung fehlgeschlagen, verwende Standard-Maskierung:', error);
            mask = detectGemstoneMask(ctx, canvas.width, canvas.height, maskOpts);
          }
        } else if (maskOpts.useSLIC || maskOpts.useGuidedFilter) {
          // Enhanced masking with SLIC + Guided Filter
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Create initial mask
          const initialMask = new Uint8Array(canvas.width * canvas.height);
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const pixelData = ctx.getImageData(x, y, 1, 1);
              const r = pixelData.data[0];
              const g = pixelData.data[1];
              const b = pixelData.data[2];
              const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
              const [, s] = rgbToHsv(r, g, b);
              
              let keep = true;
              if (maskOpts.white && luma > (maskOpts.wThr || 220) && s < 30) keep = false;
              if (maskOpts.black && luma < (maskOpts.bThr || 25)) keep = false;
              if (maskOpts.lowSat && s < (maskOpts.sThr || 8)) keep = false;
              
              initialMask[y * canvas.width + x] = keep ? 255 : 0;
            }
          }

          let finalMask: Uint8Array = initialMask;

          // SLIC refinement
          if (maskOpts.useSLIC) {
            const slicResult = slicSuperpixels(
              imageData,
              maskOpts.slicStep || 16,
              maskOpts.slicM || 10
            );
            finalMask = majorityVoteMask(slicResult, initialMask);
            usedSLIC = true;
          }

          // Guided Filter
          if (maskOpts.useGuidedFilter) {
            finalMask = guidedFilterMaskWithImage(
              finalMask,
              imageData.data,
              canvas.width,
              canvas.height,
              maskOpts.guidedR || 4,
              maskOpts.guidedEps || 1e-3,
              0.5
            );
            usedGuidedFilter = true;
          }

          // Convert to boolean mask
          mask = [];
          for (let y = 0; y < canvas.height; y++) {
            mask[y] = [];
            for (let x = 0; x < canvas.width; x++) {
              mask[y][x] = finalMask[y * canvas.width + x] > 128;
            }
          }
        } else {
          // Standard masking
          mask = detectGemstoneMask(ctx, canvas.width, canvas.height, maskOpts);
        }

        // Step 2: Extract color samples
        const pixels: ColorSample[] = [];
        const hues: number[] = [];
        const hueHist = new Array(360).fill(0);

        const startX = cropRegion ? Math.max(0, cropRegion.x) : 0;
        const startY = cropRegion ? Math.max(0, cropRegion.y) : 0;
        const endX = cropRegion ? Math.min(canvas.width, cropRegion.x + cropRegion.width) : canvas.width;
        const endY = cropRegion ? Math.min(canvas.height, cropRegion.y + cropRegion.height) : canvas.height;

        const baseStep = Math.max(1, Math.floor(((endX - startX) * (endY - startY)) / sampleSize));

        // First pass: try with mask
        for (let y = startY; y < endY; y += baseStep) {
          for (let x = startX; x < endX; x += baseStep) {
            if (!mask[y] || !mask[y][x]) continue;

            const imageData = ctx.getImageData(x, y, 1, 1);
            const r = imageData.data[0];
            const g = imageData.data[1];
            const b = imageData.data[2];
            // Relaxed alpha check: only skip fully transparent pixels
            if (imageData.data[3] < 10) continue;

            const hex = rgbToHex(r, g, b);
            const rgb = { r: r / 255, g: g / 255, b: b / 255 };
            const xyz = rgbToXyz(rgb);
            const lab = xyzToLab(xyz, whitepoint, effectiveWP);

            // Collect hue for borderline analysis
            const [h] = rgbToHsv(r, g, b);
            hues.push(h);
            hueHist[Math.floor(h) % 360]++;

            pixels.push({
              hex,
              rgb: { r, g, b },
              lab,
              xyz,
              percentage: 0,
              x,
              y,
              weight: 1,
            });
          }
        }

        // Fallback: if mask is too restrictive, sample from center region
        if (pixels.length === 0) {
          console.warn('Maske zu restriktiv, verwende Fallback: Zentrale Region');
          
          // Calculate center region (60% of image centered)
          const centerX = (startX + endX) / 2;
          const centerY = (startY + endY) / 2;
          const fallbackWidth = (endX - startX) * 0.6;
          const fallbackHeight = (endY - startY) * 0.6;
          const fallbackStartX = Math.max(startX, Math.floor(centerX - fallbackWidth / 2));
          const fallbackStartY = Math.max(startY, Math.floor(centerY - fallbackHeight / 2));
          const fallbackEndX = Math.min(endX, Math.floor(centerX + fallbackWidth / 2));
          const fallbackEndY = Math.min(endY, Math.floor(centerY + fallbackHeight / 2));
          
          const fallbackStep = Math.max(1, Math.floor((fallbackWidth * fallbackHeight) / sampleSize));
          
          for (let y = fallbackStartY; y < fallbackEndY; y += fallbackStep) {
            for (let x = fallbackStartX; x < fallbackEndX; x += fallbackStep) {
              const imageData = ctx.getImageData(x, y, 1, 1);
              const r = imageData.data[0];
              const g = imageData.data[1];
              const b = imageData.data[2];
              // Skip fully transparent or very dark pixels
              if (imageData.data[3] < 10) continue;
              if (r < 10 && g < 10 && b < 10) continue; // Skip pure black

              const hex = rgbToHex(r, g, b);
              const rgb = { r: r / 255, g: g / 255, b: b / 255 };
              const xyz = rgbToXyz(rgb);
              const lab = xyzToLab(xyz, whitepoint, effectiveWP);

              const [h] = rgbToHsv(r, g, b);
              hues.push(h);
              hueHist[Math.floor(h) % 360]++;

              pixels.push({
                hex,
                rgb: { r, g, b },
                lab,
                xyz,
                percentage: 0,
                x,
                y,
                weight: 0.8, // Lower weight for fallback pixels
              });
            }
          }
        }

        // Final fallback: if still no pixels, sample entire image (excluding edges)
        if (pixels.length === 0) {
          console.warn('Fallback fehlgeschlagen, verwende gesamtes Bild (ohne Ränder)');
          
          const edgeMargin = Math.min(canvas.width, canvas.height) * 0.1;
          const fullStartX = Math.floor(edgeMargin);
          const fullStartY = Math.floor(edgeMargin);
          const fullEndX = Math.floor(canvas.width - edgeMargin);
          const fullEndY = Math.floor(canvas.height - edgeMargin);
          
          const fullStep = Math.max(1, Math.floor(((fullEndX - fullStartX) * (fullEndY - fullStartY)) / sampleSize));
          
          for (let y = fullStartY; y < fullEndY; y += fullStep) {
            for (let x = fullStartX; x < fullEndX; x += fullStep) {
              const imageData = ctx.getImageData(x, y, 1, 1);
              const r = imageData.data[0];
              const g = imageData.data[1];
              const b = imageData.data[2];
              // Skip fully transparent or very dark pixels
              if (imageData.data[3] < 10) continue;
              if (r < 10 && g < 10 && b < 10) continue; // Skip pure black

              const hex = rgbToHex(r, g, b);
              const rgb = { r: r / 255, g: g / 255, b: b / 255 };
              const xyz = rgbToXyz(rgb);
              const lab = xyzToLab(xyz, whitepoint, effectiveWP);

              const [h] = rgbToHsv(r, g, b);
              hues.push(h);
              hueHist[Math.floor(h) % 360]++;

              pixels.push({
                hex,
                rgb: { r, g, b },
                lab,
                xyz,
                percentage: 0,
                x,
                y,
                weight: 0.5, // Even lower weight for final fallback
              });
            }
          }
        }

        // Validate that we have pixels to analyze
        if (pixels.length === 0) {
          URL.revokeObjectURL(url);
          reject(new Error('Keine Pixel gefunden. Bitte stellen Sie sicher, dass das Bild ein Edelstein zeigt und die Maske korrekt erkannt wurde. Versuchen Sie ein anderes Bild oder deaktivieren Sie die erweiterte Maskierung.'));
          return;
        }

        // Step 3: Enhanced clustering
        const clusterOpts: EnhancedClusteringOptions = {
          useAutoK: true,
          autoKMin: 3,
          autoKMax: 8,
          useKMeansPP: true,
          ...clusteringOptions,
        };

        let finalK: number;
        let usedAutoK = false;

        if (clusterOpts.useAutoK && pixels.length > 100) {
          // Auto-K via GMM+BIC
          const points = pixels.map(p => [p.rgb.r * 255, p.rgb.g * 255, p.rgb.b * 255]);
          const gmmResult = gmmDiagBIC(points, clusterOpts.autoKMin || 3, clusterOpts.autoKMax || 8);
          finalK = getOptimalK(gmmResult);
          usedAutoK = true;
        } else {
          // Manual K
          finalK = clusterOpts.kValue || Math.min(Math.max(3, Math.floor(pixels.length / 100)), 20);
        }

        // Use K-Means++ in RGB space
        const rgbPoints = pixels.map(p => [p.rgb.r * 255, p.rgb.g * 255, p.rgb.b * 255]);
        const kmeansClusters = kmeansRGB(rgbPoints, finalK, 25, clusterOpts.useKMeansPP !== false);

        // Convert back to ColorSample format
        const clusters: ColorSample[] = kmeansClusters.map((c) => {
          // Find closest pixel for Lab values
          let closestPixel = pixels[0];
          let minDist = Infinity;
          for (const p of pixels) {
            const dist = Math.sqrt(
              (p.rgb.r * 255 - c.rgb[0]) ** 2 +
              (p.rgb.g * 255 - c.rgb[1]) ** 2 +
              (p.rgb.b * 255 - c.rgb[2]) ** 2
            );
            if (dist < minDist) {
              minDist = dist;
              closestPixel = p;
            }
          }

          return {
            hex: c.hex,
            rgb: { r: c.rgb[0], g: c.rgb[1], b: c.rgb[2] },
            lab: closestPixel.lab,
            xyz: closestPixel.xyz,
            percentage: c.share * 100,
            x: 0,
            y: 0,
            weight: c.share,
          };
        });

        // Normalize percentages
        const total = clusters.reduce((sum, c) => sum + c.percentage, 0);
        if (total > 0) {
          clusters.forEach(c => {
            c.percentage = (c.percentage / total) * 100;
          });
        }

        // Step 4: Borderline analysis
        let borderlineAnalysis: EnhancedAnalysisResult['borderline'] | undefined;
        if (hues.length > 0) {
          const circStats = circularStatsDeg(hues);
          const category = softCategory(circStats.mean);
          const histAnalysis = hueBorderlineFromHist(hueHist, 3);

          borderlineAnalysis = {
            isBorderline: category.borderline,
            primaryCategory: category.primary.name,
            secondaryCategory: category.secondary?.name,
            confidence: category.conf,
            hueMean: circStats.mean,
            hueR: circStats.R,
            peakSeparation: histAnalysis.sepDeg,
          };
        }

        // Validate that we have clusters
        if (clusters.length === 0) {
          URL.revokeObjectURL(url);
          reject(new Error('Keine Farbcluster gefunden. Bitte versuchen Sie es mit einem anderen Bild.'));
          return;
        }

        // Step 5: Calculate metrics
        const sorted = clusters.sort((a, b) => b.percentage - a.percentage);
        const primaryColor = sorted[0];
        
        // Validate that primaryColor exists
        if (!primaryColor) {
          URL.revokeObjectURL(url);
          reject(new Error('Keine Primärfarbe gefunden. Bitte versuchen Sie es mit einem anderen Bild.'));
          return;
        }
        
        const secondaryColors = sorted.slice(1, 5);

        const totalWeight = clusters.reduce((sum, c) => sum + (c.weight || c.percentage), 0);
        const avgL = totalWeight > 0
          ? clusters.reduce((sum, c) => sum + c.lab.L * (c.weight || c.percentage), 0) / totalWeight
          : clusters.reduce((sum, c) => sum + c.lab.L, 0) / clusters.length;

        const avgS = totalWeight > 0
          ? clusters.reduce((sum, c) => {
              const chroma = Math.sqrt(c.lab.a ** 2 + c.lab.b ** 2);
              return sum + chroma * (c.weight || c.percentage);
            }, 0) / totalWeight
          : clusters.reduce((sum, c) => {
              const chroma = Math.sqrt(c.lab.a ** 2 + c.lab.b ** 2);
              return sum + chroma;
            }, 0) / clusters.length;

        const colorPurity = calculateColorPurity(clusters, primaryColor);

        URL.revokeObjectURL(url);

        resolve({
          primaryColor,
          secondaryColors,
          allColors: clusters,
          luminance: avgL,
          saturation: avgS,
          colorPurity,
          borderline: borderlineAnalysis,
          clustering: {
            k: finalK,
            autoK: usedAutoK,
            method: clusterOpts.useKMeansPP !== false ? 'kmeans++' : 'kmeans',
          },
          masking: {
            usedSLIC,
            usedGuidedFilter,
          },
          params: {
            whitepoint,
            iccWP: iccProfile?.wtpt,
            masking: maskOpts,
            clustering: clusterOpts,
          },
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
