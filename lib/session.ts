import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type AppSession = (Session & {
  user?: Session['user'] & {
    id: string;
    role?: string | null;
  };
}) | null;

export async function getSessionWithUser() {
  const session = (await getServerSession(authOptions)) as AppSession;
  const userId = typeof session?.user?.id === 'string' ? session.user.id : undefined;
  return { session, userId } as const;
}
