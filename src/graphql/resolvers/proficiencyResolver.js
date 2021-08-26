const AbilityScore = require('../../models/abilityScore');
const Equipment = require('../../models/equipment');
const EquipmentCategory = require('../../models/equipmentCategory');
const Skill = require('../../models/skill');

const Proficiency = {
  reference: async proficiency => {
    const { url } = proficiency.reference;

    if (url.includes('ability-scores')) return await AbilityScore.findOne({ url }).lean();
    if (url.includes('equipment-categories'))
      return await EquipmentCategory.findOne({ url }).lean();
    if (url.includes('equipment')) return await Equipment.findOne({ url }).lean();
    if (url.includes('skills')) return await Skill.findOne({ url }).lean();
  },
};

module.exports = Proficiency;
