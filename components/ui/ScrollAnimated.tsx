'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScrollAnimatedProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
}

export function ScrollAnimated({
  children,
  className,
  threshold = 0.1,
  delay = 0,
  direction = 'up',
}: ScrollAnimatedProps) {
  void threshold;
  void delay;
  void direction;

  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
}
