const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const AbilityBonus = new Schema({
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

const RacialTraitOptions = new Schema({
  _id: false,
  choose: Number,
  from: [APIReference],
  type: String,
});

const Subrace = new Schema({
  _id: {
    type: String,
    select: false,
  },
  ability_bonuses: [AbilityBonus],
  desc: String,
  index: String,
  language_options: LanguageOptions,
  name: String,
  race: APIReference,
  racial_trait_options: RacialTraitOptions,
  racial_traits: [APIReference],
  starting_proficiencies: [APIReference],
  url: String,
});

module.exports = mongoose.model('Subrace', Subrace, 'subraces');
