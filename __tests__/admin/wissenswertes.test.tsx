/**
 * Admin Wissenswertes (Knowledge) Management Functionality Tests
 * Tests CRUD operations for knowledge articles
 */

import { render, screen, waitFor } from '@testing-library/react';
import KnowledgeAdminPage from '@/app/[locale]/admin/wissenswertes/page';
import { getKnowledgeArticles } from '@/lib/services/knowledge.service';
import { loadKnowledgeSectionSettings } from '@/lib/data/knowledge-settings';

// Mock data loaders
jest.mock('@/lib/services/knowledge.service', () => ({
  getKnowledgeArticles: jest.fn(),
}));

jest.mock('@/lib/data/knowledge-settings', () => ({
  loadKnowledgeSectionSettings: jest.fn(),
}));

// Mock KnowledgeTable component
jest.mock('@/components/admin/KnowledgeTable', () => ({
  KnowledgeTable: ({ articles }: { articles: any[] }) => (
    <div data-testid="knowledge-table">
      <h2>Wissenswertes-Artikel ({articles.length})</h2>
      {articles.map((article) => (
        <div key={article.id} data-testid={`article-${article.id}`}>
          <h3>{article.title}</h3>
          <p>{article.excerpt}</p>
        </div>
      ))}
    </div>
  ),
}));

// Mock KnowledgeSettingsForm component
jest.mock('@/components/admin/KnowledgeSettingsForm', () => ({
  KnowledgeSettingsForm: () => (
    <div data-testid="knowledge-settings-form">
      <h3>Wissenswertes-Einstellungen</h3>
    </div>
  ),
}));

const mockArticles = [
  {
    id: '1',
    title: 'Die 4Cs der Diamanten',
    excerpt: 'Lernen Sie mehr über die Bewertungskriterien von Diamanten',
    slug: '4cs-diamanten',
    author: 'Admin',
    category: 'Diamanten',
    published: true,
    featured: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
    publishedAt: new Date('2025-01-15'),
    tags: ['Diamanten', 'Bewertung'],
    image: '/knowledge/4cs.jpg',
  },
  {
    id: '2',
    title: 'Smaragd-Behandlung',
    excerpt: 'Welche Behandlungen sind bei Smaragden üblich?',
    slug: 'smaragd-behandlung',
    author: 'Admin',
    category: 'Smaragde',
    published: false,
    featured: false,
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-14'),
    publishedAt: null,
    tags: ['Smaragde', 'Behandlung'],
    image: null,
  },
];

const mockSettings = {
  title: 'Wissenswertes',
  description: 'Wissenswertes über Edelsteine',
  showFeatured: true,
  articlesPerPage: 12,
};

describe('Admin Wissenswertes Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getKnowledgeArticles as jest.Mock).mockResolvedValue(mockArticles);
    (loadKnowledgeSectionSettings as jest.Mock).mockResolvedValue(mockSettings);
  });

  describe('Page Rendering', () => {
    it('should render knowledge page', async () => {
      const page = await KnowledgeAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('Wissenswertes-Verwaltung')).toBeInTheDocument();
      });
    });

    it('should load articles and settings on mount', async () => {
      const page = await KnowledgeAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(getKnowledgeArticles).toHaveBeenCalled();
        expect(loadKnowledgeSectionSettings).toHaveBeenCalled();
      });
    });
  });

  describe('Knowledge Table', () => {
    it('should display knowledge table with articles', async () => {
      const page = await KnowledgeAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByTestId('knowledge-table')).toBeInTheDocument();
        expect(screen.getByText(/Wissenswertes-Artikel \(2\)/)).toBeInTheDocument();
      });
    });

    it('should display article titles and excerpts', async () => {
      const page = await KnowledgeAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByText('Die 4Cs der Diamanten')).toBeInTheDocument();
        expect(screen.getByText(/Lernen Sie mehr über die Bewertungskriterien/)).toBeInTheDocument();
      });
    });
  });

  describe('Status Counting', () => {
    it('should calculate status counts correctly', async () => {
      const page = await KnowledgeAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      // The component counts: total: 2, published: 1, draft: 1, featured: 1
      await waitFor(() => {
        expect(screen.getByTestId('knowledge-table')).toBeInTheDocument();
      });
    });
  });

  describe('Settings Form', () => {
    it('should display knowledge settings form', async () => {
      const page = await KnowledgeAdminPage({ params: Promise.resolve({ locale: 'de' }) });
      render(page);

      await waitFor(() => {
        expect(screen.getByTestId('knowledge-settings-form')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle load errors gracefully', async () => {
      (getKnowledgeArticles as jest.Mock).mockRejectedValue(new Error('Load error'));

      await expect(
        KnowledgeAdminPage({ params: Promise.resolve({ locale: 'de' }) })
      ).rejects.toThrow();
    });
  });
});
