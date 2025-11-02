import { LegalPageContent } from '@/components/legal/LegalPageContent';

function StaticReturnsContent() {
  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">Widerrufsrecht</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
          <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">Rücksendung</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>
          <p>Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-primary">Rücksendekosten</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren. Die Kosten werden auf maximal €4,95 begrenzt.</p>
          <p>Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.</p>
        </div>
      </div>
    </>
  );
}

export default async function ReturnsPage({
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
            slug="returns"
            locale={locale}
            fallbackContent={
              <>
                <h1 className="gemilike-text-gradient text-3xl font-bold mb-8">Widerrufsrecht</h1>
                <StaticReturnsContent />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
