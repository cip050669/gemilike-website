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
  Menu,
  Search,
  ShoppingCart,
  User,
  Heart,
  Globe,
  Phone,
  Settings,
  Navigation,
  Link as LinkIcon,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

interface HeaderData {
  logo: {
    text: string;
    image?: string;
    link: string;
  };
  navigation: {
    items: NavigationItem[];
  };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    openingHours: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  searchSettings: {
    enabled: boolean;
    placeholder: string;
  };
  cartSettings: {
    enabled: boolean;
    showCount: boolean;
  };
  userAccount: {
    enabled: boolean;
    showLogin: boolean;
  };
  wishlist: {
    enabled: boolean;
    showCount: boolean;
  };
}

interface NavigationItem {
  id: string;
  text: string;
  url: string;
  submenu?: NavigationItem[];
  icon?: string;
}

const initialHeaderData: HeaderData = {
  logo: {
    text: 'Gemilike',
    link: '/'
  },
  navigation: {
    items: [
      { id: '1', text: 'Shop', url: '/shop' },
      { id: '2', text: 'Über uns', url: '/about' },
      { id: '3', text: 'Kontakt', url: '/contact' },
      { id: '4', text: 'Blog', url: '/blog' }
    ]
  },
  contactInfo: {
    phone: '+49 123 456 789',
    email: 'info@gemilike.com',
    address: 'Musterstraße 123, 12345 Musterstadt',
    openingHours: 'Mo-Fr: 9:00-18:00, Sa: 10:00-16:00'
  },
  socialMedia: {
    facebook: 'https://facebook.com/gemilike',
    instagram: 'https://instagram.com/gemilike',
    twitter: 'https://twitter.com/gemilike',
    youtube: 'https://youtube.com/gemilike'
  },
  searchSettings: {
    enabled: true,
    placeholder: 'Edelsteine suchen...'
  },
  cartSettings: {
    enabled: true,
    showCount: true
  },
  userAccount: {
    enabled: true,
    showLogin: true
  },
  wishlist: {
    enabled: true,
    showCount: true
  }
};

