import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import type { Feat2024, Prerequisite2024 } from '@/models/2024/feat'
import { apiReferenceFactory, createIndex, createUrl } from './common.factory' // Import common factory for APIReference and choiceFactory

// --- Prerequisite Factory ---
const prerequisiteFactory = Factory.define<Prerequisite2024>(({ params }) => {
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
export const featFactory = Factory.define<Omit<Feat2024, '_id' | 'collectionName'>>(
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
