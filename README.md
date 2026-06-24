# SkillForge AI

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://skill-forge-ai-api.vercel.app/)

SkillForge AI is a learning platform with a split frontend/backend architecture: course browsing, dashboard analytics, role-based admin pages, and an AI tutor chat assistant.

Live demo: <https://skill-forge-ai-api.vercel.app/>

## Project Overview

SkillForge AI includes:

- `apps/web/` — Next.js 15 frontend with Clerk authentication and role-specific dashboard navigation.
- `apps/api/` — Express API backend with OpenAI integration and Clerk-protected routes.
- `packages/shared/` — Shared TypeScript definitions and Zod validation schemas used by both apps.

Users can browse courses, review details, chat with an AI tutor, and manage their profile.
Admins and managers have access to a dedicated dashboard with course, review, user, analytics, and settings sections.

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

Note: This repository is deployed publicly at the Live demo link above. Do NOT commit API keys or secret values to the repository. If you find secrets in the repository, rotate them immediately.

## Setup Instructions

### 1. Install dependencies

From the repository root:

```bash
npm install
```

### 2. Create local environment files

This repo does not include committed example env files. Create local env files for each app from the template below.

Create `apps/api/.env` (example):

```
PORT=4000
NODE_ENV=development
MONGODB_URI=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
WEB_URL=http://localhost:3000
```

Create `apps/web/.env.local` (example):

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Configure environment variables

Update the following values in the copied files:

- `apps/api/.env`
    - `PORT` (default: `4000`)
    - `NODE_ENV` (default: `development`)
    - `MONGODB_URI` (optional)
    - `OPENAI_API_KEY` (required for AI features)
    - `OPENAI_MODEL` (recommended: `gpt-4o-mini`)
    - `CLERK_PUBLISHABLE_KEY` (Clerk)
    - `CLERK_SECRET_KEY` (Clerk)
    - `WEB_URL` (frontend origin, default: `http://localhost:3000`)

- `apps/web/.env.local`
    - `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000`)
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`
    - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (default: `/sign-in`)
    - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (default: `/sign-up`)
    - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` (default: `/dashboard`)
    - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` (default: `/dashboard`)

Security: Keep these files out of version control. Add `apps/api/.env` and `apps/web/.env.local` to `.gitignore` if not already ignored.

### 4. Run development servers

Start both apps from the workspace root:

```bash
npm run dev
```

The root `npm run dev` command uses `scripts/dev.js` to find available ports automatically and sets `NEXT_PUBLIC_API_URL` for the web app.

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

## API Endpoints

Base API: `http://localhost:4000` (or the `NEXT_PUBLIC_API_URL` you configure)

- AI endpoints (prefixed with `/ai`):
    - `POST /ai/chat` — server-sent-events chat stream (authenticated)
    - `GET /ai/chat/:conversationId` — fetch conversation history
    - `POST /ai/generate-content` — generate course content (topic/level/category)
    - `POST /ai/recommendations` — generate course recommendations (authenticated)
    - `GET /ai/learning-insights` — generate learning insights for the current user (authenticated)

- Course endpoints (prefixed with `/courses`):
    - `GET /courses` — query and list courses
    - `GET /courses/stats` — dashboard stats
    - `GET /courses/enrolled` — enrolled courses (authenticated)
    - `GET /courses/:slug` — course details, reviews, related
    - `POST /courses/:slug/enroll` — enroll in course (authenticated)

Example curl (generate content):

```bash
curl -X POST http://localhost:4000/ai/generate-content \
    -H "Content-Type: application/json" \
    -d '{"topic":"React hooks","level":"beginner","category":"frontend"}'
```

## Demo Credentials

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

## Deployment (Vercel)

The project is deployed at the Live demo link above. To deploy yourself:

1. Connect the repository to Vercel (or Git provider).
2. In the Vercel project settings, set the required environment variables for the API and the web app (`OPENAI_API_KEY`, Clerk keys, etc.).
3. For monorepos you can create two Vercel projects: one for `apps/web` (Next.js) and one for `apps/api` (Node/Serverless). Set the project root accordingly.

If you prefer a single project, ensure the build command runs the workspace build and the correct output is served.

## Contributing

Contributions welcome — open an issue or PR. Please:

- Avoid committing secrets.
- Add minimal, focused PRs with a clear description and testing steps.

## License & Contact

This project does not currently include a license file. Add a `LICENSE` file if you intend to open-source it.

For questions or to report a problem, open an issue or contact the maintainers.

## Directory Layout

```text
SkillForge AI/
├── apps/web/          # Next.js frontend application
├── apps/api/          # Express backend API
└── packages/shared/   # Shared schemas and types
```
