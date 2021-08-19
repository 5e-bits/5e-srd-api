const { resolveEquipmentType } = require('./common');

const ProficiencyReference = {
  __resolveType(reference) {
    if (reference.cost) return resolveEquipmentType(reference);
    if (reference.equipment) return 'EquipmentCategory';
    if (reference.skills) return 'AbilityScore';
    if (reference.ability_score) return 'Skill';
    return null;
  },
};

module.exports = ProficiencyReference;
