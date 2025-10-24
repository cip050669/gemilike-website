'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function AdminHeader({
  title,
  description,
  actions,
  children,
  className,
}: AdminHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 p-6 text-white shadow-lg shadow-black/30 md:flex-row md:items-center md:justify-between',
        className
      )}
    >
      <div className="space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-white/40">Admin Panel</p>
          <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">{title}</h1>
        </div>
        {description && (
          <p className="max-w-3xl text-sm text-white/70">{description}</p>
        )}
        {children}
      </div>
      {actions && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {actions}
        </div>
      )}
    </header>
  );
}
