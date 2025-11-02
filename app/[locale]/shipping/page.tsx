import { LegalPageContent } from '@/components/legal/LegalPageContent';

function StaticShippingContent() {
  return (
    <div className="space-y-8">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">Standardversand</h2>
        <div className="space-y-2 text-muted-foreground">
          <p><strong>Lieferzeit:</strong> 3-5 Werktage</p>
          <p><strong>Kosten:</strong> Kostenlos ab €50 Bestellwert, sonst €4,95</p>
          <p>Standardversand innerhalb Deutschlands über DHL oder DPD.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">Expressversand</h2>
        <div className="space-y-2 text-muted-foreground">
          <p><strong>Lieferzeit:</strong> 1-2 Werktage</p>
          <p><strong>Kosten:</strong> €9,95</p>
          <p>Expressversand für eilige Bestellungen. Zustellung innerhalb Deutschlands am nächsten Werktag.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">Versicherter Versand</h2>
        <div className="space-y-2 text-muted-foreground">
          <p><strong>Lieferzeit:</strong> 3-5 Werktage</p>
          <p><strong>Kosten:</strong> €12,95</p>
          <p>Versand mit Versicherung für besonders wertvolle Edelsteine. Vollversichert bis €10.000.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">Internationaler Versand</h2>
        <div className="space-y-2 text-muted-foreground">
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
    <div className="min-h-screen public-page-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <LegalPageContent
            slug="shipping"
            locale={locale}
            fallbackContent={
              <>
                <h1 className="gemilike-text-gradient text-3xl font-bold mb-8">Versandinformationen</h1>
                <StaticShippingContent />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
