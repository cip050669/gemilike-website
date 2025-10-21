'use client';

import { useEffect, useMemo, useState } from 'react';
import { NewstickerItem } from '@/lib/types/newsticker';
import { cn } from '@/lib/utils';
import { Info, AlertTriangle, CheckCircle, Megaphone } from 'lucide-react';

const TYPE_OUTLINE: Record<NewstickerItem['type'], string> = {
  info: 'border-blue-300/40',
  warning: 'border-amber-300/40',
  success: 'border-emerald-300/40',
  error: 'border-rose-300/40',
};

const TYPE_ICONS: Record<NewstickerItem['type'], JSX.Element> = {
  info: <Info className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  error: <Megaphone className="h-5 w-5" />,
};

interface DisplayNewstickerItem extends NewstickerItem {
  resolvedColor: string;
}

const getDefaultColor = (type: NewstickerItem['type']) => {
  switch (type) {
    case 'info':
      return '#1d4ed8';
    case 'warning':
      return '#b45309';
    case 'success':
      return '#047857';
    case 'error':
      return '#b91c1c';
    default:
      return '#111827';
  }
};

interface NewstickerProps {
  items: NewstickerItem[];
  autoRotate?: boolean;
  rotationInterval?: number;
}

export function Newsticker({ items, autoRotate = true, rotationInterval = 7000 }: NewstickerProps) {
  const activeItems = useMemo<DisplayNewstickerItem[]>(
    () =>
      items
        .filter((item) => item.isActive)
        .map((item) => ({
          ...item,
          resolvedColor: item.headingColor || getDefaultColor(item.type),
        })),
    [items]
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || activeItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [autoRotate, rotationInterval, activeItems.length]);

  if (activeItems.length === 0) {
    return null;
  }

  const item = activeItems[currentIndex];

  return (
    <div
      className={cn(
        'w-full max-w-5xl rounded-2xl border bg-black/60 px-8 py-[30px] shadow-xl backdrop-blur-sm transition-all duration-500 ease-out',
        TYPE_OUTLINE[item.type]
      )}
      style={{ borderColor: item.resolvedColor + '55' }}
    >
      <div className="flex items-center gap-5">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10"
          style={{ color: item.resolvedColor }}
        >
          {TYPE_ICONS[item.type]}
        </div>
        <p
          className="text-lg font-semibold leading-relaxed text-white"
          style={{ color: item.resolvedColor }}
        >
          {item.text}
        </p>
      </div>
    </div>
  );
}
