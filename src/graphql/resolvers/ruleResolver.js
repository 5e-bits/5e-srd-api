import RuleSectionModel from '../../models/ruleSection/index.js';
import { coalesceFilters, resolveContainsStringFilter } from './common.js';

const Rule = {
  subsections: async (rule, args) => {
    const filters = [
      {
        index: { $in: rule.subsections.map(r => r.index) },
      },
    ];

    if (args.name) {
      const filter = resolveContainsStringFilter(args.name);
      filters.push(filter);
    }

    return await RuleSectionModel.find(coalesceFilters(filters)).lean();
  },
};

export default Rule;
