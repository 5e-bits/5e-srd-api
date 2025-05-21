import { createUnionType } from 'type-graphql'
import { Equipment } from '@/models/2014/equipment'
import { MagicItem } from '@/models/2014/magicItem'
import { EquipmentCategory } from '@/models/2014/equipmentCategory'
import { AbilityScore } from '@/models/2014/abilityScore'
import { Skill } from '@/models/2014/skill'
import { Level } from '@/models/2014/level'
import { Feature } from '@/models/2014/feature'
import { LevelPrerequisite, FeaturePrerequisite, SpellPrerequisite } from '@/models/2014/feature'
import { Armor, Weapon, Tool, Gear, Pack, Ammunition, Vehicle } from './types'
import {
  ArmorClassDex,
  ArmorClassNatural,
  ArmorClassArmor,
  ArmorClassSpell,
  ArmorClassCondition
} from '@/models/2014/monster' // Import the individual AC types
import { Proficiency } from '@/models/2014/proficiency'
import { ProficiencyChoice } from '@/graphql/2014/common/choiceTypes'
import { Damage } from '@/models/2014/common/damage'
import {
  ActionChoiceOption,
  DamageChoice,
  MultipleActionChoiceOption
} from '@/graphql/2014/types/monsterTypes'

// --- Helper Function for Equipment Type Resolution ---
function resolveConcreteEquipmentType(
  value: any
): // Explicitly list all possible concrete return types
| typeof Armor
  | typeof Weapon
  | typeof Tool
  | typeof Gear
  | typeof Pack
  | typeof Ammunition
  | typeof Vehicle
  | null {
  // Add specific checks based on unique properties of each type
  if ('armor_class' in value) {
    return Armor
  }
  if ('weapon_category' in value || 'weapon_range' in value) {
    return Weapon
  }
  if ('tool_category' in value) {
    return Tool
  }
  if ('vehicle_category' in value) {
    return Vehicle
  }
  if ('contents' in value) {
    return Pack
  }
  if (value.gear_category?.index === 'ammunition') {
    return Ammunition
  }
  if ('gear_category' in value) {
    return Gear
  }
  return null
}

export const EquipmentOrMagicItem = createUnionType({
  name: 'EquipmentOrMagicItem',
  types: () => [Armor, Weapon, Tool, Gear, Pack, Ammunition, Vehicle, MagicItem] as const,
  resolveType: (value) => {
    if ('rarity' in value) {
      return MagicItem
    }

    const equipmentType = resolveConcreteEquipmentType(value)
    if (equipmentType) {
      return equipmentType
    }

    console.warn('Could not resolve type for EquipmentOrMagicItem:', value)
    throw new Error('Could not resolve type for EquipmentOrMagicItem')
  }
})

export const AnyEquipment = createUnionType({
  name: 'AnyEquipment',
  types: () => [Armor, Weapon, Tool, Gear, Pack, Ammunition, Vehicle] as const,
  resolveType: (value) => {
    const equipmentType = resolveConcreteEquipmentType(value)
    if (equipmentType) {
      return equipmentType
    }

    console.warn('Could not resolve type for AnyEquipment:', value)
    return Gear
  }
})

// Union type for Proficiency.reference
export const ProficiencyReference = createUnionType({
  name: 'ProficiencyReference',
  // Types that can be referenced by a proficiency
  types: () => [Equipment, EquipmentCategory, AbilityScore, Skill] as const,
  // Logic to determine the object type at runtime
  resolveType: (value) => {
    // Check for properties unique to each type
    if ('equipment' in value) {
      return EquipmentCategory // EquipmentCategory has an 'equipment' field
    }
    if ('full_name' in value) {
      return AbilityScore // AbilityScore has a 'full_name' field
    }
    if ('desc' in value && Array.isArray(value.desc)) {
      return Skill // Skill has a 'desc' field which is an array of strings
    }
    // Equipment is the remaining option (assuming it doesn't uniquely have the others)
    // More specific checks like 'weapon_category' or 'armor_class' could be added if needed.
    return Equipment
  }
})

// Union type for SubclassSpell.prerequisites
export const SubclassSpellPrerequisiteUnion = createUnionType({
  name: 'SubclassSpellPrerequisite',
  types: () => [Level, Feature] as const,
  resolveType: (value) => {
    if ('prof_bonus' in value || 'spellcasting' in value || 'features' in value) {
      return Level
    }
    if ('subclass' in value || 'feature_specific' in value || 'prerequisites' in value) {
      return Feature
    }

    console.warn('Could not reliably resolve type for SubclassSpellPrerequisiteUnion:', value)
    throw new Error('Could not resolve type for SubclassSpellPrerequisiteUnion')
  }
})

// Union type for Feature.prerequisites
export const FeaturePrerequisiteUnion = createUnionType({
  name: 'FeaturePrerequisiteUnion',
  types: () => [LevelPrerequisite, FeaturePrerequisite, SpellPrerequisite] as const,
  resolveType: (value) => {
    if (value.type === 'level') {
      return LevelPrerequisite
    }
    if (value.type === 'feature') {
      return FeaturePrerequisite
    }
    if (value.type === 'spell') {
      return SpellPrerequisite
    }
    console.warn('Could not resolve type for FeaturePrerequisiteUnion:', value)
    throw new Error('Could not resolve type for FeaturePrerequisiteUnion')
  }
})

export const MonsterArmorClassUnion = createUnionType({
  name: 'MonsterArmorClass',
  types: () =>
    [
      ArmorClassDex,
      ArmorClassNatural,
      ArmorClassArmor,
      ArmorClassSpell,
      ArmorClassCondition
    ] as const,
  resolveType: (value: any) => {
    if (!value || typeof value.type !== 'string') {
      console.warn('Cannot resolve MonsterArmorClass: type field is missing or invalid', value)
      // Optionally, throw an error or return a default type if appropriate
      throw new Error('Cannot resolve MonsterArmorClass: type field is missing or invalid')
    }
    switch (value.type) {
      case 'dex':
        return ArmorClassDex
      case 'natural':
        return ArmorClassNatural
      case 'armor':
        return ArmorClassArmor
      case 'spell':
        return ArmorClassSpell
      case 'condition':
        return ArmorClassCondition
      default:
        console.warn('Could not resolve type for MonsterArmorClassUnion:', value)
        // Optionally, throw an error or return a default type if appropriate
        throw new Error(
          'Could not resolve type for MonsterArmorClassUnion: Unknown type ' + value.type
        )
    }
  }
})

export const ProficiencyChoiceItem = createUnionType({
  name: 'ProficiencyChoiceItem',
  types: () => [Proficiency, ProficiencyChoice] as const,
  resolveType: (value) => {
    if (typeof value === 'object' && 'choose' in value && 'type' in value && 'from' in value) {
      return ProficiencyChoice
    }
    return Proficiency
  }
})

export const DamageOrDamageChoiceUnion = createUnionType({
  name: 'DamageOrDamageChoice',
  types: () => [Damage, DamageChoice],
  resolveType: (value) => {
    if ('choose' in value) {
      return DamageChoice
    }
    return Damage
  }
})

export const ActionOptionUnion = createUnionType({
  name: 'ActionOptionUnion',
  types: () => [ActionChoiceOption, MultipleActionChoiceOption],
  resolveType(value) {
    if ('items' in value) {
      return MultipleActionChoiceOption
    }
    return ActionChoiceOption
  }
})
