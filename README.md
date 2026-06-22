# SkillForge AI

AI-powered learning platform with course catalog, dashboards, and an intelligent chat tutor.

## Structure

```
SkillForge AI/
├── apps/web/          # Next.js frontend
├── apps/api/          # Express REST API
└── packages/shared/   # Shared types & Zod schemas
```

## Quick Start

1. Copy environment files:
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run dev servers (web + api):
   ```bash
   npm run dev
   ```

- Web: http://localhost:3000
- API: http://localhost:4000

## Environment Variables

See `apps/api/.env.example` and `apps/web/.env.example`.
