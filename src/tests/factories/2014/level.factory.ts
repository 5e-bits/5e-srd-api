import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { apiReferenceFactory } from './common.factory'

import type {
  ClassSpecific,
  ClassSpecificCreatingSpellSlot,
  ClassSpecificMartialArt,
  ClassSpecificSneakAttack,
  Level,
  LevelSpellcasting,
  SubclassSpecific
} from '@/models/2014/level'

const createIndex = (base: string, level: number): string => `${base}-${level}`
const createUrl = (resource: string, index: string): string => `/api/${resource}/${index}`

// --- Nested Factories for Level --- //

const classSpecificCreatingSpellSlotFactory = Factory.define<ClassSpecificCreatingSpellSlot>(
  () => ({
    sorcery_point_cost: faker.number.int({ min: 1, max: 5 }),
    spell_slot_level: faker.number.int({ min: 1, max: 3 })
  })
)

const classSpecificMartialArtFactory = Factory.define<ClassSpecificMartialArt>(() => ({
  dice_count: 1,
  dice_value: faker.helpers.arrayElement([4, 6])
}))

const classSpecificSneakAttackFactory = Factory.define<ClassSpecificSneakAttack>(() => ({
  dice_count: faker.number.int({ min: 1, max: 4 }),
  dice_value: 6
}))

// Factory for the main ClassSpecific object (many optional fields)
const classSpecificFactory = Factory.define<ClassSpecific>(() => {
  // Only include a few common ones by default, others can be added via params
  const specifics: Partial<ClassSpecific> = {}
  if (faker.datatype.boolean(0.2)) specifics.extra_attacks = 1
  if (faker.datatype.boolean(0.1)) specifics.ki_points = faker.number.int({ min: 2, max: 10 })
  if (faker.datatype.boolean(0.1)) specifics.sorcery_points = faker.number.int({ min: 2, max: 10 })
  if (faker.datatype.boolean(0.1)) specifics.rage_count = faker.number.int({ min: 2, max: 4 })
  if (faker.datatype.boolean(0.1))
    specifics.invocations_known = faker.number.int({ min: 2, max: 5 })
  // Add others here as needed or pass through params
  return specifics
})

// Factory for LevelSpellcasting (many required fields)
const levelSpellcastingFactory = Factory.define<LevelSpellcasting>(({ params }) => ({
  cantrips_known: params.cantrips_known ?? faker.number.int({ min: 2, max: 4 }),
  spell_slots_level_1: params.spell_slots_level_1 ?? faker.number.int({ min: 0, max: 4 }),
  spell_slots_level_2: params.spell_slots_level_2 ?? faker.number.int({ min: 0, max: 3 }),
  spell_slots_level_3: params.spell_slots_level_3 ?? faker.number.int({ min: 0, max: 3 }),
  spell_slots_level_4: params.spell_slots_level_4 ?? faker.number.int({ min: 0, max: 3 }),
  spell_slots_level_5: params.spell_slots_level_5 ?? faker.number.int({ min: 0, max: 2 }),
  spell_slots_level_6: params.spell_slots_level_6 ?? faker.number.int({ min: 0, max: 1 }),
  spell_slots_level_7: params.spell_slots_level_7 ?? faker.number.int({ min: 0, max: 1 }),
  spell_slots_level_8: params.spell_slots_level_8 ?? faker.number.int({ min: 0, max: 1 }),
  spell_slots_level_9: params.spell_slots_level_9 ?? faker.number.int({ min: 0, max: 1 }),
  spells_known: params.spells_known ?? faker.number.int({ min: 0, max: 10 })
}))

// Factory for SubclassSpecific (optional fields)
const subclassSpecificFactory = Factory.define<SubclassSpecific>(() => {
  const specifics: Partial<SubclassSpecific> = {}
  if (faker.datatype.boolean(0.1))
    specifics.additional_magical_secrets_max_lvl = faker.helpers.arrayElement([5, 7, 9])
  if (faker.datatype.boolean(0.1)) specifics.aura_range = faker.helpers.arrayElement([10, 30])
  return specifics
})

// --- Level Factory (Main) --- //

