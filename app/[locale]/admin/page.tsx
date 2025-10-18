export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Verwalten Sie Ihre Website-Inhalte und Einstellungen
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-blue-600">12</h3>
            <p className="text-gray-600">Edelsteine</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-green-600">8</h3>
            <p className="text-gray-600">Bestellungen</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-purple-600">24</h3>
            <p className="text-gray-600">Kunden</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-2xl font-bold text-orange-600">€2,450</h3>
            <p className="text-gray-600">Umsatz</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Edelstein-Verwaltung</h3>
            <p className="text-gray-600 mb-4">Verwalten Sie Ihre Edelstein-Kollektion</p>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                Neuer Edelstein
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                Alle anzeigen
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Bestellungen</h3>
            <p className="text-gray-600 mb-4">Verwalten Sie Kundenbestellungen</p>
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                Neue Bestellungen
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                Alle anzeigen
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Kunden</h3>
            <p className="text-gray-600 mb-4">Verwalten Sie Ihre Kunden</p>
            <div className="flex gap-2">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm">
                Kunden verwalten
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                Alle anzeigen
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Letzte Aktivitäten</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Neuer Edelstein hinzugefügt</p>
                  <p className="text-sm text-gray-600">Smaragd 2.5 Karat</p>
                </div>
                <span className="text-sm text-gray-500">vor 2 Stunden</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Neue Bestellung</p>
                  <p className="text-sm text-gray-600">Bestellung #1234</p>
                </div>
                <span className="text-sm text-gray-500">vor 4 Stunden</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Neuer Kunde registriert</p>
                  <p className="text-sm text-gray-600">Max Mustermann</p>
                </div>
                <span className="text-sm text-gray-500">vor 6 Stunden</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}