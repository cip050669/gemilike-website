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

    // Note: Download file management is not implemented in the current schema
    return NextResponse.json(
      { error: 'Download file management is not implemented' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}


