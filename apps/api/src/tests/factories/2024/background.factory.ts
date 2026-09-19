import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Background2024, BackgroundFeatReference } from '@/models/2024/background'

import { apiReferenceFactory } from './common.factory'

export const backgroundFeatReferenceFactory = Factory.define<BackgroundFeatReference>(
  ({ sequence }) => {
    const name = `Feat ${sequence}`
    const index = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return {
      index,
      name,
      url: `/api/2024/feats/${index}`
    }
  }
)

export const backgroundFactory = Factory.define<Background2024>(({ sequence }) => {
  const name = `Background ${sequence} - ${faker.lorem.word()}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index,
    name,
    ability_scores: apiReferenceFactory.buildList(2, {}, { transient: {} }),
    feat: backgroundFeatReferenceFactory.build(),
    proficiencies: apiReferenceFactory.buildList(2, {}, { transient: {} }),
    url: `/api/2024/backgrounds/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
