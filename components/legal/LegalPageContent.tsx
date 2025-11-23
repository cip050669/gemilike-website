import { prisma } from '@/lib/prisma';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';

interface LegalPageContentProps {
  slug: string;
  locale: string;
  fallbackContent?: React.ReactNode;
}

export async function LegalPageContent({
  slug,
  locale,
  fallbackContent,
}: LegalPageContentProps) {
  const page = await prisma.legalPage.findFirst({
    where: {
      slug,
      locale,
      isActive: true,
    },
  });

  if (!page) {
    return fallbackContent || <div>Seite nicht gefunden</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl md:text-5xl font-impact font-weight-impact mb-8">
        <span className="gemilike-text-gradient">{page.title}</span>
      </h1>
      <div className="max-w-none">
        <MarkdownRenderer content={page.content} />
      </div>
    </div>
  );
}

