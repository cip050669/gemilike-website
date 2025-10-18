import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const projectId = formData.get('projectId') as string;
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;

    if (!projectId || !file) {
      return NextResponse.json(
        { error: 'Project ID and file are required' },
        { status: 400 }
      );
    }

    // Verify project exists
    const project = await prisma.downloadProject.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'uploads', 'downloads', projectId);
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || '';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadDir, uniqueFilename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save file info to database
    const downloadFile = await prisma.downloadFile.create({
      data: {
        projectId,
        filename: uniqueFilename,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        filePath: join(projectId, uniqueFilename),
        description: description || null
      }
    });

    return NextResponse.json({
      success: true,
      file: downloadFile
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}


