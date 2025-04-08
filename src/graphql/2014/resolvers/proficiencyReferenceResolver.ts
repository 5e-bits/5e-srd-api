import { resolveEquipmentType } from './common.js';

import { Equipment } from '@/models/2014/equipment/index.js';
import { EquipmentCategory } from '@/models/2014/equipmentCategory/index.js';
import { AbilityScore } from '@/models/2014/abilityScore/index.js';
import { Skill } from '@/models/2014/skill/index.js';

const ProficiencyReferenceResolver = {
  __resolveType(reference: Equipment | EquipmentCategory | AbilityScore | Skill) {
    if ('cost' in reference) return resolveEquipmentType(reference);
    if ('equipment' in reference) return 'EquipmentCategory';
    if ('skills' in reference) return 'AbilityScore';
    if ('ability_score' in reference) return 'Skill';
    return null;
  },
};

export default ProficiencyReferenceResolver;
