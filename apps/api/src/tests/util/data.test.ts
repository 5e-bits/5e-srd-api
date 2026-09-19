import { describe, expect, it } from 'vitest'

import { ResourceList } from '@/util/data'

describe('ResourceList', () => {
  it('returns a constructed hash from list', () => {
    const data = [
      { index: 'test1', name: 'Test 1', url: '/made/up/url/test1' },
      { index: 'test2', name: 'Test 2', url: '/made/up/url/test2' },
      { index: 'test2', name: 'Test 2', url: '/made/up/url/test2' }
    ]
    const resource = ResourceList(data)
    expect(resource.count).toEqual(data.length)
    expect(resource.results).toEqual(data)
  })
})
