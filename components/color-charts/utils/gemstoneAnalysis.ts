/**
 * Gemstone color analysis utilities
 * Provides gemmological analysis based on color data
 */

import { ColorSample } from './imageColorExtraction';
import { deltaE2000 } from './deltaE2000';

// Re-export deltaE2000 for use in this file
function calculateDeltaE(lab1: { L: number; a: number; b: number }, lab2: { L: number; a: number; b: number }): number {
  return deltaE2000(lab1, lab2);
}

export interface PrimaryColorAnalysis {
  tone: string;
  hex: string;
  rgb: { r: number; g: number; b: number }; // 0-255 range
  cieHue: string;
  description: string;
  originSuggestion: string[];
}

export interface SecondaryColorAnalysis {
  region: string;
  hex: string;
  rgb: { r: number; g: number; b: number }; // 0-255 range
  tone: string;
  percentage: number;
}

export interface LuminanceSaturationAnalysis {
  luminance: {
    value: number;
    assessment: string;
    remark: string;
  };
  saturation: {
    value: number;
    assessment: string;
    remark: string;
  };
  colorPurity: {
    value: number;
    assessment: string;
    remark: string;
  };
}

export interface SpectralCharacteristic {
  mainAbsorption: string;
  secondaryAbsorption: string;
  transmission: string;
  weakTransmission: string;
  interpretation: string;
}

export interface GIAColorGrade {
  hue: string;
  tone: string;
  saturation: string;
  finalColorGrade: string;
  evaluation: string;
}

export interface OverallImpression {
  dominantColorTone: string;
  saturation: string;
  pleochroism: string;
  correctedPleochroism?: string; // Manuell korrigierter Pleochroismus (isotrop/anisotrop)
  possibleColorCause: string[];
  possibleVariety: string[];
  correctedVariety?: string[]; // Manuell korrigierte Varietät für Lernsystem
  opticalQuality: string;
  overallImpression: string;
  evaluation: string;
}

/**
 * Analyze primary color
 */
export function analyzePrimaryColor(color: ColorSample): PrimaryColorAnalysis {
  const { lab, hex, rgb } = color;
  
  // Determine tone (lightness)
  const tone = getToneDescription(lab.L);
  
  // Determine CIE Hue
  const cieHue = getCIEHue(lab.a, lab.b);
  
  // Get color description
  const description = getColorDescription(hex, lab);
  
  // Suggest possible origins based on color
  const originSuggestion = suggestOrigin(hex, lab);

  return {
    tone,
    hex,
    rgb: { r: rgb.r, g: rgb.g, b: rgb.b }, // Already in 0-255 range from ColorSample
    cieHue,
    description,
    originSuggestion,
  };
}

/**
 * Analyze secondary colors by region
 */
export function analyzeSecondaryColors(
  center: ColorSample[],
  facets: ColorSample[],
  shadows: ColorSample[]
): SecondaryColorAnalysis[] {
  const results: SecondaryColorAnalysis[] = [];

  // Central region
  if (center.length > 0) {
    const primary = center[0];
    results.push({
      region: 'Zentralbereich',
      hex: primary.hex,
      rgb: { r: primary.rgb.r, g: primary.rgb.g, b: primary.rgb.b }, // Already in 0-255 range from ColorSample
      tone: getToneDescription(primary.lab.L),
      percentage: primary.percentage,
    });
  }

  // Facet reflections
  if (facets.length > 0) {
    const primary = facets[0];
    results.push({
      region: 'Facettenreflexe',
      hex: primary.hex,
      rgb: { r: primary.rgb.r, g: primary.rgb.g, b: primary.rgb.b }, // Already in 0-255 range from ColorSample
      tone: getToneDescription(primary.lab.L),
      percentage: primary.percentage,
    });
  }

  // Shadow areas
  if (shadows.length > 0) {
    const primary = shadows[0];
    results.push({
      region: 'Schattenbereiche',
      hex: primary.hex,
      rgb: { r: primary.rgb.r, g: primary.rgb.g, b: primary.rgb.b }, // Already in 0-255 range from ColorSample
      tone: getToneDescription(primary.lab.L),
      percentage: primary.percentage,
    });
  }

  return results;
}

/**
 * Analyze luminance and saturation
 */
export function analyzeLuminanceSaturation(
  luminance: number,
  saturation: number,
  colorPurity: number
): LuminanceSaturationAnalysis {
  return {
    luminance: {
      value: luminance,
      assessment: assessLuminance(luminance),
      remark: getLuminanceRemark(luminance),
    },
    saturation: {
      value: saturation,
      assessment: assessSaturation(saturation),
      remark: getSaturationRemark(saturation),
    },
    colorPurity: {
      value: colorPurity,
      assessment: assessColorPurity(colorPurity),
      remark: getColorPurityRemark(colorPurity),
    },
  };
}

/**
 * Analyze spectral characteristics (approximated visually)
 */
export function analyzeSpectralCharacteristic(
  primaryColor: ColorSample,
  secondaryColors: ColorSample[]
): SpectralCharacteristic {
  const { lab } = primaryColor;
  
  // Approximate absorption based on color
  const mainAbsorption = estimateMainAbsorption(lab);
  const secondaryAbsorption = estimateSecondaryAbsorption(secondaryColors);
  const transmission = estimateTransmission(lab);
  const weakTransmission = estimateWeakTransmission(lab);
  
  const interpretation = interpretSpectralCharacteristics(
    mainAbsorption,
    secondaryAbsorption,
    transmission
  );

  return {
    mainAbsorption,
    secondaryAbsorption,
    transmission,
    weakTransmission,
    interpretation,
  };
}

/**
 * Get GIA color grade
 */
export function getGIAColorGrade(
  primaryColor: ColorSample,
  saturation: number
): GIAColorGrade {
  const { lab, hex } = primaryColor;
  
  const hue = getGIAHue(lab.a, lab.b, hex);
  const tone = getGIATone(lab.L);
  const sat = getGIASaturation(saturation);
  const finalColorGrade = `${hue} ${tone} ${sat}`;
  
  const evaluation = evaluateGIAGrade(hue, tone, sat);

  return {
    hue,
    tone,
    saturation: sat,
    finalColorGrade,
    evaluation,
  };
}

/**
 * Get overall impression (async version with learning)
 */
export async function getOverallImpressionAsync(
  primaryColor: ColorSample,
  saturation: number,
  pleochroism: string,
  colorPurity: number,
  center?: ColorSample[],
  facets?: ColorSample[],
  shadows?: ColorSample[]
): Promise<OverallImpression> {
  const { lab, hex } = primaryColor;
  
  const dominantColorTone = getColorDescription(hex, lab);
  const satDescription = assessSaturation(saturation);
  const possibleColorCause = suggestColorCause(hex, lab);
  const possibleVariety = await suggestVarietyWithLearning(hex, lab, saturation);
  
  // Re-analyze pleochroism with variety information
  let finalPleochroism = pleochroism;
  if (center && facets && shadows) {
    finalPleochroism = analyzePleochroism(center, facets, shadows, possibleVariety);
  }
  
  // Ensure consistency: filter varieties to match pleochroism
  const pleochroismType = finalPleochroism.toLowerCase().includes('isotrop') && !finalPleochroism.toLowerCase().includes('anisotrop') 
    ? 'isotrop' 
    : 'anisotrop';
  
  // Filter varieties to match pleochroism type for consistency
  const filteredVarieties = filterVarietiesByPleochroism(possibleVariety, pleochroismType);
  
  // Use filtered varieties if they exist and match pleochroism
  // If filtered is empty but original has varieties, it means there's a mismatch
  // In this case, prefer the filtered (empty) to force user correction, OR keep original if analysis might be wrong
  // For now, we keep original if filtered is empty to avoid losing all suggestions
  const finalVarieties = filteredVarieties.length > 0 ? filteredVarieties : possibleVariety;
  
  const opticalQuality = assessOpticalQuality(colorPurity, saturation);
  const overallImpression = generateOverallImpression(
    dominantColorTone,
    satDescription,
    finalPleochroism,
    opticalQuality
  );
  
  const evaluation = generateFinalEvaluation(
    dominantColorTone,
    satDescription,
    finalPleochroism,
    finalVarieties,
    opticalQuality
  );

  return {
    dominantColorTone,
    saturation: satDescription,
    pleochroism: finalPleochroism,
    possibleColorCause,
    possibleVariety: finalVarieties, // Use filtered varieties for consistency
    opticalQuality,
    overallImpression,
    evaluation,
  };
}

/**
 * Get overall impression (sync version for backward compatibility)
 */
