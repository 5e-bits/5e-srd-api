import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import mongoose from 'mongoose'
import type {
  Action,
  ActionOption,
  ActionUsage,
  ArmorClass,
  LegendaryAction,
  Proficiency,
  Reaction,
  Sense,
  SpecialAbility,
  SpecialAbilitySpell,
  SpecialAbilitySpellcasting,
  SpecialAbilityUsage,
  Speed,
  Monster,
  MonsterDocument
} from '@/models/2014/monster'
import {
  apiReferenceFactory,
  choiceFactory,
  damageFactory,
  difficultyClassFactory
} from './common.factory'
import type { APIReference, Damage, DifficultyClass, Choice } from '@/models/2014/common'
import { vi } from 'vitest'

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
  Action,
  {
    has_damage: boolean
    has_dc: boolean
    has_attack_bonus: boolean
    has_usage: boolean
  },
  {
    damage?: Damage[]
    dc?: DifficultyClass
    options?: Choice
    usage?: ActionUsage
  }
>(({ transientParams, associations }) => {
  const generated_multiattack_type = faker.helpers.arrayElement(['actions', 'action_options'])

  const baseAction = {
    name: faker.lorem.words(2),
    desc: faker.lorem.paragraph(),
    attack_bonus: transientParams.has_attack_bonus
      ? faker.number.int({ min: 0, max: 10 })
      : undefined,
    damage:
      associations.damage ??
      (transientParams.has_damage
        ? damageFactory.buildList(faker.number.int({ min: 1, max: 2 }))
        : []),
    dc: associations.dc ?? (transientParams.has_dc ? difficultyClassFactory.build() : undefined),
    options: undefined, // Assuming Action['options'] is optional or handled elsewhere
    usage:
      associations.usage ?? (transientParams.has_usage ? actionUsageFactory.build() : undefined)
  }

  if (generated_multiattack_type === 'actions') {
    return {
      ...baseAction,
      multiattack_type: 'actions',
      actions: actionOptionFactory.buildList(faker.number.int({ min: 1, max: 3 })),
      action_options: choiceFactory.build()
    } as Action
  } else {
    return {
      ...baseAction,
      multiattack_type: 'action_options',
      actions: [],
      action_options: choiceFactory.build()
    } as Action
  }
})

// Factory for ArmorClass (Union Type - need specific factories or a generic one)
// Example for 'natural' type
const armorClassNaturalFactory = Factory.define<Extract<ArmorClass, { type: 'natural' }>>(() => ({
  type: 'natural',
  value: faker.number.int({ min: 10, max: 20 }),
  desc: faker.datatype.boolean() ? faker.lorem.sentence() : undefined
}))

// Example for 'armor' type
const armorClassArmorFactory = Factory.define<Extract<ArmorClass, { type: 'armor' }>>(
  ({ associations }) => ({
    type: 'armor',
    value: faker.number.int({ min: 12, max: 18 }),
    armor: associations.armor
      ? associations.armor
      : apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 1 })),
    desc: faker.datatype.boolean() ? faker.lorem.sentence() : undefined
  })
)

