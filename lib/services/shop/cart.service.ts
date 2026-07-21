import { Prisma } from '@prisma/client';
import {
  getPrismaConnectionErrorSummary,
  isPrismaConnectionError,
  prisma,
  withRetry,
} from '@/lib/prisma';
import {
  gemstoneWithRelationsInclude,
  toShopGemstone,
  type GemstoneWithRelations,
} from './gemstone.service';

export const cartWithItemsInclude = {
  items: {
    include: {
      gemstone: {
        include: gemstoneWithRelationsInclude,
      },
    },
  },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{
  include: typeof cartWithItemsInclude;
}>;

export interface CartIdentity {
  customerId?: string | null;
  cartSessionId?: string | null;
}

const decimalToNumber = (value: Prisma.Decimal | number | string): number => {
  if (value instanceof Prisma.Decimal) return Number(value);
  if (typeof value === 'string') return Number(value);
  return value;
};

export interface CartItemDTO {
  id: string;
  gemstoneId: string;
  name: string;
  slug?: string | null;
  quantity: number;
  price: number;
  currency: string;
  image?: string | null;
  isSold: boolean;
  category?: string | null;
  weight?: number | null;
  weightUnit?: 'ct' | 'g';
  origin?: string | null;
}

export interface CartSummary {
  id: string;
  currency: string;
  items: CartItemDTO[];
  totalQuantity: number;
  totalPrice: number;
}

const createEmptyCartSummary = (currency = 'EUR'): CartSummary => ({
  id: 'unavailable-cart',
  currency,
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
});

const serializeCartItems = (cart: CartWithItems): CartItemDTO[] => {
  return cart.items.map((item) => {
    const gemstoneEntity = item.gemstone
      ? toShopGemstone(item.gemstone as GemstoneWithRelations)
      : null;

    return {
      id: item.id,
      gemstoneId: item.gemstoneId,
      name: gemstoneEntity?.name ?? 'Edelstein',
      slug: gemstoneEntity?.slug ?? null,
      quantity: item.quantity,
      price: decimalToNumber(item.priceSnapshot),
      currency: cart.currency,
      image: gemstoneEntity?.images[0] ?? null,
      isSold: gemstoneEntity?.isSold ?? false,
      category: gemstoneEntity?.category ?? null,
      weight: gemstoneEntity?.weight ?? null,
      weightUnit: gemstoneEntity?.weightUnit ?? 'ct',
      origin: gemstoneEntity?.origin ?? null,
    };
  });
};

export const serializeCart = (cart: CartWithItems): CartSummary => {
  const items = serializeCartItems(cart);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    currency: cart.currency,
    items,
    totalPrice,
    totalQuantity,
  };
};

const findActiveCartForCustomer = async (customerId: string) => {
  return prisma.cart.findFirst({
    where: {
      status: 'ACTIVE',
      customerId,
    },
    include: cartWithItemsInclude,
  });
};

const findActiveCartForSession = async (sessionId: string) => {
  return prisma.cart.findFirst({
    where: {
      status: 'ACTIVE',
      sessionId,
    },
    include: cartWithItemsInclude,
  });
};

export const loadOrCreateActiveCart = async (identity: CartIdentity): Promise<CartWithItems> => {
  const { customerId, cartSessionId } = identity;

  if (customerId) {
    const customerCart = await findActiveCartForCustomer(customerId);
    if (customerCart) {
      return customerCart;
    }

    if (cartSessionId) {
      const sessionCart = await findActiveCartForSession(cartSessionId);
      if (sessionCart) {
        return prisma.cart.update({
          where: { id: sessionCart.id },
          data: {
            customerId,
            sessionId: null,
          },
          include: cartWithItemsInclude,
        });
      }
    }
  }

  if (cartSessionId) {
    const sessionCart = await findActiveCartForSession(cartSessionId);
    if (sessionCart) {
      return sessionCart;
    }
  }

  return prisma.cart.create({
    data: {
      status: 'ACTIVE',
      currency: 'EUR',
      customerId: customerId ?? null,
      sessionId: customerId ? null : cartSessionId ?? null,
    },
    include: cartWithItemsInclude,
  });
};

