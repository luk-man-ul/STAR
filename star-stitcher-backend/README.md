# Star Stitcher Backend

The NestJS backend application for the Star Stitcher boutique, managing database access via Prisma, API exposure via Swagger, and core database tables on Supabase PostgreSQL.

## Tech Stack
- NestJS (Strict TypeScript)
- Prisma (ORM client)
- PostgreSQL (Database hosted on Supabase)
- Class Validator & Class Transformer (Payload pipelines)
- Swagger (Auto-generated interactive API docs)

## Getting Started

1. Copy `.env.example` to `.env` and fill in the required parameters:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize/Migrate database schema:
   ```bash
   npx prisma db push
   ```

4. Start development server:
   ```bash
   npm run start:dev
   ```

5. View Swagger documentation at `http://localhost:3000/api/docs`.
