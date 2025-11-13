/**
 * Admin Stories Management Functionality Tests
 * Tests CRUD operations for stories
 */

import { render, screen } from '@testing-library/react';
import StoriesAdminPage from '@/app/[locale]/admin/stories/page';
import { loadStoriesData } from '@/lib/data/stories';

// Mock stories data loader
jest.mock('@/lib/data/stories', () => ({
  loadStoriesData: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/de/admin/stories',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockStories = [
  {
    id: '1',
    title: 'Die Geschichte des Smaragds',
    excerpt: 'Entdecken Sie die faszinierende Geschichte des Smaragds',
    slug: 'die-geschichte-des-smaragds',
    content: 'Vollständiger Inhalt...',
    status: 'published',
    author: 'Admin',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    title: 'Rubin: Ein königlicher Edelstein',
    excerpt: 'Alles über den Rubin',
    slug: 'rubin-koeniglicher-edelstein',
    content: 'Vollständiger Inhalt...',
    status: 'draft',
    author: 'Admin',
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-14'),
  },
];

describe('Admin Stories Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (loadStoriesData as jest.Mock).mockReturnValue(mockStories);
  });

  describe('Page Rendering', () => {
    it('should render stories page with title and description', () => {
      render(<StoriesAdminPage />);

      expect(screen.getByText('Stories-Verwaltung')).toBeInTheDocument();
      expect(screen.getByText(/Verwalten Sie die Geschichten hinter den Edelsteinen/)).toBeInTheDocument();
    });

    it('should display new story button', () => {
      render(<StoriesAdminPage />);

      const newButton = screen.getByText('+ Neue Story');
      expect(newButton.closest('a')).toHaveAttribute('href', '/de/admin/stories/new');
    });
  });

  describe('Stories List', () => {
    it('should load and display stories from data loader', () => {
      render(<StoriesAdminPage />);

      expect(loadStoriesData).toHaveBeenCalled();
    });

    it('should display story titles', () => {
      render(<StoriesAdminPage />);

      expect(screen.getByText('Die Geschichte des Smaragds')).toBeInTheDocument();
      expect(screen.getByText('Rubin: Ein königlicher Edelstein')).toBeInTheDocument();
    });

    it('should display story excerpts', () => {
      render(<StoriesAdminPage />);

      expect(screen.getByText(/Entdecken Sie die faszinierende Geschichte/)).toBeInTheDocument();
      expect(screen.getByText(/Alles über den Rubin/)).toBeInTheDocument();
    });

    it('should display status badges with correct colors', () => {
      render(<StoriesAdminPage />);

      expect(screen.getAllByText('Veröffentlicht').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Entwurf').length).toBeGreaterThan(0);
    });

    it('should format dates correctly', () => {
      render(<StoriesAdminPage />);

      // Check for German date format (DD.MM.YYYY)
      const dateElements = screen.getAllByText(/\d{2}\.\d{2}\.\d{4}/);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe('Status Functions', () => {
    it('should convert status to correct text', () => {
      render(<StoriesAdminPage />);

      expect(screen.getAllByText('Veröffentlicht').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Entwurf').length).toBeGreaterThan(0);
    });

    it('should apply correct status colors', () => {
      render(<StoriesAdminPage />);

      // Status badges should have appropriate styling
      const publishedBadge = screen.getAllByText('Veröffentlicht', { selector: 'span' })[0];
      expect(publishedBadge).toHaveClass('bg-green-100', 'text-green-800');
    });
  });

  describe('Actions', () => {
    it('should display edit links for each story', () => {
      render(<StoriesAdminPage />);

      const editLinks = screen.getAllByText('Bearbeiten');
      expect(editLinks.length).toBeGreaterThan(0);
      expect(editLinks[0].closest('a')).toHaveAttribute('href', '/de/admin/stories/edit/1');
    });

    it('should display view links for published stories', () => {
      render(<StoriesAdminPage />);

      const viewLinks = screen.getAllByText('Anzeigen');
      expect(viewLinks.length).toBeGreaterThan(0);
      expect(viewLinks[0].closest('a')).toHaveAttribute('href', '/de/stories/die-geschichte-des-smaragds');
    });
  });

  describe('Empty State', () => {
    it('should handle empty stories list', () => {
      (loadStoriesData as jest.Mock).mockReturnValue([]);

      render(<StoriesAdminPage />);

      // Page should still render
      expect(screen.getByText('Stories-Verwaltung')).toBeInTheDocument();
    });
  });
});
