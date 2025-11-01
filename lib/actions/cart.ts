'use server';

import { resolveShopIdentity } from '@/lib/server/shop-context';
import {
  addGemstoneToCart,
  clearCartItems,
  getCartSummaryForIdentity,
  removeCartItemById,
  updateCartItemQuantityForIdentity,
} from '@/lib/services/shop/cart.service';
import type { CartSummary, CartIdentity } from '@/lib/services/shop/cart.service';

const buildIdentity = (
  identity: Awaited<ReturnType<typeof resolveShopIdentity>>
): CartIdentity => ({
  customerId: identity.customerId,
  cartSessionId: identity.cartSessionId,
});

export type { CartItemDTO, CartSummary } from '@/lib/services/shop/cart.service';

export const getCartSummary = async (): Promise<CartSummary> => {
  const identity = await resolveShopIdentity();
  return getCartSummaryForIdentity(buildIdentity(identity));
};

export const addCartItem = async (
  gemstoneId: string,
  quantity = 1
): Promise<CartSummary> => {
  const identity = await resolveShopIdentity();
  return addGemstoneToCart(buildIdentity(identity), gemstoneId, quantity);
};

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
): Promise<CartSummary> => {
  const identity = await resolveShopIdentity();
  return updateCartItemQuantityForIdentity(buildIdentity(identity), cartItemId, quantity);
};

export const removeCartItem = async (cartItemId: string): Promise<CartSummary> => {
  const identity = await resolveShopIdentity();
  return removeCartItemById(buildIdentity(identity), cartItemId);
};

export const clearActiveCart = async (): Promise<CartSummary> => {
  const identity = await resolveShopIdentity();
  return clearCartItems(buildIdentity(identity));
};
