'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AboutContent {
  id: string;
  section: string;
  title?: string | null;
  content: string;
  locale: string;
}

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string | null;
  features: string[];
  order: number;
}

export default function AboutAdminPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'de';

  const [content, setContent] = useState<AboutContent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sections = [
    { key: 'title', label: 'Haupttitel' },
    { key: 'subtitle', label: 'Untertitel' },
    { key: 'intro1', label: 'Einleitung 1' },
    { key: 'intro2', label: 'Einleitung 2' },
    { key: 'mission', label: 'Mission Titel' },
    { key: 'missionDesc', label: 'Mission Beschreibung' },
    { key: 'values', label: 'Werte Titel' },
    { key: 'valuesDesc', label: 'Werte Beschreibung' },
    { key: 'expertise', label: 'Expertise Titel' },
    { key: 'expertiseDesc', label: 'Expertise Beschreibung' },
    { key: 'quality', label: 'Qualität Titel' },
    { key: 'qualityDesc', label: 'Qualität Beschreibung' },
  ];

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [contentRes, servicesRes] = await Promise.all([
        fetch(`/api/admin/about-content?locale=${locale}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }),
        fetch(`/api/admin/services?locale=${locale}`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }),
      ]);

      if (contentRes.ok) {
        const contentData = await contentRes.json();
        setContent(contentData);
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData.sort((a: Service, b: Service) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateContent = async (section: string, contentValue: string) => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/about-content', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          content: contentValue,
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      await loadData();
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const updateService = async (id: string, data: Partial<Service>) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      await loadData();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const getContentValue = (section: string): string => {
    const item = content.find((c) => c.section === section);
    return item?.content || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800/50 flex items-center justify-center">
        <div className="text-white">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">Über uns - Verwaltung</h1>
          <p className="text-gray-300">
            Verwalten Sie den Inhalt der &quot;Über uns&quot; Seite
          </p>
          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded text-sm text-blue-200">
            <p className="font-semibold mb-2">ℹ️ Footer-Links:</p>
            <p className="mb-1">Die Links unter &quot;Wer sind wir?&quot; im Footer sind fest definiert:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li><strong>Über uns</strong> → /about (verwaltet durch diese Seite)</li>
              <li><strong>Unsere Leistungen</strong> → /services (verwaltet durch diese Seite - Services-Bereich)</li>
              <li><strong>Wissenswertes</strong> → /wissenswertes (verwaltet in /admin/wissenswertes)</li>
              <li><strong>Kontakt</strong> → /contact (verwaltet in /admin/contact-data)</li>
            </ul>
          </div>
        </div>

        {/* About Content Sections */}
        <div className="space-y-6 mb-8">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Hauptinhalte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {sections.map((section) => (
                <div key={section.key}>
                  <Label htmlFor={section.key} className="text-gray-200">
                    {section.label}
                  </Label>
                  <Textarea
                    id={section.key}
                    value={getContentValue(section.key)}
                    onChange={(e) => {
                      const currentContent = [...content];
                      const existing = currentContent.findIndex((c) => c.section === section.key);
                      if (existing >= 0) {
                        currentContent[existing].content = e.target.value;
                      } else {
                        currentContent.push({
                          id: '',
                          section: section.key,
                          content: e.target.value,
                          locale,
                        });
                      }
                      setContent(currentContent);
                    }}
                    onBlur={(e) => updateContent(section.key, e.target.value)}
                    className="mt-2 bg-gray-900/50 border-gray-600 text-white"
                    rows={section.key.includes('Desc') || section.key.includes('intro') ? 4 : 2}
                  />
                  {saving && (
                    <p className="text-xs text-gray-500 mt-1">Speichern...</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {services.map((service) => (
                <div key={service.id} className="border border-gray-700 rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-200">Titel</Label>
                      <Input
                        value={service.title}
                        onChange={(e) =>
                          updateService(service.id, { title: e.target.value })
                        }
                        className="mt-2 bg-gray-900/50 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-200">Beschreibung</Label>
                      <Input
                        value={service.description}
                        onChange={(e) =>
                          updateService(service.id, { description: e.target.value })
                        }
                        className="mt-2 bg-gray-900/50 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-200">Features (kommagetrennt)</Label>
                    <Input
                      value={service.features.join(', ')}
                      onChange={(e) =>
                        updateService(service.id, {
                          features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean),
                        })
                      }
                      className="mt-2 bg-gray-900/50 border-gray-600 text-white"
                      placeholder="Feature 1, Feature 2, Feature 3"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
