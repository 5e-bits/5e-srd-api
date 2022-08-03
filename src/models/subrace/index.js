const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference, Choice } = require('../common');

const AbilityBonus = new Schema({
  _id: false,
  ability_score: APIReference,
  bonus: { type: Number, index: true },
});

const Subrace = new Schema({
  _id: { type: String, select: false },
  ability_bonuses: [AbilityBonus],
  desc: { type: String, index: true },
  index: { type: String, index: true },
  language_options: Choice,
  name: { type: String, index: true },
  race: APIReference,
  racial_traits: [APIReference],
  starting_proficiencies: [APIReference],
  url: { type: String, index: true },
});

module.exports = mongoose.model('Subrace', Subrace, 'subraces');
