import RuleSectionModel from '../../models/ruleSection/index.js';
import { coalesceFilters, resolveContainsStringFilter, QueryParams } from './common.js';
import { Rule } from '../../models/rule/types';

const Rule = {
  subsections: async (rule: Rule, args: QueryParams) => {
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
