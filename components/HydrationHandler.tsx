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
    };

    // Führe sofort nach dem Mount aus
    handleHydrationIssues();
  }, []);

  return null;
}
