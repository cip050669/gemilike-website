export default function AboutAdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Über uns - Verwaltung</h1>
          <p className="text-gray-600">
            Verwalten Sie den Inhalt der "Über uns" Seite
          </p>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Hero-Bereich</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="hero-title" className="block text-sm font-medium text-gray-700 mb-2">
                Haupttitel
              </label>
              <input
                type="text"
                id="hero-title"
                name="hero-title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Über Gemilike"
              />
            </div>

            <div>
              <label htmlFor="hero-subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                Untertitel
              </label>
              <input
                type="text"
                id="hero-subtitle"
                name="hero-subtitle"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ihr Spezialist für Edelsteine"
              />
            </div>

            <div>
              <label htmlFor="hero-description" className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung
              </label>
              <textarea
                id="hero-description"
                name="hero-description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seit über 20 Jahren sind wir Ihr vertrauensvoller Partner für hochwertige Edelsteine..."
              ></textarea>
            </div>

            <div>
              <label htmlFor="hero-image" className="block text-sm font-medium text-gray-700 mb-2">
                Hero-Bild
              </label>
              <input
                type="file"
                id="hero-image"
                name="hero-image"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Company Story */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Unsere Geschichte</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="story-title" className="block text-sm font-medium text-gray-700 mb-2">
                Titel
              </label>
              <input
                type="text"
                id="story-title"
                name="story-title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Unsere Geschichte"
              />
            </div>

            <div>
              <label htmlFor="story-content" className="block text-sm font-medium text-gray-700 mb-2">
                Geschichte
              </label>
              <textarea
                id="story-content"
                name="story-content"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Erzählen Sie die Geschichte Ihres Unternehmens..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Mission</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="mission-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  id="mission-title"
                  name="mission-title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Unsere Mission"
                />
              </div>

              <div>
                <label htmlFor="mission-content" className="block text-sm font-medium text-gray-700 mb-2">
                  Mission
                </label>
                <textarea
                  id="mission-content"
                  name="mission-content"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Beschreiben Sie Ihre Mission..."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Vision</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="vision-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titel
                </label>
                <input
                  type="text"
                  id="vision-title"
                  name="vision-title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Unsere Vision"
                />
              </div>

              <div>
                <label htmlFor="vision-content" className="block text-sm font-medium text-gray-700 mb-2">
                  Vision
                </label>
                <textarea
                  id="vision-content"
                  name="vision-content"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Beschreiben Sie Ihre Vision..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Team</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="team-title" className="block text-sm font-medium text-gray-700 mb-2">
                Team-Titel
              </label>
              <input
                type="text"
                id="team-title"
                name="team-title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Unser Team"
              />
            </div>

            <div>
              <label htmlFor="team-description" className="block text-sm font-medium text-gray-700 mb-2">
                Team-Beschreibung
              </label>
              <textarea
                id="team-description"
                name="team-description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Lernen Sie unser erfahrenes Team kennen..."
              ></textarea>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="text-lg font-medium mb-3">Team-Mitglieder</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="member1-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="member1-name"
                        name="member1-name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Max Mustermann"
                      />
                    </div>
                    <div>
                      <label htmlFor="member1-position" className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        id="member1-position"
                        name="member1-position"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Geschäftsführer"
                      />
                    </div>
                    <div>
                      <label htmlFor="member1-image" className="block text-sm font-medium text-gray-700 mb-1">
                        Bild
                      </label>
                      <input
                        type="file"
                        id="member1-image"
                        name="member1-image"
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label htmlFor="member1-bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Biografie
                    </label>
                    <textarea
                      id="member1-bio"
                      name="member1-bio"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kurze Biografie..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Unsere Werte</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="values-title" className="block text-sm font-medium text-gray-700 mb-2">
                Werte-Titel
              </label>
              <input
                type="text"
                id="values-title"
                name="values-title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Unsere Werte"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="value1-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Wert 1 Titel
                </label>
                <input
                  type="text"
                  id="value1-title"
                  name="value1-title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Qualität"
                />
                <textarea
                  id="value1-description"
                  name="value1-description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Beschreibung..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="value2-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Wert 2 Titel
                </label>
                <input
                  type="text"
                  id="value2-title"
                  name="value2-title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Vertrauen"
                />
                <textarea
                  id="value2-description"
                  name="value2-description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Beschreibung..."
                ></textarea>
              </div>
              <div>
                <label htmlFor="value3-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Wert 3 Titel
                </label>
                <input
                  type="text"
                  id="value3-title"
                  name="value3-title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Innovation"
                />
                <textarea
                  id="value3-description"
                  name="value3-description"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Beschreibung..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <form action="/api/admin/about" method="post">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
              Über uns Seite speichern
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}