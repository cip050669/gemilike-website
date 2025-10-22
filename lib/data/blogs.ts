import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { BlogPost } from '@/lib/types/blog';

const BLOG_FILE_PATH = join(process.cwd(), 'data', 'blogs.json');
const DATA_DIR = join(process.cwd(), 'data');

type BlogJson = Omit<BlogPost, 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  publishedAt?: string | Date | null;
};

const reviveBlogDates = (blog: BlogJson): BlogPost => ({
  ...blog,
  createdAt: blog.createdAt ? new Date(blog.createdAt) : new Date(),
  updatedAt: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
  publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
});

const ensureDataDir = async () => {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
};

export const loadBlogs = async (): Promise<BlogPost[]> => {
  try {
    if (!existsSync(BLOG_FILE_PATH)) {
      return [];
    }
    const raw = await readFile(BLOG_FILE_PATH, 'utf-8');
    if (!raw.trim()) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BlogJson[]).map(reviveBlogDates) : [];
  } catch (error) {
    console.error('Error loading blogs:', error);
    return [];
  }
};

export const saveBlogs = async (blogs: BlogPost[]): Promise<void> => {
  await ensureDataDir();
  await writeFile(
    BLOG_FILE_PATH,
    JSON.stringify(blogs, null, 2),
    'utf-8'
  );
};
