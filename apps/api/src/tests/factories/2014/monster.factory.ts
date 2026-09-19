import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'
import mongoose from 'mongoose'

import {
  apiReferenceFactory,
  choiceFactory,
  damageFactory,
  difficultyClassFactory
} from './common.factory'

import type {
  ActionOption,
  ActionUsage,
  ArmorClassArmor,
  ArmorClassCondition,
  ArmorClassDex,
  ArmorClassNatural,
  ArmorClassSpell,
  LegendaryAction,
  Monster,
  MonsterAction,
  MonsterDocument,
  MonsterProficiency,
  MonsterSpeed,
  Reaction,
  Sense,
  SpecialAbility,
  SpecialAbilitySpell,
  SpecialAbilitySpellcasting,
  SpecialAbilityUsage
} from '@/models/2014/monster'

// Factory for ActionUsage
const actionUsageFactory = Factory.define<ActionUsage>(() => ({
  type: faker.lorem.words(1),
  dice: `${faker.number.int({ min: 1, max: 4 })}d${faker.number.int({ min: 4, max: 12 })}`,
  min_value: faker.number.int({ min: 1, max: 10 })
}))

// Factory for ActionOption
const actionOptionFactory = Factory.define<ActionOption>(() => ({
  action_name: faker.lorem.words(2),
  count: faker.helpers.arrayElement([faker.number.int({ min: 1, max: 3 }), faker.lorem.word()]),
  type: faker.helpers.arrayElement(['melee', 'ranged', 'ability', 'magic'])
}))

// Factory for Action
const actionFactory = Factory.define<
  MonsterAction,
  { has_damage?: boolean; has_dc?: boolean; has_attack_bonus?: boolean; has_usage?: boolean },
  MonsterAction
>(({ transientParams, associations }) => {
  const generated_multiattack_type = faker.helpers.arrayElement(['actions', 'action_options'])

  const baseAction = {
    name: faker.lorem.words(2),
    desc: faker.lorem.paragraph(),
    attack_bonus:
      transientParams?.has_attack_bonus === true
        ? faker.number.int({ min: 0, max: 10 })
        : undefined,
    damage:
      associations.damage ??
      (transientParams?.has_damage === true
        ? damageFactory.buildList(faker.number.int({ min: 1, max: 2 }))
        : []),
    dc:
      associations.dc ??
      (transientParams?.has_dc === true ? difficultyClassFactory.build() : undefined),
    options: undefined, // Assuming Action['options'] is optional or handled elsewhere
    usage:
      associations.usage ??
      (transientParams?.has_usage === true ? actionUsageFactory.build() : undefined)
  }

  if (generated_multiattack_type === 'actions') {
    return {
      ...baseAction,
      multiattack_type: 'actions',
      actions: actionOptionFactory.buildList(faker.number.int({ min: 1, max: 3 })),
      action_options: choiceFactory.build()
    } as MonsterAction
  } else {
    return {
      ...baseAction,
      multiattack_type: 'action_options',
      actions: [],
      action_options: choiceFactory.build()
    } as MonsterAction
  }
})

// Factory for ArmorClass (Union Type - need specific factories or a generic one)
// Example for 'natural' type
// const armorClassNaturalFactory = Factory.define<ArmorClassNatural>(() => ({
//   type: 'natural',
//   value: faker.number.int({ min: 10, max: 20 }),
//   desc: faker.datatype.boolean() ? faker.lorem.sentence() : undefined
// }))

// Example for 'armor' type
// const armorClassArmorFactory = Factory.define<ArmorClassArmor>(({ associations }) => ({
//   type: 'armor',
//   value: faker.number.int({ min: 12, max: 18 }),
//   armor: associations.armor
//     ? associations.armor
//     : apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 1 })),
//   desc: faker.datatype.boolean() ? faker.lorem.sentence() : undefined
// }))

