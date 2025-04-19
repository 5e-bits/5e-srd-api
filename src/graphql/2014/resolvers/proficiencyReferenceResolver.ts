import { resolveEquipmentType } from './common'

import { Equipment } from '@/models/2014/equipment'
import { EquipmentCategory } from '@/models/2014/equipmentCategory'
import { AbilityScore } from '@/models/2014/abilityScore'
import { Skill } from '@/models/2014/skill'

const ProficiencyReferenceResolver = {
  __resolveType(reference: Equipment | EquipmentCategory | AbilityScore | Skill) {
    if ('cost' in reference) return resolveEquipmentType(reference)
    if ('equipment' in reference) return 'EquipmentCategory'
    if ('skills' in reference) return 'AbilityScore'
    if ('ability_score' in reference) return 'Skill'
    return null
  }
}

export default ProficiencyReferenceResolver
