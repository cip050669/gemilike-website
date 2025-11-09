import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updateService, deleteService, ServiceInput } from '@/lib/services/about.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as Partial<ServiceInput>;
    const { slug, title, description, icon, features, order, locale, isActive } = body;

    const updateData: Partial<ServiceInput> = {};
    if (slug !== undefined) updateData.slug = slug;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (features !== undefined) updateData.features = features;
    if (order !== undefined) updateData.order = order;
    if (locale !== undefined) updateData.locale = locale;
    if (isActive !== undefined) updateData.isActive = isActive;

    const service = await updateService(id, updateData);

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔍 Service DELETE API - request received');
    const session = await getServerSession(authOptions);
    console.log('🔍 Session check:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      role: session?.user?.role,
      email: session?.user?.email,
    });
    
    if (!session?.user) {
      console.error('❌ No session or user found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }
    
    if (session.user.role !== 'ADMIN') {
      console.error('❌ User is not ADMIN:', session.user.role);
      return NextResponse.json({ error: 'Unauthorized - Not ADMIN' }, { status: 401 });
    }

    const { id } = await params;
    await deleteService(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
