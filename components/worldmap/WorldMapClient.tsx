'use client';

import dynamic from 'next/dynamic';

// Types from InteractiveWorldMap
interface Country {
  id: string;
  name: string;
  lat: number;
  lng: number;
  continent?: string;
  isActive: boolean;
}

interface GemType {
  id: string;
  name: string;
  color?: string;
  description?: string;
  isActive: boolean;
}

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
  mineType?: string;
  status?: string;
  isActive: boolean;
  country: Country;
  gemType: GemType;
}

// Lazy Load InteractiveWorldMap - große Komponente mit Leaflet
const LazyInteractiveWorldMap = dynamic(
  () => import('@/components/worldmap/InteractiveWorldMap').then((mod) => ({ default: mod.InteractiveWorldMap })),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[600px] bg-gray-900/50 rounded-lg border border-white/10">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-white/70">Lade Weltkarte...</p>
        </div>
      </div>
    ),
    ssr: false, // Leaflet funktioniert nur Client-Side
  }
);

interface WorldMapClientProps {
  locations: Location[];
  gemTypes: GemType[];
  locale?: string;
}

export function WorldMapClient({ locations, gemTypes, locale = 'de' }: WorldMapClientProps) {
  return <LazyInteractiveWorldMap locations={locations} gemTypes={gemTypes} locale={locale} />;
}

