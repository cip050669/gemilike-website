'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  Upload, 
  Image as ImageIcon,
  Wand2,
  RotateCcw
} from 'lucide-react';
import { StorySectionSettings, StoryItem } from '@/app/api/admin/stories/route';

interface UploadingState {
  [key: string]: boolean;
}

interface SavingState {
  status: 'idle' | 'saving' | 'success' | 'error';
  message?: string;
}

export function StorySectionManager() {
  const [settings, setSettings] = useState<StorySectionSettings | null>(null);
  const [localSettings, setLocalSettings] = useState<StorySectionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadingState>({});
  const [saving, setSaving] = useState<SavingState>({ status: 'idle' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stories');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.stories);
        setLocalSettings(data.stories);
      }
    } catch (error) {
      console.error('Error loading story settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (field: keyof StorySectionSettings, value: string) => {
    if (!localSettings) return;
    setLocalSettings((prev) => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleStoryChange = (id: string, field: keyof StoryItem, value: string) => {
    if (!localSettings) return;
    setLocalSettings((prev) => prev ? ({
      ...prev,
      stories: prev.stories.map((story) =>
        story.id === id ? { ...story, [field]: value } : story,
      ),
    }) : null);
  };

  const handleAddStory = () => {
    if (!localSettings) return;
    const newStory: StoryItem = {
      id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: 'Neue Edelstein-Geschichte',
      description: 'Beschreiben Sie die Geschichte dieses Edelsteins.',
      imageUrl: '/images/stories/placeholder-gem.svg',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setLocalSettings((prev) => prev ? ({
      ...prev,
      stories: [...prev.stories, newStory],
    }) : null);
  };

  const handleRemoveStory = (id: string) => {
    if (!localSettings) return;
    setLocalSettings((prev) => prev ? ({
      ...prev,
      stories: prev.stories.filter((story) => story.id !== id),
    }) : null);
  };

  const handleReset = () => {
    if (settings) {
      setLocalSettings(settings);
    }
  };

  const handleSave = async () => {
    if (!localSettings) return;

    try {
      setSaving({ status: 'saving' });

      // Speichere Einstellungen
      const settingsResponse = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateSettings',
          settings: {
            sectionTitle: localSettings.sectionTitle,
            sectionDescription: localSettings.sectionDescription,
          },
        }),
      });

      if (!settingsResponse.ok) {
        throw new Error('Failed to save settings');
      }

      // Speichere jede Geschichte
      for (const story of localSettings.stories) {
        const storyResponse = await fetch('/api/admin/stories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'updateStory',
            story,
          }),
        });

        if (!storyResponse.ok) {
          throw new Error(`Failed to save story ${story.id}`);
        }
      }

      setSaving({ status: 'success', message: 'Geschichten erfolgreich gespeichert!' });
      await loadSettings();
      
      setTimeout(() => {
        setSaving({ status: 'idle' });
      }, 3000);
    } catch (error) {
      console.error('Error saving stories:', error);
      setSaving({ status: 'error', message: 'Fehler beim Speichern der Geschichten' });
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    setUploading(prev => ({ ...prev, [id]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        handleStoryChange(id, 'imageUrl', data.url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Fehler beim Hochladen des Bildes');
    } finally {
      setUploading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleGenerateText = (id: string) => {
    const story = localSettings?.stories.find((item) => item.id === id);
    if (!story) return;

    const generated = generateStoryDescription(story.title);
    handleStoryChange(id, 'description', generated);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Lade Geschichten...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!localSettings) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-muted-foreground">Fehler beim Laden der Geschichten</p>
            <Button onClick={loadSettings} className="mt-4">
              Erneut versuchen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Geschichten um Edelsteine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="storySectionTitle">Abschnittstitel</Label>
            <Input
              id="storySectionTitle"
              value={localSettings.sectionTitle}
              onChange={(e) => handleSectionChange('sectionTitle', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storySectionDescription">Beschreibung</Label>
            <Textarea
              id="storySectionDescription"
              value={localSettings.sectionDescription}
              onChange={(e) => handleSectionChange('sectionDescription', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Geschichten ({localSettings.stories.length})</h3>
            <Button onClick={handleAddStory} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Geschichte hinzufügen
            </Button>
          </div>

          {localSettings.stories.map((story, index) => (
            <Card key={story.id} className="border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Geschichte {index + 1}</CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveStory(story.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Titel</Label>
                    <Input
                      value={story.title}
                      onChange={(e) => handleStoryChange(story.id, 'title', e.target.value)}
                      placeholder="Titel der Geschichte"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bild-URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={story.imageUrl}
                        onChange={(e) => handleStoryChange(story.id, 'imageUrl', e.target.value)}
                        placeholder="/images/stories/placeholder-gem.svg"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(story.id, file);
                        }}
                        className="hidden"
                        id={`upload-${story.id}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`upload-${story.id}`)?.click()}
                        disabled={uploading[story.id]}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Beschreibung</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerateText(story.id)}
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Text generieren
                    </Button>
                  </div>
                  <Textarea
                    value={story.description}
                    onChange={(e) => handleStoryChange(story.id, 'description', e.target.value)}
                    placeholder="Beschreiben Sie die Geschichte dieses Edelsteins..."
                    rows={4}
                  />
                </div>

                {story.imageUrl && (
                  <div className="space-y-2">
                    <Label>Bildvorschau</Label>
                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {saving.status === 'success' && (
              <Badge variant="default" className="bg-gray-500/50">
                {saving.message}
              </Badge>
            )}
            {saving.status === 'error' && (
              <Badge variant="destructive">
                {saving.message}
              </Badge>
            )}
            <Button onClick={handleSave} disabled={saving.status === 'saving'}>
              <Save className="h-4 w-4 mr-2" />
              {saving.status === 'saving' ? 'Speichere...' : 'Speichern'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function generateStoryDescription(title: string): string {
  const templates = [
    `Eine faszinierende Reise durch die Welt der Edelsteine. ${title} erzählt von der Entstehung, der Gewinnung und der Verarbeitung dieser wertvollen Steine.`,
    `Von den Tiefen der Erde bis zur Verarbeitung in den besten Ateliers - ${title} zeigt die ganze Bandbreite der Edelsteinverarbeitung.`,
    `Ein Einblick in die Welt der Edelsteine: ${title} beleuchtet die verschiedenen Aspekte der Edelsteingewinnung und -verarbeitung.`,
    `Die Geschichte von ${title} ist eine Reise durch Zeit und Raum, die zeigt, wie aus rohen Steinen wertvolle Edelsteine werden.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}