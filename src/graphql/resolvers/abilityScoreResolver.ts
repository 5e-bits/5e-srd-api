import SkillModel from '../../models/skill/index.js';
import { coalesceFilters, getMongoSortDirection, resolveContainsStringFilter } from './common.js';
import { AbilityScore } from '../../models/abilityScore/types';

type SortParams = Record<string, 1 | -1>;
type Args = {
  name?: string;
  order_direction?: string;
};

const AbilityScoreResolver = {
  skills: async (abilityScore: AbilityScore, args: Args) => {
    const filters: any[] = [{ index: { $in: abilityScore.skills?.map(s => s.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    const sort: SortParams = {};
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await SkillModel.find(coalesceFilters(filters))
      .sort(sort)
      .lean();
  },
};

export default AbilityScoreResolver;
