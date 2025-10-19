'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  videos?: string[];
  productName: string;
  className?: string;
}

export default function ProductGallery({ 
  images = [], 
  videos = [], 
  productName,
  className 
}: ProductGalleryProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  const allMedia = [...images, ...videos];
  const currentMedia = allMedia[currentIndex];
  const isVideo = videos.includes(currentMedia);

  const nextImage = (): void => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length);
  };

  const prevImage = (): void => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const selectImage = (index: number): void => {
    setCurrentIndex(index);
  };

  if (allMedia.length === 0) {
    return (
      <div className={`aspect-square bg-slate-800 rounded-lg flex items-center justify-center ${className || ''}`}>
        <p className="text-slate-400">Kein Bild verfügbar</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Main Image/Video */}
      <div className="relative aspect-square bg-slate-800 rounded-lg overflow-hidden group">
        {isVideo ? (
          <video
            src={currentMedia}
            className="w-full h-full object-cover"
            controls
            poster={images[0]}
          />
        ) : (
          <Image
            src={currentMedia}
            alt={`${productName} - Bild ${currentIndex + 1}`}
            fill
            className={`object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'group-hover:scale-105'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        )}

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Button */}
        {!isVideo && (
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        )}

        {/* Video Indicator */}
        {isVideo && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Play className="w-3 h-3" />
            Video
          </div>
        )}

        {/* Image Counter */}
        {allMedia.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {allMedia.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allMedia.map((media, index) => {
            const isCurrentVideo = videos.includes(media);
            return (
              <button
                key={index}
                onClick={() => selectImage(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentIndex
                    ? 'border-blue-500'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                {isCurrentVideo ? (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                ) : (
                  <Image
                    src={media}
                    alt={`${productName} - Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                )}
                {isCurrentVideo && (
                  <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-red-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
