import { prisma } from '@/lib/prisma';

export type ContainerContentRecord = {
  key: string;
  locale: string;
  title?: string | null;
  subtitle?: string | null;
  body?: string | null;
};

export const DEFAULT_CONTAINER_CONTENT: Record<string, ContainerContentRecord> = {
  'home.blog.heading': {
    key: 'home.blog.heading',
    locale: 'de',
    title: 'GESCHICHTEN UM EDELSTEINE',
  },
  'home.blog.subheading': {
    key: 'home.blog.subheading',
    locale: 'de',
    body: 'Entdecken Sie die faszinierenden Geschichten und Mythen hinter unseren Edelsteinen',
  },
  'home.newGemstones.description': {
    key: 'home.newGemstones.description',
    locale: 'de',
    body: 'Entdecken Sie unsere neuesten und exklusivsten Edelsteine – handverlesen und sofort verfügbar.',
  },
};

const mergeWithDefaults = (
  records: ContainerContentRecord[],
  locale: string
): ContainerContentRecord[] => {
  const map = new Map<string, ContainerContentRecord>();
  Object.values(DEFAULT_CONTAINER_CONTENT).forEach((item) => {
    if (item.locale === locale || item.locale === 'de') {
      map.set(`${item.key}:${locale}`, { ...item, locale });
    }
  });
  records.forEach((item) => {
    map.set(`${item.key}:${item.locale}`, item);
  });
  return Array.from(map.values());
};

export async function getContainerContent(
  keys: string[],
  locale: string
): Promise<ContainerContentRecord[]> {
  try {
    const records = await prisma.containerContent.findMany({
      where: { key: { in: keys }, locale },
    });
    return mergeWithDefaults(records, locale).filter((r) => keys.includes(r.key));
  } catch (error) {
    console.warn('getContainerContent fallback to defaults:', error);
    return mergeWithDefaults([], locale).filter((r) => keys.includes(r.key));
  }
}

export async function upsertContainerContent(
  items: ContainerContentRecord[],
  locale: string
): Promise<void> {
  for (const item of items) {
    await prisma.containerContent.upsert({
      where: {
        key_locale: {
          key: item.key,
          locale,
        },
      },
      update: {
        title: item.title ?? null,
        subtitle: item.subtitle ?? null,
        body: item.body ?? null,
      },
      create: {
        key: item.key,
        locale,
        title: item.title ?? null,
        subtitle: item.subtitle ?? null,
        body: item.body ?? null,
      },
    });
  }
}
