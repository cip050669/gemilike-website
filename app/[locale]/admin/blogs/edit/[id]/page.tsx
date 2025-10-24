import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogEditorContainer } from '@/components/admin/BlogEditorContainer';
import { loadBlogs } from '@/lib/data/blogs';

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const blogs = await loadBlogs();
  const blog = blogs.find((item) => item.id === id);

  if (!blog) {
    notFound();
  }

  const serializable = {
    ...blog,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
    publishedAt: blog.publishedAt?.toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Blog-Beitrag bearbeiten
            </h1>
            <p className="text-gray-300">
              Aktualisieren oder veröffentlichen Sie den ausgewählten Beitrag.
            </p>
          </div>
          <Link
            href={`/${locale}/admin/blogs`}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-100"
          >
            Zurück zur Übersicht
          </Link>
        </div>

        <BlogEditorContainer mode="edit" locale={locale} blog={serializable} />
      </div>
    </div>
  );
}
