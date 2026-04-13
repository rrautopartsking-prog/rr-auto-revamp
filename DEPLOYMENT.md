# RR Auto Revamp — Full Deployment Guide

## Step 1 — Push code to GitHub

```bash
git init
git add .
git commit -m "Initial commit — RR Auto Revamp"
```

Create a repo at github.com, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/rr-auto-revamp.git
git push -u origin main
```

## Step 2 — Connect Neon Database

Your Neon connection string:
```
postgresql://neondb_owner:npg_HbqKUWB24XiQ@ep-morning-dawn-anjhh5sc.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require
```

Run schema push locally first:
```powershell
# Set the real DB URL temporarily
$env:DATABASE_URL="postgresql://neondb_owner:npg_HbqKUWB24XiQ@ep-morning-dawn-anjhh5sc.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
npx prisma db push
npx tsx prisma/seed.ts
```

## Step 3 — Deploy to Vercel

1. Go to vercel.com → New Project → Import your GitHub repo
2. Framework: Next.js (auto-detected)
3. Add these Environment Variables in Vercel dashboard:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_HbqKUWB24XiQ@ep-morning-dawn-anjhh5sc.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | `rr-auto-revamp-production-secret-change-this-2024` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `RR Auto Revamp` |
| `ADMIN_EMAIL` | `admin@rrautorevamp.com` |
| `EMAIL_FROM` | `noreply@rrautorevamp.com` |
| `RESEND_API_KEY` | *(get from resend.com — free tier)* |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | *(get from cloudinary.com — free tier)* |
| `CLOUDINARY_API_KEY` | *(from cloudinary.com)* |
| `CLOUDINARY_API_SECRET` | *(from cloudinary.com)* |

4. Click Deploy

## Step 4 — After Deploy

Visit `https://your-app.vercel.app/login`
- Email: `admin@rrautorevamp.com`
- Password: `Admin@123!`

## Local Development with Real DB

Update `.env` with your Neon URL:
```env
DATABASE_URL="postgresql://neondb_owner:npg_HbqKUWB24XiQ@ep-morning-dawn-anjhh5sc.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="rr-auto-revamp-super-secret-jwt-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Then:
```powershell
npm run db:push
npm run db:seed
npm run dev
```
