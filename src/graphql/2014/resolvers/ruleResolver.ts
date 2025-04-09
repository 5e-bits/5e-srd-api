import RuleSectionModel from '@/models/2014/ruleSection/index.js';
import { coalesceFilters, resolveContainsStringFilter, QueryParams } from './common.js';
import { Rule } from '@/models/2014/rule/index.js';
import { APIReference } from '@/models/2014/common/index.js';

const RuleResolver = {
  subsections: async (rule: Rule, args: QueryParams) => {
    const filters: any[] = [
      {
        index: { $in: rule.subsections.map((r: APIReference) => r.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await RuleSectionModel.find(coalesceFilters(filters)).lean();
  },
};

export default RuleResolver;
