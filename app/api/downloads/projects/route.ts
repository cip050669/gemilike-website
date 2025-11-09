import { NextResponse } from 'next/server';

interface DownloadProject {
  id: string;
  name: string;
  description?: string;
  url?: string;
}

export async function GET() {
  try {
    // Note: Download project management is not implemented in the current schema
    const projects: DownloadProject[] = [];

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error loading projects:', error);
    return NextResponse.json(
      { error: 'Failed to load projects' },
      { status: 500 }
    );
  }
}

