import Link from 'next/link';
import { KnowledgeEditorContainer } from '@/components/admin/KnowledgeEditorContainer';

export default async function KnowledgeCreatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Neuer Wissenswert-Artikel</h1>
            <p className="text-white/70">
              Erstellen Sie einen Beitrag für die Sektion „Wissenswertes“.
            </p>
          </div>
          <Link
            href={`/${locale}/admin/wissenswertes`}
            className="inline-flex items-center px-4 py-2 rounded-lg border border-white/30 text-white hover:bg-gray-800/30/10 transition-colors"
          >
            Zurück zur Übersicht
          </Link>
        </div>

        <KnowledgeEditorContainer mode="create" locale={locale} />
      </div>
    </div>
  );
}
