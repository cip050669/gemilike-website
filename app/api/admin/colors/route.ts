import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export interface ColorDefinition {
  id: string;
  name: string;
  value: string;
  bg: string;
  text: string;
  border: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const COLORS_FILE = join(process.cwd(), 'lib/data/colors.json');

// Standard-Farben
const defaultColors: ColorDefinition[] = [
  {
    id: 'blue',
    name: 'Blau',
    value: 'blau',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'red',
    name: 'Rot',
    value: 'rot',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'green',
    name: 'Grün',
    value: 'grün',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'yellow',
    name: 'Gelb',
    value: 'gelb',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'orange',
    name: 'Orange',
    value: 'orange',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'purple',
    name: 'Lila',
    value: 'lila',
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'pink',
    name: 'Pink',
    value: 'pink',
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-200',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'white',
    name: 'Weiß',
    value: 'weiß',
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'black',
    name: 'Schwarz',
    value: 'schwarz',
    bg: 'bg-gray-800',
    text: 'text-white',
    border: 'border-gray-700',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'brown',
    name: 'Braun',
    value: 'braun',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'transparent',
    name: 'Transparent',
    value: 'transparent',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-200',
    isCustom: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function loadColors(): Promise<ColorDefinition[]> {
  try {
    const data = await readFile(COLORS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Datei existiert nicht, Standard-Farben verwenden
    return defaultColors;
  }
}

async function saveColors(colors: ColorDefinition[]): Promise<void> {
  await writeFile(COLORS_FILE, JSON.stringify(colors, null, 2), 'utf-8');
}

export async function GET(request: NextRequest) {
  try {
    // Für GET-Requests (nur Lesen) ist keine Authentifizierung erforderlich
    const colors = await loadColors();
    return NextResponse.json({ colors });

  } catch (error) {
    console.error('Error loading colors:', error);
    return NextResponse.json(
      { error: 'Failed to load colors' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Für Development: Authentifizierung temporär deaktiviert
    // In Production sollte hier die Session-Überprüfung aktiviert werden
    const session = await getServerSession(authOptions);
    
    // Temporär: Erlaube POST-Requests ohne Authentifizierung für Development
    // TODO: In Production wieder aktivieren
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const { name, value, bg, text, border } = await request.json();

    if (!name || !value || !bg || !text || !border) {
      return NextResponse.json(
        { error: 'All color properties are required' },
        { status: 400 }
      );
    }

    const colors = await loadColors();
    
    // Prüfen ob Farbe bereits existiert
    const existingColor = colors.find(c => c.value.toLowerCase() === value.toLowerCase());
    if (existingColor) {
      return NextResponse.json(
        { error: 'Color with this value already exists' },
        { status: 409 }
      );
    }

    const newColor: ColorDefinition = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      value,
      bg,
      text,
      border,
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    colors.push(newColor);
    await saveColors(colors);

    return NextResponse.json({ color: newColor }, { status: 201 });

  } catch (error) {
    console.error('Error creating color:', error);
    return NextResponse.json(
      { error: 'Failed to create color' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Für Development: Authentifizierung temporär deaktiviert
    const session = await getServerSession(authOptions);
    
    // Temporär: Erlaube PUT-Requests ohne Authentifizierung für Development
    // TODO: In Production wieder aktivieren
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const { id, name, value, bg, text, border } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Color ID is required' },
        { status: 400 }
      );
    }

    const colors = await loadColors();
    const colorIndex = colors.findIndex(c => c.id === id);

    if (colorIndex === -1) {
      return NextResponse.json(
        { error: 'Color not found' },
        { status: 404 }
      );
    }

    // Nur benutzerdefinierte Farben können bearbeitet werden
    if (!colors[colorIndex].isCustom) {
      return NextResponse.json(
        { error: 'Cannot edit default colors' },
        { status: 403 }
      );
    }

    // Aktualisieren
    if (name) colors[colorIndex].name = name;
    if (value) colors[colorIndex].value = value;
    if (bg) colors[colorIndex].bg = bg;
    if (text) colors[colorIndex].text = text;
    if (border) colors[colorIndex].border = border;
    colors[colorIndex].updatedAt = new Date();

    await saveColors(colors);

    return NextResponse.json({ color: colors[colorIndex] });

  } catch (error) {
    console.error('Error updating color:', error);
    return NextResponse.json(
      { error: 'Failed to update color' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Für Development: Authentifizierung temporär deaktiviert
    const session = await getServerSession(authOptions);
    
    // Temporär: Erlaube DELETE-Requests ohne Authentifizierung für Development
    // TODO: In Production wieder aktivieren
    // if (!session?.user?.id) {
    //   return NextResponse.json(
    //     { error: 'Authentication required' },
    //     { status: 401 }
    //   );
    // }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Color ID is required' },
        { status: 400 }
      );
    }

    const colors = await loadColors();
    const colorIndex = colors.findIndex(c => c.id === id);

    if (colorIndex === -1) {
      return NextResponse.json(
        { error: 'Color not found' },
        { status: 404 }
      );
    }

    // Nur benutzerdefinierte Farben können gelöscht werden
    if (!colors[colorIndex].isCustom) {
      return NextResponse.json(
        { error: 'Cannot delete default colors' },
        { status: 403 }
      );
    }

    colors.splice(colorIndex, 1);
    await saveColors(colors);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting color:', error);
    return NextResponse.json(
      { error: 'Failed to delete color' },
      { status: 500 }
    );
  }
}
