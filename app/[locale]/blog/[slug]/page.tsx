import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { BlogPost } from '@/lib/types/blog';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Lade Blog-Posts direkt aus der JSON-Datei
async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogFile = join(process.cwd(), 'data', 'blogs.json');
    const data = await readFile(blogFile, 'utf-8');
    const blogs = JSON.parse(data);
    
    return blogs.map((blog: any) => ({
      ...blog,
      createdAt: new Date(blog.createdAt),
      updatedAt: new Date(blog.updatedAt),
      publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
    }));
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const t = await import(`@/messages/${locale}.json`).then(m => m.default);
  const blogPosts = await getBlogPosts();
  
  // Finde den Blog-Post anhand des Slugs
  const post = blogPosts.find(p => p.slug === slug && p.published);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl container-dark">
        {/* Zurück-Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href={`/${locale}/blog`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zur Blog-Übersicht
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
                <span>{new Date(post.createdAt).toLocaleDateString('de-DE')}</span>
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
            {post.image && post.image !== '/blog/default-blog.jpg' && (
              <div className="mb-8">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg"
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
                  <span className="text-sm font-medium">Tags:</span>
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
