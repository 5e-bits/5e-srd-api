import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Feat2024, FeatPrerequisites2024 } from '@/models/2024/feat'

const FEAT_TYPES = ['origin', 'general', 'fighting-style', 'epic-boon'] as const

export const featPrerequisitesFactory = Factory.define<FeatPrerequisites2024>(() => ({
  minimum_level: faker.number.int({ min: 1, max: 20 })
}))

export const featFactory = Factory.define<Feat2024>(({ sequence }) => {
  const name = `Feat ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index,
    name,
    description: faker.lorem.paragraph(),
    type: faker.helpers.arrayElement(FEAT_TYPES),
    url: `/api/2024/feats/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
