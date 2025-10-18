'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Palette, 
  Save, 
  X,
  Loader2
} from 'lucide-react';

export interface ColorDefinition {
  id: string;
  name: string;
  value: string;
  bg: string;
  text: string;
  border: string;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function ColorManager() {
  const [colors, setColors] = useState<ColorDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<ColorDefinition | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    bg: '',
    text: '',
    border: ''
  });

  // Lade Farben beim Mount
  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/colors');
      if (response.ok) {
        const data = await response.json();
        setColors(data.colors || []);
      }
    } catch (error) {
      console.error('Failed to load colors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const url = editingColor ? '/api/admin/colors' : '/api/admin/colors';
      const method = editingColor ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingColor ? { id: editingColor.id, ...formData } : formData),
      });

      if (response.ok) {
        await loadColors();
        resetForm();
        setIsDialogOpen(false);
      } else {
        const error = await response.json();
        alert(`Fehler: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to save color:', error);
      alert('Fehler beim Speichern der Farbe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (colorId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Farbe löschen möchten?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/colors?id=${colorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadColors();
      } else {
        const error = await response.json();
        alert(`Fehler: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to delete color:', error);
      alert('Fehler beim Löschen der Farbe');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (color: ColorDefinition) => {
    setEditingColor(color);
    setFormData({
      name: color.name,
      value: color.value,
      bg: color.bg,
      text: color.text,
      border: color.border
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      value: '',
      bg: '',
      text: '',
      border: ''
    });
    setEditingColor(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Farbverwaltung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              Verwalten Sie die verfügbaren Farben für Edelstein-Badges
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Neue Farbe
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingColor ? 'Farbe bearbeiten' : 'Neue Farbe hinzufügen'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="z.B. Türkis"
                    />
                  </div>
                  <div>
                    <Label htmlFor="value">Wert</Label>
                    <Input
                      id="value"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="z.B. türkis"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bg">Hintergrund-Klasse</Label>
                    <Input
                      id="bg"
                      value={formData.bg}
                      onChange={(e) => setFormData(prev => ({ ...prev, bg: e.target.value }))}
                      placeholder="z.B. bg-cyan-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="text">Text-Klasse</Label>
                    <Input
                      id="text"
                      value={formData.text}
                      onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="z.B. text-cyan-800"
                    />
                  </div>
                  <div>
                    <Label htmlFor="border">Rahmen-Klasse</Label>
                    <Input
                      id="border"
                      value={formData.border}
                      onChange={(e) => setFormData(prev => ({ ...prev, border: e.target.value }))}
                      placeholder="z.B. border-cyan-200"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Speichern
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDialogClose}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Abbrechen
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading && colors.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colors.map((color) => (
                <Card key={color.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{color.name}</h3>
                        <p className="text-sm text-muted-foreground">{color.value}</p>
                      </div>
                      {color.isCustom && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(color)}
                            disabled={isLoading}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(color.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Vorschau-Badge */}
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`text-xs px-2 py-1 ${color.bg} ${color.text} ${color.border} border`}
                      >
                        {color.value}
                      </Badge>
                    </div>
                    
                    {/* Klassen-Anzeige */}
                    <div className="mt-3 text-xs text-muted-foreground space-y-1">
                      <div><strong>BG:</strong> {color.bg}</div>
                      <div><strong>Text:</strong> {color.text}</div>
                      <div><strong>Border:</strong> {color.border}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
