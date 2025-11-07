'use client';

import { useState } from 'react';
import { AdminButton } from './AdminButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Plus, Trash2, Edit, Eye, EyeOff, Upload } from 'lucide-react';
import Image from 'next/image';
import { KnowledgeArticle, defaultKnowledgeCategories } from '@/lib/types/knowledge';
import { MarkdownPreview } from './MarkdownPreview';
import { cn } from '@/lib/utils';

interface KnowledgeEditorProps {
  article?: KnowledgeArticle;
  onSave: (article: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { slug?: string }) => void;
  onCancel: () => void;
  isCreating?: boolean;
}

const PLACEHOLDER_IMAGE = '/images/stories/placeholder-gem.svg';

export function KnowledgeEditor({ article, onSave, onCancel, isCreating = false }: KnowledgeEditorProps) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    author: article?.author || 'Gemilike Redaktion',
    category: article?.category || 'Grundlagen',
    tags: article?.tags || [],
    image: !article?.image || article.image === '/blog/default-blog.jpg'
      ? PLACEHOLDER_IMAGE
      : article.image,
    contentImages: article?.contentImages || [],
    published: article?.published || false,
    featured: article?.featured || false,
    locale: article?.locale || 'de',
    metaDescription: article?.metaDescription || '',
    readingTime: article?.readingTime || undefined,
    difficulty: article?.difficulty || undefined,
  });

  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const inputStyles =
    'bg-gray-800/50/40 border-white/25 text-white placeholder:text-white/50 focus-visible:ring-white/40 focus-visible:border-white/40';
  const cardStyles =
    'bg-gray-800/50/50 border-white/15 text-white shadow-lg shadow-black/40';

  const handleInputChange = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      if (!file.type.startsWith('image/')) {
        alert('Bitte wählen Sie eine Bilddatei aus.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Die Datei ist zu groß. Maximale Größe: 5MB');
        return;
      }

      const formDataPayload = new FormData();
      formDataPayload.append('file', file);

      const response = await fetch('/api/admin/story-images', {
        method: 'POST',
        body: formDataPayload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload fehlgeschlagen');
      }

      const result = await response.json();
      setFormData(prev => ({ ...prev, image: result.imageUrl }));
      alert('Bild erfolgreich hochgeladen!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Fehler beim Hochladen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} ist keine Bilddatei.`);
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} ist zu groß. Maximale Größe: 5MB`);
        }

        const formDataPayload = new FormData();
        formDataPayload.append('file', file);

        const response = await fetch('/api/admin/story-images', {
          method: 'POST',
          body: formDataPayload,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload fehlgeschlagen');
        }

        const result = await response.json();
        return result.imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({ 
        ...prev, 
        contentImages: [...prev.contentImages, ...uploadedUrls] 
      }));
      alert(`${uploadedUrls.length} Bilder erfolgreich hochgeladen!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Fehler beim Hochladen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveContentImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contentImages: prev.contentImages.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Bitte füllen Sie Titel und Inhalt aus.');
      return;
    }

    setIsLoading(true);
    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      await onSave({ ...formData, slug });
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Fehler beim Speichern des Artikels');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn('w-full max-w-4xl mx-auto', cardStyles)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5" />
          {isCreating ? 'Neuer Wissenswert-Artikel' : 'Wissenswert-Artikel bearbeiten'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Titel */}
        <div className="space-y-2">
          <Label htmlFor="title">Titel *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Titel des Artikels"
            className={cn('text-lg', inputStyles)}
          />
        </div>

        {/* Autor und Kategorie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author">Autor</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              placeholder="Autor"
              className={inputStyles}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger className={cn(inputStyles, 'font-medium')}>
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 shadow-xl">
                {defaultKnowledgeCategories.map((category) => (
                  <SelectItem 
                    key={category.id} 
                    value={category.name}
                    className="text-gray-900 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bild */}
        <div className="space-y-2">
          <Label htmlFor="image">Bild-URL</Label>
          <div className="flex items-center gap-2">
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="/images/stories/beispiel-bild.jpg"
              className={cn('flex-1', inputStyles)}
            />
            <AdminButton 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById('imageUploadInput')?.click()} 
              disabled={isLoading}
              className="border-white/40 text-white hover:bg-gray-800/30/10"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </AdminButton>
            <input
              id="imageUploadInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isLoading}
            />
          </div>
          {formData.image && (
            <div className="relative w-full h-48 border rounded-lg overflow-hidden mt-2">
              <Image
                src={formData.image}
                alt="Bild-Vorschau"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>

        {/* Content-Bilder */}
        <div className="space-y-2">
          <Label>Content-Bilder</Label>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AdminButton 
                type="button" 
                variant="outline" 
                onClick={() => document.getElementById('contentImagesUploadInput')?.click()} 
                disabled={isLoading}
                className="border-white/40 text-white hover:bg-gray-800/30/10"
              >
                <Upload className="h-4 w-4 mr-2" />
                Bilder hochladen
              </AdminButton>
              <input
                id="contentImagesUploadInput"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleContentImagesUpload}
                disabled={isLoading}
              />
              <span className="text-sm text-white/70">
                Mehrere Bilder gleichzeitig auswählen möglich
              </span>
            </div>
            
            {formData.contentImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.contentImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={`Content Bild ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                      <AdminButton
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveContentImage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </AdminButton>
                    </div>
                    <div className="text-xs text-white/70 mt-1 truncate">
                      {imageUrl.split('/').pop()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-xs text-white/70 space-y-1">
            <p className="font-semibold text-amber-300">
              ⚠️ Wichtig: Bilder müssen mit Markdown-Syntax eingefügt werden!
            </p>
            <p>
              Diese Bilder können im Artikel-Inhalt verwendet werden.
              Kopieren Sie die URLs und fügen Sie sie in den Markdown-Inhalt ein:
            </p>
            <code className="bg-gray-800/30/10 px-2 py-1 rounded block text-white">![Bildbeschreibung](URL)</code>
            <p className="text-amber-300">
              ✗ Falsch: <code className="bg-gray-800/30/10 px-1 rounded text-white">/uploads/bild.jpg</code> (wird als Link angezeigt)<br />
              ✓ Richtig: <code className="bg-gray-800/30/10 px-1 rounded text-white">![Mein Bild](/uploads/bild.jpg)</code> (wird als Bild angezeigt)
            </p>
          </div>
        </div>

        {/* Kurzbeschreibung */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Kurzbeschreibung</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            placeholder="Kurze Beschreibung des Artikels"
            rows={3}
            className={inputStyles}
          />
        </div>

        {/* Inhalt */}
        <div className="space-y-2">
          <Label htmlFor="content">Inhalt * (Markdown unterstützt)</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Vollständiger Inhalt des Artikels (Markdown-Formatierung möglich)"
            rows={12}
            className={cn('font-mono text-sm', inputStyles)}
          />
          <div className="text-xs text-white/70">
            <strong>Markdown-Unterstützung:</strong> Überschriften (# ## ###), 
            <strong>Fett</strong>, <em>Kursiv</em>, Listen (- *), Links [Text](URL), 
            Code `inline` und ```Blöcke```, Tabellen, Bilder ![Alt](URL)
          </div>
        </div>

        {/* Markdown-Vorschau */}
        <MarkdownPreview content={formData.content} />

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Neues Tag hinzufügen"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className={inputStyles}
            />
            <AdminButton type="button" onClick={handleAddTag} size="sm">
              <Plus className="h-4 w-4" />
            </AdminButton>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 bg-gray-800/30/10 text-white border border-white/20"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Locale und SEO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="locale">Sprache (Locale)</Label>
            <Select value={formData.locale} onValueChange={(value) => handleInputChange('locale', value)}>
              <SelectTrigger className={cn(inputStyles, 'font-medium')}>
                <SelectValue placeholder="Sprache auswählen" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border border-white/30 shadow-xl">
                <SelectItem value="de" className="text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                  Deutsch
                </SelectItem>
                <SelectItem value="en" className="text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                  English
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="readingTime">Lesezeit (Minuten)</Label>
            <Input
              id="readingTime"
              type="number"
              min="1"
              value={formData.readingTime || ''}
              onChange={(e) => handleInputChange('readingTime', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Wird automatisch berechnet"
              className={inputStyles}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta-Description (SEO)</Label>
          <Textarea
            id="metaDescription"
            value={formData.metaDescription}
            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
            placeholder="Kurze Beschreibung für Suchmaschinen (max. 160 Zeichen)"
            rows={3}
            maxLength={160}
            className={inputStyles}
          />
          <div className="text-xs text-white/70">
            {formData.metaDescription.length}/160 Zeichen
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Schwierigkeitsgrad</Label>
          <Select 
            value={formData.difficulty || 'beginner'} 
            onValueChange={(value) => handleInputChange('difficulty', value as 'beginner' | 'intermediate' | 'advanced')}
          >
            <SelectTrigger className={cn(inputStyles, 'font-medium')}>
              <SelectValue placeholder="Schwierigkeitsgrad auswählen" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border border-white/30 shadow-xl">
              <SelectItem value="beginner" className="text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                Anfänger
              </SelectItem>
              <SelectItem value="intermediate" className="text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                Fortgeschritten
              </SelectItem>
              <SelectItem value="advanced" className="text-white cursor-pointer hover:bg-gray-800 focus:bg-gray-800 focus:text-white">
                Experte
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Einstellungen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => handleInputChange('published', checked)}
              className="data-[state=checked]:bg-gray-800/30 data-[state=unchecked]:bg-gray-800/30/30"
            />
            <Label htmlFor="published" className="flex items-center gap-2">
              {formData.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Veröffentlicht
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange('featured', checked)}
              className="data-[state=checked]:bg-gray-800/30 data-[state=unchecked]:bg-gray-800/30/30"
            />
            <Label htmlFor="featured">Hervorgehoben</Label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <AdminButton onClick={handleSave} disabled={isLoading} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Speichern...' : 'Speichern'}
          </AdminButton>
          <AdminButton
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border-white/40 text-white hover:bg-gray-800/30/10"
          >
            <X className="h-4 w-4 mr-2" />
            Abbrechen
          </AdminButton>
        </div>
      </CardContent>
    </Card>
  );
}
