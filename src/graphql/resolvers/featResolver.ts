import AbilityScoreModel from '../../models/abilityScore/index.js';

import { Feat } from '../../models/feat/types';

const Feat = {
  prerequisites: async (feat: Feat) => {
    const prerequisites = feat.prerequisites;
    const abilityScores = await AbilityScoreModel.find({
      index: { $in: prerequisites.map(p => p.ability_score.index) },
    }).lean();

    return prerequisites.map(async p => ({
      ...p,
      ability_score: abilityScores.find(as => as.index === p.ability_score.index),
    }));
  },
};

export default Feat;
