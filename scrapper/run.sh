#!/bin/sh
until nc -z -v -w30 localhost 5432; do
  echo "Waiting for database connection..."
  sleep 1
done

echo "Database is up, running prisma db push"

npx prisma db push
exec tsx src/main.ts