import path from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Optional: Use Vitest global APIs (describe, it, etc.) without importing
    environment: 'node', // Specify Node.js environment
    globalSetup: ['./src/tests/controllers/globalSetup.ts'], // Path to the global setup file
    // maxConcurrency: 1, // Removed - Use DB isolation for parallelism
    // Optional: Increase timeouts if global setup takes longer
    setupFiles: ['./src/tests/vitest.setup.ts'],
    // testTimeout: 30000,
    // hookTimeout: 30000,
    deps: {
      // Remove optimizer settings related to factory-js
      optimizer: {
        ssr: {
          include: [] // Keep the structure but empty the array
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
