import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { Spell, SpellDamage, SpellDC, SpellHealAtSlotLevel } from '@/models/2014/spell'
import { apiReferenceFactory, areaOfEffectFactory, difficultyClassFactory } from './common.factory'

// --- Sub-factories (Placeholders/Simple Defaults) ---
const spellDamageFactory = Factory.define<SpellDamage>(() => ({
  // Defaulting to undefined. Tests needing damage must build it.
  damage_type: undefined,
  damage_at_slot_level: undefined,
  damage_at_character_level: undefined
}))

const spellDcFactory = Factory.define<SpellDC>(() => ({
  dc_type: apiReferenceFactory.build(),
  dc_success: faker.helpers.arrayElement(['none', 'half']),
  desc: undefined // Optional
}))

const spellHealAtSlotLevelFactory = Factory.define<SpellHealAtSlotLevel>(() => ({
  // Requires a map, provide a simple default.
  heal_at_slot_level: new Map([['1', '1d4']])
}))

// --- Main Spell Factory ---
export const spellFactory = Factory.define<Spell>(({ sequence }) => {
  const name = `Spell ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const level = faker.number.int({ min: 0, max: 9 })

  return {
    index: index,
    name: name,
    desc: [faker.lorem.paragraph()],
    level: level,
    attack_type: faker.datatype.boolean(),
    ritual: faker.datatype.boolean(),
    duration: faker.helpers.arrayElement(['Instantaneous', '1 round', '1 minute']),
    concentration: faker.datatype.boolean(),
    components: faker.helpers.arrayElements(['V', 'S', 'M'], faker.number.int({ min: 1, max: 3 })),
    range: faker.helpers.arrayElement(['Self', 'Touch', '60 feet']),
    school: apiReferenceFactory.build(),
    classes: apiReferenceFactory.buildList(faker.number.int({ min: 1, max: 2 })),
    subclasses: apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 1 })),
    url: `/api/spells/${index}`,
    updated_at: faker.date.recent().toISOString(),

    // Optional/Complex fields - Defaulted to undefined or simple placeholders
    // Tests needing specific values must override.
    higher_level: undefined,
    material: undefined,
    damage: undefined, // spellDamageFactory.build(),
    dc: undefined, // spellDcFactory.build(),
    heal_at_slot_level: undefined, // spellHealAtSlotLevelFactory.build(),
    area_of_effect: undefined // areaOfEffectFactory.build(),
  }
})
