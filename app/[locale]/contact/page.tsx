'use client';

import { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ScrollAnimated } from '@/components/ui/ScrollAnimated';

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
      <div className="min-h-screen public-page-bg text-white pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimated direction="fade" delay={0}>
            <section className="main-container">
              <div className="story-card space-y-4 p-6 md:p-8">
                <div className="space-y-4 text-center">
                  <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                    <span className="gemilike-text-gradient">Kontakt</span>
                  </h1>
                  <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
                    Haben Sie Fragen zu unseren Edelsteinen oder benötigen Sie eine Beratung? 
                    Wir sind gerne für Sie da!
                  </p>
                </div>
              </div>
            </section>
          </ScrollAnimated>

          <ScrollAnimated direction="up" delay={100}>
            <section className="main-container">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kontaktformular */}
            <section aria-labelledby="contact-form-heading">
              <div className="story-card">
                <div className="p-6 md:p-8">
                  <h2 
                    id="contact-form-heading"
                    className="text-2xl font-bold mb-6 flex items-center space-x-2 text-gray-200"
                  >
                    <MailIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <span>Nachricht senden</span>
                  </h2>
                <div>
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
                          className="block text-sm font-medium mb-2 text-gray-200"
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
                          className="block text-sm font-medium mb-2 text-gray-200"
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
                        className="block text-sm font-medium mb-2 text-gray-200"
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
                        className="block text-sm font-medium mb-2 text-gray-200"
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
                </div>
                </div>
              </div>
            </section>

            {/* Kontaktinformationen */}
            <aside className="space-y-6" aria-label="Kontaktinformationen">
              <div className="story-card">
                <div className="p-6 md:p-8 space-y-4">
                  <h2 className="text-2xl font-bold mb-6 text-gray-200">Kontaktinformationen</h2>
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-200">Adresse</h3>
                      <p className="text-gray-200">
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
                      <h3 className="font-semibold text-gray-200">Telefon</h3>
                      <p className="text-gray-200">
                        +49 (0) 123 456 789<br />
                        Mo-Fr: 9:00-18:00 Uhr
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MailIcon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-200">E-Mail</h3>
                      <p className="text-gray-200">
                        info@gemilike.com<br />
                        support@gemilike.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <ClockIcon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-200">Öffnungszeiten</h3>
                      <p className="text-gray-200">
                        Montag - Freitag: 9:00 - 18:00<br />
                        Samstag: 10:00 - 16:00<br />
                        Sonntag: Geschlossen
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="story-card">
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-200">Beratung & Service</h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-gray-200">Kostenlose Edelstein-Beratung</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-gray-200">Zertifikate und Gutachten</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-gray-200">Individuelle Schmuckanfertigung</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-gray-200">Reparaturen und Restaurierung</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm text-gray-200">Wertgutachten und Schätzungen</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
            </section>
          </ScrollAnimated>
        </div>
      </div>
    </PublicLayout>
  );
}
