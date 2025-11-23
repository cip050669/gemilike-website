import { LegalPageContent } from '@/components/legal/LegalPageContent';

function StaticCookiesContent() {
  return (
    <div className="space-y-8">
      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Was sind Cookies?</h2>
        <div className="space-y-2 text-gray-200">
          <p>Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie helfen uns dabei, Ihre Präferenzen zu speichern und die Website für Sie zu optimieren.</p>
          <p>Cookies können nicht auf Ihr System zugreifen oder Schäden verursachen. Sie enthalten keine Viren oder andere schädliche Programme.</p>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Arten von Cookies</h2>
        <div className="space-y-4 text-gray-200">
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Technisch notwendige Cookies</h3>
            <p>Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Session-Cookies für die Navigation</li>
              <li>Warenkorb-Funktionalität</li>
              <li>Sicherheits-Cookies</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Funktionale Cookies</h3>
            <p>Diese Cookies verbessern die Benutzerfreundlichkeit der Website.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Spracheinstellungen</li>
              <li>Benutzereinstellungen</li>
              <li>Formular-Daten</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Analytische Cookies</h3>
            <p>Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Google Analytics</li>
              <li>Besucherstatistiken</li>
              <li>Seitenaufrufe</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Marketing-Cookies</h3>
            <p>Diese Cookies werden für personalisierte Werbung verwendet.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Social Media Integration</li>
              <li>Werbepartner</li>
              <li>Remarketing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Cookie-Verwaltung</h2>
        <div className="space-y-4 text-gray-200">
          <p><strong>Cookie-Einstellungen ändern:</strong></p>
          <p>Sie können Ihre Cookie-Einstellungen jederzeit über den Cookie-Banner auf unserer Website oder direkt in Ihren Browser-Einstellungen ändern.</p>
          
          <p><strong>Cookies löschen:</strong></p>
          <p>Sie können gespeicherte Cookies jederzeit in Ihren Browser-Einstellungen löschen. Beachten Sie, dass dies die Funktionalität der Website beeinträchtigen kann.</p>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Browser-spezifische Anleitungen</h2>
        <div className="space-y-4 text-gray-200">
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Google Chrome</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Klicken Sie auf das Drei-Punkte-Menü (oben rechts)</li>
              <li>Wählen Sie &quot;Einstellungen&quot;</li>
              <li>Klicken Sie auf &quot;Datenschutz und Sicherheit&quot;</li>
              <li>Wählen Sie &quot;Cookies und andere Websitedaten&quot;</li>
              <li>Verwalten Sie Ihre Cookie-Einstellungen</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Mozilla Firefox</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Klicken Sie auf das Hamburger-Menü (oben rechts)</li>
              <li>Wählen Sie &quot;Einstellungen&quot;</li>
              <li>Klicken Sie auf &quot;Datenschutz &amp; Sicherheit&quot;</li>
              <li>Scrollen Sie zu &quot;Cookies und Website-Daten&quot;</li>
              <li>Verwalten Sie Ihre Cookie-Einstellungen</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Safari</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Klicken Sie auf &quot;Safari&quot; in der Menüleiste</li>
              <li>Wählen Sie &quot;Einstellungen&quot;</li>
              <li>Klicken Sie auf den Tab &quot;Datenschutz&quot;</li>
              <li>Verwalten Sie Ihre Cookie-Einstellungen</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Microsoft Edge</h3>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Klicken Sie auf das Drei-Punkte-Menü (oben rechts)</li>
              <li>Wählen Sie &quot;Einstellungen&quot;</li>
              <li>Klicken Sie auf &quot;Cookies und Websiteberechtigungen&quot;</li>
              <li>Verwalten Sie Ihre Cookie-Einstellungen</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Drittanbieter-Cookies</h2>
        <div className="space-y-4 text-gray-200">
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Google Analytics</h3>
            <p>Wir verwenden Google Analytics zur Analyse der Website-Nutzung. Google Analytics verwendet Cookies, um Informationen über Ihre Nutzung der Website zu sammeln.</p>
            <p><strong>Opt-out:</strong> Sie können die Datenerfassung durch Google Analytics deaktivieren, indem Sie das Google Analytics Opt-out Browser Add-on installieren.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Social Media</h3>
            <p>Unsere Website kann Social Media Plugins enthalten (Facebook, Instagram, Twitter), die eigene Cookies setzen können.</p>
            <p>Diese Dienste haben ihre eigenen Datenschutzrichtlinien und Cookie-Richtlinien.</p>
          </div>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Cookie-Lebensdauer</h2>
        <div className="space-y-4 text-gray-200">
          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Session-Cookies</h3>
            <p>Diese Cookies werden automatisch gelöscht, wenn Sie Ihren Browser schließen.</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-200 mb-2">Persistente Cookies</h3>
            <p>Diese Cookies bleiben auf Ihrem Gerät gespeichert, bis sie ablaufen oder Sie sie löschen.</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Funktionale Cookies: 30 Tage</li>
              <li>Analytische Cookies: 2 Jahre</li>
              <li>Marketing-Cookies: 1 Jahr</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Rechte der Nutzer</h2>
        <div className="space-y-2 text-gray-200">
          <p><strong>Sie haben das Recht:</strong></p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Cookies zu akzeptieren oder abzulehnen</li>
            <li>Bereits gespeicherte Cookies zu löschen</li>
            <li>Cookie-Einstellungen zu ändern</li>
            <li>Informationen über verwendete Cookies zu erhalten</li>
            <li>Widerspruch gegen die Verwendung von Cookies einzulegen</li>
          </ul>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Kontakt</h2>
        <div className="space-y-2 text-gray-200">
          <p>Bei Fragen zu unserer Cookie-Richtlinie wenden Sie sich bitte an:</p>
          <p><strong>E-Mail:</strong> datenschutz@gemilike.com</p>
          <p><strong>Telefon:</strong> +49 (0) 123 456 789</p>
          <p><strong>Post:</strong> Gemilike GmbH, Datenschutz, Musterstraße 123, 12345 Musterstadt</p>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Änderungen</h2>
        <div className="space-y-2 text-gray-200">
          <p>Wir behalten uns das Recht vor, diese Cookie-Richtlinie zu ändern. Änderungen werden auf dieser Seite veröffentlicht.</p>
          <p><strong>Letzte Aktualisierung:</strong> Oktober 2025</p>
          <p><strong>Nächste Überprüfung:</strong> April 2026</p>
        </div>
      </div>
    </div>
  );
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen public-page-bg text-white pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="main-container">
          <div className="story-card space-y-4 p-6 md:p-8">
            <LegalPageContent
              slug="cookies"
              locale={locale}
              fallbackContent={
                <>
                  <div className="space-y-4 text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                      <span className="gemilike-text-gradient">Cookie-Richtlinie</span>
                    </h1>
                  </div>
                  <StaticCookiesContent />
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
