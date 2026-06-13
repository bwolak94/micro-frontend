#!/bin/sh
set -e

echo "Running database migrations..."
node dist/migrate.js

echo "Seeding database..."
node dist/seed.js

echo "Starting BFF server..."
exec node dist/server.js
