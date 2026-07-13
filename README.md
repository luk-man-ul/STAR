# Star Stitcher V2: Ladies Tailoring Centre

Bespoke custom tailoring application for **Star Stitcher** ladies boutique in Kasaragod, Kerala.

## Technical Architecture Overview

The system is split into two modular repositories:
1. **Frontend (`star-stitcher-frontend`):** Next.js 15 App Router interface integrated with Tailwind CSS, Zustand, and React Query.
2. **Backend (`star-stitcher-backend`):** NestJS REST APIs using Prisma ORM connected to Supabase PostgreSQL and Storage buckets.

---

## Workspace Directory

* `/star-stitcher-frontend`: Client application code.
* `/star-stitcher-backend`: Server application code.
* `/DEPLOYMENT.md`: Continuous integration and hosting configuration guide.
* `/ENVIRONMENT.md`: Environment keys reference.
* `/BACKUP.md`: Database snapshots and recovery guidelines.

---

## Quickstart Instructions

### Prerequisites
* Node.js v18 or later
* npm or yarn
* A running Supabase PostgreSQL project instance

### 1. Set Up Database
Go to the backend repository, duplicate the environment file, and apply schema migrations:
```bash
cd star-stitcher-backend
cp .env.example .env
# Edit DATABASE_URL in .env to point to your Supabase PostgreSQL instance
npx prisma db push
npx prisma db seed
```

### 2. Launch Backend Server
```bash
npm install
npm run start:dev
```
The server starts at `http://localhost:4000/api/v1` with Swagger docs available at `http://localhost:4000/api/docs`.

### 3. Launch Client App
```bash
cd ../star-stitcher-frontend
cp .env.example .env
# Verify NEXT_PUBLIC_API_URL is pointing to the active backend address
npm install
npm run dev
```
The client website starts at `http://localhost:3000`.

---

## Workflow Enforcement & Booking Validation
* Sunday closures are automatically resolved via dynamic weekly hours checks.
* Custom holiday logs block scheduling appointments on specific calendar dates.
* When the business status is changed to `CLOSED` in admin settings, public bookings are disabled and customers are redirected to WhatsApp details.