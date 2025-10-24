'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';

interface KnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  slug: string;
}

export default function KnowledgeArticlePage() {
  const t = useTranslations('knowledge');
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;
  const locale = params.locale as string;
  const [article, setArticle] = useState<KnowledgeArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/knowledge');
        if (!response.ok) {
          router.push(`/${locale}`);
          return;
        }
        const data = await response.json();
        if (!data.success || !data.articles) {
          router.push(`/${locale}`);
          return;
        }
        const found = data.articles.find((item: KnowledgeArticle) => item.id === articleId || item.slug === articleId);
        if (!found || !found.published) {
          router.push(`/${locale}`);
          return;
        }
        setArticle(found);
      } catch (error) {
        console.error('Fehler beim Laden Wissenswertes:', error);
        router.push(`/${locale}`);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      loadArticle();
    }
  }, [articleId, locale, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800/50 text-foreground">
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

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-800/50 text-foreground">
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
    <div className="min-h-screen bg-gray-800/50 text-foreground">
      <div className="container py-12 md:py-20">
        <div className="mb-8">
          <Button asChild variant="outline" className="bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground">
            <Link href={`/${locale}/wissenswertes`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToList')}
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border">
            <div className="p-8 pb-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-card-foreground">
                <span className="gradient-text animate-glow">{article.title}</span>
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{new Date(article.createdAt).toLocaleDateString('de-DE')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{t('author')}</span>
                </div>
              </div>
            </div>

            {article.image && (
              <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
                <Image
                  src={article.image || '/images/stories/placeholder-gem.svg'}
                  alt={article.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  priority
                />
              </div>
            )}

            <div className="p-8 pt-6">
              <div className="prose prose-lg max-w-none prose-slate dark:prose-invert">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                {article.content && (
                  <div className="mt-8">
                    <MarkdownRenderer content={article.content} />
                  </div>
                )}
              </div>
            </div>

            <div className="px-8 py-6 bg-muted/50 border-t border-border">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href={`/${locale}/wissenswertes`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('backToList')}
                  </Link>
                </Button>
                <Button asChild className="w-full sm:w-auto">
                  <Link href={`/${locale}/shop`}>
                    {t('discoverShop')}
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
