export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="gemilike-text-gradient text-3xl font-bold mb-8">Datenschutzerklärung</h1>
          
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">1. Verantwortlicher</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Verantwortlicher für die Datenverarbeitung:</strong></p>
                <p>Gemilike GmbH</p>
                <p>Musterstraße 123</p>
                <p>12345 Musterstadt</p>
                <p>Deutschland</p>
                <br />
                <p><strong>Telefon:</strong> +49 (0) 123 456 789</p>
                <p><strong>E-Mail:</strong> datenschutz@gemilike.com</p>
                <p><strong>Website:</strong> https://gemilike.de</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">2. Allgemeines zur Datenverarbeitung</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Rechtsgrundlagen:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
                  <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</li>
                  <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</li>
                </ul>
                <p><strong>Zweck der Datenverarbeitung:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Bereitstellung der Website</li>
                  <li>Bearbeitung von Anfragen und Bestellungen</li>
                  <li>Newsletter-Versand</li>
                  <li>Verbesserung der Website-Funktionalität</li>
                </ul>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">3. Bereitstellung der Website</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Logfiles:</strong></p>
                <p>Bei jedem Aufruf unserer Website werden automatisch folgende Daten gespeichert:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP-Adresse des zugreifenden Rechners</li>
                  <li>Datum und Uhrzeit des Zugriffs</li>
                  <li>Name und URL der abgerufenen Datei</li>
                  <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                  <li>Verwendeter Browser und ggf. das Betriebssystem</li>
                </ul>
                <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</p>
                <p><strong>Speicherdauer:</strong> 7 Tage</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">4. Verwendung von Cookies</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Cookie-Arten:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Technisch notwendige Cookies:</strong> Für die Grundfunktionen der Website</li>
                  <li><strong>Funktionale Cookies:</strong> Für verbesserte Benutzerfreundlichkeit</li>
                  <li><strong>Analytische Cookies:</strong> Für Website-Analysen (Google Analytics)</li>
                  <li><strong>Marketing-Cookies:</strong> Für personalisierte Werbung</li>
                </ul>
                <p><strong>Cookie-Verwaltung:</strong></p>
                <p>Sie können Cookies in Ihren Browser-Einstellungen verwalten und löschen. Beachten Sie, dass bei der Deaktivierung von Cookies die Funktionalität der Website eingeschränkt sein kann.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">5. Registrierung und Bestellung</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Erhobene Daten:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name, Vorname</li>
                  <li>E-Mail-Adresse</li>
                  <li>Rechnungs- und Lieferadresse</li>
                  <li>Telefonnummer</li>
                  <li>Zahlungsdaten (verschlüsselt)</li>
                </ul>
                <p><strong>Zweck:</strong> Vertragserfüllung, Rechnungsstellung, Lieferung</p>
                <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>
                <p><strong>Speicherdauer:</strong> 10 Jahre (Aufbewahrungspflicht nach HGB)</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">6. E-Mail-Kontakt</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Kontaktformular:</strong></p>
                <p>Bei der Nutzung unseres Kontaktformulars werden folgende Daten verarbeitet:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name</li>
                  <li>E-Mail-Adresse</li>
                  <li>Betreff</li>
                  <li>Nachricht</li>
                </ul>
                <p><strong>Zweck:</strong> Bearbeitung Ihrer Anfrage</p>
                <p><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</p>
                <p><strong>Speicherdauer:</strong> Bis zur vollständigen Bearbeitung Ihrer Anfrage</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">7. Rechte der betroffenen Person</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Sie haben folgende Rechte:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Auskunftsrecht</strong> (Art. 15 DSGVO)</li>
                  <li><strong>Berichtigungsrecht</strong> (Art. 16 DSGVO)</li>
                  <li><strong>Löschungsrecht</strong> (Art. 17 DSGVO)</li>
                  <li><strong>Einschränkungsrecht</strong> (Art. 18 DSGVO)</li>
                  <li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
                  <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
                  <li><strong>Beschwerderecht</strong> bei der Aufsichtsbehörde (Art. 77 DSGVO)</li>
                </ul>
                <p><strong>Kontakt für Datenschutzanfragen:</strong></p>
                <p>E-Mail: datenschutz@gemilike.com</p>
                <p>Post: Gemilike GmbH, Datenschutz, Musterstraße 123, 12345 Musterstadt</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">8. Datensicherheit</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Technische Maßnahmen:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL-Verschlüsselung (HTTPS)</li>
                  <li>Sichere Server-Infrastruktur</li>
                  <li>Regelmäßige Sicherheitsupdates</li>
                  <li>Zugriffskontrollen und -protokollierung</li>
                </ul>
                <p><strong>Organisatorische Maßnahmen:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Schulung der Mitarbeiter</li>
                  <li>Datenschutzrichtlinien</li>
                  <li>Zugriffsberechtigungen</li>
                  <li>Regelmäßige Datenschutz-Audits</li>
                </ul>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">9. Aktualität und Änderung</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Oktober 2025.</p>
                <p>Durch die Weiterentwicklung unserer Website und Angebote oder aufgrund geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern.</p>
                <p>Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf der Website unter https://gemilike.de/privacy abgerufen und ausgedruckt werden.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}