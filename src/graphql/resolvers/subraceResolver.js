const AbilityScore = require('../../models/abilityScore');
const Proficiency = require('../../models/proficiency');
const Race = require('../../models/race');
const Trait = require('../../models/trait');

const Subrace = {
  ability_bonuses: async subrace => {
    const abilityBonuses = subrace.ability_bonuses;
    const abilityScores = await AbilityScore.find({
      index: { $in: abilityBonuses.map(ab => ab.ability_score.index) },
    }).lean();

    return abilityBonuses.map(ab => ({
      ...ab,
      ability_score: abilityScores.find(as => as.index === ab.ability_score.index),
    }));
  },
  race: async subrace => await Race.findOne({ index: subrace.race.index }).lean(),
  racial_traits: async subrace =>
    await Trait.find({ index: { $in: subrace.racial_traits.map(t => t.index) } }).lean(),
  starting_proficiencies: async subrace =>
    await Proficiency.find({
      index: { $in: subrace.starting_proficiencies.map(p => p.index) },
    }).lean(),
};

module.exports = Subrace;
