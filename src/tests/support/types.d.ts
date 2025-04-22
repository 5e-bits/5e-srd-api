import { vi } from 'vitest'

export type MockResponse = {
  status?: vi.Mock<any, any>
  json?: vi.Mock<any, any>
}
