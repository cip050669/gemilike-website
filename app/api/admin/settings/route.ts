import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Hier würden Sie normalerweise die Daten in der Datenbank speichern
    console.log('Settings data received:', Object.fromEntries(formData));
    
    // Simuliere eine erfolgreiche Speicherung
    return NextResponse.json({ 
      success: true, 
      message: 'System-Einstellungen erfolgreich gespeichert!' 
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler beim Speichern der Einstellungen' },
      { status: 500 }
    );
  }
}