// A helper to create a random ArmorClass type
const armorClassFactory = Factory.define<ArmorClass>(({ transientParams }) => {
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
const proficiencyFactory = Factory.define<Proficiency>(({ associations }) => ({
  proficiency: associations.proficiency ? associations.proficiency : apiReferenceFactory.build(),
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
    const slotsMap = new Map<string, number>()
    for (let i = 1; i <= 9; i++) {
      if (faker.datatype.boolean()) {
        slotsMap.set(i.toString(), faker.number.int({ min: 1, max: 4 }))
      }
    }
    return {
      level: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 20 }) : undefined,
      ability: associations.ability
        ? associations.ability
        : apiReferenceFactory.build({ index: faker.helpers.arrayElement(['int', 'wis', 'cha']) }),
      dc: faker.datatype.boolean() ? faker.number.int({ min: 10, max: 20 }) : undefined,
      modifier: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : undefined,
      components_required: faker.helpers.arrayElements(
        ['V', 'S', 'M'],
        faker.number.int({ min: 1, max: 3 })
      ),
      school: faker.datatype.boolean() ? faker.lorem.word() : undefined,
      slots: slotsMap.size > 0 ? slotsMap : undefined,
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
const speedFactory = Factory.define<Speed>(() => {
  const speeds: Partial<Speed> = {}
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
  return speeds as Speed // Cast needed because we build it partially
})

// Factory for Monster
export const monsterFactory = Factory.define<Monster>(
  ({ sequence, associations, transientParams }) => {
    const name = transientParams?.name ?? `Monster ${sequence}`
    const index = name.toLowerCase().replace(/ /g, '-')
    const proficientSkills = proficiencyFactory.buildList(faker.number.int({ min: 0, max: 4 }))
    const proficientSaves = proficiencyFactory.buildList(faker.number.int({ min: 0, max: 3 }))

    // Ensure at least one armor class entry
    const armor_class =
      associations.armor_class ?? armorClassFactory.buildList(faker.number.int({ min: 1, max: 3 }))
    if (armor_class.length === 0) {
      armor_class.push(armorClassFactory.build())
    }

    return {
      index,
      name,
      desc: faker.lorem.paragraph(),
      size: faker.helpers.arrayElement(['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']),
      type: faker.helpers.arrayElement([
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
      ]),
      subtype: faker.datatype.boolean() ? faker.lorem.word() : undefined,
      alignment: faker.helpers.arrayElement([
        'lawful good',
        'neutral good',
        'chaotic good',
        'lawful neutral',
        'neutral',
        'chaotic neutral',
        'lawful evil',
        'neutral evil',
        'chaotic evil',
        'unaligned'
      ]),
      armor_class: armor_class,
      hit_points: faker.number.int({ min: 1, max: 500 }),
      hit_dice: `${faker.number.int({ min: 1, max: 50 })}d${faker.helpers.arrayElement([4, 6, 8, 10, 12, 20])}`,
      hit_points_roll: `${faker.number.int({ min: 1, max: 50 })}d${faker.helpers.arrayElement([4, 6, 8, 10, 12, 20])} + ${faker.number.int({ min: 0, max: 100 })}`,
      speed: associations.speed ?? speedFactory.build(),
      strength: faker.number.int({ min: 1, max: 30 }),
      dexterity: faker.number.int({ min: 1, max: 30 }),
      constitution: faker.number.int({ min: 1, max: 30 }),
      intelligence: faker.number.int({ min: 1, max: 30 }),
      wisdom: faker.number.int({ min: 1, max: 30 }),
      charisma: faker.number.int({ min: 1, max: 30 }),
      proficiencies: proficientSkills,
      damage_vulnerabilities: faker.helpers.arrayElements(
        ['fire', 'cold', 'lightning', 'acid', 'poison', 'bludgeoning', 'piercing', 'slashing'],
        faker.number.int({ min: 0, max: 2 })
      ),
      damage_resistances: faker.helpers.arrayElements(
        [
          'fire',
          'cold',
          'lightning',
          'acid',
          'poison',
          'bludgeoning',
          'piercing',
          'slashing',
          'necrotic',
          'radiant',
          'psychic'
        ],
        faker.number.int({ min: 0, max: 3 })
      ),
      damage_immunities: faker.helpers.arrayElements(
        [
          'fire',
          'cold',
          'lightning',
          'acid',
          'poison',
          'bludgeoning',
          'piercing',
          'slashing',
          'necrotic',
          'radiant',
          'psychic'
        ],
        faker.number.int({ min: 0, max: 3 })
      ),
      condition_immunities:
        associations.condition_immunities ??
        apiReferenceFactory.buildList(
          faker.number.int({ min: 0, max: 4 }),
          {},
          { transient: { indexPrefix: 'conditions/' } }
        ),
      senses: associations.senses ?? senseFactory.build(),
      languages: faker.lorem.words(faker.number.int({ min: 0, max: 4 })),
      challenge_rating: faker.number.float({ min: 0.125, max: 30, multipleOf: 0.125 }),
      xp: faker.number.int({ min: 0, max: 155000 }),
      special_abilities:
        associations.special_abilities ??
        specialAbilityFactory.buildList(faker.number.int({ min: 0, max: 3 })),
      actions:
        associations.actions ??
        (actionFactory.buildList(faker.number.int({ min: 1, max: 4 })) as Action[]),
      legendary_actions:
        associations.legendary_actions ??
        (faker.datatype.boolean()
          ? legendaryActionFactory.buildList(faker.number.int({ min: 1, max: 4 }))
          : undefined),
      image: faker.datatype.boolean() ? `/api/images/monsters/${index}.png` : undefined,
      reactions:
        associations.reactions ??
        (faker.datatype.boolean()
          ? reactionFactory.buildList(faker.number.int({ min: 1, max: 2 }))
          : undefined),
      forms:
        associations.forms ??
        (faker.datatype.boolean()
          ? apiReferenceFactory.buildList(
              faker.number.int({ min: 1, max: 2 }),
              {},
              { transient: { indexPrefix: 'monsters/' } }
            )
          : undefined),
      url: `/api/monsters/${index}`,
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
