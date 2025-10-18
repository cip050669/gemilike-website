'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Settings
} from 'lucide-react';
import { SelectOption, SelectCategory } from '@/lib/types/select-options';

const CATEGORY_LABELS: Record<SelectCategory, string> = {
  cut: 'Schliff',
  form: 'Form',
  clarity: 'Reinheit',
  color: 'Farbe',
  colorIntensity: 'Farbintensität',
  treatment: 'Behandlung',
  certification: 'Zertifizierung',
  rarity: 'Rarität'
};

export function SelectOptionsManager() {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newOption, setNewOption] = useState({
    value: '',
    label: '',
    category: 'cut' as SelectCategory,
    isActive: true,
    order: 0
  });
  const [isCreating, setIsCreating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SelectCategory>('cut');

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const response = await fetch('/api/admin/select-options', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.options) {
          setOptions(data.options.sort((a: SelectOption, b: SelectOption) => a.order - b.order));
        }
      }
    } catch (error) {
      console.error('Error loading select options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/select-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOption),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Auswahloption erfolgreich erstellt!');
          loadOptions();
          setNewOption({ value: '', label: '', category: 'cut', isActive: true, order: 0 });
          setIsCreating(false);
        } else {
          alert('Fehler beim Erstellen: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Error creating select option:', error);
      alert('Fehler beim Erstellen der Auswahloption');
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<SelectOption>) => {
    try {
      const response = await fetch('/api/admin/select-options', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Auswahloption erfolgreich aktualisiert!');
          loadOptions();
          setEditingId(null);
        } else {
          alert('Fehler beim Aktualisieren: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Error updating select option:', error);
      alert('Fehler beim Aktualisieren der Auswahloption');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Auswahloption löschen möchten?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/select-options?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert('Auswahloption erfolgreich gelöscht!');
          loadOptions();
        } else {
          alert('Fehler beim Löschen: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Error deleting select option:', error);
      alert('Fehler beim Löschen der Auswahloption');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await handleUpdate(id, { isActive });
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const categoryOptions = options.filter(opt => opt.category === activeCategory);
    const currentIndex = categoryOptions.findIndex(o => o.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= categoryOptions.length) return;

    const newOptions = [...options];
    const categoryStartIndex = newOptions.findIndex(o => o.category === activeCategory);
    const actualCurrentIndex = categoryStartIndex + currentIndex;
    const actualNewIndex = categoryStartIndex + newIndex;

    const [movedItem] = newOptions.splice(actualCurrentIndex, 1);
    newOptions.splice(actualNewIndex, 0, movedItem);

    // Update order values
    newOptions.forEach((option, index) => {
      if (option.category === activeCategory && option.order !== index) {
        handleUpdate(option.id, { order: index });
      }
    });

    setOptions(newOptions);
  };

  const getCategoryOptions = (category: SelectCategory) => {
    return options.filter(opt => opt.category === category);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Lade Auswahloptionen...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Auswahllisten-Verwaltung</h2>
          <p className="text-muted-foreground">
            Verwalten Sie die Auswahloptionen für Schliff, Form, Reinheit und andere Felder
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Neue Option</span>
        </Button>
      </div>

      {/* Create new option */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Neue Auswahloption</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Kategorie</label>
                <Select
                  value={newOption.category}
                  onValueChange={(value) => setNewOption({ ...newOption, category: value as SelectCategory })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Wert</label>
                <Input
                  value={newOption.value}
                  onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                  placeholder="z.B. Brilliantschliff"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Anzeigename</label>
              <Input
                value={newOption.label}
                onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                placeholder="z.B. Brilliantschliff"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newOption.isActive}
                  onCheckedChange={(checked) => setNewOption({ ...newOption, isActive: checked })}
                />
                <label className="text-sm">Aktiv</label>
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

      {/* Category tabs */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as SelectCategory)}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <TabsTrigger 
              key={key} 
              value={key} 
              className="text-xs data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:border-blue-500"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(CATEGORY_LABELS).map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {CATEGORY_LABELS[category as SelectCategory]} ({getCategoryOptions(category as SelectCategory).length})
                </h3>
              </div>

              <div className="grid gap-4">
                {getCategoryOptions(category as SelectCategory).map((option, index) => (
                  <Card key={option.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Badge variant={option.isActive ? 'default' : 'secondary'}>
                              {option.isActive ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                              {option.isActive ? 'Aktiv' : 'Inaktiv'}
                            </Badge>
                            <Badge variant="outline">#{option.order}</Badge>
                          </div>
                          
                          <h4 className="font-semibold text-lg mb-1">{option.label}</h4>
                          <p className="text-muted-foreground text-sm mb-2">Wert: {option.value}</p>
                          
                          <p className="text-xs text-muted-foreground">
                            Erstellt: {new Date(option.createdAt).toLocaleDateString('de-DE')}
                            {new Date(option.updatedAt).getTime() !== new Date(option.createdAt).getTime() && (
                              <span> • Aktualisiert: {new Date(option.updatedAt).toLocaleDateString('de-DE')}</span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {/* Reorder buttons */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReorder(option.id, 'up')}
                            disabled={index === 0}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReorder(option.id, 'down')}
                            disabled={index === getCategoryOptions(category as SelectCategory).length - 1}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>

                          {/* Toggle active */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(option.id, !option.isActive)}
                            className="h-8 w-8 p-0"
                          >
                            {option.isActive ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>

                          {/* Edit button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(option.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>

                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(option.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Edit form */}
                      {editingId === option.id && (
                        <div className="mt-4 p-4 bg-muted/20 rounded-lg border">
                          <EditForm
                            option={option}
                            onSave={(updatedData) => handleUpdate(option.id, updatedData)}
                            onCancel={() => setEditingId(null)}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {getCategoryOptions(category as SelectCategory).length === 0 && (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Keine Optionen für {CATEGORY_LABELS[category as SelectCategory]}</h3>
                  <p className="text-muted-foreground mb-4">
                    Erstellen Sie Ihre erste Auswahloption für diese Kategorie.
                  </p>
                  <Button onClick={() => {
                    setNewOption({ ...newOption, category: category as SelectCategory });
                    setIsCreating(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Erste Option erstellen
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface EditFormProps {
  option: SelectOption;
  onSave: (data: Partial<SelectOption>) => void;
  onCancel: () => void;
}

function EditForm({ option, onSave, onCancel }: EditFormProps) {
  const [formData, setFormData] = useState({
    value: option.value,
    label: option.label,
    category: option.category,
    isActive: option.isActive,
    order: option.order
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold">Option bearbeiten</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Kategorie</label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as SelectCategory })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Wert</label>
          <Input
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="z.B. Brilliantschliff"
          />
        </div>
      </div>
      
      <div>
        <label className="text-sm font-medium">Anzeigename</label>
        <Input
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder="z.B. Brilliantschliff"
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
