'use client';

import { useMemo, useState } from 'react';
import { Country, GemType, Location } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type LocationWithRelations = Location & {
  country: Country;
  gemType: GemType;
};

interface WorldMapAdminProps {
  countries: Country[];
  gemTypes: GemType[];
  locations: LocationWithRelations[];
}

type MineStatus = 'active' | 'inactive' | 'planned';
type MineType = 'open-pit' | 'underground' | 'placer' | 'artisanal' | 'unknown';

const STATUS_OPTIONS: { value: MineStatus; label: string }[] = [
  { value: 'active', label: 'Aktiv' },
  { value: 'inactive', label: 'Inaktiv' },
  { value: 'planned', label: 'Geplant' },
];

const MINE_TYPE_OPTIONS: { value: MineType; label: string }[] = [
  { value: 'open-pit', label: 'Tagebau' },
  { value: 'underground', label: 'Untertage' },
  { value: 'placer', label: 'Seifenlagerstätte' },
  { value: 'artisanal', label: 'Handwerklich' },
  { value: 'unknown', label: 'Unbekannt' },
];

interface LocationFormState {
  id?: string;
  name: string;
  lat: string;
  lng: string;
  description: string;
  mineType: MineType;
  status: MineStatus;
  countryId: string;
  gemTypeId: string;
}

const EMPTY_FORM: LocationFormState = {
  name: '',
  lat: '',
  lng: '',
  description: '',
  mineType: 'unknown',
  status: 'active',
  countryId: '',
  gemTypeId: '',
};

