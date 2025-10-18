'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Plus, 
  Trash2, 
  Link, 
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe,
  Settings
} from 'lucide-react';

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

interface FooterLink {
  id: string;
  text: string;
  url: string;
  icon?: string;
}

interface FooterData {
  companyInfo: {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  sections: FooterSection[];
  copyright: string;
  legalLinks: FooterLink[];
}

const initialFooterData: FooterData = {
  companyInfo: {
    name: 'Gemilike',
    description: 'Ihr Spezialist für rohe und geschliffene Edelsteine. Entdecken Sie unsere einzigartige Sammlung von hochwertigen Steinen.',
    address: 'Musterstraße 123, 12345 Musterstadt',
    phone: '+49 123 456 789',
    email: 'info@gemilike.com'
  },
  socialMedia: {
    facebook: 'https://facebook.com/gemilike',
    instagram: 'https://instagram.com/gemilike',
    twitter: 'https://twitter.com/gemilike',
    youtube: 'https://youtube.com/gemilike',
    website: 'https://gemilike.com'
  },
  sections: [
    {
      id: '1',
      title: 'Shop',
      links: [
        { id: '1', text: 'Alle Edelsteine', url: '/shop' },
        { id: '2', text: 'Rohsteine', url: '/shop/raw' },
        { id: '3', text: 'Geschliffene Steine', url: '/shop/cut' },
        { id: '4', text: 'Neue Artikel', url: '/shop/new' }
      ]
    },
    {
      id: '2',
      title: 'Service',
      links: [
        { id: '5', text: 'Versand & Lieferung', url: '/shipping' },
        { id: '6', text: 'Rückgabe', url: '/returns' },
        { id: '7', text: 'Beratung', url: '/consultation' },
        { id: '8', text: 'Zertifikate', url: '/certificates' }
      ]
    },
    {
      id: '3',
      title: 'Unternehmen',
      links: [
        { id: '9', text: 'Über uns', url: '/about' },
        { id: '10', text: 'Kontakt', url: '/contact' },
        { id: '11', text: 'Impressum', url: '/imprint' },
        { id: '12', text: 'Datenschutz', url: '/privacy' }
      ]
    }
  ],
  copyright: '© 2024 Gemilike. Alle Rechte vorbehalten.',
  legalLinks: [
    { id: '13', text: 'Impressum', url: '/imprint' },
    { id: '14', text: 'Datenschutz', url: '/privacy' },
    { id: '15', text: 'AGB', url: '/terms' },
    { id: '16', text: 'Widerruf', url: '/cancellation' }
  ]
};

export default function FooterManagement() {
  const [footerData, setFooterData] = useState<FooterData>(initialFooterData);
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newLink, setNewLink] = useState({ text: '', url: '' });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const tabs = [
    { id: 'company', name: 'Unternehmensdaten', icon: Settings },
    { id: 'social', name: 'Social Media', icon: Facebook },
    { id: 'sections', name: 'Footer-Bereiche', icon: Link },
    { id: 'legal', name: 'Rechtliches', icon: Globe }
  ];

  // Lade Daten beim Komponenten-Mount
  React.useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      // Lade Footer-Daten
      const footerResponse = await fetch('/api/admin/footer');
      let footerData = initialFooterData;
      if (footerResponse.ok) {
        const data = await footerResponse.json();
        footerData = data;
      }