// A helper to create a random ArmorClass type
const armorClassFactory = Factory.define<
  ArmorClassDex | ArmorClassNatural | ArmorClassArmor | ArmorClassSpell | ArmorClassCondition
>(() => {
  const type = faker.helpers.arrayElement(['dex', 'natural', 'armor', 'spell', 'condition'])
  const value = faker.number.int({ min: 10, max: 25 })
  const desc = faker.datatype.boolean() ? faker.lorem.sentence() : undefined

  switch (type) {
    case 'dex':
      return { type, value, desc }
    case 'natural':
      return { type, value, desc }
    case 'armor':
      return {
        type,
        value,
        desc,
        armor: apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 1 }))
      }
    case 'spell':
      return { type, value, desc, spell: apiReferenceFactory.build() }
    case 'condition':
      return { type, value, desc, condition: apiReferenceFactory.build() }
    default: // Should not happen with the defined types
      return { type: 'natural', value: 10 } // Fallback
  }
})

// Factory for LegendaryAction
const legendaryActionFactory = Factory.define<LegendaryAction>(({ associations }) => ({
  name: faker.lorem.words(3),
  desc: faker.lorem.sentence(),
  attack_bonus: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 12 }) : undefined,
  damage: associations.damage
    ? associations.damage
    : damageFactory.buildList(faker.number.int({ min: 0, max: 2 })),
  dc: associations.dc
    ? associations.dc
    : faker.datatype.boolean()
      ? difficultyClassFactory.build()
      : undefined
}))

// Factory for Proficiency
const proficiencyFactory = Factory.define<MonsterProficiency>(({ associations }) => ({
  proficiency: apiReferenceFactory.build(associations.proficiency),
  value: faker.number.int({ min: 1, max: 10 })
}))

// Factory for Reaction
const reactionFactory = Factory.define<Reaction>(({ associations }) => ({
  name: faker.lorem.words(2),
  desc: faker.lorem.sentence(),
  dc: associations.dc
    ? associations.dc
    : faker.datatype.boolean()
      ? difficultyClassFactory.build()
      : undefined
}))

// Factory for Sense
const senseFactory = Factory.define<Sense>(() => ({
  blindsight: faker.datatype.boolean()
    ? `${faker.number.int({ min: 10, max: 120 })} ft.`
    : undefined,
  darkvision: faker.datatype.boolean()
    ? `${faker.number.int({ min: 30, max: 120 })} ft.`
    : undefined,
  passive_perception: faker.number.int({ min: 8, max: 25 }),
  tremorsense: faker.datatype.boolean()
    ? `${faker.number.int({ min: 10, max: 60 })} ft.`
    : undefined,
  truesight: faker.datatype.boolean() ? `${faker.number.int({ min: 10, max: 120 })} ft.` : undefined
}))

// Factory for SpecialAbilityUsage
const specialAbilityUsageFactory = Factory.define<SpecialAbilityUsage>(() => ({
  type: faker.helpers.arrayElement([
    'At Will',
    'Per Day',
    'Recharge after Rest',
    'Recharge on Roll'
  ]),
  times: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 3 }) : undefined,
  rest_types: faker.datatype.boolean()
    ? faker.helpers.arrayElements(['short', 'long'], faker.number.int({ min: 1, max: 2 }))
    : undefined
}))

// Factory for SpecialAbilitySpell
const specialAbilitySpellFactory = Factory.define<SpecialAbilitySpell>(({ associations }) => ({
  name: faker.lorem.words(3),
  level: faker.number.int({ min: 0, max: 9 }),
  url: `/api/spells/${faker.lorem.slug()}`,
  notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
  usage: associations.usage
    ? associations.usage
    : faker.datatype.boolean()
      ? specialAbilityUsageFactory.build()
      : undefined
}))

