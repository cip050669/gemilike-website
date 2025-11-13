import { useEffect, useRef } from 'react';

interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  enabled?: boolean;
}

/**
 * Hook für erweiterte Keyboard Navigation
 */
export function useKeyboardNavigation({
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  enabled = true,
}: KeyboardNavigationOptions) {
  const handlerRef = useRef<(e: KeyboardEvent) => void | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    handlerRef.current = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onEscape?.();
          break;
        case 'Enter':
          if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement) {
            onEnter?.();
          }
          break;
        case 'ArrowUp':
          onArrowUp?.();
          break;
        case 'ArrowDown':
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          onArrowRight?.();
          break;
      }
    };

    window.addEventListener('keydown', handlerRef.current);

    return () => {
      if (handlerRef.current) {
        window.removeEventListener('keydown', handlerRef.current);
      }
    };
  }, [enabled, onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);
}

