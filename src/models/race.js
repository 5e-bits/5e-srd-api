const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const RaceAbilityBonusOptionFrom = new Schema({
  _id: false,
  ability_score: NamedAPIResource,
  bonus: Number,
});

const RaceAbilityBonusOption = new Schema({
  _id: false,
  choose: Number,
  from: [RaceAbilityBonusOptionFrom],
  type: String,
});

const RaceAbilityBonus = new Schema({
  _id: false,
  ability_score: NamedAPIResource,
  bonus: Number,
});

const RaceLanguageOption = new Schema({
  _id: false,
  choose: Number,
  from: [NamedAPIResource],
  type: String,
});

const RaceStartingProficiencyOption = new Schema({
  _id: false,
  choose: Number,
  from: [NamedAPIResource],
  type: String,
});

const RaceTraitOption = new Schema({
  _id: false,
  choose: Number,
  from: [NamedAPIResource],
  type: String,
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
  languages: [NamedAPIResource],
  name: String,
  size: String,
  size_description: String,
  speed: Number,
  starting_proficiencies: [NamedAPIResource],
  starting_proficiency_options: RaceStartingProficiencyOption,
  subraces: [NamedAPIResource],
  trait_options: RaceTraitOption,
  traits: [NamedAPIResource],
  url: String,
});

module.exports = mongoose.model('Race', Race, 'races');
