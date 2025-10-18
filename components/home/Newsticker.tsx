'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewstickerItem {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'success' | 'announcement';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NewstickerProps {
  items: NewstickerItem[];
  className?: string;
}

export function Newsticker({ items, className = '' }: NewstickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const activeItems = items.filter(item => item.isActive);

  useEffect(() => {
    if (activeItems.length <= 1) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % activeItems.length);
      }
    }, 5000); // Wechsel alle 5 Sekunden

    return () => clearInterval(interval);
  }, [activeItems.length, isPaused]);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-primary/10 border-primary text-primary';
      case 'warning':
        return 'bg-secondary/10 border-secondary text-secondary';
      case 'success':
        return 'bg-accent/10 border-accent text-accent';
      case 'announcement':
        return 'bg-primary/20 border-primary/50 text-primary';
      default:
        return 'bg-muted/20 border-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'ℹ️';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'announcement':
        return '📢';
      default:
        return '📰';
    }
  };

  if (activeItems.length === 0 || !isVisible) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden container-dark ${className}`}>
      <div className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center relative gap-3 sm:gap-0">
          {/* Mobile Layout: Navigation Controls oben */}
          {activeItems.length > 1 && (
            <div className="flex items-center space-x-2 sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length)}
                className="h-8 w-8 p-0 hover:bg-primary/10"
                aria-label="Vorherige Nachricht"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % activeItems.length)}
                className="h-8 w-8 p-0 hover:bg-primary/10"
                aria-label="Nächste Nachricht"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Desktop Layout: Navigation Controls links */}
          {activeItems.length > 1 && (
            <div className="hidden sm:flex items-center space-x-2 absolute left-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length)}
                className="h-8 w-8 p-0 hover:bg-primary/10"
                aria-label="Vorherige Nachricht"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % activeItems.length)}
                className="h-8 w-8 p-0 hover:bg-primary/10"
                aria-label="Nächste Nachricht"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Newsticker Content - Responsive */}
          <div 
            className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 overflow-hidden w-full sm:w-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Current Item */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-lg sm:text-xl flex-shrink-0">
                {getTypeIcon(activeItems[currentIndex]?.type || 'info')}
              </span>
              <div className={`px-3 sm:px-4 py-2 rounded-full border text-sm sm:text-lg font-medium text-center sm:text-left flex-1 sm:flex-none ${getTypeStyles(activeItems[currentIndex]?.type || 'info')}`}>
                <span className="block sm:inline">{activeItems[currentIndex]?.text || ''}</span>
              </div>
            </div>

            {/* Navigation Dots */}
            {activeItems.length > 1 && (
              <div className="flex space-x-1 mt-2 sm:mt-0">
                {activeItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary' : 'bg-primary/30'
                    }`}
                    aria-label={`Zu Nachricht ${index + 1} wechseln`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Close Button - Mobile: unten, Desktop: rechts */}
          <div className="flex items-center space-x-2 sm:absolute sm:right-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-8 w-8 p-0 hover:bg-primary/10"
              aria-label="Newsticker ausblenden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
