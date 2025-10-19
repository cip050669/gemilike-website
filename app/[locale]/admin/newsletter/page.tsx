export default function NewsletterAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Newsletter-Verwaltung</h1>
              <p className="text-gray-600">
                Verwalten Sie Newsletter und Abonnements
              </p>
            </div>
            <form action="/de/admin/newsletter/new" method="get">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                + Neuer Newsletter
              </button>
            </form>
          </div>
        </div>

        {/* Newsletter Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-blue-600">1,247</h3>
            <p className="text-gray-600">Abonnenten</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-green-600">23</h3>
            <p className="text-gray-600">Newsletter gesendet</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-purple-600">68%</h3>
            <p className="text-gray-600">Öffnungsrate</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-orange-600">12%</h3>
            <p className="text-gray-600">Klickrate</p>
          </div>
        </div>

        {/* Newsletter Management */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Newsletter (23 gesendet)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Betreff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empfänger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gesendet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Öffnungsrate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example Newsletters */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Neue Edelstein-Kollektion</div>
                    <div className="text-sm text-gray-500">Entdecken Sie unsere neuesten Diamanten</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    1,247
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Gesendet
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    20.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    72%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/newsletter/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/api/admin/newsletter/1/duplicate" method="post" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Duplizieren</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Sonderangebote im November</div>
                    <div className="text-sm text-gray-500">Bis zu 30% Rabatt auf ausgewählte Edelsteine</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    1,200
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Gesendet
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    15.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    65%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/newsletter/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/api/admin/newsletter/1/duplicate" method="post" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Duplizieren</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Edelstein-Pflege Tipps</div>
                    <div className="text-sm text-gray-500">Wie Sie Ihre Edelsteine richtig pflegen</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    1,180
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Entwurf
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/newsletter/edit/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Bearbeiten</button>
                      </form>
                      <form action="/api/admin/newsletter/1/send" method="post" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Senden</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Willkommen bei Gemilike</div>
                    <div className="text-sm text-gray-500">Ihr erster Newsletter</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    1,100
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Gesendet
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    01.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    68%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/newsletter/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/api/admin/newsletter/1/duplicate" method="post" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Duplizieren</button>
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
                Zeige 1-4 von 23 Ergebnissen
              </div>
              <div className="flex gap-2">
                <form action="/de/admin/newsletter" method="get" className="inline">
                  <input type="hidden" name="page" value="1" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Vorherige
                  </button>
                </form>
                <form action="/de/admin/newsletter" method="get" className="inline">
                  <input type="hidden" name="page" value="1" />
                  <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                    1
                  </button>
                </form>
                <form action="/de/admin/newsletter" method="get" className="inline">
                  <input type="hidden" name="page" value="2" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    2
                  </button>
                </form>
                <form action="/de/admin/newsletter" method="get" className="inline">
                  <input type="hidden" name="page" value="3" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    3
                  </button>
                </form>
                <form action="/de/admin/newsletter" method="get" className="inline">
                  <input type="hidden" name="page" value="2" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Nächste
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Subscribers Management */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Abonnenten (1,247)</h2>
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4">
                <form action="/api/admin/newsletter/export" method="post" className="inline">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                    Export CSV
                  </button>
                </form>
                <form action="/de/admin/newsletter/import" method="get" className="inline">
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                    Import CSV
                  </button>
                </form>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Abonnenten suchen..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <form action="/de/admin/newsletter" method="get" className="inline">
                  <button type="submit" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                    Suchen
                  </button>
                </form>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-Mail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Abonniert seit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      max@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Max Mustermann
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      15.08.2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Aktiv
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <form action="/api/admin/newsletter/unsubscribe/1" method="post" className="inline">
                        <button type="submit" className="text-red-600 hover:text-red-900">Abmelden</button>
                      </form>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      anna@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Anna Schmidt
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      22.09.2025
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Aktiv
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <form action="/api/admin/newsletter/unsubscribe/1" method="post" className="inline">
                        <button type="submit" className="text-red-600 hover:text-red-900">Abmelden</button>
                      </form>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}