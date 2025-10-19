'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Palette, 
  Save, 
  Eye, 
  Undo, 
  Redo,
  Type,
  Image as ImageIcon,
  Layout,
  Color,
  Font
} from 'lucide-react';

interface DesignSettings {
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  logo: string;
  favicon: string;
  heroBackground: string;
  footerBackground: string;
  customCSS: string;
}

interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export default function DesignAdmin() {
  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    theme: 'dark',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#10B981',
    fontFamily: 'Inter',
    fontSize: 16,
    logo: '/fulllogo_transparent_nobuffer.png',
    favicon: '/favicon.ico',
    heroBackground: '/images/hero-background.jpg',
    footerBackground: '#1F2937',
    customCSS: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const colorSchemes: ColorScheme[] = [
    {
      name: 'Standard',
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981'
    },
    {
      name: 'Warm',
      primary: '#F59E0B',
      secondary: '#EF4444',
      accent: '#EC4899'
    },
    {
      name: 'Cool',
      primary: '#06B6D4',
      secondary: '#3B82F6',
      accent: '#8B5CF6'
    },
    {
      name: 'Nature',
      primary: '#10B981',
      secondary: '#059669',
      accent: '#84CC16'
    }
  ];

  const fontFamilies = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Georgia',
    'Times New Roman'
  ];

  useEffect(() => {
    fetchDesignSettings();
  }, []);

  const fetchDesignSettings = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Design-Einstellungen gespeichert:', designSettings);
    setSaving(false);
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handleApplyColorScheme = (scheme: ColorScheme) => {
    setDesignSettings({
      ...designSettings,
      primaryColor: scheme.primary,
      secondaryColor: scheme.secondary,
      accentColor: scheme.accent
    });
  };

  const handleReset = () => {
    setDesignSettings({
      theme: 'dark',
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      accentColor: '#10B981',
      fontFamily: 'Inter',
      fontSize: 16,
      logo: '/fulllogo_transparent_nobuffer.png',
      favicon: '/favicon.ico',
      heroBackground: '/images/hero-background.jpg',
      footerBackground: '#1F2937',
      customCSS: ''
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Design verwalten"
          description="Lade Design-Einstellungen..."
        />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <AdminCard key={i} title="">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </AdminCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Design verwalten"
        description="Passen Sie das Aussehen Ihrer Website an."
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              {previewMode ? 'Vorschau beenden' : 'Vorschau'}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <Undo className="w-4 h-4 mr-2" />
              Zurücksetzen
            </Button>
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Speichere...' : 'Speichern'}
            </Button>
          </div>
        }
      />

      {/* Color Schemes */}
      <AdminCard title="Farbschemata">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {colorSchemes.map((scheme, index) => (
            <div 
              key={index}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => handleApplyColorScheme(scheme)}
            >
              <h3 className="font-medium mb-3">{scheme.name}</h3>
              <div className="flex space-x-2">
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: scheme.primary }}
                  title="Primärfarbe"
                ></div>
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: scheme.secondary }}
                  title="Sekundärfarbe"
                ></div>
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: scheme.accent }}
                  title="Akzentfarbe"
                ></div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Color Settings */}
      <AdminCard title="Farben">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="primaryColor">Primärfarbe</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="primaryColor"
                type="color"
                value={designSettings.primaryColor}
                onChange={(e) => setDesignSettings({...designSettings, primaryColor: e.target.value})}
                className="w-16 h-10 p-1"
              />
              <Input
                value={designSettings.primaryColor}
                onChange={(e) => setDesignSettings({...designSettings, primaryColor: e.target.value})}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="secondaryColor">Sekundärfarbe</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="secondaryColor"
                type="color"
                value={designSettings.secondaryColor}
                onChange={(e) => setDesignSettings({...designSettings, secondaryColor: e.target.value})}
                className="w-16 h-10 p-1"
              />
              <Input
                value={designSettings.secondaryColor}
                onChange={(e) => setDesignSettings({...designSettings, secondaryColor: e.target.value})}
                placeholder="#8B5CF6"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="accentColor">Akzentfarbe</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="accentColor"
                type="color"
                value={designSettings.accentColor}
                onChange={(e) => setDesignSettings({...designSettings, accentColor: e.target.value})}
                className="w-16 h-10 p-1"
              />
              <Input
                value={designSettings.accentColor}
                onChange={(e) => setDesignSettings({...designSettings, accentColor: e.target.value})}
                placeholder="#10B981"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Typography */}
      <AdminCard title="Typografie">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fontFamily">Schriftart</Label>
            <select
              id="fontFamily"
              value={designSettings.fontFamily}
              onChange={(e) => setDesignSettings({...designSettings, fontFamily: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 mt-1"
            >
              {fontFamilies.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="fontSize">Schriftgröße (px)</Label>
            <Input
              id="fontSize"
              type="number"
              value={designSettings.fontSize}
              onChange={(e) => setDesignSettings({...designSettings, fontSize: parseInt(e.target.value)})}
              min="12"
              max="24"
              className="mt-1"
            />
          </div>
        </div>
      </AdminCard>

      {/* Theme Settings */}
      <AdminCard title="Theme">
        <div className="space-y-4">
          <div>
            <Label htmlFor="theme">Standard-Theme</Label>
            <select
              id="theme"
              value={designSettings.theme}
              onChange={(e) => setDesignSettings({...designSettings, theme: e.target.value as any})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 mt-1"
            >
              <option value="light">Hell</option>
              <option value="dark">Dunkel</option>
              <option value="auto">Automatisch</option>
            </select>
          </div>
        </div>
      </AdminCard>

      {/* Media Assets */}
      <AdminCard title="Medien-Assets">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="logo">Logo</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="logo"
                value={designSettings.logo}
                onChange={(e) => setDesignSettings({...designSettings, logo: e.target.value})}
                placeholder="/path/to/logo.png"
                className="flex-1"
              />
              <Button variant="outline" size="sm">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
            {designSettings.logo && (
              <div className="mt-2">
                <img src={designSettings.logo} alt="Logo" className="h-16 object-contain" />
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="favicon">Favicon</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="favicon"
                value={designSettings.favicon}
                onChange={(e) => setDesignSettings({...designSettings, favicon: e.target.value})}
                placeholder="/path/to/favicon.ico"
                className="flex-1"
              />
              <Button variant="outline" size="sm">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="heroBackground">Hero-Hintergrund</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="heroBackground"
                value={designSettings.heroBackground}
                onChange={(e) => setDesignSettings({...designSettings, heroBackground: e.target.value})}
                placeholder="/path/to/hero-bg.jpg"
                className="flex-1"
              />
              <Button variant="outline" size="sm">
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="footerBackground">Footer-Hintergrund</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="footerBackground"
                type="color"
                value={designSettings.footerBackground}
                onChange={(e) => setDesignSettings({...designSettings, footerBackground: e.target.value})}
                className="w-16 h-10 p-1"
              />
              <Input
                value={designSettings.footerBackground}
                onChange={(e) => setDesignSettings({...designSettings, footerBackground: e.target.value})}
                placeholder="#1F2937"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Custom CSS */}
      <AdminCard title="Benutzerdefiniertes CSS">
        <div>
          <Label htmlFor="customCSS">CSS-Code</Label>
          <Textarea
            id="customCSS"
            value={designSettings.customCSS}
            onChange={(e) => setDesignSettings({...designSettings, customCSS: e.target.value})}
            placeholder="/* Ihr benutzerdefiniertes CSS hier */"
            rows={8}
            className="mt-1 font-mono text-sm"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Fügen Sie hier benutzerdefiniertes CSS hinzu, um das Design weiter anzupassen.
          </p>
        </div>
      </AdminCard>

      {/* Preview */}
      {previewMode && (
        <AdminCard title="Vorschau">
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-2" style={{ color: designSettings.primaryColor }}>
                Beispiel-Überschrift
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Dies ist ein Beispieltext, um die Schriftart und -größe zu demonstrieren.
              </p>
              <div className="flex space-x-2">
                <div 
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: designSettings.primaryColor }}
                >
                  Primärer Button
                </div>
                <div 
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: designSettings.secondaryColor }}
                >
                  Sekundärer Button
                </div>
                <div 
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: designSettings.accentColor }}
                >
                  Akzent Button
                </div>
              </div>
            </div>
          </div>
        </AdminCard>
      )}
    </div>
  );
}