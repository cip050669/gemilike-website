'use client';

import { useState, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MicroInteractionProps {
  children: ReactNode;
  type?: 'scale' | 'bounce' | 'pulse' | 'glow';
  className?: string;
  disabled?: boolean;
}

/**
 * Microinteraction Component für subtile Animationen
 */
export function MicroInteraction({ 
  children, 
  type = 'scale',
  className,
  disabled = false 
}: MicroInteractionProps) {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleInteraction = () => {
    if (disabled) return;
    
    setIsActive(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
    }, 300);
  };

  const interactionClasses = {
    scale: 'hover-scale',
    bounce: 'hover-bounce',
    pulse: 'hover-pulse',
    glow: 'hover-glow',
  };

  return (
    <div
      className={cn(
        interactionClasses[type],
        isActive && `${type}-active`,
        className
      )}
      onMouseEnter={handleInteraction}
      onMouseLeave={handleInteraction}
    >
      {children}
    </div>
  );
}

