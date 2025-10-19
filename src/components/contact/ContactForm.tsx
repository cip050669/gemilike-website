'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { ContactFormData } from '@/lib/types';

export default function ContactForm(): JSX.Element {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          consent: false
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center p-8 bg-green-900/20 border border-green-500/30 rounded-lg">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Nachricht gesendet!
        </h3>
        <p className="text-green-300">
          Vielen Dank für Ihre Nachricht. Wir werden uns schnellstmöglich bei Ihnen melden.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300">
            Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">
            Name *
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
            placeholder="Ihr vollständiger Name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">
            E-Mail *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
            placeholder="ihre@email.de"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">
            Telefon
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
            placeholder="+49 123 456789"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject" className="text-white">
            Betreff *
          </Label>
          <Input
            id="subject"
            name="subject"
            type="text"
            value={formData.subject}
            onChange={handleInputChange}
            required
            className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
            placeholder="Worum geht es?"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-white">
          Nachricht *
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={6}
          className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
          placeholder="Beschreiben Sie Ihr Anliegen..."
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={formData.consent}
          onChange={handleInputChange}
          required
          className="mt-1 text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="consent" className="text-sm text-slate-300">
          Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300 underline">
            Datenschutzerklärung
          </a>{' '}
          zu. *
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !formData.consent}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Wird gesendet...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Nachricht senden
          </div>
        )}
      </Button>
    </form>
  );
}
