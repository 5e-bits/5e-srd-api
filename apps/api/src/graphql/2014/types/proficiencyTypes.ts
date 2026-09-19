import { createUnionType } from 'type-graphql'

import { AbilityScore } from '@/models/2014/abilityScore'
import { Equipment } from '@/models/2014/equipment'
import { EquipmentCategory } from '@/models/2014/equipmentCategory'
import { Skill } from '@/models/2014/skill'

export const ProficiencyReference = createUnionType({
  name: 'ProficiencyReference',
  types: () => [Equipment, EquipmentCategory, AbilityScore, Skill] as const,
  resolveType: (value) => {
    if ('equipment' in value) {
      return EquipmentCategory
    }
    if ('full_name' in value) {
      return AbilityScore
    }
    if ('desc' in value && Array.isArray(value.desc)) {
      return Skill
    }
    return Equipment
  }
})
