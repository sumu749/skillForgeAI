# SkillForge AI

SkillForge AI is a local development learning platform built with a split frontend/backend architecture. It combines course browsing, dashboard analytics, role-based admin pages, and an AI tutor chat assistant.

> Note: This repository is built for local development only. There is no live deployment on Vercel, Render, or other public hosting.

## Project Overview

SkillForge AI includes:

- `apps/web/` — Next.js 15 frontend with Clerk authentication and role-specific dashboard navigation.
- `apps/api/` — Express API backend with OpenAI integration and Clerk-protected routes.
- `packages/shared/` — Shared TypeScript definitions and Zod validation schemas used by both apps.

Users can browse courses, review details, chat with an AI tutor, and manage their profile.
Admins and managers have access to a dedicated platform dashboard with course, review, user, analytics, and settings sections.

## Tech Stack

- Frontend
    - Next.js 15
    - React 19
    - Tailwind CSS
    - Clerk authentication (`@clerk/nextjs`)
    - React Query
    - Recharts for dashboard charts

- Backend
    - Express
    - Clerk authentication middleware (`@clerk/express`)
    - OpenAI SDK
    - Mongoose / MongoDB optional persistence
    - JSON fallback storage for local development

- Shared
    - TypeScript
    - Zod schemas

## AI Features

SkillForge AI exposes an intelligent chat tutor experience that helps users with learning support, course recommendations, and study guidance.

- AI Tutor chat is powered by OpenAI via the backend API.
- AI course recommendations are delivered through the tutor experience and dashboard context.
- The backend reads `OPENAI_API_KEY` and `OPENAI_MODEL` from environment variables.
- The chat feature is available through the dashboard UI when users are signed in.

## Setup Instructions

### 1. Install dependencies

From the repository root:

```bash
npm install
```

### 2. Create local environment files

Copy the example env files for both apps:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### 3. Configure environment variables

Update the following values in the copied files:

- `apps/api/.env`
    - `OPENAI_API_KEY`
    - `OPENAI_MODEL`
    - `CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
    - `MONGODB_URI` (optional)

- `apps/web/.env.local`
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`

If MongoDB is not available, the backend can run with JSON fallback storage instead.

### 4. Run development servers

Start both apps from the workspace root:

```bash
npm run dev
```

Or run them individually:

```bash
npm run dev:web
npm run dev:api
```

- Web: `http://localhost:3000`
- API: `http://localhost:4000`

### 5. Seed demo data (optional)

If you want to populate the API with sample courses and reviews, run:

```bash
npm run seed -w @skillforge/api
```

## Demo Credentials

The app includes a built-in developer demo flow for sign-in.

- Email: `demo@skillforge.ai`
- Password: `DemoPass123!`

If Clerk is not configured, the app still allows local dashboard access in development mode with the fallback UI.

## Notes

- Clerk authentication is required for the dashboard and protected API routes.
- AI chat requires a valid OpenAI API key.
- There is no public live deployment for this project.

## Useful Commands

```bash
npm install
npm run dev
npm run dev:web
npm run dev:api
npm run build
npm run lint -w @skillforge/web
npm run seed -w @skillforge/api
```

## Directory Layout

```text
SkillForge AI/
├── apps/web/          # Next.js frontend application
├── apps/api/          # Express backend API
└── packages/shared/   # Shared schemas and types
```
