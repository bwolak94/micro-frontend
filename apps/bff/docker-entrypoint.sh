#!/bin/sh
set -e

echo "Running database migrations..."
node dist/migrate.js

echo "Starting BFF server..."
exec node dist/server.js
