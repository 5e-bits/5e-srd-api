const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference, Choice } = require('../common');

const RaceAbilityBonus = new Schema({
  _id: false,
  ability_score: APIReference,
  bonus: { type: Number, index: true },
});

const Race = new Schema({
  _id: { type: String, select: false },
  ability_bonus_options: Choice,
  ability_bonuses: [RaceAbilityBonus],
  age: { type: String, index: true },
  alignment: { type: String, index: true },
  index: { type: String, index: true },
  language_desc: { type: String, index: true },
  language_options: Choice,
  languages: [APIReference],
  name: { type: String, index: true },
  size: { type: String, index: true },
  size_description: { type: String, index: true },
  speed: { type: Number, index: true },
  starting_proficiencies: [APIReference],
  starting_proficiency_options: Choice,
  subraces: [APIReference],
  traits: [APIReference],
  url: { type: String, index: true },
});

module.exports = mongoose.model('Race', Race, 'races');