export function getOverallImpression(
  primaryColor: ColorSample,
  saturation: number,
  pleochroism: string,
  colorPurity: number
): OverallImpression {
  const { lab, hex } = primaryColor;
  
  const dominantColorTone = getColorDescription(hex, lab);
  const satDescription = assessSaturation(saturation);
  const possibleColorCause = suggestColorCause(hex, lab);
  const possibleVariety = suggestVariety(hex, lab, saturation);
  const opticalQuality = assessOpticalQuality(colorPurity, saturation);
  const overallImpression = generateOverallImpression(
    dominantColorTone,
    satDescription,
    pleochroism,
    opticalQuality
  );
  
  const evaluation = generateFinalEvaluation(
    dominantColorTone,
    satDescription,
    pleochroism,
    possibleVariety,
    opticalQuality
  );

  return {
    dominantColorTone,
    saturation: satDescription,
    pleochroism,
    possibleColorCause,
    possibleVariety,
    opticalQuality,
    overallImpression,
    evaluation,
  };
}

// Helper functions

function getToneDescription(L: number): string {
  if (L < 20) return 'Sehr dunkel (Very Dark)';
  if (L < 35) return 'Dunkel (Dark)';
  if (L < 50) return 'Mittel-Dunkel (Medium-Dark)';
  if (L < 65) return 'Mittel (Medium)';
  if (L < 80) return 'Mittel-Hell (Medium-Light)';
  if (L < 90) return 'Hell (Light)';
  return 'Sehr hell (Very Light)';
}

function getCIEHue(a: number, b: number): string {
  const angle = (Math.atan2(b, a) * 180) / Math.PI;
  const normalizedAngle = angle < 0 ? angle + 360 : angle;
  
  if (normalizedAngle < 15 || normalizedAngle >= 345) return 'Rot (R)';
  if (normalizedAngle < 45) return 'Gelb-Rot (YR)';
  if (normalizedAngle < 75) return 'Gelb (Y)';
  if (normalizedAngle < 105) return 'Gelb-Grün (GY)';
  if (normalizedAngle < 135) return 'Grün (G)';
  if (normalizedAngle < 165) return 'Blau-Grün (BG)';
  if (normalizedAngle < 195) return 'Blau (B)';
  if (normalizedAngle < 225) return 'Blau-Violett (PB)';
  if (normalizedAngle < 255) return 'Violett (P)';
  if (normalizedAngle < 285) return 'Rot-Violett (RP)';
  return 'Rot (R)';
}

