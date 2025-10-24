import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gemstones');

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/avi',
]);

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.webm', '.avi', '.m4v']);

const ensureUploadDirectory = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

const buildFilename = (originalName: string, fallbackExtension: string) => {
  const ext = path.extname(originalName).toLowerCase() || fallbackExtension;
  const baseName = path.basename(originalName, ext);
  const sanitized = baseName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `${Date.now()}-${randomUUID()}-${sanitized || 'gemstone'}${ext}`;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const kind = String(formData.get('type') || 'image');

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { success: false, error: 'Keine Datei übermittelt.' },
        { status: 400 }
      );
    }

    const mimeType = file.type || '';
    const ext = path.extname(file.name || '').toLowerCase();
    const isVideo = kind === 'video';

    const allowedMime = isVideo ? VIDEO_MIME_TYPES : IMAGE_MIME_TYPES;
    const allowedExt = isVideo ? VIDEO_EXTENSIONS : IMAGE_EXTENSIONS;
    const fallbackExtension = isVideo ? '.mp4' : '.jpg';

    if (!allowedMime.has(mimeType) && !allowedExt.has(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: `Ungültiger Dateityp. Erlaubt: ${
            isVideo ? 'MP4, MOV, WEBM, AVI' : 'JPG, PNG, WEBP, GIF'
          }`,
        },
        { status: 400 }
      );
    }

    ensureUploadDirectory();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = buildFilename(file.name || (isVideo ? 'video' : 'image'), fallbackExtension);
    const filepath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filepath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/gemstones/${filename}`,
      type: isVideo ? 'video' : 'image',
    });
  } catch (error) {
    console.error('Error uploading gemstone media:', error);
    return NextResponse.json(
      { success: false, error: 'Upload fehlgeschlagen.' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
