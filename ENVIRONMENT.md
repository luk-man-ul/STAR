# Star Stitcher V2: Environment Variables Reference

This document catalogs all environment parameters needed for production runtimes.

---

## Backend (`star-stitcher-backend/.env`)

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | Prisma PostgreSQL database transaction link | `postgresql://postgres:[pass]@[host]:5432/postgres?pgbouncer=true` |
| `DIRECT_URL` | Direct connection link (for migrations) | `postgresql://postgres:[pass]@[host]:5432/postgres` |
| `SUPABASE_URL` | Supabase project API endpoint URL | `https://yourproject.supabase.co` |
| `SUPABASE_KEY` | Supabase service role secret key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...` |
| `JWT_SECRET` | Secret token to encrypt internal login sessions | `your_custom_production_jwt_secret_phrase` |
| `PORT` | Local server port (defaults to 4000) | `4000` |
| `NODE_ENV` | Mode configuration | `production` |

---

## Frontend (`star-stitcher-frontend/.env.local`)

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Public endpoint pointing to backend API v1 | `https://your-backend.onrender.com/api/v1` |
