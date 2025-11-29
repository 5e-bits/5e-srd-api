import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Cost, Equipment2024, Range, ThrowRange } from '@/models/2024/equipment'

import { apiReferenceFactory, createIndex, damageFactory } from './common.factory'

// --- Sub-factories ---

const costFactory = Factory.define<Cost>(() => ({
  quantity: faker.number.int({ min: 1, max: 1000 }),
  unit: faker.helpers.arrayElement(['cp', 'sp', 'gp'])
}))

const rangeFactory = Factory.define<Range>(() => ({
  normal: faker.number.int({ min: 5, max: 100 }),
  long: faker.number.int({ min: 10, max: 200 })
}))

const throwRangeFactory = Factory.define<ThrowRange>(() => ({
  normal: faker.number.int({ min: 5, max: 30 }),
  long: faker.number.int({ min: 31, max: 120 })
}))

// --- Main Equipment Factory ---
export const equipmentFactory = Factory.define<Equipment2024>(({ sequence, params }) => {
  const name = params.name ?? `Equipment ${sequence} - ${faker.commerce.productName()}`
  const index = createIndex(name)

  return {
    index,
    name,
    description: [faker.lorem.sentence()],
    equipment_categories: apiReferenceFactory.buildList(
      1,
      {},
      { transient: { resource: 'equipment-categories' } }
    ),
    cost: costFactory.build(),
    url: `/api/2024/equipment/${index}`,
    updated_at: faker.date.recent().toISOString(),

    // Optional fields - should be added by specific tests
    ammunition: undefined,
    weight: undefined,
    damage: undefined,
    image: undefined,
    mastery: undefined,
    notes: undefined,
    properties: undefined,
    quantity: undefined,
    range: undefined,
    throw_range: undefined,
    two_handed_damage: undefined
  }
})

// --- Specific Equipment Type Builders ---

export const weaponFactory = equipmentFactory.params({
  damage: damageFactory.build(),
  range: rangeFactory.build(),
  properties: apiReferenceFactory.buildList(
    2,
    {},
    { transient: { resource: 'weapon-properties' } }
  ),
  weight: faker.number.int({ min: 1, max: 20 })
})

export const armorFactory = equipmentFactory.params({
  weight: faker.number.int({ min: 10, max: 65 }),
  properties: apiReferenceFactory.buildList(1, {}, { transient: { resource: 'armor-properties' } })
})

export const thrownWeaponFactory = weaponFactory.params({
  throw_range: throwRangeFactory.build()
})
