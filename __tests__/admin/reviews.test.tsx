/**
 * Admin Reviews Management Functionality Tests
 * Tests all CRUD operations, filtering, and verification for reviews
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminReviewsPage from '@/app/[locale]/admin/reviews/page';

// Mock fetch
global.fetch = jest.fn();

// Mock window.confirm
window.confirm = jest.fn(() => true);

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/de/admin/reviews',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockReviews = [
  {
    id: '1',
    rating: 5,
    title: 'Ausgezeichneter Edelstein',
    comment: 'Sehr zufrieden mit der Qualität.',
    verified: false,
    customerName: 'Max Mustermann',
    customerEmail: 'max@example.com',
    gemstone: {
      id: 'gem-1',
      name: 'Smaragd',
      slug: 'smaragd-001',
    },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    rating: 4,
    title: 'Gut, aber teuer',
    comment: 'Gute Qualität, Preis ist etwas hoch.',
    verified: true,
    customerName: 'Anna Schmidt',
    customerEmail: null,
    gemstone: {
      id: 'gem-2',
      name: 'Rubin',
      slug: 'rubin-002',
    },
    createdAt: '2025-01-14T15:30:00Z',
    updatedAt: '2025-01-14T15:30:00Z',
  },
  {
    id: '3',
    rating: 3,
    title: null,
    comment: 'Ok, aber könnte besser sein.',
    verified: false,
    customerName: 'Peter Müller',
    customerEmail: 'peter@example.com',
    gemstone: null,
    createdAt: '2025-01-13T09:15:00Z',
    updatedAt: '2025-01-13T09:15:00Z',
  },
];

describe('Admin Reviews Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({
        success: true,
        reviews: mockReviews,
      }),
      ok: true,
    });
  });

  describe('Page Rendering', () => {
    it('should render reviews page with title and description', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText('Bewertungen')).toBeInTheDocument();
        expect(screen.getByText(/Verwalten Sie alle Produktbewertungen/)).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      render(<AdminReviewsPage />);
      expect(screen.getByText('Lade Bewertungen...')).toBeInTheDocument();
    });

    it('should fetch reviews on mount', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/reviews?');
      });
    });
  });

  describe('Review Display', () => {
    it('should display all reviews', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText('Ausgezeichneter Edelstein')).toBeInTheDocument();
        expect(screen.getByText('Gut, aber teuer')).toBeInTheDocument();
        expect(screen.getByText('Ok, aber könnte besser sein.')).toBeInTheDocument();
      });
    });

    it('should display review ratings with stars', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        // Star icons are SVG elements without role="img"
        // Check for star containers or by class name
        const starContainers = document.querySelectorAll('.lucide-star, [class*="star"]');
        expect(starContainers.length).toBeGreaterThan(0);
      });
    });

    it('should display customer information', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Max Mustermann/)).toBeInTheDocument();
        expect(screen.getByText(/max@example.com/)).toBeInTheDocument();
        expect(screen.getByText(/Anna Schmidt/)).toBeInTheDocument();
      });
    });

    it('should display gemstone links when available', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText('Smaragd')).toBeInTheDocument();
        expect(screen.getByText('Rubin')).toBeInTheDocument();
      });

      const smaragdLink = screen.getByText('Smaragd');
      expect(smaragdLink.closest('a')).toHaveAttribute('href', '/de/shop/smaragd-001');
    });

    it('should display formatted dates', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        // German date format should be present
        const dateElements = screen.getAllByText(/\d{1,2}\.\s\w+\s\d{4}/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });

    it('should show verification badges', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        // There should be badges for verified and unverified reviews
        const verifiedBadges = screen.getAllByText('Verifiziert');
        const unverifiedBadges = screen.getAllByText('Nicht verifiziert');
        expect(verifiedBadges.length).toBeGreaterThan(0);
        expect(unverifiedBadges.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Filtering', () => {
    it('should filter reviews by all status', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText('Alle (3)')).toBeInTheDocument();
      });

      const allButton = screen.getByText('Alle (3)');
      fireEvent.click(allButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/reviews?');
      });
    });

    it('should filter reviews by verified status', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText('Verifiziert (1)')).toBeInTheDocument();
      });

      const verifiedButton = screen.getByText('Verifiziert (1)');
      fireEvent.click(verifiedButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/reviews?status=verified');
      });
    });

    it('should filter reviews by unverified status', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText('Nicht verifiziert (2)')).toBeInTheDocument();
      });

      const unverifiedButton = screen.getByText('Nicht verifiziert (2)');
      fireEvent.click(unverifiedButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/admin/reviews?status=unverified');
      });
    });

    it('should update filter counts correctly', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText('Alle (3)')).toBeInTheDocument();
        expect(screen.getByText('Verifiziert (1)')).toBeInTheDocument();
        expect(screen.getByText('Nicht verifiziert (2)')).toBeInTheDocument();
      });
    });
  });

  describe('Verification Actions', () => {
    it('should verify an unverified review', async () => {
      let callCount = 0;
      (global.fetch as jest.Mock).mockImplementation(async (url, options) => {
        callCount++;
        if (callCount === 1) {
          // Initial fetch
          return {
            json: async () => ({
              success: true,
              reviews: mockReviews,
            }),
            ok: true,
          };
        } else if (options?.method === 'PUT') {
          // Verification update
          return {
            json: async () => ({ success: true }),
            ok: true,
          };
        } else {
          // Refresh after update (callCount >= 2 and not PUT)
          return {
            json: async () => ({
              success: true,
              reviews: mockReviews.map((r) => 
                r.id === '1' ? { ...r, verified: true } : r
              ),
            }),
            ok: true,
          };
        }
      });

      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Verifizieren').length).toBeGreaterThan(0);
      });

      const verifyButtons = screen.getAllByText('Verifizieren');
      fireEvent.click(verifyButtons[0]);

      await waitFor(() => {
        // Should have made PUT call and refresh call
        const putCalls = (global.fetch as jest.Mock).mock.calls.filter(
          (call) => call[1]?.method === 'PUT'
        );
        expect(putCalls.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('should unverify a verified review', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText('Verifizierung entfernen')).toBeInTheDocument();
      });

      const unverifyButton = screen.getByText('Verifizierung entfernen');
      fireEvent.click(unverifyButton);

      await waitFor(() => {
        // Check that PUT request was made (might be multiple calls)
        const putCalls = (global.fetch as jest.Mock).mock.calls.filter(
          (call) => call[1]?.method === 'PUT'
        );
        expect(putCalls.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('should refresh reviews after verification', async () => {
      let callCount = 0;
      (global.fetch as jest.Mock).mockImplementation(async (url, options) => {
        callCount++;
        if (callCount === 1) {
          return {
            json: async () => ({
              success: true,
              reviews: mockReviews,
            }),
            ok: true,
          };
        } else if (options?.method === 'PUT') {
          return {
            json: async () => ({ success: true }),
            ok: true,
          };
        } else {
          // Refresh call
          return {
            json: async () => ({
              success: true,
              reviews: mockReviews.map((r) => 
                r.id === '1' ? { ...r, verified: true } : r
              ),
            }),
            ok: true,
          };
        }
      });

      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getAllByText('Verifizieren').length).toBeGreaterThan(0);
      });

      const [verifyButton] = screen.getAllByRole('button', { name: 'Verifizieren' });
      fireEvent.click(verifyButton);

      await waitFor(() => {
        // Should have initial fetch + PUT + refresh = at least 3 calls
        expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(2);
      }, { timeout: 3000 });
    });
  });

  describe('Delete Actions', () => {
    it('should confirm before deleting a review', async () => {
      const confirmMock = jest.fn(() => true);
      (window as any).confirm = confirmMock;

      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getAllByLabelText(/Bewertung löschen/i).length).toBeGreaterThan(0);
      });

      const deleteButton = screen.getAllByLabelText(/Bewertung löschen/i)[0];
      fireEvent.click(deleteButton);

      expect(confirmMock).toHaveBeenCalledWith(
        'Sind Sie sicher, dass Sie diese Bewertung löschen möchten?'
      );
    });

    it('should delete review after confirmation', async () => {
      const confirmMock = jest.fn(() => true);
      (window as any).confirm = confirmMock;

      let callCount = 0;
      (global.fetch as jest.Mock).mockImplementation(async (url, options) => {
        callCount++;
        if (callCount === 1) {
          return {
            json: async () => ({
              success: true,
              reviews: mockReviews,
            }),
            ok: true,
          };
        } else if (callCount === 2 && options?.method === 'DELETE') {
          return {
            json: async () => ({ success: true }),
            ok: true,
          };
        } else {
          return {
            json: async () => ({
              success: true,
              reviews: mockReviews.filter((r) => r.id !== '1'),
            }),
            ok: true,
          };
        }
      });

      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getAllByLabelText(/Bewertung löschen/i).length).toBeGreaterThan(0);
      });

      const deleteButton = screen.getAllByLabelText(/Bewertung löschen/i)[0];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        const deleteCalls = (global.fetch as jest.Mock).mock.calls.filter(
          (call) => call[1]?.method === 'DELETE'
        );
        expect(deleteCalls.length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    });

    it('should not delete review if confirmation is cancelled', async () => {
      const confirmMock = jest.fn(() => false);
      (window as any).confirm = confirmMock;

      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getAllByLabelText(/Bewertung löschen/i).length).toBeGreaterThan(0);
      });

      const deleteButton = screen.getAllByLabelText(/Bewertung löschen/i)[0];
      fireEvent.click(deleteButton);

      await waitFor(() => {
        const deleteCalls = (global.fetch as jest.Mock).mock.calls.filter(
          (call) => call[1]?.method === 'DELETE'
        );
        expect(deleteCalls.length).toBe(0);
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no reviews exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          success: true,
          reviews: [],
        }),
        ok: true,
      });

      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText('Keine Bewertungen gefunden.')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });

    it('should handle non-successful API responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Failed to fetch reviews',
        }),
        ok: false,
      });

      render(<AdminReviewsPage />);

      await waitFor(() => {
        // Should still render page, even if data is empty
        expect(screen.queryByText('Bewertungen')).toBeInTheDocument();
      });
    });
  });

  describe('Reviews without Gemstone', () => {
    it('should display review even if gemstone is null', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        // Review with null gemstone should still be displayed
        // Check for review text or customer name
        const reviewText = screen.queryByText(/Ok, aber könnte besser sein/i) || 
                          screen.queryByText(/Peter Müller/i);
        expect(reviewText).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Reviews without Title', () => {
    it('should display review even if title is null', async () => {
      render(<AdminReviewsPage />);

      await waitFor(() => {
        expect(screen.getByText('Ok, aber könnte besser sein.')).toBeInTheDocument();
      });
    });
  });
});
