import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gemstones');

const ensureUploadDirectory = () => {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    return true;
  } catch (error) {
    console.warn('Gemstone uploads: Unable to access upload directory.', error);
    return false;
  }
};

export const saveUploadedImage = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const parts = file.name.split('.');
  const extension = parts.length > 1 ? parts.pop() ?? 'jpg' : 'jpg';
  const baseName = parts.join('.') || 'gemstone';
  const slug = baseName
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase();
  const safeName = `${Date.now()}-${randomUUID()}-${slug || 'gemstone'}.${extension}`;
  const mimeType = file.type || 'image/jpeg';

  if (ensureUploadDirectory()) {
    try {
      const targetPath = path.join(UPLOAD_DIR, safeName);
      fs.writeFileSync(targetPath, buffer);
      return `/uploads/gemstones/${safeName}`;
    } catch (error) {
      console.warn('Gemstone uploads: Falling back to inline image storage.', error);
    }
  }

  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

export const parseListFromDB = (value?: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((item) => String(item)) : [];
  } catch {
    return [];
  }
};

export const toNumber = (value: unknown, fallback: number | null = null) => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    let normalized = trimmed.replace(/\s+/g, '');
    if (normalized.includes(',') && normalized.includes('.')) {
      normalized = normalized.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = normalized.replace(',', '.');
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const toBoolean = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return fallback;
};

export const toStringOrNull = (value: unknown) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return String(value);
};

export const toStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed)
          ? parsed.map((item: unknown) => String(item)).filter(Boolean)
          : [];
      } catch {
        return [];
      }
    }
    return [trimmed];
  }
  return [];
};

