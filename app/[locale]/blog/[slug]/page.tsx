import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import Image from 'next/image';
import { getBlogBySlug } from '@/lib/services/blog.service';

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const isEnglish = locale === 'en';
  const post = await getBlogBySlug(slug, locale);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl container-dark">
        {/* Back button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href={`/${locale}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isEnglish ? 'Back to home' : 'Zurück zur Startseite'}
            </Link>
          </Button>
        </div>

        {/* Blog-Post Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <Badge>{post.category}</Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.createdAt).toLocaleDateString(isEnglish ? 'en-GB' : 'de-DE')}</span>
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl">{post.title}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground mt-4">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
          </CardHeader>
        </Card>

        {/* Blog-Post Content */}
        <Card>
          <CardContent className="p-8">
            {/* Bild falls vorhanden */}
            {post.image &&
              ![
                '/images/stories/placeholder-gem.svg',
                '/blog/default-blog.jpg',
              ].includes(post.image) && (
              <div className="mb-8 relative w-full h-64">
                <Image 
                  src={post.image} 
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover rounded-lg"
                  priority={false}
                />
              </div>
            )}
            
            {/* Inhalt mit Markdown-Unterstützung */}
            <MarkdownRenderer content={post.content} />
            
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-4 w-4" />
                  <span className="text-sm font-medium">{isEnglish ? 'Tags:' : 'Tags:'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
