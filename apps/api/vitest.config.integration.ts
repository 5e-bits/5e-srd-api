import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Specify options specific to integration tests
    globals: true, // Keep or remove based on preference
    environment: 'node',
    // Share one app/module graph per worker instead of rebuilding the GraphQL schema per file.
    isolate: false,
    // Files share one rate limiter without isolation, so lift the cap that would 429.
    env: { RATE_LIMIT_MAX: '1000000' },
    include: ['src/tests/integration/**/*.itest.ts'],
    // Consider longer timeouts for integration tests involving DB/network/server startup
    testTimeout: 20000,
    hookTimeout: 30000 // Timeout for globalSetup/teardown
    // Any other specific integration test settings...
  },
  // Copy essential options from base config, like resolve.alias
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
