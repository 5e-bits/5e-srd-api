import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config' // Assuming base config is in the root

export default mergeConfig(
  baseConfig, // Extend the base config
  defineConfig({
    test: {
      // Specify options specific to integration tests
      include: ['src/tests/integration/**/*.itest.ts'],
      // Exclude unit tests if necessary, although 'include' should suffice
      // exclude: ['src/tests/unit/**/*.test.ts'],
      globalSetup: './src/tests/integration/globalSetup.ts',
      // Consider longer timeouts for integration tests involving DB/network/server startup
      testTimeout: 20000,
      hookTimeout: 30000, // Timeout for globalSetup/teardown
      // Ensure Node.js environment for server-side tests
      environment: 'node'
      // Ensure mocks are cleared between tests if needed (afterEach is often preferred)
      // clearMocks: true,
      // If your global setup needs specific env variables:
      // env: {
      //   NODE_ENV: 'test'
      // },
      // Turn off globals if you prefer explicit imports in every test file
      // globals: false
    }
    // You can add other top-level config overrides if needed
    // e.g., resolve: { alias: { ... } }
  })
)
