'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { X, Calendar, User, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';

interface StoryItem {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

interface StoryDetailCardProps {
  story: StoryItem;
  isOpen: boolean;
  onClose: () => void;
  backLabel?: string;
}

export function StoryDetailCard({ 
  story, 
  isOpen, 
  onClose, 
  backLabel = "Zurück zur Startseite" 
}: StoryDetailCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{story.title}</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-0 right-0 z-10"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-white dark:text-white">
                {story.title}
              </h1>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-300 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {story.author}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {story.date}
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <MarkdownRenderer content={story.content} />
            </div>

            {/* Back Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
