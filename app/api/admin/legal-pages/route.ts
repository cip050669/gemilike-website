import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Legal Pages API - GET request received');
    
    // Check cookies
    const cookieHeader = request.headers.get('cookie');
    console.log('🔍 Cookies received:', cookieHeader ? 'Yes' : 'No');
    if (cookieHeader) {
      const hasAuthCookie = cookieHeader.includes('next-auth.session-token') || cookieHeader.includes('__Secure-next-auth.session-token');
      console.log('🔍 Has auth cookie:', hasAuthCookie);
    }
    
    const session = await getServerSession(authOptions);
    console.log('🔍 Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      role: (session?.user as { role?: string })?.role,
      email: session?.user?.email,
    });
    
    if (!session?.user) {
      console.error('❌ No session or user found');
      console.error('❌ Please ensure you are logged in at /de/admin/login');
      return NextResponse.json({ 
        error: 'Unauthorized - No session. Please log in at /de/admin/login' 
      }, { status: 401 });
    }
    
    if ((session.user as { role?: string }).role !== 'ADMIN') {
      console.error('❌ User is not ADMIN:', (session.user as { role?: string }).role);
      return NextResponse.json({ error: 'Unauthorized - Not ADMIN' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'de';

    const pages = await prisma.legalPage.findMany({
      where: { locale },
      orderBy: { slug: 'asc' },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching legal pages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, content, locale = 'de', isActive = true } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Slug, title, and content are required' },
        { status: 400 }
      );
    }

    const page = await prisma.legalPage.create({
      data: {
        slug,
        title,
        content,
        locale,
        isActive,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating legal page:', error);
    if ((error as { code?: string }).code === 'P2002') {
      return NextResponse.json(
        { error: 'A page with this slug and locale already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

