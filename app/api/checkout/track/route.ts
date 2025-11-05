import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionWithUser } from '@/lib/session';

interface CheckoutEventBody {
  cartId?: string | null;
  step: string;
  stepOrder?: number;
  duration?: number | null;
  metadata?: Record<string, unknown> | null;
  error?: string | null;
  completed?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Parse body - kann als JSON oder als String (von sendBeacon) kommen
    let body: CheckoutEventBody;
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else {
      // sendBeacon sendet als Text
      const text = await request.text();
      try {
        body = JSON.parse(text) as CheckoutEventBody;
      } catch (parseError) {
        console.error('Error parsing body:', parseError);
        return NextResponse.json(
          { success: false, error: 'Invalid request body' },
          { status: 400 }
        );
      }
    }
    
    const {
      cartId,
      step,
      stepOrder,
      duration,
      metadata,
      error,
      completed,
    } = body;

    // Session-ID für nicht-eingeloggte Nutzer
    const sessionId = request.headers.get('x-session-id') || 
                     request.cookies.get('sessionId')?.value || 
                     null;

    // Customer-ID aus Session (nur wenn eingeloggt - nicht blockieren wenn nicht)
    let customerId: string | null = null;
    try {
      const { session } = await getSessionWithUser();
      if (session?.user?.id) {
        const customer = await prisma.customer.findUnique({
          where: { userId: session.user.id },
          select: { id: true },
        });
        customerId = customer?.id || null;
      }
    } catch {
      // Nicht eingeloggt - kein Problem, weiter mit sessionId
      // Tracking sollte auch für Gäste funktionieren
    }

    const checkoutEvent = await prisma.checkoutEvent.create({
      data: {
        cartId: cartId || null,
        customerId,
        sessionId,
        step,
        stepOrder: stepOrder || 0,
        duration: duration || null,
        metadata: (metadata || null) as Parameters<typeof prisma.checkoutEvent.create>[0]['data']['metadata'],
        error: error || null,
        completed: completed || false,
      },
    });

    return NextResponse.json({ success: true, id: checkoutEvent.id });
  } catch (error) {
    console.error('Error tracking checkout event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track checkout event' },
      { status: 500 }
    );
  }
}

