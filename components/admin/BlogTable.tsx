'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type BlogListItem = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  published: boolean;
  featured: boolean;
  updatedAt: string;
  createdAt: string;
  publishedAt?: string;
  slug: string;
  tags: string[];
};

const statusBadgeClasses = (published: boolean) =>
  published
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800';

const statusLabel = (published: boolean) =>
  published ? 'Veröffentlicht' : 'Entwurf';

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'dd.MM.yyyy', { locale: de });
};

export function BlogTable({ blogs }: { blogs: BlogListItem[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [onlyPublished, setOnlyPublished] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return blogs.filter((blog) => {
      if (onlyPublished && !blog.published) return false;
      if (!needle) return true;
      return (
        blog.title.toLowerCase().includes(needle) ||
        blog.excerpt.toLowerCase().includes(needle) ||
        blog.author.toLowerCase().includes(needle) ||
        blog.category.toLowerCase().includes(needle) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [blogs, search, onlyPublished]);

  const handleDelete = async (id: string) => {
    if (!confirm('Diesen Blog-Beitrag wirklich löschen?')) {
      return;
    }
    startTransition(async () => {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json().catch(() => null);
        alert(data?.error ?? 'Löschen fehlgeschlagen');
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Blog-Beiträge ({filtered.length} von {blogs.length})
            </h2>
            {isPending && (
              <p className="text-sm text-gray-500 mt-1">
                Aktualisiere Liste…
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="search"
              placeholder="Suche nach Titel, Autor oder Tag"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={onlyPublished}
                onChange={(event) => setOnlyPublished(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Nur veröffentlichte Beiträge
            </label>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          Keine Blog-Beiträge gefunden.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titel &amp; Auszug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktualisiert
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {blog.title}
                    </div>
                    <div className="text-xs text-blue-500 mb-1">{`/${blog.slug}`}</div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {blog.excerpt}
                    </p>
                    {blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {blog.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {blog.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {blog.author}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadgeClasses(
                        blog.published
                      )}`}
                    >
                      {statusLabel(blog.published)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(blog.updatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <Link
                        href={`/de/admin/blogs/edit/${blog.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Bearbeiten
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isPending}
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
