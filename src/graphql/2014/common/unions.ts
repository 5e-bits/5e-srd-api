import { createUnionType } from 'type-graphql'
import { MagicItem } from '@/models/2014/magicItem'
import { Level } from '@/models/2014/level'
import { Feature } from '@/models/2014/feature'
import { LevelPrerequisite, FeaturePrerequisite, SpellPrerequisite } from '@/models/2014/feature'
import { Armor, Weapon, Tool, Gear, Pack, Ammunition, Vehicle } from './equipmentTypes'
import { Proficiency } from '@/models/2014/proficiency'
import { ProficiencyChoice } from '@/graphql/2014/common/choiceTypes'

function resolveEquipmentType(
  value: any
):
  | typeof Armor
  | typeof Weapon
  | typeof Tool
  | typeof Gear
  | typeof Pack
  | typeof Ammunition
  | typeof Vehicle
  | null {
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

    const equipmentType = resolveEquipmentType(value)
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
    const equipmentType = resolveEquipmentType(value)
    if (equipmentType) {
      return equipmentType
    }

    console.warn('Could not resolve type for AnyEquipment:', value)
    return Gear
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
