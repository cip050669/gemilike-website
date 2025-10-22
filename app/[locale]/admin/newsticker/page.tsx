import { loadNewstickerData } from '@/app/api/admin/newsticker/route';
import Link from 'next/link';

export default function NewstickerAdminPage() {
  const items = loadNewstickerData();

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Newsticker-Verwaltung</h1>
              <p className="text-gray-600">Verwalten Sie die Newsticker-Nachrichten</p>
            </div>
            <Link
              href="/de/admin/newsticker/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              + Neue Nachricht
            </Link>
          </div>
        </div>

        {/* Newsticker Settings (static for now) */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Newsticker-Einstellungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Newsticker aktivieren
              </label>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Auto-Rotation
              </label>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotationsintervall (Sekunden)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="5"
                min="1"
                max="60"
              />
            </div>
          </div>
        </div>

        {/* Newsticker Messages */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Newsticker-Nachrichten ({items.length} gefunden)</h2>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Newsticker-Nachrichten</h3>
              <p className="text-gray-500 mb-4">Erstellen Sie Ihre erste Newsticker-Nachricht</p>
              <Link
                href="/de/admin/newsticker/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Erste Nachricht erstellen
              </Link>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-sm font-medium text-gray-900">{item.text}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
                            {item.priority === 'high' ? 'Hoch' : item.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.isActive)}`}>
                            {item.isActive ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Typ: {item.type} | Erstellt: {formatDate(item.createdAt)}
                        </div>
                        {(item.startDate || item.endDate) && (
                          <div className="text-sm text-gray-500">
                            {item.startDate && `Start: ${formatDate(item.startDate)}`}
                            {item.startDate && item.endDate && ' | '}
                            {item.endDate && `Ende: ${formatDate(item.endDate)}`}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/de/admin/newsticker/edit/${item.id}`}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Bearbeiten
                        </Link>
                        <form action={`/api/admin/newsticker/${item.id}`} method="POST" className="inline">
                          <input type="hidden" name="_method" value="DELETE" />
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Löschen
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
