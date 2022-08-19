import AbilityScoreModel from '../../models/abilityScore/index.js';
import ClassModel from '../../models/class/index.js';
import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import EquipmentModel from '../../models/equipment/index.js';
import RaceModel from '../../models/race/index.js';
import SkillModel from '../../models/skill/index.js';
import SubraceModel from '../../models/subrace/index.js';
import { coalesceFilters, resolveContainsStringFilter } from './common.js';

const Proficiency = {
  classes: async (proficiency, args) => {
    const filters = [{ index: { $in: proficiency.classes.map(c => c.index) } }];

    if (args.name) {
      const filter = resolveContainsStringFilter(args.name);
      filters.push(filter);
    }

    return await ClassModel.find(coalesceFilters(filters)).lean();
  },
  races: async (proficiency, args) => {
    const races = [];
    for (const { url, index } of proficiency.races) {
      const filters = [{ index }];

      if (args.name) {
        const filter = resolveContainsStringFilter(args.name);
        filters.push(filter);
      }

      if (url.includes('subrace')) {
        races.push(await SubraceModel.findOne(coalesceFilters(filters)).lean());
      } else {
        races.push(await RaceModel.findOne(coalesceFilters(filters)).lean());
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
      .replace(/'/g, '')
      .replace(/\s+/g, '_'),
};

export default Proficiency;
