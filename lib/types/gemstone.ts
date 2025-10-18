// Edelstein-Typen und Interfaces

export type GemstoneType = 'rough' | 'cut'; // Roh oder geschliffen

export type TreatmentType = 
  | 'none' 
  | 'heated' 
  | 'oiled' 
  | 'irradiated' 
  | 'diffused' 
  | 'filled' 
  | 'coated'
  | 'other';

export type RarityType = 
  | 'none'
  | 'seltenes'
  | 'außergewöhnliches'
  | 'großes'
  | 'besonders schön';

export type OriginType = 
  | 'natürlich'
  | 'synthetisch';

export type CertificationLab = 
  | 'GIA' 
  | 'IGI' 
  | 'AGS' 
  | 'HRD' 
  | 'SSEF' 
  | 'Gübelin' 
  | 'GRS'
  | 'other'
  | 'none';

export interface Dimensions {
  length: number;  // in mm
  width: number;   // in mm
  height: number;  // in mm
}

export interface Certification {
  certified: boolean;
  lab?: CertificationLab;
  certificateNumber?: string;
  certificateUrl?: string; // Link zum Zertifikat-PDF
}

export interface Treatment {
  treated: boolean;
  type?: TreatmentType;
  description?: string;
}

// Basis-Interface für alle Edelsteine
export interface BaseGemstone {
  id: string;
  name: string;                    // z.B. "Smaragd", "Rubin"
  type: GemstoneType;              // rough oder cut
  description: string;
  price: number;                   // in EUR
  currency: string;                // "EUR", "USD"
  
  // Bilder & Videos
  images: string[];                // Array von bis zu 10 Bildpfaden
  mainImage: string;               // Hauptbild (erstes Bild)
  videos?: string[];               // Array von bis zu 2 MP4 Video-URLs
  
  // Herkunft
  origin: string;                  // z.B. "Kolumbien", "Myanmar"
  originType: OriginType;          // "natürlich" oder "synthetisch"
  mineLocation?: string;           // Spezifische Mine (optional)
  
  // Abmessungen
  dimensions: Dimensions;          // Länge x Breite x Höhe in mm
  
  // Behandlung
  treatment: Treatment;
  
  // Zertifizierung
  certification: Certification;
  
  // Verfügbarkeit
  inStock: boolean;
  quantity: number;
  
  // Kategorisierung
  category: string;                // z.B. "Smaragd", "Rubin", "Saphir"
  color?: string;                  // z.B. "Grün", "Rot", "Blau"
  
  // Raritäten
  rarity?: RarityType;             // z.B. "seltenes", "außergewöhnliches", "großes", "besonders schön"
  
  // Neu-Status
  isNew?: boolean;                // Markiert neue Edelsteine für die Startseite
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Spezifisches Interface für geschliffene Steine
export interface CutGemstone extends BaseGemstone {
  type: 'cut';
  
  // Gewicht in Karat
  caratWeight: number;
  
  // Schliff
  cut: string;                     // z.B. "Brillant", "Smaragdschliff", "Cabochon"
  cutForm?: string;               // z.B. "Rund", "Oval", "Kissen", "Princess"
  cutQuality?: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  
  // Reinheit
  clarity: string;                 // z.B. "VVS1", "VS2", "SI1", "IF"
  clarityGrade?: string;           // Zusätzliche Beschreibung
  
  // Farbe (detailliert)
  colorGrade?: string;             // z.B. "D", "E", "F" bei Diamanten
  colorIntensity?: string;         // z.B. "Vivid", "Intense", "Light"
  colorSaturation?: number;        // 1-10 Skala für Farbsättigung
  
  // Symmetrie & Politur
  symmetry?: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  polish?: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
}

// Spezifisches Interface für Rohsteine
export interface RoughGemstone extends BaseGemstone {
  type: 'rough';
  
  // Gewicht in Gramm
  gramWeight: number;
  
  // Rohstein-spezifische Eigenschaften
  crystalQuality: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  crystalForm?: string;            // z.B. "Hexagonal", "Kubisch", "Prisma"
  transparency?: 'Transparent' | 'Translucent' | 'Opaque';
  
  // Potenzial nach dem Schleifen (optional)
  estimatedCaratYield?: number;
  suitableFor?: string[];          // z.B. ["Schmuck", "Sammlung", "Investment"]
}

// Union Type für beide Edelstein-Typen
export type Gemstone = CutGemstone | RoughGemstone;

// Helper Type Guards
export function isCutGemstone(gemstone: Gemstone): gemstone is CutGemstone {
  return gemstone.type === 'cut';
}

export function isRoughGemstone(gemstone: Gemstone): gemstone is RoughGemstone {
  return gemstone.type === 'rough';
}
