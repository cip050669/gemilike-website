'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';

interface ContactData {
  companyName: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  website: string;
}

const initialContactData: ContactData = {
  companyName: 'Gemilike',
  phone: '+49 123 456 789',
  email: 'info@gemilike.com',
  address: 'Musterstraße 123, 12345 Musterstadt',
  openingHours: 'Mo-Fr: 9:00-18:00, Sa: 10:00-16:00',
  website: 'https://gemilike.com'
};

export default function ContactDataManagement() {
  const [contactData, setContactData] = useState<ContactData>(initialContactData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Lade Daten beim Komponenten-Mount
  React.useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      const response = await fetch('/api/admin/contact-data');
      if (response.ok) {
        const data = await response.json();
        setContactData(data);
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const response = await fetch('/api/admin/contact-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSaveStatus('success');
        // Trigger events to update header and footer
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('contact-data-updated'));
        }
      } else {
        console.error('Save failed:', result);
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('Error saving contact data:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kontaktdaten-Verwaltung</h2>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="gradient-primary text-white shadow-modern hover:shadow-lg transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Wird gespeichert...' : 'Speichern'}
        </Button>
      </div>

      {/* Status Messages */}
      {saveStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          ✓ Kontaktdaten erfolgreich gespeichert!
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          ✗ Fehler beim Speichern der Kontaktdaten
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Unternehmensdaten
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="block text-sm font-medium mb-2">
              Firmenname
            </Label>
            <Input
              type="text"
              value={contactData.companyName}
              onChange={(e) => setContactData(prev => ({
                ...prev,
                companyName: e.target.value
              }))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefon
              </Label>
              <Input
                type="tel"
                value={contactData.phone}
                onChange={(e) => setContactData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                className="w-full"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-Mail
              </Label>
              <Input
                type="email"
                value={contactData.email}
                onChange={(e) => setContactData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Adresse
            </Label>
            <Input
              type="text"
              value={contactData.address}
              onChange={(e) => setContactData(prev => ({
                ...prev,
                address: e.target.value
              }))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Öffnungszeiten
              </Label>
              <Input
                type="text"
                value={contactData.openingHours}
                onChange={(e) => setContactData(prev => ({
                  ...prev,
                  openingHours: e.target.value
                }))}
                className="w-full"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              <Input
                type="url"
                value={contactData.website}
                onChange={(e) => setContactData(prev => ({
                  ...prev,
                  website: e.target.value
                }))}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Hinweis</h3>
        <p className="text-blue-800 text-sm">
          Diese Kontaktdaten werden automatisch in Header und der Kontakt-Seite verwendet. 
          Änderungen werden sofort übernommen.
        </p>
      </div>
    </div>
  );
}
