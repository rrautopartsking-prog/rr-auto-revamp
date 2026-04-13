#!/bin/sh
# Run this inside the app container to set up the database
echo "Waiting for database..."
sleep 3

echo "Pushing Prisma schema..."
npx prisma db push

echo "Seeding database..."
npx tsx prisma/seed.ts

echo "Done! App is ready at http://localhost:3000"
