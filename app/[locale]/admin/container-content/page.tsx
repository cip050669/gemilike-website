'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type ContentKey = 'home.blog.heading' | 'home.blog.subheading' | 'home.newGemstones.description';

type ContentFormState = Record<ContentKey, { title?: string; body?: string }>;

const INITIAL_STATE: ContentFormState = {
  'home.blog.heading': { title: '' },
  'home.blog.subheading': { body: '' },
  'home.newGemstones.description': { body: '' },
};

const contentConfig: Array<{
  key: ContentKey;
  label: string;
  helper: string;
  field: 'title' | 'body';
}> = [
  {
    key: 'home.blog.heading',
    label: 'Blog-Sektion: Überschrift',
    helper: 'Titel über den Blog-Geschichten auf der Startseite',
    field: 'title',
  },
  {
    key: 'home.blog.subheading',
    label: 'Blog-Sektion: Untertitel',
    helper: 'Kurzbeschreibung unter der Überschrift der Blog-Sektion',
    field: 'body',
  },
  {
    key: 'home.newGemstones.description',
    label: 'Neue Edelsteine: Beschreibung',
    helper: 'Text unter dem Karussell der neuen Edelsteine',
    field: 'body',
  },
];

export default function ContainerContentAdminPage() {
  const params = useParams();
  const locale = useMemo(() => {
    const raw = params?.locale;
    return Array.isArray(raw) ? raw[0] : raw || 'de';
  }, [params]);

  const [formState, setFormState] = useState<ContentFormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/container-content?locale=${locale}`);
        if (!res.ok) {
          throw new Error(`Fehler beim Laden (${res.status})`);
        }
        const data = await res.json();
        const nextState: ContentFormState = { ...INITIAL_STATE };
        (data?.items || []).forEach((item: { key: string; title?: string; body?: string }) => {
          if (item.key in nextState) {
            const field = contentConfig.find((c) => c.key === item.key)?.field;
            if (field === 'title') {
              nextState[item.key as ContentKey].title = item.title || '';
            }
            if (field === 'body') {
              nextState[item.key as ContentKey].body = item.body || '';
            }
          }
        });
        setFormState(nextState);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Laden');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [locale]);

  const handleChange = (key: ContentKey, field: 'title' | 'body', value: string) => {
    setFormState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);
      const items = contentConfig.map((conf) => ({
        key: conf.key,
        locale,
        title: conf.field === 'title' ? formState[conf.key].title : undefined,
        body: conf.field === 'body' ? formState[conf.key].body : undefined,
      }));

      const res = await fetch('/api/admin/container-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, items }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Fehler beim Speichern (${res.status})`);
      }
      setMessage('Texte wurden gespeichert.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Container-Texte bearbeiten</h1>
        <p className="text-muted-foreground">
          Passe die Überschriften und Beschreibungen der wichtigsten Startseiten-Container an.
        </p>
      </div>

      {(message || error) && (
        <div
          className={`rounded-md border px-4 py-3 text-sm ${
            error
              ? 'border-red-500/50 bg-red-500/10 text-red-200'
              : 'border-green-500/50 bg-green-500/10 text-green-200'
          }`}
        >
          {error || message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {contentConfig.map((item) => (
          <Card key={item.key}>
            <CardHeader>
              <CardTitle className="text-lg">{item.label}</CardTitle>
              <CardDescription>{item.helper}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor={item.key}>Text</Label>
                {item.field === 'title' ? (
                  <Input
                    id={item.key}
                    value={formState[item.key].title || ''}
                    onChange={(e) => handleChange(item.key, 'title', e.target.value)}
                    disabled={loading}
                  />
                ) : (
                  <Textarea
                    id={item.key}
                    value={formState[item.key].body || ''}
                    onChange={(e) => handleChange(item.key, 'body', e.target.value)}
                    rows={4}
                    disabled={loading}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Speichere...' : 'Speichern'}
        </Button>
      </div>
    </div>
  );
}
