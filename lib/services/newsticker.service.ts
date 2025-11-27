import { prisma } from '@/lib/prisma';
import type { NewstickerItem } from '@/lib/types/newsticker';

export interface NewstickerInput {
  text: string;
  type?: string;
  priority?: string;
  link?: string | null;
  linkText?: string | null;
  isActive?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  order?: number;
  headingColor?: string | null;
  subheadingColor?: string | null;
}

const mapDbToItem = (item: {
  id: string;
  text: string;
  type: string;
  priority: string | null;
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  headingColor: string | null;
  subheadingColor: string | null;
}): NewstickerItem => ({
  id: item.id,
  text: item.text,
  type: item.type as NewstickerItem['type'],
  priority: (item.priority ?? 'medium') as NewstickerItem['priority'],
  isActive: item.isActive,
  startDate: item.startDate ? item.startDate.toISOString() : undefined,
  endDate: item.endDate ? item.endDate.toISOString() : undefined,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  headingColor: item.headingColor ?? undefined,
  subheadingColor: item.subheadingColor ?? undefined,
});

export async function getNewstickerItems(activeOnly = false) {
  const now = new Date();
  const items = await prisma.newstickerItem.findMany({
    where: activeOnly
      ? {
          isActive: true,
          AND: [
            {
              OR: [{ startDate: null }, { startDate: { lte: now } }],
            },
            {
              OR: [{ endDate: null }, { endDate: { gte: now } }],
            },
          ],
        }
      : undefined,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return items.map(mapDbToItem);
}

export async function getNewstickerItem(id: string) {
  const item = await prisma.newstickerItem.findUnique({ where: { id } });
  return item ? mapDbToItem(item) : null;
}

export async function createNewstickerItem(data: NewstickerInput) {
  const payload = {
    text: data.text,
    type: data.type ?? 'info',
    priority: data.priority ?? 'medium',
    link: data.link ?? null,
    linkText: data.linkText ?? null,
    isActive: data.isActive ?? true,
    startDate: data.startDate ? new Date(data.startDate) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
    order: data.order ?? 0,
    headingColor: data.headingColor ?? null,
    subheadingColor: data.subheadingColor ?? null,
  } as const;

  const created = await prisma.newstickerItem.create({ data: payload });
  return mapDbToItem(created);
}

export async function updateNewstickerItem(id: string, data: NewstickerInput) {
  const payload = {
    text: data.text,
    type: data.type,
    priority: data.priority,
    link: data.link,
    linkText: data.linkText,
    isActive: data.isActive,
    startDate:
      data.startDate === undefined
        ? undefined
        : data.startDate
          ? new Date(data.startDate)
          : null,
    endDate:
      data.endDate === undefined
        ? undefined
        : data.endDate
          ? new Date(data.endDate)
          : null,
    order: data.order,
    headingColor: data.headingColor,
    subheadingColor: data.subheadingColor,
  } as const;

  const updated = await prisma.newstickerItem.update({
    where: { id },
    data: payload,
  });

  return mapDbToItem(updated);
}

export async function deleteNewstickerItem(id: string) {
  await prisma.newstickerItem.delete({ where: { id } });
}