// Factory for SpecialAbilitySpellcasting
const specialAbilitySpellcastingFactory = Factory.define<SpecialAbilitySpellcasting>(
  ({ associations }) => {
    // Generate key-value pairs first
    const slotEntries: [string, number][] = []
    for (let i = 1; i <= 9; i++) {
      if (faker.datatype.boolean()) {
        slotEntries.push([i.toString(), faker.number.int({ min: 1, max: 4 })])
      }
    }
    // Create a plain object from the entries, matching the new schema type
    const slotsObject = slotEntries.length > 0 ? Object.fromEntries(slotEntries) : undefined

    return {
      level: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 20 }) : undefined,
      ability: apiReferenceFactory.build(
        associations.ability ?? { index: faker.helpers.arrayElement(['int', 'wis', 'cha']) }
      ),
      dc: faker.datatype.boolean() ? faker.number.int({ min: 10, max: 20 }) : undefined,
      modifier: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : undefined,
      components_required: faker.helpers.arrayElements(
        ['V', 'S', 'M'],
        faker.number.int({ min: 1, max: 3 })
      ),
      school: faker.datatype.boolean() ? faker.lorem.word() : undefined,
      // Assign the plain object
      slots: slotsObject,
      spells: specialAbilitySpellFactory.buildList(faker.number.int({ min: 1, max: 5 }))
    }
  }
)

// Factory for SpecialAbility
const specialAbilityFactory = Factory.define<SpecialAbility>(({ associations }) => {
  const usage = associations.usage ? associations.usage : specialAbilityUsageFactory.build()

  return {
    name: faker.lorem.words(2),
    desc: faker.lorem.sentence(),
    attack_bonus: faker.datatype.boolean() ? faker.number.int({ min: -1, max: 8 }) : undefined,
    damage: associations.damage
      ? associations.damage
      : damageFactory.buildList(faker.number.int({ min: 0, max: 1 })),
    dc: associations.dc
      ? associations.dc
      : faker.datatype.boolean()
        ? difficultyClassFactory.build()
        : undefined,
    spellcasting: associations.spellcasting
      ? associations.spellcasting
      : faker.datatype.boolean()
        ? specialAbilitySpellcastingFactory.build()
        : undefined,
    usage: usage
  }
})

// Factory for Speed
const speedFactory = Factory.define<MonsterSpeed>(() => {
  const speeds: Partial<MonsterSpeed> = {}
  if (faker.datatype.boolean()) speeds.walk = `${faker.number.int({ min: 10, max: 60 })} ft.`
  if (faker.datatype.boolean()) speeds.swim = `${faker.number.int({ min: 10, max: 60 })} ft.`
  if (faker.datatype.boolean()) speeds.fly = `${faker.number.int({ min: 10, max: 60 })} ft.`
  if (faker.datatype.boolean()) speeds.burrow = `${faker.number.int({ min: 10, max: 60 })} ft.`
  if (faker.datatype.boolean()) speeds.climb = `${faker.number.int({ min: 10, max: 60 })} ft.`
  if (faker.datatype.boolean()) speeds.hover = faker.datatype.boolean()
  // Ensure at least one speed exists
  if (Object.keys(speeds).length === 0 || (Object.keys(speeds).length === 1 && 'hover' in speeds)) {
    speeds.walk = `${faker.number.int({ min: 10, max: 60 })} ft.`
  }
  return speeds as MonsterSpeed // Cast needed because we build it partially
})

