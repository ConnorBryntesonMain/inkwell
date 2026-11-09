#!/bin/sh
# server/docker-entrypoint.sh
set -e

: "${DATABASE_URL:?DATABASE_URL must be set}"

# Retry migrations while the database starts during a Compose cold start.
attempt=1
until npx --no-install prisma migrate deploy; do
  if [ "$attempt" -ge 10 ]; then
    echo "Migrations failed after $attempt attempts; giving up." >&2
    exit 1
  fi
  echo "Database not ready (attempt $attempt); retrying in 3s..." >&2
  attempt=$((attempt + 1))
  sleep 3
done

exec "$@"
