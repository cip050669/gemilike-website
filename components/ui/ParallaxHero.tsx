'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxHeroProps {
  children: ReactNode;
  speed?: number; // Parallax speed (0.1 - 1.0)
  className?: string;
}

export function ParallaxHero({ children, speed = 0.5, className }: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      ref.current.style.transform = `translateY(${rate}px)`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={cn('transition-transform duration-75 ease-out', className)}>
      {children}
    </div>
  );
}

