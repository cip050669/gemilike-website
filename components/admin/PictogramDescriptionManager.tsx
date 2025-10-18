'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  ArrowUp,
  ArrowDown,
  Info
} from 'lucide-react';
import { PictogramDescription } from '@/lib/types/pictogram-descriptions';

export function PictogramDescriptionManager() {
  const [descriptions, setDescriptions] = useState<PictogramDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDescription, setNewDescription] = useState({
    icon: '',
    title: '',
    description: '',
    isActive: true,
    order: 0
  });
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadDescriptions();
  }, []);

  const loadDescriptions = async () => {
    try {
      const response = await fetch('/api/admin/pictogram-descriptions', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.descriptions) {
          setDescriptions(data.descriptions.sort((a: PictogramDescription, b: PictogramDescription) => a.order - b.order));
        }
      }
    } catch (error) {
      console.error('Error loading pictogram descriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/pictogram-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDescription),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Piktogramm-Beschreibung erfolgreich erstellt!');
          loadDescriptions();
          setNewDescription({ icon: '', title: '', description: '', isActive: true, order: 0 });
          setIsCreating(false);
        } else {
          alert('Fehler beim Erstellen: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Error creating pictogram description:', error);
      alert('Fehler beim Erstellen der Piktogramm-Beschreibung');
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<PictogramDescription>) => {
    try {
      const response = await fetch('/api/admin/pictogram-descriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Piktogramm-Beschreibung erfolgreich aktualisiert!');
          loadDescriptions();
          setEditingId(null);
        } else {
          alert('Fehler beim Aktualisieren: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Error updating pictogram description:', error);
      alert('Fehler beim Aktualisieren der Piktogramm-Beschreibung');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Piktogramm-Beschreibung löschen möchten?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/pictogram-descriptions?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Piktogramm-Beschreibung erfolgreich gelöscht!');
          loadDescriptions();
        } else {
          alert('Fehler beim Löschen: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Error deleting pictogram description:', error);
      alert('Fehler beim Löschen der Piktogramm-Beschreibung');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await handleUpdate(id, { isActive });
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = descriptions.findIndex(d => d.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= descriptions.length) return;

    const newDescriptions = [...descriptions];
    const [movedItem] = newDescriptions.splice(currentIndex, 1);
    newDescriptions.splice(newIndex, 0, movedItem);

    // Update order values
    newDescriptions.forEach((desc, index) => {
      if (desc.order !== index) {
        handleUpdate(desc.id, { order: index });
      }
    });

    setDescriptions(newDescriptions);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Lade Piktogramm-Beschreibungen...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Piktogramm-Beschreibungen</h2>
          <p className="text-muted-foreground">
            Verwalten Sie die Erklärungen für die Piktogramme in den Edelstein-Karten
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Neue Beschreibung</span>
        </Button>
      </div>

      {/* Create new description */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Neue Piktogramm-Beschreibung</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Icon-Name</label>
                <Input
                  value={newDescription.icon}
                  onChange={(e) => setNewDescription({ ...newDescription, icon: e.target.value })}
                  placeholder="z.B. Sparkles, Tag, MapPin"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Titel</label>
                <Input
                  value={newDescription.title}
                  onChange={(e) => setNewDescription({ ...newDescription, title: e.target.value })}
                  placeholder="z.B. Rarität, Kategorie"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Beschreibung</label>
              <Textarea
                value={newDescription.description}
                onChange={(e) => setNewDescription({ ...newDescription, description: e.target.value })}
                placeholder="Detaillierte Erklärung des Piktogramms..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newDescription.isActive}
                  onCheckedChange={(checked) => setNewDescription({ ...newDescription, isActive: checked })}
                />
                <label className="text-sm">Aktiv</label>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm">Reihenfolge:</label>
                <Input
                  type="number"
                  value={newDescription.order}
                  onChange={(e) => setNewDescription({ ...newDescription, order: parseInt(e.target.value) || 0 })}
                  className="w-20"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCreate} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Erstellen</span>
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Descriptions list */}
      <div className="grid gap-4">
        {descriptions.map((description, index) => (
          <Card key={description.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant={description.isActive ? 'default' : 'secondary'}>
                      {description.isActive ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                      {description.isActive ? 'Aktiv' : 'Inaktiv'}
                    </Badge>
                    <Badge variant="outline">#{description.order}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {description.icon}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-1">{description.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{description.description}</p>
                  
                  <p className="text-xs text-muted-foreground">
                    Erstellt: {new Date(description.createdAt).toLocaleDateString('de-DE')}
                    {new Date(description.updatedAt).getTime() !== new Date(description.createdAt).getTime() && (
                      <span> • Aktualisiert: {new Date(description.updatedAt).toLocaleDateString('de-DE')}</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {/* Reorder buttons */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReorder(description.id, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReorder(description.id, 'down')}
                    disabled={index === descriptions.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>

                  {/* Toggle active */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(description.id, !description.isActive)}
                    className="h-8 w-8 p-0"
                  >
                    {description.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>

                  {/* Edit button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(description.id)}
                    className="h-8 w-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  {/* Delete button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(description.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Edit form */}
              {editingId === description.id && (
                <div className="mt-4 p-4 bg-muted/20 rounded-lg border">
                  <EditForm
                    description={description}
                    onSave={(updatedData) => handleUpdate(description.id, updatedData)}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {descriptions.length === 0 && (
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Keine Piktogramm-Beschreibungen</h3>
          <p className="text-muted-foreground mb-4">
            Erstellen Sie Ihre erste Piktogramm-Beschreibung, um den Benutzern zu helfen, die Symbole zu verstehen.
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Erste Beschreibung erstellen
          </Button>
        </div>
      )}
    </div>
  );
}

interface EditFormProps {
  description: PictogramDescription;
  onSave: (data: Partial<PictogramDescription>) => void;
  onCancel: () => void;
}

function EditForm({ description, onSave, onCancel }: EditFormProps) {
  const [formData, setFormData] = useState({
    icon: description.icon,
    title: description.title,
    description: description.description,
    isActive: description.isActive,
    order: description.order
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Beschreibung bearbeiten</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Icon-Name</label>
          <Input
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="z.B. Sparkles, Tag, MapPin"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Titel</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="z.B. Rarität, Kategorie"
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Beschreibung</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Detaillierte Erklärung des Piktogramms..."
          rows={3}
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <label className="text-sm">Aktiv</label>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm">Reihenfolge:</label>
          <Input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-20"
          />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Speichern</span>
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
