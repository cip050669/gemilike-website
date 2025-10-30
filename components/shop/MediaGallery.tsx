'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play, ZoomIn, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

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

type MediaItem = { type: 'image'; src: string } | { type: 'video'; src: string };

const PLACEHOLDER = '/products/placeholder-gem.jpg';

export function MediaGallery({
  images,
  videos = [],
  gemName,
  className,
  certification,
  inStock,
}: MediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mediaItems: MediaItem[] = useMemo(() => {
    const mappedImages = images.map<MediaItem>((src) => ({ type: 'image', src }));
    const mappedVideos = videos.map<MediaItem>((src) => ({ type: 'video', src }));
    const combined = [...mappedImages, ...mappedVideos];
    return combined.length ? combined : [{ type: 'image', src: PLACEHOLDER }];
  }, [images, videos]);

  useEffect(() => {
    if (selectedIndex >= mediaItems.length) {
      setSelectedIndex(0);
    }
  }, [mediaItems.length, selectedIndex]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const width = container.clientWidth;
      const target = Math.max(0, Math.min(mediaItems.length - 1, index));
      isProgrammaticScroll.current = true;
      container.scrollTo({ left: width * target, behavior });
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, behavior === 'auto' ? 0 : 350);
    },
    [mediaItems.length]
  );

  useEffect(() => {
    scrollToIndex(selectedIndex, mounted ? 'smooth' : 'auto');
  }, [selectedIndex, scrollToIndex, mounted]);

  const handleScroll = useCallback(() => {
    if (isProgrammaticScroll.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    if (!width) return;
    const index = Math.round(container.scrollLeft / width);
    if (index !== selectedIndex) {
      setSelectedIndex(index);
      setIsVideoPlaying(null);
    }
  }, [selectedIndex]);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    setIsVideoPlaying(null);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % mediaItems.length);
    setIsVideoPlaying(null);
  };

  if (!mediaItems.length) {
    return (
      <div
        className={cn(
          'flex aspect-square items-center justify-center rounded-lg border border-dashed border-white/20 text-sm text-white/50',
          className
        )}
      >
        Keine Medien verfügbar
      </div>
    );
  }

  if (!mounted) {
    const first = mediaItems[0]?.src ?? PLACEHOLDER;
    return (
      <div className={cn('w-full', className)}>
        <div className="rounded-lg border border-white/10 bg-gray-800/60 p-2">
          <Image
            src={first}
            alt={`${gemName} - Hauptbild`}
            width={600}
            height={400}
            className="h-full w-full max-h-[340px] rounded-md object-contain"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60">
        <div
          ref={scrollContainerRef}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
          onScroll={handleScroll}
        >
          {mediaItems.map((item, index) => {
            const baseKey = `${item.type}-${index}`;
            return (
              <div
                key={baseKey}
                className="relative h-full w-full flex-shrink-0 snap-center"
                style={{ minWidth: '100%' }}
              >
                {item.type === 'video' ? (
                  <video
                    className="h-full w-full max-h-[360px] bg-black object-contain"
                    controls={isVideoPlaying === index}
                    poster={images[0] ?? PLACEHOLDER}
                    onPlay={() => setIsVideoPlaying(index)}
                    onPause={() => setIsVideoPlaying(null)}
                  >
                    <source src={item.src} type="video/mp4" />
                    Ihr Browser unterstützt das Video-Format nicht.
                  </video>
                ) : (
                  <Image
                    src={item.src || PLACEHOLDER}
                    alt={`${gemName} - Bild ${index + 1}`}
                    width={900}
                    height={600}
                    className="h-full w-full max-h-[360px] select-none object-contain"
                    priority={index === 0}
                  />
                )}

                {item.type === 'video' && isVideoPlaying !== index && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                )}

                {item.type === 'image' && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute right-4 top-4 hidden rounded-full bg-black/60 text-white shadow-lg transition group-hover:flex"
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                        aria-label={`Bild ${index + 1} vergrößern`}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-5xl max-h-[90vh] bg-black p-0">
                      <DialogHeader className="px-4 py-2 text-white">
                        <DialogTitle>Vergrößerte Ansicht von {gemName}</DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center justify-center bg-black">
                        <Image
                          src={item.src || PLACEHOLDER}
                          alt={`${gemName} - Vergrößert`}
                          width={1400}
                          height={900}
                          className="max-h-[80vh] w-full object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {!inStock && (
                  <div className="absolute left-4 top-4 z-10">
                    <Badge variant="destructive">Verkauft</Badge>
                  </div>
                )}

                {certification?.certified && (
                  <div className="absolute bottom-4 right-4 z-10">
                    <Badge className="flex items-center gap-2 bg-slate-700/90 text-[11px] text-white">
                      <Award className="h-3.5 w-3.5" />
                      {certification.lab ?? 'Zertifiziert'}
                    </Badge>
                  </div>
                )}

                {mediaItems.length > 1 && (
                  <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                    {index + 1} / {mediaItems.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {mediaItems.length > 1 && (
          <>
            <Button
              size="icon"
              variant="secondary"
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/50 text-white shadow-lg transition hover:bg-black/70 md:flex"
              onClick={handlePrev}
              aria-label="Vorheriges Medium"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/50 text-white shadow-lg transition hover:bg-black/70 md:flex"
              onClick={handleNext}
              aria-label="Nächstes Medium"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {mediaItems.length > 1 && (
        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Medienauswahl">
          {mediaItems.map((item, index) => {
            const isActive = index === selectedIndex;
            const thumbSrc = item.type === 'video' ? images[0] ?? PLACEHOLDER : item.src;
            return (
              <button
                key={`${item.type}-${index}`}
                type="button"
                onClick={() => {
                  setSelectedIndex(index);
                  setIsVideoPlaying(null);
                  scrollToIndex(index);
                }}
                className={cn(
                  'relative h-16 w-16 overflow-hidden rounded-lg border-2 border-transparent transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  isActive ? 'border-primary shadow-lg' : 'border-white/20'
                )}
                aria-label={`${item.type === 'video' ? 'Video' : 'Bild'} ${index + 1} auswählen`}
              >
                <Image
                  src={thumbSrc || PLACEHOLDER}
                  alt={`${gemName} Vorschau ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Play className="h-4 w-4 text-white" />
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
