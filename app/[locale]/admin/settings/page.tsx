export default function SettingsAdminPage() {
  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-white">System-Einstellungen</h1>
          <p className="text-gray-300">
            Verwalten Sie die System-Konfiguration
          </p>
        </div>

        {/* General Settings */}
        <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Allgemeine Einstellungen</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="site-name" className="block text-sm font-medium text-gray-200 mb-2">
                  Website-Name
                </label>
                <input
                  type="text"
                  id="site-name"
                  name="site-name"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Gemilike - Heroes in Gems"
                />
              </div>
              <div>
                <label htmlFor="site-url" className="block text-sm font-medium text-gray-200 mb-2">
                  Website-URL
                </label>
                <input
                  type="url"
                  id="site-url"
                  name="site-url"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://gemilike.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="site-description" className="block text-sm font-medium text-gray-200 mb-2">
                Website-Beschreibung
              </label>
              <textarea
                id="site-description"
                name="site-description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ihr Spezialist für rohe und geschliffene Edelsteine..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="default-language" className="block text-sm font-medium text-gray-200 mb-2">
                  Standard-Sprache
                </label>
                <select
                  id="default-language"
                  name="default-language"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-200 mb-2">
                  Zeitzone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">E-Mail-Einstellungen</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="smtp-host" className="block text-sm font-medium text-gray-200 mb-2">
                  SMTP-Host
                </label>
                <input
                  type="text"
                  id="smtp-host"
                  name="smtp-host"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <label htmlFor="smtp-port" className="block text-sm font-medium text-gray-200 mb-2">
                  SMTP-Port
                </label>
                <input
                  type="number"
                  id="smtp-port"
                  name="smtp-port"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="587"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="smtp-username" className="block text-sm font-medium text-gray-200 mb-2">
                  SMTP-Benutzername
                </label>
                <input
                  type="text"
                  id="smtp-username"
                  name="smtp-username"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="noreply@gemilike.com"
                />
              </div>
              <div>
                <label htmlFor="smtp-password" className="block text-sm font-medium text-gray-200 mb-2">
                  SMTP-Passwort
                </label>
                <input
                  type="password"
                  id="smtp-password"
                  name="smtp-password"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="from-email" className="block text-sm font-medium text-gray-200 mb-2">
                Absender-E-Mail
              </label>
              <input
                type="email"
                id="from-email"
                name="from-email"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="noreply@gemilike.com"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="smtp-ssl"
                name="smtp-ssl"
                className="mr-2"
              />
              <label htmlFor="smtp-ssl" className="text-sm font-medium text-gray-200">
                SSL/TLS verwenden
              </label>
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Zahlungseinstellungen</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-200 mb-2">
                  Währung
                </label>
                <select
                  id="currency"
                  name="currency"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>
              <div>
                <label htmlFor="tax-rate" className="block text-sm font-medium text-gray-200 mb-2">
                  Steuersatz (%)
                </label>
                <input
                  type="number"
                  id="tax-rate"
                  name="tax-rate"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="19.00"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Zahlungsmethoden</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="paypal-enabled"
                    name="paypal-enabled"
                    className="mr-2"
                  />
                  <label htmlFor="paypal-enabled" className="text-sm font-medium text-gray-200">
                    PayPal
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="stripe-enabled"
                    name="stripe-enabled"
                    className="mr-2"
                  />
                  <label htmlFor="stripe-enabled" className="text-sm font-medium text-gray-200">
                    Stripe (Kreditkarte)
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bank-transfer-enabled"
                    name="bank-transfer-enabled"
                    className="mr-2"
                  />
                  <label htmlFor="bank-transfer-enabled" className="text-sm font-medium text-gray-200">
                    Banküberweisung
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Sicherheitseinstellungen</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="session-timeout" className="block text-sm font-medium text-gray-200 mb-2">
                Session-Timeout (Minuten)
              </label>
              <input
                type="number"
                id="session-timeout"
                name="session-timeout"
                className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="two-factor-auth"
                name="two-factor-auth"
                className="mr-2"
              />
              <label htmlFor="two-factor-auth" className="text-sm font-medium text-gray-200">
                Zwei-Faktor-Authentifizierung aktivieren
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="password-policy"
                name="password-policy"
                className="mr-2"
              />
              <label htmlFor="password-policy" className="text-sm font-medium text-gray-200">
                Starke Passwort-Richtlinien
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="login-attempts"
                name="login-attempts"
                className="mr-2"
              />
              <label htmlFor="login-attempts" className="text-sm font-medium text-gray-200">
                Login-Versuche begrenzen
              </label>
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-gray-800/30 rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Backup-Einstellungen</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="backup-frequency" className="block text-sm font-medium text-gray-200 mb-2">
                  Backup-Häufigkeit
                </label>
                <select
                  id="backup-frequency"
                  name="backup-frequency"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Täglich</option>
                  <option value="weekly">Wöchentlich</option>
                  <option value="monthly">Monatlich</option>
                </select>
              </div>
              <div>
                <label htmlFor="backup-retention" className="block text-sm font-medium text-gray-200 mb-2">
                  Aufbewahrungszeit (Tage)
                </label>
                <input
                  type="number"
                  id="backup-retention"
                  name="backup-retention"
                  className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto-backup"
                name="auto-backup"
                className="mr-2"
              />
              <label htmlFor="auto-backup" className="text-sm font-medium text-gray-200">
                Automatische Backups aktivieren
              </label>
            </div>

            <div className="flex gap-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Backup erstellen
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Backup wiederherstellen
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <form action="/api/admin/settings" method="post">
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium">
              Einstellungen speichern
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}