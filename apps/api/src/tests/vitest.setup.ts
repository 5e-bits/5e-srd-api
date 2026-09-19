import { vi } from 'vitest'

// Mock the entire module that exports redisClient
vi.mock('@/util', async (importOriginal) => {
  // Get the actual module contents
  const actual = await importOriginal<typeof import('@/util')>()

  // Create mock functions for the redisClient methods used in the app
  const mockRedisClient = {
    get: vi.fn().mockResolvedValue(null), // Default mock: cache miss
    set: vi.fn().mockResolvedValue('OK'), // Default mock: successful set
    del: vi.fn().mockResolvedValue(1), // Default mock: successful delete
    on: vi.fn(), // Mock for event listener registration
    // Add common commands used in start.ts or elsewhere
    // Use flushDb usually, but include flushAll if specifically used
    flushDb: vi.fn().mockResolvedValue('OK'),
    flushAll: vi.fn().mockResolvedValue('OK'),
    // Ensure connect/quit are mocked if used during startup/shutdown logic
    connect: vi.fn().mockResolvedValue(undefined),
    quit: vi.fn().mockResolvedValue(undefined),
    isOpen: true // Mock the state property/getter
    // Add mocks for any other redisClient methods your application uses
    // e.g., connect: vi.fn().mockResolvedValue(undefined),
    // e.g., quit: vi.fn().mockResolvedValue(undefined),
    // e.g., isOpen: true, // Or a getter mock: get isOpen() { return true; }
  }

  return {
    ...actual, // Keep all other exports from the original module
    redisClient: mockRedisClient // Replace redisClient with our mock
  }
})

// You can add other global setup logic here if needed, like clearing mocks
// afterEach(() => {
//   vi.clearAllMocks();
// });
