'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminCard from '@/components/admin/AdminCard';
import { 
  Save, 
  Eye, 
  Upload, 
  Image as ImageIcon,
  Type,
  Settings
} from 'lucide-react';

export default function HomepageAdmin() {
  const [heroData, setHeroData] = useState({
    title: 'Exklusive Edelsteine',
    subtitle: 'Handverlesene Edelsteine von höchster Qualität aus aller Welt. Entdecken Sie die Schönheit der Natur in ihrer reinsten Form.',
    primaryButtonText: 'Jetzt entdecken',
    primaryButtonLink: '/de/shop',
    secondaryButtonText: 'Mehr erfahren',
    secondaryButtonLink: '/de/about',
    backgroundImage: '/images/hero-background.jpg',
    backgroundColor: 'from-slate-900 via-slate-800 to-slate-900',
  });

  const [featuresData, setFeaturesData] = useState([
    { id: '1', title: 'Höchste Qualität', icon: 'Sparkles', color: 'blue-400', description: 'Jeder Edelstein wird von Experten handverlesen und zertifiziert, um höchste Qualität zu gewährleisten.' },
    { id: '2', title: 'Sichere Zahlung', icon: 'Shield', color: 'green-400', description: 'Wir bieten SSL-verschlüsselte und sichere Zahlungsabwicklung für ein sorgenfreies Einkaufserlebnis.' },
    { id: '3', title: 'Schnelle Lieferung', icon: 'Truck', color: 'purple-400', description: 'Profitieren Sie von schnellem und kostenlosem Versand innerhalb Deutschlands für alle Bestellungen.' },
  ]);

  const handleSave = () => {
    console.log('Hero-Daten gespeichert:', heroData);
    console.log('Features-Daten gespeichert:', featuresData);
    // Hier würde die Logik zum Speichern in einer Datenbank oder einem CMS implementiert
  };

  const handlePreview = () => {
    window.open('/de', '_blank');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Hier würde normalerweise der Upload zur Cloud/Server stattfinden
      // Für Demo-Zwecke simulieren wir einen Upload
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setHeroData({...heroData, backgroundImage: imageUrl});
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Startseite verwalten"
        description="Bearbeiten Sie den Inhalt Ihrer Startseite"
        actions={
          <>
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Vorschau
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Speichern
            </Button>
          </>
        }
      />

      {/* Hero Section */}
      <AdminCard title="Hero-Sektion">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Titel</Label>
              <Input
                id="title"
                value={heroData.title}
                onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                placeholder="Haupttitel der Hero-Sektion"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-sm font-medium">Untertitel</Label>
              <Textarea
                id="subtitle"
                value={heroData.subtitle}
                onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})}
                placeholder="Beschreibungstext"
                rows={3}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primaryButton" className="text-sm font-medium">Primärer Button</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  id="primaryButton"
                  value={heroData.primaryButtonText}
                  onChange={(e) => setHeroData({...heroData, primaryButtonText: e.target.value})}
                  placeholder="Button-Text"
                />
                <Input
                  value={heroData.primaryButtonLink}
                  onChange={(e) => setHeroData({...heroData, primaryButtonLink: e.target.value})}
                  placeholder="/de/shop"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryButton" className="text-sm font-medium">Sekundärer Button</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  id="secondaryButton"
                  value={heroData.secondaryButtonText}
                  onChange={(e) => setHeroData({...heroData, secondaryButtonText: e.target.value})}
                  placeholder="Button-Text"
                />
                <Input
                  value={heroData.secondaryButtonLink}
                  onChange={(e) => setHeroData({...heroData, secondaryButtonLink: e.target.value})}
                  placeholder="/de/about"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="backgroundImage" className="text-sm font-medium">Hintergrundbild</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundImage"
                  value={heroData.backgroundImage}
                  onChange={(e) => setHeroData({...heroData, backgroundImage: e.target.value})}
                  placeholder="/path/to/image.jpg"
                  className="flex-1"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="imageUpload"
                  />
                  <Button variant="outline" size="sm" className="shrink-0" asChild>
                    <label htmlFor="imageUpload" className="cursor-pointer">
                      <Upload className="w-4 h-4" />
                    </label>
                  </Button>
                </div>
              </div>
              {/* Bildvorschau */}
              {heroData.backgroundImage && (
                <div className="mt-2">
                  <Label className="text-sm font-medium">Vorschau:</Label>
                  <div className="mt-1">
                    <img
                      src={heroData.backgroundImage}
                      alt="Hintergrundbild Vorschau"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="backgroundColor" className="text-sm font-medium">Hintergrundfarbe</Label>
              <Input
                id="backgroundColor"
                value={heroData.backgroundColor}
                onChange={(e) => setHeroData({...heroData, backgroundColor: e.target.value})}
                placeholder="from-slate-900 via-slate-800 to-slate-900"
                className="w-full"
              />
            </div>
          </div>
      </AdminCard>

      {/* Features Section */}
      <AdminCard title="Features-Sektion">
          <div className="space-y-6">
            {featuresData.map((feature, index) => (
              <div key={feature.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 lg:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-base">Feature {index + 1}</h3>
                  <Button variant="outline" size="sm">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Titel</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...featuresData];
                        newFeatures[index].title = e.target.value;
                        setFeaturesData(newFeatures);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Icon</Label>
                    <Input
                      value={feature.icon}
                      onChange={(e) => {
                        const newFeatures = [...featuresData];
                        newFeatures[index].icon = e.target.value;
                        setFeaturesData(newFeatures);
                      }}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Farbe</Label>
                    <Input
                      value={feature.color}
                      onChange={(e) => {
                        const newFeatures = [...featuresData];
                        newFeatures[index].color = e.target.value;
                        setFeaturesData(newFeatures);
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Beschreibung</Label>
                  <Textarea
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...featuresData];
                      newFeatures[index].description = e.target.value;
                      setFeaturesData(newFeatures);
                    }}
                    rows={2}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
      </AdminCard>
    </div>
  );
}
