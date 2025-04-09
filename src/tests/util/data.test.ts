import { ClassAPIResource, ResourceList } from '@/util/data.js';

describe('ClassAPIResource', () => {
  it('returns a constructed hash from list', () => {
    const data = [
      {
        index: 'test1',
        class: {
          name: 'Test 1',
        },
        url: '/made/up/url/test1',
      },
      {
        index: 'test2',
        class: {
          name: 'Test 2',
        },
        url: '/made/up/url/test2',
      },
      {
        index: 'test2',
        class: {
          name: 'Test 2',
        },
        url: '/made/up/url/test2',
      },
    ];
    const expectedData = [
      {
        index: 'test1',
        class: 'Test 1',
        url: '/made/up/url/test1',
      },
      {
        index: 'test2',
        class: 'Test 2',
        url: '/made/up/url/test2',
      },
      {
        index: 'test2',
        class: 'Test 2',
        url: '/made/up/url/test2',
      },
    ];
    const resource = ClassAPIResource(data);
    expect(resource.count).toEqual(data.length);
    expect(resource.results).toEqual(expectedData);
  });
});

describe('ResourceList', () => {
  it('returns a constructed hash from list', () => {
    const data = [
      {
        index: 'test1',
        name: 'Test 1',
        url: '/made/up/url/test1',
      },
      {
        index: 'test2',
        name: 'Test 2',
        url: '/made/up/url/test2',
      },
      {
        index: 'test2',
        name: 'Test 2',
        url: '/made/up/url/test2',
      },
    ];
    const resource = ResourceList(data);
    expect(resource.count).toEqual(data.length);
    expect(resource.results).toEqual(data);
  });
});
