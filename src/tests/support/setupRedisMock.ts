import { jest } from '@jest/globals'

jest.mock('redis', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    set: () => Promise.resolve(),
    get: () => Promise.resolve(null)
  }))
}))
