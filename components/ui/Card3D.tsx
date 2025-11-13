'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // 0-1, default 0.1
  disabled?: boolean;
}

/**
 * 3D Card Component mit Mouse-Tracking
 * Erstellt einen 3D-Tilt-Effekt basierend auf Mausposition
 */
export function Card3D({ 
  children, 
  className,
  intensity = 0.1,
  disabled = false 
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (disabled || !cardRef.current) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10 * intensity;
      const rotateY = ((x - centerX) / centerX) * 10 * intensity;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      if (!card) return;
      setIsHovered(false);
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [intensity, disabled]);

  return (
    <div
      ref={cardRef}
      className={cn(
        'transition-transform duration-300 ease-out',
        'transform-style-preserve-3d',
        isHovered && 'shadow-2xl',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  );
}

