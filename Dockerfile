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

# Set environment to production
ENV NODE_ENV=production

WORKDIR /app

# Copy package files needed for production install
COPY package*.json ./

# Install only production dependencies
RUN npm install --ignore-scripts

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy required non-code assets from the builder stage's source
# to match the paths expected by the code reading from src/
# Specifically, copy the graphql directory containing typeDefs.graphql
COPY --from=builder /app/src/graphql /app/src/graphql

# Add non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose port (replace 3000 if different)
EXPOSE 3000

# Start the main process.
CMD ["node", "--experimental-specifier-resolution=node", "dist/src/start.js"]
