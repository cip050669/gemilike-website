import Link from 'next/link';
import { loadNewstickerData } from '@/lib/newsticker/data';
import { notFound } from 'next/navigation';

export default async function EditNewstickerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const items = loadNewstickerData();
  const item = items.find(item => item.id === id);

  if (!item) {
    notFound();
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

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
          <form action={`/api/admin/newsticker/${item.id}`} method="POST" className="space-y-6">
            <input type="hidden" name="_method" value="PUT" />
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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Änderungen speichern
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
