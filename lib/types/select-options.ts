export interface SelectOption {
  id: string;
  value: string;
  label: string;
  category: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SelectOptionsSettings {
  options: SelectOption[];
}

export type SelectCategory = 
  | 'cut'           // Schliff
  | 'form'          // Form
  | 'clarity'       // Reinheit
  | 'color'         // Farbe
  | 'colorIntensity' // Farbintensität
  | 'treatment'     // Behandlung
  | 'certification' // Zertifizierung
  | 'rarity';       // Rarität
