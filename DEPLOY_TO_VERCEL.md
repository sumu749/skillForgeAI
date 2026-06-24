# Vercel Deployment Guide

## Quick summary

- Set the project root to the repository root and use the root `vercel-build` command so the `@skillforge/shared` package is built before the Next.js app.

## Recommended Vercel settings

- Project Root: `/` (repository root)
- Install Command: `npm ci` (or leave default `npm install`)
- Build Command: `npm run vercel-build`
- Output Directory: leave empty
- Framework Preset: Next.js

## Why this is required

- `@skillforge/shared` is a workspace package located in `packages/shared` and compiles to `packages/shared/dist`.
- Next.js in `apps/web` imports `@skillforge/shared`. Vercel must see the compiled JS in `dist` before running `next build`.
- Running `npm run vercel-build` at the repo root builds `@skillforge/shared` first, then runs the web build.

## Alternative (if you must use `apps/web` as Project Root)

- Project Root: `apps/web`
- Build Command: `npm run prevercel-build && npm run vercel-build`
    - `prevercel-build` runs `npm run build -w @skillforge/shared` (ensures `dist` exists)

## Local checks before deploy

1. From repo root build everything locally:

```bash
npm run vercel-build
```

2. Confirm `packages/shared/dist` exists:

```bash
ls packages/shared/dist
```

## Environment variables

- Add any `.env.*` values used by the app in the Vercel dashboard under Project Settings  Environment Variables.

## If you prefer CI automation

- Keep the root `postinstall` script (already added) to build `@skillforge/shared` during installs.
- Or add a CI step that runs `npm run build -w @skillforge/shared` before `next build`.

## Troubleshooting

- Error "Module not found: Can't resolve '@skillforge/shared'": means `dist` is missing. Ensure the shared package was built first.
- Check Vercel build logs for the order of commands and any TypeScript/tsc errors from `packages/shared`.

## Need help?

If you want, I can: commit a short README in the Vercel project settings, or prepare a GitHub Action to run the root build before deploy.
