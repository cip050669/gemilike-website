export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  contentImages: string[];
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  className?: string; // CSS-Klasse für Styling
  metaDescription?: string; // SEO Meta-Description
  readingTime?: number; // Geschätzte Lesezeit in Minuten
  difficulty?: 'beginner' | 'intermediate' | 'advanced'; // Schwierigkeitsgrad
}

type PickColor = 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'red';

export interface KnowledgeCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: PickColor;
}

export const defaultKnowledgeCategories: KnowledgeCategory[] = [
  { id: '1', name: 'Grundlagen', slug: 'grundlagen', description: 'Basiswissen zu Edelsteinen', color: 'blue' },
  { id: '2', name: 'Pflege & Reinigung', slug: 'pflege', description: 'Tipps zur Pflege', color: 'green' },
  { id: '3', name: 'Zertifikate', slug: 'zertifikate', description: 'Wissenswertes zu Zertifikaten', color: 'yellow' },
  { id: '4', name: 'Investment', slug: 'investment', description: 'Edelsteine als Wertanlage', color: 'purple' },
];

export interface KnowledgeTag {
  id: string;
  name: string;
  slug: string;
  color: PickColor;
}

export const defaultKnowledgeTags: KnowledgeTag[] = [
  { id: '1', name: 'Diamant', slug: 'diamant', color: 'yellow' },
  { id: '2', name: 'Smaragd', slug: 'smaragd', color: 'green' },
  { id: '3', name: 'Rubin', slug: 'rubin', color: 'red' },
  { id: '4', name: 'Zertifikat', slug: 'zertifikat', color: 'blue' },
  { id: '5', name: 'Investment', slug: 'investment', color: 'purple' },
  { id: '6', name: 'Pflege', slug: 'pflege', color: 'orange' },
];
