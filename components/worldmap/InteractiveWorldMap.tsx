'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Filter, Info } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix für Leaflet Marker Icons
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface InteractiveWorldMapProps {
  locations: Location[];
  gemTypes: GemType[];
}

export function InteractiveWorldMap({ locations, gemTypes }: InteractiveWorldMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedGemType, setSelectedGemType] = useState<string>('all');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (selectedGemType === 'all') {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(locations.filter(location => location.gemTypeId === selectedGemType));
    }
  }, [selectedGemType, locations]);

  // Erstelle benutzerdefinierte Marker-Icons für verschiedene Edelstein-Typen
  const createGemIcon = (gemType: GemType) => {
    const color = gemType.color || '#3b82f6';
    const svgString = `<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
      <text x="12.5" y="16" text-anchor="middle" font-size="8" fill="${color}" font-weight="bold">💎</text>
    </svg>`;
    
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(svgString)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41]
    });
  };

  // Gruppiere Fundorte nach Edelstein-Typ
  const locationsByGemType = filteredLocations.reduce((acc, location) => {
    const gemTypeName = location.gemType.name;
    if (!acc[gemTypeName]) {
      acc[gemTypeName] = [];
    }
    acc[gemTypeName].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

  if (!isClient) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Weltkarte wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter und Legende */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Legende
          </CardTitle>
          <CardDescription>
            Filtern Sie die Fundorte nach Edelstein-Typ oder erkunden Sie alle Standorte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="gemTypeFilter" className="text-sm font-medium">
                Edelstein-Typ:
              </label>
              <Select value={selectedGemType} onValueChange={setSelectedGemType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Alle Edelsteine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Edelsteine ({locations.length})</SelectItem>
                  {gemTypes.map((gemType) => {
                    const count = locations.filter(l => l.gemTypeId === gemType.id).length;
                    return (
                      <SelectItem key={gemType.id} value={gemType.id}>
                        {gemType.name} ({count})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(locationsByGemType).map(([gemTypeName, gemLocations]) => (
                <Badge key={gemTypeName} variant="outline" className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: gemLocations[0]?.gemType.color || '#3b82f6' }}
                  />
                  {gemTypeName} ({gemLocations.length})
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interaktive Karte */}
      <Card>
        <CardContent className="p-0">
          <div className="h-[70vh] w-full">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.lat, location.lng]}
                  icon={createGemIcon(location.gemType)}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-lg mb-2">{location.name}</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Land:</strong> {location.country.name}</p>
                        <p><strong>Edelstein:</strong> {location.gemType.name}</p>
                        {location.mineType && (
                          <p><strong>Minen-Typ:</strong> {location.mineType}</p>
                        )}
                        {location.status && (
                          <p><strong>Status:</strong> 
                            <Badge 
                              variant={location.status === 'active' ? 'default' : 'secondary'}
                              className="ml-1"
                            >
                              {location.status}
                            </Badge>
                          </p>
                        )}
                        {location.description && (
                          <p className="mt-2 text-gray-300">{location.description}</p>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{locations.length}</p>
                <p className="text-sm text-muted-foreground">Fundorte weltweit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{gemTypes.length}</p>
                <p className="text-sm text-muted-foreground">Edelstein-Typen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(locations.map(l => l.country.name)).size}
                </p>
                <p className="text-sm text-muted-foreground">Länder</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
