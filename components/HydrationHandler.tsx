'use client';

import { useEffect } from 'react';

export function HydrationHandler() {
  useEffect(() => {
    // Robuste Behandlung von Browser-Extension-Konflikten
    const handleHydrationIssues = () => {
      const htmlElement = document.documentElement;
      
      // Stelle sicher, dass das Attribut konsistent ist
      if (!htmlElement.hasAttribute('data-cbscriptallow')) {
        htmlElement.setAttribute('data-cbscriptallow', 'true');
      }
      
      // Verhindere weitere Änderungen durch Extensions
      try {
        const originalSetAttribute = htmlElement.setAttribute;
        htmlElement.setAttribute = function(name: string, value: string) {
          if (name === 'data-cbscriptallow') {
            // Ignoriere Änderungen an diesem Attribut
            return;
          }
          return originalSetAttribute.call(this, name, value);
        };
      } catch (error) {
        // Fallback falls die Überschreibung fehlschlägt
        console.warn('Could not override setAttribute:', error);
      }
    };

    // Führe sofort nach dem Mount aus
    handleHydrationIssues();

    // Überwache Änderungen am HTML-Element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-cbscriptallow') {
          // Stelle sicher, dass das Attribut korrekt ist
          const htmlElement = document.documentElement;
          if (!htmlElement.hasAttribute('data-cbscriptallow')) {
            htmlElement.setAttribute('data-cbscriptallow', 'true');
          }
        }
      });
    });

    // Starte die Überwachung
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-cbscriptallow']
    });

    // Cleanup nach einer kurzen Zeit
    const timeout = setTimeout(() => {
      observer.disconnect();
    }, 3000);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  return null;
}
