import './prisma/env-bootstrap';

import { defineConfig } from '@prisma/config';

// Prisma 7: DATABASE_URL muss für Migrationen gesetzt sein
// Die URL kann aus .env Datei oder Umgebungsvariablen kommen
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is required for Prisma migrations.\n' +
    'Please set DATABASE_URL in your .env file or as an environment variable.\n' +
    'Example: DATABASE_URL="postgresql://user:password@localhost:5432/dbname"'
  );
}

export default defineConfig({
  migrations: {
    seed: 'ts-node --project prisma/tsconfig.seed.json prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
});
