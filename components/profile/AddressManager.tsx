'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Plus, Edit, Trash2, Star, StarOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Address {
  id: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const countries = [
  'Deutschland', 'Österreich', 'Schweiz', 'Frankreich', 'Italien', 'Spanien',
  'Niederlande', 'Belgien', 'Luxemburg', 'Dänemark', 'Schweden', 'Norwegen',
  'Finnland', 'Polen', 'Tschechien', 'Ungarn', 'Slowakei', 'Slowenien',
  'Kroatien', 'Rumänien', 'Bulgarien', 'Griechenland', 'Zypern', 'Malta',
  'Irland', 'Vereinigtes Königreich', 'Vereinigte Staaten', 'Kanada', 'Australien',
  'Neuseeland', 'Japan', 'Südkorea', 'China', 'Indien', 'Brasilien', 'Argentinien',
  'Chile', 'Mexiko', 'Südafrika', 'Ägypten', 'Marokko', 'Türkei', 'Russland',
  'Ukraine', 'Weißrussland', 'Estland', 'Lettland', 'Litauen'
];

export default function AddressManager() {
  const t = useTranslations('profile');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    type: 'shipping',
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Deutschland',
    phone: '',
    isDefault: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await fetch('/api/addresses');
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingAddress ? `/api/addresses/${editingAddress.id}` : '/api/addresses';
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadAddresses();
        setIsDialogOpen(false);
        setEditingAddress(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Sind Sie sicher, dass Sie diese Adresse löschen möchten?')) {
      try {
        const response = await fetch(`/api/addresses/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await loadAddresses();
        }
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/addresses/${id}/default`, {
        method: 'PUT',
      });

      if (response.ok) {
        await loadAddresses();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'shipping',
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Deutschland',
      phone: '',
      isDefault: false,
    });
  };

  const openNewAddressDialog = () => {
    setEditingAddress(null);
    resetForm();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Lädt Adressen...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Meine Adressen</h2>
          <p className="text-muted-foreground">
            Verwalten Sie Ihre Rechnungs- und Lieferadressen
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewAddressDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Neue Adresse
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Adresse bearbeiten' : 'Neue Adresse hinzufügen'}
              </DialogTitle>
              <DialogDescription>
                {editingAddress 
                  ? 'Bearbeiten Sie die Adressdaten' 
                  : 'Fügen Sie eine neue Adresse hinzu'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Adresstyp</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'billing' | 'shipping') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="billing">Rechnungsadresse</SelectItem>
                      <SelectItem value="shipping">Lieferadresse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Land</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Firma (optional)</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address1">Straße und Hausnummer *</Label>
                <Input
                  id="address1"
                  value={formData.address1}
                  onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address2">Adresszusatz (optional)</Label>
                <Input
                  id="address2"
                  value={formData.address2}
                  onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">PLZ *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Stadt *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Bundesland/Region</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefonnummer</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+49 123 456789"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isDefault">Als Standard-Adresse festlegen</Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingAddress ? 'Adresse aktualisieren' : 'Adresse hinzufügen'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Abbrechen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Noch keine Adressen</h3>
              <p className="text-muted-foreground mb-4">
                Fügen Sie Ihre erste Adresse hinzu, um schneller bestellen zu können.
              </p>
              <Button onClick={openNewAddressDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Erste Adresse hinzufügen
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? 'ring-2 ring-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <CardTitle className="text-lg">
                      {address.firstName} {address.lastName}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {address.isDefault && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Standard
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {address.type === 'billing' ? 'Rechnung' : 'Lieferung'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  {address.company && (
                    <div className="font-medium">{address.company}</div>
                  )}
                  <div>{address.address1}</div>
                  {address.address2 && <div>{address.address2}</div>}
                  <div>{address.postalCode} {address.city}</div>
                  {address.state && <div>{address.state}</div>}
                  <div>{address.country}</div>
                  {address.phone && (
                    <div className="text-muted-foreground mt-2">
                      📞 {address.phone}
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Bearbeiten
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Standard
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Löschen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
