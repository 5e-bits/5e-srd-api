import AbilityScoreModel from '../../models/abilityScore/index.js';
import ClassModel from '../../models/class/index.js';
import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import EquipmentModel from '../../models/equipment/index.js';
import RaceModel from '../../models/race/index.js';
import SkillModel from '../../models/skill/index.js';
import SubraceModel from '../../models/subrace/index.js';
import { coalesceFilters, resolveContainsStringFilter, QueryParams } from './common.js';

import { Proficiency } from '../../models/proficiency/types';

const Proficiency = {
  classes: async (proficiency: Proficiency, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: proficiency.classes?.map(c => c.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await ClassModel.find(coalesceFilters(filters)).lean();
  },
  races: async (proficiency: Proficiency, args: QueryParams) => {
    const races = [];
    for (const { url, index } of proficiency.races?.map(r => r) || []) {
      const filters: any[] = [{ index }];

      if (args.name) {
        filters.push(resolveContainsStringFilter(args.name));
      }

      if (url.includes('subrace')) {
        races.push(await SubraceModel.findOne(coalesceFilters(filters)).lean());
      } else {
        races.push(await RaceModel.findOne(coalesceFilters(filters)).lean());
      }
    }

    return races;
  },
  reference: async (proficiency: Proficiency) => {
    const { url } = proficiency.reference;

    if (url.includes('ability-scores')) return await AbilityScoreModel.findOne({ url }).lean();
    if (url.includes('equipment-categories'))
      return await EquipmentCategoryModel.findOne({ url }).lean();
    if (url.includes('equipment')) return await EquipmentModel.findOne({ url }).lean();
    if (url.includes('skills')) return await SkillModel.findOne({ url }).lean();
  },
  type: (proficiency: Proficiency) =>
    proficiency.type
      .toUpperCase()
      .replace(/'/g, '')
      .replace(/\s+/g, '_'),
};

export default Proficiency;
