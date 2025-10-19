import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Hier würden Sie normalerweise die Story aus der Datenbank löschen
    console.log('Deleting story with ID:', id);
    
    // Simuliere eine erfolgreiche Löschung
    return NextResponse.json({ 
      success: true, 
      message: 'Story erfolgreich gelöscht!' 
    });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Löschen der Story' },
      { status: 500 }
    );
  }
}