const resolveGemstonePrice = async (gemstoneId: string) => {
  const gemstone = await prisma.gemstone.findUnique({
    where: { id: gemstoneId },
    include: {
      priceBooks: {
        orderBy: [
          { validFrom: 'desc' },
          { createdAt: 'desc' },
        ],
        take: 1,
      },
      inventory: true,
    },
  });

  if (!gemstone) {
    throw new Error('Edelstein nicht gefunden.');
  }

  if (gemstone.isSold || gemstone.inventory?.quantity === 0) {
    throw new Error('Dieser Edelstein ist nicht verfügbar.');
  }

  // Prisma 7: Typ-Assertion für priceBooks Array
  const priceBooks = (gemstone.priceBooks as Array<{
    priceGross: Prisma.Decimal | null;
    priceNet: Prisma.Decimal | null;
    currency: string | null;
  }>) ?? [];
  const price = priceBooks[0]?.priceGross ?? priceBooks[0]?.priceNet;
  const currency = priceBooks[0]?.currency ?? 'EUR';

  if (!price) {
    throw new Error('Preis für Edelstein nicht verfügbar.');
  }

  return {
    price,
    currency,
  };
};

export const getCartSummaryForIdentity = async (identity: CartIdentity): Promise<CartSummary> => {
  try {
    const cart = await withRetry(() => loadOrCreateActiveCart(identity));
    return serializeCart(cart);
  } catch (error) {
    if (isPrismaConnectionError(error)) {
      console.warn(
        `Cart summary unavailable: ${getPrismaConnectionErrorSummary(error)}`
      );
      return createEmptyCartSummary();
    }

    throw error;
  }
};

export const addGemstoneToCart = async (
  identity: CartIdentity,
  gemstoneId: string,
  quantity = 1
): Promise<CartSummary> => {
  if (quantity < 1) {
    throw new Error('Mindestmenge ist 1.');
  }

  const cart = await loadOrCreateActiveCart(identity);
  const { price, currency } = await resolveGemstonePrice(gemstoneId);

  // Prisma 7: $transaction-Typ-Workaround
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatedCart = await (prisma.$transaction as any)(async (tx: any) => {
    const existing = await tx.cartItem.findFirst({
      where: {
        cartId: cart.id,
        gemstoneId,
      },
    });

    if (existing) {
      await tx.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + quantity,
          priceSnapshot: price,
        },
      });
    } else {
      await tx.cartItem.create({
        data: {
          cartId: cart.id,
          gemstoneId,
          quantity,
          priceSnapshot: price,
        },
      });
    }

    return tx.cart.update({
      where: { id: cart.id },
      data: { currency },
      include: cartWithItemsInclude,
    });
  });

  return serializeCart(updatedCart);
};

export const updateCartItemQuantityForIdentity = async (
  identity: CartIdentity,
  cartItemId: string,
  quantity: number
): Promise<CartSummary> => {
  if (quantity < 0) {
    throw new Error('Menge darf nicht negativ sein.');
  }

  const cart = await loadOrCreateActiveCart(identity);
  const item = cart.items.find((entry) => entry.id === cartItemId);

  if (!item) {
    throw new Error('Cart-Item nicht gefunden.');
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: cartItemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  const refreshed = await loadOrCreateActiveCart(identity);
  return serializeCart(refreshed);
};

export const removeCartItemById = async (
  identity: CartIdentity,
  cartItemId: string
): Promise<CartSummary> => {
  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  const refreshed = await loadOrCreateActiveCart(identity);
  return serializeCart(refreshed);
};

export const clearCartItems = async (identity: CartIdentity): Promise<CartSummary> => {
  const cart = await loadOrCreateActiveCart(identity);

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  const refreshed = await loadOrCreateActiveCart(identity);
  return serializeCart(refreshed);
};
