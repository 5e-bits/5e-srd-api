import RuleSectionModel from '../../models/ruleSection';

const Rule = {
  subsections: async rule =>
    await RuleSectionModel.find({ index: { $in: rule.subsections.map(r => r.index) } }).lean(),
};

export default Rule;
