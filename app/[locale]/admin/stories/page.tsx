'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Image as ImageIcon,
  FileText,
  Calendar,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { StoryItem, StorySectionSettings } from '@/lib/hooks/useStorySettings';

interface CreateStoryFormProps {
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (file: File) => Promise<string>;
  saving: boolean;
}

function CreateStoryForm({ onSave, onCancel, onImageUpload, saving }: CreateStoryFormProps) {
  const [formData, setFormData] = useState({
    title: 'Neue Edelstein-Geschichte',
    description: 'Beschreiben Sie die Geschichte dieses Edelsteins.',
    shortDescription: 'Kurze Beschreibung der Geschichte.',
    content: '',
    imageUrl: '/images/stories/placeholder-gem.svg',
    published: false,
  });
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await onImageUpload(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      setPreviewImage(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Fehler beim Hochladen des Bildes');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addStory',
          story: formData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          onSave();
          // Event auslösen, um Homepage zu aktualisieren
          window.dispatchEvent(new CustomEvent('story-settings-updated'));
        } else {
          throw new Error(result.error || 'Failed to create story');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create story');
      }
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Fehler beim Erstellen der Geschichte');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Titel</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Titel der Geschichte"
        />
      </div>
      
               <div className="space-y-2">
                 <Label>Kurzbeschreibung</Label>
                 <Textarea
                   value={formData.shortDescription}
                   onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                   placeholder="Kurze Beschreibung der Geschichte"
                   rows={2}
                 />
               </div>
               
               <div className="space-y-2">
                 <Label>Vollständige Beschreibung</Label>
                 <Textarea
                   value={formData.description}
                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                   placeholder="Vollständige Beschreibung der Geschichte"
                   rows={4}
                 />
               </div>

               <div className="space-y-2">
                 <Label>Inhalt (Markdown)</Label>
                 <Textarea
                   value={formData.content || ''}
                   onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                   placeholder="Markdown-Inhalt der Geschichte (optional)"
                   rows={8}
                 />
                 <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-amber-600 dark:text-amber-400">
                    ⚠️ Wichtig: Bilder müssen mit Markdown-Syntax eingefügt werden!
                  </p>
                  <p>
                    Verwenden Sie Markdown-Syntax für Formatierung.
                  </p>
                  <code className="bg-muted px-2 py-1 rounded block">![Bildbeschreibung](URL)</code>
                  <p className="text-amber-600 dark:text-amber-400">
                    ✗ Falsch: <code className="bg-muted px-1 rounded">/uploads/bild.jpg</code> (wird als Link angezeigt)<br />
                    ✓ Richtig: <code className="bg-muted px-1 rounded">![Mein Bild](/uploads/bild.jpg)</code> (wird als Bild angezeigt)
                  </p>
                </div>
               </div>

               <div className="space-y-2">
                 <Label>Veröffentlicht</Label>
                 <div className="flex items-center space-x-2">
                   <Switch
                     checked={formData.published}
                     onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                   />
                   <span className="text-sm text-muted-foreground">
                     {formData.published ? 'Veröffentlicht' : 'Entwurf'}
                   </span>
                 </div>
               </div>

      <div className="space-y-2">
        <Label>Bild</Label>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={formData.imageUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="/images/stories/placeholder-gem.svg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="upload-new-story"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('upload-new-story')?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Lädt...' : 'Bild hochladen'}
            </Button>
          </div>
          
          {(previewImage || formData.imageUrl) && (
            <div className="space-y-2">
              <Label>Bildvorschau</Label>
              <div className="aspect-video bg-muted rounded-md overflow-hidden">
                <img
                  src={previewImage || formData.imageUrl}
                  alt="Bildvorschau"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving || uploading}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Erstelle...' : 'Erstellen'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Abbrechen
        </Button>
      </div>
    </div>
  );
}

export default function StoriesAdminPage() {
  const [stories, setStories] = useState<StorySectionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingStory, setEditingStory] = useState<StoryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    sectionTitle: '',
    sectionDescription: '',
  });

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stories');
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories);
        setSettings({
          sectionTitle: data.stories.sectionTitle,
          sectionDescription: data.stories.sectionDescription,
        });
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateSettings',
          settings,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStories(data.stories);
        alert('Einstellungen erfolgreich gespeichert!');
        // Event auslösen, um Homepage zu aktualisieren
        window.dispatchEvent(new CustomEvent('story-settings-updated'));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Fehler beim Speichern der Einstellungen');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateStory = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addStory',
          story: {
            title: 'Neue Edelstein-Geschichte',
            description: 'Beschreiben Sie die Geschichte dieses Edelsteins.',
            imageUrl: '/images/stories/placeholder-gem.svg',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStories(data.stories);
        setIsCreating(false);
        // Event auslösen, um Homepage zu aktualisieren
        window.dispatchEvent(new CustomEvent('story-settings-updated'));
      }
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Fehler beim Erstellen der Geschichte');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSaveStory = async (story: StoryItem) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateStory',
          story,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStories(data.stories);
        setEditingStory(null);
        alert('Geschichte erfolgreich gespeichert!');
        // Event auslösen, um Homepage zu aktualisieren
        window.dispatchEvent(new CustomEvent('story-settings-updated'));
      }
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Fehler beim Speichern der Geschichte');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStory = async (id: string) => {
    if (!confirm('Möchten Sie diese Geschichte wirklich löschen?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteStory',
          story: { id },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStories(data.stories);
        alert('Geschichte erfolgreich gelöscht!');
        // Event auslösen, um Homepage zu aktualisieren
        window.dispatchEvent(new CustomEvent('story-settings-updated'));
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Fehler beim Löschen der Geschichte');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Lade Geschichten...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Geschichten um Edelsteine</h1>
        <p className="text-muted-foreground">Verwalten Sie die Geschichten-Sektion Ihrer Website</p>
      </div>

      {/* Einstellungen */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sektionseinstellungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sectionTitle">Abschnittstitel</Label>
              <Input
                id="sectionTitle"
                value={settings.sectionTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, sectionTitle: e.target.value }))}
                placeholder="Geschichten um Edelsteine"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sectionDescription">Beschreibung</Label>
              <Textarea
                id="sectionDescription"
                value={settings.sectionDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, sectionDescription: e.target.value }))}
                placeholder="Faszinierende Einblicke in die Welt der Edelsteine..."
                rows={3}
              />
            </div>
          </div>
          <Button onClick={handleSaveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Speichere...' : 'Einstellungen speichern'}
          </Button>
        </CardContent>
      </Card>

      {/* Geschichten-Liste */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Geschichten ({stories?.stories.length || 0})</h2>
        <Button onClick={() => setIsCreating(true)} disabled={saving}>
          <Plus className="h-4 w-4 mr-2" />
          Neue Geschichte
        </Button>
      </div>

      {/* Neue Geschichte erstellen */}
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Neue Geschichte erstellen</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateStoryForm 
              onSave={handleCreateStory}
              onCancel={() => setIsCreating(false)}
              onImageUpload={handleImageUpload}
              saving={saving}
            />
          </CardContent>
        </Card>
      )}

      {/* Geschichten-Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories?.stories.map((story) => (
          <Card key={story.id} className="overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {story.imageUrl ? (
                <img 
                  src={story.imageUrl} 
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{story.title}</CardTitle>
                <Badge variant={story.published ? "default" : "secondary"}>
                  {story.published ? (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Veröffentlicht
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Entwurf
                    </>
                  )}
                </Badge>
              </div>
              <CardDescription className="line-clamp-3">
                {story.shortDescription || story.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                <span>{story.updatedAt ? new Date(story.updatedAt).toLocaleDateString('de-DE') : 'Kein Datum'}</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setEditingStory(story)}
                  disabled={saving}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Bearbeiten
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await handleImageUpload(file);
                      const updatedStory = { ...story, imageUrl: url };
                      await handleSaveStory(updatedStory);
                    } catch (error) {
                      alert('Fehler beim Hochladen des Bildes');
                    }
                  }}
                  className="hidden"
                  id={`upload-${story.id}`}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => document.getElementById(`upload-${story.id}`)?.click()}
                  disabled={saving}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Bild
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleDeleteStory(story.id)}
                  disabled={saving}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Löschen
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bearbeitungs-Modal */}
      {editingStory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Geschichte bearbeiten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Titel</Label>
                  <Input
                    value={editingStory.title}
                    onChange={(e) => setEditingStory(prev => prev ? { ...prev, title: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Kurzbeschreibung</Label>
                  <Textarea
                    value={editingStory.shortDescription || ''}
                    onChange={(e) => setEditingStory(prev => prev ? { ...prev, shortDescription: e.target.value } : null)}
                    rows={2}
                    placeholder="Kurze Beschreibung der Geschichte"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vollständige Beschreibung</Label>
                  <Textarea
                    value={editingStory.description}
                    onChange={(e) => setEditingStory(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Inhalt (Markdown)</Label>
                  <Textarea
                    value={editingStory.content || ''}
                    onChange={(e) => setEditingStory(prev => prev ? { ...prev, content: e.target.value } : null)}
                    rows={8}
                    placeholder="Markdown-Inhalt der Geschichte (optional)"
                  />
                 <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-amber-600 dark:text-amber-400">
                    ⚠️ Wichtig: Bilder müssen mit Markdown-Syntax eingefügt werden!
                  </p>
                  <p>
                    Verwenden Sie Markdown-Syntax für Formatierung.
                  </p>
                  <code className="bg-muted px-2 py-1 rounded block">![Bildbeschreibung](URL)</code>
                  <p className="text-amber-600 dark:text-amber-400">
                    ✗ Falsch: <code className="bg-muted px-1 rounded">/uploads/bild.jpg</code> (wird als Link angezeigt)<br />
                    ✓ Richtig: <code className="bg-muted px-1 rounded">![Mein Bild](/uploads/bild.jpg)</code> (wird als Bild angezeigt)
                  </p>
                </div>
                </div>
                <div className="space-y-2">
                  <Label>Veröffentlicht</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingStory.published || false}
                      onCheckedChange={(checked) => setEditingStory(prev => prev ? { ...prev, published: checked } : null)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {editingStory.published ? 'Veröffentlicht' : 'Entwurf'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bild-URL</Label>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={editingStory.imageUrl}
                        onChange={(e) => setEditingStory(prev => prev ? { ...prev, imageUrl: e.target.value } : null)}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const url = await handleImageUpload(file);
                            setEditingStory(prev => prev ? { ...prev, imageUrl: url } : null);
                          } catch (error) {
                            alert('Fehler beim Hochladen des Bildes');
                          }
                        }}
                        className="hidden"
                        id="upload-edit-story"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('upload-edit-story')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Bild hochladen
                      </Button>
                    </div>
                    
                    {editingStory.imageUrl && (
                      <div className="space-y-2">
                        <Label>Bildvorschau</Label>
                        <div className="aspect-video bg-muted rounded-md overflow-hidden">
                          <img
                            src={editingStory.imageUrl}
                            alt={editingStory.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleSaveStory(editingStory)} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Speichere...' : 'Speichern'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingStory(null)}>
                    <X className="h-4 w-4 mr-2" />
                    Abbrechen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
