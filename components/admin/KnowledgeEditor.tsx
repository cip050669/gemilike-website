'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, X, Plus, Trash2, Edit, Eye, EyeOff, Upload, Image as ImageIcon } from 'lucide-react';
import { KnowledgeArticle, defaultKnowledgeCategories, defaultKnowledgeTags } from '@/lib/types/knowledge';
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
    image: !article?.image || article.image === '/blog/default-blog.jpg' ? PLACEHOLDER_IMAGE : article.image,
    contentImages: article?.contentImages || [],
    published: article?.published || false,
    featured: article?.featured || false,
  });
  const [newTag, setNewTag] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputStyles =
    'bg-gray-500 border-white/25 text-white placeholder:text-white/50 focus-visible:ring-white/40 focus-visible:border-white/40';
  const cardStyles =
    'bg-gray-500 border-white/15 text-white shadow-lg shadow-black/40';

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((entry) => entry !== tag),
    }));
  };

  const uploadImage = async (file: File) => {
    const formDataPayload = new FormData();
    formDataPayload.append('file', file);

    const response = await fetch('/api/admin/story-images', {
      method: 'POST',
      body: formDataPayload,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || 'Upload fehlgeschlagen');
    }

    const result = await response.json();
    return result.imageUrl as string;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Bitte wählen Sie eine Bilddatei aus.');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Die Datei ist zu groß. Maximum 5MB.');
      }

      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      alert('Bild erfolgreich hochgeladen!');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Upload fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => {
          if (!file.type.startsWith('image/')) {
            throw new Error(`${file.name} ist keine Bilddatei.`);
          }
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(`${file.name} überschreitet 5MB.`);
          }
          return uploadImage(file);
        })
      );
      setFormData((prev) => ({
        ...prev,
        contentImages: [...prev.contentImages, ...uploads],
      }));
      alert(`${uploads.length} Bilder erfolgreich hochgeladen!`);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Upload fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveContentImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contentImages: prev.contentImages.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Bitte füllen Sie Titel und Inhalt aus.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error(error);
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
          {isCreating ? 'Neuer Wissenswert-Artikel' : 'Artikel bearbeiten'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="grid gap-4 md:grid-cols-2">
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
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger className={inputStyles}>
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                {defaultKnowledgeCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Auszug *</Label>
          <Textarea
            id="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            placeholder="Kurzer Teasertext"
            className={cn('resize-none', inputStyles)}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            Titelbild
            {isLoading && <span className="text-xs text-white/60">Lade...</span>}
          </Label>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="h-40 w-full md:w-64 overflow-hidden rounded-lg border border-dashed border-white/20 bg-gray-500">
              <img
                src={formData.image || PLACEHOLDER_IMAGE}
                alt="Titelbild"
                className="h-full w-full object-cover"
              />
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 border border-white/25 rounded-md cursor-pointer hover:bg-gray-600 transition">
              <Upload className="h-4 w-4" />
              Titelbild hochladen
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Inhaltsbilder</Label>
          <div className="flex flex-wrap gap-3">
            {formData.contentImages.map((img, index) => (
              <div key={img} className="relative h-24 w-24 overflow-hidden rounded-lg border border-white/20">
                <img src={img} alt={`content-${index}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="absolute top-1 right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-800/50/70 text-white"
                  onClick={() => handleRemoveContentImage(index)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="inline-flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/30 text-white/70 hover:border-white/50">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs">Bilder hinzufügen</span>
              <input type="file" accept="image/*" multiple onChange={handleContentImagesUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                #{tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="text-xs">
                  ×
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Neuen Tag hinzufügen"
              className={inputStyles}
            />
            <Button type="button" onClick={handleAddTag} variant="outline" className="sm:w-40">
              <Plus className="h-4 w-4 mr-2" />
              Tag hinzufügen
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-white/60">
            {defaultKnowledgeTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                className="rounded-full border border-white/20 px-3 py-1 hover:bg-gray-800/30/10"
                onClick={() => handleInputChange('tags', Array.from(new Set([...formData.tags, tag.name])))}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Inhalt *</Label>
          <Textarea
            id="content"
            rows={12}
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Artikelinhalt als Markdown"
            className={cn('font-mono', inputStyles)}
          />
          <div className="flex items-center gap-3">
            <Button type="button" onClick={() => setPreviewOpen((prev) => !prev)} variant="secondary">
              {previewOpen ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Vorschau ausblenden
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Vorschau anzeigen
                </>
              )}
            </Button>
          </div>
          {previewOpen && (
            <MarkdownPreview content={formData.content} />
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-white/20 px-4 py-3">
            <div>
              <p className="font-medium">Veröffentlicht</p>
              <p className="text-sm text-white/60">
                Sichtbar auf der Wissenswert-Seite
              </p>
            </div>
            <Switch
              checked={formData.published}
              onCheckedChange={(checked) => handleInputChange('published', checked)}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/20 px-4 py-3">
            <div>
              <p className="font-medium">Hervorgehoben</p>
              <p className="text-sm text-white/60">
                In Listen bevorzugt anzeigen
              </p>
            </div>
            <Switch
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange('featured', checked)}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button type="button" variant="outline" onClick={onCancel} className="sm:w-40">
            <X className="h-4 w-4 mr-2" />
            Abbrechen
          </Button>
          <Button type="button" onClick={handleSave} disabled={isLoading} className="sm:w-48">
            {isLoading ? (
              <>
                <Save className="h-4 w-4 animate-spin mr-2" />
                Speichert…
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Artikel speichern
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