export const normaliseGemstonePayload = (
  payload: Record<string, unknown>,
  uploadedImage?: string,
  fallbackImages: string[] = [],
  isUpdate: boolean = false
) => {
  const collectedImages = toStringArray(payload.images ?? payload.existingImages ?? payload.imageUrls);
  let finalImages = collectedImages.length ? collectedImages : fallbackImages;

  if (uploadedImage) {
    finalImages = [uploadedImage, ...finalImages];
  }

  const dedupedImages = Array.from(new Set(finalImages.filter(Boolean)));

  const videoList = toStringArray(payload.videos ?? payload.videoUrls ?? payload.existingVideos);
  const dedupedVideos = Array.from(new Set(videoList.filter(Boolean))).slice(0, 2);

  // Generate slug from name
  const name = String(payload.name ?? '').trim();
  // Allow caller to pre-compute a unique slug; otherwise derive from the name
  const slug =
    (payload.slug as string)?.trim() ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') ||
    `gemstone-${Date.now()}`;

  // Base gemstone data (matches Prisma schema)
  // Using Record<string, unknown> for Prisma create/update objects which have dynamic structure
  const gemstoneData: Record<string, unknown> = {
    name,
    slug,
    category: String(payload.category ?? 'Edelstein').trim() || 'Edelstein',
    condition: (payload.condition as string) || 'CUT',
    status: (payload.status as string) || 'PUBLISHED', // Default to PUBLISHED so gemstones appear in shop
    shortDescription: toStringOrNull(payload.shortDescription ?? payload.description),
    longDescription: toStringOrNull(payload.longDescription),
    origin: toStringOrNull(payload.origin),
    isNew: toBoolean(payload.isNew, false),
    isSold: toBoolean(payload.isSold, false),
    featured: toBoolean(payload.featured, false),
    cut: toStringOrNull(payload.cut),
    cutForm: toStringOrNull(payload.cutForm),
    rarity: toStringOrNull(payload.rarity),
    publishedAt: payload.publishedAt ? new Date(payload.publishedAt as string) : new Date(), // Set publishedAt when creating
  };

  // Attributes relation data
  const colorBrightness = payload.colorBrightness !== undefined && payload.colorBrightness !== null 
    ? toNumber(payload.colorBrightness, null) 
    : null;
  
  if (payload.color || payload.colorIntensity || colorBrightness !== null || payload.clarity || 
      payload.treatment || payload.certification || payload.certificateId || payload.certificateUrl ||
      payload.lengthMm || payload.widthMm || payload.heightMm || payload.originType) {
    if (isUpdate) {
      // For updates, use upsert with gemstoneId as unique constraint
      gemstoneData.attributes = {
        upsert: {
          where: {
            gemstoneId: payload.id as string,
          },
          create: {
            color: toStringOrNull(payload.color),
            colorSaturation: toStringOrNull(payload.colorIntensity),
            colorBrightness: colorBrightness !== null ? Math.max(0, Math.min(10, Math.round(colorBrightness))) : null,
            colorHue: toStringOrNull(payload.colorHue),
            clarity: toStringOrNull(payload.clarity),
            treatment: toStringOrNull(payload.treatment),
            certification: toStringOrNull(payload.certification),
            certificateId: toStringOrNull(payload.certificateId),
            certificateUrl: toStringOrNull(payload.certificateUrl),
            lengthMm: payload.lengthMm ? toNumber(payload.lengthMm, null) : null,
            widthMm: payload.widthMm ? toNumber(payload.widthMm, null) : null,
            heightMm: payload.heightMm ? toNumber(payload.heightMm, null) : null,
            metadata: payload.originType ? { originType: String(payload.originType) } : undefined,
          },
          update: {
            color: toStringOrNull(payload.color),
            colorSaturation: toStringOrNull(payload.colorIntensity),
            colorBrightness: colorBrightness !== null ? Math.max(0, Math.min(10, Math.round(colorBrightness))) : null,
            colorHue: toStringOrNull(payload.colorHue),
            clarity: toStringOrNull(payload.clarity),
            treatment: toStringOrNull(payload.treatment),
            certification: toStringOrNull(payload.certification),
            certificateId: toStringOrNull(payload.certificateId),
            certificateUrl: toStringOrNull(payload.certificateUrl),
            lengthMm: payload.lengthMm ? toNumber(payload.lengthMm, null) : null,
            widthMm: payload.widthMm ? toNumber(payload.widthMm, null) : null,
            heightMm: payload.heightMm ? toNumber(payload.heightMm, null) : null,
            metadata: payload.originType ? { originType: String(payload.originType) } : undefined,
          },
        },
      };
    } else {
      gemstoneData.attributes = {
        create: {
          color: toStringOrNull(payload.color),
          colorSaturation: toStringOrNull(payload.colorIntensity),
          colorBrightness: colorBrightness !== null ? Math.max(0, Math.min(10, Math.round(colorBrightness))) : null,
          colorHue: toStringOrNull(payload.colorHue),
          clarity: toStringOrNull(payload.clarity),
          treatment: toStringOrNull(payload.treatment),
          certification: toStringOrNull(payload.certification),
          certificateId: toStringOrNull(payload.certificateId),
          certificateUrl: toStringOrNull(payload.certificateUrl),
          lengthMm: payload.lengthMm ? toNumber(payload.lengthMm, null) : null,
          widthMm: payload.widthMm ? toNumber(payload.widthMm, null) : null,
          heightMm: payload.heightMm ? toNumber(payload.heightMm, null) : null,
          metadata: payload.originType ? { originType: String(payload.originType) } : undefined,
        },
      };
    }
  }

  // Inventory relation data
  const caratWeight = toNumber(payload.caratWeight ?? payload.weight, null);
  const gramWeight = toNumber(payload.gramWeight, null);
  const quantity = toNumber(payload.stock ?? payload.quantity, 1) ?? 1;
  
  if (caratWeight !== null || gramWeight !== null || quantity > 0 || payload.sku) {
    if (isUpdate) {
      // For updates, use upsert with gemstoneId as unique constraint
      gemstoneData.inventory = {
        upsert: {
          where: {
            gemstoneId: payload.id as string,
          },
          create: {
            caratWeight: caratWeight ? caratWeight : null,
            gramWeight: gramWeight ? gramWeight : null,
            quantity: quantity,
            sku: toStringOrNull(payload.sku),
            condition: (payload.condition as string) || 'CUT',
          },
          update: {
            caratWeight: caratWeight !== undefined ? (caratWeight ? caratWeight : null) : undefined,
            gramWeight: gramWeight !== undefined ? (gramWeight ? gramWeight : null) : undefined,
            quantity: quantity,
            sku: payload.sku !== undefined ? toStringOrNull(payload.sku) : undefined,
            condition: payload.condition ? (payload.condition as string) : undefined,
          },
        },
      };
    } else {
      gemstoneData.inventory = {
        create: {
          caratWeight: caratWeight ? caratWeight : null,
          gramWeight: gramWeight ? gramWeight : null,
          quantity: quantity,
          sku: toStringOrNull(payload.sku),
          condition: (payload.condition as string) || 'CUT',
        },
      };
    }
  }

  // Price relation data
  const taxRate = toNumber(payload.taxRate, 19) ?? 19;
  const priceInput = payload.priceGross ?? payload.price ?? payload.priceNet;
  const priceGross = toNumber(priceInput, 0) ?? 0;
  const priceNet = priceGross > 0 ? priceGross / (1 + taxRate / 100) : 0;
  if (priceGross > 0 || isUpdate) {
    
    if (isUpdate) {
      // For updates, create a new price entry (historical pricing)
      if (priceGross > 0) {
        gemstoneData.priceBooks = {
          create: {
            currency: String(payload.currency ?? 'EUR'),
            priceNet: priceNet,
            priceGross: priceGross,
            taxRate: taxRate,
          },
        };
      }
    } else {
      // For creates, always create price entry
      if (priceGross > 0) {
        gemstoneData.priceBooks = {
          create: {
            currency: String(payload.currency ?? 'EUR'),
            priceNet: priceNet,
            priceGross: priceGross,
            taxRate: taxRate,
          },
        };
      }
    }
  }

  // Media relation data (images and videos)
  interface MediaCreateItem {
    type: 'IMAGE' | 'VIDEO';
    url: string;
    position: number;
    isPrimary: boolean;
  }
  const mediaCreate: MediaCreateItem[] = [];
  
  // Add images
  dedupedImages.slice(0, 10).forEach((url, index) => {
    mediaCreate.push({
      type: 'IMAGE',
      url: url,
      position: index,
      isPrimary: index === 0,
    });
  });

  // Add videos
  dedupedVideos.forEach((url, index) => {
    mediaCreate.push({
      type: 'VIDEO',
      url: url,
      position: dedupedImages.length + index,
      isPrimary: false,
    });
  });

  if (mediaCreate.length > 0) {
    if (isUpdate) {
      // For updates, delete existing media and create new ones
      gemstoneData.media = {
        deleteMany: {},
        create: mediaCreate,
      };
    } else {
      gemstoneData.media = {
        create: mediaCreate,
      };
    }
  } else if (isUpdate && payload.images !== undefined && payload.videos !== undefined) {
    // If explicitly setting empty arrays, delete all media
    gemstoneData.media = {
      deleteMany: {},
    };
  }

  return gemstoneData;
};

export const extractPayload = async (request: NextRequest) => {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const payload: Record<string, unknown> = {};
    let uploadedImage: string | undefined;

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (key === 'image' && value.size > 0) {
          uploadedImage = await saveUploadedImage(value);
        }
      } else {
        payload[key] = value;
      }
    }

    return { payload, uploadedImage };
  }

  const json = await request.json();
  return { payload: json ?? {}, uploadedImage: undefined };
};
