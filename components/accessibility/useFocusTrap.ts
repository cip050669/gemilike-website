import { useEffect, useRef } from 'react';

/**
 * Hook für Focus Trap in Modals/Dialogs
 * Verhindert, dass der Focus außerhalb des Modals geht
 */
export function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus auf erstes Element setzen
    firstElement.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: Rückwärts
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Vorwärts
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Escape-Handling wird von der Komponente selbst übernommen
        // Hier nur für Dokumentation
      }
    };

    container.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return containerRef;
}

