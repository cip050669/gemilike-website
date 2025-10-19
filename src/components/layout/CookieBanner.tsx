'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CookieBanner(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = (): void => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = (): void => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg p-4 shadow-xl">
      <div className="flex items-start gap-4">
        <Cookie className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Cookie-Einstellungen
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            Wir verwenden Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten. 
            Durch die Nutzung unserer Website stimmen Sie der Verwendung von Cookies zu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAccept}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Alle akzeptieren
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Nur notwendige
            </Button>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
