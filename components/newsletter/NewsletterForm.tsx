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
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <MailIcon className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">{t.title}</h3>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            required
            className="flex-1"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading || !email}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{t.loading}</span>
              </div>
            ) : (
              t.button
            )}
          </Button>
        </div>

        {message && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            isSuccess 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {isSuccess ? (
              <CheckIcon className="h-4 w-4" />
            ) : (
              <XIcon className="h-4 w-4" />
            )}
            <span className="text-sm">{message}</span>
          </div>
        )}
      </form>

      <div className="mt-4 text-xs text-muted-foreground text-center">
        {locale === 'de' 
          ? 'Sie können sich jederzeit abmelden. Keine Spam-E-Mails.' 
          : 'You can unsubscribe at any time. No spam emails.'
        }
      </div>
    </div>
  );
}
