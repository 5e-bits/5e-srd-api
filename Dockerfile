# ---- Builder Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
# .dockerignore will handle exclusions like node_modules, dist, etc.
COPY . .

# Build the application
# This uses tsconfig.json to output to ./dist
RUN npm run build

# ---- Final Stage ----
FROM node:20-alpine

WORKDIR /app

# Copy package files needed for production install
COPY package*.json ./

# Install ALL dependencies (dev included)
RUN npm install --ignore-scripts

# Set environment to production AFTER install for runtime
ENV NODE_ENV=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy entire source tree (needed for tests and potentially other runtime file access)
COPY --from=builder /app/src /app/src

# Copy config files needed for tests/runtime
COPY --from=builder /app/vitest.config*.ts ./
COPY --from=builder /app/tsconfig.json ./

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of app directory to the non-root user AFTER user creation
RUN chown -R appuser:appgroup /app

USER appuser

# Expose port (replace 3000 if different)
EXPOSE 3000

# Start the main process.
CMD ["node", "--experimental-specifier-resolution=node", "dist/src/start.js"]
