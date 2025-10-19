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
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Database,
  Server,
  Globe,
  Mail,
  Bell,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface SystemSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  timezone: string;
  language: string;
  currency: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  analyticsEnabled: boolean;
  backupEnabled: boolean;
  securityLogs: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  apiKey: string;
  webhookUrl: string;
}

interface BackupInfo {
  lastBackup: string;
  nextBackup: string;
  size: string;
  status: 'success' | 'failed' | 'pending';
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Gemilike',
    siteDescription: 'Exklusive Edelsteine von höchster Qualität',
    siteUrl: 'https://gemilike.de',
    adminEmail: 'admin@gemilike.de',
    timezone: 'Europe/Berlin',
    language: 'de',
    currency: 'EUR',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    analyticsEnabled: true,
    backupEnabled: true,
    securityLogs: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    apiKey: '••••••••••••••••',
    webhookUrl: ''
  });

  const [backupInfo, setBackupInfo] = useState<BackupInfo>({
    lastBackup: '2024-01-20T02:00:00Z',
    nextBackup: '2024-01-21T02:00:00Z',
    size: '2.4 GB',
    status: 'success'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Systemeinstellungen gespeichert:', settings);
    setSaving(false);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.3; // 70% success rate for demo
    setTestResult({
      success,
      message: success 
        ? 'Verbindung erfolgreich getestet!' 
        : 'Verbindung fehlgeschlagen. Bitte überprüfen Sie Ihre Einstellungen.'
    });
    
    setTesting(false);
  };

  const handleCreateBackup = async () => {
    // Simulate backup creation
    setBackupInfo({
      ...backupInfo,
      status: 'pending'
    });
    
    setTimeout(() => {
      setBackupInfo({
        lastBackup: new Date().toISOString(),
        nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        size: '2.4 GB',
        status: 'success'
      });
    }, 3000);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('de-DE');
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="Systemeinstellungen"
          description="Lade Systemeinstellungen..."
        />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
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
        title="Systemeinstellungen"
        description="Konfigurieren Sie allgemeine Systemeinstellungen und Sicherheitsoptionen."
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {testing ? 'Teste...' : 'Verbindung testen'}
            </Button>
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Speichere...' : 'Speichern'}
            </Button>
          </div>
        }
      />

      {/* Test Result */}
      {testResult && (
        <AdminCard title="">
          <div className={`flex items-center p-4 rounded-lg ${
            testResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            {testResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
            )}
            <span className={testResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
              {testResult.message}
            </span>
          </div>
        </AdminCard>
      )}

      {/* General Settings */}
      <AdminCard title="Allgemeine Einstellungen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="siteName">Website-Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              placeholder="Gemilike"
            />
          </div>
          
          <div>
            <Label htmlFor="siteUrl">Website-URL</Label>
            <Input
              id="siteUrl"
              value={settings.siteUrl}
              onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
              placeholder="https://gemilike.de"
            />
          </div>
          
          <div>
            <Label htmlFor="adminEmail">Admin-E-Mail</Label>
            <Input
              id="adminEmail"
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
              placeholder="admin@gemilike.de"
            />
          </div>
          
          <div>
            <Label htmlFor="timezone">Zeitzone</Label>
            <select
              id="timezone"
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="Europe/Berlin">Europe/Berlin</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="language">Sprache</Label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="currency">Währung</Label>
            <select
              id="currency"
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CHF">CHF (CHF)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <Label htmlFor="siteDescription">Website-Beschreibung</Label>
          <Textarea
            id="siteDescription"
            value={settings.siteDescription}
            onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
            placeholder="Beschreibung Ihrer Website..."
            rows={3}
            className="mt-1"
          />
        </div>
      </AdminCard>

      {/* Feature Toggles */}
      <AdminCard title="Funktionen">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenanceMode">Wartungsmodus</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Website für Besucher sperren
              </p>
            </div>
            <Switch
              id="maintenanceMode"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="registrationEnabled">Registrierung aktiviert</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Neue Benutzer können sich registrieren
              </p>
            </div>
            <Switch
              id="registrationEnabled"
              checked={settings.registrationEnabled}
              onCheckedChange={(checked) => setSettings({...settings, registrationEnabled: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">E-Mail-Benachrichtigungen</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatische E-Mail-Benachrichtigungen senden
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analyticsEnabled">Analytics aktiviert</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Website-Analytics und Tracking
              </p>
            </div>
            <Switch
              id="analyticsEnabled"
              checked={settings.analyticsEnabled}
              onCheckedChange={(checked) => setSettings({...settings, analyticsEnabled: checked})}
            />
          </div>
        </div>
      </AdminCard>

      {/* Security Settings */}
      <AdminCard title="Sicherheit">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sessionTimeout">Session-Timeout (Minuten)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                min="5"
                max="1440"
              />
            </div>
            
            <div>
              <Label htmlFor="maxLoginAttempts">Max. Login-Versuche</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                min="3"
                max="10"
              />
            </div>
            
            <div>
              <Label htmlFor="passwordMinLength">Min. Passwort-Länge</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
                min="6"
                max="32"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="twoFactorAuth">Zwei-Faktor-Authentifizierung</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Zusätzliche Sicherheit für Admin-Zugang
              </p>
            </div>
            <Switch
              id="twoFactorAuth"
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="securityLogs">Sicherheits-Logs</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Alle Sicherheitsereignisse protokollieren
              </p>
            </div>
            <Switch
              id="securityLogs"
              checked={settings.securityLogs}
              onCheckedChange={(checked) => setSettings({...settings, securityLogs: checked})}
            />
          </div>
        </div>
      </AdminCard>

      {/* API Settings */}
      <AdminCard title="API-Einstellungen">
        <div className="space-y-4">
          <div>
            <Label htmlFor="apiKey">API-Schlüssel</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="apiKey"
                value={settings.apiKey}
                onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                type="password"
                className="flex-1"
              />
              <Button variant="outline" size="sm">
                <Key className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="webhookUrl">Webhook-URL</Label>
            <Input
              id="webhookUrl"
              value={settings.webhookUrl}
              onChange={(e) => setSettings({...settings, webhookUrl: e.target.value})}
              placeholder="https://example.com/webhook"
            />
          </div>
        </div>
      </AdminCard>

      {/* Backup Settings */}
      <AdminCard title="Backup-Verwaltung">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Database className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">Letztes Backup</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatTimestamp(backupInfo.lastBackup)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Server className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">Nächstes Backup</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatTimestamp(backupInfo.nextBackup)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Globe className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold">Backup-Größe</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {backupInfo.size}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="backupEnabled">Automatische Backups</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tägliche automatische Backups erstellen
              </p>
            </div>
            <Switch
              id="backupEnabled"
              checked={settings.backupEnabled}
              onCheckedChange={(checked) => setSettings({...settings, backupEnabled: checked})}
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleCreateBackup} disabled={backupInfo.status === 'pending'}>
              <Database className="w-4 h-4 mr-2" />
              {backupInfo.status === 'pending' ? 'Erstelle Backup...' : 'Backup erstellen'}
            </Button>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}