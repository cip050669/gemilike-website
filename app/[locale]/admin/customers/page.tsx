export default function CustomersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Kunden</h1>
              <p className="text-gray-600">
                Verwalten Sie Ihre Kunden und deren Daten
              </p>
            </div>
            <div className="flex gap-4">
              <form action="/de/admin/customers/export" method="get">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
                >
                  📊 Export
                </button>
              </form>
              <form action="/de/admin/customers/new" method="get">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  + Neuer Kunde
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-blue-600">24</h3>
            <p className="text-gray-600">Gesamt Kunden</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-green-600">18</h3>
            <p className="text-gray-600">Aktive Kunden</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-purple-600">6</h3>
            <p className="text-gray-600">Neue Kunden (30 Tage)</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-orange-600">€45,200</h3>
            <p className="text-gray-600">Gesamtumsatz</p>
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
                placeholder="Name, E-Mail..."
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
                <option value="active">Aktiv</option>
                <option value="inactive">Inaktiv</option>
                <option value="vip">VIP</option>
                <option value="blocked">Gesperrt</option>
              </select>
            </div>
            <div>
              <label htmlFor="registration-date" className="block text-sm font-medium text-gray-700 mb-2">
                Registriert seit
              </label>
              <select
                id="registration-date"
                name="registration-date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Alle Zeiträume</option>
                <option value="last-7-days">Letzte 7 Tage</option>
                <option value="last-30-days">Letzte 30 Tage</option>
                <option value="last-90-days">Letzte 90 Tage</option>
                <option value="last-year">Letztes Jahr</option>
              </select>
            </div>
            <div className="flex items-end">
              <form action="/de/admin/customers" method="get">
                <button type="submit" className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
                  Filter anwenden
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Kunden-Liste */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Kunden (24 gefunden)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registriert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bestellungen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gesamtumsatz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Beispiel-Kunden */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">MM</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Max Mustermann</div>
                        <div className="text-sm text-gray-500">ID: #001</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">max@example.com</div>
                    <div className="text-sm text-gray-500">+49 123 456789</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    15.08.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktiv
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    3 Bestellungen
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €4,200.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/customers/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/de/admin/customers/edit/1" method="get" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Bearbeiten</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium">AS</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Anna Schmidt</div>
                        <div className="text-sm text-gray-500">ID: #002</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">anna@example.com</div>
                    <div className="text-sm text-gray-500">+49 987 654321</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    22.09.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      VIP
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    7 Bestellungen
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €12,500.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/customers/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/de/admin/customers/edit/1" method="get" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Bearbeiten</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-medium">PW</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Peter Weber</div>
                        <div className="text-sm text-gray-500">ID: #003</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">peter@example.com</div>
                    <div className="text-sm text-gray-500">+49 555 123456</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    10.10.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktiv
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    1 Bestellung
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €850.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/customers/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/de/admin/customers/edit/1" method="get" className="inline ml-4">
                        <button type="submit" className="text-green-600 hover:text-green-900">Bearbeiten</button>
                      </form>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-medium">MM</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Maria Müller</div>
                        <div className="text-sm text-gray-500">ID: #004</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">maria@example.com</div>
                    <div className="text-sm text-gray-500">+49 333 789012</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    05.07.2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Inaktiv
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2 Bestellungen
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    €1,200.00
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <form action="/de/admin/customers/view/1" method="get" className="inline">
                        <button type="submit" className="text-blue-600 hover:text-blue-900">Anzeigen</button>
                      </form>
                      <form action="/de/admin/customers/edit/1" method="get" className="inline ml-4">
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
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Vorherige
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Nächste
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}