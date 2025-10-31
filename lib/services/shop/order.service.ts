import type { Prisma, OrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import { Prisma as PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  gemstoneWithRelationsInclude,
  toShopGemstone,
  type GemstoneWithRelations,
} from './gemstone.service';
import type { ShopGemstone } from './types';

const decimalToNumber = (value?: PrismaClient.Decimal | number | string | null): number => {
  if (value == null) return 0;
  if (value instanceof PrismaClient.Decimal) return Number(value);
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toDecimal = (
  value: PrismaClient.Decimal | number | string | null | undefined,
  fallback = 0
) => {
  if (value instanceof PrismaClient.Decimal) return value;
  if (value == null) return new PrismaClient.Decimal(fallback);
  return new PrismaClient.Decimal(value);
};

export const orderWithRelationsInclude = {
  customer: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  },
  billingAddress: true,
  shippingAddress: true,
  items: {
    include: {
      gemstone: {
        include: gemstoneWithRelationsInclude,
      },
    },
  },
} satisfies Prisma.OrderInclude;

export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: typeof orderWithRelationsInclude;
}>;

export interface ShopOrderCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
}

export interface ShopOrderAddress {
  id: string;
  company: string | null;
  salutation: string | null;
  firstName: string | null;
  lastName: string | null;
  street: string | null;
  street2: string | null;
  address1: string | null;
  address2: string | null;
  postalCode: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  phone: string | null;
}

