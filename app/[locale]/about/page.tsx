import { AboutContentRenderer } from '@/components/about/AboutContentRenderer';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return <AboutContentRenderer locale={locale} />;
}
