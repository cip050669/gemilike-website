import { LegalPageContent } from '@/components/legal/LegalPageContent';

export default async function WiderrufPage({
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
            slug="widerruf"
            locale={locale}
            fallbackContent={
              <div className="text-center text-muted-foreground">
                Widerrufsrecht-Seite wird geladen...
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}

