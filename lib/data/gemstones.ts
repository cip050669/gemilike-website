import { CutGemstone, RoughGemstone, Gemstone } from '@/lib/types/gemstone';

// Beispiel-Daten für geschliffene Edelsteine
export const cutGemstones: CutGemstone[] = [
  {
    id: 'gem-cut-emerald-001',
    name: 'Kolumbianischer Smaragd',
    type: 'cut',
    description: 'Intensiv grüner Smaragd mit hervorragender Transparenz und lebendiger Farbe.',
    cut: 'Smaragdschliff',
    price: 12800,
    currency: 'EUR',
    images: ['/products/placeholder-gem.jpg'],
    mainImage: '/products/placeholder-gem.jpg',
    origin: 'Kolumbien',
    originType: 'natürlich',
    mineLocation: 'Muzo Mine',
    dimensions: {
      length: 8.2,
      width: 6.4,
      height: 4.1,
    },
    treatment: {
      treated: true,
      type: 'oiled',
    },
    certification: {
      certified: true,
      lab: 'GIA',
      certificateNumber: 'GIA-EM-2025-001',
    },
    inStock: true,
    quantity: 1,
    category: 'Smaragd',
    color: 'Grün',
    rarity: 'seltenes',
    createdAt: new Date('2025-10-01T10:00:00Z'),
    updatedAt: new Date('2025-10-18T08:30:00Z'),
    caratWeight: 2.35,
    cutForm: 'Emerald Cut',
    colorSaturation: 8,
    colorIntensity: 'Intense',
    clarity: 'VS1',
    isNew: true,
  },
  {
    id: 'gem-cut-ruby-002',
    name: 'Burmesischer Rubin',
    type: 'cut',
    description: 'Feuerroter Rubin mit außergewöhnlicher Brillanz und minimaler Behandlung.',
    cut: 'Ovalschliff',
    price: 18500,
    currency: 'EUR',
    images: ['/products/placeholder-gem.jpg'],
    mainImage: '/products/placeholder-gem.jpg',
    origin: 'Myanmar',
    originType: 'natürlich',
    mineLocation: 'Mogok',
    dimensions: {
      length: 7.4,
      width: 5.8,
      height: 4.0,
    },
    treatment: {
      treated: true,
      type: 'heated',
    },
    certification: {
      certified: true,
      lab: 'SSEF',
      certificateNumber: 'SSEF-RB-2025-017',
    },
    inStock: true,
    quantity: 1,
    category: 'Rubin',
    color: 'Rot',
    rarity: 'außergewöhnliches',
    createdAt: new Date('2025-09-20T09:00:00Z'),
    updatedAt: new Date('2025-10-17T18:27:25Z'),
    caratWeight: 1.92,
    cutForm: 'Oval',
    colorSaturation: 9,
    colorIntensity: 'Vivid',
    clarity: 'VS2',
    isNew: true,
  },
  {
    id: 'gem-cut-diamond-003',
    name: 'Brillant Diamant',
    type: 'cut',
    description: 'Brillant geschliffener Diamant mit exzellenter Klarheit und strahlendem Feuer.',
    cut: 'Brillantschliff',
    price: 14900,
    currency: 'EUR',
    images: ['/products/placeholder-gem.jpg'],
    mainImage: '/products/placeholder-gem.jpg',
    origin: 'Südafrika',
    originType: 'natürlich',
    dimensions: {
      length: 6.5,
      width: 6.5,
      height: 4.1,
    },
    treatment: {
      treated: false,
    },
    certification: {
      certified: true,
      lab: 'HRD',
      certificateNumber: 'HRD-DIA-39421',
    },
    inStock: true,
    quantity: 1,
    category: 'Diamant',
    color: 'Farblos',
    rarity: 'besonders schön',
    createdAt: new Date('2025-08-30T12:00:00Z'),
    updatedAt: new Date('2025-10-15T14:12:00Z'),
    caratWeight: 1.58,
    cutForm: 'Brillant',
    colorSaturation: 3,
    colorIntensity: 'Colorless',
    clarity: 'VVS1',
    isNew: true,
  },
  {
    id: 'gem-cut-sapphire-004',
    name: 'Kornblumenblauer Saphir',
    type: 'cut',
    description: 'Seltenes Exemplar mit intensiver kornblumenblauer Farbe aus Sri Lanka.',
    cut: 'Ovalschliff',
    price: 8900,
    currency: 'EUR',
    images: ['/products/sapphire.jpg'],
    mainImage: '/products/sapphire.jpg',
    origin: 'Sri Lanka',
    originType: 'natürlich',
    dimensions: {
      length: 9.1,
      width: 6.9,
      height: 4.4,
    },
    treatment: {
      treated: true,
      type: 'heated',
    },
    certification: {
      certified: true,
      lab: 'GRS',
      certificateNumber: 'GRS-SAP-83832',
    },
    inStock: false,
    quantity: 0,
    category: 'Saphir',
    color: 'Blau',
    rarity: 'großes',
    createdAt: new Date('2025-05-12T15:45:00Z'),
    updatedAt: new Date('2025-10-10T10:00:00Z'),
    caratWeight: 2.85,
    cutForm: 'Oval',
    colorSaturation: 7,
    colorIntensity: 'Vivid',
    clarity: 'SI1',
    isNew: false,
  },
];

// Beispiel-Daten für Rohsteine
export const roughGemstones: RoughGemstone[] = [
  {
    id: 'gem-rough-paraiba-001',
    name: 'Paraíba Turmalin Rohkristall',
    type: 'rough',
    description: 'Rohkristall mit charakteristischem Neonblau, ideal für individuelles Facettieren.',
    price: 5200,
    currency: 'EUR',
    images: ['/products/placeholder-gem.jpg'],
    mainImage: '/products/placeholder-gem.jpg',
    origin: 'Brasilien',
    originType: 'natürlich',
    mineLocation: 'Paraíba',
    dimensions: {
      length: 15.4,
      width: 10.2,
      height: 8.7,
    },
    treatment: {
      treated: false,
    },
    certification: {
      certified: false,
    },
    inStock: true,
    quantity: 1,
    category: 'Turmalin',
    color: 'Blau',
    rarity: 'außergewöhnliches',
    createdAt: new Date('2025-09-01T13:00:00Z'),
    updatedAt: new Date('2025-10-14T08:00:00Z'),
    gramWeight: 12.4,
    crystalQuality: 'Very Good',
    transparency: 'Translucent',
    isNew: true,
  },
];

// Alle Edelsteine kombiniert
export const allGemstones: Gemstone[] = [
  ...cutGemstones,
  ...roughGemstones,
];

const toDate = (value: Date | string): Date =>
  value instanceof Date ? value : new Date(value);

export function getNewGemstones(limit = 10): Gemstone[] {
  return allGemstones
    .filter((gem) => gem.isNew)
    .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime())
    .slice(0, limit);
}

// Helper-Funktionen
export function getGemstoneById(id: string): Gemstone | undefined {
  return allGemstones.find(gem => gem.id === id);
}

export function getGemstonesByType(type: 'cut' | 'rough'): Gemstone[] {
  return allGemstones.filter(gem => gem.type === type);
}

export function getGemstonesByCategory(category: string): Gemstone[] {
  return allGemstones.filter(gem => gem.category === category);
}
