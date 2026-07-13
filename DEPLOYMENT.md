# Star Stitcher V2: Deployment Guide

This document describes how to deploy the backend to Render and the frontend to Vercel.

---

## 1. Supabase Setup (Database & Storage)

1. Create a project at [Supabase](https://supabase.com).
2. Go to **Project Settings > Database** and copy the **Transaction Connection String** (`Pooler` mode) or **Direct Connection String** for Prisma.
3. In the Supabase storage tab, create a public bucket named `designs` (or update your config bucket name) to store uploads.

---

## 2. Backend Deployment (Render)

1. Sign in to [Render](https://render.com).
2. Click **New > Web Service** and link your backend Git repository (`star-stitcher-backend`).
3. Set the following environment configurations:
   * **Runtime:** Node
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start:prod`
4. Register all backend environment variables listed in [ENVIRONMENT.md](file:///d:/Learn/Cursor/Star/ENVIRONMENT.md).
5. Render will automatically build the NestJS server and generate the production bundle.

---

## 3. Frontend Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com).
2. Click **Add New > Project** and link your frontend Git repository (`star-stitcher-frontend`).
3. Configure the settings:
   * **Framework Preset:** Next.js
   * **Build Command:** `next build`
   * **Output Directory:** `.next`
4. Register the frontend environment variables, particularly:
   * `NEXT_PUBLIC_API_URL`: pointing to your live Render server address (e.g. `https://star-stitcher-api.onrender.com/api/v1`).
5. Click **Deploy**. Vercel will build the Next.js static pages and host them globally.

---

## 4. Health Checks & Verification
* After both builds complete, check the backend status route: `https://your-backend.onrender.com/api/v1/health` (should return `{"status":"ok"}`).
* Ensure the frontend domain displays the live landing page. Try logging in and creating a test scheduling slot to verify end-to-end integration.