      // Lade zentrale Kontaktdaten
      const contactResponse = await fetch('/api/admin/contact-data');
      if (contactResponse.ok) {
        const contactData = await contactResponse.json();
        setFooterData(prev => ({
          ...prev,
          companyInfo: {
            ...prev.companyInfo,
            name: contactData.companyName || prev.companyInfo.name,
            phone: contactData.phone || prev.companyInfo.phone,
            email: contactData.email || prev.companyInfo.email,
            address: contactData.address || prev.companyInfo.address
          }
        }));
      } else {
        setFooterData(footerData);
      }
    } catch (error) {
      console.error('Error loading footer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(footerData),
      });

      if (response.ok) {
        // Erfolgreich gespeichert
        setSaveStatus('success');
        // Trigger footer update event
        window.dispatchEvent(new CustomEvent('footer-data-updated'));
        
        // Reset status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('Failed to save footer data');
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error saving footer data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddLink = (sectionId: string) => {
    if (!newLink.text || !newLink.url) return;
    
    setFooterData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              links: [...section.links, {
                id: Date.now().toString(),
                text: newLink.text,
                url: newLink.url
              }]
            }
          : section
      )
    }));
    setNewLink({ text: '', url: '' });
  };

  const handleRemoveLink = (sectionId: string, linkId: string) => {
    setFooterData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId 
          ? {
              ...section,
              links: section.links.filter(link => link.id !== linkId)
            }
          : section
      )
    }));
  };

  const handleAddSection = () => {
    const newSection: FooterSection = {
      id: Date.now().toString(),
      title: 'Neuer Bereich',
      links: []
    };
    
    setFooterData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const handleRemoveSection = (sectionId: string) => {
    setFooterData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Footer-Verwaltung</h1>
          <p className="text-muted-foreground">Lade Daten...</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Footer-Verwaltung</h1>
        <p className="text-muted-foreground">Verwalten Sie Footer-Inhalte und Links</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Footer-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id}
                  className="relative px-6 py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-gray-500/50 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-md"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="company" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Unternehmensdaten</h3>
              <button
                onClick={() => {/* Hier können Sie eine Funktion für zusätzliche Bereiche hinzufügen */}}
                className="bg-gray-500/50 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Bereiche hinzufügen</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Firmenname
                </Label>
                <Input
                  type="text"
                  value={footerData.companyInfo.name}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, name: e.target.value }
                  }))}
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">
                  E-Mail
                </Label>
                <Input
                  type="email"
                  value={footerData.companyInfo.email}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, email: e.target.value }
                  }))}
                          className="w-full"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">
                  Telefon
                </Label>
                <Input
                  type="tel"
                  value={footerData.companyInfo.phone}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, phone: e.target.value }
                  }))}
                          className="w-full"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">
                  Adresse
                </Label>
                <Input
                  type="text"
                  value={footerData.companyInfo.address}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, address: e.target.value }
                  }))}
                          className="w-full"
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2">
                Beschreibung
              </Label>
              <textarea
                value={footerData.companyInfo.description}
                onChange={(e) => setFooterData(prev => ({
                  ...prev,
                  companyInfo: { ...prev.companyInfo, description: e.target.value }
                }))}
                rows={3}
                          className="w-full"
              />
            </div>
            </TabsContent>

            <TabsContent value="social" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Social Media Links</h3>
              <button
                onClick={() => {/* Hier können Sie eine Funktion für zusätzliche Social Media Bereiche hinzufügen */}}
                className="bg-gray-500/50 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Bereiche hinzufügen</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Facebook className="w-5 h-5 text-blue-600" />
                <Input
                  type="url"
                  placeholder="Facebook URL"
                  value={footerData.socialMedia.facebook || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                  }))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-3">
                <Instagram className="w-5 h-5 text-pink-600" />
                <Input
                  type="url"
                  placeholder="Instagram URL"
                  value={footerData.socialMedia.instagram || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                  }))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-3">
                <Twitter className="w-5 h-5 text-blue-400" />
                <Input
                  type="url"
                  placeholder="Twitter URL"
                  value={footerData.socialMedia.twitter || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                  }))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-3">
                <Youtube className="w-5 h-5 text-red-600" />
                <Input
                  type="url"
                  placeholder="YouTube URL"
                  value={footerData.socialMedia.youtube || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, youtube: e.target.value }
                  }))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            </TabsContent>

            <TabsContent value="sections" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Footer-Bereiche</h3>
              <button
                onClick={handleAddSection}
                className="bg-gray-500/50 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Bereich hinzufügen</span>
              </button>
            </div>

            <div className="space-y-4">
              {footerData.sections.map((section) => (
                <div key={section.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Input
                      type="text"
                      value={section.title}
                      onChange={(e) => setFooterData(prev => ({
                        ...prev,
                        sections: prev.sections.map(s => 
                          s.id === section.id ? { ...s, title: e.target.value } : s
                        )
                      }))}
                      className="text-lg font-bold border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                    />
                    <button
                      onClick={() => handleRemoveSection(section.id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {section.links.map((link) => (
                      <div key={link.id} className="flex items-center space-x-3">
                        <Input
                          type="text"
                          value={link.text}
                          onChange={(e) => setFooterData(prev => ({
                            ...prev,
                            sections: prev.sections.map(s => 
                              s.id === section.id 
                                ? {
                                    ...s,
                                    links: s.links.map(l => 
                                      l.id === link.id ? { ...l, text: e.target.value } : l
                                    )
                                  }
                                : s
                            )
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Input
                          type="url"
                          value={link.url}
                          onChange={(e) => setFooterData(prev => ({
                            ...prev,
                            sections: prev.sections.map(s => 
                              s.id === section.id 
                                ? {
                                    ...s,
                                    links: s.links.map(l => 
                                      l.id === link.id ? { ...l, url: e.target.value } : l
                                    )
                                  }
                                : s
                            )
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleRemoveLink(section.id, link.id)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
                      <Input
                        type="text"
                        placeholder="Link-Text"
                        value={newLink.text}
                        onChange={(e) => setNewLink(prev => ({ ...prev, text: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Input
                        type="url"
                        placeholder="URL"
                        value={newLink.url}
                        onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => handleAddLink(section.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </TabsContent>

            <TabsContent value="legal" className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Rechtliche Links</h3>
              <button
                onClick={() => {/* Hier können Sie eine Funktion für zusätzliche rechtliche Bereiche hinzufügen */}}
                className="bg-gray-500/50 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Bereiche hinzufügen</span>
              </button>
            </div>
            
            <div>
              <Label className="block text-sm font-medium mb-2">
                Copyright-Text
              </Label>
              <Input
                type="text"
                value={footerData.copyright}
                onChange={(e) => setFooterData(prev => ({ ...prev, copyright: e.target.value }))}
                          className="w-full"
              />
            </div>

            <div>
              <Label className="block text-sm font-medium mb-2">
                Rechtliche Links
              </Label>
              <div className="space-y-3">
                {footerData.legalLinks.map((link) => (
                  <div key={link.id} className="flex items-center space-x-3">
                    <Input
                      type="text"
                      value={link.text}
                      onChange={(e) => setFooterData(prev => ({
                        ...prev,
                        legalLinks: prev.legalLinks.map(l => 
                          l.id === link.id ? { ...l, text: e.target.value } : l
                        )
                      }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Input
                      type="url"
                      value={link.url}
                      onChange={(e) => setFooterData(prev => ({
                        ...prev,
                        legalLinks: prev.legalLinks.map(l => 
                          l.id === link.id ? { ...l, url: e.target.value } : l
                        )
                      }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setFooterData(prev => ({
                        ...prev,
                        legalLinks: prev.legalLinks.filter(l => l.id !== link.id)
                      }))}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Speicher-Button */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            saveStatus === 'success' 
              ? 'bg-gray-500/50 text-white' 
              : saveStatus === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-gray-500/50 text-white hover:bg-gray-500/70'
          }`}
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Speichern...' : 
           saveStatus === 'success' ? 'Erfolgreich gespeichert!' :
           saveStatus === 'error' ? 'Fehler beim Speichern' :
           'Alle Änderungen speichern'}
        </button>
        
        {saveStatus === 'success' && (
          <p className="text-gray-600 text-sm">
            ✓ Footer wurde erfolgreich aktualisiert
          </p>
        )}
        
        {saveStatus === 'error' && (
          <p className="text-red-600 text-sm">
            ✗ Fehler beim Speichern der Footer-Daten
          </p>
        )}
      </div>
    </div>
  );
}