function getColorDescription(hex: string, lab: { L: number; a: number; b: number }): string {
  const { a, b } = lab;
  
  // Determine dominant color
  if (Math.abs(a) < 5 && Math.abs(b) < 5) {
    return lab.L > 80 ? 'Farblos/Weiß' : 'Grau/Schwarz';
  }
  
  // Use angle-based classification for better accuracy, especially for blue/violet colors
  const angle = (Math.atan2(b, a) * 180) / Math.PI;
  const normalizedAngle = angle < 0 ? angle + 360 : angle;
  
  // Calculate chroma (saturation) to help distinguish colors
  const chroma = Math.sqrt(a * a + b * b);
  
  // Parse RGB from hex to help distinguish blue-violet from red-violet
  const hexClean = hex.replace('#', '');
  let r = 0, g = 0, bl = 0;
  if (hexClean.length === 6) {
    r = parseInt(hexClean.substring(0, 2), 16);
    g = parseInt(hexClean.substring(2, 4), 16);
    bl = parseInt(hexClean.substring(4, 6), 16);
  } else if (hexClean.length === 3) {
    // Handle 3-digit hex codes
    r = parseInt(hexClean[0] + hexClean[0], 16);
    g = parseInt(hexClean[1] + hexClean[1], 16);
    bl = parseInt(hexClean[2] + hexClean[2], 16);
  }
  
  // CRITICAL: Check for GREEN colors FIRST before blue/red to avoid misclassification
  // Green colors have negative a and positive b values, angle 105-135 degrees
  // ABSOLUTE RULE: If a < 0 && b > 0, it's ALWAYS green (cannot be blue or violet)
  
  // ABSOLUTE GREEN CHECK: If Lab values indicate green (a < 0, b > 0), it's ALWAYS green
  // This is the most reliable indicator - Lab values are definitive
  // Green has negative a and positive b - this cannot be blue or violet
  if (a < 0 && b > 0) {
    // Lab values definitively indicate green
    // Check RGB to confirm, but even if RGB is borderline, trust Lab values
    if (g > r && g > bl) {
      // Both Lab and RGB agree it's green - this is definitive
      // Check angle for more specific classification
      if (normalizedAngle >= 105 && normalizedAngle < 135) {
        return 'Grün';
      }
      if (normalizedAngle >= 75 && normalizedAngle < 105) {
        return 'Gelb-Grün';
      }
      if (normalizedAngle >= 135 && normalizedAngle < 165) {
        if (g > bl * 1.2) {
          return 'Gelb-Grün';
        }
        return 'Blau-Grün';
      }
      // Default to green if Lab says green
      return 'Grün';
    }
    // Even if RGB doesn't clearly show green dominance, if Lab says green strongly, trust it
    if (b > 3 || a < -3) {
      if (normalizedAngle >= 105 && normalizedAngle < 135) {
        return 'Grün';
      }
      return 'Grün';
    }
    // If green is at least equal to other colors in RGB, it's green
    if (g >= r || g >= bl) {
      return 'Grün';
    }
    // Final fallback: if Lab values say green (a < 0, b > 0), default to green
    // This prevents green from ever being misclassified as blue/violet
    // The key is: b > 0 means green, b < 0 means blue/violet
    return 'Grün';
  }
  
  // CRITICAL: Check for blue colors AFTER green to avoid misclassification
  // Blue colors have negative b values and are in the 165-195 degree range
  // But also check RGB to catch blue colors that might have unusual Lab values
  
  // SPECIAL CASE: Light blue colors (like light blue zircon)
  // Light blue has high L (> 70), negative b, and blue-dominant RGB
  if (lab.L > 70 && b < 0) {
    // For light blue, check if blue is the dominant RGB component
    // BUT: Make sure it's not green (green has positive b)
    if (bl > r && bl > g && b < 0) {
      // Even if the ratio isn't 1.5x, if blue is clearly the highest value, it's blue
      if (bl > r + 20 && bl > g + 20) {
        // Check angle to distinguish blue from violet
        if (normalizedAngle >= 150 && normalizedAngle < 240) {
          if (normalizedAngle < 210) {
            return 'Blau';
          } else {
            return 'Blau-Violett';
          }
        }
        // For very light blue, even if angle is off, trust RGB
        if (lab.L > 80 && bl > r && bl > g) {
          return 'Blau';
        }
      }
    }
  }
  
  if (b < 0) {
    // If blue RGB component is clearly dominant, it's likely blue/violet
    if (bl > r * 1.5 && bl > g * 1.5) {
      // Check angle to distinguish blue from violet
      if (normalizedAngle >= 165 && normalizedAngle < 225) {
        if (normalizedAngle < 195) {
          return 'Blau';
        } else {
          return 'Blau-Violett';
        }
      }
      // Even if angle is slightly off, if blue is dominant, classify as blue/violet
      if (normalizedAngle >= 150 && normalizedAngle < 240) {
        if (normalizedAngle < 210) {
          return 'Blau';
        } else {
          return 'Blau-Violett';
        }
      }
    }
    // For medium-light blue (L 50-70), be more lenient with RGB ratios
    if (lab.L > 50 && lab.L <= 70 && bl > r * 1.2 && bl > g * 1.2) {
      if (normalizedAngle >= 150 && normalizedAngle < 240) {
        return normalizedAngle < 210 ? 'Blau' : 'Blau-Violett';
      }
    }
  }
  
  // Red to Yellow-Red (0-45 degrees) - but only if NOT blue
  if (normalizedAngle < 15 || normalizedAngle >= 345) {
    // Double-check: if blue component is still dominant, it's not red
    // For light colors, be more lenient with the ratio
    if (lab.L > 70) {
      // Light colors: if blue is clearly the highest, it's blue
      if (bl > r && bl > g && bl > r + 15 && bl > g + 15 && b < 0) {
        return 'Blau';
      }
    } else {
      // Darker colors: use stricter ratio
      if (bl > r * 1.3 && bl > g * 1.3) {
        return 'Blau';
      }
    }
    return 'Rot';
  }
  if (normalizedAngle < 45) {
    // Check if it's actually blue (blue can sometimes have positive a if very saturated)
    // For light blue, be more lenient
    if (lab.L > 70 && bl > r && bl > g && b < 0) {
      // Light blue with blue-dominant RGB
      if (bl > r + 20 || bl > g + 20) {
        return 'Blau';
      }
    } else if (bl > r * 1.5 && bl > g * 1.5 && b < 0) {
      return 'Blau';
    }
    return chroma > 20 ? 'Gelb-Rot' : 'Rosa';
  }
  
  // Yellow (45-75 degrees)
  if (normalizedAngle < 75) {
    return 'Gelb';
  }
  
  // Yellow-Green (75-105 degrees)
  if (normalizedAngle < 105) {
    // Check RGB to distinguish yellow-green from other colors
    if (a < 0 && b > 0 && g > r && g > bl) {
      return 'Gelb-Grün';
    }
    return 'Gelb-Grün';
  }
  
  // Green (105-135 degrees) - CRITICAL: Must check RGB to avoid misclassification
  if (normalizedAngle < 135) {
    // Green should have: negative a, positive b, green-dominant RGB
    if (a < 0 && b > 0) {
      // Check RGB: green should be dominant
      if (g > r && g > bl) {
        // Green is clearly dominant
        if (g > r * 1.2 && g > bl * 1.2) {
          return 'Grün';
        }
        // Even if ratios are lower, if green is highest, it's green
        if (g > r + 10 && g > bl + 10) {
          return 'Grün';
        }
        // For saturated green, trust it
        if (chroma > 15 && g > r && g > bl) {
          return 'Grün';
        }
      }
      // Even if RGB check fails, if angle and Lab values indicate green, trust it
      if (normalizedAngle >= 105 && normalizedAngle < 135 && b > 5) {
        return 'Grün';
      }
    }
    return 'Grün';
  }
  
  // Blue-Green (135-165 degrees)
  if (normalizedAngle < 165) {
    // Check if it's more green or more blue
    if (a < 0 && b > 0 && g > bl && g > r) {
      return 'Gelb-Grün';
    }
    if (b < 0 && bl > g && bl > r) {
      return 'Blau-Grün';
    }
    return 'Blau-Grün';
  }
  
  // Blue (165-195 degrees) - critical range for blue gemstones
  // SHARPENED: Distinguish pure blue from blue-violet based on red content
  if (normalizedAngle < 195) {
    // Pure blue should have:
    // 1. Negative a and b (a < 0, b < 0) with |b| > |a|
    // 2. Blue-dominant RGB with minimal red (r < 100-120)
    // 3. Angle in pure blue range (165-195)
    
    if (b < 0) {
      // Pure blue: negative a and b, with b more negative
      if (a < 0 && Math.abs(b) > Math.abs(a)) {
        // Check RGB: pure blue should have blue >> red
        const blueRedRatio = bl / (r + 1);
        
        // Pure blue: blue should be significantly higher than red
        if (blueRedRatio > 2.0 && bl > g * 1.3) {
          return 'Blau';
        }
        // If blue is clearly dominant and red is low, it's pure blue
        if (bl > r * 1.5 && r < 100 && bl > g * 1.2) {
          return 'Blau';
        }
        // For angle 165-195 with negative a and b, check red content
        if (normalizedAngle >= 165 && normalizedAngle < 195) {
          if (bl > r * 1.3 && bl > g * 1.2 && r < 120) {
            return 'Blau';
          }
          // Even if ratios are lower, if red is minimal, it's pure blue
          if (r < 80 && bl > r && bl > g) {
            return 'Blau';
          }
        }
      }
      
      // SPECIAL: Light blue (like zircon) - high L, negative b, blue-dominant RGB
      if (lab.L > 70) {
        // For light blue, if blue is the highest RGB component and red is low
        if (bl > r && bl > g && r < 100) {
          // Even if the difference is small, if blue is clearly highest, trust it
          if (bl > r + 10 && bl > g + 10) {
            return 'Blau';
          }
          // For very light blue (L > 80), be even more lenient
          if (lab.L > 80 && bl >= r && bl >= g && r < 120) {
            return 'Blau';
          }
        }
      }
      
      // If blue RGB component is clearly dominant with low red, it's pure blue
      if (bl > r * 1.4 && bl > g * 1.2 && r < 120) {
        return 'Blau';
      }
      
      // Even if RGB is not perfectly dominant, if b is strongly negative and in blue range
      if (b < -5 && normalizedAngle >= 165 && normalizedAngle < 195) {
        // Check if red is low (pure blue has minimal red)
        if (r < 100 && bl > r && bl > g) {
          return 'Blau';
        }
      }
      
      // Very light blue might have less negative b
      if (b < -1 && bl > r && bl > g && r < 100) {
        return 'Blau';
      }
      
      // For medium-light blue, if blue is at least equal to red and green, it's blue
      if (lab.L > 60 && bl >= r && bl >= g && bl > Math.max(r, g) + 5 && r < 120) {
        return 'Blau';
      }
    }
    
    // If a is positive but b is negative and in blue range, check RGB more carefully
    if (a >= 0 && b < -3) {
      // If red is low and blue is dominant, it's still pure blue
      if (r < 100 && bl > r * 1.3 && bl > g * 1.2) {
        return 'Blau';
      }
      // For light colors, be more lenient
      if (lab.L > 70 && bl > r && bl > g && r < 120) {
        return 'Blau';
      }
      if (bl > r * 1.2 && bl > g * 1.2 && r < 120) {
        return 'Blau';
      }
      // Might be blue-violet if red is more significant
      if (r > 120 && bl > r && bl > g) {
        return 'Blau-Violett';
      }
    }
    
    // Default to blue for this angle range if b is negative and red is low
    if (b < 0) {
      // Final check: if it's in blue angle range and b is negative, trust it's blue
      // unless RGB clearly shows otherwise (high red = blue-violet)
      if (normalizedAngle >= 165 && normalizedAngle < 195) {
        if (r < 120 && bl > r && bl > g) {
          return 'Blau';
        }
        // If red is higher, it might be blue-violet
        if (r > 120 && bl > r) {
          return 'Blau-Violett';
        }
      }
      if (lab.L > 70 && bl >= r && bl >= g && r < 120) {
        return 'Blau';
      }
      // For darker blues, require stronger evidence
      if (lab.L <= 70 && (bl > r || bl > g) && r < 120) {
        return 'Blau';
      }
    }
    return 'Blau-Violett';
  }
  
  // Blue-Violet to Violet (195-255 degrees) - critical range for violet gemstones
  if (normalizedAngle < 225) {
    // Blue-Violet: a is slightly positive or near zero, b is negative
    if (a < 5 && b < -5) {
      // Check RGB: blue-violet should have more blue than red
      if (bl > r * 1.1 && bl > g) {
        return 'Blau-Violett';
      }
      // If blue and red are similar, it's violet
      if (Math.abs(bl - r) < 30 && bl > g) {
        return 'Violett';
      }
      return 'Blau-Violett';
    }
    return 'Blau-Violett';
  }
  
  if (normalizedAngle < 255) {
    // Violet: a is positive, b is negative
    // Check RGB to distinguish from red-violet - violet should have balanced blue and red
    const blueRedRatio = bl / (r + 1); // Avoid division by zero
    const blueGreenRatio = bl / (g + 1);
    
    // True violet: blue should be significant, and not much less than red
    if (bl > 50 && blueRedRatio > 0.7 && blueRedRatio < 1.5 && blueGreenRatio > 1.1) {
      return 'Violett';
    }
    // If blue is clearly dominant over red, it's violet
    if (bl > r * 1.2 && bl > g * 1.2) {
      return 'Violett';
    }
    // If red is clearly dominant, it's red-violet
    if (r > bl * 1.3 && r > g) {
      return 'Rot-Violett';
    }
    // Default to violet for this range
    return 'Violett';
  }
  
  // Red-Violet to Red (255-345 degrees)
  if (normalizedAngle < 285) {
    // CRITICAL: If b > 0, this is green, NOT red-violet
    if (b > 0 && a < 0) {
      // Lab values indicate green (a < 0, b > 0) - this is NOT red-violet
      if (g > r || g > bl) {
        return 'Grün';
      }
      return 'Grün';
    }
    
    // CRITICAL: Before classifying as red-violet, check if it's actually light blue
    // Light blue can sometimes have unusual angle values but should have blue-dominant RGB
    if (lab.L > 70 && b < 0 && bl > r && bl > g) {
      // Light blue with blue-dominant RGB - trust RGB over angle
      if (bl > r + 15 && bl > g + 15) {
        return 'Blau';
      }
      // Even if difference is smaller, if blue is clearly highest, it's blue
      if (bl >= r && bl >= g && bl > Math.max(r, g) + 5) {
        return 'Blau';
      }
    }
    
    // Red-Violet: a is positive, b is negative, but red component is strong
    // BUT: Only if b < 0 (blue/violet have negative b, green has positive b)
    if (a > 5 && b < -5) {
      // Check RGB: red-violet should have more red than blue
      if (r > bl * 1.2 && r > g) {
        return 'Rot-Violett';
      }
      // If blue is still dominant or similar, it's violet (not red-violet)
      if (bl >= r * 0.9 && bl > g) {
        return 'Violett';
      }
      // If red is slightly more than blue, it's red-violet
      if (r > bl && r > g) {
        return 'Rot-Violett';
      }
      return 'Violett';
    }
    // For this angle range, if a is not strongly positive, check RGB
    if (a < 8) {
      // If blue is still significant, it's violet
      if (bl > 50 && bl >= r * 0.8) {
        return 'Violett';
      }
      // For light colors, if blue is highest, it's blue/violet
      if (lab.L > 70 && bl > r && bl > g && b < 0) {
        return 'Blau';
      }
    }
    return 'Rot-Violett';
  }
  
  // Pink/Red (285-345 degrees)
  if (normalizedAngle < 345) {
    // Final safety check: if blue is still dominant in RGB, it's not red/pink
    if (bl > r * 1.3 && bl > g * 1.3 && b < 0) {
      // Could be blue-violet or violet
      if (normalizedAngle >= 255 && normalizedAngle < 285) {
        return 'Violett';
      }
      return 'Blau-Violett';
    }
    return chroma > 25 ? 'Rot' : 'Rosa';
  }
  
  // Final fallback: check RGB values if angle-based classification failed
  // This ensures blue colors are never misclassified as red
  if (b < 0) {
    // For light blue (L > 70), be more lenient
    if (lab.L > 70 && bl > r && bl > g) {
      // Light blue with blue-dominant RGB
      if (bl > r + 10 && bl > g + 10) {
        return 'Blau';
      }
      // Very light blue - trust RGB if blue is at least equal
      if (lab.L > 80 && bl >= r && bl >= g) {
        return 'Blau';
      }
    }
    // For darker blues, use stricter ratio
    if (bl > r * 1.5 && bl > g * 1.5) {
      if (normalizedAngle >= 165 && normalizedAngle < 225) {
        return normalizedAngle < 195 ? 'Blau' : 'Blau-Violett';
      }
      return 'Blau';
    }
  }
  
  return 'Unbekannt';
}

