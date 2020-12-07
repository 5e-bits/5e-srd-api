const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubraceAbilityBonusAbilityScore = new Schema({
  index: String,
  name: String,
  url: String,
});

const SubraceAbilityBonus = new Schema({
  ability_score: SubraceAbilityBonusAbilityScore,
  bonus: Number,
});

const SubraceLanguageOptionFrom = new Schema({
  index: String,
  name: String,
  url: String,
});

const SubraceLanguageOption = new Schema({
  choose: Number,
  from: [SubraceLanguageOptionFrom],
  type: String,
});

const SubraceRace = new Schema({
  index: String,
  name: String,
  url: String,
});

const SubraceRacialTrait = new Schema({
  index: String,
  name: String,
  url: String,
});

const SubraceRacialTraitOptionFrom = new Schema({
  index: String,
  name: String,
  url: String,
});

const SubraceRacialTraitOption = new Schema({
  choose: Number,
  from: [SubraceRacialTraitOptionFrom],
  type: String,
});

const SubraceStartingProficiency = new Schema({
  index: String,
  name: String,
  url: String,
});

const Subrace = new Schema({
  _id: {
    type: String,
    select: false,
  },
  ability_bonuses: [SubraceAbilityBonus],
  desc: String,
  index: String,
  language_options: SubraceLanguageOption,
  name: String,
  race: SubraceRace,
  racial_trait_options: SubraceRacialTraitOption,
  racial_traits: [SubraceRacialTrait],
  starting_proficiencies: [SubraceStartingProficiency],
  url: String,
});

module.exports = mongoose.model('Subrace', Subrace, 'subraces');
