export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Bestellungen</h1>
              <p className="text-gray-600">
                Verwalten Sie alle Kundenbestellungen
              </p>
            </div>
            <div className="flex gap-4">
              <form action="/de/admin/orders/export" method="get">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                >
                  📊 Export
                </button>
              </form>
              <form action="/de/admin/orders/new" method="get">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  + Neue Bestellung
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="all" />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Alle (24)
              </button>
            </form>
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="new" />
              <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Neu (8)
              </button>
            </form>
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="processing" />
              <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                In Bearbeitung (5)
              </button>
            </form>
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="shipped" />
              <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Versandt (7)
              </button>
            </form>
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="delivered" />
              <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Geliefert (4)
              </button>
            </form>
            <form action="/de/admin/orders" method="get" className="inline">
              <input type="hidden" name="status" value="cancelled" />
              <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Storniert (0)
              </button>
            </form>
          </div>
        </div>

        {/* Such- und Filterbereich */}
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
                placeholder="Bestellnummer, Kunde..."
              />
            </div>
            <div>
              <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-2">
                Von Datum
              </label>
              <input
                type="date"
                id="date-from"
                name="date-from"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-2">
                Bis Datum
              </label>
              <input
                type="date"
                id="date-to"
                name="date-to"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <form action="/de/admin/orders" method="get">
                <button type="submit" className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                  Filter anwenden
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bestellungen-Liste */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Bestellungen (24 gefunden)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bestellnummer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Betrag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zahlung
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Beispiel-Bestellungen */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#1234</div>
                    <div className="text-sm text-gray-500">Online</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Max Mustermann</div>
                    <div className="text-sm text-gray-500">max@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    19.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      In Bearbeitung
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €1,500.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    PayPal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/orders/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/de/admin/orders/edit/1" method="get" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Bearbeiten</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#1233</div>
                    <div className="text-sm text-gray-500">Telefon</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Anna Schmidt</div>
                    <div className="text-sm text-gray-500">anna@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    18.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Versandt
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €2,200.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Überweisung
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/orders/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/de/admin/orders/edit/1" method="get" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Bearbeiten</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#1232</div>
                    <div className="text-sm text-gray-500">Online</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Peter Weber</div>
                    <div className="text-sm text-gray-500">peter@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    17.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Neu
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €850.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Kreditkarte
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/orders/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/de/admin/orders/edit/1" method="get" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Bearbeiten</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#1231</div>
                    <div className="text-sm text-gray-500">Online</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Maria Müller</div>
                    <div className="text-sm text-gray-500">maria@example.com</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    16.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Geliefert
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €3,750.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    PayPal
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/orders/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/de/admin/orders/edit/1" method="get" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Bearbeiten</button>
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
                Zeige 1-4 von 24 Ergebnissen
              </div>
              <div className="flex gap-2">
                <form action="/de/admin/orders" method="get" className="inline">
                  <input type="hidden" name="page" value="1" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    Vorherige
                  </button>
                </form>
                <form action="/de/admin/orders" method="get" className="inline">
                  <input type="hidden" name="page" value="1" />
                  <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                    1
                  </button>
                </form>
                <form action="/de/admin/orders" method="get" className="inline">
                  <input type="hidden" name="page" value="2" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    2
                  </button>
                </form>
                <form action="/de/admin/orders" method="get" className="inline">
                  <input type="hidden" name="page" value="3" />
                  <button type="submit" className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                    3
                  </button>
                </form>
                <form action="/de/admin/orders" method="get" className="inline">
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