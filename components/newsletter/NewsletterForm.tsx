'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MailIcon, CheckIcon, XIcon } from 'lucide-react';

interface NewsletterFormProps {
  locale?: string;
  className?: string;
}

export function NewsletterForm({ locale = 'de', className = '' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, locale }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMessage(
          locale === 'de' 
            ? 'Erfolgreich für Newsletter angemeldet!' 
            : 'Successfully subscribed to newsletter!'
        );
        setIsSuccess(true);
        setEmail('');
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

  const translations = {
    de: {
      title: 'Newsletter abonnieren',
      description: 'Erhalten Sie exklusive Angebote und Neuigkeiten über Edelsteine.',
      placeholder: 'Ihre E-Mail-Adresse',
      button: 'Abonnieren',
      loading: 'Wird gesendet...',
      success: 'Erfolgreich angemeldet!',
      error: 'Fehler bei der Anmeldung'
    },
    en: {
      title: 'Subscribe to Newsletter',
      description: 'Get exclusive offers and news about gemstones.',
      placeholder: 'Your email address',
      button: 'Subscribe',
      loading: 'Sending...',
      success: 'Successfully subscribed!',
      error: 'Subscription error'
    }
  };

  const t = translations[locale as keyof typeof translations] || translations.de;

  return (
    <section 
      className={`bg-card border border-border rounded-lg p-6 ${className}`}
      aria-labelledby="newsletter-heading"
    >
      <div className="text-center mb-6">
        <MailIcon className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
        <h3 id="newsletter-heading" className="text-xl font-semibold mb-2">{t.title}</h3>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      {/* Progressive Enhancement: HTML-Schicht mit action/method für Fallback */}
      <form 
        onSubmit={handleSubmit} 
        action="/api/newsletter" 
        method="POST"
        className="space-y-4"
        aria-label={t.title}
        noValidate
      >
        <div className="flex gap-2">
          <label htmlFor="newsletter-email" className="sr-only">
            {t.placeholder}
          </label>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            required
            aria-required="true"
            aria-label={t.placeholder}
            aria-describedby="newsletter-email-help"
            className="flex-1"
            disabled={loading}
            autoComplete="email"
          />
          <span id="newsletter-email-help" className="sr-only">
            {locale === 'de' 
              ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
              : 'Please enter a valid email address'}
          </span>
          <input type="hidden" name="locale" value={locale} />
          <Button 
            type="submit" 
            disabled={loading || !email}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            aria-label={t.button}
            aria-describedby="newsletter-submit-help"
          >
            {loading ? (
              <div className="flex items-center space-x-2" aria-live="polite" aria-busy="true">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" aria-hidden="true"></div>
                <span>{t.loading}</span>
              </div>
            ) : (
              t.button
            )}
          </Button>
          <span id="newsletter-submit-help" className="sr-only">
            {locale === 'de'
              ? 'Klicken Sie hier, um sich für den Newsletter anzumelden'
              : 'Click here to subscribe to the newsletter'}
          </span>
        </div>

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

      {/* Progressive Enhancement: noscript Fallback */}
      <noscript>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            {locale === 'de'
              ? 'JavaScript ist deaktiviert. Das Formular wird über einen normalen Formular-Submit gesendet.'
              : 'JavaScript is disabled. The form will be submitted via a normal form submit.'}
          </p>
        </div>
      </noscript>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        {locale === 'de' 
          ? 'Sie können sich jederzeit abmelden. Keine Spam-E-Mails.' 
          : 'You can unsubscribe at any time. No spam emails.'
        }
      </div>
    </section>
  );
}
