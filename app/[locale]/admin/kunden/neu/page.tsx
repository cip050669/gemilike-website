'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Save, 
  ArrowLeft,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText
} from 'lucide-react';

export default function NewCustomerPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    country: 'Deutschland',
    taxId: '',
    notes: '',
    isActive: true
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    if (!formData.address.trim() || !formData.postalCode.trim() || !formData.city.trim()) {
      alert('Bitte geben Sie eine vollständige Adresse an.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/de/admin/kunden');
      } else {
        alert('Fehler beim Erstellen des Kunden: ' + result.error);
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Kunden:', error);
      alert('Fehler beim Erstellen des Kunden');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">Neuer Kunde</h1>
          <p className="text-gray-300 mt-2">Erstellen Sie einen neuen Kunden</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Persönliche Informationen
              </CardTitle>
              <CardDescription>
                Grundlegende Informationen über den Kunden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Vorname *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Max"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nachname *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Mustermann"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">E-Mail-Adresse *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="max.mustermann@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Telefonnummer</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+49 123 456789"
                />
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Unternehmensinformationen
              </CardTitle>
              <CardDescription>
                Optional: Informationen über das Unternehmen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="company">Firmenname</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Musterfirma GmbH"
                />
              </div>
              
              <div>
                <Label htmlFor="taxId">Steuernummer</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  placeholder="12/345/67890"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Adressinformationen
              </CardTitle>
              <CardDescription>
                Vollständige Adresse des Kunden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Straße und Hausnummer *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Musterstraße 123"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="postalCode">PLZ *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Stadt *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Musterstadt"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Land</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Deutschland"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Zusätzliche Informationen
              </CardTitle>
              <CardDescription>
                Notizen und Status des Kunden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Notizen</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Interne Notizen über den Kunden..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked as boolean)}
                />
                <Label htmlFor="isActive">Kunde ist aktiv</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kundenübersicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-white">
                  {formData.company || `${formData.firstName} ${formData.lastName}`}
                </h4>
                {formData.company && (
                  <p className="text-sm text-gray-300">
                    {formData.firstName} {formData.lastName}
                  </p>
                )}
              </div>
              
              {formData.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>{formData.email}</span>
                </div>
              )}
              
              {formData.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>{formData.phone}</span>
                </div>
              )}
              
              {(formData.address || formData.city) && (
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {formData.address && `${formData.address}, `}
                    {formData.postalCode && `${formData.postalCode} `}
                    {formData.city}
                  </span>
                </div>
              )}
              
              <div className="pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-300">
                    {formData.isActive ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button 
              onClick={handleSave} 
              className="w-full"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Speichern...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Kunde erstellen
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="w-full"
            >
              Abbrechen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

