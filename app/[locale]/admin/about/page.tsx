export default async function AdminAboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Über uns Verwaltung</h1>
        <p className="text-muted-foreground">
          Verwalten Sie die Inhalte der Über uns Seite
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Mission & Vision</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Unsere Mission ist es, die schönsten Edelsteine der Welt zu finden..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vision
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Wir stellen uns eine Welt vor, in der jeder die Schönheit von Edelsteinen erleben kann..."
            ></textarea>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Speichern
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Team-Informationen</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Firmengeschichte
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Seit 1995 sind wir Ihr vertrauensvoller Partner für Edelsteine..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unsere Werte
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Qualität, Vertrauen und Leidenschaft für Edelsteine..."
            ></textarea>
          </div>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}