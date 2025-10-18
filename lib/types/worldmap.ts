// Weltkarte-Typen und Interfaces

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GemstoneLocation {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: Coordinates;
  gemstones: string[];
  description: string;
  imageUrl: string;
  isActive: boolean;
  // Erweiterte Eigenschaften
  mineType?: 'open-pit' | 'underground' | 'alluvial' | 'primary' | 'secondary';
  historicalSignificance?: string;
  currentStatus?: 'active' | 'inactive' | 'depleted' | 'protected';
  climate?: string;
  accessibility?: 'easy' | 'moderate' | 'difficult' | 'restricted';
  // Zusätzliche Metadaten
  foundedYear?: number;
  peakProductionYear?: number;
  estimatedReserves?: string;
  environmentalImpact?: string;
}

export interface WorldMapFilters {
  searchTerm: string;
  selectedGemstone: string;
  selectedCountry?: string;
  selectedRegion?: string;
  mineType?: string;
  currentStatus?: string;
}

export interface WorldMapStats {
  totalLocations: number;
  activeMines: number;
  countries: number;
  gemstoneTypes: number;
}

// Helper-Funktionen
export function filterLocationsByGemstone(locations: GemstoneLocation[], gemstone: string): GemstoneLocation[] {
  if (gemstone === 'all') return locations;
  return locations.filter(location => location.gemstones.includes(gemstone));
}

export function filterLocationsBySearch(locations: GemstoneLocation[], searchTerm: string): GemstoneLocation[] {
  if (!searchTerm) return locations;
  const term = searchTerm.toLowerCase();
  return locations.filter(location => 
    location.name.toLowerCase().includes(term) ||
    location.country.toLowerCase().includes(term) ||
    location.region.toLowerCase().includes(term) ||
    location.gemstones.some(gem => gem.toLowerCase().includes(term))
  );
}

export function getUniqueGemstones(locations: GemstoneLocation[]): string[] {
  return Array.from(new Set(locations.flatMap(loc => loc.gemstones))).sort();
}

export function getUniqueCountries(locations: GemstoneLocation[]): string[] {
  return Array.from(new Set(locations.map(loc => loc.country))).sort();
}

export function calculateWorldMapStats(locations: GemstoneLocation[]): WorldMapStats {
  return {
    totalLocations: locations.length,
    activeMines: locations.filter(loc => loc.currentStatus === 'active').length,
    countries: getUniqueCountries(locations).length,
    gemstoneTypes: getUniqueGemstones(locations).length,
  };
}
