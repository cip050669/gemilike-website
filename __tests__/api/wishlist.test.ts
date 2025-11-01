import { NextRequest } from 'next/server';
import { GET, POST, DELETE } from '@/app/api/wishlist/route';
import * as wishlistActions from '@/lib/actions/wishlist';

jest.mock('@/lib/actions/wishlist', () => ({
  getWishlistSummary: jest.fn(),
  toggleWishlistItem: jest.fn(),
  removeWishlistItem: jest.fn(),
  clearWishlist: jest.fn(),
}));

jest.mock('next/server', () => {
  const actual = jest.requireActual('next/server');
  return {
    ...actual,
    NextResponse: {
      ...actual.NextResponse,
      json: jest.fn((body, init) => ({
        status: init?.status ?? 200,
        json: async () => body,
        text: async () => JSON.stringify(body),
        ok: (init?.status ?? 200) >= 200 && (init?.status ?? 200) < 300,
        headers: new Headers(),
      })),
    },
  };
});

const mockedWishlistActions = wishlistActions as jest.Mocked<typeof wishlistActions>;

describe('Wishlist API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/wishlist', () => {
    it('returns wishlist summary on success', async () => {
      const mockSummary = { id: 'wishlist-1', items: [], totalItems: 0 };
      mockedWishlistActions.getWishlistSummary.mockResolvedValue(mockSummary as any);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockSummary);
      expect(mockedWishlistActions.getWishlistSummary).toHaveBeenCalled();
    });

    it('handles errors gracefully', async () => {
      mockedWishlistActions.getWishlistSummary.mockRejectedValue(new Error('db error'));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/wishlist', () => {
    it('toggles wishlist item when gemstoneId provided', async () => {
      const mockSummary = { id: 'wishlist-1', items: [{ id: 'item-1' }], totalItems: 1 };
      mockedWishlistActions.toggleWishlistItem.mockResolvedValue(mockSummary as any);

      const request = new NextRequest('http://localhost/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ gemstoneId: 'gem-123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockSummary);
      expect(mockedWishlistActions.toggleWishlistItem).toHaveBeenCalledWith('gem-123');
    });

    it('validates gemstoneId payload', async () => {
      const request = new NextRequest('http://localhost/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('gemstoneId is required');
      expect(mockedWishlistActions.toggleWishlistItem).not.toHaveBeenCalled();
    });

    it('handles toggle errors', async () => {
      mockedWishlistActions.toggleWishlistItem.mockRejectedValue(new Error('db error'));

      const request = new NextRequest('http://localhost/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ gemstoneId: 'gem-123' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('DELETE /api/wishlist', () => {
    it('removes wishlist item by id', async () => {
      const mockSummary = { id: 'wishlist-1', items: [], totalItems: 0 };
      mockedWishlistActions.removeWishlistItem.mockResolvedValue(mockSummary as any);

      const request = new NextRequest('http://localhost/api/wishlist?wishlistItemId=item-1', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockSummary);
      expect(mockedWishlistActions.removeWishlistItem).toHaveBeenCalledWith('item-1');
    });

    it('toggles wishlist item when gemstoneId provided', async () => {
      const mockSummary = { id: 'wishlist-1', items: [], totalItems: 0 };
      mockedWishlistActions.toggleWishlistItem.mockResolvedValue(mockSummary as any);

      const request = new NextRequest('http://localhost/api/wishlist?gemstoneId=gem-1', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockSummary);
      expect(mockedWishlistActions.toggleWishlistItem).toHaveBeenCalledWith('gem-1');
    });

    it('validates parameters when none provided', async () => {
      const request = new NextRequest('http://localhost/api/wishlist', { method: 'DELETE' });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('wishlistItemId or gemstoneId is required');
      expect(mockedWishlistActions.removeWishlistItem).not.toHaveBeenCalled();
      expect(mockedWishlistActions.toggleWishlistItem).not.toHaveBeenCalled();
    });

    it('handles removal errors', async () => {
      mockedWishlistActions.removeWishlistItem.mockRejectedValue(new Error('db error'));

      const request = new NextRequest('http://localhost/api/wishlist?wishlistItemId=item-1', {
        method: 'DELETE',
      });

      const response = await DELETE(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
