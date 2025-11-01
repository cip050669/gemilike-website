import {
  getWishlistSummary,
  toggleWishlistItem,
  removeWishlistItem,
  clearWishlist,
} from '@/lib/actions/wishlist';
import { resolveShopIdentity } from '@/lib/server/shop-context';
import {
  getWishlistSummary as getWishlistSummaryForIdentity,
  toggleWishlistGemstone,
  removeWishlistItemById,
  clearWishlistItems,
} from '@/lib/services/shop/wishlist.service';

jest.mock('@/lib/server/shop-context', () => ({
  resolveShopIdentity: jest.fn(),
}));

jest.mock('@/lib/services/shop/wishlist.service', () => ({
  getWishlistSummary: jest.fn(),
  toggleWishlistGemstone: jest.fn(),
  removeWishlistItemById: jest.fn(),
  clearWishlistItems: jest.fn(),
}));

const mockedResolveIdentity = resolveShopIdentity as jest.MockedFunction<typeof resolveShopIdentity>;
const mockedGetSummary = getWishlistSummaryForIdentity as jest.MockedFunction<typeof getWishlistSummaryForIdentity>;
const mockedToggleGemstone = toggleWishlistGemstone as jest.MockedFunction<typeof toggleWishlistGemstone>;
const mockedRemoveWishlistItem = removeWishlistItemById as jest.MockedFunction<typeof removeWishlistItemById>;
const mockedClearWishlistItems = clearWishlistItems as jest.MockedFunction<typeof clearWishlistItems>;

describe('Wishlist Actions Integration', () => {
  const mockIdentity = {
    customerId: 'customer-1',
    wishlistSessionId: 'session-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedResolveIdentity.mockResolvedValue({
      userId: 'user-1',
      customerId: mockIdentity.customerId,
      cartSessionId: 'cart-session',
      wishlistSessionId: mockIdentity.wishlistSessionId,
      session: null,
    });
  });

  it('returns wishlist summary for resolved identity', async () => {
    const summary = { id: 'wishlist-1', items: [], totalItems: 0 };
    mockedGetSummary.mockResolvedValue(summary as any);

    const result = await getWishlistSummary();

    expect(result).toEqual(summary);
    expect(mockedGetSummary).toHaveBeenCalledWith(mockIdentity);
  });

  it('toggles gemstone for identity', async () => {
    mockedToggleGemstone.mockResolvedValue({} as any);

    await toggleWishlistItem('gem-1');

    expect(mockedToggleGemstone).toHaveBeenCalledWith(mockIdentity, 'gem-1');
  });

  it('removes wishlist item by id for identity', async () => {
    mockedRemoveWishlistItem.mockResolvedValue({} as any);

    await removeWishlistItem('item-1');

    expect(mockedRemoveWishlistItem).toHaveBeenCalledWith(mockIdentity, 'item-1');
  });

  it('clears wishlist for identity', async () => {
    mockedClearWishlistItems.mockResolvedValue({} as any);

    await clearWishlist();

    expect(mockedClearWishlistItems).toHaveBeenCalledWith(mockIdentity);
  });
});
