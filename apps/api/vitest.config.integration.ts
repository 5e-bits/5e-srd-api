import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Share one app/module graph per worker instead of rebuilding the GraphQL schema per file.
    isolate: false,
    // Files share one rate limiter without isolation, so lift the cap that would 429.
    env: { RATE_LIMIT_MAX: '1000000' },
    include: ['src/tests/integration/**/*.itest.ts'],
    // DB, cache and server startup can be slow
    testTimeout: 20000,
    hookTimeout: 30000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
