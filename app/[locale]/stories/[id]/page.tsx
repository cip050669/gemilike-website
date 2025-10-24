'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';

interface Story {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

export default function StoryPage() {
  const t = useTranslations('stories');
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;
  const locale = params.locale as string;
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStory = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/stories');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.stories) {
            const foundStory = data.stories.stories.find((s: Story) => s.id === storyId);
            if (foundStory && foundStory.published) {
              setStory(foundStory);
            } else {
              // Story nicht gefunden oder nicht veröffentlicht
              router.push(`/${locale}`);
            }
          } else {
            router.push(`/${locale}`);
          }
        } else {
          router.push(`/${locale}`);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Geschichte:', error);
        router.push(`/${locale}`);
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      loadStory();
    }
  }, [storyId, router, locale]);

  if (loading) {
    return (
      <div className="min-h-screen public-page-bg text-foreground">
        <div className="container py-12 md:py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen public-page-bg text-foreground">
        <div className="container py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t('notFound')}</h1>
            <p className="text-muted-foreground mb-8">{t('notFoundDesc')}</p>
            <Button asChild>
              <Link href={`/${locale}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToHome')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen public-page-bg text-foreground">
      <div className="container py-12 md:py-20">
        {/* Zurück-Button */}
        <div className="mb-8">
          <Button asChild variant="outline" className="bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground">
            <Link href={`/${locale}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToStories')}
            </Link>
          </Button>
        </div>

        {/* Geschichte Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
            {/* Geschichte Header */}
            <div className="p-8 pb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-card-foreground">
                <span className="gradient-text animate-glow">{story.title}</span>
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{new Date(story.createdAt).toLocaleDateString('de-DE')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{t('author')}</span>
                </div>
              </div>
            </div>

            {/* Geschichte Bild */}
            {story.imageUrl && (
              <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
                <Image
                  src={story.imageUrl}
                  alt={story.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  priority
                />
              </div>
            )}

            {/* Geschichte Inhalt */}
            <div className="p-8 pt-6">
              <div className="prose prose-lg max-w-none prose-slate dark:prose-invert">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  {story.description}
                </p>
                {story.content && (
                  <div className="mt-8">
                    <MarkdownRenderer content={story.content} />
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="px-8 py-6 bg-muted/50 border-t border-border">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Alle Geschichten
                  </Link>
                </Button>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/shop">
                    Sortiment entdecken
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}