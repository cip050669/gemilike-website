import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'stories');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `story-${timestamp}.${extension}`;
    const filepath = join(uploadsDir, filename);

    // Bild auf 1200x600px skalieren
    const resizedBuffer = await sharp(buffer)
      .resize(1200, 600, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    await writeFile(filepath, resizedBuffer);

    const publicUrl = `/uploads/stories/${filename}`;

    return NextResponse.json({ success: true, imageUrl: publicUrl, filename });
  } catch (error) {
    console.error('Error uploading story image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}


