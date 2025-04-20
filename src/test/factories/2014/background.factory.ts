import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { Background, EquipmentRef } from '@/models/2014/background'
import { apiReferenceFactory, choiceFactory } from './common.factory'

// EquipmentRef factory - NO SPREAD
const equipmentRefFactory = Factory.define<EquipmentRef>(() => ({
  equipment: apiReferenceFactory.build(),
  quantity: faker.number.int({ min: 1, max: 5 })
}))

// Feature factory - NO SPREAD
// Cannot name this Feature due to conflict with built-in Feature type
const backgroundFeatureFactory = Factory.define<Background['feature']>(() => ({
  name: faker.lorem.words(3),
  desc: [faker.lorem.paragraph()]
}))

// Main Background factory - NO SPREAD & USING COMMON FACTORIES
export const backgroundFactory = Factory.define<Background>(({ sequence, params }) => {
  const name = params.name ?? `Background ${sequence}`
  const index = params.index ?? name.toLowerCase().replace(/\s+/g, '-')

  // Return object with defaults. Complex overrides require manual construction
  // or passing deep overrides to .build()
  return {
    index: index,
    name: name,
    starting_proficiencies: apiReferenceFactory.buildList(2),
    language_options: choiceFactory.build(),
    url: `/api/backgrounds/${index}`,
    starting_equipment: equipmentRefFactory.buildList(1),
    starting_equipment_options: choiceFactory.buildList(1),
    feature: backgroundFeatureFactory.build(),
    personality_traits: choiceFactory.build(),
    ideals: choiceFactory.build(),
    bonds: choiceFactory.build(),
    flaws: choiceFactory.build(),
    updated_at: faker.date.recent().toISOString()
  }
})
