const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RaceAbilityBonusOptionFromAbilityScore = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const RaceAbilityBonusOptionFrom = new Schema({
  _id: false,
  ability_score: RaceAbilityBonusOptionFromAbilityScore,
  bonus: Number,
});

const RaceAbilityBonusOption = new Schema({
  _id: false,
  choose: Number,
  from: [RaceAbilityBonusOptionFrom],
  type: String,
});

const RaceAbilityBonusAbilityScore = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const RaceAbilityBonus = new Schema({
  _id: false,
  ability_score: RaceAbilityBonusAbilityScore,
  bonus: Number,
});

const RaceLanguageOptionFrom = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const RaceLanguageOption = new Schema({
  _id: false,
  choose: Number,
  from: [RaceLanguageOptionFrom],
  type: String,
});

const RaceLanguage = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const RaceStartingProficiencyOptionFrom = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const RaceStartingProficiencyOption = new Schema({
  _id: false,
  choose: Number,
  from: [RaceStartingProficiencyOptionFrom],
  type: String,
});

const RaceStartingProficiency = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const RaceSubrace = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const RaceTraitOptionFrom = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const RaceTraitOption = new Schema({
  _id: false,
  choose: Number,
  from: [RaceTraitOptionFrom],
  type: String,
});

const RaceTrait = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const Race = new Schema({
  _id: {
    type: String,
    select: false,
  },
  ability_bonus_options: RaceAbilityBonusOption,
  ability_bonuses: [RaceAbilityBonus],
  age: String,
  alignment: String,
  index: String,
  language_desc: String,
  language_options: RaceLanguageOption,
  languages: [RaceLanguage],
  name: String,
  size: String,
  size_description: String,
  speed: Number,
  starting_proficiencies: [RaceStartingProficiency],
  starting_proficiency_options: RaceStartingProficiencyOption,
  subraces: [RaceSubrace],
  trait_options: RaceTraitOption,
  traits: [RaceTrait],
  url: String,
});

module.exports = mongoose.model('Race', Race, 'races');
