'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Globe,
  Search,
  Filter
} from 'lucide-react';
import BulkImportDialog from './BulkImportDialog';

interface CountryData {
  id: string;
  country: string;
  lat: number;
  lng: number;
  locationCount: number;
  gemTypes: string[];
  locations: LocationData[];
}

interface LocationData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  gem: string;
  description?: string;
  mineType?: string;
  status?: string;
}

const GEM_TYPES = [
  'Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Tanzanite', 'Opal', 'Tourmaline',
  'Garnet', 'Spinel', 'Alexandrite', 'Zircon', 'Peridot', 'Aquamarine', 'Topaz',
  'Jade', 'Demantoid', 'Uvarovite', 'Pearl'
];

const MINE_TYPES = ['open-pit', 'underground', 'alluvial', 'primary', 'secondary'];
const STATUS_OPTIONS = ['active', 'inactive', 'depleted', 'protected'];

export default function WorldMapManagement() {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [editingLocation, setEditingLocation] = useState<LocationData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGem, setFilterGem] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage or API
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/worldmap');
      if (response.ok) {
        const data = await response.json();
        setCountries(data.countries || []);
      } else {
        console.error('Failed to load countries:', response.statusText);
        setCountries([]);
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCountries = async (data: CountryData[]) => {
    try {
      setCountries(data);
    } catch (error) {
      console.error('Error saving countries:', error);
    }
  };

  const addCountry = () => {
    const newCountry: CountryData = {
      id: Date.now().toString(),
      country: '',
      lat: 0,
      lng: 0,
      locationCount: 0,
      gemTypes: [],
      locations: []
    };
    setSelectedCountry(newCountry);
  };

  const addLocation = (countryId: string) => {
    const newLocation: LocationData = {
      id: Date.now().toString(),
      name: '',
      lat: 0,
      lng: 0,
      gem: 'Diamond',
      description: '',
      mineType: 'open-pit',
      status: 'active'
    };
    setEditingLocation(newLocation);
  };

  const saveCountry = async () => {
    if (!selectedCountry) return;
    
    try {
      const isNew = !countries.find(c => c.id === selectedCountry.id);
      const url = '/api/admin/worldmap';
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedCountry),
      });

      if (response.ok) {
        await loadCountries(); // Reload data from server
        setSelectedCountry(null);
      } else {
        console.error('Failed to save country:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving country:', error);
    }
  };

  const saveLocation = async () => {
    if (!editingLocation || !selectedCountry) return;
    
    try {
      const isNew = !selectedCountry.locations.find(l => l.id === editingLocation.id);
      const url = '/api/admin/worldmap/locations';
      const method = isNew ? 'POST' : 'PUT';
      
      const locationData = {
        ...editingLocation,
        countryId: selectedCountry.id
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      });

      if (response.ok) {
        await loadCountries(); // Reload data from server
        setEditingLocation(null);
      } else {
        console.error('Failed to save location:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const deleteLocation = async (locationId: string) => {
    if (!selectedCountry) return;
    
    try {
      const response = await fetch(`/api/admin/worldmap/locations?id=${locationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadCountries(); // Reload data from server
      } else {
        console.error('Failed to delete location:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const deleteCountry = async (countryId: string) => {
    try {
      const response = await fetch(`/api/admin/worldmap?id=${countryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadCountries(); // Reload data from server
        if (selectedCountry?.id === countryId) {
          setSelectedCountry(null);
        }
      } else {
        console.error('Failed to delete country:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting country:', error);
    }
  };

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGem = filterGem === 'all' || country.gemTypes.includes(filterGem);
    return matchesSearch && matchesGem;
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Lade Weltkarten-Daten...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weltkarten-Verwaltung</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Länder und Lagerstätten für die interaktive Weltkarte.
        </p>
      </div>

      <Tabs defaultValue="countries" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="countries">Länder</TabsTrigger>
          <TabsTrigger value="locations">Lagerstätten</TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="mt-6">
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Länder suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterGem} onValueChange={setFilterGem}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Edelstein filtern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Edelsteine</SelectItem>
                  {GEM_TYPES.map(gem => (
                    <SelectItem key={gem} value={gem}>{gem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <BulkImportDialog onImportComplete={loadCountries} />
                <Button onClick={addCountry}>
                  <Plus className="h-4 w-4 mr-2" />
                  Land hinzufügen
                </Button>
              </div>
            </div>

            {/* Countries Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCountries.map((country) => (
                <Card key={country.id} className="container-dark border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{country.country}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCountry(country)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCountry(country.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {country.lat.toFixed(2)}, {country.lng.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {country.locationCount} Lagerstätten
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {country.gemTypes.map((gem, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {gem}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          {selectedCountry ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Lagerstätten in {selectedCountry.country}
                </h3>
                <Button onClick={() => addLocation(selectedCountry.id)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Lagerstätte hinzufügen
                </Button>
              </div>

              <div className="grid gap-4">
                {selectedCountry.locations.map((location) => (
                  <Card key={location.id} className="container-dark border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{location.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{location.gem}</Badge>
                            {location.mineType && (
                              <Badge variant="outline">{location.mineType}</Badge>
                            )}
                            {location.status && (
                              <Badge variant="outline">{location.status}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingLocation(location)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteLocation(location.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Kein Land ausgewählt</h3>
              <p className="text-muted-foreground">
                Wählen Sie ein Land aus, um dessen Lagerstätten zu verwalten.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Country Edit Modal */}
      {selectedCountry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {countries.find(c => c.id === selectedCountry.id) ? 'Land bearbeiten' : 'Neues Land'}
                </CardTitle>
                <Button variant="ghost" onClick={() => setSelectedCountry(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Land</Label>
                  <Input
                    id="country"
                    value={selectedCountry.country}
                    onChange={(e) => setSelectedCountry({
                      ...selectedCountry,
                      country: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="lat">Breitengrad</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.0001"
                    value={selectedCountry.lat}
                    onChange={(e) => setSelectedCountry({
                      ...selectedCountry,
                      lat: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="lng">Längengrad</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.0001"
                    value={selectedCountry.lng}
                    onChange={(e) => setSelectedCountry({
                      ...selectedCountry,
                      lng: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveCountry}>
                  <Save className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
                <Button variant="outline" onClick={() => setSelectedCountry(null)}>
                  Abbrechen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Location Edit Modal */}
      {editingLocation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {selectedCountry?.locations.find(l => l.id === editingLocation.id) ? 'Lagerstätte bearbeiten' : 'Neue Lagerstätte'}
                </CardTitle>
                <Button variant="ghost" onClick={() => setEditingLocation(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="locationName">Name</Label>
                  <Input
                    id="locationName"
                    value={editingLocation.name}
                    onChange={(e) => setEditingLocation({
                      ...editingLocation,
                      name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="locationGem">Edelstein</Label>
                  <Select
                    value={editingLocation.gem}
                    onValueChange={(value) => setEditingLocation({
                      ...editingLocation,
                      gem: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GEM_TYPES.map(gem => (
                        <SelectItem key={gem} value={gem}>{gem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="locationLat">Breitengrad</Label>
                  <Input
                    id="locationLat"
                    type="number"
                    step="0.0001"
                    value={editingLocation.lat}
                    onChange={(e) => setEditingLocation({
                      ...editingLocation,
                      lat: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="locationLng">Längengrad</Label>
                  <Input
                    id="locationLng"
                    type="number"
                    step="0.0001"
                    value={editingLocation.lng}
                    onChange={(e) => setEditingLocation({
                      ...editingLocation,
                      lng: parseFloat(e.target.value) || 0
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="mineType">Minen-Typ</Label>
                  <Select
                    value={editingLocation.mineType || ''}
                    onValueChange={(value) => setEditingLocation({
                      ...editingLocation,
                      mineType: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Typ wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {MINE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editingLocation.status || ''}
                    onValueChange={(value) => setEditingLocation({
                      ...editingLocation,
                      status: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={editingLocation.description || ''}
                  onChange={(e) => setEditingLocation({
                    ...editingLocation,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveLocation}>
                  <Save className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
                <Button variant="outline" onClick={() => setEditingLocation(null)}>
                  Abbrechen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
