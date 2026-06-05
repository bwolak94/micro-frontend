import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/domain/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString:
      process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/mfe_portfolio',
  },
});
