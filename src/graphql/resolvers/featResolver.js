const AbilityScore = require('../../models/abilityScore');

const Feat = {
  prerequisites: async feat => {
    const prerequisites = feat.prerequisites;
    const abilityScores = await AbilityScore.find({
      index: { $in: prerequisites.map(p => p.ability_score.index) },
    }).lean();

    return prerequisites.map(async p => ({
      ...p,
      ability_score: abilityScores.find(as => as.index === p.ability_score.index),
    }));
  },
};

module.exports = Feat;
