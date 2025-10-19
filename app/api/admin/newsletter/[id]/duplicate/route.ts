import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Hier würden Sie normalerweise den Newsletter duplizieren
    console.log('Duplicating newsletter with ID:', id);
    
    // Simuliere eine erfolgreiche Duplizierung
    return NextResponse.json({ 
      success: true, 
      message: 'Newsletter erfolgreich dupliziert!' 
    });
  } catch (error) {
    console.error('Error duplicating newsletter:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Duplizieren des Newsletters' },
      { status: 500 }
    );
  }
}
