// Blog-Typen und Interfaces

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  contentImages: string[]; // Bilder für den Blog-Inhalt
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  color: string;
}

// Standard-Kategorien
export const defaultCategories: BlogCategory[] = [
  { id: '1', name: 'Edelsteinkunde', slug: 'edelsteinkunde', description: 'Wissen über Edelsteine', color: 'blue' },
  { id: '2', name: 'Expertenwissen', slug: 'expertenwissen', description: 'Fachwissen und Tipps', color: 'green' },
  { id: '3', name: 'Investment', slug: 'investment', description: 'Edelsteine als Investment', color: 'yellow' },
  { id: '4', name: 'Diamanten', slug: 'diamanten', description: 'Alles über Diamanten', color: 'purple' },
  { id: '5', name: 'Kaufberatung', slug: 'kaufberatung', description: 'Tipps zum Kauf', color: 'orange' },
  { id: '6', name: 'Zertifizierung', slug: 'zertifizierung', description: 'Zertifikate und Labore', color: 'red' },
];

// Standard-Tags
export const defaultTags: BlogTag[] = [
  { id: '1', name: 'Smaragd', slug: 'smaragd', color: 'green' },
  { id: '2', name: 'Rubin', slug: 'rubin', color: 'red' },
  { id: '3', name: 'Saphir', slug: 'saphir', color: 'blue' },
  { id: '4', name: 'Diamant', slug: 'diamant', color: 'white' },
  { id: '5', name: 'Behandlung', slug: 'behandlung', color: 'orange' },
  { id: '6', name: 'Zertifikat', slug: 'zertifikat', color: 'purple' },
];


