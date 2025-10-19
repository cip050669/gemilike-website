'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
}

export default function NewsletterSignup({ className }: NewsletterSignupProps): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className={`text-center p-6 bg-green-900/20 border border-green-500/30 rounded-lg ${className || ''}`}>
        <Check className="w-8 h-8 text-green-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Erfolgreich angemeldet!
        </h3>
        <p className="text-green-300 text-sm">
          Vielen Dank für Ihre Anmeldung zu unserem Newsletter.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-xl font-semibold text-white mb-6">Newsletter</h3>
      <p className="text-slate-400 mb-6 text-sm">
        Erhalten Sie exklusive Angebote und Neuigkeiten zu unseren Edelsteinen.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Ihre E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !email}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          Mit der Anmeldung stimmen Sie unseren Datenschutzbestimmungen zu.
        </p>
      </form>
    </div>
  );
}
