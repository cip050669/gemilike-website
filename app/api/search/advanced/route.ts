import { NextRequest, NextResponse } from 'next/server';
import { getSessionWithUser } from '@/lib/session';
import { allGemstones } from '@/lib/data/gemstones';
import { Gemstone, isCutGemstone, isRoughGemstone } from '@/lib/types/gemstone';

export interface SearchFilters {
  // Text search
  searchTerm: string;
  
  // Basic filters
  category: string;
  origin: string;
  type: string;
  
  // Price and weight
  priceRange: [number, number];
  weightRange: [number, number];
  
  // Quality filters
  treatment: string;
  certification: string;
  inStockOnly: boolean;
  
  // Advanced filters
  color: string;
  clarity: string;
  cutQuality: string;
  symmetry: string;
  polish: string;
  colorGrade: string;
  colorIntensity: string;
  crystalQuality: string;
  transparency: string;
  
  // Dimensions
  dimensionsRange: {
    length: [number, number];
    width: [number, number];
    height: [number, number];
  };
  
  // Special features
  hasVideos: boolean;
  hasCertificates: boolean;
  estimatedYieldRange: [number, number];
}

export interface SearchResult {
  gemstones: Gemstone[];
  totalCount: number;
  appliedFilters: string[];
  searchTime: number;
  suggestions?: string[];
}

