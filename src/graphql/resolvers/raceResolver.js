const AbilityScore = require('../../models/abilityScore');
const Language = require('../../models/language');
const Proficiency = require('../../models/proficiency');
const Subrace = require('../../models/subrace');
const Trait = require('../../models/trait');

const Race = {
  ability_bonuses: async race => {
    const abilityBonuses = race.ability_bonuses;
    const abilityScores = await AbilityScore.find({
      index: { $in: abilityBonuses.map(ab => ab.ability_score.index) },
    }).lean();

    return abilityBonuses.map(ab => ({
      ...ab,
      ability_score: abilityScores.find(as => as.index === ab.ability_score.index),
    }));
  },
  languages: async race =>
    await Language.find({ index: { $in: race.languages.map(l => l.index) } }).lean(),
  size: race => race.size.toUpperCase(),
  starting_proficiencies: async race =>
    await Proficiency.find({
      index: { $in: race.starting_proficiencies.map(p => p.index) },
    }).lean(),
  subraces: async race =>
    await Subrace.find({ index: { $in: race.subraces.map(s => s.index) } }).lean(),
  traits: async race => await Trait.find({ index: { $in: race.traits.map(t => t.index) } }).lean(),
};

module.exports = Race;
