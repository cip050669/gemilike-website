import { loadStoriesData } from '@/app/api/admin/stories/route';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  content: string;
  gemstone: string;
  author: string;
  status: 'draft' | 'published' | 'archived';
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function StoriesAdminPage() {
  const stories = loadStoriesData();

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Veröffentlicht';
      case 'draft': return 'Entwurf';
      case 'archived': return 'Archiviert';
      default: return status;
    }
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Stories-Verwaltung</h1>
              <p className="text-gray-600">
                Verwalten Sie die Geschichten hinter den Edelsteinen
              </p>
            </div>
            <Link
              href="/de/admin/stories/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              + Neue Story
            </Link>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Suche
              </label>
              <input
                type="text"
                id="search"
                name="search"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Stories suchen..."
              />
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status-filter"
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alle Status</option>
                <option value="published">Veröffentlicht</option>
                <option value="draft">Entwurf</option>
                <option value="archived">Archiviert</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Filter anwenden
              </button>
            </div>
          </div>
        </div>

        {/* Stories List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Stories ({stories.length} gefunden)</h2>
          </div>

          {stories.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Stories gefunden</h3>
              <p className="text-gray-500 mb-4">Erstellen Sie Ihre erste Story, um zu beginnen.</p>
              <Link
                href="/de/admin/stories/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                + Erste Story erstellen
              </Link>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <div className="divide-y divide-gray-200">
                {stories.map((story) => (
                  <div key={story.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{story.title}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(story.status)}`}>
                            {getStatusText(story.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Autor: {story.author} | Erstellt: {formatDate(story.createdAt)}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {story.content.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/de/admin/stories/edit/${story.id}`}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Bearbeiten
                        </Link>
                        <form action={`/api/admin/stories/${story.id}`} method="POST" className="inline">
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