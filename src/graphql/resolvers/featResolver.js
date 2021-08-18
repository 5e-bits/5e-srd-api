const AbilityScore = require('../../models/abilityScore');

const Feat = {
  prerequisites: async feat =>
    feat.prerequisites.map(async p => ({
      ...p,
      ability_score: await AbilityScore.findOne({ index: p.ability_score.index }).lean(),
    })),
};

module.exports = Feat;
