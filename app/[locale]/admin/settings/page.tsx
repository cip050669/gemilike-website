'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { HeroImageManager } from '@/components/admin/HeroImageManager';
import { ColorManager } from '@/components/admin/ColorManager';
import { StorySectionManager } from '@/components/admin/StorySectionManager';
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  Bell, 
  Palette,
  Save,
  RefreshCw,
  Image,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminSettingsPage() {
  const t = useTranslations();
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.strato.de',
    smtpPort: '587',
    smtpUser: 'info@gemilike.com',
    smtpPassword: '',
    emailNotifications: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Load current settings from environment or localStorage
    const savedSettings = localStorage.getItem('emailSettings');
    if (savedSettings) {
      setEmailSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleEmailSettingsChange = (field: string, value: string | boolean) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveEmailSettings = async () => {
    console.log('💾 SAVE EMAIL SETTINGS BUTTON CLICKED');
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('emailSettings', JSON.stringify(emailSettings));
      
      setSaveStatus('success');
      alert('✅ E-Mail-Einstellungen erfolgreich gespeichert!');
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      alert('❌ Fehler beim Speichern der E-Mail-Einstellungen!');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmailSettings = async () => {
    console.log('🧪 TEST EMAIL SETTINGS BUTTON CLICKED');
    setTestStatus('testing');
    
    try {
      // Test SMTP connection
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailSettings),
      });
      
      if (response.ok) {
        setTestStatus('success');
        alert('✅ E-Mail-Einstellungen erfolgreich getestet!');
      } else {
        setTestStatus('error');
        alert('❌ E-Mail-Test fehlgeschlagen!');
      }
    } catch (error) {
      setTestStatus('error');
      alert('❌ Fehler beim Testen der E-Mail-Einstellungen!');
    }
    
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  const handleResetEmailSettings = () => {
    console.log('🔄 RESET EMAIL SETTINGS BUTTON CLICKED');
    setEmailSettings({
      smtpHost: 'smtp.strato.de',
      smtpPort: '587',
      smtpUser: 'info@gemilike.com',
      smtpPassword: '',
      emailNotifications: true
    });
    alert('🔄 E-Mail-Einstellungen zurückgesetzt!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">
          Konfigurieren Sie Ihr Admin-Panel
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Allgemeine Einstellungen
            </CardTitle>
            <CardDescription>
              Grundlegende Systemkonfiguration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Website-Name</Label>
                <Input id="siteName" defaultValue="Gemilike - Heroes in Gems" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin-E-Mail</Label>
                <Input id="adminEmail" type="email" defaultValue="admin@gemilike.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Website-Beschreibung</Label>
              <Textarea 
                id="siteDescription" 
                defaultValue="Ihr Spezialist für rohe und geschliffene Edelsteine"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Lokalisierung
            </CardTitle>
            <CardDescription>
              Sprache und Regionseinstellungen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">Standardsprache</Label>
                <select 
                  id="defaultLanguage" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Zeitzone</Label>
                <select 
                  id="timezone" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Europe/Berlin">Europa/Berlin</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Währung</Label>
              <select 
                id="currency" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="CHF">Schweizer Franken (CHF)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              E-Mail-Einstellungen
            </CardTitle>
            <CardDescription>
              Konfiguration für E-Mail-Versand
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP-Host</Label>
                <Input 
                  id="smtpHost" 
                  value={emailSettings.smtpHost}
                  onChange={(e) => handleEmailSettingsChange('smtpHost', e.target.value)}
                  placeholder="smtp.strato.de"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP-Port</Label>
                <Input 
                  id="smtpPort" 
                  type="number" 
                  value={emailSettings.smtpPort}
                  onChange={(e) => handleEmailSettingsChange('smtpPort', e.target.value)}
                  placeholder="587"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP-Benutzername</Label>
                <Input 
                  id="smtpUser" 
                  type="email" 
                  value={emailSettings.smtpUser}
                  onChange={(e) => handleEmailSettingsChange('smtpUser', e.target.value)}
                  placeholder="info@gemilike.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP-Passwort</Label>
                <Input 
                  id="smtpPassword" 
                  type="password" 
                  value={emailSettings.smtpPassword}
                  onChange={(e) => handleEmailSettingsChange('smtpPassword', e.target.value)}
                  placeholder="Ihr E-Mail-Passwort"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="emailNotifications" 
                checked={emailSettings.emailNotifications}
                onCheckedChange={(checked) => handleEmailSettingsChange('emailNotifications', checked)}
              />
              <Label htmlFor="emailNotifications">E-Mail-Benachrichtigungen aktivieren</Label>
            </div>
            
            {/* Status indicators */}
            <div className="flex items-center gap-4">
              {saveStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Einstellungen gespeichert</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Fehler beim Speichern</span>
                </div>
              )}
              {testStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">E-Mail-Test erfolgreich</span>
                </div>
              )}
              {testStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">E-Mail-Test fehlgeschlagen</span>
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={handleSaveEmailSettings}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Speichere...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    E-Mail-Einstellungen speichern
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={handleTestEmailSettings}
                disabled={testStatus === 'testing'}
              >
                {testStatus === 'testing' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Teste...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    E-Mail testen
                  </>
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={handleResetEmailSettings}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Zurücksetzen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sicherheit
            </CardTitle>
            <CardDescription>
              Sicherheitseinstellungen für das Admin-Panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="twoFactorAuth" />
              <Label htmlFor="twoFactorAuth">Zwei-Faktor-Authentifizierung</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sessionTimeout" defaultChecked />
              <Label htmlFor="sessionTimeout">Automatische Session-Abmeldezeit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auditLogging" defaultChecked />
              <Label htmlFor="auditLogging">Audit-Logging aktivieren</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeoutMinutes">Session-Timeout (Minuten)</Label>
              <Input id="sessionTimeoutMinutes" type="number" defaultValue="60" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Benachrichtigungen
            </CardTitle>
            <CardDescription>
              Konfigurieren Sie Benachrichtigungseinstellungen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="newOrderNotifications" defaultChecked />
              <Label htmlFor="newOrderNotifications">Neue Bestellungen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="lowStockNotifications" defaultChecked />
              <Label htmlFor="lowStockNotifications">Niedriger Lagerbestand</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="customerRegistrationNotifications" />
              <Label htmlFor="customerRegistrationNotifications">Neue Kundenregistrierungen</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="systemMaintenanceNotifications" defaultChecked />
              <Label htmlFor="systemMaintenanceNotifications">System-Wartung</Label>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Hero-Section Verwaltung
            </CardTitle>
            <CardDescription>
              Verwalten Sie das Hero-Bild und die Texte der Startseite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HeroImageManager />
          </CardContent>
        </Card>

        {/* Story Section Management */}
        <StorySectionManager />

        {/* Color Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Farbverwaltung
            </CardTitle>
            <CardDescription>
              Verwalten Sie die verfügbaren Farben für Edelstein-Badges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ColorManager />
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Erscheinungsbild
            </CardTitle>
            <CardDescription>
              Anpassen des Admin-Panel-Designs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Design-Theme</Label>
              <select 
                id="theme" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="dark">Dunkel</option>
                <option value="light">Hell</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="compactMode" />
              <Label htmlFor="compactMode">Kompakter Modus</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sidebarCollapsed" />
              <Label htmlFor="sidebarCollapsed">Sidebar standardmäßig eingeklappt</Label>
            </div>
          </CardContent>
        </Card>

        {/* Save Buttons */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Zurücksetzen
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Einstellungen speichern
          </Button>
        </div>
      </div>
    </div>
  );
}
