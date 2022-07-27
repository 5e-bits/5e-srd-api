import { resolveEquipmentType } from './common.js';

const ProficiencyReference = {
  __resolveType(reference) {
    if (reference.cost) return resolveEquipmentType(reference);
    if (reference.equipment) return 'EquipmentCategory';
    if (reference.skills) return 'AbilityScore';
    if (reference.ability_score) return 'Skill';
    return null;
  },
};

export default ProficiencyReference;
