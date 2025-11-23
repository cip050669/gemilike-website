import { LegalPageContent } from '@/components/legal/LegalPageContent';

function StaticReturnsContent() {
  return (
    <>
      <div className="story-card mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Widerrufsrecht</h2>
        <div className="space-y-4 text-gray-200">
          <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
          <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben.</p>
        </div>
      </div>

      <div className="story-card mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Rücksendung</h2>
        <div className="space-y-4 text-gray-200">
          <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief, Telefax oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>
          <p>Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
        </div>
      </div>

      <div className="story-card mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Rücksendekosten</h2>
        <div className="space-y-4 text-gray-200">
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
    <div className="min-h-screen public-page-bg text-white pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="main-container">
          <div className="story-card space-y-4 p-6 md:p-8">
            <LegalPageContent
              slug="returns"
              locale={locale}
              fallbackContent={
                <>
                  <div className="space-y-4 text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                      <span className="gemilike-text-gradient">Widerrufsrecht</span>
                    </h1>
                  </div>
                  <StaticReturnsContent />
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
