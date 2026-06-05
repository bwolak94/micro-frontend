import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/domain/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/mfe_portfolio',
  },
});
