import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const connectionString =
  process.env['DATABASE_URL'] ?? 'postgresql://postgres:postgres@localhost:5432/mfe_portfolio';

const migrationClient = postgres(connectionString, { max: 1 });
const db = drizzle(migrationClient);

console.log('Running database migrations...');

await migrate(db, { migrationsFolder: new URL('../drizzle', import.meta.url).pathname });

await migrationClient.end();

console.log('Migrations complete.');
