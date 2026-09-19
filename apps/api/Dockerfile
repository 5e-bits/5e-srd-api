# ---- Builder Stage ----
FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@12.4.2

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Clean existing node_modules just in case of Docker layer caching weirdness.
# Then run `pnpm install --frozen-lockfile` which is generally recommended for CI/Docker.
RUN rm -rf node_modules
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
# .dockerignore will handle exclusions like node_modules, dist, etc.
COPY . .

# Build the application
# This uses tsconfig.json to output to ./dist
RUN pnpm run build

# ---- Final Stage ----
FROM node:24-alpine

WORKDIR /app

# pnpm (unlike npm) isn't bundled with the node image; test:integration:local
# execs `pnpm run test:integration` inside this final-stage container.
RUN npm install -g pnpm@12.4.2

# Copy package.json and lock file (good practice)
COPY package.json ./
COPY pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml* ./

# Copy node_modules from builder stage - this includes all dependencies with scripts run
COPY --from=builder /app/node_modules ./node_modules/

# Set environment to production AFTER dependencies are in place
ENV NODE_ENV=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist/

# Copy entire source tree (needed for tests and potentially other runtime file access)
COPY --from=builder /app/src ./src/

# Copy config files needed for tests/runtime
COPY --from=builder /app/vitest.config*.ts ./
COPY --from=builder /app/tsconfig.json ./

# # Add non-root user for security
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# # Change ownership of app directory to the non-root user AFTER user creation
# RUN chown -R appuser:appgroup /app

# USER appuser

# Expose port (replace 3000 if different)
EXPOSE 3000

# Start the main process.
CMD ["node", "--experimental-specifier-resolution=node", "dist/src/start.js"]
