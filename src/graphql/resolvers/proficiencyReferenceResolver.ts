import { resolveEquipmentType } from './common.js';

import { Equipment } from '../../models/equipment/types';
import { EquipmentCategory } from '../../models/equipmentCategory/types';
import { AbilityScore } from '../../models/abilityScore/types';
import { Skill } from '../../models/skill/types';

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
