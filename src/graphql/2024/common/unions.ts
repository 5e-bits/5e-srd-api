import { createUnionType } from 'type-graphql'

import { APIReference } from '@/models/common/apiReference'

import { Ammunition, AdventuringGear, Weapon } from './equipmentTypes'

function resolveEquipmentType(
  value: any
): typeof Weapon | typeof AdventuringGear | typeof Ammunition | null {
  if (
    value.equipment_categories?.some((category: APIReference) => category.index === 'weapon') ===
    true
  ) {
    return Weapon
  }
  if (
    value.equipment_categories?.some(
      (category: APIReference) => category.index === 'ammunition'
    ) === true
  ) {
    return Ammunition
  }
  if (
    value.equipment_categories?.some(
      (category: APIReference) => category.index === 'adventuring-gear'
    ) === true
  ) {
    return AdventuringGear
  }
  return null
}

export const AnyEquipment = createUnionType({
  name: 'AnyEquipment',
  types: () => {
    return [Weapon, AdventuringGear, Ammunition] as const
  },
  resolveType: (value) => {
    const equipmentType = resolveEquipmentType(value)
    if (equipmentType) {
      return equipmentType
    }

    console.warn('Could not resolve type for AnyEquipment:', value)
    return AdventuringGear
  }
})