function suggestOrigin(hex: string, lab: { L: number; a: number; b: number }): string[] {
  const suggestions: string[] = [];
  const { a, b } = lab;
  
  // Use angle-based classification for better accuracy
  const angle = (Math.atan2(b, a) * 180) / Math.PI;
  const normalizedAngle = angle < 0 ? angle + 360 : angle;
  
  // Red/Pink
  if (normalizedAngle < 15 || normalizedAngle >= 345 || (normalizedAngle >= 285 && normalizedAngle < 345)) {
    if (a > 10 && Math.abs(b) < 15) {
      suggestions.push('Myanmar (Burma)', 'Mozambique', 'Tansania');
    }
  }
  
  // Blue (165-195 degrees) - improved detection
  if (normalizedAngle >= 165 && normalizedAngle < 195) {
    // Ensure it's actually blue (negative a and b, with b more negative)
    if (a < 0 && b < 0 && Math.abs(b) > Math.abs(a)) {
      suggestions.push('Sri Lanka', 'Myanmar (Burma)', 'Kashmir');
    }
  }
  // Also check for blue with traditional criteria
  if (a < -5 && b < -5 && Math.abs(b) > Math.abs(a)) {
    suggestions.push('Sri Lanka', 'Myanmar (Burma)', 'Kashmir');
  }
  
  // Blue-Violet (195-225 degrees)
  if (normalizedAngle >= 195 && normalizedAngle < 225) {
    suggestions.push('Sri Lanka', 'Tansania', 'Myanmar (Burma)');
  }
  
  // Green
  if (normalizedAngle >= 105 && normalizedAngle < 135) {
    if (a < 0 && b > 5) {
      suggestions.push('Kolumbien', 'Sambia', 'Brasilien');
    }
  }
  
  // Yellow/Orange
  if (normalizedAngle >= 45 && normalizedAngle < 75) {
    if (a > 5 && b > 10) {
      suggestions.push('Sri Lanka', 'Madagaskar', 'Tansania');
    }
  }
  
  // Purple/Violet (225-285 degrees) - improved detection
  if (normalizedAngle >= 225 && normalizedAngle < 285) {
    // Check if it's more violet than red-violet
    const chroma = Math.sqrt(a * a + b * b);
    if (chroma > 15) {
      suggestions.push('Sri Lanka', 'Tansania', 'Myanmar (Burma)');
    }
  }
  
  return suggestions.length > 0 ? suggestions : ['Unbekannt - weitere Analyse erforderlich'];
}

function assessLuminance(L: number): string {
  if (L < 30) return 'Sehr niedrig';
  if (L < 50) return 'Niedrig';
  if (L < 70) return 'Mittel';
  if (L < 85) return 'Hoch';
  return 'Sehr hoch';
}

function getLuminanceRemark(L: number): string {
  if (L < 30) return 'Dunkler Stein, möglicherweise undurchsichtig oder sehr tiefe Farbe';
  if (L < 50) return 'Mittlere Helligkeit, typisch für gesättigte Farben';
  if (L < 70) return 'Gute Helligkeit, ausgewogene Farbtiefe';
  if (L < 85) return 'Helle Erscheinung, möglicherweise heller Farbton';
  return 'Sehr hell, möglicherweise pastellfarben oder heller Farbton';
}

function assessSaturation(sat: number): string {
  if (sat < 10) return 'Sehr blass';
  if (sat < 20) return 'Blass';
  if (sat < 35) return 'Mittel';
  if (sat < 50) return 'Intensiv';
  return 'Sehr intensiv';
}

function getSaturationRemark(sat: number): string {
  if (sat < 10) return 'Sehr geringe Farbsättigung, möglicherweise fast farblos';
  if (sat < 20) return 'Niedrige Sättigung, pastellfarben';
  if (sat < 35) return 'Moderate Sättigung, ausgewogene Farbe';
  if (sat < 50) return 'Hohe Sättigung, intensive Farbe';
  return 'Sehr hohe Sättigung, sehr intensive und lebendige Farbe';
}

function assessColorPurity(purity: number): string {
  if (purity < 40) return 'Niedrig';
  if (purity < 60) return 'Mittel';
  if (purity < 80) return 'Hoch';
  return 'Sehr hoch';
}

function getColorPurityRemark(purity: number): string {
  if (purity < 40) return 'Viele verschiedene Farbtöne im Stein, möglicherweise mehrfarbig';
  if (purity < 60) return 'Moderate Farbuniformität';
  if (purity < 80) return 'Gute Farbuniformität, dominanter Farbton';
  return 'Sehr einheitliche Farbe, sehr reiner Farbton';
}

function estimateMainAbsorption(lab: { a: number; b: number }): string {
  const { a, b } = lab;
  
  if (a > 10) return 'Rot-Bereich (600-700nm)';
  if (a < -10) return 'Blau-Bereich (400-500nm)';
  if (b > 10) return 'Gelb-Bereich (550-600nm)';
  if (b < -10) return 'Blau-Grün-Bereich (480-520nm)';
  
  return 'Keine dominante Absorption erkennbar';
}

function estimateSecondaryAbsorption(secondaryColors: ColorSample[]): string {
  if (secondaryColors.length === 0) return 'Keine sekundäre Absorption';
  
  const avgA = secondaryColors.reduce((sum, c) => sum + c.lab.a, 0) / secondaryColors.length;
  const avgB = secondaryColors.reduce((sum, c) => sum + c.lab.b, 0) / secondaryColors.length;
  
  if (Math.abs(avgA) > Math.abs(avgB)) {
    return avgA > 0 ? 'Rot-Orange-Bereich' : 'Blau-Violett-Bereich';
  } else {
    return avgB > 0 ? 'Gelb-Grün-Bereich' : 'Blau-Bereich';
  }
}

function estimateTransmission(lab: { L: number }): string {
  if (lab.L < 30) return 'Sehr gering';
  if (lab.L < 50) return 'Gering';
  if (lab.L < 70) return 'Mittel';
  if (lab.L < 85) return 'Hoch';
  return 'Sehr hoch';
}

function estimateWeakTransmission(lab: { L: number }): string {
  if (lab.L < 40) return 'Starke Absorption, wenig Transmission';
  if (lab.L < 60) return 'Moderate Transmission';
  return 'Gute Transmission';
}

function interpretSpectralCharacteristics(
  main: string,
  secondary: string,
  transmission: string
): string {
  let interpretation = '';
  
  if (main.includes('Rot')) {
    interpretation += 'Hauptabsorption im roten Bereich deutet auf Chrom- oder Eisen-Verunreinigungen hin. ';
  }
  if (main.includes('Blau')) {
    interpretation += 'Hauptabsorption im blauen Bereich typisch für bestimmte Übergangsmetalle. ';
  }
  if (transmission.includes('Hoch')) {
    interpretation += 'Hohe Transmission deutet auf gute Transparenz hin. ';
  } else {
    interpretation += 'Geringe Transmission kann auf Einschlüsse oder starke Farbsättigung hindeuten. ';
  }
  
  return interpretation || 'Weitere spektroskopische Analyse empfohlen.';
}

