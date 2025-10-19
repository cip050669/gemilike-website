import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Hier würden Sie normalerweise den Abonnenten abmelden
    console.log('Unsubscribing user with ID:', id);
    
    // Simuliere eine erfolgreiche Abmeldung
    return NextResponse.json({ 
      success: true, 
      message: 'Abonnent erfolgreich abgemeldet!' 
    });
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Abmelden des Abonnenten' },
      { status: 500 }
    );
  }
}
