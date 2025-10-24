// Story-Typen und Interfaces

export interface Story {
  id: string;
  title: string;
  slug: string;
  content: string;
  gemstone: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  imageUrl: string;
  excerpt?: string;
  tags?: string[];
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface StorySection {
  id: string;
  type: 'text' | 'image' | 'quote' | 'video' | 'gallery';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  gallery?: string[];
  order: number;
  className?: string;
  style?: Record<string, string>;
}

export interface StoryCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'red';
}

export interface StoryTag {
  id: string;
  name: string;
  slug: string;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'red';
}

// Standard-Kategorien für Stories
export const defaultStoryCategories: StoryCategory[] = [
  { id: '1', name: 'Edelstein-Geschichten', slug: 'edelstein-geschichten', description: 'Geschichten über Edelsteine', color: 'blue' },
  { id: '2', name: 'Mining-Geschichten', slug: 'mining-geschichten', description: 'Geschichten aus dem Bergbau', color: 'green' },
  { id: '3', name: 'Historische Funde', slug: 'historische-funde', description: 'Historische Edelstein-Funde', color: 'yellow' },
  { id: '4', name: 'Familiengeschichten', slug: 'familiengeschichten', description: 'Familiengeschichten mit Edelsteinen', color: 'purple' },
];

// Standard-Tags für Stories
export const defaultStoryTags: StoryTag[] = [
  { id: '1', name: 'Diamant', slug: 'diamant', color: 'yellow' },
  { id: '2', name: 'Smaragd', slug: 'smaragd', color: 'green' },
  { id: '3', name: 'Rubin', slug: 'rubin', color: 'red' },
  { id: '4', name: 'Saphir', slug: 'saphir', color: 'blue' },
  { id: '5', name: 'Geschichte', slug: 'geschichte', color: 'purple' },
  { id: '6', name: 'Bergbau', slug: 'bergbau', color: 'orange' },
];

// Story Section Types
export type StorySectionType = 'text' | 'image' | 'quote' | 'video' | 'gallery';

export interface StorySectionConfig {
  type: StorySectionType;
  label: string;
  icon: string;
  className?: string;
  defaultContent?: string;
}

export const storySectionConfigs: StorySectionConfig[] = [
  {
    type: 'text',
    label: 'Text',
    icon: '📝',
    className: 'story-text-section',
    defaultContent: 'Hier können Sie Ihren Text eingeben...'
  },
  {
    type: 'image',
    label: 'Bild',
    icon: '🖼️',
    className: 'story-image-section',
    defaultContent: ''
  },
  {
    type: 'quote',
    label: 'Zitat',
    icon: '💬',
    className: 'story-quote-section',
    defaultContent: 'Hier können Sie ein Zitat eingeben...'
  },
  {
    type: 'video',
    label: 'Video',
    icon: '🎥',
    className: 'story-video-section',
    defaultContent: ''
  },
  {
    type: 'gallery',
    label: 'Galerie',
    icon: '🖼️',
    className: 'story-gallery-section',
    defaultContent: ''
  }
];

// Utility-Funktionen für Story-Slugs
export function generateStorySlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Utility-Funktionen für Story-Sections
export function createStorySection(
  type: StorySectionType,
  content: string = '',
  order: number = 0
): StorySection {
  const config = storySectionConfigs.find(c => c.type === type);
  
  return {
    id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    content: content || config?.defaultContent || '',
    order,
    className: config?.className,
    style: {}
  };
}

// Story-Validierung
export function validateStory(story: Partial<Story>): string[] {
  const errors: string[] = [];
  
  if (!story.title?.trim()) {
    errors.push('Titel ist erforderlich');
  }
  
  if (!story.content?.trim()) {
    errors.push('Inhalt ist erforderlich');
  }
  
  if (!story.gemstone?.trim()) {
    errors.push('Edelstein ist erforderlich');
  }
  
  if (!story.author?.trim()) {
    errors.push('Autor ist erforderlich');
  }
  
  return errors;
}

// Story-Section-Validierung
export function validateStorySection(section: Partial<StorySection>): string[] {
  const errors: string[] = [];
  
  if (!section.type) {
    errors.push('Section-Typ ist erforderlich');
  }
  
  if (!section.content?.trim() && section.type !== 'gallery') {
    errors.push('Inhalt ist erforderlich');
  }
  
  if (section.type === 'image' && !section.imageUrl?.trim()) {
    errors.push('Bild-URL ist für Bild-Sections erforderlich');
  }
  
  if (section.type === 'video' && !section.videoUrl?.trim()) {
    errors.push('Video-URL ist für Video-Sections erforderlich');
  }
  
  return errors;
}
