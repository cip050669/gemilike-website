import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const MESSAGES_DIR = join(process.cwd(), 'messages');

interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  intro1: string;
  intro2: string;
  mission: string;
  missionDesc: string;
  values: string;
  valuesDesc: string;
  expertise: string;
  expertiseDesc: string;
  quality: string;
  qualityDesc: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';

    const messagesPath = join(MESSAGES_DIR, `${locale}.json`);
    const messages = JSON.parse(await readFile(messagesPath, 'utf-8'));

    const aboutData: AboutData = {
      title: messages.about?.title || '',
      subtitle: messages.about?.subtitle || '',
      description: messages.about?.description || '',
      intro1: messages.about?.intro1 || '',
      intro2: messages.about?.intro2 || '',
      mission: messages.about?.mission || '',
      missionDesc: messages.about?.missionDesc || '',
      values: messages.about?.values || '',
      valuesDesc: messages.about?.valuesDesc || '',
      expertise: messages.about?.expertise || '',
      expertiseDesc: messages.about?.expertiseDesc || '',
      quality: messages.about?.quality || '',
      qualityDesc: messages.about?.qualityDesc || '',
    };

    return NextResponse.json(aboutData);
  } catch (error) {
    console.error('Error loading about data:', error);
    return NextResponse.json(
      { error: 'Failed to load about data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';
    const aboutData: AboutData = await request.json();

    const messagesPath = join(MESSAGES_DIR, `${locale}.json`);
    const messages = JSON.parse(await readFile(messagesPath, 'utf-8'));

    // Update about section
    if (!messages.about) {
      messages.about = {};
    }

    messages.about = {
      ...messages.about,
      title: aboutData.title,
      subtitle: aboutData.subtitle,
      description: aboutData.description,
      intro1: aboutData.intro1,
      intro2: aboutData.intro2,
      mission: aboutData.mission,
      missionDesc: aboutData.missionDesc,
      values: aboutData.values,
      valuesDesc: aboutData.valuesDesc,
      expertise: aboutData.expertise,
      expertiseDesc: aboutData.expertiseDesc,
      quality: aboutData.quality,
      qualityDesc: aboutData.qualityDesc,
    };

    await writeFile(messagesPath, JSON.stringify(messages, null, 2), 'utf-8');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving about data:', error);
    return NextResponse.json(
      { error: 'Failed to save about data' },
      { status: 500 }
    );
  }
}

