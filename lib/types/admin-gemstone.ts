export interface AdminGemstone {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  weight?: number | null;
  dimensions?: string | null;
  color?: string | null;
  colorIntensity?: string | null;
  colorBrightness?: string | null;
  clarity?: string | null;
  cut?: string | null;
  cutForm?: string | null;
  treatment?: string | null;
  certification?: string | null;
  rarity?: string | null;
  origin?: string | null;
  description?: string | null;
  images?: string[];
  inStock: boolean;
  stock: number;
  sku?: string | null;
  isNew: boolean;
  createdAt?: string;
  updatedAt?: string;
}
