import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { apiReferenceFactory, createIndex, createUrl } from './common.factory' // Import common factory for APIReference and choiceFactory

import type { Feat, Prerequisite } from '@/models/2014/feat'

// --- Prerequisite Factory ---
const prerequisiteFactory = Factory.define<Prerequisite>(({ params }) => {
  // Build dependency first
  const builtApiRef = apiReferenceFactory.build(params.ability_score)
  return {
    // Explicitly construct the object
    ability_score: {
      index: builtApiRef.index,
      name: builtApiRef.name,
      url: builtApiRef.url
    },
    minimum_score: params.minimum_score ?? faker.number.int({ min: 8, max: 15 })
  }
})

// --- Feat Factory ---
export const featFactory = Factory.define<Omit<Feat, '_id' | 'collectionName'>>(
  ({ sequence, params }) => {
    const name = params.name ?? `${faker.word.adjective()} Feat ${sequence}`
    const index = params.index ?? createIndex(name)

    // Explicitly build a list of Prerequisite objects
    const prerequisites =
      params.prerequisites ?? prerequisiteFactory.buildList(faker.number.int({ min: 0, max: 1 }))

    return {
      index,
      name,
      prerequisites: prerequisites.map((p) => ({
        // Ensure the array type is correct
        ability_score: p.ability_score,
        minimum_score: p.minimum_score
      })),
      desc: params.desc ?? [faker.lorem.paragraph()],
      url: params.url ?? createUrl('feats', index),
      updated_at: params.updated_at ?? faker.date.past().toISOString()
    }
  }
)
