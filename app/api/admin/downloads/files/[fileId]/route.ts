import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;

    // Get file info before deletion
    const file = await prisma.downloadFile.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Delete file from database
    await prisma.downloadFile.delete({
      where: { id: fileId }
    });

    // Delete physical file
    try {
      const filePath = join(process.cwd(), 'uploads', 'downloads', file.filePath);
      await unlink(filePath);
    } catch (error) {
      console.warn('Could not delete physical file:', error);
      // Continue even if physical file deletion fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}


