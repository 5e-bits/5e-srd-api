const AbilityScore = require('../../models/abilityScore');
const Equipment = require('../../models/equipment');
const EquipmentCategory = require('../../models/equipmentCategory');
const Skill = require('../../models/skill');

// TODO: Update to use references instead of reference
const Proficiency = {
  reference: async proficiency => {
    const { type, index } = proficiency.references[0];
    switch (type) {
      case 'ability-scores':
        return await AbilityScore.findOne({ index }).lean();
      case 'equipment':
        return await Equipment.findOne({ index }).lean();
      case 'equipment-categories':
        return await EquipmentCategory.findOne({ index }).lean();
      case 'skills':
        return await Skill.findOne({ index }).lean();
    }
  },
};

module.exports = Proficiency;
