import type { ShopGemstone } from '@/lib/services/shop/types';
import {
  getPrismaConnectionErrorSummary,
  isPrismaConnectionError,
  probeDatabaseReachable,
} from '@/lib/prisma';
import { fetchGemstoneById, listPublishedGemstones } from '@/lib/services/shop/gemstone.service';
import { getDevCatalogFallbackGemstones } from '@/lib/shop/devCatalogFallback';

let loggedDevShopFallback = false;

export async function loadShopGemstones(): Promise<ShopGemstone[]> {
  try {
    const fromDb = await listPublishedGemstones();
    if (fromDb.length > 0) {
      return fromDb;
    }

    const allowDevFallback =
      process.env.NODE_ENV === 'development' && process.env.SHOP_DEV_FALLBACK !== '0';
    if (!allowDevFallback) {
      return fromDb;
    }

    if (await probeDatabaseReachable()) {
      return fromDb;
    }

    if (!loggedDevShopFallback) {
      loggedDevShopFallback = true;
      console.warn(
        '[shop] Keine DB-Verbindung — zeige Demo-Edelsteine (nur development). ' +
          'Echte Daten: `npm run db:up`, dann `npx prisma migrate deploy` und `npm run seed`. ' +
          'Demo abschalten: SHOP_DEV_FALLBACK=0'
      );
    }
    return getDevCatalogFallbackGemstones();
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      console.warn(`Shop gemstones unavailable: ${getPrismaConnectionErrorSummary(error)}`);
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.SHOP_DEV_FALLBACK !== '0' &&
        !(await probeDatabaseReachable())
      ) {
        return getDevCatalogFallbackGemstones();
      }
      return [];
    }

    console.error('Shop gemstones unavailable.', error);
    return [];
  }
}

export async function loadShopGemstoneById(id: string): Promise<ShopGemstone | null> {
  try {
    const gem = await fetchGemstoneById(id);
    if (gem) {
      return gem;
    }
    if (
      process.env.NODE_ENV === 'development' &&
      process.env.SHOP_DEV_FALLBACK !== '0' &&
      id.startsWith('dev-fallback-')
    ) {
      return getDevCatalogFallbackGemstones().find((g) => g.id === id) ?? null;
    }
    return null;
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      console.warn(`Shop gemstone ${id} unavailable: ${getPrismaConnectionErrorSummary(error)}`);
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.SHOP_DEV_FALLBACK !== '0' &&
        id.startsWith('dev-fallback-')
      ) {
        return getDevCatalogFallbackGemstones().find((g) => g.id === id) ?? null;
      }
      return null;
    }

    console.error(`Shop gemstone ${id} unavailable.`, error);
    return null;
  }
}
