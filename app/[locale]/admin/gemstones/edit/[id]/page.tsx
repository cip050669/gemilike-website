interface EditGemstonePageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function EditGemstonePage({ params }: EditGemstonePageProps) {
  const { id, locale } = await params;

  // Dummy data for demonstration
  const gemstone = {
    id: id,
    name: 'Smaragd 2.5 Karat',
    carat: 2.5,
    color: 'Grün',
    cut: 'Brillant',
    clarity: 'VVS1',
    price: 1500.00,
    description: 'Ein wunderschöner Smaragd mit intensiver grüner Farbe.',
    status: 'Verfügbar',
    image: '/placeholder-gem.jpg'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Edelstein bearbeiten</h1>
              <p className="text-gray-600">
                Bearbeiten Sie die Details des Edelsteins
              </p>
            </div>
            <form action="/de/admin/gemstones" method="get">
              <button
                type="submit"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
              >
                ← Zurück zur Liste
              </button>
            </form>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={gemstone.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Smaragd 2.5 Karat"
                />
              </div>
              
              <div>
                <label htmlFor="carat" className="block text-sm font-medium text-gray-700 mb-2">
                  Karat
                </label>
                <input
                  type="number"
                  id="carat"
                  name="carat"
                  step="0.01"
                  defaultValue={gemstone.carat}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. 2.5"
                />
              </div>
              
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  Farbe
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  defaultValue={gemstone.color}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Grün"
                />
              </div>
              
              <div>
                <label htmlFor="cut" className="block text-sm font-medium text-gray-700 mb-2">
                  Schliff
                </label>
                <input
                  type="text"
                  id="cut"
                  name="cut"
                  defaultValue={gemstone.cut}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. Brillant"
                />
              </div>
              
              <div>
                <label htmlFor="clarity" className="block text-sm font-medium text-gray-700 mb-2">
                  Reinheit
                </label>
                <input
                  type="text"
                  id="clarity"
                  name="clarity"
                  defaultValue={gemstone.clarity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. VVS1"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Preis (€)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  defaultValue={gemstone.price}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="z.B. 1500.00"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={gemstone.description}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Geben Sie eine detaillierte Beschreibung des Edelsteins ein."
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={gemstone.status}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Verfügbar">Verfügbar</option>
                <option value="Reserviert">Reserviert</option>
                <option value="Verkauft">Verkauft</option>
                <option value="Nicht verfügbar">Nicht verfügbar</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Bild
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Aktuell</span>
                </div>
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <form action="/de/admin/gemstones" method="get">
                <button
                  type="submit"
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
                >
                  Abbrechen
                </button>
              </form>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
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