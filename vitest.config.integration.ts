import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    // Specify options specific to integration tests
    globals: true, // Keep or remove based on preference
    environment: 'node',
    include: ['src/tests/integration/**/*.itest.ts'],
    // Point ONLY to the integration global setup
    // globalSetup: './src/tests/integration/globalSetup.ts',
    // DO NOT include setupFiles from base config (avoids Redis mock)
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
