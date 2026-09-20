import { vi } from 'vitest'

// Replace the Redis client with a mock so unit tests never connect
vi.mock('@/util/RedisClient', () => ({
  default: {
    get: vi.fn().mockResolvedValue(null), // Default mock: cache miss
    set: vi.fn().mockResolvedValue('OK'), // Default mock: successful set
    del: vi.fn().mockResolvedValue(1), // Default mock: successful delete
    on: vi.fn(), // Mock for event listener registration
    flushDb: vi.fn().mockResolvedValue('OK'),
    flushAll: vi.fn().mockResolvedValue('OK'),
    connect: vi.fn().mockResolvedValue(undefined),
    quit: vi.fn().mockResolvedValue(undefined),
    isOpen: true
  }
}))

// You can add other global setup logic here if needed, like clearing mocks
// afterEach(() => {
//   vi.clearAllMocks();
// });