function getGIAHue(a: number, b: number, hex: string): string {
  const angle = (Math.atan2(b, a) * 180) / Math.PI;
  const normalizedAngle = angle < 0 ? angle + 360 : angle;
  
  // Parse RGB from hex to help distinguish blue/violet from red-violet
  const hexClean = hex.replace('#', '');
  let r = 0, g = 0, bl = 0;
  if (hexClean.length === 6) {
    r = parseInt(hexClean.substring(0, 2), 16);
    g = parseInt(hexClean.substring(2, 4), 16);
    bl = parseInt(hexClean.substring(4, 6), 16);
  } else if (hexClean.length === 3) {
    r = parseInt(hexClean[0] + hexClean[0], 16);
    g = parseInt(hexClean[1] + hexClean[1], 16);
    bl = parseInt(hexClean[2] + hexClean[2], 16);
  }
  
  // CRITICAL: Check for GREEN colors FIRST before blue to avoid misclassification
  // Green colors have negative a and positive b values, angle 105-135 degrees
  // MUST check this BEFORE any blue checks to prevent green from being misclassified as blue/violet
  
  // ABSOLUTE GREEN CHECK: If Lab values indicate green (a < 0, b > 0), it's ALWAYS green
  // This is the most reliable indicator - Lab values are definitive
  // Green has negative a and positive b - this cannot be blue or violet
  if (a < 0 && b > 0) {
    // Lab values definitively indicate green
    // Check RGB to confirm, but even if RGB is borderline, trust Lab values
    if (g > r && g > bl) {
      // Both Lab and RGB agree it's green - this is definitive
      return 'G (Green)';
    }
    // Even if RGB doesn't clearly show green dominance, if Lab says green strongly, trust it
    if (b > 3 || a < -3) {
      return 'G (Green)';
    }
    // If green is at least equal to other colors in RGB, it's green
    if (g >= r || g >= bl) {
      return 'G (Green)';
    }
    // Final fallback: if Lab values say green (a < 0, b > 0), default to green
    // This prevents green from ever being misclassified as blue/violet
    // The key is: b > 0 means green, b < 0 means blue/violet
    return 'G (Green)';
  }
  
  // Primary green check: Lab values indicate green (a < 0, b > 0)
  if (a < 0 && b > 0) {
    // Check RGB: green should be the dominant component
    if (g > r && g > bl) {
      // Green range: 105-135 degrees - PRIMARY GREEN
      if (normalizedAngle >= 105 && normalizedAngle < 135) {
        // Green is clearly dominant in RGB
        if (g > r * 1.1 && g > bl * 1.1) {
          return 'G (Green)';
        }
        // Even if ratios are lower, if green is highest, it's green
        if (g > r + 10 && g > bl + 10) {
          return 'G (Green)';
        }
        // For any green-dominant RGB with proper Lab values, it's green
        if (g > r && g > bl) {
          return 'G (Green)';
        }
      }
      
      // Yellow-Green range: 75-105 degrees
      if (normalizedAngle >= 75 && normalizedAngle < 105) {
        if (g > r * 1.1 && g > bl * 1.1) {
          return 'G (Green)';
        }
        if (g > r && g > bl) {
          return 'G (Green)';
        }
      }
      
      // Blue-Green range: 135-165 degrees - check if it's more green
      if (normalizedAngle >= 135 && normalizedAngle < 165) {
        if (g > bl && g > r) {
          return 'G (Green)';
        }
      }
      
      // Extended green range: 90-150 degrees if green is clearly dominant
      if (normalizedAngle >= 90 && normalizedAngle < 150) {
        if (g > r * 1.2 && g > bl * 1.2) {
          return 'G (Green)';
        }
      }
      
      // ANY angle: if green is dominant in RGB and Lab says green, trust it
      if (g > r * 1.2 && g > bl * 1.2) {
        return 'G (Green)';
      }
    }
    
    // Even if RGB check is borderline, if Lab values strongly indicate green, trust it
    if (normalizedAngle >= 105 && normalizedAngle < 135 && b > 3) {
      // Strong green Lab values (a < 0, b > 0) in green angle range
      if (a < -3 || b > 5) {
        return 'G (Green)';
      }
      // If green is at least equal to other colors in RGB, it's green
      if (g >= r && g >= bl) {
        return 'G (Green)';
      }
    }
    
    // Final fallback: if Lab values say green (a < 0, b > 0) and we're in a reasonable range
    // AND green is at least one of the dominant RGB components, it's green
    if (normalizedAngle >= 75 && normalizedAngle < 165 && b > 2) {
      if (g >= r || g >= bl) {
        return 'G (Green)';
      }
    }
  }
  
  // CRITICAL: Check for blue colors AFTER green to avoid misclassification
  // Blue colors have negative b values
  // ABSOLUTE RULE: If b > 0, it CANNOT be blue - it must be green or yellow-green
  // This check prevents any green color from being misclassified as blue
  
  // SPECIAL CASE: Light blue colors (like light blue zircon)
  // Need to get L value from hex or use a different approach
  // For now, check RGB dominance first for light colors
  // BUT: Make sure it's not green (green has positive b)
  // CRITICAL: Only check for blue if b < 0 (green has b > 0)
  if (b < 0) {
    const isLightBlue = bl > r && bl > g;
    if (isLightBlue && bl > r + 15 && bl > g + 15) {
      // Light blue with clear blue dominance
      if (normalizedAngle >= 150 && normalizedAngle < 240) {
        return normalizedAngle < 210 ? 'B (Blue)' : 'vB (Violetish Blue)';
      }
      // Even if angle is off, trust RGB for light blue
      if (bl > r + 30 && bl > g + 30) {
        return 'B (Blue)';
      }
    }
  }
  
  // CRITICAL: Before checking for blue, make ABSOLUTELY SURE it's not green
  // Green has positive b, blue has negative b - this is the key distinction
  // If b > 0, it CANNOT be blue, it must be green or yellow-green
  // This is already checked above, but double-check here as well
  
  if (b < 0) {
    // SHARPENED: Distinguish pure blue from violetish blue based on red content
    // Pure blue (B): blue >> red, minimal red component
    // Violetish blue (vB): blue > red, but red is more significant
    
    // CRITICAL: Double-check it's not green (green has positive b, so this check is safe)
    // But also check RGB to be absolutely sure
    if (g > r && g > bl && g > bl * 1.3) {
      // If green is clearly dominant in RGB, it might be a measurement error
      // But since b < 0, it's likely blue-green or blue, not pure green
      // Only proceed if blue is also significant
      if (bl < g * 0.8) {
        // Green is much more dominant - this shouldn't happen with b < 0, but be safe
        // Actually, if b < 0, it can't be green, so this is fine
      }
    }
    
    // Check if it's pure blue (minimal red)
    if (normalizedAngle >= 165 && normalizedAngle < 195) {
      // Pure blue range: check red content
      if (r < 100 && bl > r * 1.5 && bl > g * 1.3) {
        return 'B (Blue)';
      }
      // Even if red is slightly higher, if blue is clearly dominant
      if (r < 120 && bl > r * 1.4 && bl > g * 1.2) {
        return 'B (Blue)';
      }
    }
    
    // If blue RGB component is clearly dominant with low red, it's pure blue
    if (bl > r * 1.5 && bl > g * 1.3 && r < 100) {
      if (normalizedAngle >= 165 && normalizedAngle < 195) {
        return 'B (Blue)';
      }
      if (normalizedAngle >= 195 && normalizedAngle < 225) {
        return 'vB (Violetish Blue)';
      }
      if (normalizedAngle >= 225 && normalizedAngle < 255) {
        return 'P (Purple)';
      }
    }
    
    // If blue is dominant but red is more significant, it's violetish blue
    if (bl > r * 1.3 && bl > g * 1.3) {
      if (normalizedAngle >= 165 && normalizedAngle < 195) {
        // In pure blue range, check red content
        if (r < 100) {
          return 'B (Blue)';
        } else if (r < 150) {
          // Moderate red - could be either, but prefer pure blue if angle is good
          return 'B (Blue)';
        } else {
          return 'vB (Violetish Blue)';
        }
      }
      if (normalizedAngle >= 195 && normalizedAngle < 225) {
        return 'vB (Violetish Blue)';
      }
      if (normalizedAngle >= 225 && normalizedAngle < 255) {
        return 'P (Purple)';
      }
      // Even if angle is slightly off, if blue is dominant, classify as blue/violet
      if (normalizedAngle >= 150 && normalizedAngle < 240) {
        if (normalizedAngle < 195 && r < 100) {
          return 'B (Blue)';
        } else if (normalizedAngle < 210) {
          return normalizedAngle < 195 ? 'B (Blue)' : 'vB (Violetish Blue)';
        } else {
          return 'vB (Violetish Blue)';
        }
      }
    }
    
    // For light blue, be more lenient with ratios but still check red
    if (bl > r && bl > g && bl > r + 10 && bl > g + 10) {
      if (normalizedAngle >= 150 && normalizedAngle < 240) {
        // Check red content to distinguish pure blue from violetish
        if (normalizedAngle < 195 && r < 100) {
          return 'B (Blue)';
        }
        return normalizedAngle < 210 ? 'B (Blue)' : 'vB (Violetish Blue)';
      }
    }
  }
  
  // Red (0-45 degrees) - but check if it's actually blue first
  if (normalizedAngle < 15 || normalizedAngle >= 345) {
    if (bl > r * 1.3 && bl > g * 1.3 && b < 0) {
      return 'B (Blue)';
    }
    return 'R (Red)';
  }
  if (normalizedAngle < 45) {
    if (bl > r * 1.3 && bl > g * 1.3 && b < 0) {
      return 'vB (Violetish Blue)';
    }
    return 'pkR (Pinkish Red)';
  }
  
  // Yellow (45-75 degrees)
  if (normalizedAngle < 75) {
    return 'Y (Yellow)';
  }
  
  // Green (75-135 degrees) - CRITICAL: Must check RGB and Lab values
  // This is a fallback check - should have been caught earlier, but ensure it's green
  if (normalizedAngle < 135) {
    // Green should have: negative a, positive b, green-dominant RGB
    if (a < 0 && b > 0) {
      // Check RGB: green should be dominant
      if (g > r && g > bl) {
        // Green is clearly dominant
        if (g > r * 1.1 && g > bl * 1.1) {
          return 'G (Green)';
        }
        // Even if ratios are lower, if green is highest, it's green
        if (g > r + 5 && g > bl + 5) {
          return 'G (Green)';
        }
        // For any green-dominant RGB with proper Lab values, it's green
        if (g > r && g > bl) {
          return 'G (Green)';
        }
      }
      // Even if RGB check fails, if angle and Lab values indicate green, trust it
      if (normalizedAngle >= 105 && normalizedAngle < 135 && b > 3) {
        return 'G (Green)';
      }
      // For any angle in green range with proper Lab values, default to green
      if (normalizedAngle >= 90 && normalizedAngle < 150 && b > 0) {
        return 'G (Green)';
      }
    }
    // For angle 75-105, check if it's yellow-green
    if (normalizedAngle >= 75 && normalizedAngle < 105) {
      if (a < 0 && b > 0 && g > r && g > bl) {
        return 'G (Green)';
      }
    }
    // Default: if in green angle range and not clearly something else, it's green
    // BUT: Only if Lab values support it (a < 0, b > 0)
    if (a < 0 && b > 0) {
      return 'G (Green)';
    }
    // If Lab values don't support green, don't default to green here
  }
  
  // Blue (135-195 degrees) - critical range for blue gemstones
  // SHARPENED: Distinguish pure blue from violetish blue
  // CRITICAL: If b > 0, it CANNOT be blue - it must be green (already checked above)
  if (normalizedAngle < 195) {
    // ABSOLUTE CHECK: If b > 0, this is green, not blue - return immediately
    if (b > 0 && a < 0) {
      // Lab values indicate green (a < 0, b > 0) - this is NOT blue
      if (g > r || g > bl) {
        return 'G (Green)';
      }
      return 'G (Green)';
    }
    
    // Pure blue should have:
    // 1. Negative a and b (a < 0, b < 0)
    // 2. |b| > |a| (more blue than green)
    // 3. Blue-dominant RGB with minimal red
    // 4. Angle in pure blue range (165-195)
    
    if (b < 0) {
      // Pure blue: negative a and b, with b more negative
      if (a < 0 && Math.abs(b) > Math.abs(a)) {
        // Check RGB: pure blue should have blue >> red
        const blueRedRatio = bl / (r + 1);
        const blueGreenRatio = bl / (g + 1);
        
        // Pure blue: blue should be significantly higher than red
        if (blueRedRatio > 2.0 && blueGreenRatio > 1.3) {
          return 'B (Blue)';
        }
        // If blue is clearly dominant and red is low, it's pure blue
        if (bl > r * 1.5 && r < 100 && bl > g * 1.2) {
          return 'B (Blue)';
        }
        // For angle 165-195 with negative a and b, default to pure blue
        if (normalizedAngle >= 165 && normalizedAngle < 195) {
          if (bl > r * 1.3 && bl > g * 1.2) {
            return 'B (Blue)';
          }
          // Even if ratios are lower, if red is minimal, it's pure blue
          if (r < 80 && bl > r && bl > g) {
            return 'B (Blue)';
          }
        }
      }
      
      // If blue RGB component is clearly dominant with low red, it's pure blue
      if (bl > r * 1.4 && bl > g * 1.2 && r < 120) {
        return 'B (Blue)';
      }
      
      // Even if RGB is not perfectly dominant, if b is strongly negative and in blue range
      if (b < -5 && normalizedAngle >= 165 && normalizedAngle < 195) {
        // Check if red is low (pure blue has minimal red)
        if (r < 100 && bl > r && bl > g) {
          return 'B (Blue)';
        }
      }
      
      // Very light blue might have less negative b
      if (b < -1 && bl > r && bl > g && r < 100) {
        return 'B (Blue)';
      }
    }
    
    // If a is positive but b is negative and in blue range, check RGB more carefully
    if (a >= 0 && b < -3) {
      // If red is low and blue is dominant, it's still pure blue
      if (r < 100 && bl > r * 1.3 && bl > g * 1.2) {
        return 'B (Blue)';
      }
      // If red is significant, it might be violetish blue
      if (r > 100 && bl > r && bl > g) {
        return 'vB (Violetish Blue)';
      }
      if (bl > r * 1.2 && bl > g * 1.2) {
        return 'B (Blue)';
      }
    }
    
    // Default to blue for this angle range if b is negative and red is low
    if (b < 0) {
      if (normalizedAngle >= 165 && normalizedAngle < 195 && r < 120) {
        return 'B (Blue)';
      }
      // If red is higher, it might be violetish
      if (r > 120 && bl > r) {
        return 'vB (Violetish Blue)';
      }
      return 'B (Blue)';
    }
    return 'vB (Violetish Blue)';
  }
  
  // Blue-Violet to Violet (195-255 degrees) - critical range for violet gemstones
  // CRITICAL: If b > 0, this is green, NOT blue-violet
  if (normalizedAngle < 225) {
    // ABSOLUTE CHECK: If b > 0, this is green, not blue-violet
    if (b > 0 && a < 0) {
      // Lab values indicate green (a < 0, b > 0) - this is NOT blue-violet
      if (g > r || g > bl) {
        return 'G (Green)';
      }
      return 'G (Green)';
    }
    
    // Blue-Violet: has some red component, but blue still dominant
    // Check RGB: blue-violet should have more blue than red, but red is present
    // BUT: Only if b < 0 (blue has negative b)
    if (b < 0) {
      const blueRedRatio = bl / (r + 1);
      
      // If blue is still clearly dominant (ratio > 1.5), it's violetish blue
      if (blueRedRatio > 1.5 && bl > g) {
        return 'vB (Violetish Blue)';
      }
      // If blue and red are more balanced (1.1-1.5), it's violetish blue
      if (blueRedRatio > 1.1 && blueRedRatio <= 1.5 && bl > g) {
        return 'vB (Violetish Blue)';
      }
      // If blue and red are similar, it's purple
      if (Math.abs(bl - r) < 30 && bl > g) {
        return 'P (Purple)';
      }
      // Default for this range (only if b < 0)
      return 'vB (Violetish Blue)';
    }
    // If b > 0, it's green, not blue-violet
    return 'G (Green)';
  }
  
  if (normalizedAngle < 255) {
    // Violet/Purple: check RGB to distinguish from red-violet
    const blueRedRatio = bl / (r + 1);
    const blueGreenRatio = bl / (g + 1);
    
    // True purple: blue should be significant, and not much less than red
    if (bl > 50 && blueRedRatio > 0.7 && blueRedRatio < 1.5 && blueGreenRatio > 1.1) {
      return 'P (Purple)';
    }
    // If blue is clearly dominant over red, it's purple
    if (bl > r * 1.2 && bl > g * 1.2) {
      return 'P (Purple)';
    }
    // If red is clearly dominant, it's red-violet
    if (r > bl * 1.3 && r > g) {
      return 'RP (Reddish Purple)';
    }
    // Default to purple for this range
    return 'P (Purple)';
  }
  
  // Red-Violet to Red (255-345 degrees)
  // CRITICAL: If b > 0, this is green, NOT red-violet
  if (normalizedAngle < 285) {
    // ABSOLUTE CHECK: If b > 0, this is green, not red-violet
    if (b > 0 && a < 0) {
      // Lab values indicate green (a < 0, b > 0) - this is NOT red-violet
      // Always return green if Lab values indicate green
      return 'G (Green)';
    }
    
    // Red-Violet: a is positive, b is negative, but red component should be strong
    // BUT: Only if b < 0 (blue/violet have negative b, green has positive b)
    if (a > 5 && b < -5) {
      // Check RGB: red-violet should have more red than blue
      if (r > bl * 1.2 && r > g) {
        return 'RP (Reddish Purple)';
      }
      // If blue is still dominant or similar, it's purple (not red-violet)
      if (bl >= r * 0.9 && bl > g) {
        return 'P (Purple)';
      }
      // If red is slightly more than blue, it's red-violet
      if (r > bl && r > g) {
        return 'RP (Reddish Purple)';
      }
      return 'P (Purple)';
    }
    // For this angle range, if a is not strongly positive, check RGB
    if (a < 8) {
      // If blue is still significant, it's purple
      if (bl > 50 && bl >= r * 0.8) {
        return 'P (Purple)';
      }
    }
    // Final check: if blue is dominant, it's purple, not red-violet
    if (bl > r * 1.1 && bl > g) {
      return 'P (Purple)';
    }
    return 'RP (Reddish Purple)';
  }
  
  // Pink/Red (285-345 degrees)
  if (normalizedAngle < 345) {
    // Final safety check: if blue is still dominant in RGB, it's not red/pink
    if (bl > r * 1.3 && bl > g * 1.3 && b < 0) {
      // Could be purple or violetish blue
      if (normalizedAngle >= 255 && normalizedAngle < 285) {
        return 'P (Purple)';
      }
      return 'vB (Violetish Blue)';
    }
    return 'R (Red)';
  }
  
  // Final fallback: check RGB values if angle-based classification failed
  // CRITICAL: Check for GREEN first (b > 0 means green, NOT blue)
  // This is the absolute last check to prevent green from being misclassified
  if (a < 0 && b > 0) {
    // Lab values definitively indicate green (a < 0, b > 0)
    // Check RGB to confirm
    if (g > r && g > bl) {
      return 'G (Green)';
    }
    // Even if RGB is borderline, if Lab strongly indicates green, trust it
    if (b > 3 || a < -3) {
      return 'G (Green)';
    }
    // If green is at least equal to other colors, it's green
    if (g >= r && g >= bl) {
      return 'G (Green)';
    }
    // Final fallback: if Lab says green (a < 0, b > 0), default to green
    // This prevents green from ever being classified as blue/violet
    return 'G (Green)';
  }
  
  // Then check for blue (b < 0)
  if (bl > r * 1.5 && bl > g * 1.5 && b < 0) {
    if (normalizedAngle >= 165 && normalizedAngle < 225) {
      return normalizedAngle < 195 ? 'B (Blue)' : 'vB (Violetish Blue)';
    }
    return 'B (Blue)';
  }
  
  return 'R (Red)';
}

