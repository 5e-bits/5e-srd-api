# ---- Base Stage ----
FROM node:26-alpine AS base

RUN npm install -g pnpm@12.4.2

# ---- Builder Stage ----
FROM base AS builder

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json

# Clean existing node_modules just in case of Docker layer caching weirdness.
# Then run `pnpm install --frozen-lockfile` which is generally recommended for CI/Docker.
RUN rm -rf node_modules
RUN pnpm install --frozen-lockfile

# Copy the rest of the api package's source code
# .dockerignore will handle exclusions like node_modules, dist, etc.
COPY apps/api ./apps/api

# Build the application
# This uses apps/api/tsconfig.json to output to apps/api/dist
RUN pnpm --filter dnd-5e-srd-api run build

# ---- Final Stage ----
# pnpm comes from the base stage: test:integration:local execs
# `pnpm run test:integration` inside this final-stage container.
FROM base

WORKDIR /app

# Copy the whole installed workspace (node_modules incl. pnpm's symlink
# structure, built dist/, source, and config) from the builder stage in one
# shot -- copying individual subpaths instead breaks pnpm's node_modules
# symlinks between /app/node_modules and /app/apps/api/node_modules.
COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000

WORKDIR /app/apps/api

CMD ["node", "dist/src/start.js"]
