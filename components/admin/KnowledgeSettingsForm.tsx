'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface KnowledgeSettingsFormProps {
  heading: string;
  subheading: string;
  headingColor?: string;
  subheadingColor?: string;
}

export function KnowledgeSettingsForm({
  heading,
  subheading,
  headingColor = '#ffffff',
  subheadingColor = '#d1d5db',
}: KnowledgeSettingsFormProps) {
  const [formData, setFormData] = useState({
    heading,
    subheading,
    headingColor,
    subheadingColor,
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setStatus('saving');
      const response = await fetch('/api/admin/knowledge-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heading: formData.heading,
          subheading: formData.subheading,
          headingColor: formData.headingColor,
          subheadingColor: formData.subheadingColor,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 2500);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sektion „Wissenswertes“</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="knowledge-heading">Überschrift</Label>
            <Input
              id="knowledge-heading"
              value={formData.heading}
              onChange={(event) => setFormData((prev) => ({ ...prev, heading: event.target.value }))}
              placeholder="z. B. Wissenswertes rund um Edelsteine"
              className="bg-gray-800/30 text-black"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="knowledge-subheading">Untertitel</Label>
            <Textarea
              id="knowledge-subheading"
              rows={3}
              value={formData.subheading}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, subheading: event.target.value }))
              }
              placeholder="Kurzer Teasertext für Wissenswertes"
              className="bg-gray-800/30 text-black"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="knowledge-heading-color">Überschrift-Farbe</Label>
              <Input
                id="knowledge-heading-color"
                type="color"
                value={formData.headingColor}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, headingColor: event.target.value }))
                }
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="knowledge-subheading-color">Untertitel-Farbe</Label>
              <Input
                id="knowledge-subheading-color"
                type="color"
                value={formData.subheadingColor}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, subheadingColor: event.target.value }))
                }
                className="h-12"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={status === 'saving'}>
              {status === 'saving' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Speichern...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Änderungen speichern
                </>
              )}
            </Button>
            {status === 'success' && (
              <span className="text-sm text-green-500">Gespeichert!</span>
            )}
            {status === 'error' && (
              <span className="text-sm text-red-500">Speichern fehlgeschlagen.</span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
