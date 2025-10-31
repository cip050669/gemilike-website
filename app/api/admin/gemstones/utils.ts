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
  fallbackImages: string[] = []
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
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `gemstone-${Date.now()}`;

  // Base gemstone data (matches Prisma schema)
  const gemstoneData: any = {
    name,
    slug,
    category: String(payload.category ?? 'Edelstein').trim() || 'Edelstein',
    condition: (payload.condition as string) || 'CUT',
    shortDescription: toStringOrNull(payload.shortDescription ?? payload.description),
    longDescription: toStringOrNull(payload.longDescription),
    origin: toStringOrNull(payload.origin),
    isNew: toBoolean(payload.isNew, false),
    isSold: toBoolean(payload.isSold, false),
    featured: toBoolean(payload.featured, false),
    cut: toStringOrNull(payload.cut),
    cutForm: toStringOrNull(payload.cutForm),
    publishedAt: payload.publishedAt ? new Date(payload.publishedAt as string) : null,
  };

  // Attributes relation data
  if (payload.color || payload.colorIntensity || payload.colorBrightness || payload.clarity || 
      payload.treatment || payload.certification || payload.certificateId || payload.certificateUrl ||
      payload.lengthMm || payload.widthMm || payload.heightMm) {
    gemstoneData.attributes = {
      create: {
        color: toStringOrNull(payload.color),
        colorSaturation: toStringOrNull(payload.colorIntensity),
        colorHue: toStringOrNull(payload.colorBrightness),
        clarity: toStringOrNull(payload.clarity),
        treatment: toStringOrNull(payload.treatment),
        certification: toStringOrNull(payload.certification),
        certificateId: toStringOrNull(payload.certificateId),
        certificateUrl: toStringOrNull(payload.certificateUrl),
        lengthMm: payload.lengthMm ? toNumber(payload.lengthMm, null) : null,
        widthMm: payload.widthMm ? toNumber(payload.widthMm, null) : null,
        heightMm: payload.heightMm ? toNumber(payload.heightMm, null) : null,
      },
    };
  }

  // Inventory relation data
  const caratWeight = toNumber(payload.caratWeight ?? payload.weight, null);
  const gramWeight = toNumber(payload.gramWeight, null);
  const quantity = toNumber(payload.stock ?? payload.quantity, 1) ?? 1;
  
  if (caratWeight !== null || gramWeight !== null || quantity > 0 || payload.sku) {
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

  // Price relation data
  const priceNet = toNumber(payload.price ?? payload.priceNet, 0) ?? 0;
  if (priceNet > 0) {
    const taxRate = toNumber(payload.taxRate, 19) ?? 19;
    const priceGross = priceNet * (1 + taxRate / 100);
    
    gemstoneData.priceBooks = {
      create: {
        currency: String(payload.currency ?? 'EUR'),
        priceNet: priceNet,
        priceGross: priceGross,
        taxRate: taxRate,
      },
    };
  }

  // Media relation data (images and videos)
  const mediaCreate: any[] = [];
  
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
    gemstoneData.media = {
      create: mediaCreate,
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
