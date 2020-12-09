const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const AbilityBonusOption = new Schema({
  _id: false,
  ability_score: APIReference,
  bonus: Number,
});

const RaceAbilityBonusOptions = new Schema({
  _id: false,
  choose: Number,
  from: [AbilityBonusOption],
  type: String,
});

const RaceAbilityBonus = new Schema({
  _id: false,
  ability_score: APIReference,
  bonus: Number,
});

const LanguageOptions = new Schema({
  _id: false,
  choose: Number,
  from: [APIReference],
  type: String,
});

const StartingProficiencyOptions = new Schema({
  _id: false,
  choose: Number,
  from: [APIReference],
  type: String,
});

const TraitOptions = new Schema({
  _id: false,
  choose: Number,
  from: [APIReference],
  type: String,
});

const Race = new Schema({
  _id: {
    type: String,
    select: false,
  },
  ability_bonus_options: RaceAbilityBonusOptions,
  ability_bonuses: [RaceAbilityBonus],
  age: String,
  alignment: String,
  index: String,
  language_desc: String,
  language_options: LanguageOptions,
  languages: [APIReference],
  name: String,
  size: String,
  size_description: String,
  speed: Number,
  starting_proficiencies: [APIReference],
  starting_proficiency_options: StartingProficiencyOptions,
  subraces: [APIReference],
  trait_options: TraitOptions,
  traits: [APIReference],
  url: String,
});

module.exports = mongoose.model('Race', Race, 'races');