function getGIATone(L: number): string {
  if (L < 20) return '1 (Very Dark)';
  if (L < 35) return '2 (Dark)';
  if (L < 50) return '3 (Medium-Dark)';
  if (L < 65) return '4 (Medium)';
  if (L < 80) return '5 (Medium-Light)';
  if (L < 90) return '6 (Light)';
  return '7 (Very Light)';
}

function getGIASaturation(sat: number): string {
  if (sat < 10) return '1 (Very Weak)';
  if (sat < 20) return '2 (Weak)';
  if (sat < 30) return '3 (Moderate)';
  if (sat < 40) return '4 (Strong)';
  if (sat < 50) return '5 (Vivid)';
  return '6 (Very Vivid)';
}

function evaluateGIAGrade(hue: string, tone: string, sat: string): string {
  const toneNum = parseInt(tone.split(' ')[0]);
  const satNum = parseInt(sat.split(' ')[0]);
  
  if (toneNum >= 4 && toneNum <= 6 && satNum >= 4) {
    return 'Ausgezeichnete Farbqualität';
  }
  if (toneNum >= 3 && toneNum <= 6 && satNum >= 3) {
    return 'Gute Farbqualität';
  }
  return 'Moderate Farbqualität - weitere Bewertung empfohlen';
}

function suggestColorCause(hex: string, lab: { a: number; b: number }): string[] {
  const causes: string[] = [];
  const { a, b } = lab;
  
  if (a > 10) {
    causes.push('Chrom (Cr³⁺)', 'Eisen (Fe²⁺/Fe³⁺)');
  }
  if (a < -10) {
    causes.push('Eisen (Fe²⁺)', 'Titan (Ti⁴⁺)');
  }
  if (b > 10) {
    causes.push('Eisen (Fe³⁺)', 'Vanadium (V³⁺)');
  }
  
  return causes.length > 0 ? causes : ['Weitere spektroskopische Analyse erforderlich'];
}

