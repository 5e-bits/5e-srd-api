# ---- Builder Stage ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
# Copy the package-lock.json that was freshly generated on your host
COPY package-lock.json ./

# Clean existing node_modules just in case of Docker layer caching weirdness.
# Then run `npm ci` which is generally recommended for CI/Docker if you have a package-lock.json.
RUN rm -rf node_modules
RUN npm ci

# Copy the rest of the application source code
# .dockerignore will handle exclusions like node_modules, dist, etc.
COPY . .

# Build the application
# This uses tsconfig.json to output to ./dist
RUN npm run build

# ---- Final Stage ----
FROM node:22-alpine

WORKDIR /app

# Copy package.json and lock file (good practice)
COPY package.json ./
COPY package-lock.json* ./

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
