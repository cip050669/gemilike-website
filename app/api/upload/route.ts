import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validiere Dateityp
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validiere Dateigröße (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Erstelle Upload-Verzeichnis
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'stories');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generiere eindeutigen Dateinamen
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `story-${timestamp}-${randomString}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Konvertiere File zu Buffer und speichere
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Erstelle URL für die Datei
    const fileUrl = `/uploads/stories/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}



