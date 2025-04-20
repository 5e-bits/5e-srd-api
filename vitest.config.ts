import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true, // Optional: Use Vitest global APIs (describe, it, etc.) without importing
    environment: 'node', // Specify Node.js environment
    globalSetup: ['./src/tests/globalSetup.ts'], // Path to the global setup file
    // Optional: Increase timeouts if global setup takes longer
    // setupFiles: [], // If you have per-file setup needed
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
