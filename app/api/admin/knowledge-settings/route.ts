import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { loadKnowledgeSectionSettings, saveKnowledgeSectionSettings } from '@/lib/data/knowledge-settings';

export async function GET() {
  try {
    const settings = await loadKnowledgeSectionSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching knowledge section settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to load knowledge section settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { heading, subheading, headingColor, subheadingColor } = body;

    if (
      typeof heading !== 'string' ||
      typeof subheading !== 'string' ||
      (headingColor && typeof headingColor !== 'string') ||
      (subheadingColor && typeof subheadingColor !== 'string')
    ) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    await saveKnowledgeSectionSettings({
      heading: heading.trim() || ' ',
      subheading: subheading.trim() || ' ',
      headingColor: headingColor?.trim() || '#ffffff',
      subheadingColor: subheadingColor?.trim() || '#d1d5db',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving knowledge section settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to save knowledge section settings' }, { status: 500 });
  }
}
