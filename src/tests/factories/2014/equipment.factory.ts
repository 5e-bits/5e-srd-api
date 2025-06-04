import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import {
  ArmorClass,
  Content,
  Cost,
  Equipment,
  Range,
  Speed,
  ThrowRange
} from '@/models/2014/equipment'
import { Damage } from '@/models/common/damage'

import { apiReferenceFactory } from './common.factory'

// --- Sub-factories (Simple defaults/placeholders) ---

const armorClassFactory = Factory.define<ArmorClass>(() => ({
  base: faker.number.int({ min: 10, max: 18 }),
  dex_bonus: faker.datatype.boolean(),
  max_bonus: undefined // Usually optional
}))

const contentFactory = Factory.define<Content>(() => ({
  item: apiReferenceFactory.build(),
  quantity: faker.number.int({ min: 1, max: 10 })
}))

const costFactory = Factory.define<Cost>(() => ({
  quantity: faker.number.int({ min: 1, max: 1000 }),
  unit: faker.helpers.arrayElement(['cp', 'sp', 'gp'])
}))

const damageFactory = Factory.define<Damage>(() => ({
  damage_dice: `${faker.number.int({ min: 1, max: 2 })}d${faker.helpers.arrayElement([
    4, 6, 8, 10, 12
  ])}`,
  damage_type: apiReferenceFactory.build() // Link to a damage type
}))

const rangeFactory = Factory.define<Range>(() => ({
  normal: faker.number.int({ min: 5, max: 100 }),
  long: undefined // Optional
}))

const speedFactory = Factory.define<Speed>(() => ({
  quantity: faker.number.int({ min: 20, max: 60 }),
  unit: 'ft/round'
}))

const throwRangeFactory = Factory.define<ThrowRange>(() => ({
  normal: faker.number.int({ min: 5, max: 30 }),
  long: faker.number.int({ min: 31, max: 120 })
}))

const twoHandedDamageFactory = Factory.define<Damage>(() => ({
  damage_dice: `${faker.number.int({ min: 1, max: 2 })}d${faker.helpers.arrayElement([
    6, 8, 10, 12
  ])}`,
  damage_type: apiReferenceFactory.build()
}))

// --- Main Equipment Factory ---
export const equipmentFactory = Factory.define<Equipment>(({ sequence, params }) => {
  const name = `Equipment ${sequence} - ${faker.commerce.productName()}`
  const index = name.toLowerCase().replace(/\s+/g, '-')

  return {
    index: index,
    name: name,
    desc: [faker.lorem.sentence()],
    cost: costFactory.build(),
    equipment_category: apiReferenceFactory.build(), // Default category
    url: `/api/equipment/${index}`,
    updated_at: faker.date.recent().toISOString(),

    // Most fields are optional and depend on the equipment type.
    // Defaulting to undefined. Tests must build specific types.
    armor_category: undefined,
    armor_class: armorClassFactory.build(),
    capacity: undefined,
    category_range: undefined,
    contents: contentFactory.buildList(1),
    damage: damageFactory.build(),
    gear_category: undefined,
    image: params.image ?? `/images/equipment/${index}.png`,
    properties: apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 3 })),
    quantity: undefined,
    range: rangeFactory.build(),
    special: undefined,
    speed: speedFactory.build(),
    stealth_disadvantage: undefined,
    str_minimum: undefined,
    throw_range: throwRangeFactory.build(),
    tool_category: undefined,
    two_handed_damage: twoHandedDamageFactory.build(),
    vehicle_category: undefined,
    weapon_category: undefined,
    weapon_range: undefined,
    weight: undefined
  }
})
