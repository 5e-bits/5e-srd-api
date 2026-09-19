import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { apiReferenceFactory, choiceFactory, createIndex, createUrl } from './common.factory'

import type {
  Class,
  ClassEquipment,
  MultiClassing,
  MultiClassingPrereq,
  Spellcasting,
  SpellcastingInfo
} from '@/models/2014/class'

// --- Nested Factories --- //

const equipmentFactory = Factory.define<ClassEquipment>(({ params }) => {
  const builtEquipmentRef = apiReferenceFactory.build(params.equipment)
  return {
    equipment: {
      index: builtEquipmentRef.index,
      name: builtEquipmentRef.name,
      url: builtEquipmentRef.url
    },
    quantity: params.quantity ?? faker.number.int({ min: 1, max: 5 })
  }
})

const spellcastingInfoFactory = Factory.define<SpellcastingInfo>(({ params }) => ({
  desc: params.desc ?? [faker.lorem.sentence()],
  name: params.name ?? faker.lorem.words(3)
}))

const spellcastingFactory = Factory.define<Spellcasting>(({ params }) => {
  const builtInfo = spellcastingInfoFactory.buildList(params.info?.length ?? 1, params.info?.[0]) // Build at least one info
  const builtAbility = apiReferenceFactory.build(params.spellcasting_ability)
  return {
    info: builtInfo.map((i) => ({ desc: i.desc, name: i.name })), // Map to ensure correct structure
    level: params.level ?? faker.number.int({ min: 1, max: 5 }),
    spellcasting_ability: {
      index: builtAbility.index,
      name: builtAbility.name,
      url: builtAbility.url
    }
  }
})

const multiClassingPrereqFactory = Factory.define<MultiClassingPrereq>(({ params }) => {
  const builtAbility = apiReferenceFactory.build(params.ability_score)
  return {
    ability_score: { index: builtAbility.index, name: builtAbility.name, url: builtAbility.url },
    minimum_score: params.minimum_score ?? faker.helpers.arrayElement([10, 12, 13, 14, 15])
  }
})

const multiClassingFactory = Factory.define<MultiClassing>(({ params }) => {
  // Build optional parts explicitly
  const builtPrereqs =
    params.prerequisites !== null
      ? (params.prerequisites ??
        multiClassingPrereqFactory.buildList(faker.number.int({ min: 0, max: 1 })))
      : undefined
  const builtPrereqOpts =
    params.prerequisite_options !== null
      ? (params.prerequisite_options ??
        (faker.datatype.boolean(0.1) ? choiceFactory.build() : undefined))
      : undefined
  const builtProfs =
    params.proficiencies !== null
      ? (params.proficiencies ??
        apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 2 })))
      : undefined
  const builtProfChoices =
    params.proficiency_choices !== null
      ? (params.proficiency_choices ??
        (faker.datatype.boolean(0.2)
          ? choiceFactory.buildList(faker.number.int({ min: 1, max: 2 }))
          : undefined))
      : undefined

  return {
    prerequisites: builtPrereqs?.map((p) => ({
      ability_score: p.ability_score,
      minimum_score: p.minimum_score
    })), // Map to ensure structure
    prerequisite_options: builtPrereqOpts ? choiceFactory.build(builtPrereqOpts) : undefined, // Re-build choice if needed
    proficiencies: builtProfs?.map((p) => ({ index: p.index, name: p.name, url: p.url })), // Map API Refs
    proficiency_choices: builtProfChoices?.map((c) => choiceFactory.build(c)) // Re-build choices if needed
  }
})

// --- Class Factory (Main) --- //

export const classFactory = Factory.define<Omit<Class, '_id' | 'collectionName'>>(
  ({ sequence, params }) => {
    const name = params.name ?? `Class ${sequence}`
    const index = params.index ?? createIndex(name)
    const url = params.url ?? createUrl('classes', index)

    // Build dependencies
    const builtProfs =
      params.proficiencies ?? apiReferenceFactory.buildList(faker.number.int({ min: 2, max: 4 }))
    const builtProfChoices =
      params.proficiency_choices ?? choiceFactory.buildList(faker.number.int({ min: 1, max: 2 }))
    const builtSavingThrows = params.saving_throws ?? apiReferenceFactory.buildList(2)
    const builtStartingEquip =
      params.starting_equipment ?? equipmentFactory.buildList(faker.number.int({ min: 1, max: 3 }))
    const builtStartingEquipOpts =
      params.starting_equipment_options ??
      choiceFactory.buildList(faker.number.int({ min: 1, max: 2 }))
    const builtSubclasses =
      params.subclasses ?? apiReferenceFactory.buildList(faker.number.int({ min: 1, max: 3 }))

    // Build optional/complex parts
    const builtMultiClassing = multiClassingFactory.build(params.multi_classing) // Always build this, pass null via params to omit parts
    const builtSpellcasting =
      params.spellcasting === null
        ? undefined
        : (params.spellcasting ??
          (faker.datatype.boolean(0.5) ? spellcastingFactory.build() : undefined))

    return {
      index,
      name,
      url,
      hit_die: params.hit_die ?? faker.helpers.arrayElement([6, 8, 10, 12]),
      class_levels: params.class_levels ?? `/api/classes/${index}/levels`, // Default URL structure
      multi_classing: builtMultiClassing, // Use the fully built object
      proficiencies: builtProfs.map((p) => ({ index: p.index, name: p.name, url: p.url })), // Map API Refs
      proficiency_choices: builtProfChoices.map((c) => choiceFactory.build(c)), // Re-build choices
      saving_throws: builtSavingThrows.map((p) => ({ index: p.index, name: p.name, url: p.url })), // Map API Refs
      spellcasting: builtSpellcasting ? spellcastingFactory.build(builtSpellcasting) : undefined, // Re-build if exists
      spells: params.spells ?? `/api/classes/${index}/spells`, // Default URL structure
      starting_equipment: builtStartingEquip.map((e) => equipmentFactory.build(e)), // Re-build equipment
      starting_equipment_options: builtStartingEquipOpts.map((c) => choiceFactory.build(c)), // Re-build choices
      subclasses: builtSubclasses.map((s) => ({ index: s.index, name: s.name, url: s.url })), // Map API Refs
      updated_at: params.updated_at ?? faker.date.past().toISOString()
    }
  }
)
