'use client';

import { useMemo } from 'react';

interface GradientBarProps {
  colors: string[];
  height?: number;
  className?: string;
}

export function GradientBar({ colors, height = 60, className = '' }: GradientBarProps) {
  const gradientStyle = useMemo(() => {
    if (colors.length === 0) return {};
    
    const colorStops = colors
      .map((color, index) => {
        const percentage = (index / (colors.length - 1)) * 100;
        return `${color} ${percentage}%`;
      })
      .join(', ');

    return {
      background: `linear-gradient(to right, ${colorStops})`,
      height: `${height}px`,
    };
  }, [colors, height]);

  if (colors.length === 0) {
    return (
      <div
        className={`rounded-md bg-slate-200 ${className}`}
        style={{ height: `${height}px` }}
      />
    );
  }

  return (
    <div
      className={`rounded-md border border-slate-200 dark:border-slate-700 ${className}`}
      style={gradientStyle}
      role="img"
      aria-label={`Color gradient from ${colors[0]} to ${colors[colors.length - 1]}`}
    />
  );
}

