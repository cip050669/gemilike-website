import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { KnowledgeArticle } from '@/lib/types/knowledge';

const KNOWLEDGE_FILE_PATH = join(process.cwd(), 'data', 'knowledge.json');
const DATA_DIR = join(process.cwd(), 'data');

type KnowledgeJson = Omit<KnowledgeArticle, 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  publishedAt?: string | Date | null;
};

const reviveKnowledgeDates = (article: KnowledgeJson): KnowledgeArticle => ({
  ...article,
  createdAt: article.createdAt ? new Date(article.createdAt) : new Date(),
  updatedAt: article.updatedAt ? new Date(article.updatedAt) : new Date(),
  publishedAt: article.publishedAt ? new Date(article.publishedAt) : undefined,
});

const ensureDataDir = async () => {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
};

export const loadKnowledgeArticles = async (): Promise<KnowledgeArticle[]> => {
  try {
    if (!existsSync(KNOWLEDGE_FILE_PATH)) {
      return [];
    }
    const raw = await readFile(KNOWLEDGE_FILE_PATH, 'utf-8');
    if (!raw.trim()) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(reviveKnowledgeDates) : [];
  } catch (error) {
    console.error('Error loading knowledge articles:', error);
    return [];
  }
};

export const saveKnowledgeArticles = async (articles: KnowledgeArticle[]): Promise<void> => {
  await ensureDataDir();
  await writeFile(
    KNOWLEDGE_FILE_PATH,
    JSON.stringify(articles, null, 2),
    'utf-8'
  );
};
