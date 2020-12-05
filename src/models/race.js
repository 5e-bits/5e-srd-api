const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RaceAbilityBonusOptionFromAbilityScore = new Schema({
  index: String,
  name: String,
  url: String,
});

const RaceAbilityBonusOptionFrom = new Schema({
  ability_score: RaceAbilityBonusOptionFromAbilityScore,
  bonus: Number,
});

const RaceAbilityBonusOption = new Schema({
  choose: Number,
  from: [RaceAbilityBonusOptionFrom],
  type: String,
});

const RaceAbilityBonuseAbilityScore = new Schema({
  index: String,
  name: String,
  url: String,
});

const RaceAbilityBonus = new Schema({
  ability_score: RaceAbilityBonuseAbilityScore,
  bonus: Number,
});

const RaceLanguageOptionFrom = new Schema({
  index: String,
  name: String,
  url: String,
});

const RaceLanguageOption = new Schema({
  choose: Number,
  from: [RaceLanguageOptionFrom],
  type: String,
});

const RaceLanguage = new Schema({
  index: String,
  name: String,
  url: String,
});

const RaceStartingProficiencyOptionFrom = new Schema({
  index: String,
  name: String,
  url: String,
});

const RaceStartingProficiencyOption = new Schema({
  choose: Number,
  from: [RaceStartingProficiencyOptionFrom],
  type: String,
});

const RaceStartingProficiency = new Schema({
  index: String,
  name: String,
  url: String,
});

const RaceSubrace = new Schema({
  index: String,
  name: String,
  url: String,
});

const RaceTraitOptionFrom = new Schema({
  index: String,
  name: String,
  url: String,
});

const RaceTraitOption = new Schema({
  choose: Number,
  from: [RaceTraitOptionFrom],
  type: String,
});

const RaceTrait = new Schema({
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
