export default function CookiesPage() {
  return (
    <div className="min-h-screen public-page-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="gemilike-text-gradient text-3xl font-bold mb-8">Cookie-Richtlinie</h1>
          
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Was sind Cookies?</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie unsere Website besuchen. Sie helfen uns dabei, Ihre Präferenzen zu speichern und die Website für Sie zu optimieren.</p>
                <p>Cookies können nicht auf Ihr System zugreifen oder Schäden verursachen. Sie enthalten keine Viren oder andere schädliche Programme.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Arten von Cookies</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Technisch notwendige Cookies</h3>
                  <p>Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Session-Cookies für die Navigation</li>
                    <li>Warenkorb-Funktionalität</li>
                    <li>Sicherheits-Cookies</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Funktionale Cookies</h3>
                  <p>Diese Cookies verbessern die Benutzerfreundlichkeit der Website.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Spracheinstellungen</li>
                    <li>Benutzereinstellungen</li>
                    <li>Formular-Daten</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Analytische Cookies</h3>
                  <p>Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Google Analytics</li>
                    <li>Besucherstatistiken</li>
                    <li>Seitenaufrufe</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Marketing-Cookies</h3>
                  <p>Diese Cookies werden für personalisierte Werbung verwendet.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Social Media Integration</li>
                    <li>Werbepartner</li>
                    <li>Remarketing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Cookie-Verwaltung</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Cookie-Einstellungen ändern:</strong></p>
                <p>Sie können Ihre Cookie-Einstellungen jederzeit über den Cookie-Banner auf unserer Website oder direkt in Ihren Browser-Einstellungen ändern.</p>
                
                <p><strong>Cookies löschen:</strong></p>
                <p>Sie können gespeicherte Cookies jederzeit in Ihren Browser-Einstellungen löschen. Beachten Sie, dass dies die Funktionalität der Website beeinträchtigen kann.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Browser-spezifische Anleitungen</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Google Chrome</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Klicken Sie auf das Drei-Punkte-Menü (oben rechts)</li>
                    <li>Wählen Sie „Einstellungen“</li>
                    <li>Klicken Sie auf „Datenschutz und Sicherheit“</li>
                    <li>Wählen Sie „Cookies und andere Websitedaten“</li>
                    <li>Verwalten Sie Ihre Cookie-Einstellungen</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Mozilla Firefox</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Klicken Sie auf das Hamburger-Menü (oben rechts)</li>
                    <li>Wählen Sie „Einstellungen“</li>
                    <li>Klicken Sie auf „Datenschutz &amp; Sicherheit“</li>
                    <li>Scrollen Sie zu „Cookies und Website-Daten“</li>
                    <li>Verwalten Sie Ihre Cookie-Einstellungen</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Safari</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Klicken Sie auf „Safari“ in der Menüleiste</li>
                    <li>Wählen Sie „Einstellungen“</li>
                    <li>Klicken Sie auf den Tab „Datenschutz“</li>
                    <li>Verwalten Sie Ihre Cookie-Einstellungen</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Microsoft Edge</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Klicken Sie auf das Drei-Punkte-Menü (oben rechts)</li>
                    <li>Wählen Sie „Einstellungen“</li>
                    <li>Klicken Sie auf „Cookies und Websiteberechtigungen“</li>
                    <li>Verwalten Sie Ihre Cookie-Einstellungen</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Drittanbieter-Cookies</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Google Analytics</h3>
                  <p>Wir verwenden Google Analytics zur Analyse der Website-Nutzung. Google Analytics verwendet Cookies, um Informationen über Ihre Nutzung der Website zu sammeln.</p>
                  <p><strong>Opt-out:</strong> Sie können die Datenerfassung durch Google Analytics deaktivieren, indem Sie das Google Analytics Opt-out Browser Add-on installieren.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Social Media</h3>
                  <p>Unsere Website kann Social Media Plugins enthalten (Facebook, Instagram, Twitter), die eigene Cookies setzen können.</p>
                  <p>Diese Dienste haben ihre eigenen Datenschutzrichtlinien und Cookie-Richtlinien.</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Cookie-Lebensdauer</h2>
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Session-Cookies</h3>
                  <p>Diese Cookies werden automatisch gelöscht, wenn Sie Ihren Browser schließen.</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Persistente Cookies</h3>
                  <p>Diese Cookies bleiben auf Ihrem Gerät gespeichert, bis sie ablaufen oder Sie sie löschen.</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Funktionale Cookies: 30 Tage</li>
                    <li>Analytische Cookies: 2 Jahre</li>
                    <li>Marketing-Cookies: 1 Jahr</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Rechte der Nutzer</h2>
              <div className="space-y-2 text-muted-foreground">
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

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Kontakt</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Bei Fragen zu unserer Cookie-Richtlinie wenden Sie sich bitte an:</p>
                <p><strong>E-Mail:</strong> datenschutz@gemilike.com</p>
                <p><strong>Telefon:</strong> +49 (0) 123 456 789</p>
                <p><strong>Post:</strong> Gemilike GmbH, Datenschutz, Musterstraße 123, 12345 Musterstadt</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Änderungen</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Wir behalten uns das Recht vor, diese Cookie-Richtlinie zu ändern. Änderungen werden auf dieser Seite veröffentlicht.</p>
                <p><strong>Letzte Aktualisierung:</strong> Oktober 2025</p>
                <p><strong>Nächste Überprüfung:</strong> April 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
