import { createUnionType } from 'type-graphql'

import { ProficiencyChoice } from '@/graphql/2014/common/choiceTypes'
import { MagicItem } from '@/models/2014/magicItem'
import { Proficiency } from '@/models/2014/proficiency'

import { Ammunition, Armor, Gear, Pack, Tool, Vehicle, Weapon } from './equipmentTypes'

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
  types: () => {
    return [Armor, Weapon, Tool, Gear, Pack, Ammunition, Vehicle, MagicItem] as const
  },
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
  types: () => {
    return [Armor, Weapon, Tool, Gear, Pack, Ammunition, Vehicle] as const
  },
  resolveType: (value) => {
    const equipmentType = resolveEquipmentType(value)
    if (equipmentType) {
      return equipmentType
    }

    console.warn('Could not resolve type for AnyEquipment:', value)
    return Gear
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
