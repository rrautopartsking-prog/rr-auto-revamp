/**
 * Smart DB wrapper — uses real Prisma when DATABASE_URL is set,
 * falls back to mock data automatically.
 */

export const isDbConnected = (): boolean => {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("dummy:dummy")) return false;
  if (url.includes("user:password@host")) return false;
  return true;
};
