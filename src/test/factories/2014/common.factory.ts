import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import {
  APIReference,
  AreaOfEffect,
  DifficultyClass,
  Damage,
  OptionSet,
  OptionsArrayOptionSet, // Using one subtype for OptionSet 'from'
  Option,
  Choice,
  StringOption // Using one simple Option subtype for arrays
} from '@/models/2014/common'

// --- APIReference ---
export const apiReferenceFactory = Factory.define<APIReference>(({ sequence }) => {
  const name = `Reference ${sequence}`
  const index = name.toLowerCase().replace(/ /g, '-')
  return {
    index: index,
    name: name,
    url: `/api/testing/${index}`
  }
})

// --- AreaOfEffect ---
export const areaOfEffectFactory = Factory.define<AreaOfEffect>(() => ({
  size: faker.number.int({ min: 5, max: 30 }),
  type: faker.helpers.arrayElement(['sphere', 'cube', 'cylinder', 'line', 'cone'])
}))

// --- DifficultyClass ---
export const difficultyClassFactory = Factory.define<DifficultyClass>(() => ({
  dc_type: apiReferenceFactory.build(),
  dc_value: faker.number.int({ min: 10, max: 25 }),
  success_type: faker.helpers.arrayElement(['none', 'half', 'other'])
}))

// --- Damage ---
export const damageFactory = Factory.define<Damage>(() => ({
  damage_type: apiReferenceFactory.build(),
  damage_dice: `${faker.number.int({ min: 1, max: 4 })}d${faker.helpers.arrayElement([
    4, 6, 8, 10, 12
  ])}`
}))

// --- Option (using StringOption as a simple representative) ---
// Tests needing specific option types will need dedicated factories or manual construction
export const stringOptionFactory = Factory.define<StringOption>(({ sequence }) => ({
  option_type: 'string',
  string: `Option String ${sequence}`
}))

// --- OptionSet (using OptionsArrayOptionSet as representative) ---
// Tests needing specific option set types will need dedicated factories or manual construction
export const optionsArrayOptionSetFactory = Factory.define<OptionsArrayOptionSet>(() => ({
  option_set_type: 'options_array',
  options: stringOptionFactory.buildList(1) // Default with one simple string option
}))

// --- Choice (Simplified) ---
// This now uses the more concrete optionsArrayOptionSetFactory
export const choiceFactory = Factory.define<Choice>(() => ({
  desc: faker.lorem.sentence(),
  choose: 1,
  type: 'equipment', // Default type
  from: optionsArrayOptionSetFactory.build() // Use the concrete subtype factory
}))

// --- Other Option Subtypes (Placeholders - build as needed) ---
// export const referenceOptionFactory = Factory.define<ReferenceOption>(...)
// export const actionOptionFactory = Factory.define<ActionOption>(...)
// export const multipleOptionFactory = Factory.define<MultipleOption>(...)
// export const idealOptionFactory = Factory.define<IdealOption>(...)
// export const countedReferenceOptionFactory = Factory.define<CountedReferenceOption>(...)
// ... etc.
