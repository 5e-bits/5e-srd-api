const AbilityScore = require('../../models/abilityScore');
const Class = require('../../models/class');
const Equipment = require('../../models/equipment');
const EquipmentCategory = require('../../models/equipmentCategory');
const Race = require('../../models/race');
const Skill = require('../../models/skill');

const Proficiency = {
  classes: async proficiency =>
    await Class.find({ index: { $in: proficiency.classes.map(c => c.index) } }).lean(),
  races: async proficiency =>
    await Race.find({ index: { $in: proficiency.races.map(r => r.index) } }).lean(),
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
