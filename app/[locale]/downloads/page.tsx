import { getTranslations } from 'next-intl/server';
import { DownloadArea } from '@/components/downloads/DownloadArea';

export default async function DownloadsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            <span className="gradient-text animate-glow">Download-Bereich</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Geschützter Bereich für Projekt-Downloads
          </p>
        </div>

        <DownloadArea />
      </div>
    </div>
  );
}


