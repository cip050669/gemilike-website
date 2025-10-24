export default function TermsPage() {
  return (
    <div className="min-h-screen public-page-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="gemilike-text-gradient text-3xl font-bold mb-8">Allgemeine Geschäftsbedingungen</h1>
          
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">§ 1 Geltungsbereich</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen der Gemilike GmbH (nachfolgend „Verkäufer“) und ihren Kunden (nachfolgend „Käufer“) über den Verkauf von Edelsteinen und verwandten Produkten über den Online-Shop unter https://gemilike.de.</p>
                <p>Abweichende, entgegenstehende oder ergänzende AGB des Käufers werden nicht Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich schriftlich zugestimmt.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">§ 2 Vertragspartner</h2>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Verkäufer:</strong></p>
                <p>Gemilike GmbH</p>
                <p>Musterstraße 123</p>
                <p>12345 Musterstadt</p>
                <p>Deutschland</p>
                <br />
                <p><strong>Handelsregister:</strong> HRB 12345</p>
                <p><strong>Registergericht:</strong> Amtsgericht Musterstadt</p>
                <p><strong>Geschäftsführer:</strong> Max Mustermann</p>
                <p><strong>USt-IdNr.:</strong> DE123456789</p>
                <p><strong>Telefon:</strong> +49 (0) 123 456 789</p>
                <p><strong>E-Mail:</strong> info@gemilike.com</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">§ 3 Vertragsschluss</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Angebot:</strong></p>
                <p>Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar. Durch Anklicken des Buttons „In den Warenkorb“ oder „Kaufen“ geben Sie ein verbindliches Angebot zum Kauf der im Warenkorb befindlichen Waren ab.</p>
                
                <p><strong>Annahme:</strong></p>
                <p>Der Verkäufer kann das Angebot des Käufers innerhalb von 5 Tagen annehmen durch:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Übersendung einer Bestellbestätigung per E-Mail</li>
                  <li>Lieferung der bestellten Ware</li>
                  <li>Aufforderung zur Zahlung</li>
                </ul>
                
                <p><strong>Vertragssprache:</strong> Deutsch</p>
                <p><strong>Vertragstext:</strong> Der Vertragstext wird vom Verkäufer gespeichert und dem Käufer nach Vertragsschluss per E-Mail zugesandt.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">§ 4 Preise und Zahlungsbedingungen</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Preise:</strong></p>
                <p>Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Zusätzliche Kosten für Versand, Verpackung oder Zahlungsabwicklung werden gesondert ausgewiesen.</p>
                
                <p><strong>Zahlungsarten:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>PayPal</li>
                  <li>Kreditkarte (Visa, Mastercard, American Express)</li>
                  <li>SEPA-Lastschrift</li>
                  <li>Überweisung (Vorkasse)</li>
                </ul>
                
                <p><strong>Zahlungsfrist:</strong></p>
                <p>Bei Zahlung per Überweisung ist der Kaufpreis innerhalb von 7 Tagen nach Vertragsschluss zu zahlen. Bei anderen Zahlungsarten erfolgt die Belastung sofort.</p>
                
                <p><strong>Preisänderungen:</strong></p>
                <p>Der Verkäufer behält sich das Recht vor, die Preise zu ändern. Bereits abgeschlossene Verträge bleiben unberührt.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">§ 5 Lieferung und Versand</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Lieferzeit:</strong></p>
                <p>Die Lieferzeit beträgt 3-5 Werktage nach Zahlungseingang. Bei nicht verfügbaren Artikeln werden Sie umgehend informiert.</p>
                
                <p><strong>Versandkosten:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Standardversand (Deutschland): Kostenlos ab €50, sonst €4,95</li>
                  <li>Expressversand (Deutschland): €9,95</li>
                  <li>Internationaler Versand: Auf Anfrage</li>
                </ul>
                
                <p><strong>Liefergebiet:</strong></p>
                <p>Lieferungen erfolgen in Deutschland, Österreich und die Schweiz. Weitere Länder auf Anfrage.</p>
                
                <p><strong>Versandrisiko:</strong></p>
                <p>Das Versandrisiko geht mit der Übergabe der Ware an den Versanddienstleister auf den Käufer über.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">§ 6 Widerrufsrecht</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Widerrufsfrist:</strong></p>
                <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
                
                <p><strong>Widerrufsfrist:</strong></p>
                <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben.</p>
                
                <p><strong>Widerrufsfolgen:</strong></p>
                <p>Im Falle eines wirksamen Widerrufs sind die beiderseits empfangenen Leistungen zurückzugewähren und ggf. gezogene Nutzungen herauszugeben.</p>
                
                <p><strong>Rücksendekosten:</strong></p>
                <p>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren. Die Kosten werden auf maximal €4,95 begrenzt.</p>
                
                <p><strong>Ausschluss des Widerrufsrechts:</strong></p>
                <p>Das Widerrufsrecht besteht nicht bei individuell angefertigten Edelsteinen oder bei Edelsteinen, die nach Ihren Spezifikationen bearbeitet wurden.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">§ 7 Gewährleistung und Haftung</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Gewährleistung:</strong></p>
                <p>Es gelten die gesetzlichen Gewährleistungsbestimmungen. Die Gewährleistungsfrist beträgt 2 Jahre ab Lieferung.</p>
                
                <p><strong>Haftungsbeschränkung:</strong></p>
                <p>Der Verkäufer haftet nur für Schäden, die auf Vorsatz oder grober Fahrlässigkeit beruhen. Die Haftung für leichte Fahrlässigkeit ist ausgeschlossen, soweit nicht zwingende gesetzliche Haftungsbestimmungen entgegenstehen.</p>
                
                <p><strong>Produktbeschreibungen:</strong></p>
                <p>Alle Produktbeschreibungen und Abbildungen sind sorgfältig erstellt, können aber geringfügige Abweichungen aufweisen. Maßgebend sind die tatsächlichen Eigenschaften der gelieferten Ware.</p>
                
                <p><strong>Edelstein-Zertifikate:</strong></p>
                <p>Für hochwertige Edelsteine werden auf Wunsch Zertifikate von anerkannten Instituten ausgestellt. Die Kosten hierfür trägt der Käufer.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">§ 8 Datenschutz</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Die Erhebung, Verarbeitung und Nutzung Ihrer personenbezogenen Daten erfolgt ausschließlich im Rahmen der gesetzlichen Bestimmungen. Einzelheiten entnehmen Sie bitte unserer Datenschutzerklärung unter https://gemilike.de/privacy.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">§ 9 Schlussbestimmungen</h2>
              <div className="space-y-4 text-muted-foreground">
                <p><strong>Gerichtsstand:</strong></p>
                <p>Gerichtsstand ist Musterstadt, soweit der Käufer Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.</p>
                
                <p><strong>Anwendbares Recht:</strong></p>
                <p>Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.</p>
                
                <p><strong>Salvatorische Klausel:</strong></p>
                <p>Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
                
                <p><strong>Änderungen:</strong></p>
                <p>Der Verkäufer behält sich das Recht vor, diese AGB zu ändern. Die Änderungen werden dem Käufer spätestens zwei Wochen vor ihrem Inkrafttreten mitgeteilt.</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Kontakt</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>Bei Fragen zu diesen AGB wenden Sie sich bitte an:</p>
                <p><strong>E-Mail:</strong> info@gemilike.com</p>
                <p><strong>Telefon:</strong> +49 (0) 123 456 789</p>
                <p><strong>Post:</strong> Gemilike GmbH, Musterstraße 123, 12345 Musterstadt</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
