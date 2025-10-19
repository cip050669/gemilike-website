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
  TestTube, 
  Mail,
  Server,
  Shield,
  Send
} from 'lucide-react';

export default function EmailSettingsAdmin() {
  const [smtpSettings, setSmtpSettings] = useState({
    host: 'smtp.strato.de',
    port: '465',
    secure: true,
    user: '',
    pass: '',
    from: 'info@gemilike.com',
    replyTo: 'noreply@gemilike.com'
  });

  const [emailTemplates, setEmailTemplates] = useState({
    contactSubject: 'Vielen Dank für Ihre Nachricht - Gemilike',
    contactBody: 'Hallo {{name}},\n\nvielen Dank für Ihre Nachricht. Wir werden uns schnellstmöglich bei Ihnen melden.\n\nMit freundlichen Grüßen\nIhr Gemilike Team',
    orderSubject: 'Bestellbestätigung - {{orderNumber}}',
    orderBody: 'Hallo {{customerName}},\n\nvielen Dank für Ihre Bestellung #{{orderNumber}}.\n\nBestellübersicht:\n{{orderItems}}\n\nGesamtbetrag: {{total}}\n\nWir werden Ihre Bestellung schnellstmöglich bearbeiten.\n\nMit freundlichen Grüßen\nIhr Gemilike Team',
    newsletterSubject: 'Willkommen bei unserem Newsletter!',
    newsletterBody: 'Hallo {{name}},\n\nvielen Dank für Ihr Abonnement unseres Newsletters. Sie erhalten ab sofort regelmäßig Informationen über unsere neuesten Edelsteine und Angebote.\n\nMit freundlichen Grüßen\nIhr Gemilike Team'
  });

  const [emailSettings, setEmailSettings] = useState({
    enableContactEmails: true,
    enableOrderEmails: true,
    enableNewsletterEmails: true,
    enableAdminNotifications: true,
    adminEmail: 'admin@gemilike.com'
  });

  const handleSave = () => {
    console.log('SMTP-Einstellungen gespeichert:', smtpSettings);
    console.log('E-Mail-Templates gespeichert:', emailTemplates);
    console.log('E-Mail-Einstellungen gespeichert:', emailSettings);
    // Hier würde die Logik zum Speichern in einer Datenbank implementiert
  };

  const handleTestConnection = async () => {
    try {
      const response = await fetch('/api/email/test');
      const result = await response.json();
      
      if (result.success) {
        alert('SMTP-Verbindung erfolgreich getestet!');
      } else {
        alert(`SMTP-Test fehlgeschlagen: ${result.message}`);
      }
    } catch (error) {
      alert('Fehler beim Testen der SMTP-Verbindung');
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader
        title="E-Mail-Einstellungen"
        description="Konfigurieren Sie SMTP-Server, Templates und E-Mail-Benachrichtigungen."
        actions={
          <>
            <Button variant="outline" onClick={handleTestConnection}>
              <TestTube className="w-4 h-4 mr-2" />
              Verbindung testen
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Speichern
            </Button>
          </>
        }
      />

      {/* SMTP Settings */}
      <AdminCard title="SMTP-Server Konfiguration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="host" className="text-sm font-medium">SMTP-Host</Label>
              <Input
                id="host"
                value={smtpSettings.host}
                onChange={(e) => setSmtpSettings({...smtpSettings, host: e.target.value})}
                placeholder="smtp.strato.de"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="port" className="text-sm font-medium">Port</Label>
              <Input
                id="port"
                type="number"
                value={smtpSettings.port}
                onChange={(e) => setSmtpSettings({...smtpSettings, port: e.target.value})}
                placeholder="465"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="user" className="text-sm font-medium">Benutzername</Label>
              <Input
                id="user"
                type="email"
                value={smtpSettings.user}
                onChange={(e) => setSmtpSettings({...smtpSettings, user: e.target.value})}
                placeholder="ihre-email@domain.com"
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="pass" className="text-sm font-medium">Passwort</Label>
              <Input
                id="pass"
                type="password"
                value={smtpSettings.pass}
                onChange={(e) => setSmtpSettings({...smtpSettings, pass: e.target.value})}
                placeholder="Ihr E-Mail-Passwort"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="from" className="text-sm font-medium">Absender-E-Mail</Label>
              <Input
                id="from"
                type="email"
                value={smtpSettings.from}
                onChange={(e) => setSmtpSettings({...smtpSettings, from: e.target.value})}
                placeholder="info@gemilike.com"
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="replyTo" className="text-sm font-medium">Antwort-E-Mail</Label>
              <Input
                id="replyTo"
                type="email"
                value={smtpSettings.replyTo}
                onChange={(e) => setSmtpSettings({...smtpSettings, replyTo: e.target.value})}
                placeholder="noreply@gemilike.com"
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-2">
          <Switch
            id="secure"
            checked={smtpSettings.secure}
            onCheckedChange={(checked) => setSmtpSettings({...smtpSettings, secure: checked})}
          />
          <Label htmlFor="secure" className="text-sm font-medium">
            SSL/TLS Verschlüsselung verwenden
          </Label>
        </div>
      </AdminCard>

      {/* Email Settings */}
      <AdminCard title="E-Mail-Benachrichtigungen">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Kontaktformular-E-Mails</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatische Bestätigungs-E-Mails an Kunden senden
              </p>
            </div>
            <Switch
              checked={emailSettings.enableContactEmails}
              onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableContactEmails: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Bestellbestätigungen</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Automatische E-Mails bei neuen Bestellungen
              </p>
            </div>
            <Switch
              checked={emailSettings.enableOrderEmails}
              onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableOrderEmails: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Newsletter-Anmeldungen</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Willkommens-E-Mails für Newsletter-Abonnenten
              </p>
            </div>
            <Switch
              checked={emailSettings.enableNewsletterEmails}
              onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableNewsletterEmails: checked})}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Admin-Benachrichtigungen</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                E-Mail-Benachrichtigungen an Administratoren
              </p>
            </div>
            <Switch
              checked={emailSettings.enableAdminNotifications}
              onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableAdminNotifications: checked})}
            />
          </div>
          
          <div>
            <Label htmlFor="adminEmail" className="text-sm font-medium">Admin-E-Mail-Adresse</Label>
            <Input
              id="adminEmail"
              type="email"
              value={emailSettings.adminEmail}
              onChange={(e) => setEmailSettings({...emailSettings, adminEmail: e.target.value})}
              placeholder="admin@gemilike.com"
              className="w-full mt-1"
            />
          </div>
        </div>
      </AdminCard>

      {/* Email Templates */}
      <AdminCard title="E-Mail-Templates">
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Kontaktformular-Template</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contactSubject" className="text-sm font-medium">Betreff</Label>
                <Input
                  id="contactSubject"
                  value={emailTemplates.contactSubject}
                  onChange={(e) => setEmailTemplates({...emailTemplates, contactSubject: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="contactBody" className="text-sm font-medium">Nachricht</Label>
                <Textarea
                  id="contactBody"
                  value={emailTemplates.contactBody}
                  onChange={(e) => setEmailTemplates({...emailTemplates, contactBody: e.target.value})}
                  rows={6}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Bestellbestätigung-Template</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="orderSubject" className="text-sm font-medium">Betreff</Label>
                <Input
                  id="orderSubject"
                  value={emailTemplates.orderSubject}
                  onChange={(e) => setEmailTemplates({...emailTemplates, orderSubject: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="orderBody" className="text-sm font-medium">Nachricht</Label>
                <Textarea
                  id="orderBody"
                  value={emailTemplates.orderBody}
                  onChange={(e) => setEmailTemplates({...emailTemplates, orderBody: e.target.value})}
                  rows={8}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Newsletter-Template</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newsletterSubject" className="text-sm font-medium">Betreff</Label>
                <Input
                  id="newsletterSubject"
                  value={emailTemplates.newsletterSubject}
                  onChange={(e) => setEmailTemplates({...emailTemplates, newsletterSubject: e.target.value})}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="newsletterBody" className="text-sm font-medium">Nachricht</Label>
                <Textarea
                  id="newsletterBody"
                  value={emailTemplates.newsletterBody}
                  onChange={(e) => setEmailTemplates({...emailTemplates, newsletterBody: e.target.value})}
                  rows={6}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
