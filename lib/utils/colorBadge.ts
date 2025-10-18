// Fallback-Farben für den Fall, dass die API nicht verfügbar ist
const fallbackColorMap: Record<string, { bg: string; text: string; border?: string }> = {
  'blau': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  'blue': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  'rot': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  'red': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  'grün': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  'green': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  'gelb': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  'yellow': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  'orange': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
  'lila': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  'purple': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
  'violett': { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200' },
  'pink': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  'rosa': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
  'weiß': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  'white': { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' },
  'schwarz': { bg: 'bg-gray-800', text: 'text-white', border: 'border-gray-700' },
  'black': { bg: 'bg-gray-800', text: 'text-white', border: 'border-gray-700' },
  'braun': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  'brown': { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  'transparent': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' },
  'clear': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' },
};

// Hilfsfunktion für dynamische Badge-Farben basierend auf Edelstein-Farbe
export const getColorBadgeStyle = (color: string) => {
  const normalizedColor = color.toLowerCase();
  
  // Versuche zuerst die Fallback-Farben zu verwenden
  return fallbackColorMap[normalizedColor] || { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800', 
    border: 'border-gray-200' 
  };
};

// Farbintensität-Badge-Styles
const colorIntensityStyles: Record<string, { bg: string; text: string; border: string }> = {
  'Vivid': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  'Intense': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  'Light': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
};

// Hilfsfunktion für Farbintensität-Badge-Styles
export const getColorIntensityBadgeStyle = (intensity: string) => {
  return colorIntensityStyles[intensity] || { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800', 
    border: 'border-gray-300' 
  };
};

// Erweiterte Funktion für Server-seitige Verwendung mit API-Farben
export const getColorBadgeStyleWithAPI = async (color: string) => {
  try {
    const response = await fetch('/api/admin/colors');
    if (response.ok) {
      const data = await response.json();
      const apiColor = data.colors?.find((c: { value: string }) => 
        c.value.toLowerCase() === color.toLowerCase()
      );
      
      if (apiColor) {
        return {
          bg: apiColor.bg,
          text: apiColor.text,
          border: apiColor.border
        };
      }
    }
  } catch (error) {
    console.warn('Failed to load colors from API, using fallback:', error);
  }
  
  // Fallback zu den Standard-Farben
  return getColorBadgeStyle(color);
};
