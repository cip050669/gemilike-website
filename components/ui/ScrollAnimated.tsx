'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay, hasAnimated]);

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
    fade: '',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0 translate-x-0'
          : `opacity-0 ${directionClasses[direction]}`,
        className
      )}
    >
      {children}
    </div>
  );
}

