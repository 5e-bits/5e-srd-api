import SkillModel from '../../../models/2014/skill/index.js';
import {
  coalesceFilters,
  getMongoSortDirection,
  resolveContainsStringFilter,
  SortQuery,
  QueryParams,
} from './common.js';
import { AbilityScore } from '../../../models/2014/abilityScore/types.js';

const AbilityScoreResolver = {
  skills: async (abilityScore: AbilityScore, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: abilityScore.skills.map((s) => s.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    const sort: SortQuery = {};
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await SkillModel.find(coalesceFilters(filters)).sort(sort).lean();
  },
};

export default AbilityScoreResolver;
