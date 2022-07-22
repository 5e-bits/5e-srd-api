import AbilityScoreModel from '../../models/abilityScore';
import ClassModel from '../../models/class';
import EquipmentCategoryModel from '../../models/equipmentCategory';
import EquipmentModel from '../../models/equipment';
import RaceModel from '../../models/race';
import SkillModel from '../../models/skill';
import SubraceModel from '../../models/subrace';

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
