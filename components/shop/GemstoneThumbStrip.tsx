'use client';

import { useState, useEffect } from 'react';
import { Gemstone } from '@/lib/types/gemstone';
import { GemstoneThumbnail } from './GemstoneThumbnail';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GemstoneThumbStripProps {
  gemstones: Gemstone[];
  onThumbnailClick: (gemstone: Gemstone) => void;
}

export function GemstoneThumbStrip({ gemstones, onThumbnailClick }: GemstoneThumbStripProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : gemstones.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < gemstones.length - 1 ? prev + 1 : 0));
  };

  const startScrolling = () => {
    setIsScrolling(true);
  };

  const stopScrolling = () => {
    setIsScrolling(false);
  };

  useEffect(() => {
    if (isScrolling) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % gemstones.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isScrolling, gemstones.length]);

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Unser Sortiment
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {gemstones.map((gemstone) => (
            <div key={gemstone.id} className="w-full flex-shrink-0 px-2">
              <GemstoneThumbnail
                gemstone={gemstone}
                onClick={() => onThumbnailClick(gemstone)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {gemstones.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
