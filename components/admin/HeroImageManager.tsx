'use client';

import { useState, useEffect } from 'react';
import { AdminButton } from './AdminButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Save, Eye, RotateCcw } from 'lucide-react';
import Image from 'next/image';

interface HeroImageSettings {
  imageUrl: string;
  title: string;
  titleLine2: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonLink: string;
}

const INITIAL_SETTINGS: HeroImageSettings = {
  imageUrl: '/uploads/hero/hero-default.jpg',
  title: 'Einfach nur Gemilike',
  titleLine2: 'Heroes in Gems',
  subtitle: 'Ihr Spezialist für rohe und geschliffene Edelsteine.',
  primaryButtonText: 'Sortiment entdecken',
  secondaryButtonText: 'Kontaktieren Sie uns',
  primaryButtonLink: '/shop',
  secondaryButtonLink: '/contact',
};

export function HeroImageManager() {
  const [settings, setSettings] = useState<HeroImageSettings>(INITIAL_SETTINGS);

  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Lade gespeicherte Einstellungen beim Mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/hero-settings');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data.success && data.settings) {
          const apiSettings = data.settings as {
            title?: string;
            titleLine2?: string;
            subtitle?: string;
            backgroundImage?: string;
            ctaText?: string;
            ctaLink?: string;
            secondaryCtaText?: string;
            secondaryCtaLink?: string;
          };
          return {
            imageUrl: apiSettings.backgroundImage ?? INITIAL_SETTINGS.imageUrl,
            title: apiSettings.title ?? INITIAL_SETTINGS.title,
            titleLine2: apiSettings.titleLine2 ?? INITIAL_SETTINGS.titleLine2,
            subtitle: apiSettings.subtitle ?? INITIAL_SETTINGS.subtitle,
            primaryButtonText: apiSettings.ctaText ?? INITIAL_SETTINGS.primaryButtonText,
            primaryButtonLink: apiSettings.ctaLink ?? INITIAL_SETTINGS.primaryButtonLink,
            secondaryButtonText:
              apiSettings.secondaryCtaText ?? INITIAL_SETTINGS.secondaryButtonText,
            secondaryButtonLink:
              apiSettings.secondaryCtaLink ?? INITIAL_SETTINGS.secondaryButtonLink,
          };
        }
      } catch {
        const saved = localStorage.getItem('heroImageSettings');
        if (saved) {
          try {
            return JSON.parse(saved) as HeroImageSettings;
          } catch {
            return null;
          }
        }
      }
      return null;
    };

    const initialize = async () => {
      const settingsFromServer = await loadSettings();
      const nextSettings = settingsFromServer
        ? { ...INITIAL_SETTINGS, ...settingsFromServer }
        : INITIAL_SETTINGS;

      setSettings(nextSettings);
      localStorage.setItem('heroImageSettings', JSON.stringify(nextSettings));
    };

    initialize();

    const handleSettingsUpdate = async () => {
      const updated = await loadSettings();
      if (updated) {
        const merged = { ...INITIAL_SETTINGS, ...updated };
        setSettings(merged);
        localStorage.setItem('heroImageSettings', JSON.stringify(merged));
      }
    };

    window.addEventListener('hero-settings-updated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('hero-settings-updated', handleSettingsUpdate);
    };
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Speichere über API
      const response = await fetch('/api/admin/hero-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: settings.title,
          titleLine2: settings.titleLine2,
          subtitle: settings.subtitle,
          backgroundImage: settings.imageUrl,
          ctaText: settings.primaryButtonText,
          ctaLink: settings.primaryButtonLink,
          secondaryCtaText: settings.secondaryButtonText,
          secondaryCtaLink: settings.secondaryButtonLink,
        }),
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      // Auch in localStorage für Fallback
      localStorage.setItem('heroImageSettings', JSON.stringify(settings));
      
      // Trigger Event für Live-Update
      window.dispatchEvent(new CustomEvent('hero-settings-updated'));
      
      alert('Hero-Bild-Einstellungen erfolgreich gespeichert!');
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern der Einstellungen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings(INITIAL_SETTINGS);
    localStorage.setItem('heroImageSettings', JSON.stringify(INITIAL_SETTINGS));
    fetch('/api/admin/hero-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: INITIAL_SETTINGS.title,
        titleLine2: INITIAL_SETTINGS.titleLine2,
        subtitle: INITIAL_SETTINGS.subtitle,
        backgroundImage: INITIAL_SETTINGS.imageUrl,
        ctaText: INITIAL_SETTINGS.primaryButtonText,
        ctaLink: INITIAL_SETTINGS.primaryButtonLink,
        secondaryCtaText: INITIAL_SETTINGS.secondaryButtonText,
        secondaryCtaLink: INITIAL_SETTINGS.secondaryButtonLink,
      }),
    })
      .then(() => {
        window.dispatchEvent(new CustomEvent('hero-settings-updated'));
      })
      .catch((error) => {
        console.error('Fehler beim Zurücksetzen über API:', error);
      });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Bitte wählen Sie eine Bilddatei aus.');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Die Datei ist zu groß. Maximale Größe: 5MB');
          return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/hero-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload fehlgeschlagen');
        }

        const result = await response.json();
        const newSettings = { ...settings, imageUrl: result.imageUrl };
        setSettings(newSettings);

        await fetch('/api/admin/hero-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: newSettings.title,
            titleLine2: newSettings.titleLine2,
            subtitle: newSettings.subtitle,
            backgroundImage: newSettings.imageUrl,
            ctaText: newSettings.primaryButtonText,
            ctaLink: newSettings.primaryButtonLink,
            secondaryCtaText: newSettings.secondaryButtonText,
            secondaryCtaLink: newSettings.secondaryButtonLink,
          }),
        });
        localStorage.setItem('heroImageSettings', JSON.stringify(newSettings));
        window.dispatchEvent(new CustomEvent('hero-settings-updated'));

        alert('Bild erfolgreich hochgeladen!');
      } catch (error) {
        console.error('Upload error:', error);
        alert(`Fehler beim Hochladen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Hero-Bild Verwaltung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bild-Upload */}
          <div className="space-y-2">
            <Label htmlFor="hero-image">Hero-Bild</Label>
            <div className="flex items-center gap-4">
              <Input
                id="hero-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
                disabled={isLoading}
              />
              <AdminButton
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {previewMode ? 'Vorschau ausblenden' : 'Vorschau anzeigen'}
              </AdminButton>
            </div>
          </div>

          {/* Aktuelles Bild anzeigen */}
          <div className="space-y-2">
            <Label>Aktuelles Bild</Label>
            <div className="relative w-full h-64 border rounded-lg overflow-hidden">
              <Image
                src={settings.imageUrl}
                alt="Hero-Bild Vorschau"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Bild-URL Input */}
          <div className="space-y-2">
            <Label htmlFor="image-url">Bild-URL (oder Pfad zu Produktbild)</Label>
            <Input
              id="image-url"
              value={settings.imageUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="/products/emerald-001-1.jpg"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Einfach nur Gemilike"
            />
          </div>

          {/* Title line 2 */}
          <div className="space-y-2">
            <Label htmlFor="titleLine2">Title line 2</Label>
            <Input
              id="titleLine2"
              value={settings.titleLine2}
              onChange={(e) => setSettings(prev => ({ ...prev, titleLine2: e.target.value }))}
              placeholder="Heroes in Gems"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <textarea
              id="subtitle"
              value={settings.subtitle}
              onChange={(e) => setSettings(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Your specialist for rough and cut gemstones..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Primary button */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-text">Primary Button Text</Label>
              <Input
                id="primary-text"
                value={settings.primaryButtonText}
                onChange={(e) => setSettings(prev => ({ ...prev, primaryButtonText: e.target.value }))}
                placeholder="Sortiment entdecken"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-link">Primary Button Link</Label>
              <Input
                id="primary-link"
                value={settings.primaryButtonLink}
                onChange={(e) => setSettings(prev => ({ ...prev, primaryButtonLink: e.target.value }))}
                placeholder="/de/services"
              />
            </div>
          </div>

          {/* Secondary button */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="secondary-text">Secondary Button Text</Label>
              <Input
                id="secondary-text"
                value={settings.secondaryButtonText}
                onChange={(e) => setSettings(prev => ({ ...prev, secondaryButtonText: e.target.value }))}
                placeholder="Kontaktieren Sie uns"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-link">Secondary Button Link</Label>
              <Input
                id="secondary-link"
                value={settings.secondaryButtonLink}
                onChange={(e) => setSettings(prev => ({ ...prev, secondaryButtonLink: e.target.value }))}
                placeholder="/de/contact"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <AdminButton
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Speichern...' : 'Einstellungen speichern'}
            </AdminButton>
            <AdminButton
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Zurücksetzen
            </AdminButton>
          </div>
        </CardContent>
      </Card>

      {/* Live-Vorschau */}
      {previewMode && (
        <Card>
          <CardHeader>
            <CardTitle>Live-Vorschau</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 w-full overflow-hidden border rounded-lg">
              <Image
                src={settings.imageUrl}
                alt="Hero-Bild Vorschau"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gray-800/50/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    {settings.title}
                  </h1>
                  <p className="text-lg mb-8 max-w-2xl opacity-90">
                    {settings.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <AdminButton className="bg-gray-800/30 text-black hover:bg-gray-100">
                      {settings.primaryButtonText}
                    </AdminButton>
                    <AdminButton variant="outline" className="border-white text-white hover:bg-gray-800/30 hover:text-black">
                      {settings.secondaryButtonText}
                    </AdminButton>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
