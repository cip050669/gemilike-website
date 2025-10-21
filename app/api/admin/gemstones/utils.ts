import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gemstones');

const ensureUploadDirectory = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

export const saveUploadedImage = async (file: File) => {
  ensureUploadDirectory();
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
  const targetPath = path.join(UPLOAD_DIR, safeName);
  fs.writeFileSync(targetPath, buffer);
  return `/uploads/gemstones/${safeName}`;
};

export const parseImagesFromDB = (images?: string | null): string[] => {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed : [];
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

export const toImageArray = (value: unknown): string[] => {
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
          ? parsed.map((item: any) => String(item)).filter(Boolean)
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
  const collectedImages = toImageArray(payload.images ?? payload.existingImages);
  let finalImages = collectedImages.length ? collectedImages : fallbackImages;

  if (uploadedImage) {
    finalImages = [uploadedImage, ...finalImages];
  }

  const dedupedImages = Array.from(new Set(finalImages.filter(Boolean)));

  return {
    name: String(payload.name ?? '').trim(),
    category: String(payload.category ?? 'Edelstein').trim() || 'Edelstein',
    type: String(payload.type ?? 'cut').trim() || 'cut',
    price: toNumber(payload.price, 0) ?? 0,
    weight: toNumber(payload.weight),
    dimensions: toStringOrNull(payload.dimensions),
    color: toStringOrNull(payload.color),
    colorIntensity: toStringOrNull(payload.colorIntensity),
    colorBrightness: toStringOrNull(payload.colorBrightness),
    clarity: toStringOrNull(payload.clarity),
    cut: toStringOrNull(payload.cut),
    cutForm: toStringOrNull(payload.cutForm),
    treatment: toStringOrNull(payload.treatment),
    certification: toStringOrNull(payload.certification),
    rarity: toStringOrNull(payload.rarity),
    origin: toStringOrNull(payload.origin),
    description: toStringOrNull(payload.description),
    images: dedupedImages.length ? JSON.stringify(dedupedImages) : null,
    inStock: toBoolean(payload.inStock, true),
    stock: toNumber(payload.stock, 0) ?? 0,
    sku: toStringOrNull(payload.sku),
    isNew: toBoolean(payload.isNew, false),
  };
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
