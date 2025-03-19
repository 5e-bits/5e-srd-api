import { resolveEquipmentType } from './common.js';

import { Equipment } from '@/models/2014/equipment/types.js';
import { EquipmentCategory } from '@/models/2014/equipmentCategory/types.js';
import { AbilityScore } from '@/models/2014/abilityScore/types.js';
import { Skill } from '@/models/2014/skill/types.js';

const ProficiencyReference = {
  __resolveType(reference: Equipment | EquipmentCategory | AbilityScore | Skill) {
    if ('cost' in reference) return resolveEquipmentType(reference);
    if ('equipment' in reference) return 'EquipmentCategory';
    if ('skills' in reference) return 'AbilityScore';
    if ('ability_score' in reference) return 'Skill';
    return null;
  },
};

export default ProficiencyReference;
