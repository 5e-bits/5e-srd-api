import SkillModel from '../../models/skill/index.js';
import { coalesceFilters, getMongoSortDirection, resolveContainsStringFilter } from './common.js';

const AbilityScoreResolver = {
  skills: async (abilityScore, args) => {
    const filters = [{ index: { $in: abilityScore.skills.map(s => s.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    const sort = {};
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await SkillModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
};

export default AbilityScoreResolver;
