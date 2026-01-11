import { AboutContentRenderer } from '@/components/about/AboutContentRenderer';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <PublicLayout>
      <AboutContentRenderer locale={locale} />
    </PublicLayout>
  );
}
