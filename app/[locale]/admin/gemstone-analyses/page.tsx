import { prisma } from '@/lib/prisma';
import { GemstoneAnalysisTable } from '@/components/admin/gemstone-analyses/GemstoneAnalysisTable';
import { GemstoneAnalysis } from '@prisma/client';

interface GemstoneAnalysisWithUser extends GemstoneAnalysis {
  createdBy: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

const toListItem = (analysis: GemstoneAnalysisWithUser) => ({
  id: analysis.id,
  imageUrl: analysis.imageUrl,
  imageName: analysis.imageName,
  primaryColor: analysis.primaryColor as { hex: string; description: string },
  overallImpression: analysis.overallImpression as {
    dominantColorTone: string;
    possibleVariety: string[];
  },
  pleochroism: analysis.pleochroism,
  published: analysis.published,
  featured: analysis.featured,
  createdAt:
    analysis.createdAt instanceof Date
      ? analysis.createdAt.toISOString()
      : String(analysis.createdAt),
  createdBy: analysis.createdBy,
});

const countByStatus = (analyses: GemstoneAnalysisWithUser[]) => ({
  total: analyses.length,
  published: analyses.filter((a) => a.published).length,
  draft: analyses.filter((a) => !a.published).length,
  featured: analyses.filter((a) => a.featured).length,
});

export default async function GemstoneAnalysesAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const analyses = await prisma.gemstoneAnalysis.findMany({
    where: { locale },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const sorted = [...analyses];
  const stats = countByStatus(sorted);

  return (
    <div className="min-h-screen bg-gray-800/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-white">
                Edelstein-Farbanalysen
              </h1>
              <p className="text-gray-400">
                Verwalten Sie gespeicherte Farbanalysen von Edelsteinen
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Gesamt</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Veröffentlicht</div>
            <div className="text-2xl font-bold text-green-400">{stats.published}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Entwürfe</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.draft}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Featured</div>
            <div className="text-2xl font-bold text-[#9A1A63]">{stats.featured}</div>
          </div>
        </div>

        {/* Table */}
        <GemstoneAnalysisTable analyses={sorted.map(toListItem)} locale={locale} />
      </div>
    </div>
  );
}

