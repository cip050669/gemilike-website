import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { loadBlogSectionSettings, saveBlogSectionSettings } from '@/lib/data/blog-settings';

export async function GET() {
  try {
    const settings = await loadBlogSectionSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error fetching blog section settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load blog section settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Optional TODO: enforce auth when activated
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
      return NextResponse.json(
        { success: false, error: 'Invalid payload' },
        { status: 400 }
      );
    }

    await saveBlogSectionSettings({
      heading: heading.trim() || ' ',
      subheading: subheading.trim() || ' ',
      headingColor: headingColor?.trim() || '#ffffff',
      subheadingColor: subheadingColor?.trim() || '#d1d5db',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving blog section settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save blog section settings' },
      { status: 500 }
    );
  }
}
