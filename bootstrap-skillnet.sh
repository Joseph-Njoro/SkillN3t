#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${PWD}/skillnet"
echo "Creating SkillNet monorepo at: $ROOT_DIR"

# helper
mk() { mkdir -p "$1"; echo "mkdir -p $1"; }

# Create folder structure
mk "$ROOT_DIR/apps/backend"
mk "$ROOT_DIR/apps/frontend"
mk "$ROOT_DIR/packages/shared"
mk "$ROOT_DIR/.github/workflows"
mk "$ROOT_DIR/docker"
mk "$ROOT_DIR/scripts"

# Initialize git
cd "$ROOT_DIR"
git init -q
echo "Initialized git repo."

# Root package.json (pnpm workspace)
cat > package.json <<'JSON'
{
  "name": "skillnet",
  "private": true,
  "version": "0.0.0",
  "description": "SkillNet monorepo",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "bootstrap": "pnpm install",
    "postinstall": "pnpm -w -r run prepare || true",
    "prepare": "husky install || true"
  },
  "devDependencies": {}
}
JSON
echo "Wrote package.json"

# docker-compose.yml (at repo root)
cat > docker-compose.yml <<'DC'
version: '3.8'

services:
  mongo:
    image: mongo:6.0.6
    container_name: skillnet-db
    command: ["mongod", "--nojournal"]
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
DC
echo "Wrote docker-compose.yml"

# .env.example
cat > .env.example <<'ENV'
# SkillNet .env.example
# Copy to .env/local or .env.development and fill the values.

# NODE
NODE_ENV=development
PORT=5000

# Mongo
MONGO_URI=mongodb://localhost:27017/skillnet_dev

# Auth: Clerk
USE_CLERK=true
CLERK_PUBLISHABLE_KEY=pk.your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk.your_clerk_secret_key_here

# Local JWT fallback (used when USE_CLERK=false)
JWT_SECRET=super_secret_jwt_key_change_me
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
ENV

echo "Wrote .env.example"

# README skeleton
cat > README.md <<'MD'
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

MD
echo "Wrote README.md"

# apps/backend package.json
cat > apps/backend/package.json <<'JSON'
{
  "name": "@skillnet/backend",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start:dev": "ts-node-dev --respawn --transpile-only src/main.ts",
    "start": "node dist/main.js",
    "build": "tsc -p tsconfig.build.json",
    "lint": "eslint \"src/**/*.{ts,js}\" --fix",
    "seed": "ts-node -r tsconfig-paths/register scripts/seed.ts"
  },
  "dependencies": {},
  "devDependencies": {}
}
JSON
echo "Wrote apps/backend/package.json"

# apps/frontend package.json
cat > apps/frontend/package.json <<'JSON'
{
  "name": "@skillnet/frontend",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint \"src/**/*.{ts,tsx,js,jsx}\" --fix"
  },
  "dependencies": {},
  "devDependencies": {}
}
JSON
echo "Wrote apps/frontend/package.json"

# packages/shared package.json
cat > packages/shared/package.json <<'JSON'
{
  "name": "@skillnet/shared",
  "version": "0.0.0",
  "private": true,
  "main": "index.ts"
}
JSON
echo "Wrote packages/shared/package.json"

# BOOTSTRAP instructions file
cat > docs_BOOTSTRAP.md <<'TXT'
BOOTSTRAP INSTRUCTIONS (read after running bootstrap-skillnet.sh)

1) Install pnpm (if not present)
   npm i -g pnpm

2) From repo root:
   pnpm install

3) Create backend scaffold (non-interactive recommended approach):
   npx @nestjs/cli new apps/backend --package-manager pnpm --skip-install --strict

   OR if you prefer manual:
   cd apps/backend
   pnpm init -y
   pnpm add -D typescript ts-node-dev @types/node
   Create src/ & tsconfig files.

4) Create frontend scaffold:
   npm create vite@latest apps/frontend -- --template react-ts
   cd apps/frontend
   pnpm install
   pnpm add -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

5) After scaffolds are created run:
   pnpm -w install

6) Start services:
   docker compose up -d
   cd apps/backend && pnpm run start:dev
   cd apps/frontend && pnpm run dev

TXT

echo "Wrote bootstrap instructions (docs_BOOTSTRAP.md)"

# Git ignore
cat > .gitignore <<'GIT'
node_modules
dist
.env*
.vscode
.DS_Store
coverage
GIT
echo "Wrote .gitignore"

# Create placeholder README in apps/backend and apps/frontend
echo "# Backend (NestJS) - implement after bootstrap" > apps/backend/README.md
echo "# Frontend (Vite + React + TS) - implement after bootstrap" > apps/frontend/README.md

# Make initial commit
git add -A
git commit -m "chore: bootstrap monorepo structure (skillnet)" || true

echo "Bootstrap complete. Next steps written to docs_BOOTSTRAP.md"
echo
echo "Run: cd $ROOT_DIR && pnpm install"
