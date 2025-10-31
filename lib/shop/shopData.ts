import type { ShopGemstone } from '@/lib/services/shop/types';
import { fetchGemstoneById, listPublishedGemstones } from '@/lib/services/shop/gemstone.service';

export async function loadShopGemstones(): Promise<ShopGemstone[]> {
  return listPublishedGemstones();
}

export async function loadShopGemstoneById(id: string): Promise<ShopGemstone | null> {
  return fetchGemstoneById(id);
}
