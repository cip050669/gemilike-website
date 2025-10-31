'use server';

import { resolveShopIdentity } from '@/lib/server/shop-context';
import {
  clearWishlistItems,
  getWishlistSummary as getWishlistSummaryForIdentity,
  removeWishlistItemById,
  toggleWishlistGemstone,
} from '@/lib/services/shop/wishlist.service';
import type { WishlistSummary } from '@/lib/services/shop/wishlist.service';

const buildIdentity = (identity: Awaited<ReturnType<typeof resolveShopIdentity>>) => ({
  customerId: identity.customerId,
  wishlistSessionId: identity.wishlistSessionId,
});

export type { WishlistItemDTO, WishlistSummary } from '@/lib/services/shop/wishlist.service';

export const getWishlistSummary = async (): Promise<WishlistSummary> => {
  const identity = await resolveShopIdentity();
  return getWishlistSummaryForIdentity(buildIdentity(identity));
};

export const toggleWishlistItem = async (gemstoneId: string): Promise<WishlistSummary> => {
  const identity = await resolveShopIdentity();
  return toggleWishlistGemstone(buildIdentity(identity), gemstoneId);
};

export const removeWishlistItem = async (wishlistItemId: string): Promise<WishlistSummary> => {
  const identity = await resolveShopIdentity();
  return removeWishlistItemById(buildIdentity(identity), wishlistItemId);
};

export const clearWishlist = async (): Promise<WishlistSummary> => {
  const identity = await resolveShopIdentity();
  return clearWishlistItems(buildIdentity(identity));
};
