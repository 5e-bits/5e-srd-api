import AbilityScoreModel from '../../models/abilityScore';
import LanguageModel from '../../models/language';
import ProficiencyModel from '../../models/proficiency';
import RaceModel from '../../models/race';
import TraitModel from '../../models/trait';

const Subrace = {
  ability_bonuses: async subrace => {
    const abilityBonuses = subrace.ability_bonuses;
    const abilityScores = await AbilityScoreModel.find({
      index: { $in: abilityBonuses.map(ab => ab.ability_score.index) },
    }).lean();

    return abilityBonuses.map(ab => ({
      ...ab,
      ability_score: abilityScores.find(as => as.index === ab.ability_score.index),
    }));
  },
  race: async subrace => await RaceModel.findOne({ index: subrace.race.index }).lean(),
  racial_traits: async subrace =>
    await TraitModel.find({ index: { $in: subrace.racial_traits.map(t => t.index) } }).lean(),
  starting_proficiencies: async subrace =>
    await ProficiencyModel.find({
      index: { $in: subrace.starting_proficiencies.map(p => p.index) },
    }).lean(),
  language_options: async subrace => {
    if (!subrace.language_options) {
      return null;
    }

    return {
      ...subrace.language_options,
      from: {
        ...subrace.language_options.from,
        options: subrace.language_options.from.options.map(async option => ({
          ...option,
          item: await LanguageModel.findOne({ index: option.item.index }).lean(),
        })),
      },
    };
  },
};

export default Subrace;
