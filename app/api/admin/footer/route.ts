import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Hier würden Sie normalerweise die Daten in der Datenbank speichern
    console.log('Footer data received:', Object.fromEntries(formData));
    
    // Simuliere eine erfolgreiche Speicherung
    return NextResponse.json({ 
      success: true, 
      message: 'Footer-Einstellungen erfolgreich gespeichert!' 
    });
  } catch (error) {
    console.error('Error saving footer settings:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Speichern der Footer-Einstellungen' },
      { status: 500 }
    );
  }
}