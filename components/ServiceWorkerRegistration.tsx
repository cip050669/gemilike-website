'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // Service Worker registrieren
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[Service Worker] Registered successfully:', registration.scope);

          // Prüfe auf Updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Neuer Service Worker verfügbar
                  console.log('[Service Worker] New version available');
                  // Optional: Benutzer benachrichtigen
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[Service Worker] Registration failed:', error);
        });

      // Prüfe auf Updates beim Laden
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  return null;
}

