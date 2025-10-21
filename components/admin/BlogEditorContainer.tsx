'use client';

import { useRouter } from 'next/navigation';
import { BlogEditor } from './BlogEditor';
import type { BlogPost } from '@/lib/types/blog';

type SerializableBlog = Omit<
  BlogPost,
  'createdAt' | 'updatedAt' | 'publishedAt'
> & {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

interface BlogEditorContainerProps {
  mode: 'create' | 'edit';
  locale: string;
  blog?: SerializableBlog;
}

export function BlogEditorContainer({
  mode,
  locale,
  blog,
}: BlogEditorContainerProps) {
  const router = useRouter();

  const hydratedBlog = blog
    ? ({
        ...blog,
        createdAt: new Date(blog.createdAt),
        updatedAt: new Date(blog.updatedAt),
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
      } satisfies BlogPost)
    : undefined;

  const handleSave = async (
    payload: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const endpoint =
      mode === 'create' ? '/api/admin/blogs' : `/api/admin/blogs/${blog?.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';
    const body =
      mode === 'create'
        ? payload
        : {
            ...payload,
            id: blog?.id,
          };

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error || 'Speichern fehlgeschlagen');
    }

    router.push(`/${locale}/admin/blogs`);
    router.refresh();
  };

  const handleCancel = () => {
    router.push(`/${locale}/admin/blogs`);
  };

  return (
    <BlogEditor
      blog={hydratedBlog}
      onSave={handleSave}
      onCancel={handleCancel}
      isCreating={mode === 'create'}
    />
  );
}