export interface ShopOrderItem {
  id: string;
  gemstoneId: string | null;
  quantity: number;
  unitPrice: number;
  unitNet: number;
  unitTax: number;
  weightSnapshot: number | null;
  description: string | null;
  name: string;
  price: number;
  totalPrice: number;
  gemstone: ShopGemstone | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopOrder {
  id: string;
  orderNumber: string;
  customerId: string | null;
  cartId: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  notes: string | null;
  placedAt: Date | null;
  paidAt: Date | null;
  canceledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  customer: ShopOrderCustomer | null;
  billingAddress: ShopOrderAddress | null;
  shippingAddress: ShopOrderAddress | null;
  items: ShopOrderItem[];
}

const serializeAddress = (address: OrderWithRelations['billingAddress']): ShopOrderAddress | null => {
  if (!address) return null;

  return {
    id: address.id,
    company: address.company ?? null,
    salutation: address.salutation ?? null,
    firstName: address.firstName ?? null,
    lastName: address.lastName ?? null,
    street: address.street ?? null,
    street2: address.street2 ?? null,
    address1: address.street ?? null,
    address2: address.street2 ?? null,
    postalCode: address.postalCode ?? null,
    city: address.city ?? null,
    state: address.state ?? null,
    country: address.country ?? null,
    phone: address.phone ?? null,
  };
};

const serializeOrderItems = (order: OrderWithRelations): ShopOrderItem[] => {
  return order.items.map((item) => {
    const gemstoneEntity = item.gemstone
      ? toShopGemstone(item.gemstone as GemstoneWithRelations)
      : null;
    const unitPrice = decimalToNumber(item.unitPrice);
    const quantity = item.quantity;

    return {
      id: item.id,
      gemstoneId: item.gemstoneId ?? null,
      quantity,
      unitPrice,
      unitNet: decimalToNumber(item.unitNet),
      unitTax: decimalToNumber(item.unitTax),
      weightSnapshot: item.weightSnapshot ? decimalToNumber(item.weightSnapshot) : null,
      description: item.description ?? null,
      name: gemstoneEntity?.name ?? item.description ?? 'Edelstein',
      price: unitPrice,
      totalPrice: unitPrice * quantity,
      gemstone: gemstoneEntity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });
};

export const serializeOrder = (order: OrderWithRelations): ShopOrder => {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerId: order.customerId ?? null,
    cartId: order.cartId ?? null,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod ?? null,
    subtotal: decimalToNumber(order.subtotal),
    taxAmount: decimalToNumber(order.taxAmount),
    shippingAmount: decimalToNumber(order.shippingAmount),
    total: decimalToNumber(order.total),
    currency: order.currency,
    notes: order.notes ?? null,
    placedAt: order.placedAt ?? null,
    paidAt: order.paidAt ?? null,
    canceledAt: order.canceledAt ?? null,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    customer: order.customer
      ? {
          id: order.customer.id,
          firstName: order.customer.firstName ?? null,
          lastName: order.customer.lastName ?? null,
          email: order.customer.email ?? null,
          phone: order.customer.phone ?? null,
        }
      : null,
    billingAddress: serializeAddress(order.billingAddress),
    shippingAddress: serializeAddress(order.shippingAddress),
    items: serializeOrderItems(order),
  };
};

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GM-${timestamp}-${random}`;
};

export interface OrderListFilters {
  search?: string;
  status?: OrderStatus | 'all';
  customerId?: string;
}

export interface OrderListOptions {
  filters?: OrderListFilters;
  limit?: number;
}

export const listOrders = async (options: OrderListOptions = {}): Promise<ShopOrder[]> => {
  const { filters, limit } = options;
  const where: Prisma.OrderWhereInput = {};

  if (filters?.status && filters.status !== 'all') {
    where.status = filters.status;
  }

  if (filters?.customerId) {
    where.customerId = filters.customerId;
  }

  if (filters?.search) {
    where.OR = [
      { orderNumber: { contains: filters.search, mode: 'insensitive' } },
      {
        customer: {
          firstName: { contains: filters.search, mode: 'insensitive' },
        },
      },
      {
        customer: {
          lastName: { contains: filters.search, mode: 'insensitive' },
        },
      },
      {
        customer: {
          email: { contains: filters.search, mode: 'insensitive' },
        },
      },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: orderWithRelationsInclude,
    orderBy: { createdAt: 'desc' },
    take: limit ?? 100,
  });

  return orders.map(serializeOrder);
};

export const getOrderById = async (id: string): Promise<ShopOrder | null> => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: orderWithRelationsInclude,
  });

  return order ? serializeOrder(order) : null;
};

export const getOrderForCustomer = async (
  id: string,
  customerId: string
): Promise<ShopOrder | null> => {
  const order = await prisma.order.findFirst({
    where: {
      id,
      customerId,
    },
    include: orderWithRelationsInclude,
  });

  return order ? serializeOrder(order) : null;
};

export interface CreateOrderItemInput {
  gemstoneId?: string | null;
  quantity: number;
  unitPrice: number | string | PrismaClient.Decimal;
  unitNet?: number | string | PrismaClient.Decimal | null;
  unitTax?: number | string | PrismaClient.Decimal | null;
  weightSnapshot?: number | string | PrismaClient.Decimal | null;
  attributesSnapshot?: Prisma.JsonValue | null;
  description?: string | null;
}

export interface CreateOrderInput {
  customerId?: string | null;
  cartId?: string | null;
  orderNumber?: string | null;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  subtotal: number | string | PrismaClient.Decimal;
  taxAmount?: number | string | PrismaClient.Decimal;
  shippingAmount?: number | string | PrismaClient.Decimal;
  total: number | string | PrismaClient.Decimal;
  currency?: string;
  notes?: string | null;
  placedAt?: Date | null;
  paidAt?: Date | null;
  canceledAt?: Date | null;
  billingAddressId?: string | null;
  shippingAddressId?: string | null;
  items?: CreateOrderItemInput[];
}

export const createOrder = async (input: CreateOrderInput): Promise<ShopOrder> => {
  const orderNumber = input.orderNumber ?? generateOrderNumber();
  const hasItems = Boolean(input.items && input.items.length);

  const created = await prisma.order.create({
    data: {
      orderNumber,
      customerId: input.customerId ?? null,
      cartId: input.cartId ?? null,
      status: input.status ?? 'PENDING',
      paymentStatus: input.paymentStatus ?? 'UNPAID',
      paymentMethod: input.paymentMethod ?? null,
      subtotal: toDecimal(input.subtotal),
      taxAmount: toDecimal(input.taxAmount ?? 0),
      shippingAmount: toDecimal(input.shippingAmount ?? 0),
      total: toDecimal(input.total),
      currency: input.currency ?? 'EUR',
      notes: input.notes ?? null,
      placedAt: input.placedAt ?? null,
      paidAt: input.paidAt ?? null,
      canceledAt: input.canceledAt ?? null,
      billingAddressId: input.billingAddressId ?? null,
      shippingAddressId: input.shippingAddressId ?? null,
      ...(hasItems && {
        items: {
          create: input.items!.map((item) => ({
            gemstoneId: item.gemstoneId ?? null,
            quantity: item.quantity ?? 1,
            unitPrice: toDecimal(item.unitPrice),
            unitNet: toDecimal(item.unitNet ?? item.unitPrice),
            unitTax: toDecimal(item.unitTax ?? 0),
            weightSnapshot: item.weightSnapshot ? toDecimal(item.weightSnapshot) : undefined,
            attributesSnapshot: item.attributesSnapshot ?? undefined,
            description: item.description ?? null,
          })),
        },
      }),
    },
    include: orderWithRelationsInclude,
  });

  return serializeOrder(created);
};

export interface UpdateOrderInput {
  orderNumber?: string | null;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  subtotal?: number | string | PrismaClient.Decimal | null;
  taxAmount?: number | string | PrismaClient.Decimal | null;
  shippingAmount?: number | string | PrismaClient.Decimal | null;
  total?: number | string | PrismaClient.Decimal | null;
  currency?: string | null;
  notes?: string | null;
  placedAt?: Date | null;
  paidAt?: Date | null;
  canceledAt?: Date | null;
  billingAddressId?: string | null;
  shippingAddressId?: string | null;
}

export const updateOrder = async (
  id: string,
  input: UpdateOrderInput
): Promise<ShopOrder | null> => {
  const data: Prisma.OrderUpdateInput = {};

  if (input.orderNumber !== undefined) {
    data.orderNumber = input.orderNumber ?? undefined;
  }
  if (input.status !== undefined) {
    data.status = input.status;
  }
  if (input.paymentStatus !== undefined) {
    data.paymentStatus = input.paymentStatus;
  }
  if (input.paymentMethod !== undefined) {
    data.paymentMethod = input.paymentMethod;
  }
  if (input.subtotal !== undefined) {
    data.subtotal = toDecimal(input.subtotal ?? 0);
  }
  if (input.taxAmount !== undefined) {
    data.taxAmount = toDecimal(input.taxAmount ?? 0);
  }
  if (input.shippingAmount !== undefined) {
    data.shippingAmount = toDecimal(input.shippingAmount ?? 0);
  }
  if (input.total !== undefined) {
    data.total = toDecimal(input.total ?? 0);
  }
  if (input.currency !== undefined) {
    data.currency = input.currency ?? 'EUR';
  }
  if (input.notes !== undefined) {
    data.notes = input.notes ?? null;
  }
  if (input.placedAt !== undefined) {
    data.placedAt = input.placedAt ?? null;
  }
  if (input.paidAt !== undefined) {
    data.paidAt = input.paidAt ?? null;
  }
  if (input.canceledAt !== undefined) {
    data.canceledAt = input.canceledAt ?? null;
  }
  if (input.billingAddressId !== undefined) {
    data.billingAddress = input.billingAddressId
      ? { connect: { id: input.billingAddressId } }
      : { disconnect: true };
  }
  if (input.shippingAddressId !== undefined) {
    data.shippingAddress = input.shippingAddressId
      ? { connect: { id: input.shippingAddressId } }
      : { disconnect: true };
  }

  try {
    const updated = await prisma.order.update({
      where: { id },
      data,
      include: orderWithRelationsInclude,
    });
    return serializeOrder(updated);
  } catch (error) {
    if (error instanceof PrismaClient.PrismaClientKnownRequestError && error.code === 'P2025') {
      return null;
    }
    throw error;
  }
};

export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    await prisma.order.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    if (error instanceof PrismaClient.PrismaClientKnownRequestError && error.code === 'P2025') {
      return false;
    }
    throw error;
  }
};
