'use client';

import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { NewstickerItem } from '@/lib/types/newsticker';

export default function EditNewstickerPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [item, setItem] = useState<NewstickerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await fetch('/api/admin/newsticker');
        const data = await response.json();
        if (data.success) {
          const foundItem = data.items?.find((it: NewstickerItem) => it.id === id);
          if (foundItem) {
            setItem(foundItem);
          } else {
            setItem(null);
          }
        }
      } catch (error) {
        console.error('Error loading newsticker item:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      loadItem();
    }
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append('_method', 'PUT');
      
      const response = await fetch(`/api/admin/newsticker/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/de/admin/newsticker');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Fehler beim Speichern der Nachricht');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Fehler beim Speichern der Nachricht');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-white">Laden...</div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-800/50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold mb-4">Nachricht nicht gefunden</h1>
            <Link
              href="/de/admin/newsticker"
              className="text-blue-500 hover:underline"
            >
              ← Zurück zur Übersicht
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">Newsticker bearbeiten</h1>
              <p className="text-gray-300">
                Bearbeiten Sie die Newsticker-Nachricht
              </p>
            </div>
            <Link
              href="/de/admin/newsticker"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
            >
              ← Zurück
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nachricht */}
              <div className="md:col-span-2">
                <label htmlFor="text" className="block text-sm font-medium text-gray-200 mb-2">
                  Nachricht *
                </label>
                <textarea
                  id="text"
                  name="text"
                  rows={3}
                  defaultValue={item.text}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Geben Sie hier Ihre Newsticker-Nachricht ein..."
                  required
                />
              </div>

              {/* Typ */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-200 mb-2">
                  Typ
                </label>
                <select
                  id="type"
                  name="type"
                  defaultValue={item.type}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warnung</option>
                  <option value="success">Erfolg</option>
                  <option value="error">Fehler</option>
                </select>
              </div>

              {/* Priorität */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-200 mb-2">
                  Priorität
                </label>
                <select
                  id="priority"
                  name="priority"
                  defaultValue={item.priority || 'medium'}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Niedrig</option>
                  <option value="medium">Mittel</option>
                  <option value="high">Hoch</option>
                </select>
              </div>

              {/* Startdatum */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-200 mb-2">
                  Startdatum
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  defaultValue={formatDate(item.startDate)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Enddatum */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-200 mb-2">
                  Enddatum
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  defaultValue={formatDate(item.endDate)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Aktiv */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  defaultChecked={item.isActive}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-200">Nachricht ist aktiv</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Link
                href="/de/admin/newsticker"
                className="px-6 py-2 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-800/50"
              >
                Abbrechen
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Wird gespeichert...' : 'Änderungen speichern'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