async function suggestVarietyWithLearning(
  hex: string,
  lab: { a: number; b: number; L: number },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _saturation: number
): Promise<string[]> {
  const varieties: string[] = [];
  const { a, b } = lab;
  
  // Use angle-based classification for better accuracy
  const angle = (Math.atan2(b, a) * 180) / Math.PI;
  const normalizedAngle = angle < 0 ? angle + 360 : angle;
  
  // Red/Pink
  if (normalizedAngle < 15 || normalizedAngle >= 345 || (normalizedAngle >= 285 && normalizedAngle < 345)) {
    if (a > 10 && Math.abs(b) < 15) {
      varieties.push('Rubin', 'Roter Spinell', 'Roter Turmalin');
    }
  }
  
  // Blue (165-195 degrees) - improved detection
  if (normalizedAngle >= 165 && normalizedAngle < 195) {
    // Ensure it's actually blue (negative a and b, with b more negative)
    if (a < 0 && b < 0 && Math.abs(b) > Math.abs(a)) {
      varieties.push('Saphir', 'Blauer Spinell', 'Tanzanit');
    }
  }
  // Also check for blue with traditional criteria
  if (a < -5 && b < -5 && Math.abs(b) > Math.abs(a)) {
    varieties.push('Saphir', 'Blauer Spinell', 'Tanzanit');
  }
  
  // Blue-Violet (195-225 degrees)
  if (normalizedAngle >= 195 && normalizedAngle < 225) {
    varieties.push('Tanzanit', 'Violetter Saphir', 'Iolith');
  }
  
  // Green - CRITICAL: Must check both Lab values and RGB
  if (normalizedAngle >= 105 && normalizedAngle < 135) {
    // Green should have: negative a, positive b
    if (a < 0 && b > 5) {
      varieties.push('Smaragd', 'Grüner Turmalin', 'Peridot', 'Tsavorit', 'Grüner Granat');
    }
  }
  // Also check for green in wider range (75-135) with proper Lab values
  if (normalizedAngle >= 75 && normalizedAngle < 135) {
    if (a < 0 && b > 3) {
      // Parse RGB to confirm it's green
      const hexClean = hex.replace('#', '');
      let r = 0, g = 0, bl = 0;
      if (hexClean.length === 6) {
        r = parseInt(hexClean.substring(0, 2), 16);
        g = parseInt(hexClean.substring(2, 4), 16);
        bl = parseInt(hexClean.substring(4, 6), 16);
      } else if (hexClean.length === 3) {
        r = parseInt(hexClean[0] + hexClean[0], 16);
        g = parseInt(hexClean[1] + hexClean[1], 16);
        bl = parseInt(hexClean[2] + hexClean[2], 16);
      }
      // If green is dominant in RGB, it's green
      if (g > r && g > bl) {
        if (!varieties.includes('Smaragd')) {
          varieties.push('Smaragd', 'Grüner Turmalin', 'Peridot', 'Tsavorit', 'Grüner Granat');
        }
      }
    }
  }
  
  // Yellow/Orange
  if (normalizedAngle >= 45 && normalizedAngle < 75) {
    if (a > 5 && b > 10) {
      varieties.push('Gelber Saphir', 'Citrin', 'Gelber Topas');
    }
  }
  
  // Purple/Violet (225-285 degrees) - improved detection
  if (normalizedAngle >= 225 && normalizedAngle < 285) {
    // Distinguish between violet and red-violet
    if (normalizedAngle >= 225 && normalizedAngle < 255) {
      // More violet (closer to blue-violet)
      varieties.push('Ametyst', 'Violetter Saphir', 'Violetter Spinell');
    } else {
      // More red-violet
      varieties.push('Ametyst', 'Violetter Spinell', 'Roter Spinell');
    }
  }
  
  // Try to learn from saved corrections
  try {
    const response = await fetch(
      `/api/gemstone-analyses/corrections?L=${lab.L}&a=${lab.a}&b=${lab.b}`
    );
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (data.success && data.similarCorrections && Array.isArray(data.similarCorrections) && data.similarCorrections.length > 0) {
          // Use corrections from similar colors (DeltaE < 15)
          // Prioritize corrections with lower DeltaE
          const bestCorrection = data.similarCorrections[0];
          if (bestCorrection && bestCorrection.deltaE < 10) {
            // Very similar color - use correction as primary suggestion
            const correctedVarieties = Array.isArray(bestCorrection.correctedVariety) ? bestCorrection.correctedVariety : varieties;
            
            // If pleochroism correction exists, filter varieties to match
            if (bestCorrection.correctedPleochroism) {
              const pleochroismType = bestCorrection.correctedPleochroism.toLowerCase().includes('isotrop') ? 'isotrop' : 'anisotrop';
              const filtered = filterVarietiesByPleochroism(correctedVarieties, pleochroismType);
              return filtered.length > 0 ? filtered : correctedVarieties;
            }
            
            return correctedVarieties;
          } else if (bestCorrection && bestCorrection.deltaE < 15) {
            // Similar color - merge with base suggestions
            const corrected = Array.isArray(bestCorrection.correctedVariety) ? bestCorrection.correctedVariety : [];
            
            // If pleochroism correction exists, filter to match
            if (bestCorrection.correctedPleochroism) {
              const pleochroismType = bestCorrection.correctedPleochroism.toLowerCase().includes('isotrop') ? 'isotrop' : 'anisotrop';
              const filteredCorrected = filterVarietiesByPleochroism(corrected, pleochroismType);
              const filteredVarieties = filterVarietiesByPleochroism(varieties, pleochroismType);
              const merged = [...new Set([...filteredCorrected, ...filteredVarieties])];
              return merged;
            }
            
            const merged = [...new Set([...corrected, ...varieties])];
            return merged;
          }
        }
      } else {
        console.warn('Unexpected content type from corrections API:', contentType);
      }
    } else {
      // Non-OK response - log but don't throw
      console.warn('Corrections API returned non-OK status:', response.status);
    }
  } catch (error) {
    // If learning fails, fall back to base suggestions
    console.error('Error fetching corrections:', error);
  }
  
  return varieties.length > 0 ? varieties : ['Weitere Identifikation erforderlich'];
}