// Factory for Monster - Define return type explicitly as Monster
const monsterFactory = Factory.define<Monster, any, Monster>(
  ({ associations, transientParams }) => {
    const size = faker.helpers.arrayElement([
      'Tiny',
      'Small',
      'Medium',
      'Large',
      'Huge',
      'Gargantuan'
    ])
    const type = faker.lorem.word() // Consider using helpers.arrayElement for specific types if needed
    const subtype = faker.datatype.boolean() ? faker.lorem.word() : undefined
    const alignment = faker.helpers.arrayElement([
      'chaotic neutral',
      'chaotic evil',
      'chaotic good',
      'lawful neutral',
      'lawful evil',
      'lawful good',
      'neutral',
      'neutral evil',
      'neutral good',
      'any alignment',
      'unaligned'
    ])
    const slug = transientParams?.index ?? faker.lorem.slug() // Use transient index if provided

    // Return a plain object matching the Monster interface
    return {
      index: slug,
      name: transientParams?.name ?? faker.person.firstName(), // Use transient name if provided
      desc: faker.lorem.paragraph(),
      size: size,
      type: type,
      subtype: subtype,
      alignment: alignment,
      armor_class:
        associations.armor_class ??
        armorClassFactory.buildList(faker.number.int({ min: 1, max: 2 })),
      hit_points: faker.number.int({ min: 10, max: 300 }),
      hit_dice: `${faker.number.int({ min: 1, max: 20 })}d${faker.number.int({ min: 4, max: 12 })}`,
      hit_points_roll: `${faker.number.int({ min: 1, max: 20 })}d${faker.number.int({ min: 4, max: 12 })} + ${faker.number.int({ min: 0, max: 50 })}`,
      speed: associations.speed ?? speedFactory.build(),
      strength: faker.number.int({ min: 3, max: 30 }),
      dexterity: faker.number.int({ min: 3, max: 30 }),
      constitution: faker.number.int({ min: 3, max: 30 }),
      intelligence: faker.number.int({ min: 3, max: 30 }),
      wisdom: faker.number.int({ min: 3, max: 30 }),
      charisma: faker.number.int({ min: 3, max: 30 }),
      proficiencies:
        associations.proficiencies ??
        proficiencyFactory.buildList(faker.number.int({ min: 0, max: 5 })),
      damage_vulnerabilities: Array.from({ length: faker.number.int({ min: 0, max: 2 }) }, () =>
        faker.lorem.word()
      ),
      damage_resistances: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () =>
        faker.lorem.word()
      ),
      damage_immunities: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () =>
        faker.lorem.word()
      ),
      condition_immunities: apiReferenceFactory.buildList(
        associations.condition_immunities?.length ?? faker.number.int({ min: 0, max: 3 }),
        associations.condition_immunities?.[0] // Pass potential overrides
      ),
      senses: associations.senses ?? senseFactory.build(),
      languages: transientParams?.languages ?? 'Common', // Add languages field - defaulting to "Common", allow override
      challenge_rating:
        transientParams?.challenge_rating ??
        faker.helpers.arrayElement([
          0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
        ]),
      proficiency_bonus: faker.number.int({ min: 2, max: 9 }),
      xp: faker.number.int({ min: 10, max: 155000 }),
      special_abilities:
        associations.special_abilities ??
        specialAbilityFactory.buildList(faker.number.int({ min: 0, max: 4 })),
      actions:
        associations.actions ??
        actionFactory.buildList(
          faker.number.int({ min: 1, max: 5 }),
          {},
          { transient: { has_damage: true } }
        ),
      legendary_actions:
        associations.legendary_actions ??
        legendaryActionFactory.buildList(faker.number.int({ min: 0, max: 3 })),
      image: faker.datatype.boolean() ? `/api/images/monsters/${slug}.png` : undefined,
      reactions:
        transientParams?.has_reactions === true
          ? reactionFactory.buildList(faker.number.int({ min: 1, max: 2 }))
          : undefined,
      url: `/api/monsters/${slug}`,
      updated_at: faker.date.recent().toISOString()
    }
  }
)

export const monsterModelFactory = Factory.define<MonsterDocument>(
  ({ associations, transientParams }) => {
    // sequence is implicitly passed via the GeneratorFnOptions, not BuildOptions
    const monsterProps = monsterFactory.build(associations, { transient: transientParams })
    const doc = {
      _id: new mongoose.Types.ObjectId(),
      __v: 0,
      ...monsterProps
    } as MonsterDocument
    return doc
  }
)

export { monsterFactory }
