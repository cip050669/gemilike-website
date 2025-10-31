export interface ShopGemstoneDimensions {
  length: number | null;
  width: number | null;
  height: number | null;
}

export interface ShopGemstone {
  id: string;
  slug?: string;
  name: string;
  category: string;
  type: 'cut' | 'rough';
  price: number;
  currency: string;
  weight: number | null;
  weightUnit: 'ct' | 'g';
  origin: string | null;
  color: string | null;
  colorSaturation: string | null;
  clarity: string | null;
  cut: string | null;
  cutForm: string | null;
  treatment: string | null;
  description: string | null;
  shortDescription: string | null;
  certification: string | null;
  rarity: string | null;
  dimensions: ShopGemstoneDimensions;
  inStock: boolean;
  isSold: boolean;
  stock: number;
  isNew: boolean;
  images: string[];
  videos: string[];
}
