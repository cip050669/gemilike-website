import { prisma } from '@/lib/prisma';

export interface AboutContentInput {
  section: string;
  title?: string | null;
  content: string;
  image?: string | null;
  order?: number;
  locale?: string;
  isActive?: boolean;
}

export interface ServiceInput {
  slug: string;
  title: string;
  description: string;
  icon?: string | null;
  features?: string[];
  order?: number;
  locale?: string;
  isActive?: boolean;
}

export async function getAboutContent(locale: string = 'de') {
  return prisma.aboutContent.findMany({
    where: {
      locale,
      isActive: true,
    },
    orderBy: { order: 'asc' },
  });
}

export async function getAboutContentBySection(section: string, locale: string = 'de') {
  return prisma.aboutContent.findUnique({
    where: {
      section_locale: {
        section,
        locale,
      },
    },
  });
}

export async function upsertAboutContent(data: AboutContentInput) {
  return prisma.aboutContent.upsert({
    where: {
      section_locale: {
        section: data.section,
        locale: data.locale || 'de',
      },
    },
    update: {
      title: data.title,
      content: data.content,
      image: data.image,
      order: data.order ?? 0,
      isActive: data.isActive ?? true,
    },
    create: {
      section: data.section,
      title: data.title,
      content: data.content,
      image: data.image,
      order: data.order ?? 0,
      locale: data.locale || 'de',
      isActive: data.isActive ?? true,
    },
  });
}

export async function getServices(locale: string = 'de') {
  return prisma.service.findMany({
    where: {
      locale,
      isActive: true,
    },
    orderBy: { order: 'asc' },
  });
}

export async function getServiceBySlug(slug: string, locale: string = 'de') {
  return prisma.service.findFirst({
    where: {
      slug,
      locale,
      isActive: true,
    },
  });
}

export async function createService(data: ServiceInput) {
  return prisma.service.create({
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      icon: data.icon || null,
      features: data.features || [],
      order: data.order ?? 0,
      locale: data.locale || 'de',
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateService(id: string, data: Partial<ServiceInput>) {
  return prisma.service.update({
    where: { id },
    data,
  });
}

export async function deleteService(id: string) {
  return prisma.service.delete({
    where: { id },
  });
}

