import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Subclass2024, SubclassFeature2024 } from '@/models/2024/subclass'

export const subclassFeatureFactory = Factory.define<SubclassFeature2024>(() => ({
  name: faker.lorem.words(3),
  level: faker.number.int({ min: 1, max: 20 }),
  description: faker.lorem.paragraph()
}))

export const subclassFactory = Factory.define<Subclass2024>(({ sequence }) => {
  const name = `Subclass ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index,
    name,
    summary: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    features: subclassFeatureFactory.buildList(2),
    url: `/api/2024/subclasses/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
