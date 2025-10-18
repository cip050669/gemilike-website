'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { XIcon, CookieIcon } from 'lucide-react';

export function CookieBanner() {
  const [accepted, setAccepted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if cookies were already accepted
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setAccepted(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'false');
    setAccepted(true);
    setIsVisible(false);
  };

  if (!isVisible || accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50 shadow-lg">
      <div className="container mx-auto">
        <div className="flex items-start space-x-4">
          <CookieIcon className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Cookie-Einstellungen</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Diese Website verwendet Cookies, um Ihnen die beste Erfahrung auf unserer Website zu bieten.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleAccept}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-sm"
              >
                Akzeptieren
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                className="border-border text-foreground hover:bg-accent px-4 py-2 rounded text-sm"
              >
                Ablehnen
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground px-4 py-2 rounded text-sm"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}