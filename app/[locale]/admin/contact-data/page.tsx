import { getTranslations } from 'next-intl/server';
import ContactDataManagement from '@/components/admin/ContactDataManagement';

export default async function ContactDataPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kontaktdaten-Verwaltung</h1>
        <p className="text-muted-foreground mt-2">
          Zentrale Verwaltung aller Kontaktdaten für Header, Footer und Kontakt-Seite
        </p>
      </div>

      <ContactDataManagement />
    </div>
  );
}
