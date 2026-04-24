import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { apiReferenceFactory, difficultyClassFactory } from '@/tests/factories/2024/common.factory'

import type {
  ActionUsage2024,
  LegendaryAction2024,
  Monster2024,
  MonsterAction2024,
  MonsterActionItem2024,
  MonsterArmorClass2024,
  MonsterAttack2024,
  MonsterProficiency2024,
  MonsterSense2024,
  MonsterSpeed2024,
  Reaction2024,
  SpecialAbility2024,
  SpecialAbilityUsage2024,
  SpellcastingSpell2024,
  SpellcastingSpellUsage2024
} from '@/models/2024/monster'

export const monsterSpeedFactory = Factory.define<MonsterSpeed2024>(() => ({
  walk: `${faker.number.int({ min: 20, max: 60 })} ft.`
}))

export const monsterSenseFactory = Factory.define<MonsterSense2024>(() => ({
  passive_perception: faker.number.int({ min: 8, max: 25 })
}))

export const monsterArmorClassFactory = Factory.define<MonsterArmorClass2024>(() => ({
  type: faker.helpers.arrayElement(['dex', 'natural', 'armor', 'spell', 'condition']),
  value: faker.number.int({ min: 8, max: 22 })
}))

export const monsterProficiencyFactory = Factory.define<MonsterProficiency2024>(() => ({
  value: faker.number.int({ min: 2, max: 8 }),
  proficiency: apiReferenceFactory.build()
}))

export const spellcastingSpellUsageFactory = Factory.define<SpellcastingSpellUsage2024>(() => ({
  type: faker.helpers.arrayElement(['at will', 'per day'])
}))

export const spellcastingSpellFactory = Factory.define<SpellcastingSpell2024>(({ sequence }) => {
  const name = `Spell ${sequence}`
  const index = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    index,
    name,
    level: faker.number.int({ min: 0, max: 9 }),
    url: `/api/2024/spells/${index}`
  }
})

export const actionUsageFactory = Factory.define<ActionUsage2024>(() => ({
  type: faker.helpers.arrayElement(['recharge', 'per day', 'recharge on roll']),
  dice: `1d${faker.helpers.arrayElement([4, 6])}`,
  min_value: faker.number.int({ min: 1, max: 4 })
}))

export const monsterActionItemFactory = Factory.define<MonsterActionItem2024>(() => ({
  action_name: faker.lorem.words(2),
  count: faker.helpers.arrayElement([faker.number.int({ min: 1, max: 3 }), faker.lorem.word()]),
  type: faker.helpers.arrayElement(['melee', 'ranged', 'ability', 'magic'])
}))

export const monsterAttackFactory = Factory.define<MonsterAttack2024>(() => ({
  name: faker.lorem.words(2),
  dc: difficultyClassFactory.build()
}))

export const monsterActionFactory = Factory.define<MonsterAction2024>(() => ({
  name: faker.lorem.words(2),
  desc: faker.lorem.paragraph()
}))

export const legendaryActionFactory = Factory.define<LegendaryAction2024>(() => ({
  name: faker.lorem.words(2),
  desc: faker.lorem.paragraph()
}))

export const reactionFactory = Factory.define<Reaction2024>(() => ({
  name: faker.lorem.words(2),
  desc: faker.lorem.paragraph()
}))

export const specialAbilityUsageFactory = Factory.define<SpecialAbilityUsage2024>(() => ({
  type: faker.helpers.arrayElement(['at will', 'per day', 'recharge'])
}))

export const specialAbilityFactory = Factory.define<SpecialAbility2024>(() => ({
  name: faker.lorem.words(2),
  desc: faker.lorem.paragraph()
}))

const SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'] as const
const MONSTER_TYPES = [
  'aberration',
  'beast',
  'celestial',
  'construct',
  'dragon',
  'elemental',
  'fey',
  'fiend',
  'giant',
  'humanoid',
  'monstrosity',
  'ooze',
  'plant',
  'undead'
] as const

export const monsterFactory = Factory.define<Monster2024>(({ sequence }) => {
  const name = `Monster ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index,
    name,
    size: faker.helpers.arrayElement(SIZES),
    type: faker.helpers.arrayElement(MONSTER_TYPES),
    alignment: faker.helpers.arrayElement(['lawful good', 'neutral', 'chaotic evil', 'unaligned']),
    armor_class: [monsterArmorClassFactory.build()],
    hit_points: faker.number.int({ min: 1, max: 500 }),
    hit_dice: `${faker.number.int({ min: 1, max: 20 })}d${faker.helpers.arrayElement([6, 8, 10, 12])}`,
    hit_points_roll: `${faker.number.int({ min: 1, max: 20 })}d${faker.helpers.arrayElement([6, 8, 10, 12])}`,
    speed: monsterSpeedFactory.build(),
    strength: faker.number.int({ min: 1, max: 30 }),
    dexterity: faker.number.int({ min: 1, max: 30 }),
    constitution: faker.number.int({ min: 1, max: 30 }),
    intelligence: faker.number.int({ min: 1, max: 30 }),
    wisdom: faker.number.int({ min: 1, max: 30 }),
    charisma: faker.number.int({ min: 1, max: 30 }),
    proficiencies: [],
    damage_vulnerabilities: [],
    damage_resistances: [],
    damage_immunities: [],
    condition_immunities: [],
    senses: monsterSenseFactory.build(),
    languages: faker.helpers.arrayElement(['Common', 'Draconic', '--', 'Abyssal']),
    challenge_rating: faker.helpers.arrayElement([0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5]),
    xp: faker.number.int({ min: 10, max: 10000 }),
    url: `/api/2024/monsters/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
