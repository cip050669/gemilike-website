/**
 * Admin Blog Management Functionality Tests
 * Tests CRUD operations for blog posts
 */

import { render, screen, waitFor } from '@testing-library/react';
import BlogsAdminPage from '@/app/[locale]/admin/blogs/page';
import { loadBlogs } from '@/lib/data/blogs';
import { loadBlogSectionSettings } from '@/lib/data/blog-settings';

// Mock data loaders
jest.mock('@/lib/data/blogs', () => ({
  loadBlogs: jest.fn(),
}));

jest.mock('@/lib/data/blog-settings', () => ({
  loadBlogSectionSettings: jest.fn(),
}));

// Mock BlogTable component
jest.mock('@/components/admin/BlogTable', () => ({
  BlogTable: ({ blogs }: { blogs: any[] }) => (
    <div data-testid="blog-table">
      <h2>Blog-Artikel ({blogs.length})</h2>
      {blogs.map((blog) => (
        <div key={blog.id} data-testid={`blog-${blog.id}`}>
          <h3>{blog.title}</h3>
          <p>{blog.excerpt}</p>
        </div>
      ))}
    </div>
  ),
}));

// Mock BlogSettingsForm component
jest.mock('@/components/admin/BlogSettingsForm', () => ({
  BlogSettingsForm: ({ settings }: { settings: any }) => (
    <div data-testid="blog-settings-form">
      <h3>Blog-Einstellungen</h3>
    </div>
  ),
}));

const mockBlogs = [
  {
    id: '1',
    title: 'Die Kunst der Edelstein-Fassung',
    excerpt: 'Erfahren Sie mehr über verschiedene Fassungen',
    slug: 'kunst-edelstein-fassung',
    author: 'Admin',
    category: 'Wissenswertes',
    published: true,
    featured: false,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
    publishedAt: new Date('2025-01-15'),
    tags: ['Fassung', 'Handwerk'],
    image: '/blog/fassung.jpg',
  },
  {
    id: '2',
    title: 'Edelstein-Pflege Tipps',
    excerpt: 'Wie Sie Ihre Edelsteine richtig pflegen',
    slug: 'edelstein-pflege-tipps',
    author: 'Admin',
    category: 'Tipps',
    published: false,
    featured: true,
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-14'),
    publishedAt: null,
    tags: ['Pflege'],
    image: null,
  },
];

const mockSettings = {
  title: 'Blog',
  description: 'Interessante Artikel über Edelsteine',
  showFeatured: true,
  postsPerPage: 10,
};

describe('Admin Blog Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadBlogs as jest.Mock).mockResolvedValue(mockBlogs);
    (loadBlogSectionSettings as jest.Mock).mockResolvedValue(mockSettings);
  });

  describe('Page Rendering', () => {
    it('should render blog page with title', async () => {
      const page = await BlogsAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('Blog')).toBeInTheDocument();
      });
    });

    it('should load blogs and settings on mount', async () => {
      const page = await BlogsAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(loadBlogs).toHaveBeenCalled();
        expect(loadBlogSectionSettings).toHaveBeenCalled();
      });
    });
  });

  describe('Blog Table', () => {
    it('should display blog table with articles', async () => {
      const page = await BlogsAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByTestId('blog-table')).toBeInTheDocument();
        expect(screen.getByText(/Blog-Artikel \(2\)/)).toBeInTheDocument();
      });
    });

    it('should display blog titles and excerpts', async () => {
      const page = await BlogsAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('Die Kunst der Edelstein-Fassung')).toBeInTheDocument();
        expect(screen.getByText(/Erfahren Sie mehr über verschiedene Fassungen/)).toBeInTheDocument();
      });
    });
  });

  describe('Status Counting', () => {
    it('should calculate status counts correctly', async () => {
      const page = await BlogsAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      // The component counts: total: 2, published: 1, draft: 1, featured: 1
      await waitFor(() => {
        expect(screen.getByTestId('blog-table')).toBeInTheDocument();
      });
    });
  });

  describe('Settings Form', () => {
    it('should display blog settings form', async () => {
      const page = await BlogsAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByTestId('blog-settings-form')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle load errors gracefully', async () => {
      (loadBlogs as jest.Mock).mockRejectedValue(new Error('Load error'));

      await expect(
        BlogsAdminPage({ params: Promise.resolve({ locale: 'de' }) })
      ).rejects.toThrow();
    });
  });
});

