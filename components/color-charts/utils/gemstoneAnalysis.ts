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
  possibleColorCause: string[];
  possibleVariety: string[];
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
  const { lab } = primaryColor;
  
  const hue = getGIAHue(lab.a, lab.b);
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
 * Get overall impression
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
  
  if (a > 0 && b > 0) {
    if (b > a) return 'Gelb';
    return 'Orange';
  }
  
  if (a < 0 && b > 0) return 'Gelb-Grün';
  if (a < 0 && b < 0) return 'Blau';
  if (a > 0 && b < 0) return 'Rot-Violett';
  
  return 'Unbekannt';
}

function suggestOrigin(hex: string, lab: { L: number; a: number; b: number }): string[] {
  const suggestions: string[] = [];
  const { a, b } = lab;
  
  // Red/Pink
  if (a > 10 && b > -10 && b < 10) {
    suggestions.push('Myanmar (Burma)', 'Mozambique', 'Tansania');
  }
  
  // Blue
  if (a < -5 && b < -5) {
    suggestions.push('Sri Lanka', 'Myanmar (Burma)', 'Kashmir');
  }
  
  // Green
  if (a < 0 && b > 5) {
    suggestions.push('Kolumbien', 'Sambia', 'Brasilien');
  }
  
  // Yellow/Orange
  if (a > 5 && b > 10) {
    suggestions.push('Sri Lanka', 'Madagaskar', 'Tansania');
  }
  
  // Purple/Violet
  if (a > 5 && b < -10) {
    suggestions.push('Sri Lanka', 'Tansania', 'Myanmar (Burma)');
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

function getGIAHue(a: number, b: number): string {
  const angle = (Math.atan2(b, a) * 180) / Math.PI;
  const normalizedAngle = angle < 0 ? angle + 360 : angle;
  
  if (normalizedAngle < 15 || normalizedAngle >= 345) return 'R (Red)';
  if (normalizedAngle < 45) return 'pkR (Pinkish Red)';
  if (normalizedAngle < 75) return 'Y (Yellow)';
  if (normalizedAngle < 135) return 'G (Green)';
  if (normalizedAngle < 195) return 'B (Blue)';
  if (normalizedAngle < 255) return 'P (Purple)';
  return 'RP (Reddish Purple)';
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

function suggestVariety(
  hex: string,
  lab: { a: number; b: number; L: number },
  saturation: number
): string[] {
  const varieties: string[] = [];
  const { a, b } = lab;
  
  // Red/Pink
  if (a > 10 && Math.abs(b) < 15) {
    varieties.push('Rubin', 'Roter Spinell', 'Roter Turmalin');
  }
  
  // Blue
  if (a < -5 && b < -5) {
    varieties.push('Saphir', 'Blauer Spinell', 'Tanzanit');
  }
  
  // Green
  if (a < 0 && b > 5) {
    varieties.push('Smaragd', 'Grüner Turmalin', 'Peridot');
  }
  
  // Yellow/Orange
  if (a > 5 && b > 10) {
    varieties.push('Gelber Saphir', 'Citrin', 'Gelber Topas');
  }
  
  // Purple/Violet
  if (a > 5 && b < -10) {
    varieties.push('Ametyst', 'Violetter Saphir', 'Violetter Spinell');
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

function generateOverallImpression(
  color: string,
  saturation: string,
  pleochroism: string,
  quality: string
): string {
  return `Der Edelstein zeigt einen ${color} Farbton mit ${saturation} Sättigung. ${pleochroism}. Die optische Qualität wird als ${quality} bewertet.`;
}

function generateFinalEvaluation(
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
 * Analyze pleochroism tendency
 */
export function analyzePleochroism(
  center: ColorSample[],
  facets: ColorSample[],
  shadows: ColorSample[]
): string {
  const colors = [...center, ...facets, ...shadows];
  if (colors.length < 2) return 'Kein Pleochroismus erkennbar';
  
  // Calculate color differences
  const differences: number[] = [];
  for (let i = 0; i < Math.min(colors.length, 3); i++) {
    for (let j = i + 1; j < Math.min(colors.length, 3); j++) {
      const deltaE = calculateDeltaE(colors[i].lab, colors[j].lab);
      differences.push(deltaE);
    }
  }
  
  const avgDeltaE = differences.reduce((sum, d) => sum + d, 0) / differences.length;
  
  if (avgDeltaE < 5) return 'Schwacher Pleochroismus';
  if (avgDeltaE < 15) return 'Mäßiger Pleochroismus';
  if (avgDeltaE < 30) return 'Starker Pleochroismus';
  return 'Sehr starker Pleochroismus';
}

