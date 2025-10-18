import { CutGemstone, RoughGemstone, Gemstone } from '@/lib/types/gemstone';

// Beispiel-Daten für geschliffene Edelsteine
export const cutGemstones: CutGemstone[] = [
  {
  "id": "new-1760558552924",
  "name": "rrrr",
  "type": "cut",
  "description": "adasdasdqasd",
  "price": 9999,
  "currency": "EUR",
  "images": [],
  "mainImage": "",
  "origin": "Belgien",
  "originType": "natürlich",
  "mineLocation": "asfawdqawde",
  "dimensions": {
    "length": 888,
    "width": 552,
    "height": 222
  },
  "treatment": {
    "treated": true,
    "type": "Bestrahlt"
  },
  "certification": {
    "certified": true,
    "lab": "DSEF"
  },
  "inStock": true,
  "quantity": 1,
  "category": "sassdf",
  "color": "schwarz",
  "rarity": "none",
  "createdAt": "2025-10-15T20:02:32.831Z",
  "updatedAt": "2025-10-17T18:27:25.389Z",
  "caratWeight": 9999,
  "cutForm": "Sonstige",
  "colorSaturation": 9,
  "colorIntensity": "Intensiv",
  "clarity": "Augenrein",
  "isNew": false
}
];

// Beispiel-Daten für Rohsteine
export const roughGemstones: RoughGemstone[] = [
];

// Alle Edelsteine kombiniert
export const allGemstones: Gemstone[] = [
  ...cutGemstones,
  ...roughGemstones,
];

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
