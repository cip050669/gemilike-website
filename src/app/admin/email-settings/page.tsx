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
  Mail, 
  Send, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Server,
  Key,
  Shield,
  AlertCircle
} from 'lucide-react';

interface EmailConfig {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  fromEmail: string;
  fromName: string;
  replyTo: string;
  adminEmail: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'contact' | 'order' | 'newsletter' | 'welcome';
}

export default function EmailSettingsAdmin() {
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    smtpSecure: false,
    fromEmail: '',
    fromName: 'Gemilike',
    replyTo: '',
    adminEmail: ''
  });

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEmailSettings();
  }, []);

  const fetchEmailSettings = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    setEmailConfig({
      smtpHost: 'smtp.strato.de',
      smtpPort: '587',
      smtpUser: 'info@gemilike.de',
      smtpPass: '••••••••',
      smtpSecure: false,
      fromEmail: 'info@gemilike.de',
      fromName: 'Gemilike',
      replyTo: 'info@gemilike.de',
      adminEmail: 'admin@gemilike.de'
    });

    setTemplates([
      {
        id: '1',
        name: 'Kontaktformular',
        subject: 'Neue Kontaktanfrage von {{name}}',
        content: 'Sie haben eine neue Nachricht erhalten...',
        type: 'contact'
      },
      {
        id: '2',
        name: 'Bestellbestätigung',
        subject: 'Bestellbestätigung #{{orderNumber}}',
        content: 'Vielen Dank für Ihre Bestellung...',
        type: 'order'
      },
      {
        id: '3',
        name: 'Newsletter Willkommen',
        subject: 'Willkommen bei Gemilike!',
        content: 'Herzlich willkommen in unserem Newsletter...',
        type: 'newsletter'
      }
    ]);

    setLoading(false);
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('E-Mail-Konfiguration gespeichert:', emailConfig);
    setSaving(false);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock test result
    const success = Math.random() > 0.3; // 70% success rate for demo
    setTestResult({
      success,
      message: success 
        ? 'SMTP-Verbindung erfolgreich getestet!' 
        : 'SMTP-Verbindung fehlgeschlagen. Bitte überprüfen Sie Ihre Einstellungen.'
    });
    
    setTesting(false);
  };

  const handleSaveTemplate = (template: EmailTemplate) => {
    setTemplates(templates.map(t => t.id === template.id ? template : t));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminHeader
          title="E-Mail-Einstellungen"
          description="Lade E-Mail-Konfiguration..."
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
        title="E-Mail-Einstellungen"
        description="Konfigurieren Sie SMTP-Einstellungen und E-Mail-Templates."
        actions={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
              <TestTube className="w-4 h-4 mr-2" />
              {testing ? 'Teste...' : 'Verbindung testen'}
            </Button>
            <Button onClick={handleSaveConfig} disabled={saving}>
              <Settings className="w-4 h-4 mr-2" />
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
              <XCircle className="w-5 h-5 text-red-500 mr-3" />
            )}
            <span className={testResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
              {testResult.message}
            </span>
          </div>
        </AdminCard>
      )}

      {/* SMTP Configuration */}
      <AdminCard title="SMTP-Konfiguration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="smtpHost">SMTP-Server</Label>
              <div className="relative">
                <Server className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="smtpHost"
                  value={emailConfig.smtpHost}
                  onChange={(e) => setEmailConfig({...emailConfig, smtpHost: e.target.value})}
                  placeholder="smtp.strato.de"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="smtpPort">Port</Label>
              <Input
                id="smtpPort"
                value={emailConfig.smtpPort}
                onChange={(e) => setEmailConfig({...emailConfig, smtpPort: e.target.value})}
                placeholder="587"
              />
            </div>
            
            <div>
              <Label htmlFor="smtpUser">Benutzername</Label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="smtpUser"
                  value={emailConfig.smtpUser}
                  onChange={(e) => setEmailConfig({...emailConfig, smtpUser: e.target.value})}
                  placeholder="info@gemilike.de"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="smtpPass">Passwort</Label>
              <Input
                id="smtpPass"
                type="password"
                value={emailConfig.smtpPass}
                onChange={(e) => setEmailConfig({...emailConfig, smtpPass: e.target.value})}
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="fromEmail">Absender-E-Mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="fromEmail"
                  value={emailConfig.fromEmail}
                  onChange={(e) => setEmailConfig({...emailConfig, fromEmail: e.target.value})}
                  placeholder="info@gemilike.de"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="fromName">Absender-Name</Label>
              <Input
                id="fromName"
                value={emailConfig.fromName}
                onChange={(e) => setEmailConfig({...emailConfig, fromName: e.target.value})}
                placeholder="Gemilike"
              />
            </div>
            
            <div>
              <Label htmlFor="replyTo">Antwort-E-Mail</Label>
              <Input
                id="replyTo"
                value={emailConfig.replyTo}
                onChange={(e) => setEmailConfig({...emailConfig, replyTo: e.target.value})}
                placeholder="info@gemilike.de"
              />
            </div>
            
            <div>
              <Label htmlFor="adminEmail">Admin-E-Mail</Label>
              <Input
                id="adminEmail"
                value={emailConfig.adminEmail}
                onChange={(e) => setEmailConfig({...emailConfig, adminEmail: e.target.value})}
                placeholder="admin@gemilike.de"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="smtpSecure"
              checked={emailConfig.smtpSecure}
              onCheckedChange={(checked) => setEmailConfig({...emailConfig, smtpSecure: checked})}
            />
            <Label htmlFor="smtpSecure">SSL/TLS verwenden</Label>
          </div>
        </div>
      </AdminCard>

      {/* Email Templates */}
      <AdminCard title="E-Mail-Templates">
        <div className="space-y-6">
          {templates.map((template) => (
            <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    template.type === 'contact' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
                    template.type === 'order' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                    template.type === 'newsletter' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
                  }`}>
                    {template.type}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`subject-${template.id}`}>Betreff</Label>
                  <Input
                    id={`subject-${template.id}`}
                    value={template.subject}
                    onChange={(e) => handleSaveTemplate({...template, subject: e.target.value})}
                    placeholder="E-Mail-Betreff"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`content-${template.id}`}>Inhalt</Label>
                  <Textarea
                    id={`content-${template.id}`}
                    value={template.content}
                    onChange={(e) => handleSaveTemplate({...template, content: e.target.value})}
                    placeholder="E-Mail-Inhalt"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Email Statistics */}
      <AdminCard title="E-Mail-Statistiken">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Send className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">Gesendet heute</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">47</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 dark:text-green-200">Erfolgreich</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">45</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="font-semibold text-red-800 dark:text-red-200">Fehlgeschlagen</h3>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">2</p>
          </div>
        </div>
      </AdminCard>

      {/* Security Notice */}
      <AdminCard title="">
        <div className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Sicherheitshinweis</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Ihre SMTP-Zugangsdaten werden verschlüsselt gespeichert. Verwenden Sie starke Passwörter 
              und aktivieren Sie SSL/TLS für sichere E-Mail-Übertragung.
            </p>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}