export default function HeaderManagement() {
  const [headerData, setHeaderData] = useState<HeaderData>(() => ({
    ...initialHeaderData,
    logo: { ...initialHeaderData.logo },
    contactInfo: { ...initialHeaderData.contactInfo },
    socialMedia: { ...initialHeaderData.socialMedia },
    searchSettings: { ...initialHeaderData.searchSettings },
    cartSettings: { ...initialHeaderData.cartSettings },
    userAccount: { ...initialHeaderData.userAccount },
    wishlist: { ...initialHeaderData.wishlist }
  }));
  const [activeTab, setActiveTab] = useState('navigation');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newNavItem, setNewNavItem] = useState({ text: '', url: '' });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const tabs = [
    { id: 'navigation', name: 'Navigation', icon: Navigation },
    { id: 'logo', name: 'Logo & Branding', icon: Globe },
    { id: 'contact', name: 'Kontakt-Info', icon: Phone },
    { id: 'social', name: 'Social Media', icon: LinkIcon },
    { id: 'features', name: 'Header-Features', icon: Settings }
  ];

  // Lade Daten beim Komponenten-Mount
  React.useEffect(() => {
    loadHeaderData();
  }, []);

  const loadHeaderData = async () => {
    try {
      // Lade Header-Daten
      const headerResponse = await fetch('/api/admin/header');
      let headerData = initialHeaderData;
      if (headerResponse.ok) {
        const data = await headerResponse.json();
        headerData = { ...initialHeaderData, ...data };
      }

      // Lade zentrale Kontaktdaten
      const contactResponse = await fetch('/api/admin/contact-data');
      if (contactResponse.ok) {
        const contactData = await contactResponse.json();
        setHeaderData(prev => ({
          ...prev,
          contactInfo: {
            phone: contactData.phone || prev.contactInfo.phone,
            email: contactData.email || prev.contactInfo.email,
            address: contactData.address || prev.contactInfo.address,
            openingHours: contactData.openingHours || prev.contactInfo.openingHours
          }
        }));
      } else {
        setHeaderData(headerData);
      }
    } catch (error) {
      console.error('Error loading header data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/header', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(headerData),
      });

      if (response.ok) {
        // Erfolgreich gespeichert
        setSaveStatus('success');
        // Trigger header update event
        window.dispatchEvent(new CustomEvent('header-data-updated'));
        
        // Reset status after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('Failed to save header data');
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error saving header data:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNavItem = () => {
    if (!newNavItem.text || !newNavItem.url) return;
    
    setHeaderData(prev => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        items: [...prev.navigation.items, {
          id: Date.now().toString(),
          text: newNavItem.text,
          url: newNavItem.url
        }]
      }
    }));
    setNewNavItem({ text: '', url: '' });
  };

  const handleRemoveNavItem = (id: string) => {
    setHeaderData(prev => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        items: prev.navigation.items.filter(item => item.id !== id)
      }
    }));
  };

  const handleUpdateNavItem = (id: string, field: string, value: string) => {
    setHeaderData(prev => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        items: prev.navigation.items.map(item => 
          item.id === id ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Header-Verwaltung</h1>
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
        <h1 className="text-3xl font-bold">Header-Verwaltung</h1>
        <p className="text-muted-foreground">Verwalten Sie Header-Navigation und Einstellungen</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Header-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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

            <TabsContent value="navigation" className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Navigation verwalten</h3>
            
            <div className="space-y-4">
              {headerData.navigation.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 rounded-xl border">
                  <Menu className="w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleUpdateNavItem(item.id, 'text', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleUpdateNavItem(item.id, 'url', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleRemoveNavItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex items-center space-x-4 p-4 rounded-xl border-2 border-dashed border-blue-300">
                <Plus className="w-5 h-5 text-blue-500" />
                <Input
                  type="text"
                  placeholder="Navigation-Text"
                  value={newNavItem.text || ''}
                  onChange={(e) => setNewNavItem(prev => ({ ...prev, text: e.target.value }))}
                  className="flex-1"
                />
                <Input
                  type="url"
                  placeholder="URL"
                  value={newNavItem.url || ''}
                  onChange={(e) => setNewNavItem(prev => ({ ...prev, url: e.target.value }))}
                  className="flex-1"
                />
                <button
                  onClick={handleAddNavItem}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            </TabsContent>

            <TabsContent value="logo" className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold  mb-4">Logo & Branding</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Logo-Text
                </Label>
                <Input
                  type="text"
                  value={headerData.logo.text || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    logo: { ...prev.logo, text: e.target.value }
                  }))}
                          className="w-full"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">
                  Logo-Link
                </Label>
                <Input
                  type="url"
                  value={headerData.logo.link || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    logo: { ...prev.logo, link: e.target.value }
                  }))}
                          className="w-full"
                />
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium  mb-2">
                Logo-Bild (optional)
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors duration-300">
                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="mb-2">Logo-Bild hochladen</p>
                <p className="text-sm">PNG, JPG, SVG bis zu 2MB</p>
              </div>
            </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold  mb-4">Kontakt-Informationen</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-medium mb-2">
                  Telefon
                </Label>
                <Input
                  type="tel"
                  value={headerData.contactInfo.phone || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, phone: e.target.value }
                  }))}
                          className="w-full"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">
                  E-Mail
                </Label>
                <Input
                  type="email"
                  value={headerData.contactInfo.email || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, email: e.target.value }
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
                  value={headerData.contactInfo.address || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, address: e.target.value }
                  }))}
                          className="w-full"
                />
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">
                  Öffnungszeiten
                </Label>
                <Input
                  type="text"
                  value={headerData.contactInfo.openingHours || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    contactInfo: { ...prev.contactInfo, openingHours: e.target.value }
                  }))}
                          className="w-full"
                />
              </div>
            </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold  mb-4">Social Media Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Facebook className="w-5 h-5 text-blue-600" />
                <Input
                  type="url"
                  placeholder="Facebook URL"
                  value={headerData.socialMedia.facebook || ''}
                  onChange={(e) => setHeaderData(prev => ({
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
                  value={headerData.socialMedia.instagram || ''}
                  onChange={(e) => setHeaderData(prev => ({
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
                  value={headerData.socialMedia.twitter || ''}
                  onChange={(e) => setHeaderData(prev => ({
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
                  value={headerData.socialMedia.youtube || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    socialMedia: { ...prev.socialMedia, youtube: e.target.value }
                  }))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold  mb-4">Header-Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Search Settings */}
              <div className="rounded-xl p-6 border">
                <div className="flex items-center space-x-3 mb-4">
                  <Search className="w-5 h-5 text-gray-600" />
                  <h4 className="text-lg font-semibold ">Suchfunktion</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="checkbox"
                      id="searchEnabled"
                      checked={headerData.searchSettings.enabled}
                      onChange={(e) => setHeaderData(prev => ({
                        ...prev,
                        searchSettings: { ...prev.searchSettings, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="searchEnabled" className="text-sm font-medium">
                      Suchfunktion aktivieren
                    </Label>
                  </div>
                  <Input
                    type="text"
                    value={headerData.searchSettings.placeholder || ''}
                    onChange={(e) => setHeaderData(prev => ({
                      ...prev,
                      searchSettings: { ...prev.searchSettings, placeholder: e.target.value }
                    }))}
                    placeholder="Suchfeld-Placeholder"
                  />
                </div>
              </div>

              {/* Cart Settings */}
              <div className="rounded-xl p-6 border">
                <div className="flex items-center space-x-3 mb-4">
                  <ShoppingCart className="w-5 h-5 text-gray-600" />
                  <h4 className="text-lg font-semibold ">Warenkorb</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="checkbox"
                      id="cartEnabled"
                      checked={headerData.cartSettings.enabled}
                      onChange={(e) => setHeaderData(prev => ({
                        ...prev,
                        cartSettings: { ...prev.cartSettings, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="cartEnabled" className="text-sm font-medium">
                      Warenkorb anzeigen
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="checkbox"
                      id="cartCount"
                      checked={headerData.cartSettings.showCount}
                      onChange={(e) => setHeaderData(prev => ({
                        ...prev,
                        cartSettings: { ...prev.cartSettings, showCount: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="cartCount" className="text-sm font-medium">
                      Artikelanzahl anzeigen
                    </Label>
                  </div>
                </div>
              </div>

              {/* User Account */}
              <div className="rounded-xl p-6 border">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <h4 className="text-lg font-semibold ">Benutzerkonto</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="checkbox"
                      id="userEnabled"
                      checked={headerData.userAccount.enabled}
                      onChange={(e) => setHeaderData(prev => ({
                        ...prev,
                        userAccount: { ...prev.userAccount, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="userEnabled" className="text-sm font-medium">
                      Benutzerkonto anzeigen
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="checkbox"
                      id="showLogin"
                      checked={headerData.userAccount.showLogin}
                      onChange={(e) => setHeaderData(prev => ({
                        ...prev,
                        userAccount: { ...prev.userAccount, showLogin: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="showLogin" className="text-sm font-medium">
                      Login-Button anzeigen
                    </Label>
                  </div>
                </div>
              </div>

              {/* Wishlist */}
              <div className="rounded-xl p-6 border">
                <div className="flex items-center space-x-3 mb-4">
                  <Heart className="w-5 h-5 text-gray-600" />
                  <h4 className="text-lg font-semibold ">Wunschliste</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Input
                      type="checkbox"
                      id="wishlistEnabled"
                      checked={headerData.wishlist.enabled}
                      onChange={(e) => setHeaderData(prev => ({
                        ...prev,
                        wishlist: { ...prev.wishlist, enabled: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="wishlistEnabled" className="text-sm font-medium">
                      Wunschliste anzeigen
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="checkbox"
                      id="wishlistCount"
                      checked={headerData.wishlist.showCount}
                      onChange={(e) => setHeaderData(prev => ({
                        ...prev,
                        wishlist: { ...prev.wishlist, showCount: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <Label htmlFor="wishlistCount" className="text-sm font-medium">
                      Anzahl anzeigen
                    </Label>
                  </div>
                </div>
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
            ✓ Header wurde erfolgreich aktualisiert
          </p>
        )}
        
        {saveStatus === 'error' && (
          <p className="text-red-600 text-sm">
            ✗ Fehler beim Speichern der Header-Daten
          </p>
        )}
      </div>
    </div>
  );
}
