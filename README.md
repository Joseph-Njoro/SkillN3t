# SkillNet (monorepo)

Monorepo structure for SkillNet — MERN + TypeScript.  
This repo contains:

- apps/backend — NestJS backend (TypeScript, modular DDD-lite)
- apps/frontend — React + Vite + TypeScript + Tailwind
- packages/shared — shared DTOs and validation (Zod)

## Quickstart

1. Copy `.env.example` → `.env.local` and update values.
2. Start local mongo: `docker compose up -d`
3. Bootstrap workspace: `pnpm install` (or `npm i -g pnpm && pnpm install`)
4. Initialize backend & frontend scaffolds (see docs in docs/BOOTSTRAP.md)

# Terminal B: start backend (after Nest scaffold + install)
cd skillnet/apps/backend
pnpm run start:dev

# Terminal C: start frontend
cd skillnet/apps/frontend
pnpm run dev

# Monorepo-wide prepare (Husky, lint-staged):
pnpm -w run prepare

