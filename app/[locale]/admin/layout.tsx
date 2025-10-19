import { NextIntlClientProvider } from 'next-intl';
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Dynamically load messages for the locale
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </NextIntlClientProvider>
  );
}
