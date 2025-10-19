'use client';

import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Save, 
  Eye, 
  Palette,
  Type,
  Image as ImageIcon,
  Layout,
  Color,
  Font
} from 'lucide-react';

export default function DesignAdmin() {
  const [colorScheme, setColorScheme] = useState({
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    background: '#000000',
    text: '#FFFFFF',
    muted: '#6B7280'
  });

  const [typography, setTypography] = useState({
    headingFont: 'system-ui',
    bodyFont: 'system-ui',
    headingSize: '2.5rem',
    bodySize: '1rem',
    lineHeight: '1.6'
  });

  const [layout, setLayout] = useState({
    containerWidth: '1280px',
    headerHeight: '80px',
    footerHeight: '200px',
    sidebarWidth: '256px',
    borderRadius: '8px',
    spacing: '1rem'
  });

  const [theme, setTheme] = useState({
    darkMode: true,
    animations: true,
    shadows: true,
    gradients: true
  });

  const handleSave = () => {
    console.log('Design-Einstellungen gespeichert:', {
      colorScheme,
      typography,
      layout,
      theme
    });
    // Hier würde die Logik zum Speichern in einer Datenbank implementiert
  };

  const handlePreview = () => {
    window.open('/de', '_blank');
  };

  const handleReset = () => {
    if (confirm('Sind Sie sicher, dass Sie alle Design-Einstellungen zurücksetzen möchten?')) {
      setColorScheme({
        primary: '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981',
        background: '#000000',
        text: '#FFFFFF',
        muted: '#6B7280'
      });
      setTypography({
        headingFont: 'system-ui',
        bodyFont: 'system-ui',
        headingSize: '2.5rem',
        bodySize: '1rem',
        lineHeight: '1.6'
      });
      setLayout({
        containerWidth: '1280px',
        headerHeight: '80px',
        footerHeight: '200px',
        sidebarWidth: '256px',
        borderRadius: '8px',
        spacing: '1rem'
      });
      setTheme({
        darkMode: true,
        animations: true,
        shadows: true,
        gradients: true
      });
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Design verwalten"
        description="Passen Sie das Aussehen und Verhalten Ihrer Website an."
        actions={
          <>
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Vorschau
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Zurücksetzen
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Speichern
            </Button>
          </>
        }
      />

      {/* Color Scheme */}
      <AdminCard title="Farbschema">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="primary" className="text-sm font-medium">Primärfarbe</Label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                id="primary"
                type="color"
                value={colorScheme.primary}
                onChange={(e) => setColorScheme({...colorScheme, primary: e.target.value})}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={colorScheme.primary}
                onChange={(e) => setColorScheme({...colorScheme, primary: e.target.value})}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="secondary" className="text-sm font-medium">Sekundärfarbe</Label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                id="secondary"
                type="color"
                value={colorScheme.secondary}
                onChange={(e) => setColorScheme({...colorScheme, secondary: e.target.value})}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={colorScheme.secondary}
                onChange={(e) => setColorScheme({...colorScheme, secondary: e.target.value})}
                placeholder="#8B5CF6"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="accent" className="text-sm font-medium">Akzentfarbe</Label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                id="accent"
                type="color"
                value={colorScheme.accent}
                onChange={(e) => setColorScheme({...colorScheme, accent: e.target.value})}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={colorScheme.accent}
                onChange={(e) => setColorScheme({...colorScheme, accent: e.target.value})}
                placeholder="#10B981"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="background" className="text-sm font-medium">Hintergrund</Label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                id="background"
                type="color"
                value={colorScheme.background}
                onChange={(e) => setColorScheme({...colorScheme, background: e.target.value})}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={colorScheme.background}
                onChange={(e) => setColorScheme({...colorScheme, background: e.target.value})}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="text" className="text-sm font-medium">Textfarbe</Label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                id="text"
                type="color"
                value={colorScheme.text}
                onChange={(e) => setColorScheme({...colorScheme, text: e.target.value})}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={colorScheme.text}
                onChange={(e) => setColorScheme({...colorScheme, text: e.target.value})}
                placeholder="#FFFFFF"
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="muted" className="text-sm font-medium">Gedämpfte Farbe</Label>
            <div className="flex items-center space-x-2 mt-1">
              <input
                id="muted"
                type="color"
                value={colorScheme.muted}
                onChange={(e) => setColorScheme({...colorScheme, muted: e.target.value})}
                className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <Input
                value={colorScheme.muted}
                onChange={(e) => setColorScheme({...colorScheme, muted: e.target.value})}
                placeholder="#6B7280"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Typography */}
      <AdminCard title="Typografie">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="headingFont" className="text-sm font-medium">Überschrift-Schriftart</Label>
              <select
                id="headingFont"
                value={typography.headingFont}
                onChange={(e) => setTypography({...typography, headingFont: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm mt-1"
              >
                <option value="system-ui">System UI</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="bodyFont" className="text-sm font-medium">Text-Schriftart</Label>
              <select
                id="bodyFont"
                value={typography.bodyFont}
                onChange={(e) => setTypography({...typography, bodyFont: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm mt-1"
              >
                <option value="system-ui">System UI</option>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="headingSize" className="text-sm font-medium">Überschrift-Größe</Label>
              <Input
                id="headingSize"
                value={typography.headingSize}
                onChange={(e) => setTypography({...typography, headingSize: e.target.value})}
                placeholder="2.5rem"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="bodySize" className="text-sm font-medium">Text-Größe</Label>
              <Input
                id="bodySize"
                value={typography.bodySize}
                onChange={(e) => setTypography({...typography, bodySize: e.target.value})}
                placeholder="1rem"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="lineHeight" className="text-sm font-medium">Zeilenhöhe</Label>
              <Input
                id="lineHeight"
                value={typography.lineHeight}
                onChange={(e) => setTypography({...typography, lineHeight: e.target.value})}
                placeholder="1.6"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Layout */}
      <AdminCard title="Layout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="containerWidth" className="text-sm font-medium">Container-Breite</Label>
            <Input
              id="containerWidth"
              value={layout.containerWidth}
              onChange={(e) => setLayout({...layout, containerWidth: e.target.value})}
              placeholder="1280px"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="headerHeight" className="text-sm font-medium">Header-Höhe</Label>
            <Input
              id="headerHeight"
              value={layout.headerHeight}
              onChange={(e) => setLayout({...layout, headerHeight: e.target.value})}
              placeholder="80px"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="footerHeight" className="text-sm font-medium">Footer-Höhe</Label>
            <Input
              id="footerHeight"
              value={layout.footerHeight}
              onChange={(e) => setLayout({...layout, footerHeight: e.target.value})}
              placeholder="200px"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="sidebarWidth" className="text-sm font-medium">Sidebar-Breite</Label>
            <Input
              id="sidebarWidth"
              value={layout.sidebarWidth}
              onChange={(e) => setLayout({...layout, sidebarWidth: e.target.value})}
              placeholder="256px"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="borderRadius" className="text-sm font-medium">Border-Radius</Label>
            <Input
              id="borderRadius"
              value={layout.borderRadius}
              onChange={(e) => setLayout({...layout, borderRadius: e.target.value})}
              placeholder="8px"
              className="w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="spacing" className="text-sm font-medium">Abstand</Label>
            <Input
              id="spacing"
              value={layout.spacing}
              onChange={(e) => setLayout({...layout, spacing: e.target.value})}
              placeholder="1rem"
              className="w-full"
            />
          </div>
        </div>
      </AdminCard>

      {/* Theme Settings */}
      <AdminCard title="Theme-Einstellungen">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Dunkler Modus</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dunkles Design für bessere Benutzerfreundlichkeit
              </p>
            </div>
            <Switch
              checked={theme.darkMode}
              onCheckedChange={(checked) => setTheme({...theme, darkMode: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Animationen</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Smooth Transitions und Hover-Effekte
              </p>
            </div>
            <Switch
              checked={theme.animations}
              onCheckedChange={(checked) => setTheme({...theme, animations: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Schatten</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Box-Shadows für Tiefe und Dimension
              </p>
            </div>
            <Switch
              checked={theme.shadows}
              onCheckedChange={(checked) => setTheme({...theme, shadows: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Gradienten</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Farbverläufe für moderne Optik
              </p>
            </div>
            <Switch
              checked={theme.gradients}
              onCheckedChange={(checked) => setTheme({...theme, gradients: checked})}
            />
          </div>
        </div>
      </AdminCard>

      {/* Preview */}
      <AdminCard title="Design-Vorschau">
        <div className="space-y-4">
          <div 
            className="p-6 rounded-lg border"
            style={{
              backgroundColor: colorScheme.background,
              color: colorScheme.text,
              borderRadius: layout.borderRadius
            }}
          >
            <h3 
              className="text-2xl font-bold mb-4"
              style={{
                fontFamily: typography.headingFont,
                fontSize: typography.headingSize,
                color: colorScheme.primary
              }}
            >
              Beispiel-Überschrift
            </h3>
            <p 
              className="mb-4"
              style={{
                fontFamily: typography.bodyFont,
                fontSize: typography.bodySize,
                lineHeight: typography.lineHeight,
                color: colorScheme.text
              }}
            >
              Dies ist ein Beispieltext, der zeigt, wie Ihre Website mit den aktuellen Design-Einstellungen aussehen wird.
            </p>
            <div className="flex space-x-4">
              <button 
                className="px-4 py-2 rounded text-white font-medium"
                style={{
                  backgroundColor: colorScheme.primary,
                  borderRadius: layout.borderRadius
                }}
              >
                Primärer Button
              </button>
              <button 
                className="px-4 py-2 rounded font-medium border"
                style={{
                  backgroundColor: 'transparent',
                  color: colorScheme.secondary,
                  borderColor: colorScheme.secondary,
                  borderRadius: layout.borderRadius
                }}
              >
                Sekundärer Button
              </button>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
