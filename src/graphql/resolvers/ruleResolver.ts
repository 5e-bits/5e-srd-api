import RuleSectionModel from '../../models/ruleSection/index.js';
import { coalesceFilters, resolveContainsStringFilter } from './common.js';
import { Rule } from '../../models/rule/types';

type Args = {
  name?: string;
  order_direction?: string;
};
const Rule = {
  subsections: async (rule: Rule, args: Args) => {
    const filters: any[] = [
      {
        index: { $in: rule.subsections.map(r => r.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await RuleSectionModel.find(coalesceFilters(filters)).lean();
  },
};

export default Rule;
