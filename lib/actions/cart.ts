'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { resolveShopIdentity } from '@/lib/server/shop-context';

const decimalToNumber = (value: Prisma.Decimal | number | string): number => {
  if (value instanceof Prisma.Decimal) return Number(value);
  if (typeof value === 'string') return Number(value);
  return value;
};

const cartInclude = {
  items: {
    include: {
      gemstone: {
        include: {
          inventory: true,
          attributes: true,
          media: {
            orderBy: [
              { isPrimary: 'desc' },
              { position: 'asc' },
              { createdAt: 'asc' },
            ],
            take: 1,
          },
        },
      },
    },
  },
} satisfies Prisma.CartInclude;

type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

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

const serializeCart = (cart: CartWithItems): CartSummary => {
  const items = cart.items.map((item) => {
    const gemstone = item.gemstone;
    const image = gemstone?.media?.[0]?.url ?? null;
    const inventory = gemstone?.inventory;
    const condition = inventory?.condition ?? gemstone?.condition ?? 'CUT';
    const weightDecimal =
      condition === 'ROUGH'
        ? inventory?.gramWeight
        : inventory?.caratWeight ?? inventory?.gramWeight;
    const weight =
      weightDecimal != null ? decimalToNumber(weightDecimal as Prisma.Decimal | number | string) : null;

    return {
      id: item.id,
      gemstoneId: item.gemstoneId,
      name: gemstone?.name ?? 'Edelstein',
      slug: gemstone?.slug ?? null,
      quantity: item.quantity,
      price: decimalToNumber(item.priceSnapshot),
      currency: cart.currency,
      image,
      isSold: gemstone?.isSold ?? false,
      category: gemstone?.category ?? null,
      weight,
      weightUnit: condition === 'ROUGH' ? 'g' : 'ct',
      origin: gemstone?.origin ?? null,
    };
  });

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

const loadCart = async (): Promise<{ cart: CartWithItems; identityCustomerId?: string | null }> => {
  const identity = await resolveShopIdentity();

  if (identity.customerId) {
    const customerCart = await prisma.cart.findFirst({
      where: {
        status: 'ACTIVE',
        customerId: identity.customerId,
      },
      include: cartInclude,
    });

    if (customerCart) {
      return { cart: customerCart, identityCustomerId: identity.customerId };
    }

    const sessionCart = await prisma.cart.findFirst({
      where: {
        status: 'ACTIVE',
        sessionId: identity.cartSessionId,
      },
      include: cartInclude,
    });

    if (sessionCart) {
      const reassigned = await prisma.cart.update({
        where: { id: sessionCart.id },
        data: {
          customerId: identity.customerId,
          sessionId: null,
        },
        include: cartInclude,
      });
      return { cart: reassigned, identityCustomerId: identity.customerId };
    }
  } else {
    const sessionCart = await prisma.cart.findFirst({
      where: {
        status: 'ACTIVE',
        sessionId: identity.cartSessionId,
      },
      include: cartInclude,
    });
    if (sessionCart) {
      return { cart: sessionCart, identityCustomerId: null };
    }
  }

  const created = await prisma.cart.create({
    data: {
      status: 'ACTIVE',
      currency: 'EUR',
      customerId: identity.customerId ?? null,
      sessionId: identity.customerId ? null : identity.cartSessionId,
    },
    include: cartInclude,
  });

  return { cart: created, identityCustomerId: identity.customerId ?? null };
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

  const price = gemstone.priceBooks[0]?.priceGross ?? gemstone.priceBooks[0]?.priceNet;
  const currency = gemstone.priceBooks[0]?.currency ?? 'EUR';

  if (!price) {
    throw new Error('Preis für Edelstein nicht verfügbar.');
  }

  return {
    price,
    currency,
  };
};

const reloadCart = async (): Promise<CartSummary> => {
  const { cart } = await loadCart();
  return serializeCart(cart);
};

export const getCartSummary = async (): Promise<CartSummary> => {
  return reloadCart();
};

export const addCartItem = async (gemstoneId: string, quantity = 1): Promise<CartSummary> => {
  if (quantity < 1) {
    throw new Error('Mindestmenge ist 1.');
  }

  const { cart } = await loadCart();
  const { price, currency } = await resolveGemstonePrice(gemstoneId);

  await prisma.$transaction(async (tx) => {
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
  });

  const refreshed = await prisma.cart.update({
    where: { id: cart.id },
    data: { currency },
    include: cartInclude,
  });

  return serializeCart(refreshed);
};

export const updateCartItemQuantity = async (
  cartItemId: string,
  quantity: number
): Promise<CartSummary> => {
  if (quantity < 0) {
    throw new Error('Menge darf nicht negativ sein.');
  }

  const { cart } = await loadCart();
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

  return reloadCart();
};

export const removeCartItem = async (cartItemId: string): Promise<CartSummary> => {
  await prisma.cartItem.delete({
    where: { id: cartItemId },
  });

  return reloadCart();
};

export const clearActiveCart = async (): Promise<CartSummary> => {
  const { cart } = await loadCart();

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  return reloadCart();
};
