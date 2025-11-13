'use client';

import { useRef, useState, ReactNode, TouchEvent } from 'react';
import { cn } from '@/lib/utils';

interface SwipeableProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
  threshold?: number; // Minimum distance in pixels to trigger swipe
}

export function Swipeable({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className,
  threshold = 50,
}: SwipeableProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const minSwipeDistance = threshold;

  const onTouchStart = (e: TouchEvent) => {
    touchEndRef.current = null;
    const touch = e.targetTouches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    setIsSwiping(true);
  };

  const onTouchMove = (e: TouchEvent) => {
    const touch = e.targetTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) {
      setIsSwiping(false);
      return;
    }

    const distanceX = touchStartRef.current.x - touchEndRef.current.x;
    const distanceY = touchStartRef.current.y - touchEndRef.current.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    } else if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    } else if (isUpSwipe && onSwipeUp) {
      onSwipeUp();
    } else if (isDownSwipe && onSwipeDown) {
      onSwipeDown();
    }

    setIsSwiping(false);
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  return (
    <div
      className={cn('touch-none select-none', isSwiping && 'cursor-grabbing', className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
}

