export default function NewstickerAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Newsticker-Verwaltung</h1>
              <p className="text-gray-600">
                Verwalten Sie die Newsticker-Nachrichten
              </p>
            </div>
            <form action="/de/admin/newsticker/new" method="get">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                + Neue Nachricht
              </button>
            </form>
          </div>
        </div>

        {/* Newsticker Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Newsticker-Einstellungen</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="speed" className="block text-sm font-medium text-gray-700 mb-2">
                  Geschwindigkeit (Sekunden)
                </label>
                <input
                  type="number"
                  id="speed"
                  name="speed"
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3"
                />
              </div>
              <div>
                <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-2">
                  Richtung
                </label>
                <select
                  id="direction"
                  name="direction"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="left">Links</option>
                  <option value="right">Rechts</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  name="enabled"
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Newsticker aktiviert</span>
              </label>
            </div>
          </div>
        </div>

        {/* Newsticker Messages */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Newsticker-Nachrichten (6 gefunden)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nachricht
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priorität
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Startdatum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enddatum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example Messages */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">🎉 Neue Edelstein-Kollektion verfügbar!</div>
                    <div className="text-sm text-gray-500">Entdecken Sie unsere neuesten Diamanten</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Hoch
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktiv
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    20.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    30.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/newsticker/edit/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Bearbeiten</button>
                      </form>
                      <form action="/api/admin/newsticker/1" method="delete" className="inline ml-4">
                        <button type="submit" className="text-red-600 hover:text-red-900">Löschen</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">📦 Kostenloser Versand ab €100</div>
                    <div className="text-sm text-gray-500">Für alle Bestellungen innerhalb Deutschlands</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Mittel
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktiv
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    15.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    31.12.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/newsticker/edit/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Bearbeiten</button>
                      </form>
                      <form action="/api/admin/newsticker/1" method="delete" className="inline ml-4">
                        <button type="submit" className="text-red-600 hover:text-red-900">Löschen</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">🔍 Edelstein-Beratung verfügbar</div>
                    <div className="text-sm text-gray-500">Terminvereinbarung unter 0800-123456</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Niedrig
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Pausiert
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    10.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    25.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/newsticker/edit/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Bearbeiten</button>
                      </form>
                      <form action="/api/admin/newsticker/1" method="delete" className="inline ml-4">
                        <button type="submit" className="text-red-600 hover:text-red-900">Löschen</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">⭐ 5-Sterne Bewertungen</div>
                    <div className="text-sm text-gray-500">Über 1000 zufriedene Kunden</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Mittel
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktiv
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    01.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    31.12.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/newsticker/edit/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Bearbeiten</button>
                      </form>
                      <form action="/api/admin/newsticker/1" method="delete" className="inline ml-4">
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
                Zeige 1-4 von 6 Ergebnissen
              </div>
              <div className="flex gap-2">
                <form action="/de/admin/newsticker" method="get" className="inline">
                  <input type="hidden" name="page" value="1" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Vorherige
                  </button>
                </form>
                <form action="/de/admin/newsticker" method="get" className="inline">
                  <input type="hidden" name="page" value="1" />
                  <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                    1
                  </button>
                </form>
                <form action="/de/admin/newsticker" method="get" className="inline">
                  <input type="hidden" name="page" value="2" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    2
                  </button>
                </form>
                <form action="/de/admin/newsticker" method="get" className="inline">
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