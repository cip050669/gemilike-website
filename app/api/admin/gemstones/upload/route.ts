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
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error('Error creating upload directory:', error);
    return false;
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
    console.log('[Gemstone Upload] Starting upload request...');
    
    let formData;
    try {
      formData = await request.formData();
    } catch (formDataError) {
      console.error('[Gemstone Upload] Error parsing formData:', formDataError);
      return NextResponse.json(
        { success: false, error: 'Fehler beim Empfangen der Datei.' },
        { status: 400 }
      );
    }
    
    const file = formData.get('file');
    const kind = String(formData.get('type') || 'image');
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Keine Datei übermittelt.' },
        { status: 400 }
      );
    }

    // Check if file has the necessary methods (arrayBuffer, size, etc.)
    // Don't use instanceof File/Blob as they may not be available in Node.js runtime
    interface FileLike {
      arrayBuffer?: () => Promise<ArrayBuffer>;
      size?: number;
      name?: string;
      type?: string;
    }
    const fileLike = file as FileLike;
    const hasArrayBuffer = typeof fileLike.arrayBuffer === 'function';
    const hasSize = typeof fileLike.size === 'number';
    const hasName = typeof fileLike.name === 'string';
    const hasType = typeof fileLike.type === 'string';
    
    console.log('[Gemstone Upload] File received:', {
      hasArrayBuffer,
      hasSize,
      hasName,
      hasType,
      size: hasSize ? fileLike.size : 'unknown',
      name: hasName ? fileLike.name : 'unknown',
      type: hasType ? fileLike.type : 'unknown'
    });

    if (!hasArrayBuffer || !hasSize) {
      console.error('[Gemstone Upload] File does not have required methods:', file);
      return NextResponse.json(
        { success: false, error: 'Ungültiges Dateiformat übermittelt.' },
        { status: 400 }
      );
    }

    const fileSize = fileLike.size ?? 0;
    if (fileSize === 0) {
      return NextResponse.json(
        { success: false, error: 'Datei ist leer.' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = kind === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (fileSize > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Datei zu groß. Maximale Größe: ${kind === 'video' ? '50MB' : '10MB'}` 
        },
        { status: 400 }
      );
    }

    const mimeType = fileLike.type || '';
    const fileName = fileLike.name || 'upload';
    const ext = path.extname(fileName).toLowerCase();
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

    if (!ensureUploadDirectory()) {
      return NextResponse.json(
        { success: false, error: 'Upload-Verzeichnis konnte nicht erstellt werden.' },
        { status: 500 }
      );
    }

    console.log('[Gemstone Upload] Processing file...');
    const arrayBuffer = await file.arrayBuffer();
    console.log('[Gemstone Upload] ArrayBuffer size:', arrayBuffer.byteLength);
    const buffer = Buffer.from(arrayBuffer);
    const filename = buildFilename(fileName || (isVideo ? 'video' : 'image'), fallbackExtension);
    const filepath = path.join(UPLOAD_DIR, filename);
    console.log('[Gemstone Upload] Saving to:', filepath);

    try {
      fs.writeFileSync(filepath, buffer);
      console.log('[Gemstone Upload] File saved successfully:', filename);
    } catch (writeError) {
      console.error('[Gemstone Upload] Error writing file:', writeError);
      return NextResponse.json(
        { success: false, error: `Datei konnte nicht gespeichert werden: ${writeError instanceof Error ? writeError.message : 'Unbekannter Fehler'}` },
        { status: 500 }
      );
    }

    const response = {
      success: true,
      url: `/uploads/gemstones/${filename}`,
      type: isVideo ? 'video' : 'image',
    };
    console.log('[Gemstone Upload] Upload successful:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error uploading gemstone media:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    return NextResponse.json(
      { success: false, error: `Upload fehlgeschlagen: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