export function WorldMapAdmin({ countries, gemTypes, locations }: WorldMapAdminProps) {
  const [search, setSearch] = useState('');
  const [selectedGemType, setSelectedGemType] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [formState, setFormState] = useState<LocationFormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredLocations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return locations.filter((location) => {
      const matchesSearch =
        !term ||
        location.name.toLowerCase().includes(term) ||
        (location.description ?? '').toLowerCase().includes(term) ||
        location.country.name.toLowerCase().includes(term) ||
        location.gemType.name.toLowerCase().includes(term);

      const matchesGemType = selectedGemType === 'all' || location.gemTypeId === selectedGemType;
      const matchesCountry = selectedCountry === 'all' || location.countryId === selectedCountry;

      return matchesSearch && matchesGemType && matchesCountry;
    });
  }, [locations, search, selectedGemType, selectedCountry]);

  const resetForm = () => {
    setFormState(EMPTY_FORM);
  };

  const handleEdit = (location: LocationWithRelations) => {
    setFormState({
      id: location.id,
      name: location.name,
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      description: location.description ?? '',
      mineType: (location.mineType as MineType) ?? 'unknown',
      status: (location.status as MineStatus) ?? 'active',
      countryId: location.countryId,
      gemTypeId: location.gemTypeId,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        name: formState.name.trim(),
        lat: formState.lat.trim(),
        lng: formState.lng.trim(),
        description: formState.description.trim(),
        mineType: formState.mineType,
        status: formState.status,
        countryId: formState.countryId,
        gemTypeId: formState.gemTypeId,
      };

      const endpoint = formState.id
        ? `/api/admin/worldmap/locations/${formState.id}`
        : '/api/admin/worldmap/locations';

      const method = formState.id ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error((await response.json().catch(() => null))?.error ?? 'Unbekannter Fehler');
      }

      setFeedback({
        type: 'success',
        message: formState.id ? 'Fundort aktualisiert.' : 'Fundort erstellt.',
      });
      resetForm();
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Fehler beim Speichern des Fundorts.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (location: LocationWithRelations) => {
    const confirmed = window.confirm(
      `Fundort „${location.name}“ wirklich löschen?`
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    setFeedback(null);
    try {
      const response = await fetch(`/api/admin/worldmap/locations/${location.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error((await response.json().catch(() => null))?.error ?? 'Unbekannter Fehler');
      }

      setFeedback({ type: 'success', message: 'Fundort gelöscht.' });
      if (formState.id === location.id) {
        resetForm();
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Fehler beim Löschen des Fundorts.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-white/10 bg-gray-800/50/50 p-6 text-white shadow-lg shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full md:max-w-md">
            <Label htmlFor="worldmap-search" className="text-white/70">
              Fundorte durchsuchen
            </Label>
            <Input
              id="worldmap-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Suche nach Name, Land oder Edelstein..."
              className="mt-1 border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="border-white/20 bg-gray-800/50/40 text-white">
                <SelectValue placeholder="Alle Länder" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/50/90 text-white">
                <SelectItem value="all">Alle Länder</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedGemType} onValueChange={setSelectedGemType}>
              <SelectTrigger className="border-white/20 bg-gray-800/50/40 text-white">
                <SelectValue placeholder="Edelstein-Typ" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800/50/90 text-white">
                <SelectItem value="all">Alle Edelstein-Typen</SelectItem>
                {gemTypes.map((gemType) => (
                  <SelectItem key={gemType.id} value={gemType.id}>
                    {gemType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card className="border-white/10 bg-gray-800/50/50 p-6 text-white shadow-lg shadow-black/20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Fundorte</h2>
            <Badge variant="outline" className="border-white/30 text-white">
              {filteredLocations.length} Einträge
            </Badge>
          </div>
          <div className="space-y-4">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className={cn(
                  'rounded-2xl border border-white/10 bg-gray-800/50/40 p-5 transition hover:border-white/30'
                )}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">{location.name}</h3>
                      <Badge variant="outline" className="border-white/20 bg-gray-800/30/10 text-white">
                        {location.gemType.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60">
                      {location.description || 'Keine Beschreibung hinterlegt.'}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-white/50">
                      <span>Land: <span className="text-white/80">{location.country.name}</span></span>
                      <span>Koordinaten: <span className="text-white/80">{location.lat.toFixed(3)}°, {location.lng.toFixed(3)}°</span></span>
                      {location.mineType && (
                        <span>Typ: <span className="text-white/80">{MINE_TYPE_OPTIONS.find((option) => option.value === location.mineType)?.label ?? location.mineType}</span></span>
                      )}
                      {location.status && (
                        <span>Status: <span className="text-white/80">{STATUS_OPTIONS.find((option) => option.value === location.status)?.label ?? location.status}</span></span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-gray-800/30/10"
                      onClick={() => handleEdit(location)}
                      disabled={isSubmitting}
                    >
                      Bearbeiten
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-400/40 text-red-200 hover:bg-red-500/10"
                      onClick={() => handleDelete(location)}
                      disabled={isSubmitting}
                    >
                      Löschen
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredLocations.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/15 bg-gray-800/50/40 p-8 text-center text-sm text-white/50">
                Keine Fundorte gefunden.
              </div>
            )}
          </div>
        </Card>

        <Card className="border-white/10 bg-gray-800/50/50 p-6 text-white shadow-lg shadow-black/20">
          <h2 className="text-lg font-semibold text-white">
            {formState.id ? 'Fundort bearbeiten' : 'Neuen Fundort anlegen'}
          </h2>
          <p className="mb-4 text-sm text-white/60">
            Erfassen Sie Koordinaten, Land und Edelstein-Typ. Die Karte aktualisiert sich nach dem Speichern automatisch.
          </p>

          {feedback && (
            <div
              className={cn(
                'mb-4 rounded-lg border px-3 py-2 text-sm',
                feedback.type === 'success'
                  ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                  : 'border-red-400/40 bg-red-500/10 text-red-200'
              )}
            >
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location-name" className="text-white/70">
                Name *
              </Label>
              <Input
                id="location-name"
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                required
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="location-lat" className="text-white/70">
                  Breitengrad *
                </Label>
                <Input
                  id="location-lat"
                  type="number"
                  step="0.0001"
                  value={formState.lat}
                  onChange={(event) => setFormState((prev) => ({ ...prev, lat: event.target.value }))}
                  required
                  className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
                />
              </div>
              <div>
                <Label htmlFor="location-lng" className="text-white/70">
                  Längengrad *
                </Label>
                <Input
                  id="location-lng"
                  type="number"
                  step="0.0001"
                  value={formState.lng}
                  onChange={(event) => setFormState((prev) => ({ ...prev, lng: event.target.value }))}
                  required
                  className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-country" className="text-white/70">
                Land *
              </Label>
              <Select
                value={formState.countryId}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, countryId: value }))}
                required
              >
                <SelectTrigger className="border-white/20 bg-gray-800/50/40 text-white">
                  <SelectValue placeholder="Land auswählen" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/50/90 text-white">
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-gemType" className="text-white/70">
                Edelstein-Typ *
              </Label>
              <Select
                value={formState.gemTypeId}
                onValueChange={(value) => setFormState((prev) => ({ ...prev, gemTypeId: value }))}
                required
              >
                <SelectTrigger className="border-white/20 bg-gray-800/50/40 text-white">
                  <SelectValue placeholder="Edelstein-Typ auswählen" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800/50/90 text-white">
                  {gemTypes.map((gemType) => (
                    <SelectItem key={gemType.id} value={gemType.id}>
                      {gemType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-description" className="text-white/70">
                Beschreibung
              </Label>
              <Textarea
                id="location-description"
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                rows={4}
                className="border-white/20 bg-gray-800/50/40 text-white placeholder:text-white/40"
                placeholder="Besondere Informationen zum Fundort..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-white/70">Fundort-Typ</Label>
                <Select
                  value={formState.mineType}
                  onValueChange={(value: MineType) =>
                    setFormState((prev) => ({ ...prev, mineType: value }))
                  }
                >
                  <SelectTrigger className="border-white/20 bg-gray-800/50/40 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800/50/90 text-white">
                    {MINE_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={(value: MineStatus) =>
                    setFormState((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="border-white/20 bg-gray-800/50/40 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800/50/90 text-white">
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/80" disabled={isSubmitting}>
                {isSubmitting ? 'Speichern...' : formState.id ? 'Änderungen speichern' : 'Fundort erstellen'}
              </Button>
              {formState.id && (
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-gray-800/30/10"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Abbrechen
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
