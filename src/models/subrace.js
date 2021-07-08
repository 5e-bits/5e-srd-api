const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const AbilityBonus = {
  ability_score: APIReference,
  bonus: { type: Number, index: true },
};

const LanguageOptions = {
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
};

const Subrace = new Schema({
  _id: { type: String, select: false },
  ability_bonuses: [AbilityBonus],
  desc: { type: String, index: true },
  index: { type: String, index: true },
  language_options: LanguageOptions,
  name: { type: String, index: true },
  race: APIReference,
  racial_traits: [APIReference],
  starting_proficiencies: [APIReference],
  url: { type: String, index: true },
});

module.exports = mongoose.model('Subrace', Subrace, 'subraces');