export const levelFactory = Factory.define<Omit<Level, '_id' | 'collectionName'>>(
  ({ sequence, params }) => {
    const level =
      params.level ?? (sequence <= 20 ? sequence : faker.number.int({ min: 1, max: 20 }))

    // Build APIReference dependencies first
    const builtClass = apiReferenceFactory.build(params.class)
    const builtSubclass = params.subclass ? apiReferenceFactory.build(params.subclass) : undefined
    const builtFeatures = params.features
      ? apiReferenceFactory.buildList(params.features.length)
      : apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 2 }))

    const index =
      params.index ??
      createIndex(
        builtSubclass ? `${builtSubclass.index}-level` : `${builtClass.index}-level`,
        level
      )
    const url = params.url ?? createUrl('levels', index)

    // Build potential complex nested objects - ensuring full structure
    const shouldBuildClassSpecific =
      params.class_specific !== undefined
        ? params.class_specific !== null
        : faker.datatype.boolean(0.5)
    const builtClassSpecific = shouldBuildClassSpecific
      ? classSpecificFactory.build(params.class_specific)
      : undefined

    const shouldBuildSpellcasting =
      params.spellcasting !== undefined ? params.spellcasting !== null : faker.datatype.boolean(0.5)
    const builtSpellcasting = shouldBuildSpellcasting
      ? levelSpellcastingFactory.build(params.spellcasting)
      : undefined

    const shouldBuildSubclassSpecific =
      builtSubclass != null &&
      (params.subclass_specific !== undefined
        ? params.subclass_specific !== null
        : faker.datatype.boolean(0.3))
    const builtSubclassSpecific = shouldBuildSubclassSpecific
      ? subclassSpecificFactory.build(params.subclass_specific)
      : undefined

    return {
      level,
      index,
      url,
      class: {
        // Explicit construction
        index: builtClass.index,
        name: builtClass.name,
        url: builtClass.url
      },
      subclass: builtSubclass
        ? {
            // Explicit construction
            index: builtSubclass.index,
            name: builtSubclass.name,
            url: builtSubclass.url
          }
        : undefined,
      features: builtFeatures.map((f) => ({ index: f.index, name: f.name, url: f.url })), // Explicit construction
      ability_score_bonuses: params.ability_score_bonuses ?? (level % 4 === 0 ? 1 : 0),
      prof_bonus: params.prof_bonus ?? Math.floor((level - 1) / 4) + 2,
      // Explicitly construct complex nested objects, providing defaults/undefined for all fields
      class_specific: builtClassSpecific
        ? {
            action_surges: builtClassSpecific.action_surges,
            arcane_recovery_levels: builtClassSpecific.arcane_recovery_levels,
            aura_range: builtClassSpecific.aura_range,
            bardic_inspiration_die: builtClassSpecific.bardic_inspiration_die,
            brutal_critical_dice: builtClassSpecific.brutal_critical_dice,
            channel_divinity_charges: builtClassSpecific.channel_divinity_charges,
            creating_spell_slots: builtClassSpecific.creating_spell_slots?.map((s) =>
              classSpecificCreatingSpellSlotFactory.build(s)
            ), // Need factory for nested array
            destroy_undead_cr: builtClassSpecific.destroy_undead_cr,
            extra_attacks: builtClassSpecific.extra_attacks,
            favored_enemies: builtClassSpecific.favored_enemies,
            favored_terrain: builtClassSpecific.favored_terrain,
            indomitable_uses: builtClassSpecific.indomitable_uses,
            invocations_known: builtClassSpecific.invocations_known,
            ki_points: builtClassSpecific.ki_points,
            magical_secrets_max_5: builtClassSpecific.magical_secrets_max_5,
            magical_secrets_max_7: builtClassSpecific.magical_secrets_max_7,
            magical_secrets_max_9: builtClassSpecific.magical_secrets_max_9,
            martial_arts: builtClassSpecific.martial_arts
              ? classSpecificMartialArtFactory.build(builtClassSpecific.martial_arts)
              : undefined,
            metamagic_known: builtClassSpecific.metamagic_known,
            mystic_arcanum_level_6: builtClassSpecific.mystic_arcanum_level_6,
            mystic_arcanum_level_7: builtClassSpecific.mystic_arcanum_level_7,
            mystic_arcanum_level_8: builtClassSpecific.mystic_arcanum_level_8,
            mystic_arcanum_level_9: builtClassSpecific.mystic_arcanum_level_9,
            rage_count: builtClassSpecific.rage_count,
            rage_damage_bonus: builtClassSpecific.rage_damage_bonus,
            sneak_attack: builtClassSpecific.sneak_attack
              ? classSpecificSneakAttackFactory.build(builtClassSpecific.sneak_attack)
              : undefined,
            song_of_rest_die: builtClassSpecific.song_of_rest_die,
            sorcery_points: builtClassSpecific.sorcery_points,
            unarmored_movement: builtClassSpecific.unarmored_movement,
            wild_shape_fly: builtClassSpecific.wild_shape_fly,
            wild_shape_max_cr: builtClassSpecific.wild_shape_max_cr,
            wild_shape_swim: builtClassSpecific.wild_shape_swim
          }
        : undefined,
      spellcasting: builtSpellcasting
        ? {
            cantrips_known: builtSpellcasting.cantrips_known,
            spell_slots_level_1: builtSpellcasting.spell_slots_level_1 ?? 0, // Ensure required fields have defaults
            spell_slots_level_2: builtSpellcasting.spell_slots_level_2 ?? 0,
            spell_slots_level_3: builtSpellcasting.spell_slots_level_3 ?? 0,
            spell_slots_level_4: builtSpellcasting.spell_slots_level_4 ?? 0,
            spell_slots_level_5: builtSpellcasting.spell_slots_level_5 ?? 0,
            spell_slots_level_6: builtSpellcasting.spell_slots_level_6,
            spell_slots_level_7: builtSpellcasting.spell_slots_level_7,
            spell_slots_level_8: builtSpellcasting.spell_slots_level_8,
            spell_slots_level_9: builtSpellcasting.spell_slots_level_9,
            spells_known: builtSpellcasting.spells_known
          }
        : undefined,
      subclass_specific: builtSubclassSpecific
        ? {
            additional_magical_secrets_max_lvl:
              builtSubclassSpecific.additional_magical_secrets_max_lvl,
            aura_range: builtSubclassSpecific.aura_range
          }
        : undefined,
      updated_at: params.updated_at ?? faker.date.past().toISOString()
    }
  }
)
