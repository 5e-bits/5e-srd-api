import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Feature2024 } from '@/models/2024/feature'
import { APIReference } from '@/models/common/apiReference'

const apiReferenceFactory = Factory.define<APIReference>(() => ({
  index: faker.lorem.slug(),
  name: faker.lorem.words(2),
  url: `/api/2024/${faker.lorem.slug()}`
}))

export const featureFactory = Factory.define<Feature2024>(({ sequence }) => {
  const name = `Feature ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index,
    name,
    description: faker.lorem.paragraph(),
    level: apiReferenceFactory.build({
      index: `class-${sequence}`,
      name: `Class ${sequence}`,
      url: `/api/2024/levels/class-${sequence}`
    }),
    class: apiReferenceFactory.build({
      index: `class-${sequence}`,
      name: `Class ${sequence}`,
      url: `/api/2024/classes/class-${sequence}`
    }),
    url: `/api/2024/features/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
