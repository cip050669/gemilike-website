import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { join } from 'next/server';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    const { projectId, userEmail, userName } = await request.json();
    
    // Check authentication
    const cookieStore = cookies();
    const authCookie = cookieStore.get('download-auth');
    
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check consent
    const authData = JSON.parse(authCookie.value);
    const consent = await prisma.downloadConsent.findUnique({
      where: { userEmail: authData.email }
    });

    if (!consent || !consent.consent) {
      return NextResponse.json(
        { error: 'Consent required' },
        { status: 403 }
      );
    }

    // Get file info
    const file = await prisma.downloadFile.findUnique({
      where: { id: fileId },
      include: { project: true }
    });

    if (!file || !file.isActive || !file.project.isActive) {
      return NextResponse.json(
        { error: 'File not found or inactive' },
        { status: 404 }
      );
    }

    // Log download
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    await prisma.downloadLog.create({
      data: {
        projectId: file.projectId,
        fileId: file.id,
        userEmail: userEmail,
        userName: userName,
        ipAddress,
        userAgent
      }
    });

    // Read and return file
    const filePath = join(process.cwd(), 'uploads', 'downloads', file.filePath);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': file.mimeType,
        'Content-Disposition': `attachment; filename="${file.originalName}"`,
        'Content-Length': file.fileSize.toString()
      }
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    );
  }
}


