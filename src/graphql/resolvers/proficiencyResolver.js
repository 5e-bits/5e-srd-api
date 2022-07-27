import AbilityScoreModel from '../../models/abilityScore/index.js';
import ClassModel from '../../models/class/index.js';
import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import EquipmentModel from '../../models/equipment/index.js';
import RaceModel from '../../models/race/index.js';
import SkillModel from '../../models/skill/index.js';
import SubraceModel from '../../models/subrace/index.js';

const Proficiency = {
  classes: async proficiency =>
    await ClassModel.find({ index: { $in: proficiency.classes.map(c => c.index) } }).lean(),
  races: async proficiency => {
    const races = [];
    for (const { url, index } of proficiency.races) {
      if (url.includes('subrace')) {
        races.push(await SubraceModel.findOne({ index: index }).lean());
      } else {
        races.push(await RaceModel.findOne({ index: index }).lean());
      }
    }

    return races;
  },
  reference: async proficiency => {
    const { url } = proficiency.reference;

    if (url.includes('ability-scores')) return await AbilityScoreModel.findOne({ url }).lean();
    if (url.includes('equipment-categories'))
      return await EquipmentCategoryModel.findOne({ url }).lean();
    if (url.includes('equipment')) return await EquipmentModel.findOne({ url }).lean();
    if (url.includes('skills')) return await SkillModel.findOne({ url }).lean();
  },
  type: proficiency =>
    proficiency.type
      .toUpperCase()
      .replace("'", '')
      .replace(' ', '_'),
};

export default Proficiency;
