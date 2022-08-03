import RuleSectionModel from '../../models/ruleSection/index.js';

const Rule = {
  subsections: async rule =>
    await RuleSectionModel.find({ index: { $in: rule.subsections.map(r => r.index) } }).lean(),
};

export default Rule;
