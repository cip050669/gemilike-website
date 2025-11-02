'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';

interface LegalPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  locale: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function LegalPagesAdminPage() {
  const locale = useLocale();
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    isActive: true,
  });
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    fetchPages();
  }, [locale]);

  const fetchPages = async () => {
    try {
      const response = await fetch(`/api/admin/legal-pages?locale=${locale}`);
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching legal pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id?: string) => {
    try {
      const url = id ? `/api/admin/legal-pages/${id}` : '/api/admin/legal-pages';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      if (response.ok) {
        await fetchPages();
        setEditingId(null);
        setShowNewForm(false);
        setFormData({ slug: '', title: '', content: '', isActive: true });
      } else {
        const error = await response.json();
        alert(error.error || 'Fehler beim Speichern');
      }
    } catch (error) {
      console.error('Error saving legal page:', error);
      alert('Fehler beim Speichern');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Möchten Sie diese Seite wirklich löschen?')) return;

    try {
      const response = await fetch(`/api/admin/legal-pages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPages();
      } else {
        alert('Fehler beim Löschen');
      }
    } catch (error) {
      console.error('Error deleting legal page:', error);
      alert('Fehler beim Löschen');
    }
  };

  const handleEdit = (page: LegalPage) => {
    setEditingId(page.id);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      isActive: page.isActive,
    });
    setShowNewForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800/50 flex items-center justify-center">
        <p className="text-gray-300">Lädt...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">
                Rechtliche Seiten
              </h1>
              <p className="text-gray-300">Verwalten Sie rechtliche Seiten (Impressum, AGB, Datenschutz, etc.)</p>
            </div>
            <Button
              onClick={() => {
                setShowNewForm(true);
                setEditingId(null);
                setFormData({ slug: '', title: '', content: '', isActive: true });
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Neue Seite
            </Button>
          </div>
        </div>

        {/* New/Edit Form */}
        {(showNewForm || editingId) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingId ? 'Seite bearbeiten' : 'Neue Seite erstellen'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="slug">Slug (URL-Teil, z.B. "imprint", "privacy")</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="imprint"
                  disabled={!!editingId}
                />
              </div>
              <div>
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Impressum"
                />
              </div>
              <div>
                <Label htmlFor="content">Inhalt (Markdown unterstützt)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <Label htmlFor="isActive">Aktiv</Label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleSave(editingId || undefined)}>
                  <Check className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewForm(false);
                    setEditingId(null);
                    setFormData({ slug: '', title: '', content: '', isActive: true });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Abbrechen
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pages List */}
        <div className="grid gap-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-xl">{page.title}</CardTitle>
                      {page.isActive ? (
                        <Badge variant="default">Aktiv</Badge>
                      ) : (
                        <Badge variant="secondary">Inaktiv</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Slug: <code className="bg-gray-800 px-2 py-1 rounded">{page.slug}</code>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Route: <code className="bg-gray-800 px-2 py-1 rounded">/{locale}/{page.slug}</code>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground line-clamp-3">
                  {page.content.substring(0, 200)}...
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Aktualisiert: {new Date(page.updatedAt).toLocaleDateString('de-DE')}
                </div>
              </CardContent>
            </Card>
          ))}
          {pages.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Keine Seiten vorhanden. Erstellen Sie eine neue Seite.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

