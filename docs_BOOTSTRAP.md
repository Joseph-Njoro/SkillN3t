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

