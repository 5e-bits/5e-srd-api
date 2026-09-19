import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import {
  Feature,
  FeaturePrerequisite,
  FeatureSpecific,
  LevelPrerequisite,
  SpellPrerequisite
} from '@/models/2014/feature'

import { apiReferenceFactory, choiceFactory } from './common.factory'

// --- Sub-factories ---

const levelPrerequisiteFactory = Factory.define<LevelPrerequisite>(() => ({
  type: 'level',
  level: faker.number.int({ min: 1, max: 20 })
}))

const featurePrerequisiteFactory = Factory.define<FeaturePrerequisite>(() => ({
  type: 'feature',
  feature: `/api/features/${faker.lorem.slug()}` // Example feature URL
}))

const spellPrerequisiteFactory = Factory.define<SpellPrerequisite>(() => ({
  type: 'spell',
  spell: `/api/spells/${faker.lorem.slug()}` // Example spell URL
}))

// Basic placeholder for FeatureSpecific - tests needing details should build manually
const featureSpecificFactory = Factory.define<FeatureSpecific>(() => ({
  subfeature_options: choiceFactory.build(),
  expertise_options: choiceFactory.build(),
  invocations: apiReferenceFactory.buildList(1)
}))

// --- Main Feature Factory ---
export const featureFactory = Factory.define<Feature>(({ sequence }) => {
  const name = `Feature ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const level = faker.number.int({ min: 1, max: 20 })

  return {
    index: index,
    name: name,
    level: level,
    class: apiReferenceFactory.build(), // Link to a class by default
    desc: [faker.lorem.paragraph()],
    url: `/api/features/${index}`,
    updated_at: faker.date.recent().toISOString(),

    // Optional fields defaulted to undefined
    prerequisites: [
      levelPrerequisiteFactory.build(),
      featurePrerequisiteFactory.build(),
      spellPrerequisiteFactory.build()
    ], // Default to no prerequisites
    parent: undefined,
    subclass: undefined,
    feature_specific: featureSpecificFactory.build(),
    reference: undefined
  }
})
