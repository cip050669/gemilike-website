'use client';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
  className?: string;
}

/**
 * Live-Region Komponente für Screen Reader Updates
 * Verwendet für dynamische Inhalte wie Warenkorb-Updates, Formular-Status, etc.
 */
export function LiveRegion({ 
  message, 
  priority = 'polite', 
  atomic = true,
  className = '' 
}: LiveRegionProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  );
}

/**
 * Alert-Region für wichtige Benachrichtigungen
 */
export function AlertRegion({ 
  message, 
  atomic = true,
  className = '' 
}: Omit<LiveRegionProps, 'priority'>) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic={atomic}
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  );
}

