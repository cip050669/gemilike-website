import { getTranslations } from 'next-intl/server';
import { DownloadArea } from '@/components/downloads/DownloadArea';

export default async function DownloadsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params;
  await getTranslations();

  return (
    <div className="min-h-screen public-page-bg text-white pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="main-container">
          <div className="story-card space-y-4 p-6 md:p-8">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl md:text-5xl font-impact font-weight-impact">
                <span className="gemilike-text-gradient">Download-Bereich</span>
              </h1>
              <p className="mx-auto max-w-3xl text-sm md:text-base text-gray-200">
                Geschützter Bereich für Projekt-Downloads
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <DownloadArea />
        </div>
      </div>
    </div>
  );
}


