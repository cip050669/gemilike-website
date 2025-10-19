export default function BlogsAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Blog-Verwaltung</h1>
              <p className="text-gray-600">
                Verwalten Sie Ihre Blog-Beiträge
              </p>
            </div>
            <form action="/de/admin/blogs/new" method="get">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                + Neuer Blog-Beitrag
              </button>
            </form>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Suche
              </label>
              <input
                type="text"
                id="search"
                name="search"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Blog-Beiträge suchen..."
              />
            </div>
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie
              </label>
              <select
                id="category-filter"
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alle Kategorien</option>
                <option value="edelsteine">Edelsteine</option>
                <option value="schmuck">Schmuck</option>
                <option value="pflege">Pflege</option>
                <option value="geschichte">Geschichte</option>
              </select>
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
              <form action="/de/admin/blogs" method="get">
                <button type="submit" className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                  Filter anwenden
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Blog Posts List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Blog-Beiträge (12 gefunden)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example Blog Posts */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Die faszinierende Welt der Smaragde</div>
                    <div className="text-sm text-gray-500">Ein umfassender Leitfaden zu Smaragden</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Edelsteine
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Dr. Schmidt
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Veröffentlicht
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    15.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/blogs/edit/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Bearbeiten</button>
                      </form>
                      <form action="/api/admin/blogs/1" method="delete" className="inline">
                        <button type="submit" className="text-red-600 hover:text-red-900">Löschen</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Diamanten: Von der Mine zum Schmuck</div>
                    <div className="text-sm text-gray-500">Der Weg eines Diamanten</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Edelsteine
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Maria Weber
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Entwurf
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    18.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/blogs/edit/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Bearbeiten</button>
                      </form>
                      <form action="/api/admin/blogs/1" method="delete" className="inline">
                        <button type="submit" className="text-red-600 hover:text-red-900">Löschen</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Pflege von Edelsteinen</div>
                    <div className="text-sm text-gray-500">Tipps für die richtige Pflege</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Pflege
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Anna Müller
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Veröffentlicht
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    12.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/blogs/edit/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Bearbeiten</button>
                      </form>
                      <form action="/api/admin/blogs/1" method="delete" className="inline">
                        <button type="submit" className="text-red-600 hover:text-red-900">Löschen</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Die Geschichte des Rubins</div>
                    <div className="text-sm text-gray-500">Historische Bedeutung des Rubins</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Geschichte
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Prof. Klein
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Veröffentlicht
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    08.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/blogs/edit/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Bearbeiten</button>
                      </form>
                      <form action="/api/admin/blogs/1" method="delete" className="inline">
                        <button type="submit" className="text-red-600 hover:text-red-900">Löschen</button>
                      </form>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Zeige 1-4 von 12 Ergebnissen
              </div>
              <div className="flex gap-2">
                <form action="/de/admin/blogs" method="get" className="inline">
                  <input type="hidden" name="page" value="1" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Vorherige
                  </button>
                </form>
                <form action="/de/admin/blogs" method="get" className="inline">
                  <input type="hidden" name="page" value="1" />
                  <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                    1
                  </button>
                </form>
                <form action="/de/admin/blogs" method="get" className="inline">
                  <input type="hidden" name="page" value="2" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    2
                  </button>
                </form>
                <form action="/de/admin/blogs" method="get" className="inline">
                  <input type="hidden" name="page" value="3" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    3
                  </button>
                </form>
                <form action="/de/admin/blogs" method="get" className="inline">
                  <input type="hidden" name="page" value="2" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Nächste
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}