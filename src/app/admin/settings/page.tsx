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
  Shield,
  Globe,
  Database,
  Mail,
  Bell,
  Lock,
  Key,
  Server,
  Settings as SettingsIcon
} from 'lucide-react';

export default function SettingsAdmin() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Gemilike',
    siteDescription: 'Exklusive Edelsteine von höchster Qualität',
    siteUrl: 'https://gemilike.com',
    adminEmail: 'admin@gemilike.com',
    timezone: 'Europe/Berlin',
    language: 'de',
    currency: 'EUR'
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordMinLength: '8',
    requireStrongPasswords: true,
    enableAuditLog: true,
    enableIpWhitelist: false,
    allowedIps: ''
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    host: 'localhost',
    port: '5432',
    name: 'gemilike_db',
    user: 'gemilike_user',
    backupEnabled: true,
    backupFrequency: 'daily',
    retentionDays: '30'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    enablePushNotifications: true,
    notifyOnNewOrders: true,
    notifyOnNewCustomers: true,
    notifyOnLowStock: true,
    notifyOnErrors: true
  });

  const handleSave = () => {
    console.log('Einstellungen gespeichert:', {
      generalSettings,
      securitySettings,
      databaseSettings,
      notificationSettings
    });
    // Hier würde die Logik zum Speichern in einer Datenbank implementiert
  };

  const handleReset = () => {
    if (confirm('Sind Sie sicher, dass Sie alle Einstellungen zurücksetzen möchten?')) {
      setGeneralSettings({
        siteName: 'Gemilike',
        siteDescription: 'Exklusive Edelsteine von höchster Qualität',
        siteUrl: 'https://gemilike.com',
        adminEmail: 'admin@gemilike.com',
        timezone: 'Europe/Berlin',
        language: 'de',
        currency: 'EUR'
      });
      setSecuritySettings({
        enableTwoFactor: false,
        sessionTimeout: '30',
        maxLoginAttempts: '5',
        passwordMinLength: '8',
        requireStrongPasswords: true,
        enableAuditLog: true,
        enableIpWhitelist: false,
        allowedIps: ''
      });
      setDatabaseSettings({
        host: 'localhost',
        port: '5432',
        name: 'gemilike_db',
        user: 'gemilike_user',
        backupEnabled: true,
        backupFrequency: 'daily',
        retentionDays: '30'
      });
      setNotificationSettings({
        enableEmailNotifications: true,
        enableSmsNotifications: false,
        enablePushNotifications: true,
        notifyOnNewOrders: true,
        notifyOnNewCustomers: true,
        notifyOnLowStock: true,
        notifyOnErrors: true
      });
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Systemeinstellungen"
        description="Konfigurieren Sie allgemeine Systemeinstellungen, Sicherheit und Benachrichtigungen."
        actions={
          <>
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

      {/* General Settings */}
      <AdminCard title="Allgemeine Einstellungen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="siteName" className="text-sm font-medium">Website-Name</Label>
              <Input
                id="siteName"
                value={generalSettings.siteName}
                onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                placeholder="Gemilike"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="siteDescription" className="text-sm font-medium">Website-Beschreibung</Label>
              <Textarea
                id="siteDescription"
                value={generalSettings.siteDescription}
                onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                placeholder="Exklusive Edelsteine von höchster Qualität"
                rows={3}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="siteUrl" className="text-sm font-medium">Website-URL</Label>
              <Input
                id="siteUrl"
                value={generalSettings.siteUrl}
                onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
                placeholder="https://gemilike.com"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="adminEmail" className="text-sm font-medium">Admin-E-Mail</Label>
              <Input
                id="adminEmail"
                type="email"
                value={generalSettings.adminEmail}
                onChange={(e) => setGeneralSettings({...generalSettings, adminEmail: e.target.value})}
                placeholder="admin@gemilike.com"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="timezone" className="text-sm font-medium">Zeitzone</Label>
              <select
                id="timezone"
                value={generalSettings.timezone}
                onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="Europe/Berlin">Europa/Berlin</option>
                <option value="Europe/London">Europa/London</option>
                <option value="America/New_York">Amerika/New_York</option>
                <option value="Asia/Tokyo">Asien/Tokio</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="language" className="text-sm font-medium">Sprache</Label>
              <select
                id="language"
                value={generalSettings.language}
                onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="de">Deutsch</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="currency" className="text-sm font-medium">Währung</Label>
              <select
                id="currency"
                value={generalSettings.currency}
                onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="CHF">Swiss Franc (CHF)</option>
              </select>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Security Settings */}
      <AdminCard title="Sicherheitseinstellungen">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Zwei-Faktor-Authentifizierung</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Zusätzliche Sicherheit für Admin-Zugang
              </p>
            </div>
            <Switch
              checked={securitySettings.enableTwoFactor}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableTwoFactor: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Audit-Log</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Protokollierung aller Benutzeraktivitäten
              </p>
            </div>
            <Switch
              checked={securitySettings.enableAuditLog}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableAuditLog: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">IP-Whitelist</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Zugang nur von bestimmten IP-Adressen
              </p>
            </div>
            <Switch
              checked={securitySettings.enableIpWhitelist}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enableIpWhitelist: checked})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sessionTimeout" className="text-sm font-medium">Session-Timeout (Minuten)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="maxLoginAttempts" className="text-sm font-medium">Max. Login-Versuche</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={securitySettings.maxLoginAttempts}
                onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: e.target.value})}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="passwordMinLength" className="text-sm font-medium">Min. Passwort-Länge</Label>
              <Input
                id="passwordMinLength"
                type="number"
                value={securitySettings.passwordMinLength}
                onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: e.target.value})}
                className="w-full"
              />
            </div>
          </div>
          
          {securitySettings.enableIpWhitelist && (
            <div>
              <Label htmlFor="allowedIps" className="text-sm font-medium">Erlaubte IP-Adressen</Label>
              <Textarea
                id="allowedIps"
                value={securitySettings.allowedIps}
                onChange={(e) => setSecuritySettings({...securitySettings, allowedIps: e.target.value})}
                placeholder="192.168.1.100&#10;192.168.1.101&#10;10.0.0.0/8"
                rows={4}
                className="w-full"
              />
            </div>
          )}
        </div>
      </AdminCard>

      {/* Database Settings */}
      <AdminCard title="Datenbank-Einstellungen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="dbHost" className="text-sm font-medium">Datenbank-Host</Label>
              <Input
                id="dbHost"
                value={databaseSettings.host}
                onChange={(e) => setDatabaseSettings({...databaseSettings, host: e.target.value})}
                placeholder="localhost"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="dbPort" className="text-sm font-medium">Port</Label>
              <Input
                id="dbPort"
                type="number"
                value={databaseSettings.port}
                onChange={(e) => setDatabaseSettings({...databaseSettings, port: e.target.value})}
                placeholder="5432"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="dbName" className="text-sm font-medium">Datenbank-Name</Label>
              <Input
                id="dbName"
                value={databaseSettings.name}
                onChange={(e) => setDatabaseSettings({...databaseSettings, name: e.target.value})}
                placeholder="gemilike_db"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="dbUser" className="text-sm font-medium">Benutzername</Label>
              <Input
                id="dbUser"
                value={databaseSettings.user}
                onChange={(e) => setDatabaseSettings({...databaseSettings, user: e.target.value})}
                placeholder="gemilike_user"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="backupFrequency" className="text-sm font-medium">Backup-Häufigkeit</Label>
              <select
                id="backupFrequency"
                value={databaseSettings.backupFrequency}
                onChange={(e) => setDatabaseSettings({...databaseSettings, backupFrequency: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="daily">Täglich</option>
                <option value="weekly">Wöchentlich</option>
                <option value="monthly">Monatlich</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="retentionDays" className="text-sm font-medium">Aufbewahrungszeit (Tage)</Label>
              <Input
                id="retentionDays"
                type="number"
                value={databaseSettings.retentionDays}
                onChange={(e) => setDatabaseSettings({...databaseSettings, retentionDays: e.target.value})}
                placeholder="30"
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Automatische Backups</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Regelmäßige Sicherung der Datenbank
            </p>
          </div>
          <Switch
            checked={databaseSettings.backupEnabled}
            onCheckedChange={(checked) => setDatabaseSettings({...databaseSettings, backupEnabled: checked})}
          />
        </div>
      </AdminCard>

      {/* Notification Settings */}
      <AdminCard title="Benachrichtigungseinstellungen">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">E-Mail-Benachrichtigungen</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Benachrichtigungen per E-Mail senden
              </p>
            </div>
            <Switch
              checked={notificationSettings.enableEmailNotifications}
              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enableEmailNotifications: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Push-Benachrichtigungen</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browser-Benachrichtigungen aktivieren
              </p>
            </div>
            <Switch
              checked={notificationSettings.enablePushNotifications}
              onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enablePushNotifications: checked})}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Neue Bestellungen</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bei neuen Bestellungen benachrichtigen
                </p>
              </div>
              <Switch
                checked={notificationSettings.notifyOnNewOrders}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, notifyOnNewOrders: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Neue Kunden</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bei neuen Kundenregistrierungen benachrichtigen
                </p>
              </div>
              <Switch
                checked={notificationSettings.notifyOnNewCustomers}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, notifyOnNewCustomers: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Niedriger Lagerbestand</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bei niedrigem Lagerbestand benachrichtigen
                </p>
              </div>
              <Switch
                checked={notificationSettings.notifyOnLowStock}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, notifyOnLowStock: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Systemfehler</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bei Systemfehlern benachrichtigen
                </p>
              </div>
              <Switch
                checked={notificationSettings.notifyOnErrors}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, notifyOnErrors: checked})}
              />
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
