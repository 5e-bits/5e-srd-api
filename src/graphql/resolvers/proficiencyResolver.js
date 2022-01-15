const AbilityScore = require('../../models/abilityScore');
const Class = require('../../models/class');
const Equipment = require('../../models/equipment');
const EquipmentCategory = require('../../models/equipmentCategory');
const Race = require('../../models/race');
const Skill = require('../../models/skill');
const Subrace = require('../../models/subrace');

const Proficiency = {
  classes: async proficiency =>
    await Class.find({ index: { $in: proficiency.classes.map(c => c.index) } }).lean(),
  races: async proficiency => {
    const races = [];
    for (const { url, index } of proficiency.races) {
      if (url.includes('subrace')) {
        races.push(await Subrace.findOne({ index: index }).lean());
      } else {
        races.push(await Race.findOne({ index: index }).lean());
      }
    }

    return races;
  },
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
