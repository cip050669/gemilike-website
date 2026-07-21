/**
 * Laeuft einmal beim Start des Node-Servers (Next.js).
 * Ein klarer Hinweis, wenn DATABASE_URL nicht erreichbar ist — statt nur vieler prisma:error-Zeilen.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  const { prisma, isPrismaConnectionError, getPrismaConnectionErrorSummary } = await import(
    './lib/prisma'
  );

  const timeoutMs = 5000;
  try {
    await Promise.race([
      prisma.$connect(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('PRISMA_CONNECT_TIMEOUT')), timeoutMs)
      ),
    ]);
  } catch (error: unknown) {
    const timeout =
      error instanceof Error && error.message === 'PRISMA_CONNECT_TIMEOUT';
    if (timeout || isPrismaConnectionError(error)) {
      const detail = getPrismaConnectionErrorSummary(error);
      console.warn(
        `\n[gemilike] Datenbank nicht erreichbar (${detail}). Lokale Entwicklung: \`npm run db:up\` ` +
          'oder `docker compose up -d postgres` (Host-Port Standard: 5433). ' +
          'Remote-DB: `SKIP_ENSURE_DEV_DB=1` und passendes `DATABASE_URL`.\n'
      );
      return;
    }
    console.warn('[gemilike] Unerwarteter Fehler bei prisma.$connect():', error);
  }
}
