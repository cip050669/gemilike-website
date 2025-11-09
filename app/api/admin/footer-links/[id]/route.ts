import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionWithUser } from '@/lib/session';

interface FooterLinkPayload {
  text: string;
  url: string;
  section: string;
  order: number;
  locale: string;
  isActive?: boolean;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session } = await getSessionWithUser();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as FooterLinkPayload;

    const link = await prisma.footerLink.update({
      where: { id },
      data: {
        text: body.text,
        url: body.url,
        section: body.section,
        order: body.order,
        locale: body.locale,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error updating footer link:', error);
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
    const { session } = await getSessionWithUser();
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.footerLink.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting footer link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
