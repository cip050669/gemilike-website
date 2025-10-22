'use client';

import { useRouter } from 'next/navigation';
import type { KnowledgeArticle } from '@/lib/types/knowledge';
import { KnowledgeEditor } from './KnowledgeEditor';

type SerializableKnowledge = Omit<KnowledgeArticle, 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

interface KnowledgeEditorContainerProps {
  mode: 'create' | 'edit';
  locale: string;
  article?: SerializableKnowledge;
}

export function KnowledgeEditorContainer({
  mode,
  locale,
  article,
}: KnowledgeEditorContainerProps) {
  const router = useRouter();

  const hydratedArticle = article
    ? ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt),
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : undefined,
      } satisfies KnowledgeArticle)
    : undefined;

  const handleSave = async (
    payload: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { slug?: string }
  ) => {
    const endpoint =
      mode === 'create' ? '/api/admin/knowledge' : `/api/admin/knowledge/${article?.id}`;
    const method = mode === 'create' ? 'POST' : 'PUT';
    const body =
      mode === 'create'
        ? payload
        : {
            ...payload,
            id: article?.id,
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

    router.push(`/${locale}/admin/wissenswertes`);
    router.refresh();
  };

  const handleCancel = () => {
    router.push(`/${locale}/admin/wissenswertes`);
  };

  return (
    <KnowledgeEditor
      article={hydratedArticle}
      onSave={handleSave}
      onCancel={handleCancel}
      isCreating={mode === 'create'}
    />
  );
}
