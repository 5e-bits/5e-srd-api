const RuleSection = require('../../models/ruleSection');

const Rule = {
  subsections: async rule =>
    await RuleSection.find({ index: { $in: rule.subsections.map(r => r.index) } }).lean(),
};

module.exports = Rule;
