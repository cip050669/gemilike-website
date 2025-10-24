'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminCardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export default function AdminCard({
  title,
  description,
  actions,
  children,
  className,
  headerClassName,
  contentClassName,
}: AdminCardProps) {
  return (
    <section
      className={cn(
        'rounded-3xl border border-white/10 bg-gray-800/50/40 p-6 text-white shadow-lg shadow-black/20 backdrop-blur-md',
        className
      )}
    >
      {(title || description || actions) && (
        <div
          className={cn(
            'mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between',
            headerClassName
          )}
        >
          <div>
            {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
            {description && <p className="text-sm text-white/60">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn('space-y-4', contentClassName)}>{children}</div>
    </section>
  );
}
