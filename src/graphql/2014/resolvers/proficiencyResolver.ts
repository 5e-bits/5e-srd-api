import AbilityScoreModel from '@/models/2014/abilityScore';
import ClassModel from '@/models/2014/class';
import EquipmentCategoryModel from '@/models/2014/equipmentCategory';
import EquipmentModel from '@/models/2014/equipment';
import RaceModel from '@/models/2014/race';
import SkillModel from '@/models/2014/skill';
import SubraceModel from '@/models/2014/subrace';
import { coalesceFilters, resolveContainsStringFilter, QueryParams } from './common';

import { Proficiency } from '@/models/2014/proficiency';

const ProficiencyResolver = {
  classes: async (proficiency: Proficiency, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: proficiency.classes?.map((c) => c.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await ClassModel.find(coalesceFilters(filters)).lean();
  },
  races: async (proficiency: Proficiency, args: QueryParams) => {
    const races = [];
    for (const { url, index } of proficiency.races?.map((r) => r) || []) {
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
    proficiency.type.toUpperCase().replace(/'/g, '').replace(/\s+/g, '_'),
};

export default ProficiencyResolver;
