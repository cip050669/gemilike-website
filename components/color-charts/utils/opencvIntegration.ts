/**
 * OpenCV.js integration utilities
 * Provides GrabCut segmentation and brush tools for precise gemstone masking
 */

declare global {
  interface Window {
    cv: any;
  }
}

export type BrushMode = 'RECT' | 'FG' | 'BG';

export interface BrushStroke {
  x: number;
  y: number;
  r: number;
}

export interface RectRegion {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Load OpenCV.js dynamically
 * Tries multiple CDN URLs for reliability
 */
export async function loadOpenCV(): Promise<boolean> {
  if (window.cv && window.cv.Mat) {
    console.log('OpenCV.js bereits geladen');
    return true;
  }

  // Try multiple CDN URLs in order
  // Note: OpenCV.js is a large library (~8MB) and may not be available on all CDNs
  // If all fail, the system will fall back to automatic segmentation
  const urls = [
    'https://docs.opencv.org/4.10.0/opencv.js',
    'https://docs.opencv.org/4.9.0/opencv.js',
    'https://docs.opencv.org/4.8.0/opencv.js',
    'https://cdn.jsdelivr.net/gh/opencv/opencv@4.8.0/opencv.js',
  ];

  for (let i = 0; i < urls.length; i++) {
    try {
      const success = await tryLoadOpenCV(urls[i]);
      if (success) {
        return true;
      }
    } catch (error) {
      console.warn(`OpenCV.js konnte nicht von ${urls[i]} geladen werden.`);
      if (i === urls.length - 1) {
        // Last URL failed - return false instead of throwing
        // This allows the system to gracefully fall back to automatic segmentation
        console.warn('OpenCV.js konnte von keiner Quelle geladen werden. Automatische Segmentierung wird verwendet.');
        return false;
      }
    }
  }

  // If we get here, all URLs failed
  console.warn('OpenCV.js konnte nicht geladen werden. Automatische Segmentierung wird verwendet.');
  return false;
}

/**
 * Try to load OpenCV.js from a specific URL
 */
function tryLoadOpenCV(url: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      // Script already loading, wait for it
      const waitForCV = () => {
        if (window.cv && window.cv.Mat) {
          resolve(true);
        } else {
          setTimeout(waitForCV, 200);
        }
      };
      waitForCV();
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    let resolved = false;
    
    script.onload = () => {
      // Wait for OpenCV to be ready
      // OpenCV.js can be loaded in different ways:
      // 1. Directly as window.cv
      // 2. As a Promise (cv.then)
      // 3. As cv.onRuntimeInitialized callback
      
      let attempts = 0;
      const maxAttempts = 50; // 10 seconds max (50 * 200ms)
      
      const checkCV = () => {
        attempts++;
        
        // Check if cv is available directly
        if (window.cv) {
          // Check if it's a Promise
          if (typeof window.cv.then === 'function') {
            // It's a Promise, wait for it
            window.cv.then((cv: any) => {
              window.cv = cv;
              if (window.cv.Mat && typeof window.cv.Mat === 'function') {
                console.log(`OpenCV.js erfolgreich geladen von ${url} (Promise)`);
                if (!resolved) {
                  resolved = true;
                  resolve(true);
                }
              } else {
                if (!resolved && attempts < maxAttempts) {
                  setTimeout(checkCV, 200);
                } else if (!resolved) {
                  resolved = true;
                  reject(new Error('OpenCV Promise resolved but Mat not available'));
                }
              }
            }).catch((error: any) => {
              if (!resolved) {
                resolved = true;
                reject(new Error(`OpenCV Promise rejected: ${error}`));
              }
            });
            return;
          }
          
          // Direct cv object
          if (window.cv.Mat && typeof window.cv.Mat === 'function') {
            console.log(`OpenCV.js erfolgreich geladen von ${url}`);
            if (!resolved) {
              resolved = true;
              resolve(true);
            }
            return;
          }
          
          // Check for onRuntimeInitialized
          if (window.cv.onRuntimeInitialized) {
            window.cv.onRuntimeInitialized = () => {
              if (window.cv.Mat && typeof window.cv.Mat === 'function') {
                console.log(`OpenCV.js erfolgreich geladen von ${url} (onRuntimeInitialized)`);
                if (!resolved) {
                  resolved = true;
                  resolve(true);
                }
              }
            };
            return;
          }
        }
        
        // Continue waiting
        if (attempts < maxAttempts) {
          setTimeout(checkCV, 200);
        } else {
          if (!resolved) {
            resolved = true;
            reject(new Error(`OpenCV failed to initialize - timeout after ${maxAttempts * 200}ms`));
          }
        }
      };
      
      checkCV();
    };
    
    script.onerror = (error) => {
      // Don't log as error if it's just a network issue - this is expected for some CDNs
      console.warn(`OpenCV.js konnte nicht von ${url} geladen werden. Versuche nächste URL...`);
      if (!resolved) {
        resolved = true;
        reject(new Error(`Failed to load OpenCV.js from ${url}`));
      }
    };
    
    document.head.appendChild(script);
    
    // Timeout fallback
    setTimeout(() => {
      if (!resolved && !window.cv) {
        resolved = true;
        reject(new Error(`OpenCV.js loading timeout from ${url}`));
      }
    }, 15000); // 15 seconds total timeout
  });
}