export async function POST(request: NextRequest) {
  try {
    await getSessionWithUser();
    
    // Log search for analytics (optional authentication)
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    let filters: SearchFilters;
    try {
      filters = await request.json();
    } catch (error) {
      console.error('Invalid JSON in search request:', error);
      return NextResponse.json(
        { error: 'Invalid search parameters' },
        { status: 400 }
      );
    }
    const startTime = Date.now();

    // Check if gemstones data is available
    if (!allGemstones || allGemstones.length === 0) {
      console.error('No gemstones data available');
      return NextResponse.json(
        { error: 'Product data not available' },
        { status: 503 }
      );
    }

    let filtered = [...allGemstones];
    const appliedFilters: string[] = [];

    // Text search (searches in name, description, category, and color)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(gemstone =>
        gemstone.name.toLowerCase().includes(searchLower) ||
        gemstone.description.toLowerCase().includes(searchLower) ||
        gemstone.category.toLowerCase().includes(searchLower) ||
        (gemstone.color && gemstone.color.toLowerCase().includes(searchLower))
      );
      appliedFilters.push(`Suche: "${filters.searchTerm}"`);
    }

    // Basic filters
    if (filters.category !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.category === filters.category);
      appliedFilters.push(`Kategorie: ${filters.category}`);
    }

    if (filters.origin !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.origin === filters.origin);
      appliedFilters.push(`Herkunft: ${filters.origin}`);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.type === filters.type);
      appliedFilters.push(`Typ: ${filters.type === 'cut' ? 'Geschliffen' : 'Roh'}`);
    }

    if (filters.color !== 'all') {
      filtered = filtered.filter(gemstone => gemstone.color === filters.color);
      appliedFilters.push(`Farbe: ${filters.color}`);
    }

    // Price and weight ranges
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000) {
      filtered = filtered.filter(gemstone => 
        gemstone.price >= filters.priceRange[0] && gemstone.price <= filters.priceRange[1]
      );
      appliedFilters.push(`Preis: €${filters.priceRange[0]} - €${filters.priceRange[1]}`);
    }

    if (filters.weightRange[0] > 0 || filters.weightRange[1] < 100) {
      filtered = filtered.filter(gemstone => {
        const weight = isCutGemstone(gemstone) ? gemstone.caratWeight : gemstone.gramWeight;
        return weight >= filters.weightRange[0] && weight <= filters.weightRange[1];
      });
      const unit = allGemstones.some(g => isCutGemstone(g)) ? 'ct' : 'g';
      appliedFilters.push(`Gewicht: ${filters.weightRange[0]} - ${filters.weightRange[1]} ${unit}`);
    }

    // Quality filters
    if (filters.treatment !== 'all') {
      if (filters.treatment === 'untreated') {
        filtered = filtered.filter(gemstone => !gemstone.treatment.treated);
        appliedFilters.push('Behandlung: Unbehandelt');
      } else {
        filtered = filtered.filter(gemstone => 
          gemstone.treatment.treated && gemstone.treatment.type === filters.treatment
        );
        appliedFilters.push(`Behandlung: ${filters.treatment}`);
      }
    }

    if (filters.certification !== 'all') {
      if (filters.certification === 'certified') {
        filtered = filtered.filter(gemstone => gemstone.certification.certified);
        appliedFilters.push('Zertifizierung: Zertifiziert');
      } else if (filters.certification === 'uncertified') {
        filtered = filtered.filter(gemstone => !gemstone.certification.certified);
        appliedFilters.push('Zertifizierung: Nicht zertifiziert');
      } else {
        filtered = filtered.filter(gemstone => 
          gemstone.certification.certified && gemstone.certification.lab === filters.certification
        );
        appliedFilters.push(`Zertifizierung: ${filters.certification}`);
      }
    }

    // Cut-specific filters
    if (filters.clarity !== 'all') {
      filtered = filtered.filter(gemstone => 
        isCutGemstone(gemstone) && gemstone.clarity === filters.clarity
      );
      appliedFilters.push(`Reinheit: ${filters.clarity}`);
    }

    if (filters.cutQuality !== 'all') {
      filtered = filtered.filter(gemstone => 
        isCutGemstone(gemstone) && gemstone.cutQuality === filters.cutQuality
      );
      appliedFilters.push(`Schliffqualität: ${filters.cutQuality}`);
    }

    if (filters.symmetry !== 'all') {
      filtered = filtered.filter(gemstone => 
        isCutGemstone(gemstone) && gemstone.symmetry === filters.symmetry
      );
      appliedFilters.push(`Symmetrie: ${filters.symmetry}`);
    }

    if (filters.polish !== 'all') {
      filtered = filtered.filter(gemstone => 
        isCutGemstone(gemstone) && gemstone.polish === filters.polish
      );
      appliedFilters.push(`Politur: ${filters.polish}`);
    }

    if (filters.colorGrade !== 'all') {
      filtered = filtered.filter(gemstone => 
        isCutGemstone(gemstone) && gemstone.colorGrade === filters.colorGrade
      );
      appliedFilters.push(`Farbgrad: ${filters.colorGrade}`);
    }

    if (filters.colorIntensity !== 'all') {
      filtered = filtered.filter(gemstone => 
        isCutGemstone(gemstone) && gemstone.colorIntensity === filters.colorIntensity
      );
      appliedFilters.push(`Farbintensität: ${filters.colorIntensity}`);
    }

    // Rough-specific filters
    if (filters.crystalQuality !== 'all') {
      filtered = filtered.filter(gemstone => 
        isRoughGemstone(gemstone) && gemstone.crystalQuality === filters.crystalQuality
      );
      appliedFilters.push(`Kristallqualität: ${filters.crystalQuality}`);
    }

    if (filters.transparency !== 'all') {
      filtered = filtered.filter(gemstone => 
        isRoughGemstone(gemstone) && gemstone.transparency === filters.transparency
      );
      appliedFilters.push(`Transparenz: ${filters.transparency}`);
    }

    // Dimension filters
    const hasDimensionFilters = 
      filters.dimensionsRange.length[0] > 0 || filters.dimensionsRange.length[1] < 50 ||
      filters.dimensionsRange.width[0] > 0 || filters.dimensionsRange.width[1] < 50 ||
      filters.dimensionsRange.height[0] > 0 || filters.dimensionsRange.height[1] < 50;

    if (hasDimensionFilters) {
      filtered = filtered.filter(gemstone => 
        gemstone.dimensions.length >= filters.dimensionsRange.length[0] &&
        gemstone.dimensions.length <= filters.dimensionsRange.length[1] &&
        gemstone.dimensions.width >= filters.dimensionsRange.width[0] &&
        gemstone.dimensions.width <= filters.dimensionsRange.width[1] &&
        gemstone.dimensions.height >= filters.dimensionsRange.height[0] &&
        gemstone.dimensions.height <= filters.dimensionsRange.height[1]
      );
      appliedFilters.push(`Abmessungen: L${filters.dimensionsRange.length[0]}-${filters.dimensionsRange.length[1]} x B${filters.dimensionsRange.width[0]}-${filters.dimensionsRange.width[1]} x H${filters.dimensionsRange.height[0]}-${filters.dimensionsRange.height[1]} mm`);
    }

    // Special features
    if (filters.hasVideos) {
      filtered = filtered.filter(gemstone => gemstone.videos && gemstone.videos.length > 0);
      appliedFilters.push('Mit Videos');
    }

    if (filters.hasCertificates) {
      filtered = filtered.filter(gemstone => 
        gemstone.certification.certified && gemstone.certification.certificateUrl
      );
      appliedFilters.push('Mit Zertifikaten');
    }

    if (filters.estimatedYieldRange[0] > 0 || filters.estimatedYieldRange[1] < 100) {
      filtered = filtered.filter(gemstone => {
        if (isRoughGemstone(gemstone) && gemstone.estimatedCaratYield) {
          return gemstone.estimatedCaratYield >= filters.estimatedYieldRange[0] &&
                 gemstone.estimatedCaratYield <= filters.estimatedYieldRange[1];
        }
        return false;
      });
      appliedFilters.push(`Geschätzte Ausbeute: ${filters.estimatedYieldRange[0]} - ${filters.estimatedYieldRange[1]} ct`);
    }

    // Stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter(gemstone => gemstone.inStock);
      appliedFilters.push('Nur verfügbare Artikel');
    }

    // Generate suggestions based on search term
    const suggestions: string[] = [];
    if (filters.searchTerm && filtered.length === 0) {
      // Find similar terms
      const allTerms = new Set<string>();
      allGemstones.forEach(gemstone => {
        allTerms.add(gemstone.name.toLowerCase());
        allTerms.add(gemstone.category.toLowerCase());
        if (gemstone.color) allTerms.add(gemstone.color.toLowerCase());
        allTerms.add(gemstone.origin.toLowerCase());
      });

      const searchLower = filters.searchTerm.toLowerCase();
      const similarTerms = Array.from(allTerms).filter(term => 
        term.includes(searchLower) || searchLower.includes(term)
      ).slice(0, 5);

      suggestions.push(...similarTerms);
    }

    const searchTime = Date.now() - startTime;

    // Get session for analytics
    const { session } = await getSessionWithUser();
    
    // Log search analytics (in production, you might want to store this in a database)
    console.log('Search performed:', {
      userId: session?.user?.id || 'anonymous',
      filters: appliedFilters,
      resultCount: filtered.length,
      searchTime,
      userAgent,
      ip,
      timestamp: new Date().toISOString()
    });

    const result: SearchResult = {
      gemstones: filtered,
      totalCount: filtered.length,
      appliedFilters,
      searchTime,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

// GET endpoint for search suggestions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Check if gemstones data is available
    if (!allGemstones || allGemstones.length === 0) {
      console.error('No gemstones data available for suggestions');
      return NextResponse.json({ suggestions: [] });
    }

    const queryLower = query.toLowerCase();
    const suggestions = new Set<string>();

    // Collect suggestions from gemstone data
    allGemstones.forEach(gemstone => {
      if (gemstone.name.toLowerCase().includes(queryLower)) {
        suggestions.add(gemstone.name);
      }
      if (gemstone.category.toLowerCase().includes(queryLower)) {
        suggestions.add(gemstone.category);
      }
      if (gemstone.color && gemstone.color.toLowerCase().includes(queryLower)) {
        suggestions.add(gemstone.color);
      }
      if (gemstone.origin.toLowerCase().includes(queryLower)) {
        suggestions.add(gemstone.origin);
      }
    });

    return NextResponse.json({
      suggestions: Array.from(suggestions).slice(0, 10)
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions' },
      { status: 500 }
    );
  }
}
