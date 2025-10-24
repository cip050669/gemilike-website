'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Save, X, Info, AlertTriangle, CheckCircle, Megaphone } from 'lucide-react';
import { NewstickerItem } from '@/lib/types/newsticker';

export function NewstickerManager() {
  const [items, setItems] = useState<NewstickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<NewstickerItem | null>(null);
  const [newItem, setNewItem] = useState({
    text: '',
    type: 'info' as const,
    isActive: true
  });

  // Load newsticker items
  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/newsticker');
      const data = await response.json();
      
      if (data.success) {
        setItems(data.items || []);
      } else {
        console.error('Failed to load newsticker items:', data.error);
      }
    } catch (error) {
      console.error('Error loading newsticker items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Create new item
  const handleCreate = async () => {
    if (!newItem.text.trim()) return;

    try {
      const response = await fetch('/api/admin/newsticker', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(newItem)
      });

      const data = await response.json();
      
      if (data.success) {
        setItems(prev => [...prev, data.item]);
        setNewItem({ text: '', type: 'info', isActive: true });
        alert('Newsticker erfolgreich erstellt!');
      } else {
        console.error('Failed to create newsticker item:', data.error);
        alert(`Fehler beim Erstellen: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating newsticker item:', error);
      alert('Fehler beim Erstellen des Newstickers');
    }
  };

  // Update item
  const handleUpdate = async (item: NewstickerItem) => {
    try {
      const response = await fetch('/api/admin/newsticker', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });

      const data = await response.json();
      
      if (data.success) {
        setItems(prev => prev.map(i => i.id === item.id ? item : i));
        setEditingItem(null);
      } else {
        console.error('Failed to update newsticker item:', data.error);
      }
    } catch (error) {
      console.error('Error updating newsticker item:', error);
    }
  };

  // Delete item
  const handleDelete = async (id: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Newsticker-Eintrag löschen möchten?')) return;

    try {
      const response = await fetch(`/api/admin/newsticker?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        console.error('Failed to delete newsticker item:', data.error);
      }
    } catch (error) {
      console.error('Error deleting newsticker item:', error);
    }
  };

  // Toggle active status
  const handleToggleActive = async (item: NewstickerItem) => {
    const updatedItem = { ...item, isActive: !item.isActive };
    await handleUpdate(updatedItem);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'announcement': return <Megaphone className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success': return 'bg-gray-500/50 text-gray-800 border-gray-200';
      case 'announcement': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Alle Nachrichten</TabsTrigger>
          <TabsTrigger value="add">Neue Nachricht</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {items.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Keine Newsticker-Nachrichten vorhanden</p>
                <p className="text-sm text-muted-foreground">Erstellen Sie Ihre erste Nachricht im "Neue Nachricht" Tab</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(item.type)}
                          <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                            {item.type}
                          </Badge>
                          <Badge variant={item.isActive ? "default" : "secondary"}>
                            {item.isActive ? 'Aktiv' : 'Inaktiv'}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{item.text}</p>
                        <p className="text-xs text-muted-foreground">
                          Erstellt: {new Date(item.createdAt).toLocaleDateString('de-DE')}
                          {new Date(item.updatedAt).getTime() !== new Date(item.createdAt).getTime() && (
                            <span> • Aktualisiert: {new Date(item.updatedAt).toLocaleDateString('de-DE')}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(item)}
                        >
                          {item.isActive ? 'Deaktivieren' : 'Aktivieren'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Neue Newsticker-Nachricht</CardTitle>
              <CardDescription>
                Erstellen Sie eine neue Nachricht für den Newsticker auf der Homepage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text">Nachrichtentext</Label>
                <Input
                  id="text"
                  value={newItem.text}
                  onChange={(e) => setNewItem(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Geben Sie den Nachrichtentext ein..."
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {newItem.text.length}/200 Zeichen
                </p>
              </div>

              <div>
                <Label htmlFor="type">Nachrichtentyp</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value: any) => setNewItem(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Info
                      </div>
                    </SelectItem>
                    <SelectItem value="warning">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Warnung
                      </div>
                    </SelectItem>
                    <SelectItem value="success">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Erfolg
                      </div>
                    </SelectItem>
                    <SelectItem value="announcement">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4" />
                        Ankündigung
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newItem.isActive}
                  onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Sofort aktivieren</Label>
              </div>

              <Button onClick={handleCreate} disabled={!newItem.text.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Nachricht erstellen
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-gray-800/50/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Nachricht bearbeiten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-text">Nachrichtentext</Label>
                <Input
                  id="edit-text"
                  value={editingItem.text}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, text: e.target.value } : null)}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {editingItem.text.length}/200 Zeichen
                </p>
              </div>

              <div>
                <Label htmlFor="edit-type">Nachrichtentyp</Label>
                <Select
                  value={editingItem.type}
                  onValueChange={(value: any) => setEditingItem(prev => prev ? { ...prev, type: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warnung</SelectItem>
                    <SelectItem value="success">Erfolg</SelectItem>
                    <SelectItem value="announcement">Ankündigung</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={editingItem.isActive}
                  onCheckedChange={(checked) => setEditingItem(prev => prev ? { ...prev, isActive: checked } : null)}
                />
                <Label htmlFor="edit-isActive">Aktiv</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleUpdate(editingItem)}>
                  <Save className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  <X className="h-4 w-4 mr-2" />
                  Abbrechen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
