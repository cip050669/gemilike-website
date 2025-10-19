import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import WorldMapManagement from '@/components/admin/WorldMapManagement';

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function WorldMapAdminPage({ params }: Props) {
  const { locale } = await params;
  
  // Authentifizierung - in Entwicklung optional
  const session = await getServerSession(authOptions);
  if (process.env.NODE_ENV === 'production' && !session?.user?.id) {
    redirect(`/${locale}/admin/login`);
  }

  return <WorldMapManagement />;
}