// Synchron wrapper for backward compatibility
function suggestVariety(
  hex: string,
  lab: { a: number; b: number; L: number },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _saturation: number
): string[] {
  // For synchronous calls, return base suggestions
  // The async version will be used in getOverallImpression
  const varieties: string[] = [];
  const { a, b } = lab;
  
  const angle = (Math.atan2(b, a) * 180) / Math.PI;
  const normalizedAngle = angle < 0 ? angle + 360 : angle;
  
  if (normalizedAngle < 15 || normalizedAngle >= 345 || (normalizedAngle >= 285 && normalizedAngle < 345)) {
    if (a > 10 && Math.abs(b) < 15) {
      varieties.push('Rubin', 'Roter Spinell', 'Roter Turmalin');
    }
  }
  
  if (normalizedAngle >= 165 && normalizedAngle < 195) {
    if (a < 0 && b < 0 && Math.abs(b) > Math.abs(a)) {
      varieties.push('Saphir', 'Blauer Spinell', 'Tanzanit');
    }
  }
  if (a < -5 && b < -5 && Math.abs(b) > Math.abs(a)) {
    varieties.push('Saphir', 'Blauer Spinell', 'Tanzanit');
  }
  
  if (normalizedAngle >= 195 && normalizedAngle < 225) {
    varieties.push('Tanzanit', 'Violetter Saphir', 'Iolith');
  }
  
  if (normalizedAngle >= 105 && normalizedAngle < 135) {
    if (a < 0 && b > 5) {
      varieties.push('Smaragd', 'Grüner Turmalin', 'Peridot');
    }
  }
  
  if (normalizedAngle >= 45 && normalizedAngle < 75) {
    if (a > 5 && b > 10) {
      varieties.push('Gelber Saphir', 'Citrin', 'Gelber Topas');
    }
  }
  
  if (normalizedAngle >= 225 && normalizedAngle < 285) {
    if (normalizedAngle >= 225 && normalizedAngle < 255) {
      varieties.push('Ametyst', 'Violetter Saphir', 'Violetter Spinell');
    } else {
      varieties.push('Ametyst', 'Violetter Spinell', 'Roter Spinell');
    }
  }
  
  return varieties.length > 0 ? varieties : ['Weitere Identifikation erforderlich'];
}

function assessOpticalQuality(purity: number, saturation: number): string {
  if (purity > 80 && saturation > 40) {
    return 'Ausgezeichnet';
  }
  if (purity > 60 && saturation > 30) {
    return 'Sehr gut';
  }
  if (purity > 40 && saturation > 20) {
    return 'Gut';
  }
  return 'Moderat';
}

export function generateOverallImpression(
  color: string,
  saturation: string,
  pleochroism: string,
  quality: string
): string {
  return `Der Edelstein zeigt einen ${color} Farbton mit ${saturation} Sättigung. ${pleochroism}. Die optische Qualität wird als ${quality} bewertet.`;
}

export function generateFinalEvaluation(
  color: string,
  saturation: string,
  pleochroism: string,
  varieties: string[],
  quality: string
): string {
  const varietyList = varieties.length > 0 ? varieties.join(', ') : 'unbekannte Varietät';
  return `Basierend auf der Farbanalyse handelt es sich möglicherweise um ${varietyList}. Die Farbe zeigt ${saturation} Sättigung und ${pleochroism}. Die optische Qualität ist ${quality}. Weitere gemmologische Tests (Brechungsindex, Doppelbrechung, Spektroskopie) werden zur endgültigen Identifikation empfohlen.`;
}

/**
 * List of isotropic gemstone varieties (cubic crystal system - no pleochroism)
 */
const ISOTROPIC_VARIETIES = [
  'Diamant',
  'Spinell',
  'Blauer Spinell',
  'Roter Spinell',
  'Violetter Spinell',
  'Grüner Spinell',
  'Garnet',
  'Granat',
  'Almandin',
  'Pyrop',
  'Grossular',
  'Spessartin',
  'Andradit',
  'Uvarovit',
  'Tsavorit',
  'Grüner Granat',
  'Demantoid',
  'Hessonit',
  'Rhodolith',
  'Fluorit',
  'Sodalith',
];

/**
 * Check if a variety is isotropic (cubic crystal system)
 */
function isIsotropicVariety(variety: string): boolean {
  const varietyLower = variety.toLowerCase();
  return ISOTROPIC_VARIETIES.some(iso => 
    varietyLower.includes(iso.toLowerCase()) || 
    iso.toLowerCase().includes(varietyLower)
  );
}

/**
 * Filter varieties based on pleochroism type
 * Returns only varieties that match the pleochroism type
 */
export function filterVarietiesByPleochroism(
  varieties: string[],
  pleochroismType: 'isotrop' | 'anisotrop'
): string[] {
  if (pleochroismType === 'isotrop') {
    return varieties.filter(v => isIsotropicVariety(v));
  } else {
    return varieties.filter(v => !isIsotropicVariety(v));
  }
}

/**
 * Suggest pleochroism based on varieties
 * Returns the pleochroism type that matches the varieties
 */
export function suggestPleochroismFromVarieties(varieties: string[]): 'isotrop' | 'anisotrop' {
  if (varieties.length === 0) {
    return 'anisotrop'; // Default to anisotropic
  }
  
  // If all varieties are isotropic, return isotrop
  // If any variety is anisotropic, return anisotrop
  const allIsotropic = varieties.every(v => isIsotropicVariety(v));
  return allIsotropic ? 'isotrop' : 'anisotrop';
}

/**
 * Determine pleochroism type based on variety
 * Returns 'isotrop' only if ALL varieties are isotropic, 'anisotrop' otherwise
 * This ensures consistency: if any variety is anisotropic, the gemstone is anisotropic
 */
export function determinePleochroismType(possibleVariety: string[]): 'isotrop' | 'anisotrop' {
  if (possibleVariety.length === 0) {
    // No variety info - default to anisotropic (most gemstones are anisotropic)
    return 'anisotrop';
  }
  
  // Check if ALL varieties are isotropic
  // If ANY variety is anisotropic, the gemstone is anisotropic
  const allIsotropic = possibleVariety.every(variety => isIsotropicVariety(variety));
  
  return allIsotropic ? 'isotrop' : 'anisotrop';
}

/**
 * Analyze pleochroism tendency
 * Always considers actual color differences for consistency
 */
export function analyzePleochroism(
  center: ColorSample[],
  facets: ColorSample[],
  shadows: ColorSample[],
  possibleVariety?: string[]
): string {
  const colors = [...center, ...facets, ...shadows];
  
  // Calculate color differences first (always do this for consistency)
  let avgDeltaE = 0;
  if (colors.length >= 2) {
    const differences: number[] = [];
    for (let i = 0; i < Math.min(colors.length, 3); i++) {
      for (let j = i + 1; j < Math.min(colors.length, 3); j++) {
        const deltaE = calculateDeltaE(colors[i].lab, colors[j].lab);
        differences.push(deltaE);
      }
    }
    avgDeltaE = differences.reduce((sum, d) => sum + d, 0) / differences.length;
  }
  
  // Check variety information
  if (possibleVariety && possibleVariety.length > 0) {
    const pleochroismType = determinePleochroismType(possibleVariety);
    
    // If variety is isotropic, check if color differences support this
    if (pleochroismType === 'isotrop') {
      // Only return isotropic if color differences are very small (consistent color)
      // This ensures consistency: if there are significant color differences, it's likely anisotropic
      if (colors.length < 2 || avgDeltaE < 3) {
        return 'Isotrop (kein Pleochroismus)';
      } else {
        // Significant color differences detected despite isotropic variety suggestion
        // This could be due to mixed variety suggestions (e.g., "Roter Spinell" + "Roter Turmalin")
        // Prefer the actual color analysis over variety suggestion
        if (avgDeltaE < 5) return 'Schwacher Pleochroismus (anisotrop)';
        if (avgDeltaE < 15) return 'Mäßiger Pleochroismus (anisotrop)';
        if (avgDeltaE < 30) return 'Starker Pleochroismus (anisotrop)';
        return 'Sehr starker Pleochroismus (anisotrop)';
      }
    }
    // Variety is anisotropic - use color difference analysis
  }
  
  // No variety info or anisotropic variety - base on color differences
  if (colors.length < 2) {
    return 'Kein Pleochroismus erkennbar';
  }
  
  if (avgDeltaE < 5) return 'Schwacher Pleochroismus (anisotrop)';
  if (avgDeltaE < 15) return 'Mäßiger Pleochroismus (anisotrop)';
  if (avgDeltaE < 30) return 'Starker Pleochroismus (anisotrop)';
  return 'Sehr starker Pleochroismus (anisotrop)';
}

