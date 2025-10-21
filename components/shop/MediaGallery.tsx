'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, X, ZoomIn, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface MediaGalleryProps {
  images: string[];
  videos?: string[];
  gemName: string;
  className?: string;
  certification?: {
    certified: boolean;
    lab?: string;
  };
  inStock?: boolean;
}

export function MediaGallery({ images, videos = [], gemName, className, certification, inStock }: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('shop');

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Kombiniere Bilder und Videos für die Navigation
  const allMedia = [
    ...images.map((img, idx) => ({ type: 'image' as const, src: img, index: idx })),
    ...videos.map((vid, idx) => ({ type: 'video' as const, src: vid, index: idx }))
  ];

  const currentMedia = allMedia[selectedIndex];
  const isCurrentVideo = currentMedia?.type === 'video';

  const nextMedia = () => {
    setSelectedIndex((prev) => (prev + 1) % allMedia.length);
    setIsVideoPlaying(null);
  };

  const prevMedia = () => {
    setSelectedIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
    setIsVideoPlaying(null);
  };

  const selectMedia = (index: number) => {
    setSelectedIndex(index);
    setIsVideoPlaying(null);
  };

  if (allMedia.length === 0) {
    return (
      <div className={cn("aspect-square bg-muted rounded-lg flex items-center justify-center", className)}>
        <span className="text-muted-foreground">{t('noMediaAvailable')}</span>
      </div>
    );
  }

  // Prevent hydration mismatch by showing a fallback until mounted
  if (!mounted) {
    return (
      <div className={cn("w-full", className)}>
        <div className="bg-white rounded-lg border shadow-sm">
          <Image
            src={typeof images[0] === 'string' && images[0].startsWith('http') ? images[0] : '/products/default-gemstone.jpg'}
            alt={`${gemName} - Hauptbild`}
            width={400}
            height={300}
            className="w-full h-auto max-h-[300px] object-contain"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Haupt-Medien-Anzeige */}
      <div 
        className="relative bg-white rounded-lg group border shadow-sm mb-2 overflow-hidden max-h-[300px]"
        role="img"
        aria-label={`Bildergalerie für ${gemName}`}
      >
        {isCurrentVideo ? (
          <video
            key={currentMedia.src}
            className="w-full h-full max-h-[300px] object-contain bg-black"
            controls={isVideoPlaying === selectedIndex}
            poster={images[0]} // Verwende das erste Bild als Poster
            onPlay={() => setIsVideoPlaying(selectedIndex)}
            onPause={() => setIsVideoPlaying(null)}
            aria-label={`Video ${currentMedia.index + 1} von ${gemName}`}
          >
            <source src={currentMedia.src} type="video/mp4" />
            Ihr Browser unterstützt keine Videos.
          </video>
        ) : (
          <Image
            src={typeof currentMedia.src === 'string' && currentMedia.src.startsWith('http') ? currentMedia.src : '/products/default-gemstone.jpg'}
            alt={`${gemName} - Bild ${currentMedia.index + 1} von ${allMedia.length}`}
            width={400}
            height={300}
            className="w-full h-auto max-h-[300px] object-contain transition-all duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={selectedIndex === 0}
          />
        )}

        {/* Video Play Button Overlay */}
        {isCurrentVideo && isVideoPlaying !== selectedIndex && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Button
              size="lg"
              className="rounded-full w-16 h-16"
              onClick={() => setIsVideoPlaying(selectedIndex)}
              aria-label={`Video ${currentMedia.index + 1} von ${gemName} abspielen`}
            >
              <Play className="h-6 w-6 ml-1" aria-hidden="true" />
            </Button>
          </div>
        )}

        {/* Zoom Button für Bilder */}
        {!isCurrentVideo && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-[41px] right-[40px] opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Bild ${currentMedia.index + 1} von ${gemName} vergrößern`}
              >
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <DialogHeader>
                <DialogTitle>
                  Vergrößerte Ansicht von {gemName}
                </DialogTitle>
              </DialogHeader>
              <div className="relative">
                <Image
                  src={currentMedia.src}
                  alt={`${gemName} - Vergrößert`}
                  width={1200}
                  height={1200}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Navigation Arrows */}
        {allMedia.length > 1 && (
          <>
            <Button
              size="sm"
              variant="secondary"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevMedia}
              aria-label={`Vorheriges Bild von ${gemName}`}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextMedia}
              aria-label={`Nächstes Bild von ${gemName}`}
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </>
        )}

        {/* Media Counter */}
        {allMedia.length > 1 && (
          <div 
            className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded"
            aria-label={`Bild ${selectedIndex + 1} von ${allMedia.length}`}
          >
            {selectedIndex + 1} / {allMedia.length}
          </div>
        )}
        
        {/* Verkauft Badge oben - nur im Hauptbild */}
        {!inStock && (
          <div className="absolute top-2 left-[43px] z-10">
            <div 
              className="inline-flex items-center justify-center rounded-md bg-red-500 text-white shadow-sm text-xs px-2 py-1 font-medium"
              role="status"
              aria-label="Dieser Edelstein ist verkauft"
            >
              Verkauft
            </div>
          </div>
        )}
        
        {/* Zertifikat Badge unten rechts - nur im Hauptbild */}
        {certification?.certified && (
          <div className="absolute bottom-2 right-2 z-10">
            <Badge 
              className="text-[10px] bg-slate-600/90 text-white px-1.5 py-0.5 shadow-sm flex items-center gap-1"
              aria-label={`Zertifiziert von ${certification.lab}`}
            >
              <Award className="h-3 w-3" aria-hidden="true" />
              {certification.lab}
            </Badge>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {allMedia.length > 1 && (
        <div 
          className="grid grid-cols-3 gap-1.5 pb-1 px-0"
          role="tablist"
          aria-label="Bildergalerie Navigation"
        >
          {allMedia.map((media, index) => (
            <button
              key={`${media.type}-${media.index}`}
              onClick={() => selectMedia(index)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200",
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary/20 scale-105 shadow-md"
                  : "border-gray-200 hover:border-primary/50 hover:scale-102 shadow-sm"
              )}
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={`${media.type === 'video' ? 'Video' : 'Bild'} ${media.index + 1} auswählen`}
            >
              {media.type === 'video' ? (
                <div className="relative w-full h-full bg-muted flex items-center justify-center">
                  <video
                    src={media.src}
                    className="w-full h-full object-cover"
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="h-3 w-3 text-white" aria-hidden="true" />
                  </div>
                </div>
              ) : (
                <Image
                  src={media.src}
                  alt={`Thumbnail ${media.index + 1} von ${gemName}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  sizes="64px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
