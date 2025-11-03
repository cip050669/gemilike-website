'use client';

import { useEffect, useState, useCallback } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    isActive: true,
  });
  const [showNewForm, setShowNewForm] = useState(false);

  const fetchPages = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/legal-pages?locale=${locale}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Sortiere: deutsche Slugs zuerst, dann alphabetisch
        const germanSlugs = ['impressum', 'datenschutz', 'agb', 'widerruf', 'versand', 'cookies'];
        const sorted = data.sort((a: LegalPage, b: LegalPage) => {
          const aIsGerman = germanSlugs.includes(a.slug);
          const bIsGerman = germanSlugs.includes(b.slug);
          if (aIsGerman && !bIsGerman) return -1;
          if (!aIsGerman && bIsGerman) return 1;
          return a.slug.localeCompare(b.slug);
        });
        setPages(sorted);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setError(`Fehler beim Laden der Seiten: ${errorData.error || response.statusText} (Status: ${response.status})`);
        console.error('Error fetching legal pages:', response.status, errorData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      setError(`Fehler beim Laden der Seiten: ${errorMessage}`);
      console.error('Error fetching legal pages:', error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleSave = async (id?: string) => {
    try {
      const url = id ? `/api/admin/legal-pages/${id}` : '/api/admin/legal-pages';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        credentials: 'include',
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
        credentials: 'include',
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

        {/* Error Message */}
        {error && (
          <Card className="mb-4 border-red-500">
            <CardContent className="py-4">
              <div className="text-red-400">
                <strong>Fehler:</strong> {error}
              </div>
              {error.includes('No session') || error.includes('Unauthorized') ? (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-yellow-400">
                    ⚠️ Sie sind nicht eingeloggt oder Ihre Session ist abgelaufen.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = `/${locale}/admin/login`;
                      }}
                    >
                      Zum Login
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchPages()}
                    >
                      Erneut versuchen
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => fetchPages()}
                >
                  Erneut versuchen
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Lade Seiten...
            </CardContent>
          </Card>
        )}

        {/* New/Edit Form */}
        {!loading && (showNewForm || editingId) && (
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
        {!loading && (
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
                    {page.isActive && ['impressum', 'datenschutz', 'agb', 'widerruf', 'versand', 'cookies'].includes(page.slug) && (
                      <p className="text-xs text-green-400 mt-2">
                        ✓ Diese Seite wird im Footer unter "Rechtliches" angezeigt
                      </p>
                    )}
                    {page.isActive && !['impressum', 'datenschutz', 'agb', 'widerruf', 'versand', 'cookies'].includes(page.slug) && (
                      <p className="text-xs text-yellow-400 mt-2">
                        ⚠️ Diese Seite ist aktiv, wird aber nicht im Footer angezeigt (nur deutsche Slugs werden im Footer angezeigt)
                      </p>
                    )}
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
            {pages.length === 0 && !error && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Keine Seiten vorhanden. Erstellen Sie eine neue Seite.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

