'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

interface GemLocation {
  id: string;
  site: string;
  country: string;
  gem: string;
  lat: number;
  lon: number;
}

const GEM_TYPES = [
  "Diamond", "Ruby", "Sapphire", "Emerald", "Tanzanite", "Opal", "Tourmaline",
  "Garnet", "Spinel", "Alexandrite", "Zircon", "Peridot", "Aquamarine", "Topaz", "Jade",
  "Quartz", "Rhodochrosite", "Silver", "Lapis Lazuli"
];

export default function LocationsAdmin() {
  const t = useTranslations('admin');
  const [locations, setLocations] = useState<GemLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<GemLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGem, setSelectedGem] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<GemLocation | null>(null);
  const [formData, setFormData] = useState({
    site: '',
    country: '',
    gem: '',
    lat: '',
    lon: ''
  });

  // Load locations
  useEffect(() => {
    loadLocations();
  }, []);

  // Filter locations
  useEffect(() => {
    let filtered = locations;

    if (searchTerm) {
      filtered = filtered.filter(loc => 
        loc.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedGem !== 'all') {
      filtered = filtered.filter(loc => loc.gem === selectedGem);
    }

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(loc => loc.country === selectedCountry);
    }

    setFilteredLocations(filtered);
  }, [locations, searchTerm, selectedGem, selectedCountry]);

  const loadLocations = async () => {
    try {
      const response = await fetch('/api/gems');
      const data = await response.json();
      const locationsWithIds = data.points.map((point: any, index: number) => ({
        ...point,
        id: `loc_${index + 1}`
      }));
      setLocations(locationsWithIds);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setFormData({ site: '', country: '', gem: '', lat: '', lon: '' });
    setIsDialogOpen(true);
  };

  const handleEditLocation = (location: GemLocation) => {
    setEditingLocation(location);
    setFormData({
      site: location.site,
      country: location.country,
      gem: location.gem,
      lat: location.lat.toString(),
      lon: location.lon.toString()
    });
    setIsDialogOpen(true);
  };

  const handleSaveLocation = async () => {
    try {
      const locationData = {
        site: formData.site,
        country: formData.country,
        gem: formData.gem,
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon)
      };

      if (editingLocation) {
        // Update existing location
        const response = await fetch('/api/admin/locations', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingLocation.id, ...locationData })
        });
        
        if (response.ok) {
          await loadLocations();
        }
      } else {
        // Add new location
        const response = await fetch('/api/admin/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(locationData)
        });
        
        if (response.ok) {
          await loadLocations();
        }
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    if (confirm('Sind Sie sicher, dass Sie diesen Fundort löschen möchten?')) {
      try {
        const response = await fetch('/api/admin/locations', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        
        if (response.ok) {
          await loadLocations();
        }
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  const getUniqueCountries = () => {
    const countries = [...new Set(locations.map(loc => loc.country))];
    return countries.sort();
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Lade Fundorte...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text animate-glow mb-2">
            Fundort-Verwaltung
          </h1>
          <p className="text-muted-foreground">
            Verwalten Sie Edelstein-Fundorte weltweit
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Suche</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Fundort oder Land suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="gem-filter">Edelstein-Typ</Label>
                <Select value={selectedGem} onValueChange={setSelectedGem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Edelsteine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Edelsteine</SelectItem>
                    {GEM_TYPES.map(gem => (
                      <SelectItem key={gem} value={gem}>{gem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="country-filter">Land</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alle Länder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Länder</SelectItem>
                    {getUniqueCountries().map(country => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={handleAddLocation} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Neuer Fundort
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredLocations.length} von {locations.length} Fundorten
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{location.site}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {location.country}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditLocation(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteLocation(location.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs">
                    {location.gem}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredLocations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keine Fundorte gefunden</h3>
              <p className="text-muted-foreground">
                Versuchen Sie andere Suchkriterien oder fügen Sie einen neuen Fundort hinzu.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? 'Fundort bearbeiten' : 'Neuer Fundort'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="site">Fundort</Label>
                <Input
                  id="site"
                  value={formData.site}
                  onChange={(e) => setFormData(prev => ({ ...prev, site: e.target.value }))}
                  placeholder="z.B. Mogok Valley"
                />
              </div>
              
              <div>
                <Label htmlFor="country">Land</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="z.B. Myanmar"
                />
              </div>
              
              <div>
                <Label htmlFor="gem">Edelstein-Typ</Label>
                <Select value={formData.gem} onValueChange={(value) => setFormData(prev => ({ ...prev, gem: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Edelstein auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {GEM_TYPES.map(gem => (
                      <SelectItem key={gem} value={gem}>{gem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lat">Breitengrad</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.0001"
                    value={formData.lat}
                    onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                    placeholder="z.B. 22.9167"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lon">Längengrad</Label>
                  <Input
                    id="lon"
                    type="number"
                    step="0.0001"
                    value={formData.lon}
                    onChange={(e) => setFormData(prev => ({ ...prev, lon: e.target.value }))}
                    placeholder="z.B. 96.5167"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveLocation} className="flex-1">
                  {editingLocation ? 'Aktualisieren' : 'Hinzufügen'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Abbrechen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
