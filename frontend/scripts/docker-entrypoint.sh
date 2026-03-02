#!/bin/sh
set -e

echo "[entrypoint] Starting TeddyBearsRoom container..."

if [ -n "$DATABASE_URL" ]; then
  echo "[entrypoint] Waiting for PostgreSQL..."
  # Remove query parameters (?schema=public, etc) from DATABASE_URL for pg_isready
  DB_URL_CLEAN=$(echo "$DATABASE_URL" | sed 's/?.*$//')
  ATTEMPTS=0
  until pg_isready -d "$DB_URL_CLEAN" >/dev/null 2>&1; do
    ATTEMPTS=$((ATTEMPTS + 1))
    if [ "$ATTEMPTS" -gt 60 ]; then
      echo "[entrypoint] PostgreSQL not ready after 60 attempts (URL: $DB_URL_CLEAN)"
      exit 1
    fi
    sleep 2
  done
  echo "[entrypoint] PostgreSQL is ready"

  if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "[entrypoint] Running prisma migrate deploy..."
    npx prisma migrate deploy
  fi

  if [ "${SEED_ON_START:-false}" = "true" ]; then
    echo "[entrypoint] Running prisma seed..."
    npm run prisma:seed || npx tsx prisma/seed.ts
  fi
fi

echo "[entrypoint] Launching app..."
exec "$@"
