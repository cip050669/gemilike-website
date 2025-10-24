'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type GemButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  glow?: boolean;
};

export const GemButton = forwardRef<HTMLButtonElement, GemButtonProps>(
  ({ className, children, glow = true, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black',
          glow
            ? 'bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(79,70,229,0.45)] hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(79,70,229,0.55)] focus-visible:ring-emerald-300'
            : 'bg-gray-800/30/10 hover:bg-gray-800/30/20 focus-visible:ring-white/60',
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {glow && (
          <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-300/50 via-blue-400/40 to-purple-400/50 blur-xl opacity-80" />
        )}
      </button>
    );
  }
);

GemButton.displayName = 'GemButton';

export default GemButton;
