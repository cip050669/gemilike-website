import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Hier würden Sie normalerweise den Newsticker-Eintrag löschen
    console.log('Deleting newsticker entry with ID:', id);
    
    // Simuliere eine erfolgreiche Löschung
    return NextResponse.json({ 
      success: true, 
      message: 'Newsticker-Eintrag erfolgreich gelöscht!' 
    });
  } catch (error) {
    console.error('Error deleting newsticker entry:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Löschen des Newsticker-Eintrags' },
      { status: 500 }
    );
  }
}
