import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Hier würden Sie normalerweise den Blog-Beitrag aus der Datenbank löschen
    console.log('Deleting blog post with ID:', id);
    
    // Simuliere eine erfolgreiche Löschung
    return NextResponse.json({ 
      success: true, 
      message: 'Blog-Beitrag erfolgreich gelöscht!' 
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Löschen des Blog-Beitrags' },
      { status: 500 }
    );
  }
}
