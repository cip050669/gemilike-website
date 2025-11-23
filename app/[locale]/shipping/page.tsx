import { LegalPageContent } from '@/components/legal/LegalPageContent';

function StaticShippingContent() {
  return (
    <div className="space-y-8">
      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Standardversand</h2>
        <div className="space-y-2 text-gray-200">
          <p><strong>Lieferzeit:</strong> 3-5 Werktage</p>
          <p><strong>Kosten:</strong> Kostenlos ab €50 Bestellwert, sonst €4,95</p>
          <p>Standardversand innerhalb Deutschlands über DHL oder DPD.</p>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Expressversand</h2>
        <div className="space-y-2 text-gray-200">
          <p><strong>Lieferzeit:</strong> 1-2 Werktage</p>
          <p><strong>Kosten:</strong> €9,95</p>
          <p>Expressversand für eilige Bestellungen. Zustellung innerhalb Deutschlands am nächsten Werktag.</p>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Versicherter Versand</h2>
        <div className="space-y-2 text-gray-200">
          <p><strong>Lieferzeit:</strong> 3-5 Werktage</p>
          <p><strong>Kosten:</strong> €12,95</p>
          <p>Versand mit Versicherung für besonders wertvolle Edelsteine. Vollversichert bis €10.000.</p>
        </div>
      </div>

      <div className="story-card">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Internationaler Versand</h2>
        <div className="space-y-2 text-gray-200">
          <p>Lieferungen nach Österreich und in die Schweiz sind möglich. Die Versandkosten werden individuell berechnet.</p>
          <p>Bei Bestellungen aus dem Ausland können zusätzliche Zölle und Steuern anfallen, die vom Kunden zu tragen sind.</p>
          <p><strong>Kontakt:</strong> Bitte kontaktieren Sie uns für individuelle Versandkosten.</p>
        </div>
      </div>
    </div>
  );
}

export default async function ShippingPage({
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
              slug="shipping"
              locale={locale}
              fallbackContent={
                <>
                  <div className="space-y-4 text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                      <span className="gemilike-text-gradient">Versandinformationen</span>
                    </h1>
                  </div>
                  <StaticShippingContent />
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
