import Link from 'next/link';
import { loadBlogs } from '@/lib/data/blogs';
import type { BlogPost } from '@/lib/types/blog';
import { BlogTable } from '@/components/admin/BlogTable';

const toListItem = (blog: BlogPost) => ({
  id: blog.id,
  title: blog.title,
  excerpt: blog.excerpt,
  author: blog.author,
  category: blog.category,
  published: blog.published,
  featured: blog.featured,
  updatedAt:
    blog.updatedAt instanceof Date
      ? blog.updatedAt.toISOString()
      : String(blog.updatedAt),
  createdAt:
    blog.createdAt instanceof Date
      ? blog.createdAt.toISOString()
      : String(blog.createdAt),
  publishedAt:
    blog.publishedAt instanceof Date
      ? blog.publishedAt.toISOString()
      : blog.publishedAt,
  slug: blog.slug,
  tags: blog.tags,
});

const countByStatus = (blogs: BlogPost[]) => ({
  total: blogs.length,
  published: blogs.filter((blog) => blog.published).length,
  draft: blogs.filter((blog) => !blog.published).length,
  featured: blogs.filter((blog) => blog.featured).length,
});

export default async function BlogsAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const blogs = await loadBlogs();
  const sorted = [...blogs].sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.createdAt).getTime();
    const bTime = new Date(b.updatedAt ?? b.createdAt).getTime();
    return bTime - aTime;
  });
  const stats = countByStatus(sorted);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">
                Blog-Verwaltung
              </h1>
              <p className="text-gray-600">Verwalten Sie Ihre Blog-Beiträge</p>
            </div>
            <Link
              href={`/${locale}/admin/blogs/new`}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              + Neuer Blog-Beitrag
            </Link>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Gesamt</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.total}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">
              Veröffentlicht
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.published}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Entwürfe</h3>
            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {stats.draft}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Featured</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.featured}
            </p>
          </div>
        </div>

        {/* Blog Posts List */}
        <BlogTable blogs={sorted.map(toListItem)} locale={locale} />
      </div>
    </div>
  );
}