/**
 * Apply GrabCut segmentation with brush seeds
 */
export function applyGrabCut(
  imageData: ImageData,
  fgStrokes: BrushStroke[],
  bgStrokes: BrushStroke[],
  rectRegion: RectRegion | null
): Uint8ClampedArray | null {
  if (!window.cv) {
    return null;
  }

  try {
    const cv = window.cv;
    const { width, height, data } = imageData;
    
    // Create OpenCV Mat from ImageData
    const src = cv.matFromImageData(imageData);
    const mask = new cv.Mat.zeros(height, width, cv.CV_8UC1);
    const bgdModel = new cv.Mat();
    const fgdModel = new cv.Mat();

    // Apply brush seeds to mask
    const drawSeeds = (strokes: BrushStroke[], value: number) => {
      for (const stroke of strokes) {
        cv.circle(
          mask,
          new cv.Point(Math.round(stroke.x), Math.round(stroke.y)),
          Math.round(stroke.r),
          new cv.Scalar(value),
          -1
        );
      }
    };

    if (fgStrokes.length > 0) {
      drawSeeds(fgStrokes, cv.GC_FGD);
    }
    if (bgStrokes.length > 0) {
      drawSeeds(bgStrokes, cv.GC_BGD);
    }

    // Determine initialization mode and run GrabCut
    const hasStrokes = fgStrokes.length > 0 || bgStrokes.length > 0;
    
    if (hasStrokes) {
      // Use mask mode if we have brush strokes
      cv.grabCut(
        src,
        mask,
        new cv.Rect(),
        bgdModel,
        fgdModel,
        5,
        cv.GC_INIT_WITH_MASK
      );
    } else if (rectRegion) {
      // Use rect mode if we only have a rectangle
      // Normalize rectangle (handle negative width/height from dragging)
      const rx = Math.round(Math.min(rectRegion.x, rectRegion.x + rectRegion.w));
      const ry = Math.round(Math.min(rectRegion.y, rectRegion.y + rectRegion.h));
      const rw = Math.round(Math.abs(rectRegion.w));
      const rh = Math.round(Math.abs(rectRegion.h));
      
      // Ensure rectangle is valid and within image bounds
      const validX = Math.max(0, Math.min(rx, width - 1));
      const validY = Math.max(0, Math.min(ry, height - 1));
      const validW = Math.min(rw, width - validX);
      const validH = Math.min(rh, height - validY);
      
      if (validW > 10 && validH > 10) { // Minimum size: 10x10 pixels
        console.log('GrabCut mit Rechteck:', { x: validX, y: validY, w: validW, h: validH });
        cv.grabCut(
          src,
          mask,
          new cv.Rect(validX, validY, validW, validH),
          bgdModel,
          fgdModel,
          5,
          cv.GC_INIT_WITH_RECT
        );
      } else {
        // Invalid rectangle (too small or out of bounds), return null
        console.warn('Ungültiges Rechteck für GrabCut:', { x: validX, y: validY, w: validW, h: validH });
        src.delete();
        mask.delete();
        bgdModel.delete();
        fgdModel.delete();
        return null;
      }
    } else {
      // No strokes and no rectangle - return null (use automatic segmentation)
      src.delete();
      mask.delete();
      bgdModel.delete();
      fgdModel.delete();
      return null;
    }

    // Extract alpha channel from mask
    const alpha = new Uint8ClampedArray(width * height);
    for (let i = 0; i < width * height; i++) {
      const row = Math.floor(i / width);
      const col = i % width;
      const v = mask.ucharPtr(row, col)[0];
      alpha[i] = (v === cv.GC_FGD || v === cv.GC_PR_FGD) ? 255 : 0;
    }

    // Cleanup
    src.delete();
    mask.delete();
    bgdModel.delete();
    fgdModel.delete();

    return alpha;
  } catch (error) {
    console.error('GrabCut error:', error);
    return null;
  }
}

