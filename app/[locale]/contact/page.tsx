'use client';

import { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, locale }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMessage('Nachricht erfolgreich gesendet!');
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setMessage(result.error || 'Ein Fehler ist aufgetreten');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Netzwerk-Fehler: ' + (error as Error).message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <PublicLayout>
      <main className="min-h-screen public-page-bg">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="gemilike-text-gradient text-4xl font-bold mb-4">Kontakt</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Haben Sie Fragen zu unseren Edelsteinen oder benötigen Sie eine Beratung? 
              Wir sind gerne für Sie da!
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kontaktformular */}
            <section aria-labelledby="contact-form-heading">
              <Card>
                <CardHeader>
                  <CardTitle 
                    id="contact-form-heading"
                    className="flex items-center space-x-2"
                  >
                    <MailIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Nachricht senden</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Progressive Enhancement: HTML-Schicht mit action/method für Fallback */}
                  <form 
                    onSubmit={handleSubmit} 
                    action="/api/contact" 
                    method="POST"
                    className="space-y-4"
                    aria-label="Kontaktformular"
                    noValidate
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label 
                          htmlFor="name" 
                          className="block text-sm font-medium mb-2"
                          id="name-label"
                        >
                          Name <span aria-label="erforderlich">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          aria-required="true"
                          aria-labelledby="name-label"
                          aria-describedby="name-help"
                          disabled={loading}
                          autoComplete="name"
                        />
                        <span id="name-help" className="sr-only">
                          Bitte geben Sie Ihren vollständigen Namen ein
                        </span>
                      </div>
                      <div>
                        <label 
                          htmlFor="email" 
                          className="block text-sm font-medium mb-2"
                          id="email-label"
                        >
                          E-Mail <span aria-label="erforderlich">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          aria-required="true"
                          aria-labelledby="email-label"
                          aria-describedby="email-help"
                          disabled={loading}
                          autoComplete="email"
                        />
                        <span id="email-help" className="sr-only">
                          Bitte geben Sie eine gültige E-Mail-Adresse ein
                        </span>
                      </div>
                    </div>

                    <div>
                      <label 
                        htmlFor="subject" 
                        className="block text-sm font-medium mb-2"
                        id="subject-label"
                      >
                        Betreff <span aria-label="erforderlich">*</span>
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                        aria-required="true"
                        aria-labelledby="subject-label"
                        aria-describedby="subject-help"
                        disabled={loading}
                        autoComplete="off"
                      />
                      <span id="subject-help" className="sr-only">
                        Bitte geben Sie einen Betreff für Ihre Nachricht ein
                      </span>
                    </div>

                    <div>
                      <label 
                        htmlFor="message" 
                        className="block text-sm font-medium mb-2"
                        id="message-label"
                      >
                        Nachricht <span aria-label="erforderlich">*</span>
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        required
                        aria-required="true"
                        aria-labelledby="message-label"
                        aria-describedby="message-help"
                        rows={6}
                        disabled={loading}
                        placeholder="Beschreiben Sie Ihre Anfrage oder Ihr Anliegen..."
                        autoComplete="off"
                      />
                      <span id="message-help" className="sr-only">
                        Bitte beschreiben Sie Ihre Anfrage oder Ihr Anliegen
                      </span>
                    </div>

                    {/* Hidden field für locale (wird von JS gesetzt, Fallback im noscript) */}
                    <input type="hidden" name="locale" value={locale} />

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      aria-label="Kontaktformular absenden"
                      aria-describedby="submit-help"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2" aria-live="polite" aria-busy="true">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" aria-hidden="true"></div>
                          <span>Wird gesendet...</span>
                        </div>
                      ) : (
                        'Nachricht senden'
                      )}
                    </Button>
                    <span id="submit-help" className="sr-only">
                      Klicken Sie hier, um Ihre Nachricht zu senden
                    </span>

                    {/* Live-Region für Status-Meldungen */}
                    {message && (
                      <div 
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        className={`flex items-center space-x-2 p-3 rounded-lg ${
                          isSuccess 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {isSuccess ? (
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <XIcon className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="text-sm">{message}</span>
                      </div>
                    )}
                  </form>

                  {/* Progressive Enhancement: noscript Fallback für JavaScript-freie Umgebungen */}
                  <noscript>
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Hinweis:</strong> JavaScript ist deaktiviert. Das Formular wird über einen normalen Formular-Submit gesendet.
                      </p>
                      <p className="text-xs text-blue-700">
                        Bitte stellen Sie sicher, dass alle Felder ausgefüllt sind, bevor Sie das Formular absenden.
                      </p>
                    </div>
                  </noscript>
                </CardContent>
              </Card>
            </section>

            {/* Kontaktinformationen */}
            <aside className="space-y-6" aria-label="Kontaktinformationen">
              <Card>
                <CardHeader>
                  <CardTitle>Kontaktinformationen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Adresse</h3>
                      <p className="text-muted-foreground">
                        Gemilike GmbH<br />
                        Musterstraße 123<br />
                        12345 Musterstadt<br />
                        Deutschland
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <PhoneIcon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Telefon</h3>
                      <p className="text-muted-foreground">
                        +49 (0) 123 456 789<br />
                        Mo-Fr: 9:00-18:00 Uhr
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MailIcon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">E-Mail</h3>
                      <p className="text-muted-foreground">
                        info@gemilike.com<br />
                        support@gemilike.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <ClockIcon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Öffnungszeiten</h3>
                      <p className="text-muted-foreground">
                        Montag - Freitag: 9:00 - 18:00<br />
                        Samstag: 10:00 - 16:00<br />
                        Sonntag: Geschlossen
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Beratung & Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Kostenlose Edelstein-Beratung</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Zertifikate und Gutachten</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Individuelle Schmuckanfertigung</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Reparaturen und Restaurierung</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Wertgutachten und Schätzungen</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
