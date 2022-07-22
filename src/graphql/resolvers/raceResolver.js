import AbilityScoreModel from '../../models/abilityScore';
import LanguageModel from '../../models/language';
import ProficiencyModel from '../../models/proficiency';
import SubraceModel from '../../models/subrace';
import TraitModel from '../../models/trait';

const Race = {
  ability_bonuses: async race => {
    const abilityBonuses = race.ability_bonuses;
    const abilityScores = await AbilityScoreModel.find({
      index: { $in: abilityBonuses.map(ab => ab.ability_score.index) },
    }).lean();

    return abilityBonuses.map(ab => ({
      ...ab,
      ability_score: abilityScores.find(as => as.index === ab.ability_score.index),
    }));
  },
  languages: async race =>
    await LanguageModel.find({ index: { $in: race.languages.map(l => l.index) } }).lean(),
  size: race => race.size.toUpperCase(),
  starting_proficiencies: async race =>
    await ProficiencyModel.find({
      index: { $in: race.starting_proficiencies.map(p => p.index) },
    }).lean(),
  subraces: async race =>
    await SubraceModel.find({ index: { $in: race.subraces.map(s => s.index) } }).lean(),
  traits: async race =>
    await TraitModel.find({ index: { $in: race.traits.map(t => t.index) } }).lean(),
  ability_bonus_options: async race => {
    if (!race.ability_bonus_options) {
      return null;
    }

    return {
      ...race.ability_bonus_options,
      from: {
        ...race.ability_bonus_options.from,
        options: race.ability_bonus_options.from.options.map(async option => ({
          ...option,
          ability_score: await AbilityScoreModel.findOne({ index: option.ability_score.index }),
        })),
      },
    };
  },
  language_options: async race => {
    if (!race.language_options) {
      return null;
    }

    return {
      ...race.language_options,
      from: {
        ...race.language_options.from,
        options: race.language_options.from.options.map(async option => ({
          ...option,
          item: await LanguageModel.findOne({ index: option.item.index }).lean(),
        })),
      },
    };
  },
  starting_proficiency_options: async race => {
    if (!race.starting_proficiency_options) {
      return null;
    }

    return {
      ...race.starting_proficiency_options,
      from: {
        ...race.starting_proficiency_options.from,
        options: race.starting_proficiency_options.from.options.map(async option => ({
          ...option,
          item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
        })),
      },
    };
  },
};

export default Race;
