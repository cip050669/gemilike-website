'use client';

import { useEffect, useMemo, useState } from 'react';
import { NewstickerItem } from '@/lib/types/newsticker';
import { Info, AlertTriangle, CheckCircle, Megaphone, ChevronLeft, ChevronRight } from 'lucide-react';

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

  const showControls = activeItems.length > 0;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
  };

  return (
    <div className="newsticker-container mx-auto" style={{ width: 'calc(100% - 16rem)' }}>
      <div className="flex items-center gap-5 pr-16 pl-16 py-[6px] relative">
        {showControls && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Vorherige Meldung"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"
          style={{ color: item.resolvedColor }}
        >
          {TYPE_ICONS[item.type]}
        </div>
        <p
          className="text-sm font-semibold leading-relaxed text-white"
          style={{ color: item.resolvedColor }}
        >
          {item.text}
        </p>
        {showControls && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Nächste Meldung"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
